import json
import os
import unittest
from unittest.mock import MagicMock, patch

from fastapi import HTTPException

from server import (
    condense_backup_text,
    extract_menu_with_ai,
    normalize_menu,
    repair_json_text,
    request_openai_json,
    try_parse_json_text,
)

VALID_MENU = {
    "restaurantName": "Test Cafe",
    "sections": [{"name": "Mains", "items": [{"name": "Veggie Bowl", "description": "rice and beans", "price": "$9"}]}],
    "restaurantNotes": [],
}


def fake_response(status_code=200, output_text="", payload_status="completed"):
    response = MagicMock()
    response.status_code = status_code
    response.text = output_text
    response.json.return_value = {
        "status": payload_status,
        "output": [{"content": [{"text": output_text}]}],
    }
    return response


class JsonRepairTests(unittest.TestCase):
    def test_parses_clean_json(self):
        self.assertEqual(try_parse_json_text(json.dumps(VALID_MENU)), VALID_MENU)

    def test_parses_fenced_json(self):
        fenced = "```json\n" + json.dumps(VALID_MENU) + "\n```"
        self.assertEqual(try_parse_json_text(fenced), VALID_MENU)

    def test_parses_json_wrapped_in_prose(self):
        wrapped = "Here is the menu you asked for:\n" + json.dumps(VALID_MENU) + "\nLet me know if you need more."
        self.assertEqual(try_parse_json_text(wrapped), VALID_MENU)

    def test_repairs_trailing_commas(self):
        broken = '{"restaurantName": "Cafe", "sections": [{"name": "Mains", "items": [{"name": "Soup"},]},]}'
        parsed = try_parse_json_text(broken)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed["sections"][0]["items"][0]["name"], "Soup")

    def test_repairs_truncated_json(self):
        full = json.dumps(VALID_MENU)
        truncated = full[: int(len(full) * 0.7)]
        parsed = repair_json_text(truncated)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed.get("restaurantName"), "Test Cafe")

    def test_repairs_json_cut_mid_string(self):
        truncated = '{"restaurantName": "Cafe", "sections": [{"name": "Mains", "items": [{"name": "Grilled Chick'
        parsed = repair_json_text(truncated)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed.get("restaurantName"), "Cafe")

    def test_garbage_returns_none(self):
        self.assertIsNone(try_parse_json_text("I could not read the menu, sorry."))
        self.assertIsNone(try_parse_json_text(""))


class RequestOpenAiJsonTests(unittest.TestCase):
    def setUp(self):
        os.environ["AI_RETRY_BACKOFF_SECONDS"] = "0"
        os.environ["OPENAI_API_KEY"] = "test-key"

    def tearDown(self):
        os.environ.pop("AI_RETRY_BACKOFF_SECONDS", None)

    def body(self):
        return {
            "model": "test",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "extract"}]}],
            "max_output_tokens": 1000,
        }

    def test_valid_response_returned_first_try(self):
        with patch("server.requests.post", return_value=fake_response(200, json.dumps(VALID_MENU))) as post:
            result = request_openai_json(self.body())
        self.assertEqual(result, VALID_MENU)
        self.assertEqual(post.call_count, 1)

    def test_retries_after_server_error(self):
        responses = [fake_response(500, "boom"), fake_response(200, json.dumps(VALID_MENU))]
        with patch("server.requests.post", side_effect=responses) as post:
            result = request_openai_json(self.body())
        self.assertEqual(result, VALID_MENU)
        self.assertEqual(post.call_count, 2)

    def test_retries_after_timeout(self):
        import requests as requests_lib

        responses = [requests_lib.exceptions.Timeout(), fake_response(200, json.dumps(VALID_MENU))]
        with patch("server.requests.post", side_effect=responses) as post:
            result = request_openai_json(self.body())
        self.assertEqual(result, VALID_MENU)
        self.assertEqual(post.call_count, 2)

    def test_reasks_after_unparseable_reply(self):
        responses = [fake_response(200, "Sorry, here you go!"), fake_response(200, json.dumps(VALID_MENU))]
        with patch("server.requests.post", side_effect=responses) as post:
            result = request_openai_json(self.body())
        self.assertEqual(result, VALID_MENU)
        self.assertEqual(post.call_count, 2)
        # The re-ask must carry a strengthened JSON-only instruction.
        second_body = post.call_args_list[1].kwargs["json"]
        self.assertIn("valid JSON", second_body["input"][0]["content"][0]["text"])

    def test_truncated_reply_retries_with_bigger_budget(self):
        full = json.dumps(VALID_MENU)
        # Cut hard mid-key so mechanical repair cannot salvage a dict.
        responses = [
            fake_response(200, '{"restaurantName": "Test Cafe", "secti', payload_status="incomplete"),
            fake_response(200, full),
        ]
        with patch("server.requests.post", side_effect=responses) as post:
            result = request_openai_json(self.body())
        self.assertEqual(result, VALID_MENU)
        second_body = post.call_args_list[1].kwargs["json"]
        self.assertGreater(second_body["max_output_tokens"], 1000)

    def test_exhausted_attempts_raise_honest_502(self):
        with patch("server.requests.post", return_value=fake_response(200, "no json here")):
            with self.assertRaises(HTTPException) as ctx:
                request_openai_json(self.body())
        self.assertEqual(ctx.exception.status_code, 502)
        self.assertNotIn("Traceback", str(ctx.exception.detail))

    def test_auth_failure_maps_to_503_without_provider_text(self):
        with patch("server.requests.post", return_value=fake_response(401, "raw provider secret text")):
            with self.assertRaises(HTTPException) as ctx:
                request_openai_json(self.body())
        self.assertEqual(ctx.exception.status_code, 503)
        self.assertNotIn("raw provider", str(ctx.exception.detail))

    def test_missing_key_raises_503(self):
        os.environ.pop("OPENAI_API_KEY", None)
        try:
            with self.assertRaises(HTTPException) as ctx:
                request_openai_json(self.body())
            self.assertEqual(ctx.exception.status_code, 503)
        finally:
            os.environ["OPENAI_API_KEY"] = "test-key"


class NormalizeMenuToleranceTests(unittest.TestCase):
    def test_bare_string_items_are_wrapped(self):
        menu = normalize_menu({"sections": [{"name": "Mains", "items": ["Grilled Chicken", "Veggie Soup"]}]})
        names = [item["name"] for item in menu["sections"][0]["items"]]
        self.assertEqual(names, ["Grilled Chicken", "Veggie Soup"])

    def test_unnamed_section_with_items_defaults_to_menu(self):
        menu = normalize_menu({"sections": [{"items": [{"name": "House Salad"}]}]})
        self.assertEqual(menu["sections"][0]["name"], "Menu")

    def test_non_dict_sections_and_items_are_skipped(self):
        menu = normalize_menu({
            "sections": [
                "not a section",
                {"name": "Mains", "items": [42, None, {"name": "Real Dish"}]},
            ],
        })
        self.assertEqual(len(menu["sections"]), 1)
        self.assertEqual(menu["sections"][0]["items"][0]["name"], "Real Dish")

    def test_fully_malformed_menu_raises_422(self):
        for bad in ({}, {"sections": "nope"}, {"sections": [{"items": "nope"}]}):
            with self.assertRaises(HTTPException) as ctx:
                normalize_menu(bad)
            self.assertEqual(ctx.exception.status_code, 422)


class ImageBatchingTests(unittest.TestCase):
    def setUp(self):
        os.environ["AI_IMAGE_BATCH_SIZE"] = "2"

    def tearDown(self):
        os.environ.pop("AI_IMAGE_BATCH_SIZE", None)

    def fake_images(self, count):
        return [{"dataUrl": f"data:image/jpeg;base64,img{i}"} for i in range(count)]

    def test_many_pages_are_batched_and_merged(self):
        def per_batch(images, *_args, **_kwargs):
            first = images[0]["dataUrl"]
            return {
                "restaurantName": "Big Menu Place",
                "sections": [{"name": f"Section {first[-4:]}", "items": [{"name": f"Dish {first[-4:]}"}]}],
            }

        with patch("server.call_openai", side_effect=per_batch) as call:
            menu, parser = extract_menu_with_ai(self.fake_images(5), "", "{}", [f"p{i}.jpg" for i in range(5)], "")
        self.assertEqual(call.call_count, 3)  # 2 + 2 + 1
        self.assertEqual(parser, "openai-vision-evidence")
        self.assertEqual(len(menu["sections"]), 3)
        self.assertEqual(menu["restaurantName"], "Big Menu Place")

    def test_single_batch_failure_does_not_kill_the_scan(self):
        results = [
            HTTPException(status_code=502, detail="bad batch"),
            {"restaurantName": "Survivor Cafe", "sections": [{"name": "Mains", "items": [{"name": "Only Dish"}]}]},
            {"restaurantName": "Survivor Cafe", "sections": [{"name": "Sides", "items": [{"name": "Only Side"}]}]},
        ]

        def per_batch(*_args, **_kwargs):
            result = results.pop(0)
            if isinstance(result, HTTPException):
                raise result
            return result

        with patch("server.call_openai", side_effect=per_batch):
            menu, _ = extract_menu_with_ai(self.fake_images(5), "", "{}", [], "")
        self.assertEqual(len(menu["sections"]), 2)

    def test_small_upload_takes_direct_path(self):
        with patch("server.call_openai", return_value=dict(VALID_MENU)) as call:
            menu, _ = extract_menu_with_ai(self.fake_images(2), "", "{}", ["a.jpg", "b.jpg"], "")
        self.assertEqual(call.call_count, 1)
        self.assertEqual(menu["restaurantName"], "Test Cafe")


class CondenseBackupTextTests(unittest.TestCase):
    def test_dedupes_and_collapses(self):
        text = "Burger  $10\nBurger $10\n\n\nFries $4\n"
        condensed = condense_backup_text(text)
        self.assertEqual(condensed, "Burger $10\nFries $4")

    def test_truncates_at_line_boundary_with_marker(self):
        text = "\n".join(f"Menu item number {i} with a description" for i in range(1000))
        condensed = condense_backup_text(text, limit=2000)
        self.assertLess(len(condensed), 2200)
        self.assertIn("[Backup text truncated here", condensed)
        # No mid-word cut on the last real content line before the marker.
        last_content_line = condensed.splitlines()[-2]
        self.assertTrue(last_content_line.endswith("description"), last_content_line)


if __name__ == "__main__":
    unittest.main()
