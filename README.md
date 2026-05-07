# MailMind AI

> AI-powered email assistant that drafts smart replies, flags urgent emails, summarizes threads, and reminds you to follow up — all for free.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Auth:** NextAuth.js with Email/Password credentials
- **Database:** SQLite (dev) / PostgreSQL (prod) via Prisma ORM
- **AI/LLM:** Groq API (primary) + NVIDIA NIM (fallback)
- **State:** Zustand

## Features

- **Smart Inbox** — AI-prioritized emails with urgency scores (🔴🟡🟢)
- **AI Reply Drafts** — Generate context-aware replies with tone control (Professional/Friendly/Brief/Assertive)
- **Thread Summaries** — TL;DR + key points + action items
- **Follow-up Reminders** — Never forget to reply to important emails
- **Simple Auth** — Email/password registration and login (no OAuth setup required)

## Prerequisites

- Node.js 18+
- (Optional) Free accounts on: [Groq](https://console.groq.com), [NVIDIA NIM](https://build.nvidia.com) for AI features

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/ansh-kairos/AI-Demo.git
cd AI-Demo

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Generate a secret (paste into .env.local as NEXTAUTH_SECRET)
openssl rand -base64 32

# 5. Set up database
DATABASE_URL=file:./dev.db npx prisma migrate dev --name init

# 6. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Click "Get Started Free" → Register → Dashboard loads with demo emails.

## Environment Variables

Create `.env.local` with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
DATABASE_URL=file:./dev.db
CRON_SECRET=any_random_string

# Optional - for AI features:
GROQ_API_KEY=your_groq_api_key
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key
```

## Getting AI API Keys (Optional)

### Groq API Key (Free)
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create API Key
3. Save as `GROQ_API_KEY`

### NVIDIA NIM API Key (Free)
1. Visit [https://build.nvidia.com](https://build.nvidia.com)
2. Sign up → Profile → API Keys → Generate
3. Save as `NVIDIA_NIM_API_KEY`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com) → New Project
3. Set environment variables (use PostgreSQL via [Neon.tech](https://neon.tech) for `DATABASE_URL`)
4. Deploy — cron job configured via `vercel.json`

### Render

1. Push to GitHub
2. Create Web Service on [Render](https://render.com)
3. Build: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
4. Start: `npm start`
5. Set environment variables

## Project Structure

```
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # Backend API endpoints
│   │   ├── auth/          # Auth (NextAuth + registration)
│   │   ├── emails/        # Email list, thread, reply, summarize, prioritize
│   │   ├── reminders/     # Create, list, cron
│   │   └── user/          # Preferences
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components (UI + app-specific)
├── lib/                   # Server utilities (auth, gmail, llm, prisma)
├── prompts/               # LLM prompt templates
├── store/                 # Zustand state management
└── prisma/                # Database schema & migrations
```

## Using the App

1. **Register:** Create account with email + password
2. **Dashboard:** View inbox with AI urgency scores (🔴🟡🟢)
3. **Draft Reply:** Click email → "Draft Reply" → Select tone → Generate
4. **Summarize:** Open thread → "Summarize" → View TL;DR + key points
5. **Reminders:** Open email → "Remind Me" → Choose time

## License

MIT
