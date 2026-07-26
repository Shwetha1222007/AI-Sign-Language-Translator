"""
collect_data.py

Purpose: Interactive data collection script for Indian Sign Language (ISL) gestures.
Captures live webcam feed, extracts 21 MediaPipe hand landmarks (42 normalized x,y coordinates),
and saves samples to CSV files in dataset/raw/<label>.csv for model training.

Usage:
  python ai_model/src/collect_data.py [--label LABEL] [--samples N]

Keyboard Controls in Window:
  's' - Start / Stop recording frames for current label
  'n' - Switch to next label preset
  'c' - Clear current label samples counter
  'q' or ESC - Exit program
"""

import os
import sys
import time
import argparse
from pathlib import Path
import csv
import numpy as np
import cv2
import mediapipe as mp

# ---------------------------------------------------------------------------
# Directory Setup
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATASET_RAW_DIR = PROJECT_ROOT / "dataset" / "raw"
DATASET_RAW_DIR.mkdir(parents=True, exist_ok=True)

# Default preset gesture labels for ISL translation
DEFAULT_PRESET_LABELS = [
    "Hello",
    "Thank You",
    "Help",
    "Yes",
    "No",
    "Peace",
    "I Love You",
    "Friend",
    "A",
    "B",
    "C"
]

# ---------------------------------------------------------------------------
# Landmark Normalization Helper
# ---------------------------------------------------------------------------
def extract_normalized_landmarks(hand_landmarks) -> list[float]:
    """
    Extract 21 (x, y) coordinates from MediaPipe hand landmarks and normalize
    them relative to the wrist (landmark 0) to ensure translation and scale invariance.

    Returns:
        List of 42 floats: [x0, y0, x1, y1, ..., x20, y20]
    """
    raw_coords = []
    for lm in hand_landmarks.landmark:
        raw_coords.append([lm.x, lm.y])

    coords_np = np.array(raw_coords, dtype=np.float32)  # Shape: (21, 2)

    # 1. Translate relative to wrist (Landmark 0)
    wrist = coords_np[0]
    coords_normalized = coords_np - wrist

    # 2. Scale normalize by max distance from wrist
    max_dist = np.max(np.linalg.norm(coords_normalized, axis=1))
    if max_dist > 1e-6:
        coords_normalized = coords_normalized / max_dist

    # Flatten to 42 float array
    return coords_normalized.flatten().tolist()


# ---------------------------------------------------------------------------
# Main Collection Loop
# ---------------------------------------------------------------------------
def run_data_collection(preset_labels: list[str], target_samples_per_label: int = 200, camera_id: int = 0):
    """
    Launches webcam window, tracks hand landmarks, and appends rows to CSV files.
    """
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )

    cap = cv2.VideoCapture(camera_id)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video device / camera ID {camera_id}.")
        return

    current_label_idx = 0
    is_recording = False
    last_record_time = 0.0
    record_interval = 0.05  # 20 samples per second max

    print("=" * 60)
    print("      ISL DATA COLLECTION TOOL (MediaPipe + OpenCV)")
    print("=" * 60)
    print("Controls:")
    print("  [S] : Toggle Recording ON/OFF")
    print("  [N] : Next Label Preset")
    print("  [Q] : Quit")
    print("=" * 60)

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("[WARNING] Frame capture failed from camera.")
                break

            # Flip frame horizontally for intuitive self-mirror view
            frame = cv2.flip(frame, 1)
            h, w, c = frame.shape

            # Convert BGR to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb_frame)

            current_label = preset_labels[current_label_idx]
            csv_path = DATASET_RAW_DIR / f"{current_label}.csv"

            # Check existing sample count in CSV
            existing_count = 0
            if csv_path.exists():
                with open(csv_path, "r", encoding="utf-8") as f:
                    existing_count = max(0, sum(1 for _ in f) - 1)  # minus header

            hand_detected = False
            normalized_features = []

            if results.multi_hand_landmarks:
                hand_detected = True
                for hand_landmarks in results.multi_hand_landmarks:
                    # Draw skeletal landmarks on frame
                    mp_drawing.draw_landmarks(
                        frame,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing_styles.get_default_hand_landmarks_style(),
                        mp_drawing_styles.get_default_hand_connections_style()
                    )

                    # Extract normalized 42 features
                    normalized_features = extract_normalized_landmarks(hand_landmarks)

            # Record logic
            now = time.time()
            if is_recording and hand_detected and (now - last_record_time >= record_interval):
                last_record_time = now
                file_exists = csv_path.exists()
                with open(csv_path, "a", newline="", encoding="utf-8") as f:
                    writer = csv.writer(f)
                    if not file_exists:
                        # Write CSV header (x0, y0, ..., x20, y20, label)
                        header = [f"x{i}" if j == 0 else f"y{i}" for i in range(21) for j in range(2)] + ["label"]
                        writer.writerow(header)
                    writer.writerow(normalized_features + [current_label])
                existing_count += 1

                if existing_count >= target_samples_per_label:
                    print(f"[INFO] Target samples ({target_samples_per_label}) reached for '{current_label}'!")
                    is_recording = False

            # -------------------------------------------------------------------
            # HUD Overlay
            # -------------------------------------------------------------------
            # Top banner box
            cv2.rectangle(frame, (0, 0), (w, 90), (18, 18, 26), -1)
            cv2.line(frame, (0, 90), (w, 90), (0, 212, 255), 2)

            # Target Label
            cv2.putText(frame, f"Label [{current_label_idx + 1}/{len(preset_labels)}]: {current_label}",
                        (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

            # Sample count progress
            progress_str = f"Samples: {existing_count} / {target_samples_per_label}"
            cv2.putText(frame, progress_str, (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 212, 255), 2)

            # Status Indicator
            rec_status = "RECORDING..." if is_recording else "PAUSED (Press 'S' to start)"
            rec_color = (0, 0, 255) if is_recording else (128, 128, 128)
            cv2.putText(frame, rec_status, (w - 380, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, rec_color, 2)

            # Hand Detection Indicator
            det_status = "Hand: DETECTED" if hand_detected else "Hand: SEARCHING..."
            det_color = (0, 255, 0) if hand_detected else (0, 165, 255)
            cv2.putText(frame, det_status, (w - 380, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.6, det_color, 2)

            # Render frame
            cv2.imshow("SignSpeak AI - Data Collector", frame)

            # Key handling
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:  # ESC or q
                break
            elif key == ord('s'):
                is_recording = not is_recording
                print(f"[ACTION] Recording set to: {is_recording}")
            elif key == ord('n'):
                current_label_idx = (current_label_idx + 1) % len(preset_labels)
                is_recording = False
                print(f"[ACTION] Switched to next label: {preset_labels[current_label_idx]}")

    finally:
        cap.release()
        cv2.destroyAllWindows()
        hands.close()
        print("[INFO] Data collection script exited cleanly.")


# ---------------------------------------------------------------------------
# CLI Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect ISL Gesture Landmark Dataset")
    parser.add_argument("--labels", nargs="+", default=DEFAULT_PRESET_LABELS, help="List of label names")
    parser.add_argument("--samples", type=int, default=200, help="Target samples per label")
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    args = parser.parse_args()

    run_data_collection(preset_labels=args.labels, target_samples_per_label=args.samples, camera_id=args.camera)
