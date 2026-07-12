import asyncio
import base64
import io
import os
import unittest

from fastapi import HTTPException
from starlette.datastructures import Headers, UploadFile

from server import normalize_upload_image, read_uploads, resolve_upload_mime


def make_upload(filename, content_type, data):
    return UploadFile(
        io.BytesIO(data),
        filename=filename,
        headers=Headers({"content-type": content_type}),
    )


def jpeg_bytes(width=100, height=80, color=(200, 40, 40)):
    from PIL import Image

    buffer = io.BytesIO()
    Image.new("RGB", (width, height), color).save(buffer, format="JPEG")
    return buffer.getvalue()


class UploadGuardTests(unittest.TestCase):
    def run_read(self, files):
        return asyncio.run(read_uploads(files))

    def test_valid_jpeg_is_accepted_and_normalized(self):
        result = self.run_read([make_upload("menu.jpg", "image/jpeg", jpeg_bytes())])
        self.assertEqual(len(result["images"]), 1)
        self.assertTrue(result["images"][0]["dataUrl"].startswith("data:image/jpeg;base64,"))

    def test_huge_image_is_downscaled(self):
        os.environ["AI_IMAGE_MAX_SIDE_PX"] = "500"
        try:
            result = self.run_read([make_upload("big.jpg", "image/jpeg", jpeg_bytes(3000, 2000))])
        finally:
            os.environ.pop("AI_IMAGE_MAX_SIDE_PX", None)
        from PIL import Image

        encoded = result["images"][0]["dataUrl"].split(",", 1)[1]
        with Image.open(io.BytesIO(base64.b64decode(encoded))) as image:
            self.assertLessEqual(max(image.size), 500)

    def test_too_many_files_rejected_413(self):
        files = [make_upload(f"p{i}.jpg", "image/jpeg", jpeg_bytes()) for i in range(13)]
        with self.assertRaises(HTTPException) as ctx:
            self.run_read(files)
        self.assertEqual(ctx.exception.status_code, 413)

    def test_oversized_file_rejected_413(self):
        os.environ["AI_MAX_UPLOAD_MB"] = "1"
        try:
            big = jpeg_bytes() + b"\x00" * (2 * 1024 * 1024)
            with self.assertRaises(HTTPException) as ctx:
                self.run_read([make_upload("huge.jpg", "image/jpeg", big)])
            self.assertEqual(ctx.exception.status_code, 413)
        finally:
            os.environ.pop("AI_MAX_UPLOAD_MB", None)

    def test_unknown_type_rejected_415(self):
        with self.assertRaises(HTTPException) as ctx:
            self.run_read([make_upload("notes.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", b"docx bytes")])
        self.assertEqual(ctx.exception.status_code, 415)

    def test_extension_rescues_generic_content_type(self):
        result = self.run_read([make_upload("photo.jpg", "application/octet-stream", jpeg_bytes())])
        self.assertEqual(len(result["images"]), 1)

    def test_empty_file_is_skipped(self):
        result = self.run_read([make_upload("empty.jpg", "image/jpeg", b"")])
        self.assertEqual(result["images"], [])
        self.assertEqual(result["filenames"], [])


class NormalizeUploadImageTests(unittest.TestCase):
    def test_exif_rotation_is_applied(self):
        from PIL import Image

        buffer = io.BytesIO()
        image = Image.new("RGB", (120, 60), (10, 120, 60))
        exif = image.getexif()
        exif[274] = 6  # orientation: rotate 90 CW
        image.save(buffer, format="JPEG", exif=exif)

        data, mime = normalize_upload_image(buffer.getvalue(), "image/jpeg")
        with Image.open(io.BytesIO(data)) as result:
            self.assertEqual(result.size, (60, 120))
        self.assertEqual(mime, "image/jpeg")

    def test_undecodable_provider_safe_bytes_pass_through(self):
        data, mime = normalize_upload_image(b"not a real image", "image/png")
        self.assertEqual(data, b"not a real image")
        self.assertEqual(mime, "image/png")

    def test_undecodable_heic_rejected_415(self):
        with self.assertRaises(HTTPException) as ctx:
            normalize_upload_image(b"not a real heic", "image/heic")
        self.assertEqual(ctx.exception.status_code, 415)

    def test_resolve_upload_mime_by_extension(self):
        self.assertEqual(resolve_upload_mime("IMG_1234.HEIC", ""), "image/heic")
        self.assertEqual(resolve_upload_mime("menu.pdf", "application/octet-stream"), "application/pdf")
        self.assertEqual(resolve_upload_mime("weird.xyz", ""), "application/octet-stream")


if __name__ == "__main__":
    unittest.main()
