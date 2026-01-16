# SpeakEZ- Real Time Speech Copilot

SpeakEZ is a privacy-first, real-time speech intelligence system that aligns *what you say* with *how you say it* during live conversations. The platform combines acoustic analysis (delivery metrics), semantic understanding (content intent), and scenario-adaptive agents for instant confidence signals and cognitive cues. Built with React + TypeScript frontend, FastAPI backend with PostgreSQL, on-demand ML APIs, and autonomous agents for persona-based feedback. Emphasis on low-latency WebSocket streaming, privacy-preserving edge processing, and explainable AI insights.

## Features

*   **Live Speech Dashboard**: Real-time confidence score, delivery metrics, and persona-adaptive cues.
*   **Multi-Dimensional Analysis**: Acoustic (stress, pitch, pace, fillers) + semantic (intent, logic gaps) correlation.
*   **Scenario Personas**: Agents for debate, interview, sales pitch, empathy calls with emotion-tone alignment.
*   **Split-Brain Processing**: Fast-track delivery feedback + slow-track semantic reasoning via dual APIs.
*   **Micro-Training Sessions**: On-demand 15-30s loops with progress tracking and AI commentary.
*   **Privacy Controls**: Local processing toggle, anomaly alerts, and secure session export.

## Tech Stack

*   **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Socket.io-client
*   **Backend**: FastAPI, PostgreSQL, Pydantic, SQLAlchemy, Celery (async tasks)
*   **Agents/ML APIs**: LangChain, OpenAI/Groq (on-demand), Whisper for transcription, Custom classifiers
*   **Database**: PostgreSQL (sessions, users, metrics)
*   **Real-time**: WebSockets, Redis (pub/sub)

## Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v20+)
*   [Python](https://www.python.org/) (v3.11+)
*   [PostgreSQL](https://www.postgresql.org/) (v15+)
*   [Redis](https://redis.io/) (for WebSockets/caching)
*   [Vite](https://vitejs.dev/) (bundler)

## Installation & Setup

### 1. Database Setup
1. Create PostgreSQL database: `speakez_db`.
2. Update connection string in env files.

### 2. Backend (FastAPI) Setup
Navigate to backend:
```bash
cd backend
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Create `.env` from `.env.example`:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/speakez_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key
OPENAI_API_KEY=sk-...
ALEMBIC_ENV=production
```
Run migrations:
```bash
alembic upgrade head
```
Start FastAPI server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend (React + TS) Setup
Navigate to frontend:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Create `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/speech
```
Start dev server:
```bash
npm run dev
```

### 4. Redis (Required for Real-time)
```bash
redis-server  # Or docker run -p 6379:6379 redis:alpine
```

## 🏃‍♂️ Running the Project

Three terminals required:

1. **PostgreSQL + Redis**: Ensure running.
2. **Backend API** (Port 8000):
   ```bash
   cd backend && uvicorn main:app --reload --port 8000
   ```
3. **Frontend** (Port 5173):
   ```bash
   cd frontend && npm run dev
   ```

Navigate to `http://localhost:5173` for the app.

## Usage Guide

1. **Register/Login**: Create account → Access dashboard.
2. **Select Persona**: Choose "Interview" or "Sales Pitch" → Agent loads.
3. **Live Analysis**: Click "Start Speaking" → Real-time score + cues stream via WebSocket.
   *   *Tip*: Grant mic access; use phrases with varying stress/pace for demo.
4. **Training Mode**: Select micro-session → Get targeted feedback (e.g., "Reduce fillers").
5. **Review Insights**: Dashboard shows session history, progress graphs, agent summaries.
6. **Privacy Export**: Download local metrics (no cloud storage by default).

***

**Demo Flow**: Login → "Interview Persona" → Speak "Tell me about yourself" → Watch confidence drop on filler words → Receive "Slow pace" cue → Score improves.


