# External Integrations

**Analysis Date:** 2026-07-22

## APIs & External Services

**None detected.**

The codebase currently contains only boilerplate code from `create-turbo`, `create-next-app`, and `flutter create`. No external API clients, SDKs, or service integrations have been added yet.

**Intended domain (from project name "aqwanetio" — aquaculture water quality monitoring):**
- Likely future integrations: IoT/MQTT for sensor data ingestion, time-series databases, mapping/GIS services
- No implementation exists yet

## Data Storage

**Databases:**
- None configured

**File Storage:**
- Local filesystem only (boilerplate static assets in `apps/aqwanetio_website/public/`)

**Caching:**
- None configured

## Authentication & Identity

**Auth Provider:**
- None configured
- No authentication middleware, session management, or OAuth flows present

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- None configured

**Analytics:**
- None configured

**Logs:**
- Default stdout only (Next.js dev server, Flutter debug output)

## CI/CD & Deployment

**Hosting:**
- Not configured
- Vercel is the assumed deployment target for Next.js (default in starter template, `.vercel` gitignored at root)
- No deployment config files present

**CI Pipeline:**
- None configured — no `.github/` workflows, no CI config files

## Environment Configuration

**Development:**
- No required env vars declared
- No `.env.example` or `.env.template` exists
- `.env` files are gitignored but none exist in the repo

**Production:**
- Not configured

**Secrets location:**
- Not applicable (no secrets infrastructure)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-07-22*
*Update when adding/removing external services*
