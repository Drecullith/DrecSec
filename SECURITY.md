# Security Policy

DrecSec v0.4 is a static, public cybersecurity portfolio. The production site has no visitor authentication, account creation, database, uploads, contact form, community posting, or realtime backend.

## Current security model

The main control is architectural: keep the public site small and avoid collecting credentials or user data unless a future feature genuinely requires server-side state.

Current controls include:

- HTTPS-only deployment on Vercel with explicit HSTS.
- A restrictive Content Security Policy with no `unsafe-inline` or `unsafe-eval` allowances.
- Frames, objects, forms, workers, media, and browser network connections disabled where the current site does not need them.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, restrictive permissions policy, and cross-origin isolation headers.
- No `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write`, or direct `innerHTML` assignment in application source.
- GitHub Actions runs with read-only repository permission; third-party actions are pinned to exact commit SHAs.
- CI audits all npm dependencies for high-severity vulnerabilities, runs a dedicated security configuration check, typechecks, and builds production output.
- Direct npm dependency versions are pinned exactly rather than using version ranges.

## Reporting a vulnerability

Please do not publish exploitable details for a live DrecSec deployment in a public issue.

For a non-sensitive bug, use the GitHub repository issue tracker. For a security issue that needs private handling, contact Drecullith through the GitHub profile with a minimal description and request a private channel before sharing proof-of-concept details.

## Scope boundary

DrecSec documents defensive and permission-based security learning. Testing content should target systems the tester owns, intentionally vulnerable labs, CTF environments, or systems with explicit authorization.

The current production site intentionally does not collect visitor credentials or sensitive personal data.
