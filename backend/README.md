# OneStack AI — Pilot Stack

Production-intent skeleton for the pilot: Fastify (TypeScript) + Prisma (Postgres) + BullMQ (Redis) with pluggable AI/provider adapters.
Focus areas: Marketing (text/video), Booking, Offers, Pre-accounting (light), EHF invoicing (adapter), Payments, OCR, Reputation, Reporting.

## Quick start (dev)
1) Requirements: Node 20+, Docker, Docker Compose.
2) `cp .env.example .env` and fill provider keys (leave empty to run in mock-only mode).
3) `docker compose up -d` (starts Postgres + Redis).
4) `npm i`
5) `npm run prisma:push`
6) `npm run dev` (API on http://localhost:3000)

## Packages
- `fastify` HTTP, `zod` validation, `prisma` ORM, `bullmq` job queue
- Adapters in `src/adapters/*` (mock-first). Replace with real provider SDK calls when ready.
- OpenAPI spec in `openapi.yaml`.

## Notes
- This is **safe-by-default**: when keys are missing, routes run in MOCK mode and return deterministic fake results.
- Webhooks are exposed under `/api/webhooks/*` — configure provider dashboards accordingly.
- All actions are persisted with audit trail in `AuditLog`.
