import base64
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from dine_dna_engine import ENGINE_VERSION, evaluate_menu

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - lets the server still boot before deps are installed.
    PdfReader = None


APP_DIR = Path(__file__).resolve().parent
load_dotenv(APP_DIR / ".env")

USAGE_FILE = Path(os.getenv("AI_USAGE_FILE", "/tmp/what-2-eat-ai-usage.json" if os.getenv("VERCEL") else str(APP_DIR / ".ai_usage.json")))
PARSER_VERSION = "ai-vision-budget-1"

OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
SPOONACULAR_DETECT_URL = "https://api.spoonacular.com/food/detect"
OPEN_FOOD_FACTS_PRODUCT_URL = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
TEST_MENUS_FILE = APP_DIR / "data" / "test_menus.json"
SPOONACULAR_CACHE: dict[str, dict[str, Any]] = {}
OPEN_FOOD_FACTS_CACHE: dict[str, dict[str, Any]] = {}


app = FastAPI(title="What 2 Eat AI Scan")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5191",
        "http://localhost:5191",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://127.0.0.1:8001",
        "http://localhost:8001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def money_env(name: str, default: str) -> float:
    try:
        return max(0.0, float(os.getenv(name, default)))
    except ValueError:
        return float(default)


def int_env(name: str, default: str) -> int:
    try:
        return max(1, int(os.getenv(name, default)))
    except ValueError:
        return int(default)


def current_month() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m")


def read_usage() -> dict[str, Any]:
    if not USAGE_FILE.exists():
        return {"months": {}}
    try:
        return json.loads(USAGE_FILE.read_text())
    except json.JSONDecodeError:
        return {"months": {}}


def write_usage(data: dict[str, Any]) -> None:
    USAGE_FILE.write_text(json.dumps(data, indent=2, sort_keys=True))


def check_budget() -> tuple[dict[str, Any], str, float, float, float]:
    monthly_cap = money_env("AI_MONTHLY_BUDGET_USD", "5.00")
    max_per_scan = money_env("AI_MAX_COST_PER_SCAN_USD", "0.03")
    usage = read_usage()
    month = current_month()
    month_usage = usage.setdefault("months", {}).setdefault(month, {"estimatedSpendUsd": 0.0, "scans": 0})
    spent = float(month_usage.get("estimatedSpendUsd", 0.0))
    if monthly_cap > 0 and spent + max_per_scan > monthly_cap:
        raise HTTPException(
            status_code=402,
            detail=(
                f"AI scan budget reached. This month is capped at ${monthly_cap:.2f}; "
                f"estimated spend is ${spent:.2f}."
            ),
        )
    return usage, month, spent, monthly_cap, max_per_scan


def health_payload() -> dict[str, Any]:
    usage = read_usage()
    month = current_month()
    month_usage = usage.get("months", {}).get(month, {})
    return {
        "ok": True,
        "parserVersion": PARSER_VERSION,
        "mockMode": os.getenv("AI_SCAN_MOCK", "0") == "1",
        "apiKeyPresent": bool(os.getenv("OPENAI_API_KEY")),
        "spoonacularKeyPresent": bool(os.getenv("SPOONACULAR_API_KEY")),
        "model": os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        "imageMaxOutputTokens": int_env("AI_IMAGE_MAX_OUTPUT_TOKENS", "9000"),
        "pdfMaxOutputTokens": int_env("AI_PDF_MAX_OUTPUT_TOKENS", "9000"),
        "rewriteMaxOutputTokens": int_env("AI_REWRITE_MAX_OUTPUT_TOKENS", "3500"),
        "monthlyBudgetUsd": money_env("AI_MONTHLY_BUDGET_USD", "5.00"),
        "maxCostPerScanUsd": money_env("AI_MAX_COST_PER_SCAN_USD", "0.03"),
        "currentMonth": month,
        "estimatedSpendUsd": float(month_usage.get("estimatedSpendUsd", 0.0)),
        "scanCount": int(month_usage.get("scans", 0)),
    }


def record_usage(usage: dict[str, Any], month: str, charge: float) -> None:
    month_usage = usage.setdefault("months", {}).setdefault(month, {"estimatedSpendUsd": 0.0, "scans": 0})
    month_usage["estimatedSpendUsd"] = round(float(month_usage.get("estimatedSpendUsd", 0.0)) + charge, 4)
    month_usage["scans"] = int(month_usage.get("scans", 0)) + 1
    write_usage(usage)


def extract_pdf_text(data: bytes) -> str:
    if PdfReader is None:
        return ""
    try:
        from io import BytesIO

        reader = PdfReader(BytesIO(data))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception:
        return ""


USER_DEBUG_PHRASES = [
    "OCR",
    "AI saw this",
    "needs a second look",
    "coverage did not support",
]


def strip_user_debug_text(value: str) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    if any(phrase.lower() in text.lower() for phrase in USER_DEBUG_PHRASES):
        return ""
    return text


def sanitize_user_text_fields(evaluated_menu: dict[str, Any]) -> dict[str, Any]:
    next_menu = json.loads(json.dumps(evaluated_menu))
    text_keys = ["summary"]
    list_keys = ["conflicts", "confirm", "remove", "substitutions", "notes", "instructions"]
    containers = [*next_menu.get("items", [])]
    for section in next_menu.get("sections", []):
        containers.extend(section.get("items", []))
    if next_menu.get("recommendedOrder"):
        containers.append(next_menu["recommendedOrder"])

    for item in containers:
        for key in text_keys:
            if key in item:
                item[key] = strip_user_debug_text(item.get(key))
        for key in list_keys:
            if key in item and isinstance(item.get(key), list):
                item[key] = [clean for value in item[key] if (clean := strip_user_debug_text(value))]
    return next_menu


def remove_internal_scan_fields(value: Any) -> Any:
    if isinstance(value, list):
        return [remove_internal_scan_fields(item) for item in value]
    if isinstance(value, dict):
        return {
            key: remove_internal_scan_fields(item)
            for key, item in value.items()
            if key not in {"ocrSupport"}
        }
    return value


def public_scan_coverage(coverage: dict[str, Any]) -> dict[str, Any]:
    return {
        "checked": bool(coverage.get("checked")),
        "lineCount": int(coverage.get("ocrLineCount") or coverage.get("lineCount") or 0),
        "unsupportedItemCount": int(coverage.get("unsupportedAiCount") or coverage.get("unsupportedItemCount") or 0),
        "textOnlyItemCount": int(coverage.get("ocrOnlyCount") or coverage.get("textOnlyItemCount") or 0),
        "priceConflictCount": int(coverage.get("priceConflictCount") or 0),
    }


def collect_ai_evidence(menu: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    evidence: dict[str, list[dict[str, Any]]] = {}
    for section in menu.get("sections", []):
        for item in section.get("items", []):
            name = str(item.get("name") or "").strip()
            if name:
                evidence[name] = item.get("aiEvidence") or []
    return evidence


def build_rewrite_prompt(evaluated_menu: dict[str, Any], profile: dict[str, Any]) -> str:
    compact_items = []
    for item in evaluated_menu.get("items", []):
        compact_items.append({
            "name": item.get("name"),
            "category": item.get("category"),
            "status": item.get("status"),
            "summary": item.get("summary"),
            "conflicts": item.get("conflicts") or [],
            "confirm": item.get("confirm") or [],
            "remove": item.get("remove") or [],
            "substitutions": item.get("substitutions") or [],
            "notes": item.get("notes") or [],
        })
    return f"""
Rewrite final Dine DNA menu guidance into concise customer-facing language.

Return strict JSON only:
{{
  "items": [
    {{
      "name": "Exact item name from input",
      "summary": "Short final explanation",
      "conflicts": ["Short conflict line"],
      "confirm": ["Short staff question"],
      "remove": ["Ingredient to remove"],
      "substitutions": ["Short swap instruction"],
      "notes": ["Short helpful note"]
    }}
  ],
  "recommendedOrder": {{
    "summary": "Short recommendation summary",
    "instructions": ["Short instruction"]
  }}
}}

Hard rules:
- Do not change item names.
- Do not change or mention categories, counts, scores, safety verdicts, or recommendation choice.
- Do not add new conflicts, allergens, ingredients, swaps, or staff questions.
- Do not mention OCR, PDF parsing, image coverage, AI, confidence, or scanner internals.
- Keep every sentence user-ready for a restaurant guest.
- If a field has no useful user-facing content, return an empty list for that field.

Profile context:
{json.dumps(profile)[:1200]}

Final engine output:
{json.dumps({"items": compact_items, "recommendedOrder": evaluated_menu.get("recommendedOrder")}, ensure_ascii=False)[:16000]}
""".strip()


def call_openai_explanation_rewrite(evaluated_menu: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")
    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": os.getenv("OPENAI_REWRITE_MODEL", os.getenv("OPENAI_MODEL", "gpt-4.1-mini")),
            "input": [{"role": "user", "content": [{"type": "input_text", "text": build_rewrite_prompt(evaluated_menu, profile)}]}],
            "temperature": 0,
            "max_output_tokens": int_env("AI_REWRITE_MAX_OUTPUT_TOKENS", "3500"),
        },
        timeout=45,
    )
    if response.status_code >= 400:
        raise RuntimeError(response.text[:500] or f"Rewrite failed with {response.status_code}.")
    return parse_json_text(extract_response_text(response.json()))


def apply_explanation_rewrite(evaluated_menu: dict[str, Any], rewrite: dict[str, Any]) -> dict[str, Any]:
    next_menu = json.loads(json.dumps(evaluated_menu))
    rewrites_by_name = {
        str(item.get("name") or ""): item
        for item in rewrite.get("items", [])
        if isinstance(item, dict) and str(item.get("name") or "").strip()
    }
    allowed_list_keys = ["conflicts", "confirm", "remove", "substitutions", "notes"]
    for item in next_menu.get("items", []):
        item_rewrite = rewrites_by_name.get(str(item.get("name") or ""))
        if not item_rewrite:
            continue
        summary = strip_user_debug_text(item_rewrite.get("summary"))
        if summary:
            item["summary"] = summary
        for key in allowed_list_keys:
            if isinstance(item_rewrite.get(key), list):
                item[key] = [clean for value in item_rewrite[key] if (clean := strip_user_debug_text(value))]

    by_name = {item.get("name"): item for item in next_menu.get("items", [])}
    for section in next_menu.get("sections", []):
        section["items"] = [by_name.get(item.get("name"), item) for item in section.get("items", [])]

    order_rewrite = rewrite.get("recommendedOrder") if isinstance(rewrite.get("recommendedOrder"), dict) else {}
    if next_menu.get("recommendedOrder") and order_rewrite:
        summary = strip_user_debug_text(order_rewrite.get("summary"))
        if summary:
            next_menu["recommendedOrder"]["summary"] = summary
        if isinstance(order_rewrite.get("instructions"), list):
            next_menu["recommendedOrder"]["instructions"] = [
                clean for value in order_rewrite["instructions"] if (clean := strip_user_debug_text(value))
            ]
    return next_menu


def rewrite_final_explanations(evaluated_menu: dict[str, Any], profile: dict[str, Any]) -> tuple[dict[str, Any], str]:
    sanitized = sanitize_user_text_fields(evaluated_menu)
    if os.getenv("AI_EXPLANATION_REWRITE", "1") != "1" or os.getenv("AI_SCAN_MOCK", "0") == "1":
        return sanitized, "engine"
    try:
        rewritten = apply_explanation_rewrite(sanitized, call_openai_explanation_rewrite(sanitized, profile))
        return sanitize_user_text_fields(rewritten), "ai_rewrite"
    except Exception:
        return sanitized, "engine_fallback"


def build_scan_response(
    menu: dict[str, Any],
    profile: dict[str, Any],
    source_label: str,
    source_id: str,
    parser_used: str,
    estimated_charge: float,
    month: str,
    spent: float,
    monthly_cap: float,
    ocr_text: str = "",
    pdf_text: str = "",
) -> dict[str, Any]:
    food_enrichment = enrich_menu_once(menu)
    evaluation_source_menu, ocr_support, ocr_coverage, price_conflicts = apply_ocr_coverage(menu, "\n\n".join([ocr_text, pdf_text]))
    evaluated_menu = add_coverage_notes(
        evaluate_menu(evaluation_source_menu, profile, food_enrichment, ocr_support),
        price_conflicts,
    )
    evaluated_menu, explanation_source = rewrite_final_explanations(evaluated_menu, profile)
    evaluated_menu = remove_internal_scan_fields(evaluated_menu)

    return {
        "sourceId": source_id,
        "sourceName": source_label,
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
        "scanCoverage": public_scan_coverage(ocr_coverage),
        "aiEvidence": collect_ai_evidence(menu),
        "explanationSource": explanation_source,
        "menu": menu,
        "evaluatedMenu": evaluated_menu,
    }


async def read_uploads(files: list[UploadFile]) -> dict[str, Any]:
    images = []
    filenames = []
    pdf_text_parts = []
    for file in files:
        data = await file.read()
        if not data:
            continue
        filename = file.filename or "menu-file"
        filenames.append(filename)
        content_type = file.content_type or "application/octet-stream"
        if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
            pdf_text = extract_pdf_text(data)
            if pdf_text:
                pdf_text_parts.append(f"PDF text from {filename}:\n{pdf_text}")
            continue
        images.append(
            {
                "filename": filename,
                "mime": content_type,
                "dataUrl": f"data:{content_type};base64,{base64.b64encode(data).decode('ascii')}",
            }
        )
    return {"images": images, "filenames": filenames, "pdfText": "\n\n".join(pdf_text_parts)}


def extract_response_text(payload: dict[str, Any]) -> str:
    parts: list[str] = []
    for output in payload.get("output", []):
        for content in output.get("content", []):
            text = content.get("text")
            if text:
                parts.append(text)
    if not parts and payload.get("output_text"):
        parts.append(payload["output_text"])
    return "\n".join(parts).strip()


def parse_json_text(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise HTTPException(status_code=502, detail="AI did not return JSON.")
    try:
        return json.loads(cleaned[start : end + 1])
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail="AI returned invalid JSON.") from exc


PDF_TEXT_ARTIFACT_NAMES = {
    "a nd y's s tea k": "Andy's Steak",
    "a nd y's s tea k *": "Andy's Steak*",
    "a nd y's s tea k*": "Andy's Steak*",
    "chick en c ritters ® b as k et": "Chicken Critters® Basket",
    "chick en c ritters® b as k et": "Chicken Critters® Basket",
    "country fried chicken": "Country Fried Chicken",
    "chicken critters®": "Chicken Critters®",
    "grilled bbq chicken": "Grilled BBQ Chicken",
    "chicken caesar salad": "Chicken Caesar Salad",
    "chicken critter® salad": "Chicken Critter® Salad",
    "grilled chicken salad": "Grilled Chicken Salad",
    "steakhouse filet salad*": "Steakhouse Filet Salad*",
}


def normalize_pdf_artifact_key(value: str) -> str:
    normalized = str(value or "").replace("’", "'").replace("™", "").strip()
    normalized = re.sub(r"\s+", " ", normalized)
    normalized = re.sub(r"\s+'", "'", normalized)
    normalized = re.sub(r"\s+([®*])", r"\1", normalized)
    return normalized.lower()


def looks_like_pdf_text_artifact(value: str) -> bool:
    text = str(value or "")
    words = re.findall(r"[A-Za-z]+", text)
    if not words:
        return False
    one_or_two_letter_words = sum(1 for word in words if len(word) <= 2)
    weird_case_words = sum(1 for word in words if re.search(r"[a-z][A-Z]|[A-Z][a-z]+[A-Z]", word))
    return (
        weird_case_words >= 1
        or one_or_two_letter_words >= 2
        or re.search(r"\b[A-Za-z]\s+[A-Za-z]{1,3}\s+[A-Za-z]", text) is not None
    )


def repair_pdf_artifact_spacing(value: str) -> str:
    text = str(value or "").replace("’", "'").replace("™", "").strip()
    text = re.sub(r"\s+([®*])", r"\1", text)
    tokens = re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?|[®*]|&|\d+(?:\.\d+)?|[^A-Za-z\s]", text)
    words: list[str] = []
    pending_prefix = ""
    for index, token in enumerate(tokens):
        if not re.fullmatch(r"[A-Za-z]+(?:'[A-Za-z]+)?", token):
            if pending_prefix:
                words.append(pending_prefix)
                pending_prefix = ""
            words.append(token)
            continue

        next_token = tokens[index + 1] if index + 1 < len(tokens) else ""
        is_short_prefix = len(token) <= 2 and re.fullmatch(r"[A-Za-z]+(?:'[A-Za-z]+)?", next_token or "") is not None
        if is_short_prefix:
            pending_prefix += token
            continue

        words.append(f"{pending_prefix}{token}")
        pending_prefix = ""
    if pending_prefix:
        words.append(pending_prefix)
    repaired = " ".join(words)
    repaired = re.sub(r"\s+([®*.,;:!?])", r"\1", repaired)
    repaired = re.sub(r"\s*'\s*", "'", repaired)
    repaired = re.sub(r"\s+", " ", repaired).strip()
    return repaired


def title_case_menu_name(value: str) -> str:
    text = str(value or "").lower().title()
    replacements = {
        "Bbq": "BBQ",
        "Usda": "USDA",
        "A1": "A1",
        "Mac ": "Mac ",
        " And ": " and ",
        " With ": " with ",
        " Of ": " of ",
        " The ": " the ",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = re.sub(r"\b([A-Za-z]+)'S\b", lambda match: f"{match.group(1)}'s", text)
    return text


def clean_menu_item_name(value: str) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    key = normalize_pdf_artifact_key(text)
    if key in PDF_TEXT_ARTIFACT_NAMES:
        return PDF_TEXT_ARTIFACT_NAMES[key]
    if looks_like_pdf_text_artifact(text):
        repaired = repair_pdf_artifact_spacing(text)
        repaired_key = normalize_pdf_artifact_key(repaired)
        if repaired_key in PDF_TEXT_ARTIFACT_NAMES:
            return PDF_TEXT_ARTIFACT_NAMES[repaired_key]
        return title_case_menu_name(repaired)
    return text


AI_EVIDENCE_SOURCES = {"visual", "pdf_text", "ocr", "description", "inferred"}
AI_EVIDENCE_CERTAINTY = {"high", "medium_high", "medium", "low", "supporting"}


def normalize_ai_evidence_list(item: dict[str, Any]) -> list[dict[str, str]]:
    evidence: list[dict[str, str]] = []

    for ingredient in item.get("likelyIngredients") or item.get("ingredients") or []:
        name = str(ingredient.get("name") if isinstance(ingredient, dict) else ingredient).strip()
        if not name:
            continue
        source = str(ingredient.get("source") if isinstance(ingredient, dict) else "description").strip()
        certainty = str(ingredient.get("confidence") if isinstance(ingredient, dict) else "medium").strip()
        evidence.append({
            "type": "ingredient",
            "term": name,
            "source": source if source in AI_EVIDENCE_SOURCES else "description",
            "certainty": certainty if certainty in AI_EVIDENCE_CERTAINTY else "medium",
            "message": "",
        })

    raw_risks = item.get("possibleRisks") or item.get("aiEvidence") or item.get("riskEvidence") or []
    for risk in raw_risks:
        if isinstance(risk, str):
            term = risk.strip()
            evidence.append({
                "type": "risk",
                "term": term,
                "restriction": term,
                "role": "unknown",
                "source": "inferred",
                "certainty": "medium",
                "message": "",
            })
            continue
        if not isinstance(risk, dict):
            continue
        term = str(risk.get("term") or risk.get("ingredient") or risk.get("name") or risk.get("risk") or "").strip()
        restriction = str(risk.get("restriction") or risk.get("risk") or risk.get("allergen") or term).strip()
        if not term and not restriction:
            continue
        source = str(risk.get("source") or "inferred").strip()
        certainty = str(risk.get("certainty") or risk.get("confidence") or "medium").strip()
        evidence.append({
            "type": "risk",
            "term": term or restriction,
            "restriction": restriction or term,
            "role": str(risk.get("role") or "unknown").strip() or "unknown",
            "source": source if source in AI_EVIDENCE_SOURCES else "inferred",
            "certainty": certainty if certainty in AI_EVIDENCE_CERTAINTY else "medium",
            "message": str(risk.get("message") or "").strip(),
        })

    seen = set()
    normalized = []
    for entry in evidence:
        key = (entry.get("type"), entry.get("term", "").lower(), entry.get("restriction", "").lower(), entry.get("role", "").lower())
        if key in seen:
            continue
        seen.add(key)
        normalized.append(entry)
    return normalized


def normalize_menu(menu: dict[str, Any]) -> dict[str, Any]:
    restaurant = str(menu.get("restaurantName") or "Uploaded menu").strip() or "Uploaded menu"
    sections = []
    for section in menu.get("sections", []):
        name = str(section.get("name") or "").strip()
        items = []
        for item in section.get("items", []):
            item_name = clean_menu_item_name(str(item.get("name") or "").strip())
            if len(item_name) < 2:
                continue
            normalized_item = {
                "name": item_name,
                "description": str(item.get("description") or "").strip(),
                "price": str(item.get("price") or "").strip(),
            }
            ai_evidence = normalize_ai_evidence_list(item)
            if ai_evidence:
                normalized_item["aiEvidence"] = ai_evidence
            items.append(normalized_item)
        if name and items:
            sections.append({"name": name, "items": items})

    if not sections:
        raise HTTPException(status_code=422, detail="AI could not find structured menu sections and items.")

    return {
        "restaurantName": restaurant,
        "sections": sections,
        "restaurantNotes": [str(note).strip() for note in menu.get("restaurantNotes", []) if str(note).strip()],
    }


def spoonacular_cache_key(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()[:500]


def normalize_spoonacular_annotation(annotation: dict[str, Any]) -> dict[str, str]:
    name = str(annotation.get("annotation") or "").strip()
    tag = str(annotation.get("tag") or "food").strip() or "food"
    image = str(annotation.get("image") or "").strip()
    return {"name": name, "tag": tag, "image": image}


def normalize_open_food_facts_product(product: dict[str, Any]) -> dict[str, Any]:
    nutriments = product.get("nutriments") or {}
    return {
        "code": str(product.get("code") or "").strip(),
        "name": str(product.get("product_name_en") or product.get("product_name") or "").strip(),
        "brand": str(product.get("brands") or "").strip(),
        "quantity": str(product.get("quantity") or "").strip(),
        "imageUrl": str(product.get("image_front_small_url") or product.get("image_url") or "").strip(),
        "ingredientsText": str(product.get("ingredients_text_en") or product.get("ingredients_text") or "").strip(),
        "allergens": product.get("allergens_tags") or [],
        "traces": product.get("traces_tags") or [],
        "labels": product.get("labels_tags") or [],
        "categories": product.get("categories_tags") or [],
        "nutriScore": str(product.get("nutriscore_grade") or "").strip(),
        "novaGroup": product.get("nova_group"),
        "nutriments": {
            "energyKcal100g": nutriments.get("energy-kcal_100g"),
            "sugars100g": nutriments.get("sugars_100g"),
            "salt100g": nutriments.get("salt_100g"),
            "fat100g": nutriments.get("fat_100g"),
            "proteins100g": nutriments.get("proteins_100g"),
            "carbohydrates100g": nutriments.get("carbohydrates_100g"),
        },
        "sourceUrl": str(product.get("url") or "").strip(),
    }


def call_open_food_facts(barcode: str) -> dict[str, Any]:
    clean_barcode = re.sub(r"\D", "", barcode or "")
    if not clean_barcode or len(clean_barcode) < 6:
        raise HTTPException(status_code=400, detail="Enter a valid product barcode.")

    if clean_barcode in OPEN_FOOD_FACTS_CACHE:
        return {**OPEN_FOOD_FACTS_CACHE[clean_barcode], "cached": True}

    app_name = os.getenv("OPEN_FOOD_FACTS_APP_NAME", "What2Eat")
    contact = os.getenv("OPEN_FOOD_FACTS_CONTACT", "local-development")
    user_agent = f"{app_name}/0.1 ({contact})"
    try:
        response = requests.get(
            OPEN_FOOD_FACTS_PRODUCT_URL.format(barcode=clean_barcode),
            params={
                "fields": ",".join(
                    [
                        "code",
                        "product_name",
                        "product_name_en",
                        "brands",
                        "quantity",
                        "image_front_small_url",
                        "image_url",
                        "ingredients_text",
                        "ingredients_text_en",
                        "allergens_tags",
                        "traces_tags",
                        "labels_tags",
                        "categories_tags",
                        "nutriscore_grade",
                        "nova_group",
                        "nutriments",
                        "url",
                    ]
                )
            },
            headers={"User-Agent": user_agent, "From": contact},
            timeout=20,
        )
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Open Food Facts request failed: {exc.__class__.__name__}.") from exc

    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text[:500] or "Open Food Facts lookup failed.")

    payload = response.json()
    result = {
        "ok": payload.get("status") == 1,
        "source": "open-food-facts",
        "barcode": clean_barcode,
        "cached": False,
        "message": payload.get("status_verbose") or "",
        "product": normalize_open_food_facts_product(payload.get("product") or {}) if payload.get("status") == 1 else None,
    }
    OPEN_FOOD_FACTS_CACHE[clean_barcode] = result
    return result


def call_spoonacular_detect(text: str) -> dict[str, Any]:
    api_key = os.getenv("SPOONACULAR_API_KEY")
    if not api_key:
        return {
            "ok": False,
            "source": "spoonacular",
            "configured": False,
            "annotations": [],
            "message": "SPOONACULAR_API_KEY is not set.",
        }

    normalized_text = re.sub(r"\s+", " ", text).strip()
    if not normalized_text:
        return {
            "ok": True,
            "source": "spoonacular",
            "configured": True,
            "annotations": [],
            "message": "No text provided.",
        }

    cache_key = spoonacular_cache_key(normalized_text)
    if cache_key in SPOONACULAR_CACHE:
        return {**SPOONACULAR_CACHE[cache_key], "cached": True}

    try:
        response = requests.post(
            SPOONACULAR_DETECT_URL,
            params={"apiKey": api_key},
            data={"text": normalized_text},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=20,
        )
    except requests.RequestException as exc:
        return {
            "ok": False,
            "source": "spoonacular",
            "configured": True,
            "annotations": [],
            "message": f"Spoonacular request failed: {exc.__class__.__name__}.",
        }

    if response.status_code >= 400:
        return {
            "ok": False,
            "source": "spoonacular",
            "configured": True,
            "annotations": [],
            "message": response.text[:500] or f"Spoonacular returned {response.status_code}.",
        }

    payload = response.json()
    annotations = [
        normalize_spoonacular_annotation(item)
        for item in payload.get("annotations", [])
        if str(item.get("annotation") or "").strip()
    ]
    result = {
        "ok": True,
        "source": "spoonacular",
        "configured": True,
        "cached": False,
        "annotations": annotations,
    }
    SPOONACULAR_CACHE[cache_key] = result
    return result


def menu_enrichment_text(menu: dict[str, Any]) -> str:
    lines: list[str] = []
    for section in menu.get("sections", []):
        section_name = str(section.get("name") or "").strip()
        if section_name:
            lines.append(section_name)
        for item in section.get("items", []):
            name = str(item.get("name") or "").strip()
            description = str(item.get("description") or "").strip()
            price = str(item.get("price") or "").strip()
            parts = [part for part in [name, description, price] if part]
            if parts:
                lines.append(": ".join([parts[0], " ".join(parts[1:])]) if len(parts) > 1 else parts[0])
    return "\n".join(lines)


def enrich_menu_once(menu: dict[str, Any]) -> dict[str, Any]:
    text = menu_enrichment_text(menu)
    enrichment = call_spoonacular_detect(text)
    return {
        **enrichment,
        "scope": "whole_menu",
        "requestTextLength": len(text),
    }


def parse_profile_json(profile_json: str) -> dict[str, Any]:
    try:
        parsed = json.loads(profile_json or "{}")
    except json.JSONDecodeError:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def comparison_text(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s$.'/-]", " ", str(value or "").lower())).strip()


def comparison_words(value: str) -> list[str]:
    ignored = {"and", "the", "with", "for", "your", "our", "served", "style", "side", "choice"}
    return [word for word in comparison_text(value).split() if len(word) > 2 and word not in ignored]


def extract_price(value: str) -> str:
    match = re.search(r"\$\s?\d+(?:\.\d{2})?", str(value or ""))
    return re.sub(r"\s+", "", match.group(0)) if match else ""


def ocr_line_quality(line: str) -> dict[str, Any]:
    trimmed = line.strip()
    letters = len(re.findall(r"[a-z]", trimmed, re.I))
    weird = len(re.findall(r"[^a-z0-9\s&'+.,/$()-]", trimmed, re.I))
    return {
        "letters": letters,
        "weirdRatio": weird / max(len(trimmed), 1),
        "words": trimmed.split(),
    }


def normalize_ocr_line(line: str) -> str:
    return re.sub(r"\s+", " ", str(line or "").replace("•", " ").strip())


def is_ocr_menu_item_line(line: str) -> bool:
    lower = line.lower()
    quality = ocr_line_quality(line)
    if len(line) < 4 or len(line) > 96:
        return False
    if quality["letters"] < 3 or quality["weirdRatio"] > 0.18:
        return False
    if re.fullmatch(r"[\d\s.,-]+", line):
        return False
    if re.search(r"\b(hours|phone|address|website|copyright|warning|allergen|consuming|raw|undercooked)\b", lower):
        return False
    menu_signals = [
        "burger", "cheese", "chicken", "steak", "taco", "nacho", "fries", "salad", "wrap",
        "sandwich", "egg", "bacon", "ham", "sausage", "omelet", "toast", "rice", "pasta",
        "soup", "shrimp", "fish", "sauce", "bowl", "fried", "grilled", "ravioli", "gnocchi",
    ]
    return bool(re.search(r"\$\s?\d", line)) or any(signal in lower for signal in menu_signals)


def ocr_menu_lines(ocr_text: str) -> list[str]:
    seen = set()
    lines = []
    for raw_line in str(ocr_text or "").splitlines():
        line = normalize_ocr_line(raw_line)
        key = comparison_text(line)
        if not key or key in seen:
            continue
        seen.add(key)
        if is_ocr_menu_item_line(line):
            lines.append(line)
    return lines


def score_ocr_line_against_item(line: str, item: dict[str, Any]) -> float:
    line_text = comparison_text(line)
    item_name = comparison_text(str(item.get("name") or ""))
    if not line_text or not item_name:
        return 0.0
    if line_text in item_name or item_name in line_text:
        return 1.0
    line_words = set(comparison_words(line))
    item_words = comparison_words(str(item.get("name") or ""))
    if not line_words or not item_words:
        return 0.0
    return len([word for word in item_words if word in line_words]) / len(item_words)


def apply_ocr_coverage(menu: dict[str, Any], ocr_text: str) -> tuple[dict[str, Any], dict[str, str], dict[str, Any], dict[str, str]]:
    lines = ocr_menu_lines(ocr_text)
    coverage = {
        "checked": len(lines) >= 3,
        "ocrLineCount": len(lines),
        "unsupportedAiCount": 0,
        "ocrOnlyCount": 0,
        "priceConflictCount": 0,
    }
    support: dict[str, str] = {}
    price_conflicts: dict[str, str] = {}
    if len(lines) < 3:
        for section in menu.get("sections", []):
            for item in section.get("items", []):
                support[str(item.get("name") or "")] = "unchecked"
        return menu, support, coverage, price_conflicts

    next_menu = json.loads(json.dumps(menu))
    supported_lines = set()
    all_items = [item for section in next_menu.get("sections", []) for item in section.get("items", [])]
    for item in all_items:
        best_line = ""
        best_score = 0.0
        for line in lines:
            score = score_ocr_line_against_item(line, item)
            if score > best_score:
                best_line = line
                best_score = score
        name = str(item.get("name") or "")
        if best_score >= 0.62:
            support[name] = "supported"
            supported_lines.add(best_line)
            ai_price = extract_price(str(item.get("price") or ""))
            ocr_price = extract_price(best_line)
            if ai_price and ocr_price and ai_price != ocr_price:
                coverage["priceConflictCount"] += 1
                price_conflicts[name] = f"Confirm the price; one scan pass read {ai_price}, another read {ocr_price}."
        else:
            support[name] = "unsupported"
            coverage["unsupportedAiCount"] += 1

    ocr_only = [
        line for line in lines
        if line not in supported_lines and all(score_ocr_line_against_item(line, item) < 0.62 for item in all_items)
    ][:8]
    coverage["ocrOnlyCount"] = len(ocr_only)
    return next_menu, support, coverage, price_conflicts


def add_coverage_notes(evaluated_menu: dict[str, Any], price_conflicts: dict[str, str]) -> dict[str, Any]:
    for item in evaluated_menu.get("items", []):
        name = item.get("name")
        if name in price_conflicts:
            item["confidence"] = "Low" if item.get("confidence") == "Medium" else "Medium"
            item["confirm"] = list(dict.fromkeys([*(item.get("confirm") or []), price_conflicts[name]]))
    for section in evaluated_menu.get("sections", []):
        by_name = {item.get("name"): item for item in evaluated_menu.get("items", [])}
        section["items"] = [by_name.get(item.get("name"), item) for item in section.get("items", [])]
    return evaluated_menu


def mock_menu() -> dict[str, Any]:
    return {
        "restaurantName": "Mock Menu Cafe",
        "sections": [
            {
                "name": "Burgers",
                "items": [
                    {"name": "Classic Burger", "description": "lettuce, tomato, onion", "price": "$12"},
                    {"name": "Mushroom Swiss", "description": "mushrooms, swiss cheese, toasted bun", "price": "$13"},
                ],
            },
            {
                "name": "Sides",
                "items": [
                    {"name": "Side Salad", "description": "mixed greens", "price": "$5"},
                    {"name": "French Fries", "description": "fried potatoes", "price": "$4"},
                ],
            },
        ],
        "restaurantNotes": [],
    }


def build_prompt(ocr_text: str, profile_json: str, filenames: list[str], pdf_text: str = "") -> str:
    return f"""
You are extracting a restaurant menu for What 2 Eat.

Return strict JSON only with this shape:
{{
  "restaurantName": "Restaurant Name",
  "sections": [
    {{
      "name": "Section Name",
      "items": [
        {{
          "name": "Exact printed item name",
          "description": "English description from the menu",
          "price": "$0.00",
          "likelyIngredients": [
            {{ "name": "ingredient or prep term", "source": "visual|pdf_text|ocr|description|inferred", "confidence": "high|medium|low" }}
          ],
          "possibleRisks": [
            {{
              "term": "ingredient or prep term",
              "restriction": "dairy|gluten|peanuts|tree_nuts|shellfish|fish|eggs|soy|sesame|pork|beef|chicken|alcohol|caffeine|spicy|garlic|onions|mushrooms|corn|coconut|fried|shared_fryer",
              "role": "core|sauce|topping|side|prep|cross-contact risk|unknown",
              "source": "visual|pdf_text|ocr|description|inferred",
              "certainty": "high|medium_high|medium|low",
              "message": "Short factual evidence only"
            }}
          ]
        }}
      ]
    }}
  ],
  "restaurantNotes": []
}}

Rules:
- Use the uploaded images as the source of truth. OCR text is backup evidence.
- Preserve real menu item names, including Spanish or other languages, but normalize PDF/text-extraction artifacts into readable customer-facing names.
- Fix broken letter spacing and casing from PDF extraction. For example: "chicK en c ritters ® b as K et" should become "Chicken Critters® Basket", and "a nd Y ’s s tea K *" should become "Andy's Steak*".
- Translate only descriptions and notes into English when useful.
- Do not invent items, ingredients, sections, prices, or restaurant names.
- Do not judge whether items are safe, compatible, healthy, or recommended.
- Do not invent substitutions or allergy guidance.
- Do identify likely ingredients and possible risk evidence when supported by the image, item name, description, or common menu meaning.
- Risk evidence is not a final decision; the Dine DNA engine will make final safety decisions.
- Do not turn warnings, hours, address, phone, URLs, ads, captions, or legal notices into menu items.
- Put every real menu item inside its printed section.
- If a price is visible, include it. If not visible, use an empty string.

Uploaded filenames: {', '.join(filenames)}
Profile JSON is not for menu judgment. Ignore it for safety decisions: {profile_json[:1200]}
OCR backup text:
{ocr_text[:12000]}

PDF extracted text:
{pdf_text[:12000]}
""".strip()


def call_openai(images: list[dict[str, str]], ocr_text: str, profile_json: str, filenames: list[str], pdf_text: str = "") -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not set yet.")

    content: list[dict[str, Any]] = [{"type": "input_text", "text": build_prompt(ocr_text, profile_json, filenames, pdf_text)}]
    content.extend({"type": "input_image", "image_url": image["dataUrl"]} for image in images)
    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            "input": [{"role": "user", "content": content}],
            "temperature": 0,
            "max_output_tokens": int_env("AI_IMAGE_MAX_OUTPUT_TOKENS", "9000"),
        },
        timeout=90,
    )
    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text[:1000])
    return parse_json_text(extract_response_text(response.json()))


def clean_pdf_menu_text(text: str) -> str:
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
    lines = []
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


def build_fallback_pdf_prompt(title: str, filename: str, pdf_text: str) -> str:
    return f"""
You are extracting a restaurant menu for What 2 Eat from messy copied PDF or website text.

Return strict JSON only with this shape:
{{
  "restaurantName": "{title}",
  "sections": [
    {{
      "name": "Section Name",
      "items": [
        {{
          "name": "Exact printed item name",
          "description": "Short English description from nearby text",
          "price": "$0.00",
          "likelyIngredients": [
            {{ "name": "ingredient or prep term", "source": "pdf_text|description|inferred", "confidence": "high|medium|low" }}
          ],
          "possibleRisks": [
            {{
              "term": "ingredient or prep term",
              "restriction": "dairy|gluten|peanuts|tree_nuts|shellfish|fish|eggs|soy|sesame|pork|beef|chicken|alcohol|caffeine|spicy|garlic|onions|mushrooms|corn|coconut|fried|shared_fryer",
              "role": "core|sauce|topping|side|prep|cross-contact risk|unknown",
              "source": "pdf_text|description|inferred",
              "certainty": "high|medium_high|medium|low",
              "message": "Short factual evidence only"
            }}
          ]
        }}
      ]
    }}
  ],
  "restaurantNotes": []
}}

Rules:
- Extract only real orderable restaurant menu items from the text.
- Ignore web navigation, account text, cookie notices, URLs, marketing headlines, legal notices, locations, rewards, and nutrition-only table rows.
- If the text is a browser error, blocked page, security verification page, or unrelated page, return an empty sections array.
- If section headings are unclear, group items into useful sections like Burgers, Chicken, Bowls, Pizza, Pasta, Sandwiches, Sides, Drinks, Desserts, or Menu.
- Do not invent items that are not supported by the text.
- Do identify likely ingredients and possible risk evidence when supported by the item name, nearby text, or common menu meaning.
- Risk evidence is not a final decision; the Dine DNA engine will make final safety decisions.
- Normalize broken letter spacing and casing from PDF extraction into readable customer-facing item names.
- For example, "chicK en c ritters ® b as K et" should become "Chicken Critters® Basket", and "a nd Y ’s s tea K *" should become "Andy's Steak*".
- Keep descriptions short. If no description is nearby, use an empty string.
- If prices are not visible, use an empty string.
- Return at least 4 items when the text contains real menu item names.

Source filename: {filename}
Messy menu text:
{pdf_text[:18000]}
""".strip()


def call_openai_pdf_fallback(title: str, filename: str, pdf_text: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not set yet.")

    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            "input": [{"role": "user", "content": [{"type": "input_text", "text": build_fallback_pdf_prompt(title, filename, pdf_text)}]}],
            "temperature": 0,
            "max_output_tokens": int_env("AI_PDF_MAX_OUTPUT_TOKENS", "9000"),
        },
        timeout=90,
    )
    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text[:1000])
    return parse_json_text(extract_response_text(response.json()))


def chunk_pdf_menu_text(text: str, max_chars: int = 6500) -> list[str]:
    lines = str(text or "").splitlines()
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for line in lines:
        line_len = len(line) + 1
        if current and current_len + line_len > max_chars:
            chunks.append("\n".join(current).strip())
            current = []
            current_len = 0
        current.append(line)
        current_len += line_len
    if current:
        chunks.append("\n".join(current).strip())
    return [chunk for chunk in chunks if chunk]


def section_merge_key(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", str(value or "").lower())).strip() or "menu"


def merge_extracted_menus(title: str, menus: list[dict[str, Any]]) -> dict[str, Any]:
    section_order: list[str] = []
    sections_by_key: dict[str, dict[str, Any]] = {}
    item_keys_by_section: dict[str, set[str]] = {}
    notes: list[str] = []
    for menu in menus:
        notes.extend(str(note).strip() for note in menu.get("restaurantNotes", []) if str(note).strip())
        for section in menu.get("sections", []):
            section_name = str(section.get("name") or section.get("title") or "Menu").strip() or "Menu"
            section_key = section_merge_key(section_name)
            if section_key not in sections_by_key:
                section_order.append(section_key)
                sections_by_key[section_key] = {"name": section_name, "items": []}
                item_keys_by_section[section_key] = set()
            for item in section.get("items", []):
                item_key = section_merge_key(item.get("name"))
                if not item_key or item_key in item_keys_by_section[section_key]:
                    continue
                item_keys_by_section[section_key].add(item_key)
                sections_by_key[section_key]["items"].append(item)
    return {
        "restaurantName": title,
        "sections": [sections_by_key[key] for key in section_order if sections_by_key[key]["items"]],
        "restaurantNotes": list(dict.fromkeys(notes)),
    }


def extract_pdf_menu_with_ai(title: str, filename: str, pdf_text: str) -> dict[str, Any]:
    cleaned_text = clean_pdf_menu_text(pdf_text) or pdf_text
    chunks = chunk_pdf_menu_text(cleaned_text)
    if len(chunks) <= 1:
        return normalize_menu(call_openai_pdf_fallback(title, filename, cleaned_text))

    extracted: list[dict[str, Any]] = []
    failures: list[HTTPException] = []
    for index, chunk in enumerate(chunks, start=1):
        try:
            extracted.append(call_openai_pdf_fallback(title, f"{filename} part {index} of {len(chunks)}", chunk))
        except HTTPException as exc:
            failures.append(exc)
    if not extracted:
        raise failures[0] if failures else HTTPException(status_code=422, detail="AI could not find structured menu sections and items.")
    return normalize_menu(merge_extracted_menus(title, extracted))


def extract_menu_with_ai(
    images: list[dict[str, str]],
    ocr_text: str,
    profile_json: str,
    filenames: list[str],
    pdf_text: str,
    fallback_title: str = "Uploaded menu",
) -> tuple[dict[str, Any], str]:
    if not images and pdf_text:
        filename = filenames[0] if filenames else fallback_title
        menu = extract_pdf_menu_with_ai(fallback_title, filename, pdf_text)
        return menu, "openai-pdf-text-fallback"
    try:
        return normalize_menu(call_openai(images, ocr_text, profile_json, filenames, pdf_text)), "openai-vision-evidence"
    except HTTPException:
        if images or not pdf_text:
            raise
        filename = filenames[0] if filenames else fallback_title
        cleaned_text = clean_pdf_menu_text(pdf_text) or pdf_text
        menu = normalize_menu(call_openai_pdf_fallback(fallback_title, filename, cleaned_text))
        return menu, "openai-pdf-text-fallback"


@app.post("/api/scan-menu")
async def scan_menu(
    files: list[UploadFile] = File(...),
    ocr_text: str = Form(""),
    profile_json: str = Form("{}"),
    source_label: str = Form("Uploaded menu"),
    source_id: str = Form(""),
) -> dict[str, Any]:
    upload_data = await read_uploads(files)
    images = upload_data["images"]
    filenames = upload_data["filenames"]
    pdf_text = upload_data["pdfText"]
    profile = parse_profile_json(profile_json)
    usage, month, spent, monthly_cap, max_per_scan = check_budget()
    if os.getenv("AI_SCAN_MOCK", "0") == "1":
        menu = normalize_menu(mock_menu())
        parser_used = "ai-mock"
        estimated_charge = 0.0
    else:
        if not images and not pdf_text:
            raise HTTPException(status_code=400, detail="No readable image or PDF menu text was uploaded.")
        menu, parser_used = extract_menu_with_ai(images, ocr_text, profile_json, filenames, pdf_text, source_label)
        estimated_charge = max_per_scan
        record_usage(usage, month, estimated_charge)

    return build_scan_response(
        menu=menu,
        profile=profile,
        source_label=source_label,
        source_id=source_id,
        parser_used=parser_used,
        estimated_charge=estimated_charge,
        month=month,
        spent=spent,
        monthly_cap=monthly_cap,
        ocr_text=ocr_text,
        pdf_text=pdf_text,
    )


@app.post("/api/food-enrich")
async def food_enrich(payload: dict[str, Any]) -> dict[str, Any]:
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")
    return call_spoonacular_detect(text)


@app.post("/api/dev/test-menu-scan/{menu_id}")
async def dev_test_menu_scan(menu_id: str, payload: dict[str, Any] = None) -> dict[str, Any]:
    if not TEST_MENUS_FILE.exists():
        raise HTTPException(status_code=404, detail="No imported test menus found.")
    try:
        test_menus = json.loads(TEST_MENUS_FILE.read_text())
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Imported test menu cache is not valid JSON.")
    if not isinstance(test_menus, list):
        raise HTTPException(status_code=500, detail="Imported test menu cache must be a list.")

    entry = next((item for item in test_menus if item.get("id") == menu_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Test menu not found.")

    source_file = Path(str(entry.get("sourceFile") or "")).expanduser()
    if source_file.suffix.lower() != ".pdf" or not source_file.exists():
        raise HTTPException(status_code=404, detail="Original PDF for this test menu is missing.")

    pdf_text = extract_pdf_text(source_file.read_bytes())
    if not pdf_text:
        raise HTTPException(status_code=400, detail="No readable PDF text was found in this test menu.")

    profile_json = json.dumps((payload or {}).get("profile") or {})
    profile = parse_profile_json(profile_json)
    usage, month, spent, monthly_cap, max_per_scan = check_budget()
    menu, parser_used = extract_menu_with_ai([], "", profile_json, [source_file.name], pdf_text, str(entry.get("title") or source_file.stem))
    estimated_charge = max_per_scan
    record_usage(usage, month, estimated_charge)

    return build_scan_response(
        menu=menu,
        profile=profile,
        source_label=str(entry.get("title") or source_file.stem),
        source_id=f"live-test-menu-{menu_id}",
        parser_used=f"{parser_used}-live",
        estimated_charge=estimated_charge,
        month=month,
        spent=spent,
        monthly_cap=monthly_cap,
        pdf_text=pdf_text,
    )


@app.get("/api/open-food-facts/product/{barcode}")
async def open_food_facts_product(barcode: str) -> dict[str, Any]:
    return call_open_food_facts(barcode)


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return health_payload()


@app.get("/")
async def root() -> FileResponse:
    return FileResponse(APP_DIR / "index.html")


app.mount("/", StaticFiles(directory=APP_DIR, html=True), name="static")
