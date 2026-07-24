import io
import unittest
from unittest.mock import patch

from fastapi import HTTPException

from server import extract_menu_with_render_fallback, render_pdf_uploads

MENU = {
    "restaurantName": "Rendered Cafe",
    "sections": [{"name": "Mains", "items": [{"name": "Pot Roast"}]}],
    "restaurantNotes": [],
}


def image_only_pdf_bytes():
    """A one-page PDF that is just a picture — no text layer at all."""
    from PIL import Image

    buffer = io.BytesIO()
    Image.new("RGB", (400, 300), (245, 240, 230)).save(buffer, format="PDF")
    return buffer.getvalue()


def upload_data(pdf_text="", with_pdf=True, images=None):
    return {
        "images": images or [],
        "filenames": ["menu.pdf"],
        "pdfText": pdf_text,
        "pdfFiles": [{"filename": "menu.pdf", "data": image_only_pdf_bytes()}] if with_pdf else [],
    }


class RenderPdfUploadsTests(unittest.TestCase):
    def test_renders_pages_as_jpeg_images(self):
        images = render_pdf_uploads([{"filename": "menu.pdf", "data": image_only_pdf_bytes()}])
        self.assertEqual(len(images), 1)
        self.assertTrue(images[0]["dataUrl"].startswith("data:image/jpeg;base64,"))
        self.assertIn("page 1", images[0]["filename"])

    def test_corrupt_pdf_is_skipped(self):
        images = render_pdf_uploads([{"filename": "bad.pdf", "data": b"not a pdf"}])
        self.assertEqual(images, [])


class RenderFallbackFlowTests(unittest.TestCase):
    def test_textless_pdf_goes_straight_to_vision(self):
        with patch("server.extract_menu_with_ai", return_value=(MENU, "openai-vision-evidence")) as extract:
            menu, parser_used, pdf_text = extract_menu_with_render_fallback(upload_data(pdf_text=""), "", "{}", "Menu")
        self.assertEqual(parser_used, "openai-pdf-render-vision")
        self.assertEqual(pdf_text, "")
        self.assertEqual(menu["restaurantName"], "Rendered Cafe")
        # The vision call received rendered page images, not an empty list.
        rendered_images = extract.call_args.args[0]
        self.assertTrue(rendered_images and rendered_images[0]["mime"] == "image/jpeg")

    def test_garbage_text_layer_falls_back_to_vision_after_422(self):
        garbage = " ".join(["zx9q"] * 60)  # enough words to try the text path first
        calls = [HTTPException(status_code=422, detail="no structure"), (MENU, "openai-vision-evidence")]

        def side_effect(*args, **kwargs):
            result = calls.pop(0)
            if isinstance(result, HTTPException):
                raise result
            return result

        with patch("server.extract_menu_with_ai", side_effect=side_effect):
            menu, parser_used, pdf_text = extract_menu_with_render_fallback(upload_data(pdf_text=garbage), "", "{}", "Menu")
        self.assertEqual(parser_used, "openai-pdf-render-vision")
        self.assertEqual(pdf_text, "")
        self.assertEqual(menu["restaurantName"], "Rendered Cafe")

    def test_good_text_path_is_untouched(self):
        text = "Grilled Chicken $12\nHouse Salad $8\n" * 20
        with patch("server.extract_menu_with_ai", return_value=(MENU, "openai-pdf-text-fallback")) as extract:
            menu, parser_used, pdf_text = extract_menu_with_render_fallback(upload_data(pdf_text=text), "", "{}", "Menu")
        self.assertEqual(parser_used, "openai-pdf-text-fallback")
        self.assertEqual(pdf_text, text)
        self.assertEqual(extract.call_count, 1)

    def test_photo_scan_errors_do_not_trigger_render(self):
        with patch("server.extract_menu_with_ai", side_effect=HTTPException(status_code=422, detail="no structure")):
            with self.assertRaises(HTTPException):
                extract_menu_with_render_fallback(
                    upload_data(pdf_text="", with_pdf=False, images=[{"filename": "a.jpg", "mime": "image/jpeg", "dataUrl": "data:image/jpeg;base64,x"}]),
                    "",
                    "{}",
                    "Menu",
                )

    def test_unrenderable_pdf_raises_honest_422(self):
        data = {"images": [], "filenames": ["menu.pdf"], "pdfText": "", "pdfFiles": [{"filename": "menu.pdf", "data": b"not a pdf"}]}
        with self.assertRaises(HTTPException) as ctx:
            extract_menu_with_render_fallback(data, "", "{}", "Menu")
        self.assertEqual(ctx.exception.status_code, 422)
        self.assertIn("photos", str(ctx.exception.detail))


if __name__ == "__main__":
    unittest.main()
