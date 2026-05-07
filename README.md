# MailMind AI

> AI-powered email assistant that reads your Gmail inbox, drafts smart replies, flags urgent emails, summarizes threads, and reminds you to follow up — all for free.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Auth:** NextAuth.js with Google OAuth
- **Database:** SQLite (dev) / PostgreSQL (prod) via Prisma ORM
- **AI/LLM:** Groq API (primary) + NVIDIA NIM (fallback)
- **Email:** Gmail API via `googleapis`
- **State:** Zustand

## Features

- **Smart Inbox** — AI-prioritized emails with urgency scores (🔴🟡🟢)
- **AI Reply Drafts** — Generate context-aware replies with tone control
- **Thread Summaries** — TL;DR + key points + action items
- **Follow-up Reminders** — Never forget to reply to important emails
- **Privacy First** — Emails never stored, always fetched live from Gmail

## Prerequisites

- Node.js 18+
- A Google account (for Gmail)
- Free accounts on: [Groq](https://console.groq.com), [NVIDIA NIM](https://build.nvidia.com)

## Local Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/ansh-kairos/ai-demo.git
cd ai-demo

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Fill in .env.local (see Environment Variables below)

# 5. Set up database
DATABASE_URL=file:./dev.db npx prisma migrate dev --name init

# 6. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` with:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
GROQ_API_KEY=your_groq_api_key
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key
DATABASE_URL=file:./dev.db
CRON_SECRET=any_random_string
```

## Getting API Keys

### Groq API Key (Free)
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create API Key
3. Save as `GROQ_API_KEY`

### NVIDIA NIM API Key (Free)
1. Visit [https://build.nvidia.com](https://build.nvidia.com)
2. Sign up → Profile → API Keys → Generate
3. Save as `NVIDIA_NIM_API_KEY`

### Google OAuth + Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable Gmail API
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Application type: Web application
5. Redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

**Required Gmail Scopes:**
- `gmail.readonly`
- `gmail.send`
- `gmail.modify`

## Deployment

### Option A: Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com) → New Project
3. Set all environment variables (use PostgreSQL for `DATABASE_URL` via [Neon.tech](https://neon.tech))
4. Deploy — cron job for reminders is configured via `vercel.json`

### Option B: Render

1. Push to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Build: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
4. Start: `npm start`
5. Set environment variables, use Render PostgreSQL or Neon.tech

## Using the App

1. **Login:** Click "Sign in with Google" → Authorize Gmail access
2. **View Inbox:** Emails load with AI urgency scores (🔴🟡🟢)
3. **Draft a Reply:** Click email → "Draft Reply" → Select tone → Generate → Edit → Send/Copy
4. **Summarize:** Open thread → "Summarize" → View TL;DR + key points
5. **Set Reminder:** Open email → "Remind Me" → Choose time → Get notified via email

## Project Structure

```
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # Backend API endpoints
│   ├── dashboard/         # Protected dashboard pages
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Server utilities (auth, gmail, llm)
├── prompts/               # LLM prompt templates
├── store/                 # Zustand state management
├── prisma/                # Database schema & migrations
└── public/                # Static assets
```

## License

MIT
