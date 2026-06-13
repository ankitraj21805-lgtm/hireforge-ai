# HireForge AI

AI-powered career intelligence and recruitment operating system for enterprise recruiters, hiring managers, and job seekers.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/hireforge-ai run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, Tailwind CSS v4, Wouter, TanStack Query, Recharts, Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4 subpath)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- OpenAPI spec: `lib/api-spec/openapi.yaml` (source of truth)
- DB schema: `lib/db/src/schema/` (users, jobs, resumes, github_analyses, reports, activity)
- API routes: `artifacts/api-server/src/routes/` (auth, users, jobs, resumes, github, reports, dashboard, admin)
- Frontend pages: `artifacts/hireforge-ai/src/pages/`
- Generated hooks: `lib/api-client-react/src/generated/`
- Generated Zod: `lib/api-zod/src/generated/`

## Architecture decisions

- Contract-first: OpenAPI spec gates all codegen; never hand-write types that Orval produces.
- Session store is an in-memory Map — replace with Redis for production.
- Resume/GitHub analysis uses heuristic scoring — wire up OpenAI/Anthropic for real AI features.
- Dark mode default via `.dark` class on `<html>`; uses CSS custom properties throughout.
- Auth uses simple Bearer tokens in localStorage — replace with httpOnly cookies + refresh tokens for production.

## Product

HireForge AI provides: job application pipeline tracking, AI-powered resume scoring and analysis, GitHub developer profile scoring, user and admin dashboards with KPI cards and charts, and analytics reports — all in a premium dark enterprise UI.

## Demo Credentials

- `alex@hireforge.ai` / `password123` (user)
- `jordan@hireforge.ai` / `password123` (admin)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- Always run `pnpm run typecheck:libs` after changing any `lib/*` package before checking artifacts
- `zod/v4` subpath requires `zod` listed as a dependency in `artifacts/api-server/package.json`
- Session tokens are in-memory; restarting the API server clears all sessions (users need to log in again)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
