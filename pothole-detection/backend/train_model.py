"""
train_model.py — Train the PotholeAI CNN from scratch.

Usage:
    python train_model.py --data_dir ./dataset --epochs 25 --batch_size 32

Dataset folder structure expected:
    dataset/
      train/
        pothole/      ← images of potholes
        no_pothole/   ← images of clear roads
      validation/
        pothole/
        no_pothole/
"""

import argparse
import os
import matplotlib.pyplot as plt
import numpy as np

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard
)

# ── CLI Args ───────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Train PotholeAI CNN")
parser.add_argument("--data_dir",   default="./dataset",        help="Root dataset directory")
parser.add_argument("--model_out",  default="./model/pothole_model.h5")
parser.add_argument("--img_size",   type=int, default=64,        help="Image width/height (square)")
parser.add_argument("--epochs",     type=int, default=25)
parser.add_argument("--batch_size", type=int, default=32)
parser.add_argument("--lr",         type=float, default=1e-3,   help="Initial learning rate")
args = parser.parse_args()

IMG_SIZE   = (args.img_size, args.img_size)
BATCH      = args.batch_size
EPOCHS     = args.epochs
TRAIN_DIR  = os.path.join(args.data_dir, "train")
VAL_DIR    = os.path.join(args.data_dir, "validation")
MODEL_OUT  = args.model_out

os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)

print(f"\n{'='*50}")
print(f"  PotholeAI — CNN Training")
print(f"  Image size : {IMG_SIZE}")
print(f"  Epochs     : {EPOCHS}")
print(f"  Batch size : {BATCH}")
print(f"  Train dir  : {TRAIN_DIR}")
print(f"  Val dir    : {VAL_DIR}")
print(f"{'='*50}\n")

# ── Data Generators ────────────────────────────────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    zoom_range=0.15,
    horizontal_flip=True,
    brightness_range=[0.7, 1.3],
    fill_mode="nearest",
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH,
    class_mode="binary",
    shuffle=True,
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH,
    class_mode="binary",
    shuffle=False,
)

print(f"\nClass indices: {train_gen.class_indices}")
print(f"Training samples  : {train_gen.samples}")
print(f"Validation samples: {val_gen.samples}\n")

# ── Model Architecture ─────────────────────────────────────────────────────────
def build_model(input_shape=(64, 64, 3)) -> tf.keras.Model:
    model = models.Sequential([
        # Block 1
        layers.Conv2D(32, (3, 3), activation="relu", padding="same", input_shape=input_shape),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.25),

        # Block 2
        layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.25),

        # Block 3
        layers.Conv2D(128, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.3),

        # Classifier head
        layers.Flatten(),
        layers.Dense(256, activation="relu"),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(1, activation="sigmoid"),   # Binary: pothole vs no_pothole
    ])
    return model


model = build_model(input_shape=(*IMG_SIZE, 3))
model.summary()

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=args.lr),
    loss="binary_crossentropy",
    metrics=["accuracy", tf.keras.metrics.AUC(name="auc")],
)

# ── Callbacks ──────────────────────────────────────────────────────────────────
callbacks = [
    ModelCheckpoint(
        MODEL_OUT,
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1,
    ),
    EarlyStopping(
        monitor="val_accuracy",
        patience=7,
        restore_best_weights=True,
        verbose=1,
    ),
    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.3,
        patience=4,
        min_lr=1e-6,
        verbose=1,
    ),
    TensorBoard(log_dir="./logs", histogram_freq=1),
]

# ── Training ───────────────────────────────────────────────────────────────────
history = model.fit(
    train_gen,
    epochs=EPOCHS,
    validation_data=val_gen,
    callbacks=callbacks,
    verbose=1,
)

# ── Evaluation ─────────────────────────────────────────────────────────────────
print("\n📊 Final Evaluation on Validation Set:")
loss, acc, auc = model.evaluate(val_gen, verbose=0)
print(f"  Loss     : {loss:.4f}")
print(f"  Accuracy : {acc*100:.2f}%")
print(f"  AUC      : {auc:.4f}")
print(f"\n✅ Model saved to: {MODEL_OUT}")

# ── Plot Training Curves ───────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(history.history["accuracy"],     label="Train")
axes[0].plot(history.history["val_accuracy"], label="Validation")
axes[0].set_title("Accuracy")
axes[0].set_xlabel("Epoch")
axes[0].legend()
axes[0].grid(alpha=0.3)

axes[1].plot(history.history["loss"],     label="Train")
axes[1].plot(history.history["val_loss"], label="Validation")
axes[1].set_title("Loss")
axes[1].set_xlabel("Epoch")
axes[1].legend()
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.savefig("training_curves.png", dpi=150)
print("📈 Training curves saved to training_curves.png")
