# DrecSec v0.4 Security Audit — 2026-09-07

## Scope

This audit covered the current public React/TypeScript/Vite application, repository security configuration, browser security headers, dependency/CI controls, and the current production architecture.

The application is intentionally static and does not expose visitor authentication, forms, uploads, a database, server functions, or realtime services.

## Result

No critical or high-severity application findings were identified during the source/configuration review.

The audited CI run reported **0 npm vulnerabilities**. TypeScript checking and the production build also passed.

## Checks performed

- Reviewed the full production repository tree for unexpected backend/auth/data components.
- Reviewed routing and external-link behavior.
- Searched application source for dangerous DOM/code-execution patterns including `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write`, direct `innerHTML` assignment, and `javascript:` URLs.
- Reviewed Vercel and alternate Cloudflare security-header configuration.
- Reviewed GitHub Actions permissions and dependency-audit behavior.
- Reviewed `.gitignore` handling for environment files and local artifacts.

## Findings remediated

### CSP allowed inline styles

The Vercel CSP previously allowed `style-src 'unsafe-inline'`. The application does not require inline styles, so the allowance was removed. Explicit `script-src-attr 'none'` and `style-src-attr 'none'` directives now block inline script/style attributes.

### Unused browser capabilities were broader than necessary

The CSP now starts from `default-src 'none'` and explicitly disables forms, objects, frames, workers, media, and browser network connections that the current static site does not need.

### HSTS was not explicit in project configuration

`Strict-Transport-Security: max-age=31536000; includeSubDomains` is now configured for the deployment.

### CI supply-chain hardening

GitHub Actions are pinned to exact commit SHAs. Read-only workflows disable persisted checkout credentials. The dependency audit includes development/build dependencies as well as runtime packages because build tooling executes inside the trusted CI path.

### Dependency reproducibility

Direct npm dependencies are pinned to exact versions and `package-lock.json` is committed. Normal CI uses `npm ci`, so dependency resolution is reproducible and fails when the manifest and lockfile disagree.

### Security policy drift

`SECURITY.md` and retired deployment notes were updated to match the current portfolio-only architecture.

## Regression guards

- `npm run security:check` fails CI if required security headers disappear, the CSP regains `unsafe-inline`/`unsafe-eval`, or selected dangerous DOM/code-execution patterns are introduced into `src/`.
- A production security workflow checks the live Vercel endpoint over TLS and verifies the expected security headers.
- The Omarchy evidence sync runs in GitHub Actions and publishes only public pull-request metadata. Its GitHub token is short-lived and never ships to site visitors.

## Remaining hardening work

- Protect the GitHub and Vercel owner accounts with strong MFA/passkeys and recovery controls; account compromise remains outside the application code trust boundary.
- Consider branch/ruleset protection as the repository workflow matures, especially if additional contributors gain write access.
- Repeat the security review whenever a backend, user input, uploads, analytics, third-party scripts, or other runtime integrations are introduced.

## Assessment

For the current feature set, DrecSec has a low attack surface and a strong static-site security baseline. The largest future risk would come from adding dynamic services without preserving the current narrow trust boundary.
