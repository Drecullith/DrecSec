# Security Policy

DrecSec is being built with a security-first release process.

## Current status

Version 0.2 introduces the code and database migration for accounts, profiles, posts and real-time messages. User-data features must not be considered production-ready until the Supabase project is configured, the migration is applied, email confirmation is verified, and abuse/rate-limit controls are reviewed.

## Current controls

- PostgreSQL Row Level Security on every community table
- Authenticated writes bound to `auth.uid()`
- Public/publishable browser key only; no service-role key in client code
- Privileged profile roles excluded from member-editable columns
- Database length/format checks for usernames and content
- Content Security Policy and hardened Vercel headers
- GitHub Actions typecheck and production build
- No anonymous community writes

## Before broad public community launch

The following remain release gates:

- Rate limiting and anti-spam/anti-bot controls
- Reporting, block/mute, moderation and audit trail
- Moderator/admin workflows implemented server-side
- Account deletion and data export
- Backup/restore testing
- Dependency/security scanning
- Session/account recovery review
- File upload restrictions if uploads are introduced
- Private responsible-disclosure channel

## Responsible disclosure

A private security-reporting channel will be documented before v1.0. Until then, do not publish exploitable details about a live DrecSec deployment.
