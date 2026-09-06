# Cloudflare deployment notes

DrecSec v0.1 builds to the `dist/` directory.

For a Cloudflare Pages project connected to GitHub:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

Environment variables will be added when Supabase is introduced. Do not commit production credentials.
