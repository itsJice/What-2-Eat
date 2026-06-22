import unittest

from dine_dna_engine import evaluate_menu
from server import add_coverage_notes, apply_ocr_coverage, mock_menu, normalize_menu


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

    def test_price_conflict_adds_confirmation(self):
        menu = normalize_menu(mock_menu())
        coverage_menu, support, _, price_conflicts = apply_ocr_coverage(menu, "Classic Burger $99\nFrench Fries $4\nSide Salad $5")
        evaluated = add_coverage_notes(evaluate_menu(coverage_menu, {}, {}, support), price_conflicts)
        burger = next(item for item in evaluated["items"] if item["name"] == "Classic Burger")
        self.assertTrue(any("Confirm price" in item for item in burger["confirm"]))


if __name__ == "__main__":
    unittest.main()
