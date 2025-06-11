# Guaco 🥑 – Fuel healthy habits, effortlessly

> **Vision**  
> Help anyone build lasting nutrition & wellness routines through AI-powered recipes, friction-free logging, and playful gamification.

---
**Replace** the UPPER-CASE placeholders (<GITHUB_USER>, <REPO>, <VERCEL_ORG>, <VERCEL_PROJECT>) with your actual names
<!---- Badges ––––––––––––––––––––––––––––––––––––––––––––––––––––––-->
[![Build](https://img.shields.io/github/actions/workflow/status/<almog.ai>/<REPO>/ci.yml?branch=main&label=CI%20build&logo=github)](https://github.com/<almog.ai>/<REPO>/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?logo=opensourceinitiative)](LICENSE)
[![Deploy](https://img.shields.io/vercel/deployments/<VERCEL_ORG>/<VERCEL_PROJECT>?label=Vercel%20deploy&logo=vercel)](https://vercel.com/<VERCEL_ORG>/<VERCEL_PROJECT>)
<!---- End Badges ––––––––––––––––––––––––––––––––––––––––––––––––––-->


## Problem • Insight • Solution

| Stage | Summary |
|-------|---------|
| **Problem** | Most wellness apps feel like chores: too much typing, generic advice, and zero follow-through. Busy people abandon them within days. |
| **Insight** | If you combine “just-for-me” meal inspiration with **one-tap tracking**, you remove the effort barrier and make healthy choices feel rewarding. |
| **Solution** | Guaco auto-generates realistic recipes from what you have adjusting to current needs, lets you log food/water/sleep/exercise in seconds, and rewards streaks with fun badges. |

---

## Demo

[![Watch a 60-sec walkthrough](docs/demo.gif)](https://youtu.be/placeholder)

---

## North-Star & Guardrail Metrics

| Metric | Definition | Why we picked it |
|--------|------------|------------------|
| **Healthy actions logged per active user per week** *(NSM)* | Count of meals, drinks, workouts, or sleeps logged ÷ weekly active users | Direct indicator the product is delivering core value (habit building) |
| 7-day Retention % | % of new users who return at least once between day 1–7 | Validates sustained engagement |
| Recipe Generation Success Rate | Successful AI recipe responses ÷ attempts | Ensures core feature reliability |

---

## Primary Personas

| Persona | Goals | Frustrations | Quote |
|---------|-------|--------------|-------|
| **Fitness-Focused Finn** (25, amateur runner) | Hit macro targets, see progress trends | Manual nutrition tracking is tedious | “I know what *should* work, but tracking everything kills my vibe.” |
| **Time-Poor Taylor** (32, junior lawyer) | Quick, healthy meals; zero planning overhead | Too busy to cook or log | “If it takes more than 3 taps, I’m out.” |
| **Recipe-Organised Riley** (29, food-loving parent) | Keep a tidy recipe vault, avoid waste | Juggling kids’ tastes and pantry stock | “Show me dishes I can *actually* cook tonight with what’s in the fridge.” |

---

## Tech Stack

* **Frontend** – React + Tailwind + Vite + TypeScript
* **Backend** – FastAPI (Python)  
* **AI** – OpenAI GPT-4o via Together.ai  
* **Hosting** – Vercel (frontend) • Fly.io (backend)  
* **Analytics** – PostHog

---

## Roadmap Snapshot

| Quarter | Theme | Epic Goal |
|---------|-------|-----------|
| **Q3 2025** | Onboard & Learn | Reach 1 000 WAU, validate NSM ≥ 3 |
| **Q4 2025** | Retain & Socialise | Add friends feed & challenges, hit 25 % 4-week retention |
| **Q1 2026** | Monetise | Launch premium macro coaching, first $5 k MRR |

_Detailed roadmap & RICE scoring in [`docs/Roadmap.md`](docs/Roadmap.md)._

---

## Getting Started Locally

```bash
# Frontend
cd frontend
npm install && npm run dev   # http://localhost:5173

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload    # http://localhost:8000

---

## Contributing

We follow a lightweight trunk-based flow:
Create a branch feat/<epic>-<topic>
Open a PR with Context • Solution • Demo GIF • Risk template
CI must pass (build + tests)
Squash-merge, link to issue

(under contributing)
## Branch conventions

main → always deployable
feat/<epic>-<short-desc> for new work
fix/<id> for bugs


_For full PRD, personas, competitive analysis see `docs/`._
