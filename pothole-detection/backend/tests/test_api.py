"""
tests/test_api.py — FastAPI endpoint tests using httpx + pytest.

Run:  pytest tests/ -v
"""

import io
import pytest
from httpx import AsyncClient, ASGITransport
from PIL import Image

# Import app — this triggers model loading (demo mode if no .h5 found)
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from main import app


def make_fake_image(width=64, height=64, color=(120, 80, 60)) -> bytes:
    """Create a tiny in-memory JPEG for test uploads."""
    img = Image.new("RGB", (width, height), color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "mode" in data


@pytest.mark.asyncio
async def test_predict_returns_valid_schema():
    img_bytes = make_fake_image()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post(
            "/predict",
            files={"file": ("road.jpg", img_bytes, "image/jpeg")},
        )
    assert r.status_code == 200
    data = r.json()
    assert "label" in data
    assert "pothole" in data
    assert "confidence" in data
    assert "severity" in data
    assert "coordinates" in data
    assert isinstance(data["pothole"], bool)
    assert 0 <= data["confidence"] <= 100
    assert data["severity"] in ("High", "Medium", "Low", "None")


@pytest.mark.asyncio
async def test_predict_rejects_non_image():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post(
            "/predict",
            files={"file": ("doc.pdf", b"%PDF fake", "application/pdf")},
        )
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_stats_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/stats")
    assert r.status_code == 200
    data = r.json()
    assert "total_scans" in data
    assert "potholes_found" in data


@pytest.mark.asyncio
async def test_predict_confidence_range():
    """Confidence should always be between 0–100."""
    for color in [(50, 50, 50), (200, 200, 200), (100, 150, 80)]:
        img_bytes = make_fake_image(color=color)
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            r = await client.post(
                "/predict",
                files={"file": ("road.jpg", img_bytes, "image/jpeg")},
            )
        data = r.json()
        assert 0 <= data["confidence"] <= 100, f"Out-of-range confidence: {data['confidence']}"
