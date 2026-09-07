# Cloudflare deployment notes

DrecSec v0.4 builds to the `dist/` directory and remains portfolio-only: no application database, authentication provider, or runtime environment variables are required.

For a Cloudflare Pages project connected to GitHub:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

`public/_headers` mirrors the browser hardening used by the Vercel deployment so an alternate Cloudflare Pages build does not silently lose the security-header baseline.

If a future feature introduces secrets or server-side state, it requires a separate security review before deployment. Never commit production credentials.
