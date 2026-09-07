# DrecSec

**Cybersecurity • Open Source • CTF • Community**

DrecSec is the public cybersecurity portfolio and community project of **Drecullith**.

The project stays deliberately evidence-first: real projects, open-source work, ethical labs, CTF methodology, write-ups, and a visible learning path instead of an invented expert persona.

## Current scope — v0.2

- Responsive public portfolio
- Drecullith identity and project showcase
- Email/password authentication UI backed by Supabase Auth
- Public member profiles with self-service editing
- Member directory
- Authenticated community posts
- Real-time channel chat plumbing with Supabase Realtime
- PostgreSQL Row Level Security migration
- Vercel security headers and SPA routing
- GitHub Actions typecheck + production build
- Graceful backend-offline state until Supabase is connected

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Supabase Auth / PostgreSQL / Realtime
- Vercel production deployment
- Plain CSS design system

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase environment variables, the public portfolio still works and community/auth pages show an explicit backend-pending state.

## Supabase

Apply:

```text
supabase/migrations/20260907_001_community_foundation.sql
```

Then configure:

```text
VITE_SUPABASE_URL=<project URL>
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key>
```

Never place a service-role/secret key in a `VITE_*` variable.

See [docs/COMMUNITY.md](./docs/COMMUNITY.md).

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

## Roadmap

- **v0.2** — Auth + profile + community foundation
- **v0.3** — Moderation primitives, profile polish, rate-limit strategy
- **v0.4** — Real-time presence, mentions, unread state, message controls
- **v0.5** — CTF/write-up system and GitHub integrations
- **v1.0** — Security review, abuse handling, backup/restore, accessibility audit, public launch

## Security

DrecSec is for defensive and permission-based security learning. Content should target systems the tester owns, intentionally vulnerable labs, CTF environments, or systems with explicit authorization.

See [SECURITY.md](./SECURITY.md).
