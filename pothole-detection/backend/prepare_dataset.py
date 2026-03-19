"""
prepare_dataset.py — Organise raw images into train/validation/test splits.

Place your raw images in:
    raw_data/
        pothole/       ← all pothole images
        no_pothole/    ← all clear road images

Run:
    python prepare_dataset.py --raw_dir ./raw_data --out_dir ./dataset

Output:
    dataset/
        train/pothole/        (79%)
        train/no_pothole/
        validation/pothole/   (10%)
        validation/no_pothole/
        test/pothole/         (11%)
        test/no_pothole/
"""

import argparse
import os
import random
import shutil
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--raw_dir",  default="./raw_data")
parser.add_argument("--out_dir",  default="./dataset")
parser.add_argument("--train",    type=float, default=0.79)
parser.add_argument("--val",      type=float, default=0.10)
parser.add_argument("--seed",     type=int,   default=42)
args = parser.parse_args()

random.seed(args.seed)
CLASSES = ["pothole", "no_pothole"]
SPLITS  = {
    "train":      args.train,
    "validation": args.val,
    "test":       round(1 - args.train - args.val, 4),
}

print(f"\n📂 Preparing dataset from: {args.raw_dir}")
print(f"   Splits: {SPLITS}\n")

total_copied = 0
for cls in CLASSES:
    src = Path(args.raw_dir) / cls
    if not src.exists():
        print(f"⚠️  Missing: {src} — skipping")
        continue

    files = [f for f in src.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]
    random.shuffle(files)
    n = len(files)

    n_train = int(n * SPLITS["train"])
    n_val   = int(n * SPLITS["validation"])

    buckets = {
        "train":      files[:n_train],
        "validation": files[n_train:n_train + n_val],
        "test":       files[n_train + n_val:],
    }

    for split, imgs in buckets.items():
        dest = Path(args.out_dir) / split / cls
        dest.mkdir(parents=True, exist_ok=True)
        for img in imgs:
            shutil.copy2(img, dest / img.name)
        print(f"  {split:12s}/{cls:12s} → {len(imgs):4d} images")
        total_copied += len(imgs)

print(f"\n✅ Done. {total_copied} images organised in: {args.out_dir}")
