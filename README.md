# T.A.M.O.

**Transformer And Mamba Orchestrator**: a hybrid long-context question-answering system that lets a small Transformer answer questions about documents of up to 200,000 tokens.

Final Year Project, Department of Information Science and Engineering, Jyothy Institute of Technology, Bengaluru.

## How it works

1. **Chunk and encode.** The document is split into 256-token chunks, and Mamba-130M (a state space model) encodes each chunk once, in linear time.
2. **Retrieve.** The question is encoded the same way and compared with every chunk by cosine similarity. The top 3 chunks move on.
3. **Gate.** Mamba drafts an answer. If the draft's entropy is low enough (τH) and the passages are relevant enough (τR), the draft is returned on the fast path.
4. **Escalate.** Otherwise TinyLlama-1.1B answers, reading only the 3 retrieved passages.

## Results

From the paper (SQuAD haystacks from 10K to 200K tokens, 50 test questions per length, one NVIDIA Tesla T4):

| System | Accuracy |
|---|---|
| TinyLlama with its own 2K window | 5.6% |
| Hybrid (T.A.M.O.) | 32.0% |
| TinyLlama + Mamba retrieval | 32.8% |

- Retrieval works: the right passage is in the top 3 for 84% of questions at 50K tokens, and query-time GPU memory stays almost flat from 10K to 200K tokens.
- The gate does not yet: it escalated 96.8% of questions, so the hybrid was about 2.8× slower than always escalating.

The full evaluation (routing, latency, memory, Needle-in-a-Haystack, LongBench and a retrieval ablation) is on the site's `/results` page.

## This repository

A web application built around the paper's architecture.

| Page | Route |
|---|---|
| Landing | `/` |
| Results | `/results` |
| Log in / Sign up | `/login`, `/signup` |
| Chat interface | `/app` |

**Status:** the frontend is complete and runs on sample documents with prepared answers (`frontend/src/api/chat.ts`). Next up are the FastAPI backend, which will call hosted models, and Supabase authentication.

## Tech stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, React Router. Chat input, voice, thinking-line and select components come from [React Bits](https://reactbits.dev).
- **Backend (planned):** FastAPI on Render.
- **Auth and database (planned):** Supabase.
- **Hosting:** Cloudflare Pages (frontend), Render (backend).

## Running locally

Requires Node.js 18 or later.

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in frontend/dist
```

## Team

- Shrinidhi Vittala R
- Samiksha Das

Guided by **Dr. Sridevi G M**, Department of ISE, Jyothy Institute of Technology, Bengaluru.

## Paper

*A Hybrid State Space–Transformer Architecture for Long-Context Processing up to 200K Tokens*
