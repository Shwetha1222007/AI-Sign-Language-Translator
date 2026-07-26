"""
preprocessing.py

Purpose: Data preprocessing, landmark normalization, and dataset preparation module
for Indian Sign Language (ISL) gesture recognition.

Responsibilities:
  1. Landmark Normalization (translation + scale invariant coordinate transform)
  2. Dataset Loader (reads all CSV files in dataset/raw/)
  3. Train/Val/Test Splitter & Label Encoder (saves models/classes.json)
"""

import os
import json
import csv
from pathlib import Path
from typing import Sequence, Tuple, List, Dict, Union
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATASET_RAW_DIR = PROJECT_ROOT / "dataset" / "raw"
MODELS_DIR = PROJECT_ROOT / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# 1. Landmark Normalization
# ---------------------------------------------------------------------------
def normalize_landmarks(landmarks: Union[Sequence[Sequence[float]], np.ndarray]) -> np.ndarray:
    """
    Normalizes 21 2D hand landmark coordinates (x, y) relative to wrist position (landmark 0)
    and scales by maximum Euclidean distance to achieve scale and position invariance.

    Args:
        landmarks: List or array of 21 (x, y) coordinates or flat 42 array.

    Returns:
        1D float32 numpy array of shape (42,).
    """
    array = np.array(landmarks, dtype=np.float32)

    if array.size == 42:
        array = array.reshape(21, 2)
    elif array.ndim == 2 and array.shape[1] >= 2:
        array = array[:, :2]  # take x, y ignoring z if present
    else:
        raise ValueError(f"Expected landmarks shape (21, 2) or (42,), got shape {array.shape}")

    # Translate relative to wrist (Landmark 0)
    wrist = array[0]
    normalized = array - wrist

    # Scale normalize by max distance from wrist
    max_dist = np.max(np.linalg.norm(normalized, axis=1))
    if max_dist > 1e-6:
        normalized = normalized / max_dist

    return normalized.flatten().astype(np.float32)


# ---------------------------------------------------------------------------
# 2. Dataset Loader
# ---------------------------------------------------------------------------
def load_dataset(data_dir: Path = DATASET_RAW_DIR) -> Tuple[np.ndarray, np.ndarray]:
    """
    Reads all gesture CSV files from dataset/raw/ and combines them into feature matrix X
    and label vector y.

    Args:
        data_dir: Directory containing raw landmark CSV files.

    Returns:
        Tuple (X, y):
          X: float32 numpy array of shape (N, 42)
          y: string numpy array of shape (N,) containing class names
    """
    if not data_dir.exists():
        raise FileNotFoundError(f"Raw dataset directory not found at: {data_dir}")

    csv_files = list(data_dir.glob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV dataset files found in: {data_dir}")

    all_features: List[np.ndarray] = []
    all_labels: List[str] = []

    for csv_file in csv_files:
        with open(csv_file, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None)
            if not header:
                continue

            for row in reader:
                if not row or len(row) < 43:
                    continue
                try:
                    features = [float(val) for val in row[:42]]
                    label = str(row[42]).strip()
                    all_features.append(features)
                    all_labels.append(label)
                except ValueError:
                    continue

    if not all_features:
        raise ValueError(f"No valid landmark samples extracted from CSV files in {data_dir}")

    X = np.array(all_features, dtype=np.float32)
    y = np.array(all_labels, dtype=str)

    print(f"[INFO] Loaded dataset: {X.shape[0]} samples across {len(np.unique(y))} unique classes.")
    return X, y


# ---------------------------------------------------------------------------
# 3. Data Splitter & Label Encoder
# ---------------------------------------------------------------------------
def prepare_train_test_data(
    test_size: float = 0.15,
    val_size: float = 0.15,
    random_state: int = 42,
    save_label_map: bool = True
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, LabelEncoder]:
    """
    Loads raw CSV dataset, encodes string labels to integer targets, splits data into
    Train, Validation, and Test sets, and saves class mapping to models/classes.json.

    Returns:
        Tuple: (X_train, X_val, X_test, y_train, y_val, y_test, label_encoder)
    """
    X, y = load_dataset()

    # Label encoding
    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)
    classes = encoder.classes_.tolist()

    # Save class dictionary mapping to models/classes.json for dynamic inference
    if save_label_map:
        classes_path = MODELS_DIR / "classes.json"
        class_map = {idx: label for idx, label in enumerate(classes)}
        with open(classes_path, "w", encoding="utf-8") as f:
            json.dump({
                "classes": classes,
                "index_to_label": class_map,
                "total_classes": len(classes),
                "num_features": 42
            }, f, indent=2)
        print(f"[INFO] Saved class mapping ({len(classes)} classes) to {classes_path}")

    # First split: train + val vs test
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X, y_encoded, test_size=test_size, random_state=random_state, stratify=y_encoded
    )

    # Second split: train vs val
    val_relative_size = val_size / (1.0 - test_size)
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=val_relative_size, random_state=random_state, stratify=y_train_val
    )

    print(f"[INFO] Data Split Complete:")
    print(f"       - Train set:      {X_train.shape[0]} samples")
    print(f"       - Validation set: {X_val.shape[0]} samples")
    print(f"       - Test set:       {X_test.shape[0]} samples")

    return X_train, X_val, X_test, y_train, y_val, y_test, encoder


# ---------------------------------------------------------------------------
# Test / Verification Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    X_train, X_val, X_test, y_train, y_val, y_test, encoder = prepare_train_test_data()
    print("[SUCCESS] Preprocessing module test verified successfully!")
