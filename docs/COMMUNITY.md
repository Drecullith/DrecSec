# DrecSec community foundation

DrecSec v0.2 adds the application plumbing for member accounts, profiles, discussions, and real-time rooms.

## Security model

- Authentication is handled by Supabase Auth.
- The browser receives only the public/publishable Supabase key.
- The Supabase service-role/secret key must never be placed in a `VITE_*` variable or committed to Git.
- PostgreSQL Row Level Security (RLS) controls all writes.
- Profiles are public, but members can update only their own editable profile columns.
- Community posts and chat messages are public to read and require an authenticated identity to create.
- Post and message authorship is checked against `auth.uid()` in PostgreSQL; the browser cannot legitimately write as another member.
- Privileged profile roles cannot be changed by normal authenticated clients.

## Database

Apply `supabase/migrations/20260907_001_community_foundation.sql` to the DrecSec Supabase project.

The migration creates:

- `profiles`
- `posts`
- `channels`
- `messages`
- signup trigger for profile creation
- RLS policies and restricted grants
- initial community channels
- Realtime publication for `messages`

## Vercel environment

Configure these values for Production and Preview:

```text
VITE_SUPABASE_URL=<project url>
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key>
```

No service-role secret belongs in Vercel's client build.
