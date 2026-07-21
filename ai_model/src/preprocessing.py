from __future__ import annotations

from typing import Sequence
import numpy as np


def normalize_landmarks(landmarks: Sequence[Sequence[float]]) -> np.ndarray:
    """Normalize hand landmark coordinates into a stable numpy array."""
    array = np.array(landmarks, dtype=np.float32)
    if array.ndim != 2:
        raise ValueError("Landmarks must be a 2D sequence")
    if array.shape[1] != 3:
        array = array.reshape(-1, 3)
    return array
