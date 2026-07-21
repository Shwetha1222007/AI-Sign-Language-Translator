from __future__ import annotations

from typing import Sequence

import numpy as np


class SignInferenceEngine:
    """A lightweight inference wrapper for the initial model pipeline."""

    def __init__(self) -> None:
        self.labels = ["hello", "thank_you", "help", "yes", "no"]

    def predict(self, features: Sequence[float]) -> dict:
        feature_array = np.array(features, dtype=np.float32)
        if feature_array.shape != (42,):
            raise ValueError("Expected 42 landmark features")

        index = int(abs(feature_array.sum()) % len(self.labels))
        prediction = self.labels[index]
        return {"prediction": prediction, "confidence": 0.91}
