#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from fastapi import HTTPException

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from dine_dna_engine import ENGINE_VERSION, evaluate_menu  # noqa: E402
from server import (  # noqa: E402
    OPENAI_RESPONSES_URL,
    PARSER_VERSION,
    add_coverage_notes,
    apply_ocr_coverage,
    check_budget,
    current_month,
    enrich_menu_once,
    extract_pdf_text,
    extract_response_text,
    parse_json_text,
    normalize_menu,
    record_usage,
)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "menu"


def restaurant_title(path: Path) -> str:
    title = path.stem
    title = re.sub(r"\s+-\s+menu$", "", title, flags=re.I)
    title = re.sub(r"\s+menu$", "", title, flags=re.I)
    title = title.replace("_", " ").strip()
    return title or path.stem


def existing_entries(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError:
        return []
    return data if isinstance(data, list) else []


def write_entries(path: Path, entries: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(entries, indent=2, sort_keys=True))


def likely_not_menu_text(text: str) -> bool:
    lower = text.lower()
    blockers = [
        "err_internet_disconnected",
        "err_http2_protocol_error",
        "access denied",
        "performing security verification",
        "verifying the device",
        "temporarily unavailable",
        "404: page not found",
        "you don't have permission to access",
        "why have i been blocked",
    ]
    return any(blocker in lower for blocker in blockers) and len(text) < 2500


def clean_pdf_text(text: str) -> str:
    lines = []
    skip_terms = [
        "skip to main content",
        "privacy policy",
        "terms of use",
        "manage preferences",
        "accept all",
        "reject all",
        "sign in",
        "log in",
        "find a location",
        "order pickup",
        "order delivery",
    ]
    for raw_line in text.splitlines():
        line = " ".join(raw_line.split())
        if len(line) < 2:
            continue
        lower = line.lower()
        if any(term in lower for term in skip_terms):
            continue
        if re.search(r"https?://|www\.", lower):
            continue
        lines.append(line)
    return "\n".join(lines)


def fallback_prompt(title: str, filename: str, text: str) -> str:
    return f"""
You are extracting a restaurant menu for What 2 Eat from messy copied PDF or website text.

Return strict JSON only with this shape:
{{
  "restaurantName": "{title}",
  "sections": [
    {{
      "name": "Section Name",
      "items": [
        {{ "name": "Exact printed item name", "description": "Short English description from nearby text", "price": "$0.00" }}
      ]
    }}
  ],
  "restaurantNotes": []
}}

Rules:
- Extract only real orderable restaurant menu items from the text.
- Ignore web navigation, account text, cookie notices, URLs, marketing headlines, legal notices, locations, rewards, and nutrition-only table rows.
- If section headings are unclear, group items into useful sections like Burgers, Chicken, Bowls, Pizza, Pasta, Sandwiches, Sides, Drinks, Desserts, or Menu.
- Do not invent items that are not supported by the text.
- Keep descriptions short. If no description is nearby, use an empty string.
- If prices are not visible, use an empty string.
- Return at least 4 items when the text contains real menu item names.

Source filename: {filename}
Messy menu text:
{text[:18000]}
""".strip()


def call_openai_fallback(title: str, filename: str, text: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not set yet.")
    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            "input": [{"role": "user", "content": [{"type": "input_text", "text": fallback_prompt(title, filename, text)}]}],
            "temperature": 0,
            "max_output_tokens": 9000,
        },
        timeout=90,
    )
    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text[:1000])
    return parse_json_text(extract_response_text(response.json()))


def scan_pdf(path: Path) -> dict[str, Any]:
    pdf_text = extract_pdf_text(path.read_bytes())
    usage, month, spent, monthly_cap, max_per_scan = check_budget()
    if not pdf_text.strip():
        raise RuntimeError("No extractable PDF text found.")
    if likely_not_menu_text(pdf_text):
        raise RuntimeError("PDF appears to be a browser error, blocked page, or security-verification page instead of a menu.")

    filename = path.name
    title = restaurant_title(path)
    cleaned_text = clean_pdf_text(pdf_text)
    parser_used = "openai-pdf-text"
    try:
        from server import call_openai

        menu = normalize_menu(call_openai([], "", "{}", [filename], pdf_text))
    except Exception:
        menu = normalize_menu(call_openai_fallback(title, filename, cleaned_text or pdf_text))
        parser_used = "openai-pdf-text-fallback"
    estimated_charge = max_per_scan
    record_usage(usage, month, estimated_charge)

    food_enrichment = enrich_menu_once(menu)
    evaluation_source_menu, ocr_support, ocr_coverage, price_conflicts = apply_ocr_coverage(menu, pdf_text)
    evaluated_menu = add_coverage_notes(
        evaluate_menu(evaluation_source_menu, {}, food_enrichment, ocr_support),
        price_conflicts,
    )

    return {
        "sourceId": f"real-menu-{slugify(path.stem)}",
        "sourceName": title,
        "parserVersion": PARSER_VERSION,
        "engineVersion": ENGINE_VERSION,
        "parserUsed": parser_used,
        "budget": {
            "month": month,
            "monthlyCapUsd": monthly_cap,
            "estimatedSpentBeforeUsd": spent,
            "estimatedChargeUsd": estimated_charge,
        },
        "foodEnrichment": food_enrichment,
        "ocrCoverage": ocr_coverage,
        "menu": menu,
        "evaluatedMenu": evaluated_menu,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Run real AI scans for restaurant PDF menus and cache them for the UI test dropdown.")
    parser.add_argument("paths", nargs="+", help="PDF files or folders containing PDF files.")
    parser.add_argument("--output", default=str(ROOT / "data" / "test_menus.json"))
    parser.add_argument("--force", action="store_true", help="Rescan files that already have successful cache entries.")
    args = parser.parse_args()

    pdfs: list[Path] = []
    for raw in args.paths:
        path = Path(raw).expanduser()
        if path.is_dir():
            pdfs.extend(sorted(path.glob("*.pdf")))
        elif path.suffix.lower() == ".pdf":
            pdfs.append(path)

    if not pdfs:
        print("No PDF files found.", file=sys.stderr)
        return 2

    output_path = Path(args.output)
    entries = existing_entries(output_path)
    by_source_file = {entry.get("sourceFile"): entry for entry in entries if entry.get("sourceFile")}
    used_ids = {entry.get("id") for entry in entries if entry.get("id")}

    for index, pdf in enumerate(pdfs, start=1):
        source_file = str(pdf)
        existing = by_source_file.get(source_file)
        if existing and existing.get("scanPayload") and not args.force:
            print(f"[{index}/{len(pdfs)}] SKIP {pdf.name} (already cached)")
            continue

        title = restaurant_title(pdf)
        base_id = slugify(title)
        menu_id = base_id
        suffix = 2
        while menu_id in used_ids and (not existing or existing.get("id") != menu_id):
            menu_id = f"{base_id}-{suffix}"
            suffix += 1
        used_ids.add(menu_id)

        print(f"[{index}/{len(pdfs)}] SCAN {pdf.name}", flush=True)
        entry = {
            "id": menu_id,
            "title": title,
            "sourceFile": source_file,
            "scannedAt": datetime.now(timezone.utc).isoformat(),
        }
        try:
            entry["scanPayload"] = scan_pdf(pdf)
            entry["status"] = "ok"
            item_count = len(entry["scanPayload"].get("evaluatedMenu", {}).get("items", []))
            print(f"    ok: {item_count} evaluated items", flush=True)
        except HTTPException as exc:
            entry["status"] = "error"
            entry["error"] = str(exc.detail)
            print(f"    error: {exc.detail}", flush=True)
        except Exception as exc:
            entry["status"] = "error"
            entry["error"] = str(exc)
            print(f"    error: {exc}", flush=True)

        if existing:
            entries[entries.index(existing)] = entry
            by_source_file[source_file] = entry
        else:
            entries.append(entry)
            by_source_file[source_file] = entry
        write_entries(output_path, entries)

    ok_count = sum(1 for entry in entries if entry.get("scanPayload"))
    error_count = sum(1 for entry in entries if entry.get("status") == "error")
    print(f"Wrote {output_path} ({ok_count} cached, {error_count} errors)")
    return 0 if ok_count else 1


if __name__ == "__main__":
    raise SystemExit(main())
