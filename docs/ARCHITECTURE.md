# DrecSec Architecture

## v0.2 — portfolio-only foundation

```text
GitHub repository
      │
      ▼
GitHub Actions
  ├─ dependency audit
  ├─ TypeScript check
  └─ production build
      │
      ▼
    Vercel
      │
      ▼
Static React + TypeScript + Vite portfolio
```

## Trust boundary

DrecSec is intentionally a public portfolio and does not require visitor authentication. The production application does not collect passwords, create user accounts, host member profiles, accept community posts, or provide live chat.

Keeping the site static removes an unnecessary credential-handling and realtime-backend attack surface.

## Hosting

Vercel serves the Vite production build. `vercel.json` provides SPA fallback behavior and browser security headers. GitHub Actions performs dependency installation, production dependency auditing, TypeScript checking, and a production build on pushes and pull requests.

## Future backend rule

A backend should only be introduced when a concrete portfolio feature genuinely requires server-side state. Any future service should be narrowly scoped, avoid credential collection where possible, and receive its own security review before production use.
