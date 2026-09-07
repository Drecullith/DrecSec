# DrecSec

**Cybersecurity • Open Source • CTF**

DrecSec is the public cybersecurity portfolio of **Drecullith**.

The project stays deliberately evidence-first: real projects, open-source work, ethical labs, CTF methodology, write-ups, and a visible learning path instead of an invented expert persona.

## Current scope — v0.4

- Responsive public portfolio
- Drecullith identity and project showcase
- First full project case study: Omarchy Contributions
- Evidence links to upstream pull requests and finished public utilities
- Open-source contribution timeline
- CTF / ethical-lab roadmap
- Vercel security headers
- GitHub Actions dependency audit, typecheck, and production build
- No visitor accounts, passwords, member profiles, community posting, or live chat
- No application database, auth provider, or realtime backend

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

- **v0.1** — Portfolio foundation
- **v0.2** — Auth/community experiment, now archived
- **v0.3** — Portfolio reboot: static, credential-free, backend-free
- **v0.4** — Project detail pages and technical case studies — in progress
- **v0.5** — GitHub activity, contributions, CTF/lab notes, and methodology
- **v1.0** — Security review, accessibility audit, content polish, public portfolio release

The final v0.2 community build is preserved on `archive/v0.2-community-experiment` for historical reference only.

## Security

DrecSec is for defensive and permission-based security learning. Content should target systems the tester owns, intentionally vulnerable labs, CTF environments, or systems with explicit authorization.

The public site intentionally does not collect visitor credentials.

See [SECURITY.md](./SECURITY.md), [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), and [docs/REBOOT.md](./docs/REBOOT.md).
