# DrecSec

**Cybersecurity • Open Source • CTF**

DrecSec is the public cybersecurity portfolio of **Drecullith**.

The project stays deliberately evidence-first: real projects, open-source work, ethical labs, CTF methodology, write-ups, and a visible learning path instead of an invented expert persona.

## Current scope — v0.2

- Responsive public portfolio
- Drecullith identity and project showcase
- Open-source contribution timeline
- CTF / ethical-lab roadmap
- Vercel security headers
- GitHub Actions typecheck + production build
- No visitor accounts, passwords, member profiles, or live chat
- No application database or realtime backend

## Stack

- React 19
- TypeScript
- Vite
- Vercel production deployment
- Plain CSS design system

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

## Roadmap

- **v0.2** — Portfolio-only production foundation
- **v0.3** — Project detail pages and technical write-ups
- **v0.4** — GitHub activity and contribution integrations
- **v0.5** — CTF / lab notes and methodology library
- **v1.0** — Security review, accessibility audit, content polish, public portfolio release

## Security

DrecSec is for defensive and permission-based security learning. Content should target systems the tester owns, intentionally vulnerable labs, CTF environments, or systems with explicit authorization.

The public site intentionally does not collect visitor credentials.

See [SECURITY.md](./SECURITY.md) and [docs/PORTFOLIO_MODE.md](./docs/PORTFOLIO_MODE.md).
