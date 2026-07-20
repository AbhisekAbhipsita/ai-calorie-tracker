# Nutrixgenix — AI Calorie & Protein Tracker

An AI-powered nutrition tracker built for fast, conversational meal logging. Type what you ate in plain language — the app parses it into calories and protein, keeps a running daily total, and tells you where you stand against your targets.

**Live app:** [nutrixgenix.vercel.app](https://nutrixgenix.vercel.app/)

---

## Why this exists

Most calorie trackers make you search a food database and fill out a form for every item. Nutrixgenix is built around a different workflow: you type a sentence like *"2 rotis, dal, chicken curry 200g"* and it comes back with a structured, estimated breakdown — no manual lookup, no dropdowns. It's designed around Indian portion units (roti count, katori, etc.) and mobile-first quick logging throughout the day.

---

## Features

- **Conversational meal logging** — free-text input, single item or multiple at once, AI-estimated calories and protein per item
- **Running daily total** — updates after every log entry, compact display with no repeated boilerplate
- **End-of-day summary** — total kcal/protein vs. your configured targets, flags misses, optional micronutrient breakdown on request
- **Daily reset** — totals zero out each day; history is retained for trends
- **Weight tracking** — log bodyweight over time, get pace-to-goal feedback against a target date and weight
- **History & trends** *(in progress)* — daily/weekly averages, weight trend line, streak tracking for protein targets

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router), TypeScript |
| Styling | Tailwind CSS + shadcn/ui components |
| Auth & Database | [Supabase](https://supabase.com/) (Postgres + Auth), accessed directly via `@supabase/supabase-js` / `@supabase/ssr` — no ORM |
| Meal parsing (AI) | Gemini Flash (`@google/generative-ai`) |
| Nutrition Q&A chatbot | Grok (via Groq SDK / OpenRouter) |
| Food data lookup | [Open Food Facts API](https://world.openfoodfacts.org/) |
| Charts | Chart.js / Recharts |
| PDF export | jsPDF |
| Hosting | [Vercel](https://vercel.com/) |

---

## Project Structure

```
.
├── app/                    # Next.js App Router pages & API routes (in progress)
│   ├── api/
│   │   ├── log-meal/       # AI meal parsing endpoint
│   │   └── chat/           # Nutrition Q&A chatbot endpoint
│   └── ...
├── components/              # UI components (shadcn/ui based)
│   └── ui/
├── lib/                      # Shared utilities, Supabase clients (browser + server)
│   ├── supabase/
│   │   ├── client.ts        # Browser client
│   │   └── server.ts        # Server/route-handler client
├── public/
├── .env.local                # Supabase + AI provider keys (not committed)
├── next.config.ts
├── components.json           # shadcn/ui config
├── package.json
└── README.md
```

> Note: `app/`, `components/`, and `lib/` are being built out incrementally — see [Roadmap](#roadmap) below.

---

## Data Model

```
users
  id, target_kcal, target_protein, user_preferences

meal_logs
  id, user_id, date, raw_text, items (jsonb: name, qty, kcal, protein), created_at

weight_logs
  id, user_id, date, weight_kg

daily_totals (view or computed)
  date, total_kcal, total_protein, vs_target_kcal, vs_target_protein
```

Tables are created directly in the Supabase SQL editor (or via Supabase CLI migrations) and queried with the Supabase JS client — no separate ORM schema to keep in sync.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project (Postgres + Auth)
- API keys for Gemini and Groq/OpenRouter

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/nutrixgenix.git
cd nutrixgenix
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key
```

> ⚠️ Never commit real keys. `.env*` is already git-ignored — keep it that way, and rotate any keys that were ever exposed.

### 3. Set up the database

Create the tables in your Supabase project (SQL editor or CLI migration) matching the [Data Model](#data-model) above, and enable Row Level Security policies scoping each table to `auth.uid()`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

- [x] Project scaffolding (Next.js, Tailwind, shadcn/ui, Supabase)
- [ ] Auth (Supabase email/magic link)
- [ ] Supabase tables + RLS policies for `users`, `meal_logs`, `weight_logs`
- [ ] Meal logging API route (Gemini-parsed)
- [ ] Running daily total UI
- [ ] End-of-day summary vs. targets
- [ ] Weight tracking + goal pace calculation
- [ ] History & trends charts
- [ ] Nutrition Q&A chatbot (Grok)
- [ ] Streak tracking

---

## Design Principles

- Logging should feel like chatting, not filling out a form
- Responses stay terse — table-style totals, minimal commentary, no repeated disclaimers
- Mobile-first — the primary use case is quick logging throughout the day

---

## Deployment

Deployed on [Vercel](https://vercel.com/). Push to `main` to trigger a deploy, or run:

```bash
vercel --prod
```

Make sure all environment variables above are set in the Vercel project settings (Production, Preview, and Development as needed).

---

## License

MIT
