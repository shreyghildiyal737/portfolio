# Portfolio — Shrey Ghildiyal

A personal engineering portfolio, built as an honest changelog of work in active
development rather than a marketing pitch. Warm-paper "inventor's workshop" design.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · Framer Motion.

## Screens

- `/` — the log / "currently building"
- `/projects` and `/projects/[slug]` — the Vault: real projects with per-project blueprints
- `/timeline` — a changelog of the work and the path so far
- `/recruiter` — a printable one-page CV view
- `/assistant` — ask the record (local retrieval, optional Spring Boot backend)
- `/guestbook` and `/leave-a-mark` — public guestbook + sign form
- `/owner` — token-gated moderation workbench (noindex)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no environment variables set, everything runs
locally: the assistant uses built-in retrieval and the guestbook writes to a
git-ignored `.data/visitors.json` file.

## Environment variables

Copy `.env.local.example` to `.env.local` for local development. All variables are
optional in development — see that file for the full descriptions. Summary:

| Variable | Purpose | Dev | Prod |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Spring Boot backend for the assistant | optional | optional |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Visitor store (Upstash Redis) | optional (file fallback) | **required** |
| `OWNER_TOKEN` | Unlocks `/owner` + owner API routes | optional | **required** |
| `VISITOR_IP_SALT` | Salt for hashing visitor IPs (raw IPs never stored) | optional | recommended |
| `DISCORD_WEBHOOK_URL` | Ping on new guestbook signature | optional | optional |

## Deploying to Vercel

The local file store (`.data/`) does **not** persist on Vercel — serverless
filesystems are ephemeral. Before going live, set these in the Vercel project
(Settings → Environment Variables):

1. Upstash Redis — add the **Upstash for Redis** integration from the Vercel
   Marketplace (`vercel integration add upstash/upstash-kv`). It provisions the DB
   and injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically; the store
   reads those (or the native `UPSTASH_REDIS_REST_URL` / `_TOKEN`). Without a store
   the guestbook silently loses data.
2. `OWNER_TOKEN` — a long random secret. Without it the `/owner` workbench and the
   GET/DELETE/PATCH visitor routes are locked (503), never open.
3. `VISITOR_IP_SALT` — a random string so rate-limiting/dedupe IP hashes are stable.
4. `DISCORD_WEBHOOK_URL` — optional, for new-signature notifications.

Then deploy from the Vercel dashboard or `vercel --prod`. The production build is
verified with `npm run build`.
