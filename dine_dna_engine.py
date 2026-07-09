import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any, Optional


ENGINE_VERSION = "dine-dna-engine-1"
KNOWLEDGE_PATH = Path(__file__).resolve().parent / "data" / "food_knowledge.json"

STATUS_LABELS = {
    "safe": "Safe to Order As-Is",
    "confirm": "Ask Before Ordering",
    "modify": "Safe With Modifications",
    "swap_required": "Only If They Can Swap It",
    "avoid": "Don't Order",
}

STATUS_RANK = {
    "safe": 0,
    "confirm": 1,
    "modify": 2,
    "swap_required": 3,
    "avoid": 4,
}

AVOID_TO_RISK = {
    "Dairy": "dairy",
    "Gluten / Wheat": "gluten",
    "Peanuts": "peanuts",
    "Tree Nuts": "tree_nuts",
    "Shellfish": "shellfish",
    "Fish": "fish",
    "Eggs": "eggs",
    "Soy": "soy",
    "Sesame": "sesame",
    "Pork": "pork",
    "Beef": "beef",
    "Chicken": "chicken",
    "Alcohol": "alcohol",
    "Caffeine": "caffeine",
    "Spicy Food": "spicy",
    "Garlic": "garlic",
    "Onions": "onions",
    "Mushrooms": "mushrooms",
    "Corn": "corn",
    "Coconut": "coconut",
}

EATING_STYLE_RISKS = {
    "Vegetarian": {"beef", "chicken", "pork"},
    "Vegan": {"dairy", "eggs", "beef", "chicken", "pork", "fish", "shellfish"},
    "Pescatarian": {"beef", "chicken", "pork"},
    "Halal": {"pork", "alcohol"},
    "Kosher": {"pork", "shellfish"},
    "Plant-Based": {"dairy", "eggs", "beef", "chicken", "pork", "fish", "shellfish"},
    "Whole30": {"dairy", "gluten", "soy", "alcohol", "corn"},
    "Paleo": {"dairy", "gluten", "soy", "corn"},
}

LOW_SCORE_HEALTH_TERMS = {
    "Low Sugar": ["dessert", "cake", "pie", "cookie", "syrup", "sweet", "soda"],
    "Low Carb": ["bread", "bun", "pasta", "rice", "fries", "tortilla"],
    "Diabetic-Friendly": ["bread", "bun", "pasta", "rice", "fries", "sugar", "syrup", "dessert"],
    "Low Sodium": ["bacon", "ham", "sausage", "soy sauce", "pickle"],
}

AI_RISK_ALIASES = {
    "milk": "dairy",
    "cream": "dairy",
    "cheese": "dairy",
    "butter": "dairy",
    "dairy": "dairy",
    "wheat": "gluten",
    "gluten": "gluten",
    "bread": "gluten",
    "breaded": "gluten",
    "bun": "gluten",
    "pasta": "gluten",
    "peanut": "peanuts",
    "peanuts": "peanuts",
    "tree nut": "tree_nuts",
    "tree nuts": "tree_nuts",
    "almond": "tree_nuts",
    "walnut": "tree_nuts",
    "shellfish": "shellfish",
    "shrimp": "shellfish",
    "fish": "fish",
    "egg": "eggs",
    "eggs": "eggs",
    "soy": "soy",
    "sesame": "sesame",
    "pork": "pork",
    "bacon": "pork",
    "ham": "pork",
    "beef": "beef",
    "steak": "beef",
    "chicken": "chicken",
    "alcohol": "alcohol",
    "wine": "alcohol",
    "beer": "alcohol",
    "caffeine": "caffeine",
    "coffee": "caffeine",
    "spicy": "spicy",
    "chili": "spicy",
    "garlic": "garlic",
    "onion": "onions",
    "onions": "onions",
    "mushroom": "mushrooms",
    "mushrooms": "mushrooms",
    "corn": "corn",
    "coconut": "coconut",
    "fried": "fried",
    "deep fried": "fried",
    "fryer": "fried",
    "shared fryer": "shared_fryer",
    "cross contact": "shared_fryer",
    "cross-contact": "shared_fryer",
}

AI_ROLES = {"core", "sauce", "topping", "side", "prep", "cross-contact risk", "unknown"}
AI_CERTAINTY = {"high", "medium_high", "medium", "low", "supporting"}


def load_knowledge() -> dict[str, Any]:
    return json.loads(KNOWLEDGE_PATH.read_text())


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9$.\s/&'-]", " ", str(value or "").lower())).strip()


def words(value: str) -> list[str]:
    return [word for word in normalize_text(value).split() if len(word) > 2]


def item_text(item: dict[str, Any]) -> str:
    return normalize_text(" ".join([str(item.get("name") or ""), str(item.get("description") or ""), str(item.get("price") or "")]))


def normalize_profile(profile: Optional[dict[str, Any]]) -> dict[str, Any]:
    profile = profile or {}
    risks: set[str] = set()
    for food in profile.get("avoidFoods") or profile.get("restrictions") or []:
        risk = AVOID_TO_RISK.get(str(food))
        if risk:
            risks.add(risk)
    for style in profile.get("eatingStyle") or []:
        risks.update(EATING_STYLE_RISKS.get(str(style), set()))
    if "No Fried Foods" in (profile.get("healthNeeds") or []):
        risks.add("fried")
    return {
        "risks": risks,
        "healthNeeds": set(profile.get("healthNeeds") or []),
        "loveFoods": [str(item).lower() for item in profile.get("loveFoods") or []],
        "dontLoveFoods": [str(item).lower() for item in profile.get("dontLoveFoods") or []],
        "avoidSharedFryers": "Avoid Shared Fryers" in (profile.get("healthNeeds") or []),
    }


def build_term_index(knowledge: dict[str, Any]) -> list[dict[str, Any]]:
    index = []
    for canonical, data in knowledge.get("terms", {}).items():
        for phrase in [canonical, *(data.get("aliases") or [])]:
            index.append({"phrase": normalize_text(phrase), "canonical": canonical, "data": data})
    return sorted(index, key=lambda item: len(item["phrase"]), reverse=True)


def phrase_in_text(phrase: str, text: str) -> bool:
    if not phrase:
        return False
    return re.search(rf"(^|\W){re.escape(phrase)}($|\W)", text) is not None


def infer_role(name: str, description: str, term: str, default_role: str) -> str:
    name_text = normalize_text(name)
    description_text = normalize_text(description)
    if phrase_in_text(term, name_text):
        return "prep" if default_role == "prep" else "core"
    before = description_text.split(term, 1)[0] if term in description_text else ""
    after = description_text.split(term, 1)[1][:36] if term in description_text else ""
    nearby = before[-36:]
    if term in {"cream", "creamy", "cream sauce"} and ("soup" in name_text or "broth" in after):
        return "core"
    if default_role == "core" and any(marker in nearby for marker in ["served over", " over ", "tossed with"]):
        return "core"
    if any(marker in nearby for marker in ["served with", "side of", "choice of"]):
        return "side"
    if any(marker in nearby for marker in ["topped with", "add ", "finished with"]):
        if "sauce" in term or term in {"ranch", "aioli", "mayo", "mayonnaise", "tahini", "alfredo"}:
            return "sauce"
        return "topping"
    if "with " in nearby:
        if "sauce" in term or term in {"ranch", "aioli", "mayo", "mayonnaise", "tahini", "alfredo"}:
            return "sauce"
        return "topping"
    if default_role == "prep":
        return "prep"
    if default_role in {"sauce", "topping", "side"}:
        return default_role
    return "unknown" if description_text and not phrase_in_text(term, name_text) else "core"


def find_evidence(item: dict[str, Any], enrichment_terms: list[str], profile: dict[str, Any], knowledge: dict[str, Any]) -> list[dict[str, Any]]:
    text = item_text(item)
    term_index = build_term_index(knowledge)
    evidence = []
    seen = set()
    for entry in term_index:
        phrase = entry["phrase"]
        if not phrase_in_text(phrase, text):
            continue
        for risk, risk_data in (entry["data"].get("risks") or {}).items():
            if risk not in profile["risks"] and not (profile["avoidSharedFryers"] and risk == "fried"):
                continue
            key = (phrase, risk)
            if key in seen:
                continue
            seen.add(key)
            role = infer_role(str(item.get("name") or ""), str(item.get("description") or ""), phrase, entry["data"].get("defaultRole", "unknown"))
            evidence.append({
                "source": "internal_knowledge",
                "term": phrase,
                "canonical": entry["canonical"],
                "restriction": risk,
                "role": role,
                "certainty": risk_data.get("certainty", "medium"),
                "message": risk_data.get("reason") or f"{phrase} may conflict with {risk}.",
            })
    for term in enrichment_terms:
        normalized = normalize_text(term)
        if normalized and normalized in text and not any(item.get("term") == normalized for item in evidence):
            evidence.append({
                "source": "spoonacular",
                "term": normalized,
                "canonical": normalized,
                "restriction": "food_term",
                "role": "unknown",
                "certainty": "supporting",
                "message": f"Spoonacular detected {normalized} as a menu food term.",
            })
    if profile["avoidSharedFryers"] and any(ev["restriction"] in {"fried", "gluten"} or ev["role"] == "prep" for ev in evidence):
        evidence.append({
            "source": "internal_knowledge",
            "term": "shared fryer",
            "canonical": "cross_contact",
            "restriction": "shared_fryer",
            "role": "cross-contact risk",
            "certainty": "medium",
            "message": "Your profile asks to avoid shared fryers, so fried or breaded items need staff confirmation.",
        })
    return evidence


def normalize_ai_risk(value: str) -> str:
    text = normalize_text(value).replace("/", " ").strip()
    if text in AI_RISK_ALIASES:
        return AI_RISK_ALIASES[text]
    for phrase, risk in sorted(AI_RISK_ALIASES.items(), key=lambda entry: len(entry[0]), reverse=True):
        if phrase_in_text(normalize_text(phrase), text):
            return risk
    return text.replace(" ", "_")


def ai_item_evidence(item: dict[str, Any], profile: dict[str, Any]) -> list[dict[str, Any]]:
    evidence = []
    seen = set()
    for entry in item.get("aiEvidence") or []:
        if not isinstance(entry, dict) or entry.get("type") == "ingredient":
            continue
        restriction = normalize_ai_risk(str(entry.get("restriction") or entry.get("term") or ""))
        if restriction not in profile["risks"] and restriction != "shared_fryer" and not (profile["avoidSharedFryers"] and restriction == "fried"):
            continue
        term = str(entry.get("term") or entry.get("restriction") or restriction).strip()
        role = str(entry.get("role") or "unknown").strip().lower()
        certainty = str(entry.get("certainty") or "medium").strip().lower()
        key = (normalize_text(term), restriction, role)
        if key in seen:
            continue
        seen.add(key)
        evidence.append({
            "source": "ai_evidence",
            "term": normalize_text(term) or restriction,
            "canonical": normalize_text(term) or restriction,
            "restriction": restriction,
            "role": role if role in AI_ROLES else "unknown",
            "certainty": certainty if certainty in AI_CERTAINTY else "medium",
            "message": str(entry.get("message") or f"{term or restriction} may conflict with {restriction}.").strip(),
        })
    return evidence


def merge_evidence(internal_evidence: list[dict[str, Any]], ai_evidence: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged = []
    seen = set()
    for ev in [*internal_evidence, *ai_evidence]:
        key = (ev.get("term"), ev.get("restriction"), ev.get("role"))
        if key in seen:
            continue
        seen.add(key)
        merged.append(ev)
    return merged


def menu_has_safe_swap(menu_text: str, risk: str, role: str) -> bool:
    if risk == "gluten" and role in {"core", "unknown"}:
        return any(phrase in menu_text for phrase in ["gluten free", "gluten-free", "rice", "salad", "bowl", "corn tortilla"])
    if risk == "dairy" and role == "sauce":
        return any(phrase in menu_text for phrase in ["oil and vinegar", "vinaigrette", "salsa", "marinara"])
    if role == "prep":
        return any(phrase in menu_text for phrase in ["grilled", "baked", "roasted"])
    return False


def decide_category(evidence: list[dict[str, Any]], menu_text: str, profile: dict[str, Any]) -> str:
    risk_evidence = [item for item in evidence if item.get("restriction") in profile["risks"] or item.get("restriction") == "shared_fryer"]
    if not risk_evidence:
        return "safe"
    if any(ev["restriction"] == "fried" and "No Fried Foods" in profile["healthNeeds"] for ev in risk_evidence):
        return "avoid"
    if any(ev["restriction"] == "shared_fryer" for ev in risk_evidence):
        return "confirm"
    for ev in risk_evidence:
        role = ev.get("role")
        risk = ev.get("restriction")
        if role in {"core", "unknown"}:
            return "swap_required" if menu_has_safe_swap(menu_text, risk, role) and risk == "gluten" and any(word in ev["term"] for word in ["bun", "bread", "wrap", "pita"]) else "avoid"
    for ev in risk_evidence:
        role = ev.get("role")
        risk = ev.get("restriction")
        if role == "sauce":
            return "swap_required" if menu_has_safe_swap(menu_text, risk, role) else "modify"
        if role in {"topping", "side"}:
            return "modify"
        if role == "prep":
            return "confirm" if profile["avoidSharedFryers"] else "swap_required"
    return "confirm"


def score_item(item: dict[str, Any], category: str, profile: dict[str, Any]) -> int:
    base = {"safe": 92, "confirm": 68, "modify": 58, "swap_required": 38, "avoid": 5}[category]
    text = item_text(item)
    for love in profile["loveFoods"]:
        if love and love in text:
            base += 8
    for dislike in profile["dontLoveFoods"]:
        if dislike and dislike in text:
            base -= 12
    for need, terms in LOW_SCORE_HEALTH_TERMS.items():
        if need in profile["healthNeeds"] and any(term in text for term in terms):
            base -= 10
    return max(0, min(100, base))


def instructions_for(item: dict[str, Any], category: str, evidence: list[dict[str, Any]], menu_text: str) -> dict[str, list[str]]:
    conflicts = []
    confirm = []
    remove = []
    substitutions = []
    notes = []
    side_terms = []
    for ev in evidence:
        restriction = ev.get("restriction")
        if restriction in {"food_term"}:
            continue
        role = ev.get("role")
        term = ev.get("term")
        if restriction == "shared_fryer":
            confirm.append("Ask if the fryer or prep surface is shared.")
            continue
        conflicts.append(ev.get("message") or f"{term} may conflict with your profile.")
        if role == "topping":
            remove.append(term)
        elif role == "side":
            side_terms.append(term)
        elif role == "sauce":
            remove.append(term)
            if any(phrase in menu_text for phrase in ["oil and vinegar", "vinaigrette"]):
                substitutions.append("Ask for oil and vinegar or vinaigrette instead of the conflicting sauce.")
            else:
                confirm.append(f"Ask whether {term} can be left off or swapped.")
        elif role == "prep":
            substitutions.append("Choose grilled, baked, or roasted instead of fried if this menu offers it.")
        elif role in {"core", "unknown"} and category == "swap_required":
            substitutions.append("Swap the conflicting base for rice, vegetables, a bowl, or another printed option if this menu offers it.")
        elif role in {"core", "unknown"}:
            notes.append("The conflicting ingredient appears to be a main part of the dish, so it probably cannot be removed.")
    if category == "safe":
        notes.append("No direct conflict found against your current Dine DNA.")
    elif category == "confirm":
        confirm.append("Ask staff to confirm ingredients and preparation before ordering.")
    if side_terms:
        side_name = " ".join(unique(side_terms)) if len(unique(side_terms)) <= 3 else ", ".join(unique(side_terms))
        substitutions.append(f"Swap the {side_name} side for another compatible side.")
    return {
        "conflicts": unique(conflicts),
        "confirm": unique(confirm),
        "remove": unique(remove),
        "substitutions": unique(substitutions),
        "notes": unique(notes),
    }


def summary_for(category: str, evidence: list[dict[str, Any]]) -> str:
    risk = next((ev for ev in evidence if ev.get("restriction") != "food_term"), None)
    if category == "safe":
        return "No direct conflict found against your current Dine DNA."
    if category == "confirm":
        return risk.get("message") if risk else "This needs one staff confirmation before ordering."
    if category == "modify":
        return "This can work if the listed topping, side, or sauce edits are possible."
    if category == "swap_required":
        return "This only works if the kitchen can swap the conflicting base or sauce."
    return risk.get("message") if risk else "This conflicts with your current Dine DNA."


def confidence_for(category: str, evidence: list[dict[str, Any]], ocr_support: str = "unchecked") -> str:
    if ocr_support == "unsupported":
        return "Low"
    if category in {"avoid", "safe"} and all(ev.get("certainty") in {"high", "medium_high", "supporting"} for ev in evidence):
        return "High"
    return "Medium"


def unique(items: list[str]) -> list[str]:
    return list(dict.fromkeys([str(item).strip() for item in items if str(item).strip()]))


def count_categories(sections: list[dict[str, Any]]) -> dict[str, int]:
    counts = {"safe": 0, "confirm": 0, "modify": 0, "swapRequired": 0, "avoid": 0}
    for item in [item for section in sections for item in section.get("items", [])]:
        key = "swapRequired" if item.get("category") == "swap_required" else item.get("category", "avoid")
        if key in counts:
            counts[key] += 1
    return counts


def build_recommendation(sections: list[dict[str, Any]], profile: dict[str, Any]) -> dict[str, Any]:
    candidates = [
        {**item, "sectionTitle": section.get("title") or section.get("name") or "Menu"}
        for section in sections
        for item in section.get("items", [])
        if item.get("category") == "safe"
    ]
    candidates.sort(key=lambda item: (-(item.get("score") or 0), item.get("name") or ""))
    if not candidates:
        avoid_list = ", ".join(sorted(profile["risks"])[:3])
        return {
            "name": "No low-effort order found",
            "summary": f"No low-effort order found for your Dine DNA{f' ({avoid_list})' if avoid_list else ''}.",
            "items": [],
            "instructions": [
                "Review the menu below or ask staff for a custom option built without your conflicting ingredients.",
            ],
            "unavailable": True,
        }
    main = candidates[0]
    return {
        "name": main.get("name") or "Best option",
        "summary": f"{main['sectionTitle']}: {main.get('name')}",
        "items": [main],
        "instructions": unique([*(main.get("confirm") or []), *(main.get("notes") or [])]),
        "unavailable": False,
    }


def enrichment_terms(food_enrichment: Optional[dict[str, Any]]) -> list[str]:
    return [str(item.get("name") or "") for item in (food_enrichment or {}).get("annotations", []) if item.get("name")]


def evaluate_menu(
    menu: dict[str, Any],
    profile: Optional[dict[str, Any]] = None,
    food_enrichment: Optional[dict[str, Any]] = None,
    ocr_support: Optional[dict[str, str]] = None,
) -> dict[str, Any]:
    knowledge = load_knowledge()
    normalized_profile = normalize_profile(profile)
    menu_text = normalize_text(json.dumps(menu))
    terms = enrichment_terms(food_enrichment)
    sections = []
    for section in menu.get("sections", []):
        items = []
        for item in section.get("items", []):
            source_item = deepcopy(item)
            support = (ocr_support or {}).get(source_item.get("name"), "unchecked")
            evidence = merge_evidence(
                find_evidence(source_item, terms, normalized_profile, knowledge),
                ai_item_evidence(source_item, normalized_profile),
            )
            category = decide_category(evidence, menu_text, normalized_profile)
            instructions = instructions_for(source_item, category, evidence, menu_text)
            score = score_item(source_item, category, normalized_profile)
            evaluated = {
                **source_item,
                "description": source_item.get("description", ""),
                "price": source_item.get("price", ""),
                "status": STATUS_LABELS[category],
                "category": category,
                "confidence": confidence_for(category, evidence, support),
                "score": score,
                "summary": summary_for(category, evidence),
                "evidence": evidence,
                "sourceTrace": source_item.get("sourceTrace") or "ai-vision",
                "ocrSupport": support,
                **instructions,
                "ingredients": [source_item.get("description") or source_item.get("name") or ""],
                "tags": [ev.get("canonical") for ev in evidence if ev.get("canonical")],
            }
            items.append(evaluated)
        items.sort(key=lambda item: (STATUS_RANK.get(item["category"], 9), -(item.get("score") or 0), item.get("name") or ""))
        sections.append({"title": section.get("name") or section.get("title") or "Menu", "items": items})
    return {
        "engineVersion": ENGINE_VERSION,
        "title": menu.get("restaurantName") or "Uploaded menu",
        "sections": sections,
        "items": [item for section in sections for item in section.get("items", [])],
        "counts": count_categories(sections),
        "recommendedOrder": build_recommendation(sections, normalized_profile),
    }
