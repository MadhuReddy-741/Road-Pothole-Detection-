"""
PotholeAI - FastAPI Backend
Handles image upload, CNN inference, and geolocation tagging.
"""

import io
import os
import random
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from pydantic import BaseModel
from typing import Optional

# ── App Setup ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="PotholeAI API",
    description="CNN-based road pothole detection REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model Loading ──────────────────────────────────────────────────────────────
MODEL = None
IMG_SIZE = (64, 64)
MODEL_PATH = os.getenv("MODEL_PATH", "model/pothole_model.h5")

def load_model():
    """Load the Keras CNN model. Falls back to mock mode if not found."""
    global MODEL
    try:
        import tensorflow as tf
        if os.path.exists(MODEL_PATH):
            MODEL = tf.keras.models.load_model(MODEL_PATH)
            print(f"✅ Model loaded from {MODEL_PATH}")
        else:
            print(f"⚠️  Model file not found at {MODEL_PATH} — running in DEMO mode")
    except ImportError:
        print("⚠️  TensorFlow not installed — running in DEMO mode")
    except Exception as e:
        print(f"⚠️  Model load error: {e} — running in DEMO mode")

load_model()

# ── Schemas ────────────────────────────────────────────────────────────────────
class PredictionResponse(BaseModel):
    label: str
    pothole: bool
    confidence: float
    severity: str
    coordinates: dict
    model_mode: str
    note: Optional[str] = None


# ── Helpers ────────────────────────────────────────────────────────────────────
def preprocess_image(img_bytes: bytes) -> np.ndarray:
    """Convert raw bytes → normalised numpy array (1, 64, 64, 3)."""
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def get_severity(confidence: float) -> str:
    if confidence >= 85:
        return "High"
    elif confidence >= 65:
        return "Medium"
    return "Low"


def mock_prediction(img_bytes: bytes) -> dict:
    """
    Deterministic mock based on image bytes hash — used when model is absent.
    Replace with real model call once model/pothole_model.h5 is present.
    """
    seed = sum(img_bytes[:64]) % 100
    is_pothole = seed > 35          # ~65% chance of pothole
    confidence = round(60 + (seed % 38) + random.uniform(0, 2), 1)
    return {
        "pothole": is_pothole,
        "confidence": confidence if is_pothole else round(100 - confidence, 1),
    }


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": MODEL is not None,
        "mode": "inference" if MODEL else "demo",
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    img_bytes = await file.read()
    if len(img_bytes) > 10 * 1024 * 1024:      # 10 MB cap
        raise HTTPException(status_code=413, detail="Image too large (max 10 MB).")

    # ── Real inference ─────────────────────────────────────────────────────────
    if MODEL is not None:
        try:
            arr = preprocess_image(img_bytes)
            raw = float(MODEL.predict(arr, verbose=0)[0][0])
            # Sigmoid output: >0.5 = pothole
            is_pothole = raw > 0.5
            confidence = round((raw if is_pothole else 1 - raw) * 100, 1)
            mode = "inference"
            note = None
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    # ── Demo / mock mode ───────────────────────────────────────────────────────
    else:
        pred = mock_prediction(img_bytes)
        is_pothole = pred["pothole"]
        confidence = pred["confidence"]
        mode = "demo"
        note = "Demo mode — place your trained model at model/pothole_model.h5 for real inference"

    # ── Build response ─────────────────────────────────────────────────────────
    label = "Pothole Detected" if is_pothole else "Road Clear"
    severity = get_severity(confidence) if is_pothole else "None"

    # Simulated GPS — replace with real device coords from request body
    coordinates = {
        "lat": round(17.385 + random.uniform(-0.5, 0.5), 4),
        "lng": round(78.486 + random.uniform(-0.5, 0.5), 4),
    }

    return PredictionResponse(
        label=label,
        pothole=is_pothole,
        confidence=confidence,
        severity=severity,
        coordinates=coordinates,
        model_mode=mode,
        note=note,
    )


@app.get("/stats")
def stats():
    """Return mock dashboard stats — replace with DB queries in production."""
    return {
        "total_scans": 1247,
        "potholes_found": 384,
        "avg_confidence": 88.3,
        "roads_clear": 863,
        "severity_breakdown": {"High": 38, "Medium": 45, "Low": 17},
    }
