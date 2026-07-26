# AI-Powered Indian Sign Language (ISL) Translator

![SignSpeak AI](https://img.shields.io/badge/Project-SignSpeak_AI-00D4FF?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MediaPipe](https://img.shields.io/badge/Computer_Vision-MediaPipe-00D4FF?style=for-the-badge)
![Scikit-Learn](https://img.shields.io/badge/Machine_Learning-Scikit_Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)

A production-ready, full-stack AI web application that recognizes Indian Sign Language (ISL) from a live webcam feed, translates gestures into text in real-time, and optionally converts the translated text into speech.

## Features

*   **Real-time AI Inference**: Leverages OpenCV and MediaPipe Hands to track 21 2D hand keypoints at 30+ FPS, translating gestures using a highly optimized Neural Network classifier.
*   **Modern Web UI**: A beautiful, responsive glassmorphism UI built with React, Vite, and Tailwind CSS.
*   **Translation History**: Tracks past translations with confidence scores, saved persistently in a SQLite database via FastAPI.
*   **Text-to-Speech (TTS)**: Built-in Web Speech API integration to speak translations aloud.

## Project Structure

```
├── ai_model/         # Data collection, preprocessing, and neural network training pipeline
├── backend/          # FastAPI server, SQLite database, and real-time inference engine
├── dataset/          # Raw collected MediaPipe landmarks (CSV format)
├── frontend/         # React + Vite web application
├── models/           # Compiled AI model artifacts (.pkl, .json)
└── tests/            # API Integration tests
```

## Setup Instructions

### 1. Backend & AI Model (Python)
Install dependencies using Python 3.10+:
```bash
pip install -r requirements.txt
```

To run the backend FastAPI server:
```bash
cd backend
python run.py
```
The backend API will be available at `http://localhost:8000`.

### 2. Frontend (Node.js)
Navigate to the frontend directory and install NPM packages:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend UI will be available at `http://localhost:3000`.

## Training Your Own AI Model

You can collect your own ISL datasets and re-train the model easily:

1. **Collect Data**: Run `python ai_model/src/collect_data.py` to record hand gestures from your webcam into `dataset/raw/`.
2. **Train Model**: Run `python ai_model/src/train.py` to process the landmarks, split datasets, and train a new `isl_model.pkl`.

## License
MIT License
