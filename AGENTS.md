# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
MailMind AI is a Next.js 14 (App Router) full-stack application that provides AI-powered email management. Uses credentials-based auth (email/password) with demo email data.

### Running the Dev Server
```bash
npm run dev
```
Runs on http://localhost:3000. Requires `.env.local` with `DATABASE_URL=file:./dev.db` and a `NEXTAUTH_SECRET`.

### Database
- SQLite in development (`prisma/dev.db`)
- Run `DATABASE_URL=file:./dev.db npx prisma migrate dev` to apply schema changes
- The `DATABASE_URL` env var must be set explicitly when running Prisma CLI commands

### Key Commands
| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npx next lint` |
| Build | `npm run build` |
| Prisma generate | `npx prisma generate` |
| Prisma migrate | `DATABASE_URL=file:./dev.db npx prisma migrate dev` |

### Gotchas
- Prisma CLI requires `DATABASE_URL` set explicitly (not read from `.env.local` automatically). Always prefix Prisma commands with `DATABASE_URL=file:./dev.db`.
- Auth uses email/password credentials (no Google OAuth needed). Register at `/register`, login at `/login`.
- API routes return `401 Unauthorized` when session is missing — this is correct behavior.
- The cron endpoint (`/api/reminders/cron`) authenticates via `Authorization: Bearer $CRON_SECRET` header.
- Email data is demo/sample data (not connected to real Gmail). The Gmail integration can be re-enabled by adding Google OAuth provider.
- `next build` prints warnings about dynamic routes during static generation — this is expected and does not indicate a build failure.

### External API Dependencies (Optional for AI features)
- **Groq API** (primary LLM): requires `GROQ_API_KEY` — AI features work only when configured
- **NVIDIA NIM** (fallback LLM): requires `NVIDIA_NIM_API_KEY`
- Without LLM keys, the app still runs but AI draft/summarize/prioritize will return errors
