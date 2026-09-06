# Security Policy

DrecSec is being built with a security-first release process.

## Current status

Version 0.1 is a static public frontend and does not yet accept accounts, passwords, private messages or user-generated content.

## Before community features ship

The following are release gates rather than optional polish:

- Row Level Security on every user-data table
- Least-privilege authorization rules
- Email/account verification
- Server-side validation for privileged operations
- Rate limiting and abuse controls
- Secure session handling
- Content Security Policy and hardened security headers
- Audit-friendly moderation actions
- Secrets kept outside the repository
- Dependency and build checks in CI
- Backup/restore plan for production data

## Responsible disclosure

A private security-reporting channel will be documented before v1.0. Until then, do not publish exploitable details about a live DrecSec deployment.
