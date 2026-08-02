"""
inference.py

Purpose: Real-time AI Inference Engine for the backend.
Loads the trained MLP model and class mappings, extracts hand landmarks from base64 frames
using MediaPipe, normalizes the features, and predicts the sign language gesture.
"""

import os
import json
import base64
import logging
from pathlib import Path
from typing import Tuple, Optional

import cv2
import numpy as np
import joblib

try:
    import mediapipe as mp
    from mediapipe.solutions import hands as mp_hands
    from mediapipe.solutions.hands import Hands
except Exception as exc:  # pragma: no cover - dependency may be missing in some environments
    mp = None
    mp_hands = None
    Hands = None
    logger = logging.getLogger("signspeak_backend.inference")
    logger.warning("MediaPipe import failed: %s", exc)

logger = logging.getLogger("signspeak_backend.inference")

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODELS_DIR = PROJECT_ROOT / "models"
MODEL_PATH = MODELS_DIR / "isl_model.pkl"
CLASSES_PATH = MODELS_DIR / "classes.json"

class SignLanguageEngine:
    def __init__(self):
        self.model = None
        self.classes_map = {}
        self.is_ready = False
        self.mp_hands = None
        
        try:
            self._initialize_media_pipe()
            self.load_artifacts()
        except Exception as e:
            logger.error(f"Error initializing MediaPipe: {e}")
            self.is_ready = False

    def _initialize_media_pipe(self) -> None:
        """Initialize the MediaPipe hand tracker using the stable solutions API."""
        if mp is None or Hands is None:
            raise RuntimeError("MediaPipe Hands API is not available in this environment")

        self.mp_hands = Hands(
            static_image_mode=True,
            max_num_hands=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        logger.info("Initialized MediaPipe Hands detector")

    def load_artifacts(self):
        """Load trained model and classes mapping."""
        try:
            if not MODEL_PATH.exists() or not CLASSES_PATH.exists():
                logger.error("Model artifacts not found. Please run ai_model/src/train.py first.")
                return

            self.model = joblib.load(MODEL_PATH)
            
            with open(CLASSES_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.classes_map = data.get("index_to_label", {})

            self.is_ready = True
            logger.info("Successfully loaded AI model and class mapping.")
        except Exception as e:
            logger.error(f"Failed to load AI artifacts: {e}")

    def normalize_landmarks(self, hand_landmarks) -> np.ndarray:
        """Extract and normalize 42 features from MediaPipe landmarks."""
        raw_coords = []
        if hasattr(hand_landmarks, "landmark"):
            landmarks = hand_landmarks.landmark
        elif hasattr(hand_landmarks, "landmarks"):
            landmarks = hand_landmarks.landmarks
        else:
            raise ValueError("Unknown hand landmark format")

        for lm in landmarks:
            raw_coords.append([lm.x, lm.y])

        coords_np = np.array(raw_coords, dtype=np.float32)
        wrist = coords_np[0]
        normalized = coords_np - wrist

        max_dist = np.max(np.linalg.norm(normalized, axis=1))
        if max_dist > 1e-6:
            normalized = normalized / max_dist

        return normalized.flatten().astype(np.float32)

    def process_base64_image(self, base64_str: str) -> Optional[np.ndarray]:
        """Convert base64 image string to OpenCV BGR image."""
        try:
            # Remove data URI prefix if present
            if "base64," in base64_str:
                base64_str = base64_str.split("base64,")[1]
            
            img_data = base64.b64decode(base64_str)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            logger.error(f"Base64 decode error: {e}")
            return None

    def predict(self, base64_image: str) -> Tuple[Optional[str], float, str]:
        """
        Main inference method.
        Returns: (prediction_string, confidence_float, debug_message)
        """
        if not self.is_ready:
            return None, 0.0, "Model not loaded. Server configuration error."

        img = self.process_base64_image(base64_image)
        if img is None:
            return None, 0.0, "Invalid image data."

        # Convert BGR to RGB for MediaPipe
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if self.mp_hands is None:
            return None, 0.0, "MediaPipe hand tracker is not available."

        if self.mp_hands is None:
            return None, 0.0, "MediaPipe hand tracker is not available."

        results = self.mp_hands.process(rgb_img)
        if not getattr(results, "multi_hand_landmarks", None):
            return None, 0.0, "No hand detected in the frame."

        hand_landmarks = results.multi_hand_landmarks[0]

        features = self.normalize_landmarks(hand_landmarks)

        # Run model inference
        # MLP predict_proba returns array of shape (1, num_classes)
        probabilities = self.model.predict_proba([features])[0]
        best_class_idx = np.argmax(probabilities)
        confidence = float(probabilities[best_class_idx])
        
        # Map integer class back to string label
        prediction = self.classes_map.get(str(best_class_idx), "Unknown")
        
        return prediction, confidence, "Success"

# Create a singleton instance to be used by the FastAPI router
engine = SignLanguageEngine()
