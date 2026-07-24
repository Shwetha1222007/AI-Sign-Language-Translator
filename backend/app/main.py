"""
main.py

Purpose: FastAPI application entry point for the SignSpeak AI backend.

Endpoints:
  GET  /health              → Service health check
  GET  /model/info          → AI model metadata
  POST /predict             → Run sign gesture inference (saves to DB)
  GET  /history             → Retrieve recent translation history from SQLite
  DELETE /history/{id}      → Delete a single translation record
  DELETE /history           → Clear all translation records
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
import os
from pathlib import Path

from app.database import (
    init_db,
    insert_translation,
    get_all_translations,
    delete_translation,
    clear_all_translations,
    get_translation_count,
)

# ---------------------------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parents[1]
LOGS_DIR = ROOT_DIR / "logs"
LOGS_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    handlers=[
        logging.FileHandler(LOGS_DIR / "backend.log"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger("signspeak_backend")

# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SignSpeak AI API",
    description="Real-time Indian Sign Language translation backend",
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Startup Event: Initialize Database
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup() -> None:
    """Initialize SQLite database on server startup."""
    try:
        init_db()
        count = get_translation_count()
        logger.info("Database ready. Existing records: %d", count)
    except Exception as exc:
        logger.critical("FATAL: Could not initialize database: %s", exc)
        raise


# ---------------------------------------------------------------------------
# Request / Response Schemas
# ---------------------------------------------------------------------------

class PredictionRequest(BaseModel):
    image_url: Optional[str] = Field(
        default=None,
        description="Base64-encoded JPEG frame from webcam or an image URL"
    )
    confidence_threshold: float = Field(
        default=0.6,
        ge=0.0,
        le=1.0,
        description="Minimum confidence required to return a prediction"
    )


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    message: str
    record_id: Optional[int] = None


class TranslationRecord(BaseModel):
    id: int
    prediction: str
    confidence: float
    created_at: str


class ClearResponse(BaseModel):
    deleted_count: int
    message: str


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["System"])
def health_check() -> dict:
    """Returns service status. Used by Navbar for online/offline indicator."""
    logger.info("Health check requested")
    return {
        "status": "ok",
        "service": "signspeak-ai-backend",
        "version": "1.1.0",
        "db_records": get_translation_count(),
    }


# ---------------------------------------------------------------------------
# Model Info
# ---------------------------------------------------------------------------

@app.get("/model/info", tags=["AI Model"])
def model_info() -> dict:
    """Returns static model metadata. Will be dynamic once the real model is integrated."""
    return {
        "model_name": "SignSpeak ISL-Net v1.0",
        "framework": "TensorFlow 2.x / MediaPipe Hands",
        "status": "placeholder — real model integration in Feature 3",
        "supported_classes": ["Hello", "Thank You", "Help", "Yes", "No", "Peace", "I Love You", "Friend"],
        "input_shape": "42 landmark features (21 keypoints × 2D x/y)",
    }


# ---------------------------------------------------------------------------
# Prediction Endpoint
# ---------------------------------------------------------------------------

@app.post("/predict", response_model=PredictionResponse, tags=["AI Model"])
def predict(request: PredictionRequest) -> PredictionResponse:
    """
    Accepts a base64 image frame, runs sign inference, and saves the result to SQLite.

    NOTE: Real MediaPipe + TensorFlow inference is implemented in Feature 2 & 3.
    This endpoint currently uses placeholder inference logic but saves real records.
    """
    logger.info(
        "Prediction request received. Frame provided: %s, Threshold: %.2f",
        request.image_url is not None,
        request.confidence_threshold,
    )

    # -----------------------------------------------------------------------
    # Placeholder Inference
    # Replace this block in Feature 3 with real MediaPipe + TensorFlow logic.
    # -----------------------------------------------------------------------
    placeholder_labels = ["Hello", "Thank You", "Help", "Yes", "No", "Peace", "I Love You", "Friend"]
    placeholder_confidence = 0.92

    if request.image_url:
        # In the future: decode base64 → OpenCV → MediaPipe → TensorFlow
        # For now: deterministic hash of image length for reproducibility
        image_len = len(request.image_url)
        label_index = image_len % len(placeholder_labels)
        prediction = placeholder_labels[label_index]
        confidence = round(0.88 + (image_len % 12) * 0.01, 4)  # 0.88–0.99
    else:
        prediction = placeholder_labels[0]  # Default: "Hello"
        confidence = placeholder_confidence

    # Reject if below user-defined threshold
    if confidence < request.confidence_threshold:
        raise HTTPException(
            status_code=422,
            detail=f"Prediction confidence {confidence:.2%} is below threshold {request.confidence_threshold:.2%}"
        )

    # Persist to SQLite
    try:
        record = insert_translation(prediction=prediction, confidence=confidence)
        logger.info("Saved prediction: %s (%.2f%%)", prediction, confidence * 100)
    except Exception as exc:
        logger.error("Failed to persist prediction: %s", exc)
        # Non-fatal: return result even if DB write fails
        record = {"id": None}

    return PredictionResponse(
        prediction=prediction,
        confidence=confidence,
        message="Prediction completed successfully",
        record_id=record.get("id"),
    )


# ---------------------------------------------------------------------------
# History Endpoints
# ---------------------------------------------------------------------------

@app.get("/history", response_model=List[TranslationRecord], tags=["History"])
def get_history(limit: int = 100) -> List[TranslationRecord]:
    """
    Retrieve translation history from SQLite, newest first.
    Query param: ?limit=N (default 100, max enforced by DB layer)
    """
    try:
        records = get_all_translations(limit=min(limit, 500))
        logger.info("Returned %d history records", len(records))
        return [TranslationRecord(**r) for r in records]
    except Exception as exc:
        logger.error("Failed to fetch history: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to retrieve history")


@app.delete("/history/{record_id}", tags=["History"])
def remove_history_item(record_id: int) -> dict:
    """Delete a single translation record by its ID."""
    try:
        deleted = delete_translation(record_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Record id={record_id} not found")
        logger.info("Deleted history record id=%d", record_id)
        return {"message": f"Record {record_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to delete record %d: %s", record_id, exc)
        raise HTTPException(status_code=500, detail="Failed to delete record")


@app.delete("/history", response_model=ClearResponse, tags=["History"])
def clear_history() -> ClearResponse:
    """Delete ALL translation records from the database."""
    try:
        count = clear_all_translations()
        logger.info("Cleared all history. %d records removed.", count)
        return ClearResponse(
            deleted_count=count,
            message=f"Cleared {count} translation records"
        )
    except Exception as exc:
        logger.error("Failed to clear history: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to clear history")
