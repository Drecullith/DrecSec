# DrecSec

**Cybersecurity • Open Source • CTF**

DrecSec is the public cybersecurity portfolio and community project of **Drecullith**.

The first release is intentionally honest: it documents active learning, real projects and open-source work instead of presenting an invented expert persona. The architecture is designed to grow into authenticated profiles, moderated discussions, real-time chat and CTF/write-up tooling.

## v0.1 scope

- Responsive portfolio landing page
- Drecullith identity and current focus
- Projects: DrecSec, Lychnos, Omarchy contributions, future CTF notes
- Public learning roadmap
- Community roadmap preview
- Accessibility basics and reduced-motion support
- Cloudflare-friendly Vite production build
- Environment-variable placeholders for the Supabase phase

## Stack

- React
- TypeScript
- Vite
- Plain CSS design system (no UI-framework lock-in)

Planned platform services:

- Cloudflare for hosting/edge API
- Supabase for PostgreSQL, authentication and real-time features

## Local development

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Roadmap

- **v0.2** — Supabase project, secure authentication, account verification
- **v0.3** — Member profiles and role model
- **v0.4** — Posts, discussions, moderation primitives
- **v0.5** — Real-time channels, presence, rate limits
- **v0.6** — CTF/write-up system, achievements and GitHub integration
- **v1.0** — Security review, production hardening and public community launch

## Security

DrecSec is a defensive/ethical-learning project. Security testing content should target systems the tester owns or has explicit authorization to assess, intentionally vulnerable labs, or CTF environments.

See [SECURITY.md](./SECURITY.md).
