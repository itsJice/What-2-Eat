"""Batch-run real menu PDFs through the live /api/scan-menu endpoint.

Usage:
    .venv/bin/python scripts/batch_scan_menus.py [--base http://127.0.0.1:8022] [--folder menus/archive-test]

Produces a per-file result line and a JSON report next to the folder.
Files named `not-menu--*` are negative tests: a 422 refusal counts as PASS.
"""

import argparse
import json
import time
from pathlib import Path

import requests

PROFILE = {
    "avoidFoods": ["Dairy", "Gluten / Wheat"],
    "manualAvoidFoods": ["Dairy", "Gluten / Wheat"],
    "eatingStyle": [],
    "healthNeeds": ["Avoid Shared Fryers"],
    "loveFoods": [],
    "dontLoveFoods": [],
}


def scan_pdf(base_url: str, pdf_path: Path) -> dict:
    started = time.time()
    with open(pdf_path, "rb") as handle:
        response = requests.post(
            f"{base_url}/api/scan-menu",
            files={"files": (pdf_path.name, handle, "application/pdf")},
            data={
                "ocr_text": "",
                "profile_json": json.dumps(PROFILE),
                "source_label": pdf_path.stem,
                "source_id": pdf_path.stem,
            },
            timeout=420,
        )
    elapsed = round(time.time() - started, 1)
    result = {
        "file": pdf_path.name,
        "kind": "not-menu" if pdf_path.name.startswith("not-menu--") else "menu",
        "http": response.status_code,
        "elapsedSec": elapsed,
    }
    if response.status_code == 200:
        payload = response.json()
        evaluated = payload.get("evaluatedMenu") or {}
        sections = evaluated.get("sections") or []
        items = evaluated.get("items") or []
        budget = payload.get("budget") or {}
        result.update(
            {
                "restaurantName": (payload.get("menu") or {}).get("restaurantName"),
                "parserUsed": payload.get("parserUsed"),
                "sectionCount": len(sections),
                "itemCount": len(items),
                "sectionTitles": [s.get("title") for s in sections][:8],
                "sampleItems": [i.get("name") for i in items][:6],
                "chargeUsd": budget.get("estimatedChargeUsd"),
                "tokenUsage": budget.get("tokenUsage"),
                "explanationSource": payload.get("explanationSource"),
            }
        )
    else:
        try:
            result["detail"] = response.json().get("detail", "")[:200]
        except Exception:
            result["detail"] = response.text[:200]
    # Pass criteria: menus must extract >=1 item; junk must be refused (422).
    if result["kind"] == "menu":
        result["pass"] = response.status_code == 200 and result.get("itemCount", 0) >= 1
    else:
        result["pass"] = response.status_code in (400, 422)
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://127.0.0.1:8022")
    parser.add_argument("--folder", default="menus/archive-test")
    args = parser.parse_args()

    folder = Path(args.folder)
    pdfs = sorted(folder.glob("*.pdf"))
    if not pdfs:
        raise SystemExit(f"No PDFs found in {folder}")

    health_before = requests.get(f"{args.base}/api/health", timeout=10).json()
    print(f"Server: mock={health_before.get('mockMode')} model={health_before.get('model')} "
          f"spent=${health_before.get('estimatedSpendUsd', 0):.4f} scans={health_before.get('scanCount')}")
    if health_before.get("mockMode"):
        raise SystemExit("Server is in mock mode - batch test needs live mode.")

    results = []
    for pdf_path in pdfs:
        print(f"→ {pdf_path.name} ...", flush=True)
        try:
            result = scan_pdf(args.base, pdf_path)
        except Exception as exc:
            result = {"file": pdf_path.name, "kind": "menu", "http": 0, "pass": False, "detail": str(exc)[:200]}
        status = "PASS" if result["pass"] else "FAIL"
        extra = (
            f"{result.get('sectionCount', 0)} sections / {result.get('itemCount', 0)} items, "
            f"${result.get('chargeUsd') or 0:.4f}, {result.get('elapsedSec', '?')}s"
            if result["http"] == 200
            else f"HTTP {result['http']}: {result.get('detail', '')[:120]}"
        )
        print(f"  {status} | {extra}", flush=True)
        results.append(result)

    health_after = requests.get(f"{args.base}/api/health", timeout=10).json()
    summary = {
        "passed": sum(1 for r in results if r["pass"]),
        "failed": sum(1 for r in results if not r["pass"]),
        "totalChargeUsd": round(sum(r.get("chargeUsd") or 0 for r in results), 4),
        "spendBefore": health_before.get("estimatedSpendUsd"),
        "spendAfter": health_after.get("estimatedSpendUsd"),
        "scanCountAfter": health_after.get("scanCount"),
    }
    report = {"summary": summary, "results": results}
    report_path = folder / "batch_report.json"
    report_path.write_text(json.dumps(report, indent=2))
    print(f"\n{summary['passed']} passed, {summary['failed']} failed | "
          f"total charge ${summary['totalChargeUsd']:.4f} | report: {report_path}")


if __name__ == "__main__":
    main()
