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


APP_DIR = Path(__file__).resolve().parent
load_dotenv(APP_DIR / ".env")

USAGE_FILE = APP_DIR / ".ai_usage.json"
PARSER_VERSION = "ai-vision-budget-1"

OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"


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


async def read_uploads(files: list[UploadFile]) -> list[dict[str, str]]:
    images = []
    for file in files:
      data = await file.read()
      if not data:
          continue
      content_type = file.content_type or "image/jpeg"
      images.append(
          {
              "filename": file.filename or "menu-image.jpg",
              "mime": content_type,
              "dataUrl": f"data:{content_type};base64,{base64.b64encode(data).decode('ascii')}",
          }
      )
    return images


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


def build_prompt(ocr_text: str, profile_json: str, filenames: list[str]) -> str:
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
- Do not turn warnings, hours, address, phone, URLs, ads, captions, or legal notices into menu items.
- Put every real menu item inside its printed section.
- If a price is visible, include it. If not visible, use an empty string.

Uploaded filenames: {', '.join(filenames)}
Taste profile JSON for later context: {profile_json[:3000]}
OCR backup text:
{ocr_text[:12000]}
""".strip()


def call_openai(images: list[dict[str, str]], ocr_text: str, profile_json: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not set yet.")

    content: list[dict[str, Any]] = [{"type": "input_text", "text": build_prompt(ocr_text, profile_json, [image["filename"] for image in images])}]
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
    images = await read_uploads(files)
    if not images:
        raise HTTPException(status_code=400, detail="No readable image files were uploaded.")

    usage, month, spent, monthly_cap, max_per_scan = check_budget()
    if os.getenv("AI_SCAN_MOCK", "0") == "1":
        menu = normalize_menu(mock_menu())
        parser_used = "ai-mock"
        estimated_charge = 0.0
    else:
        menu = normalize_menu(call_openai(images, ocr_text, profile_json))
        parser_used = "openai-vision-ocr"
        estimated_charge = max_per_scan
        record_usage(usage, month, estimated_charge)

    return {
        "sourceId": source_id,
        "sourceName": source_label,
        "parserVersion": PARSER_VERSION,
        "parserUsed": parser_used,
        "budget": {
            "month": month,
            "monthlyCapUsd": monthly_cap,
            "estimatedSpentBeforeUsd": spent,
            "estimatedChargeUsd": estimated_charge,
        },
        "menu": menu,
    }


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return health_payload()


@app.get("/")
async def root() -> FileResponse:
    return FileResponse(APP_DIR / "index.html")


app.mount("/", StaticFiles(directory=APP_DIR, html=True), name="static")
