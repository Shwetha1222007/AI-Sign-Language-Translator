import pytest
import os
import sys
from fastapi.testclient import TestClient
from pathlib import Path

# Add project root and backend dir to path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))
sys.path.append(str(PROJECT_ROOT / "backend"))

from app.main import app
from app.database import clear_all_translations

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    # Before each test, clear the database history to ensure isolation
    clear_all_translations()
    yield
    # After each test, clean up
    clear_all_translations()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "signspeak-ai-backend"
    assert "db_records" in data

def test_model_info():
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "SignSpeak ISL-Net v1.0"
    assert "supported_classes" in data
    assert isinstance(data["supported_classes"], list)

def test_history_endpoints():
    # Verify history is initially empty
    response = client.get("/history")
    assert response.status_code == 200
    assert len(response.json()) == 0

def test_predict_endpoint_missing_image():
    # Predict without image should fail
    response = client.post("/predict", json={"confidence_threshold": 0.5})
    assert response.status_code == 400
    assert "image_url is required" in response.json()["detail"]

def test_predict_endpoint_invalid_image():
    # Predict with garbage base64
    response = client.post("/predict", json={"image_url": "garbage_base64_data", "confidence_threshold": 0.5})
    assert response.status_code == 400
    
    from app.inference import engine
    if engine.is_ready:
        assert response.json()["detail"] == "Invalid image data."
    else:
        assert response.json()["detail"] == "Model not loaded. Server configuration error."
