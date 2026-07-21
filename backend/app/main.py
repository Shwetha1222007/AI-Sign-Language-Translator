from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
import os
from pathlib import Path

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

app = FastAPI(
    title="SignSpeak AI API",
    description="Real-time sign language translation backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    image_url: Optional[str] = Field(default=None, description="Optional image URL for inference")
    confidence_threshold: float = Field(default=0.6, ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    message: str


class TranslationRecord(BaseModel):
    id: int
    prediction: str
    confidence: float
    created_at: str


@app.get("/health")
def health_check() -> dict:
    logger.info("Health check requested")
    return {"status": "ok", "service": "signspeak-ai-backend"}


@app.get("/model/info")
def model_info() -> dict:
    return {
        "model_name": "SignSpeak AI",
        "framework": "TensorFlow / MediaPipe",
        "status": "ready_for_training",
        "supported_classes": ["hello", "thank_you", "help", "yes", "no"],
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    logger.info("Prediction request received")

    if request.image_url:
        logger.info("Image URL provided: %s", request.image_url)

    # Placeholder inference logic for the first backend module.
    prediction = "hello"
    confidence = 0.92

    if confidence < request.confidence_threshold:
        raise HTTPException(status_code=422, detail="Prediction confidence below threshold")

    return PredictionResponse(
        prediction=prediction,
        confidence=confidence,
        message="Prediction completed successfully",
    )


@app.get("/history", response_model=List[TranslationRecord])
def translation_history() -> List[TranslationRecord]:
    return [
        TranslationRecord(
            id=1,
            prediction="hello",
            confidence=0.92,
            created_at="2026-07-21T00:00:00Z",
        )
    ]
