"""
inference.py — Run pothole detection on a single image from the command line.

Usage:
    python inference.py --image ./road.jpg
    python inference.py --image ./road.jpg --model ./model/pothole_model.h5
"""

import argparse
import sys
import numpy as np
from pathlib import Path

parser = argparse.ArgumentParser(description="PotholeAI CLI Inference")
parser.add_argument("--image",  required=True,                         help="Path to road image")
parser.add_argument("--model",  default="./model/pothole_model.h5",   help="Path to .h5 model")
parser.add_argument("--size",   type=int, default=64,                  help="Model input size")
args = parser.parse_args()

img_path   = Path(args.image)
model_path = Path(args.model)

# Validate inputs
if not img_path.exists():
    print(f"❌ Image not found: {img_path}")
    sys.exit(1)

if not model_path.exists():
    print(f"❌ Model not found: {model_path}")
    print("   Train a model first:  python train_model.py --data_dir ./dataset")
    sys.exit(1)

# Load model
print(f"\n🔄 Loading model from {model_path}...")
import tensorflow as tf
model = tf.keras.models.load_model(str(model_path))
print("✅ Model loaded")

# Preprocess image
from PIL import Image
img = Image.open(img_path).convert("RGB").resize((args.size, args.size))
arr = np.array(img, dtype=np.float32) / 255.0
arr = np.expand_dims(arr, axis=0)

# Inference
print(f"\n🔍 Analysing: {img_path.name}")
raw = float(model.predict(arr, verbose=0)[0][0])

is_pothole  = raw > 0.5
confidence  = (raw if is_pothole else 1 - raw) * 100
label       = "Pothole Detected ⚠️" if is_pothole else "Road Clear ✅"

if confidence >= 85:
    severity = "HIGH"
elif confidence >= 65:
    severity = "MEDIUM"
else:
    severity = "LOW"

print(f"\n{'─'*40}")
print(f"  Result     : {label}")
print(f"  Confidence : {confidence:.1f}%")
print(f"  Severity   : {severity if is_pothole else 'N/A'}")
print(f"  Raw score  : {raw:.4f}")
print(f"{'─'*40}\n")
