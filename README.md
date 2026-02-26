# MeteorMate Client

MeteorMate is a roommate-matching platform for UT Dallas students.
This repository contains:
- a Next.js frontend (`src/`)
- a FastAPI backend (`backend/`)
- a serverless API entrypoint for deployment (`api/index.py`)

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Firebase Auth
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Firebase Admin SDK
- Deployment: Vercel routing for `/api/*`

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.11+
- PostgreSQL

## Frontend Setup

1. Install dependencies:

```bash
npm ci
```

2. Create `.env.local` in the project root with at least:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

3. Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Backend Setup

1. Create and activate a Python virtual environment.

2. Install backend dependencies:

```bash
pip install -r requirements.txt
```

3. Create backend environment variables (for example in `backend/.env`) and set:

```bash
DATABASE_URL=postgresql://user:password@localhost/meteormate
FIREBASE_CREDENTIALS={"type":"service_account",...}
FIREBASE_STORAGE_BUCKET=...
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DEBUG=true
CRON_SECRET=...
ADMIN_BEARER=...
ADMIN_UID=...
```

4. Start the backend locally:

```bash
cd backend
python main.py
```

Backend runs at `http://127.0.0.1:8000`.

## Local Integration

In development, `next.config.ts` rewrites `/api/:path*` to the local FastAPI server (`http://127.0.0.1:8000/api/:path*`).

## Useful Commands

```bash
npm run dev           # run frontend
npm run build         # build frontend
npm run start         # run frontend in production mode
npx eslint src --ext .js,.ts,.tsx
npx tsc --noEmit
```

## Deployment Notes

- `vercel.json` routes `/api/*` to `api/index.py`.
- `api/index.py` imports and serves `backend.app`.
- Ensure production environment variables are configured for both frontend and backend settings.
