"""
train.py

Purpose: Machine Learning Model Training pipeline for Indian Sign Language (ISL) gestures.
Trains an MLP Neural Network / Random Ensemble model on normalized 42-dimensional MediaPipe hand landmarks.

Outputs:
  - models/isl_model.pkl    (Trained Machine Learning Model Artifact)
  - models/model_info.json  (Model Metadata & Performance Metrics)
"""

import os
import json
import time
from pathlib import Path
import joblib
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

import sys

# ---------------------------------------------------------------------------
# Paths Setup & Imports
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))

from ai_model.src.preprocessing import prepare_train_test_data

MODELS_DIR = PROJECT_ROOT / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Model Training & Evaluation
# ---------------------------------------------------------------------------
def train_model() -> dict:
    """
    Loads preprocessed dataset, trains MLP Neural Classifier, evaluates performance
    on test set, and saves model artifacts to models/ directory.
    """
    print("=" * 60)
    print("       ISL GESTURE RECOGNITION - MODEL TRAINING")
    print("=" * 60)

    # 1. Load preprocessed split data
    X_train, X_val, X_test, y_train, y_val, y_test, encoder = prepare_train_test_data(
        test_size=0.15, val_size=0.15, random_state=42
    )

    classes = encoder.classes_.tolist()
    print(f"\n[INFO] Starting model training for {len(classes)} classes...")
    start_time = time.time()

    # 2. Instantiate Neural Network Classifier (Multi-Layer Perceptron)
    # Architecture: 42 inputs -> 128 -> 64 -> 32 -> N classes
    model = MLPClassifier(
        hidden_layer_sizes=(128, 64, 32),
        activation="relu",
        solver="adam",
        alpha=1e-4,
        batch_size=32,
        learning_rate_init=0.001,
        max_iter=300,
        random_state=42,
        early_stopping=True,
        n_iter_no_change=15,
        verbose=False
    )

    # 3. Train on X_train, y_train
    model.fit(X_train, y_train)
    training_duration = time.time() - start_time
    print(f"[INFO] Training completed in {training_duration:.2f} seconds.")

    # 4. Evaluate on Validation & Test sets
    y_val_pred = model.predict(X_val)
    val_acc = accuracy_score(y_val, y_val_pred)

    y_test_pred = model.predict(X_test)
    test_acc = accuracy_score(y_test, y_test_pred)

    print(f"\n[RESULTS] Validation Accuracy: {val_acc * 100:.2f}%")
    print(f"[RESULTS] Test Accuracy:       {test_acc * 100:.2f}%")

    # Classification metrics report
    report = classification_report(y_test, y_test_pred, target_names=classes, output_dict=True)
    print("\n[CLASSIFICATION REPORT]")
    print(classification_report(y_test, y_test_pred, target_names=classes))

    # 5. Export Model Artifacts
    model_path = MODELS_DIR / "isl_model.pkl"
    joblib.dump(model, model_path)
    print(f"[INFO] Saved trained model to: {model_path}")

    # Export Model Info JSON
    info_path = MODELS_DIR / "model_info.json"
    model_info = {
        "model_name": "ISL-Landmark-Net v1.0",
        "algorithm": "Multi-Layer Perceptron (128-64-32)",
        "features": 42,
        "input_type": "Normalized 21 Hand Keypoint (x, y) Coordinates",
        "num_classes": len(classes),
        "classes": classes,
        "validation_accuracy": round(float(val_acc), 4),
        "test_accuracy": round(float(test_acc), 4),
        "training_time_seconds": round(training_duration, 2),
        "model_file": "isl_model.pkl",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    with open(info_path, "w", encoding="utf-8") as f:
        json.dump(model_info, f, indent=2)
    print(f"[INFO] Saved model info metadata to: {info_path}")

    return model_info


if __name__ == "__main__":
    train_model()
