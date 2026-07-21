# SignSpeak AI Project Structure

## Overview
This repository is structured for a production-ready AI sign language translator with clear separation between frontend, backend, AI modeling, data, and deployment concerns.

## Top-Level Folders
- frontend/: React + Vite application
- backend/: FastAPI backend services
- ai_model/: training and inference code for sign recognition
- dataset/: raw and processed datasets
- models/: trained model artifacts
- docs/: documentation and architecture notes
- screenshots/: UI and architecture screenshots
- uploads/: uploaded images/videos for processing
- logs/: runtime logs
- tests/: automated tests
- config/: environment and application configuration
- scripts/: automation helpers
- deployment/: Docker and deployment assets
- assets/: static UI assets

## Module Flow
1. Frontend collects webcam/image input
2. Backend exposes REST APIs for prediction and history
3. AI model performs hand landmark detection and classification
4. Results are stored and served back to the frontend
