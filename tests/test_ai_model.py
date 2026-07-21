import unittest
import numpy as np

from ai_model.src.preprocessing import normalize_landmarks
from ai_model.src.train import build_synthetic_dataset, train_placeholder_model
from ai_model.src.inference import SignInferenceEngine


class PreprocessingTests(unittest.TestCase):
    def test_normalize_landmarks_returns_expected_shape(self):
        landmarks = [[0.1, 0.2, 0.3], [0.2, 0.3, 0.4]]
        normalized = normalize_landmarks(landmarks)

        self.assertIsInstance(normalized, np.ndarray)
        self.assertEqual(normalized.shape, (2, 3))
        self.assertTrue(np.allclose(normalized[0], [0.1, 0.2, 0.3]))

    def test_normalize_landmarks_handles_single_row(self):
        normalized = normalize_landmarks([[0.5, 0.6, 0.7]])
        self.assertEqual(normalized.shape, (1, 3))


class TrainingAndInferenceTests(unittest.TestCase):
    def test_synthetic_dataset_shape(self):
        features, labels = build_synthetic_dataset(8)
        self.assertEqual(features.shape, (8, 42))
        self.assertEqual(labels.shape, (8,))

    def test_placeholder_training_summary(self):
        summary = train_placeholder_model()
        self.assertEqual(summary["status"], "ready")
        self.assertEqual(summary["feature_shape"], [16, 42])

    def test_inference_engine_returns_prediction(self):
        engine = SignInferenceEngine()
        result = engine.predict([0.1] * 42)
        self.assertIn(result["prediction"], engine.labels)
        self.assertGreaterEqual(result["confidence"], 0.0)


if __name__ == "__main__":
    unittest.main()
