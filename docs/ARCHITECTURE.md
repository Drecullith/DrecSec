# DrecSec Architecture

## v0.2 — portfolio + community foundation

```text
Browser
  └─ React + TypeScript + Vite
      ├─ public portfolio
      ├─ account UI
      ├─ member profiles
      ├─ community feed
      └─ live channel UI
             │
             ▼
        Supabase client
      ┌──────┼─────────┐
      │      │         │
     Auth PostgreSQL Realtime
             │
             └─ Row Level Security
```

## Trust boundaries

The browser is untrusted. It may hold only public/publishable configuration.

Authorization is enforced in PostgreSQL with RLS, not by hiding buttons in React. Authenticated clients may create posts/messages only where `author_id = auth.uid()`. Members may update only their own profile and cannot update the `role` column through normal client privileges.

A Supabase service-role key is privileged and must never be committed or exposed through Vite environment variables.

## Hosting

Vercel serves the Vite production build. `vercel.json` provides SPA routing and browser security headers. GitHub Actions performs dependency installation, TypeScript checking and a production build on pushes and pull requests.

## Data model

- `profiles` — one public profile per auth user
- `posts` — long-form community feed entries
- `channels` — controlled list of real-time rooms
- `messages` — channel messages, published through Supabase Realtime

## Next security work

Before opening the community broadly, DrecSec still needs abuse controls, moderation/reporting, account deletion/export, rate limiting, backup/restore testing, and a review of account recovery and email confirmation flows.
