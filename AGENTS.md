# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview
MailMind AI is a Next.js 14 (App Router) full-stack application that provides AI-powered email management via Gmail OAuth, Groq, and NVIDIA NIM APIs.

### Running the Dev Server
```bash
npm run dev
```
Runs on http://localhost:3000. Requires `.env.local` with `DATABASE_URL=file:./dev.db` and a `NEXTAUTH_SECRET` (any base64 string works for dev).

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
| Prisma studio | `DATABASE_URL=file:./dev.db npx prisma studio` |

### Gotchas
- Prisma CLI requires `DATABASE_URL` set explicitly (not read from `.env.local` unless you use `dotenv-cli`). Always prefix Prisma commands with `DATABASE_URL=file:./dev.db`.
- The app requires Google OAuth credentials for full testing. Without valid `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, the sign-in flow will show a 401 error from Google.
- API routes return `401 Unauthorized` when session is missing — this is correct behavior.
- The cron endpoint (`/api/reminders/cron`) authenticates via `Authorization: Bearer $CRON_SECRET` header.
- `next build` prints warnings about dynamic routes during static generation — this is expected and does not indicate a build failure.

### External API Dependencies
- **Groq API** (primary LLM): requires `GROQ_API_KEY`
- **NVIDIA NIM** (fallback LLM): requires `NVIDIA_NIM_API_KEY`
- **Gmail API** (email): requires Google OAuth configured in Cloud Console with Gmail scopes
