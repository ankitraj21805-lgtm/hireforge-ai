# HireForge AI

**AI-Powered Career Intelligence & Recruitment Operating System**

HireForge AI is an enterprise-grade platform that gives recruiters, hiring managers, and job seekers a decisive edge. It combines job tracking, AI resume analysis, GitHub profile scoring, and analytics reporting into a single unified command center.

---

## Features

| Module | Description |
|--------|-------------|
| **Job Tracker** | Full pipeline management (Applied → Screening → Interview → Offer / Rejected) with search and filtering |
| **Resume Analyzer** | AI-powered resume scoring, skills extraction, and improvement suggestions |
| **GitHub Analyzer** | Developer profile scoring — repo count, commit activity, language distribution, and strengths |
| **User Dashboard** | KPI cards, activity feed, job pipeline summary, and Recharts visualizations |
| **Admin Dashboard** | Platform-wide metrics: total users, jobs, analyses, and weekly activity |
| **Reports** | Generated intelligence reports with exportable metrics |
| **Authentication** | JWT-based register/login with protected route guards |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4 |
| UI Components | shadcn/ui-style (Radix UI primitives) |
| State / Data | TanStack React Query, Wouter (routing) |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | Express 5, Node.js 24, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4 |
| API Contract | OpenAPI 3.1 → Orval codegen (React Query hooks + Zod schemas) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
artifacts/
  api-server/         Express 5 API server
    src/routes/       Route handlers (auth, jobs, resumes, github, reports, dashboard, admin)
  hireforge-ai/       React + Vite frontend
    src/
      pages/          Route-level page components
      components/     Shared UI components
      lib/            Utilities and context

lib/
  api-spec/           OpenAPI 3.1 contract (source of truth)
  api-client-react/   Generated React Query hooks (from codegen)
  api-zod/            Generated Zod validation schemas
  db/
    src/schema/       Drizzle ORM table definitions
      users.ts
      jobs.ts
      resumes.ts
      github_analyses.ts
      reports.ts
      activity.ts
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL (or use Replit's built-in database)

### Environment Variables

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
PORT=5000
```

### Development

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm --filter @workspace/db run push

# Start API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Start frontend (port from $PORT env)
pnpm --filter @workspace/hireforge-ai run dev

# Regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Typecheck all packages
pnpm run typecheck
```

---

## Database Schema

| Table | Key Columns |
|-------|-------------|
| `users` | id, name, email, password_hash, role, company, title |
| `jobs` | id, title, company, location, status, salary, url, notes, applied_at, user_id |
| `resumes` | id, file_name, score, summary, skills[], experience[], improvements[], user_id |
| `github_analyses` | id, username, score, repo_count, commit_score, top_languages[], strengths[], user_id |
| `reports` | id, title, type, summary, metrics{}, user_id |
| `activity` | id, type, description, user_id, created_at |

---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT token |
| POST | `/auth/logout` | Invalidate session |
| GET | `/auth/me` | Get current user |

### Jobs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/jobs` | List jobs (filter by `status`, `search`) |
| POST | `/jobs` | Create job |
| GET | `/jobs/:id` | Get job |
| PATCH | `/jobs/:id` | Update job |
| DELETE | `/jobs/:id` | Delete job |
| GET | `/jobs/stats` | Status breakdown counts |

### Resume Analysis
| Method | Path | Description |
|--------|------|-------------|
| GET | `/resumes` | List analyzed resumes |
| POST | `/resumes/analyze` | Submit resume for analysis |
| GET | `/resumes/:id` | Get resume analysis |

### GitHub Analysis
| Method | Path | Description |
|--------|------|-------------|
| POST | `/github/analyze` | Analyze a GitHub profile |
| GET | `/github/analyses` | List past analyses |
| GET | `/github/analyses/:id` | Get specific analysis |

### Dashboard & Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard/stats` | User KPI summary |
| GET | `/dashboard/activity` | Recent activity feed |
| GET | `/admin/stats` | Platform-wide admin metrics |

---

## Prisma-Ready Structure

The schema layer (`lib/db/src/schema/`) is designed to be Drizzle-compatible today and migration-ready for Prisma. To migrate to Prisma:

1. Replace `drizzle-orm` with `@prisma/client`
2. Translate `lib/db/src/schema/*.ts` table definitions to `schema.prisma`
3. Run `prisma migrate dev`
4. Update `lib/db/src/index.ts` to use `PrismaClient`

The OpenAPI contract and generated hooks remain unchanged.

---

## Demo Credentials

```
Email:    alex@hireforge.ai
Password: password123
Role:     user

Email:    jordan@hireforge.ai  
Password: password123
Role:     admin
```

---

## Architecture Decisions

- **Contract-first API**: OpenAPI spec in `lib/api-spec/openapi.yaml` is the single source of truth. All types flow from spec → codegen → frontend hooks and backend Zod validators.
- **Shared lib packages**: `@workspace/db`, `@workspace/api-zod`, `@workspace/api-client-react` are composite TypeScript libs, enabling strict cross-package typing.
- **Session store**: In-memory Map for demo simplicity. Replace with Redis or DB-backed sessions for production scale.
- **Analysis engine**: Resume and GitHub analyzers use deterministic heuristic scoring. Replace with OpenAI or Anthropic API calls for production AI features.
- **Dark mode default**: The app defaults to dark mode via `.dark` class on `<html>`. Light mode support can be added via `next-themes`.
