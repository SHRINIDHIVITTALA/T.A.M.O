# Project: Hybrid Mamba–Transformer Long-Context QA (Final Year Project)

## Decided tech stack (do not re-discuss)

**Frontend** (hosted on Cloudflare Pages, static build) — `frontend/`
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui (components)
- Framer Motion (animation)
- Lucide (icons)
- Recharts (charts)
- React Router (routing)

**Backend** (hosted on Render) — `backend/`
- FastAPI (Python)
- Model provider SDKs (models to be chosen in the backend phase)
- Render limits: no GPU, 512 MB RAM on free tier, sleeps after ~15 min idle

**Auth + database**
- Supabase (email/Google auth, Postgres)

## App flow
Landing page → Login / Signup → Interface (main app). Details decided as we go.

## Design goal
Premium, legit-looking product UI (dark theme, Linear/Vercel style, smooth animations).
