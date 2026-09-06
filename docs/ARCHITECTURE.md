# DrecSec Architecture

## Phase 1 — v0.1

A React + TypeScript + Vite frontend deployable as a static site.

```text
Browser
  └─ DrecSec React app
      ├─ portfolio
      ├─ project showcase
      ├─ learning roadmap
      └─ community preview
```

There is deliberately no fake backend in v0.1.

## Phase 2 — accounts and data

```text
Browser
  ├─ DrecSec React app
  └─ Supabase client
       ├─ Auth
       ├─ PostgreSQL
       └─ Realtime
```

All user-owned data will use Row Level Security. Public browser keys are not authorization boundaries; database policies are.

## Phase 3 — privileged server operations

```text
Browser
  ├─ Supabase (user-scoped data)
  └─ Cloudflare Worker API
       ├─ privileged moderation actions
       ├─ integration/webhook validation
       ├─ server-only secrets
       └─ abuse/rate-limit controls
```

## Design principles

1. **Least privilege** — clients receive only the capabilities they require.
2. **Permission first** — offensive-security features live in authorized contexts.
3. **No secret-by-obscurity** — secrets never ship in frontend bundles.
4. **Auditability** — moderation and privileged changes should leave useful records.
5. **Progressive complexity** — add infrastructure only when the product needs it.
6. **Portable identity** — Drecullith is the author identity; DrecSec is the platform/project identity.
