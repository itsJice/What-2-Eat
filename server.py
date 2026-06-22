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


def normalize_menu(menu: dict[str, Any]) -> dict[str, Any]:
    restaurant = str(menu.get("restaurantName") or "Uploaded menu").strip() or "Uploaded menu"
    sections = []
    for section in menu.get("sections", []):
        name = str(section.get("name") or "").strip()
        items = []
        for item in section.get("items", []):
            item_name = str(item.get("name") or "").strip()
            if len(item_name) < 2:
                continue
            items.append(
                {
                    "name": item_name,
                    "description": str(item.get("description") or "").strip(),
                    "price": str(item.get("price") or "").strip(),
                }
            )
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
                price_conflicts[name] = f"Confirm price; AI read {ai_price}, OCR read {ocr_price}."
        else:
            support[name] = "unsupported"
            coverage["unsupportedAiCount"] += 1

    ocr_only = [
        line for line in lines
        if line not in supported_lines and all(score_ocr_line_against_item(line, item) < 0.62 for item in all_items)
    ][:8]
    if ocr_only:
        next_menu.setdefault("sections", []).append({
            "name": "Needs a second look",
            "items": [
                {
                    "name": re.sub(r"\s+\$\s?\d+(?:\.\d{2})?$", "", line).strip(),
                    "description": line,
                    "price": extract_price(line),
                    "sourceTrace": "ocr-coverage",
                }
                for line in ocr_only
            ],
        })
        for item in next_menu["sections"][-1]["items"]:
            support[item["name"]] = "ocr-only"
    coverage["ocrOnlyCount"] = len(ocr_only)
    return next_menu, support, coverage, price_conflicts


def add_coverage_notes(evaluated_menu: dict[str, Any], price_conflicts: dict[str, str]) -> dict[str, Any]:
    for item in evaluated_menu.get("items", []):
        name = item.get("name")
        if item.get("ocrSupport") == "ocr-only":
            item["confidence"] = "Low"
            item["confirm"] = list(dict.fromkeys([*(item.get("confirm") or []), "Ask staff whether this item is actually available and confirm the printed name."]))
            item["notes"] = list(dict.fromkeys([*(item.get("notes") or []), "Needs a second look because OCR saw it outside the AI-structured result."]))
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
        {{ "name": "Exact printed item name", "description": "English description from the menu", "price": "$0.00" }}
      ]
    }}
  ],
  "restaurantNotes": []
}}

Rules:
- Use the uploaded images as the source of truth. OCR text is backup evidence.
- Preserve menu item names exactly as printed, including Spanish or other languages.
- Translate only descriptions and notes into English when useful.
- Do not invent items, ingredients, sections, prices, or restaurant names.
- Do not judge whether items are safe, compatible, healthy, or recommended.
- Do not invent substitutions or allergy guidance.
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
            "max_output_tokens": 4500,
        },
        timeout=90,
    )
    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text[:1000])
    return parse_json_text(extract_response_text(response.json()))


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
        menu = normalize_menu(call_openai(images, ocr_text, profile_json, filenames, pdf_text))
        parser_used = "openai-vision-ocr"
        estimated_charge = max_per_scan
        record_usage(usage, month, estimated_charge)

    food_enrichment = enrich_menu_once(menu)
    evaluation_source_menu, ocr_support, ocr_coverage, price_conflicts = apply_ocr_coverage(menu, "\n\n".join([ocr_text, pdf_text]))
    evaluated_menu = add_coverage_notes(
        evaluate_menu(evaluation_source_menu, profile, food_enrichment, ocr_support),
        price_conflicts,
    )

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
        "ocrCoverage": ocr_coverage,
        "menu": menu,
        "evaluatedMenu": evaluated_menu,
    }


@app.post("/api/food-enrich")
async def food_enrich(payload: dict[str, Any]) -> dict[str, Any]:
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")
    return call_spoonacular_detect(text)


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
