import unittest
from unittest.mock import patch

from dine_dna_engine import evaluate_menu
from server import (
    add_coverage_notes,
    apply_explanation_rewrite,
    apply_ocr_coverage,
    build_scan_response,
    clean_menu_item_name,
    extract_menu_with_ai,
    mock_menu,
    normalize_menu,
    sanitize_user_text_fields,
)


class ScanContractTests(unittest.TestCase):
    def test_mock_menu_builds_evaluated_menu_contract(self):
        menu = normalize_menu(mock_menu())
        ocr_text = "Classic Burger $12\nFrench Fries $4\nSide Salad $5\nExtra OCR Taco $9"
        coverage_menu, support, coverage, price_conflicts = apply_ocr_coverage(menu, ocr_text)
        evaluated = add_coverage_notes(
            evaluate_menu(coverage_menu, {"avoidFoods": ["Gluten / Wheat"], "healthNeeds": ["Avoid Shared Fryers"]}, {}, support),
            price_conflicts,
        )

        self.assertEqual(evaluated["engineVersion"], "dine-dna-engine-1")
        self.assertIn("counts", evaluated)
        self.assertTrue(evaluated["sections"])
        self.assertTrue(evaluated["recommendedOrder"])
        self.assertTrue(all("evidence" in item for item in evaluated["items"]))
        self.assertTrue(coverage["checked"])
        self.assertGreaterEqual(coverage["ocrOnlyCount"], 1)
        self.assertFalse(any(section["title"] == "Needs a second look" for section in evaluated["sections"]))

    def test_price_conflict_adds_confirmation(self):
        menu = normalize_menu(mock_menu())
        coverage_menu, support, _, price_conflicts = apply_ocr_coverage(menu, "Classic Burger $99\nFrench Fries $4\nSide Salad $5")
        evaluated = add_coverage_notes(evaluate_menu(coverage_menu, {}, {}, support), price_conflicts)
        burger = next(item for item in evaluated["items"] if item["name"] == "Classic Burger")
        self.assertTrue(any("Confirm the price" in item for item in burger["confirm"]))

    def test_ocr_support_notes_stay_internal(self):
        menu = normalize_menu({
            "restaurantName": "Test Menu",
            "sections": [
                {
                    "name": "Mains",
                    "items": [
                        {"name": "AI Only Salad", "description": "greens and vinaigrette", "price": "$10"},
                    ],
                },
            ],
        })
        evaluated = evaluate_menu(menu, {}, {}, {"AI Only Salad": "unsupported"})
        item = evaluated["items"][0]

        self.assertFalse(any("OCR" in note for note in item["notes"]))
        self.assertFalse(any("OCR" in confirm for confirm in item["confirm"]))

    def test_pdf_artifact_item_names_are_cleaned(self):
        self.assertEqual(clean_menu_item_name("a nd Y ’s s tea K *"), "Andy's Steak*")
        self.assertEqual(clean_menu_item_name("chicK en c ritters ® b as K et"), "Chicken Critters® Basket")
        self.assertEqual(clean_menu_item_name("gRilled bbQ chicKen"), "Grilled BBQ Chicken")
        self.assertEqual(clean_menu_item_name("cOuntrY Fried chicKen"), "Country Fried Chicken")
        self.assertEqual(clean_menu_item_name("sMoked s alMon b owl"), "Smoked Salmon Bowl")
        self.assertEqual(clean_menu_item_name("rOasted v eggie p late"), "Roasted Veggie Plate")

        menu = normalize_menu({
            "restaurantName": "Texas Roadhouse",
            "sections": [
                {
                    "name": "Kids Meals",
                    "items": [
                        {"name": "a nd Y ’s s tea K *", "description": "USDA choice sirloin steak", "price": "8.99"},
                    ],
                },
            ],
        })

        self.assertEqual(menu["sections"][0]["items"][0]["name"], "Andy's Steak*")

    def test_ai_evidence_is_normalized_and_used_by_engine(self):
        menu = normalize_menu({
            "restaurantName": "Evidence Cafe",
            "sections": [
                {
                    "name": "Mains",
                    "items": [
                        {
                            "name": "Tempura Shrimp Bowl",
                            "description": "Shrimp over rice with sauce",
                            "price": "$16",
                            "category": "safe",
                            "likelyIngredients": [{"name": "shrimp", "source": "description", "confidence": "high"}],
                            "possibleRisks": [
                                {
                                    "term": "tempura breading",
                                    "restriction": "wheat",
                                    "role": "core",
                                    "source": "inferred",
                                    "certainty": "medium",
                                    "message": "Tempura breading usually includes wheat.",
                                }
                            ],
                        }
                    ],
                }
            ],
        })

        self.assertIn("aiEvidence", menu["sections"][0]["items"][0])
        evaluated = evaluate_menu(menu, {"avoidFoods": ["Gluten / Wheat"]})
        item = evaluated["items"][0]

        self.assertEqual(item["category"], "swap_required")
        self.assertTrue(any(ev["source"] == "ai_evidence" for ev in item["evidence"]))
        self.assertNotEqual(item["category"], "safe")

    def test_ai_evidence_does_not_override_unrelated_profile(self):
        menu = normalize_menu({
            "restaurantName": "Evidence Cafe",
            "sections": [
                {
                    "name": "Mains",
                    "items": [
                        {
                            "name": "Tempura Shrimp Bowl",
                            "description": "Shrimp over rice with sauce",
                            "price": "$16",
                            "possibleRisks": [{"term": "tempura breading", "restriction": "wheat", "role": "core"}],
                        }
                    ],
                }
            ],
        })

        evaluated = evaluate_menu(menu, {"avoidFoods": ["Dairy"]})

        self.assertEqual(evaluated["items"][0]["category"], "safe")

    def test_explanation_rewrite_cannot_change_verdict_fields(self):
        evaluated = evaluate_menu(
            normalize_menu({
                "restaurantName": "Evidence Cafe",
                "sections": [{"name": "Mains", "items": [{"name": "Cheese Burger", "description": "beef patty with cheese", "price": "$12"}]}],
            }),
            {"avoidFoods": ["Dairy"]},
        )
        before = evaluated["items"][0]
        rewritten = apply_explanation_rewrite(evaluated, {
            "items": [
                {
                    "name": "Cheese Burger",
                    "category": "safe",
                    "status": "Safe to Order As-Is",
                    "score": 100,
                    "summary": "Ask for it without cheese.",
                    "remove": ["cheese"],
                    "confirm": [],
                    "substitutions": [],
                    "notes": [],
                }
            ],
            "recommendedOrder": {"summary": "Cheese Burger", "instructions": ["Ask for it without cheese."]},
        })
        after = rewritten["items"][0]

        self.assertEqual(after["category"], before["category"])
        self.assertEqual(after["status"], before["status"])
        self.assertEqual(after["score"], before["score"])
        self.assertEqual(after["summary"], "Ask for it without cheese.")

    def test_user_facing_debug_phrases_are_removed(self):
        evaluated = {
            "items": [
                {
                    "name": "Test Salad",
                    "summary": "AI saw this in the image, but OCR coverage did not support it clearly.",
                    "conflicts": [],
                    "confirm": ["Confirm item name and details; OCR did not clearly catch this line."],
                    "remove": [],
                    "substitutions": [],
                    "notes": ["Needs a second look because OCR saw it outside the AI-structured result."],
                }
            ],
            "sections": [
                {
                    "title": "Menu",
                    "items": [
                        {
                            "name": "Test Salad",
                            "summary": "AI saw this in the image, but OCR coverage did not support it clearly.",
                            "conflicts": [],
                            "confirm": ["Confirm item name and details; OCR did not clearly catch this line."],
                            "remove": [],
                            "substitutions": [],
                            "notes": ["Needs a second look because OCR saw it outside the AI-structured result."],
                        }
                    ],
                }
            ],
            "recommendedOrder": {"summary": "AI saw this", "instructions": ["OCR coverage did not support it clearly."]},
        }

        cleaned = sanitize_user_text_fields(evaluated)
        rendered = str(cleaned).lower()

        self.assertNotIn("ocr", rendered)
        self.assertNotIn("ai saw this", rendered)
        self.assertNotIn("needs a second look", rendered)
        self.assertNotIn("coverage did not support", rendered)

    def test_scan_response_builder_evaluates_menu(self):
        response = build_scan_response(
            menu=normalize_menu(mock_menu()),
            profile={"avoidFoods": ["Gluten / Wheat"]},
            source_label="Test PDF",
            source_id="test-pdf",
            parser_used="openai-pdf-live",
            estimated_charge=0.03,
            month="2026-06",
            spent=0.0,
            monthly_cap=5.0,
            pdf_text="Classic Burger $12\nFrench Fries $4\nSide Salad $5",
        )

        self.assertEqual(response["sourceName"], "Test PDF")
        self.assertEqual(response["parserUsed"], "openai-pdf-live")
        self.assertIn("evaluatedMenu", response)
        self.assertIn("aiEvidence", response)
        self.assertIn(response["explanationSource"], {"engine", "ai_rewrite", "engine_fallback"})
        self.assertTrue(response["evaluatedMenu"]["items"])
        self.assertTrue(response["evaluatedMenu"]["counts"])

    def test_pdf_only_scan_uses_pdf_extraction_prompt(self):
        with patch("server.call_openai") as vision_call, patch("server.call_openai_pdf_fallback") as pdf_call:
            pdf_call.return_value = {
                "restaurantName": "PDF Menu",
                "sections": [
                    {
                        "name": "Mains",
                        "items": [
                            {"name": "Grilled Chicken", "description": "chicken breast", "price": "$12"},
                        ],
                    }
                ],
                "restaurantNotes": [],
            }

            menu, parser_used = extract_menu_with_ai(
                images=[],
                ocr_text="",
                profile_json="{}",
                filenames=["menu.pdf"],
                pdf_text="Mains\nGrilled Chicken chicken breast $12",
                fallback_title="PDF Menu",
            )

        vision_call.assert_not_called()
        pdf_call.assert_called_once()
        self.assertEqual(parser_used, "openai-pdf-text-fallback")
        self.assertEqual(menu["sections"][0]["items"][0]["name"], "Grilled Chicken")

    def test_large_pdf_scan_chunks_and_merges_sections(self):
        large_pdf_text = "Kids Meals\nChicken Critters $6\n" + ("filler line\n" * 700) + "Sides\nBaked Potato $3\n"
        with patch("server.call_openai") as vision_call, patch("server.call_openai_pdf_fallback") as pdf_call:
            pdf_call.side_effect = [
                {
                    "restaurantName": "PDF Menu",
                    "sections": [{"name": "Kids Meals", "items": [{"name": "Chicken Critters", "description": "fried chicken", "price": "$6"}]}],
                    "restaurantNotes": [],
                },
                {
                    "restaurantName": "PDF Menu",
                    "sections": [{"name": "Sides", "items": [{"name": "Baked Potato", "description": "potato", "price": "$3"}]}],
                    "restaurantNotes": [],
                },
            ]

            menu, parser_used = extract_menu_with_ai(
                images=[],
                ocr_text="",
                profile_json="{}",
                filenames=["menu.pdf"],
                pdf_text=large_pdf_text,
                fallback_title="PDF Menu",
            )

        vision_call.assert_not_called()
        self.assertGreaterEqual(pdf_call.call_count, 2)
        self.assertEqual(parser_used, "openai-pdf-text-fallback")
        self.assertEqual([section["name"] for section in menu["sections"]], ["Kids Meals", "Sides"])


if __name__ == "__main__":
    unittest.main()
