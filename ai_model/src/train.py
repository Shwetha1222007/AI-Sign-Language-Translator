from __future__ import annotations

from pathlib import Path

import numpy as np


DATASET_DIR = Path(__file__).resolve().parents[1] / "dataset"
MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_DIR.mkdir(exist_ok=True)


def build_synthetic_dataset(num_samples: int = 16) -> tuple[np.ndarray, np.ndarray]:
    """Create a deterministic synthetic dataset for initial training scaffolding."""
    features = np.random.rand(num_samples, 42).astype(np.float32)
    labels = np.array([i % 5 for i in range(num_samples)], dtype=np.int32)
    return features, labels


def train_placeholder_model() -> dict:
    """Placeholder training function that prepares a simple model artifact structure."""
    features, labels = build_synthetic_dataset()
    return {
        "status": "ready",
        "feature_shape": list(features.shape),
        "labels_shape": list(labels.shape),
        "output_path": str(MODEL_DIR / "placeholder_model.npz"),
    }
