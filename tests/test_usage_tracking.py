import asyncio
import io
import json
import os
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

import server
from server import (
    AI_USAGE_TRACKER,
    estimate_tracked_cost,
    read_usage,
    record_scan_usage,
    request_openai_json,
)


class TempUsageFileMixin(unittest.TestCase):
    def setUp(self):
        self._tmpdir = tempfile.TemporaryDirectory()
        self._old_usage_file = server.USAGE_FILE
        server.USAGE_FILE = Path(self._tmpdir.name) / "usage.json"

    def tearDown(self):
        server.USAGE_FILE = self._old_usage_file
        self._tmpdir.cleanup()


class RecordScanUsageTests(TempUsageFileMixin):
    def test_records_scan_and_charge(self):
        month_usage = record_scan_usage(0.0123)
        self.assertEqual(month_usage["scans"], 1)
        self.assertAlmostEqual(month_usage["estimatedSpendUsd"], 0.0123)

    def test_concurrent_scans_all_counted(self):
        threads = [threading.Thread(target=record_scan_usage, args=(0.01,)) for _ in range(12)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        usage = read_usage()
        month = server.current_month()
        self.assertEqual(usage["months"][month]["scans"], 12)
        self.assertAlmostEqual(usage["months"][month]["estimatedSpendUsd"], 0.12, places=6)


class EstimateTrackedCostTests(unittest.TestCase):
    def test_cost_math_uses_env_pricing(self):
        os.environ["AI_INPUT_COST_PER_1M_USD"] = "1.00"
        os.environ["AI_OUTPUT_COST_PER_1M_USD"] = "2.00"
        try:
            cost = estimate_tracked_cost([
                {"inputTokens": 500_000, "outputTokens": 250_000},
                {"inputTokens": 100_000, "outputTokens": 0},
            ])
        finally:
            os.environ.pop("AI_INPUT_COST_PER_1M_USD", None)
            os.environ.pop("AI_OUTPUT_COST_PER_1M_USD", None)
        # (600k * $1 + 250k * $2) / 1M = 0.6 + 0.5
        self.assertAlmostEqual(cost, 1.1)

    def test_empty_entries_cost_zero(self):
        self.assertEqual(estimate_tracked_cost([]), 0.0)


class UsageTrackerTests(unittest.TestCase):
    def test_request_openai_json_tracks_provider_usage(self):
        os.environ["OPENAI_API_KEY"] = "test-key"
        response = MagicMock()
        response.status_code = 200
        response.json.return_value = {
            "status": "completed",
            "usage": {"input_tokens": 1200, "output_tokens": 340},
            "output": [{"content": [{"text": json.dumps({"ok": True})}]}],
        }
        tracker: list = []
        token = AI_USAGE_TRACKER.set(tracker)
        try:
            with patch("server.requests.post", return_value=response):
                request_openai_json({"model": "m", "input": [{"role": "user", "content": [{"type": "input_text", "text": "x"}]}]})
        finally:
            AI_USAGE_TRACKER.reset(token)
        self.assertEqual(tracker, [{"inputTokens": 1200, "outputTokens": 340}])

    def test_no_tracker_set_is_harmless(self):
        os.environ["OPENAI_API_KEY"] = "test-key"
        response = MagicMock()
        response.status_code = 200
        response.json.return_value = {
            "usage": {"input_tokens": 10, "output_tokens": 5},
            "output": [{"content": [{"text": json.dumps({"ok": True})}]}],
        }
        with patch("server.requests.post", return_value=response):
            result = request_openai_json({"model": "m", "input": [{"role": "user", "content": [{"type": "input_text", "text": "x"}]}]})
        self.assertEqual(result, {"ok": True})


class ScanBudgetResponseTests(TempUsageFileMixin):
    def test_mock_scan_reports_budget_without_charging(self):
        from starlette.datastructures import Headers, UploadFile

        os.environ["AI_SCAN_MOCK"] = "1"
        try:
            upload = UploadFile(io.BytesIO(b"x"), filename="menu.txt", headers=Headers({"content-type": "image/jpeg"}))
            # A tiny fake JPEG won't decode; normalize passes provider-safe bytes through.
            result = asyncio.run(
                server.scan_menu(files=[upload], ocr_text="", profile_json="{}", source_label="test", source_id="t1")
            )
        finally:
            os.environ["AI_SCAN_MOCK"] = "1"
        budget = result["budget"]
        self.assertEqual(budget["estimatedChargeUsd"], 0.0)
        self.assertIn("scanCount", budget)
        self.assertIn("tokenUsage", budget)
        # Mock scans must not be written to the usage file as spend.
        month = server.current_month()
        months = read_usage().get("months", {})
        self.assertEqual(float(months.get(month, {}).get("estimatedSpendUsd", 0.0)), 0.0)


if __name__ == "__main__":
    unittest.main()
