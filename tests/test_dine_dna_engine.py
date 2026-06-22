import unittest

from dine_dna_engine import evaluate_menu


def one_item(name, description="", price=""):
    return {
        "restaurantName": "Fixture Cafe",
        "sections": [
            {
                "name": "Mains",
                "items": [{"name": name, "description": description, "price": price}],
            }
        ],
    }


def category_for(menu, profile):
    result = evaluate_menu(menu, profile)
    return result["items"][0]["category"], result["items"][0]


class DineDnaEngineTests(unittest.TestCase):
    def test_gluten_spaghetti_is_avoid(self):
        category, item = category_for(one_item("Spaghetti & Meatballs", "tomato sauce"), {"avoidFoods": ["Gluten / Wheat"]})
        self.assertEqual(category, "avoid")
        self.assertEqual(item["status"], "Don't Order")

    def test_gluten_toasted_ravioli_is_avoid(self):
        category, _ = category_for(one_item("Toasted Ravioli", "marinara"), {"avoidFoods": ["Gluten / Wheat"]})
        self.assertEqual(category, "avoid")

    def test_gluten_gnocchi_is_avoid(self):
        category, item = category_for(one_item("Chicken & Gnocchi", "cream sauce"), {"avoidFoods": ["Gluten / Wheat"]})
        self.assertEqual(category, "avoid")
        self.assertTrue(item["evidence"])

    def test_gluten_burger_on_bun_requires_swap_when_menu_has_salad(self):
        menu = {
            "restaurantName": "Fixture Cafe",
            "sections": [
                {"name": "Mains", "items": [{"name": "Classic Burger", "description": "served on a bun", "price": "$12"}]},
                {"name": "Sides", "items": [{"name": "Side Salad", "description": "mixed greens", "price": "$5"}]},
            ],
        }
        category, _ = category_for(menu, {"avoidFoods": ["Gluten / Wheat"]})
        self.assertEqual(category, "swap_required")

    def test_gluten_rice_bowl_is_safe(self):
        category, _ = category_for(one_item("Chicken Rice Bowl", "rice, pico, avocado"), {"avoidFoods": ["Gluten / Wheat"]})
        self.assertEqual(category, "safe")

    def test_angel_hair_counts_as_gluten_pasta(self):
        category, item = category_for(one_item("Shrimp Scampi", "shrimp tossed with asparagus, tomatoes and angel hair"), {"avoidFoods": ["Gluten / Wheat"]})
        self.assertEqual(category, "avoid")
        self.assertTrue(any(evidence["term"] == "angel hair" for evidence in item["evidence"]))

    def test_breadsticks_and_flatbread_count_as_gluten(self):
        breadsticks_category, _ = category_for(one_item("Soup Salad Breadsticks", "house salad and breadsticks"), {"avoidFoods": ["Gluten / Wheat"]})
        flatbread_category, _ = category_for(one_item("Spinach Artichoke Dip", "cheese served with flatbread crisps"), {"avoidFoods": ["Gluten / Wheat"]})
        self.assertNotEqual(breadsticks_category, "safe")
        self.assertNotEqual(flatbread_category, "safe")

    def test_dairy_cream_soup_is_not_low_effort(self):
        category, item = category_for(one_item("Cream Soup", "cream sauce and parmesan"), {"avoidFoods": ["Dairy"]})
        self.assertIn(category, {"modify", "swap_required", "avoid"})
        self.assertNotEqual(item["category"], "safe")

    def test_dairy_salad_with_feta_is_modify(self):
        category, item = category_for(one_item("Garden Salad", "mixed greens topped with feta"), {"avoidFoods": ["Dairy"]})
        self.assertEqual(category, "modify")
        self.assertIn("feta", item["remove"])

    def test_creamy_and_mozzarella_count_as_dairy(self):
        creamy_category, _ = category_for(one_item("Zuppa Toscana", "sausage, kale and potatoes in a creamy broth"), {"avoidFoods": ["Dairy"]})
        mozzarella_category, item = category_for(one_item("Grilled Chicken Margherita", "topped with mozzarella and basil pesto"), {"avoidFoods": ["Dairy"]})
        self.assertEqual(creamy_category, "avoid")
        self.assertEqual(mozzarella_category, "modify")
        self.assertIn("mozzarella", item["remove"])

    def test_sirloin_with_butter_and_pasta_side_is_modify(self):
        category, item = category_for(
            one_item(
                "6 OZ SIRLOIN*",
                "Grilled 6 oz sirloin topped with garlic herb butter. Served with a side of fettuccine alfredo. 980 cal",
                "$18.99",
            ),
            {"avoidFoods": ["Dairy", "Gluten / Wheat"]},
        )
        self.assertEqual(category, "modify")
        self.assertEqual(item["status"], "Safe With Modifications")
        self.assertIn("butter", item["remove"])
        self.assertIn("Swap the fettuccine alfredo side for another compatible side.", item["substitutions"])
        self.assertTrue(all(evidence["role"] != "core" for evidence in item["evidence"]))

    def test_soy_teriyaki_chicken_needs_sauce_work(self):
        category, item = category_for(one_item("Teriyaki Chicken", "rice and vegetables"), {"avoidFoods": ["Soy"]})
        self.assertIn(category, {"modify", "swap_required", "avoid"})
        self.assertNotEqual(item["category"], "safe")

    def test_peanut_satay_noodles_is_avoid(self):
        category, _ = category_for(one_item("Satay Noodles", "peanut sauce"), {"avoidFoods": ["Peanuts"]})
        self.assertEqual(category, "avoid")

    def test_tree_nut_pesto_pasta_is_not_safe(self):
        category, _ = category_for(one_item("Pesto Pasta", "basil pesto and noodles"), {"avoidFoods": ["Tree Nuts"]})
        self.assertIn(category, {"confirm", "avoid", "swap_required"})

    def test_shellfish_shrimp_scampi_is_avoid(self):
        category, _ = category_for(one_item("Shrimp Scampi", "garlic butter"), {"avoidFoods": ["Shellfish"]})
        self.assertEqual(category, "avoid")

    def test_egg_aioli_is_modify(self):
        category, item = category_for(one_item("Turkey Sandwich", "with aioli"), {"avoidFoods": ["Eggs"]})
        self.assertEqual(category, "modify")
        self.assertIn("aioli", item["remove"])

    def test_sesame_tahini_is_modify(self):
        category, item = category_for(one_item("Falafel Bowl", "with tahini sauce"), {"avoidFoods": ["Sesame"]})
        self.assertEqual(category, "modify")
        self.assertIn("tahini", item["remove"])

    def test_vegan_chicken_alfredo_is_avoid(self):
        category, _ = category_for(one_item("Chicken Alfredo", "cream sauce"), {"eatingStyle": ["Vegan"]})
        self.assertEqual(category, "avoid")

    def test_vegetarian_beef_burger_is_avoid(self):
        category, _ = category_for(one_item("Beef Burger", "lettuce and tomato"), {"eatingStyle": ["Vegetarian"]})
        self.assertEqual(category, "avoid")

    def test_halal_pork_or_wine_is_avoid(self):
        pork_category, _ = category_for(one_item("Pork Chop", ""), {"eatingStyle": ["Halal"]})
        wine_category, _ = category_for(one_item("Wine Sauce Chicken", "white wine sauce"), {"eatingStyle": ["Halal"]})
        self.assertEqual(pork_category, "avoid")
        self.assertEqual(wine_category, "avoid")

    def test_kosher_pork_or_shellfish_is_avoid(self):
        pork_category, _ = category_for(one_item("Bacon Burger", ""), {"eatingStyle": ["Kosher"]})
        shellfish_category, _ = category_for(one_item("Crab Cakes", ""), {"eatingStyle": ["Kosher"]})
        self.assertEqual(pork_category, "avoid")
        self.assertEqual(shellfish_category, "avoid")

    def test_avoid_shared_fryers_fries_ask_first(self):
        category, item = category_for(one_item("French Fries", "fried potatoes"), {"healthNeeds": ["Avoid Shared Fryers"]})
        self.assertEqual(category, "confirm")
        self.assertEqual(item["status"], "Ask Before Ordering")

    def test_no_fried_foods_fried_chicken_avoid(self):
        category, _ = category_for(one_item("Fried Chicken", "crispy breading"), {"healthNeeds": ["No Fried Foods"]})
        self.assertEqual(category, "avoid")

    def test_low_sugar_lowers_score_not_safety(self):
        plain = evaluate_menu(one_item("Chocolate Cake", "sweet dessert"), {})
        low_sugar = evaluate_menu(one_item("Chocolate Cake", "sweet dessert"), {"healthNeeds": ["Low Sugar"]})
        self.assertEqual(low_sugar["items"][0]["category"], "safe")
        self.assertLess(low_sugar["items"][0]["score"], plain["items"][0]["score"])

    def test_dessert_terms_trigger_dairy_and_gluten(self):
        category, item = category_for(one_item("Tiramisu", "creamy custard over espresso-soaked ladyfingers"), {"avoidFoods": ["Dairy", "Gluten / Wheat"]})
        self.assertEqual(category, "avoid")
        self.assertTrue(item["evidence"])

    def test_love_and_dont_love_are_ranking_only(self):
        loved = evaluate_menu(one_item("Chicken Rice Bowl", "rice and vegetables"), {"loveFoods": ["Chicken"]})
        disliked = evaluate_menu(one_item("Chicken Rice Bowl", "rice and vegetables"), {"dontLoveFoods": ["Chicken"]})
        self.assertEqual(loved["items"][0]["category"], "safe")
        self.assertEqual(disliked["items"][0]["category"], "safe")
        self.assertGreater(loved["items"][0]["score"], disliked["items"][0]["score"])


if __name__ == "__main__":
    unittest.main()
