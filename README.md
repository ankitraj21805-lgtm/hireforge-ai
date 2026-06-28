# HireForge AI

**AI-Powered Career Intelligence & Recruitment Operating System**

HireForge AI is a full-stack career-tech platform that combines job tracking, resume intelligence, GitHub profile analysis, user dashboards, admin analytics, reports, authentication, and deployment-ready architecture into one professional project.

---

## Live Demo

| Service | Live URL |
|---|---|
| Frontend App | https://hireforge-ai-hireforge-ai-nu.vercel.app |
| Backend API | https://hireforge-ai-api.onrender.com |
| Health Check | https://hireforge-ai-api.onrender.com/api/health |

> Render free services may take a short time to wake up after inactivity.

---

## Project Overview

HireForge AI is designed as a flagship full-stack portfolio project for demonstrating modern web development, backend API engineering, PostgreSQL database integration, monorepo structure, authentication logic, dashboard design, and production deployment workflows.

The product is positioned for job seekers, recruiters, and hiring teams who need one system to track applications, analyze resumes, score GitHub profiles, and review dashboard intelligence.

---

## Core Modules

| Module | Description |
|---|---|
| Job Tracker | Manage applications across Applied, Screening, Interview, Offer, and Rejected stages |
| Resume Analyzer | Score resumes, extract skills, summarize strengths, and suggest improvements |
| GitHub Analyzer | Analyze developer profiles, repositories, languages, and activity signals |
| User Dashboard | KPI cards, activity feed, job summary, and visual insights |
| Admin Dashboard | Platform-wide metrics and analytics overview |
| Reports | Generated intelligence reports with exportable-style metrics |
| Authentication | Register/login workflow with protected user routes |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI / State | TanStack React Query, Wouter, Recharts, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Validation | Zod |
| API Contract | OpenAPI, Orval-generated clients |
| Deployment | Vercel frontend, Render backend, Neon PostgreSQL |
| Monorepo | pnpm workspaces |

---

## Project Structure

```txt
artifacts/
  api-server/         Express API server
  hireforge-ai/       React + Vite frontend

lib/
  api-spec/           OpenAPI contract
  api-client-react/   Generated React Query hooks
  api-zod/            Generated Zod schemas
  db/                 Drizzle database schema
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
PORT=5000
```

---

## Development Setup

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/hireforge-ai run dev
```

---

## Skills Demonstrated

- Full-stack product architecture
- React + TypeScript frontend development
- Express.js API engineering
- PostgreSQL + Drizzle ORM database workflow
- Authentication and session logic
- API contract and generated client structure
- Dashboard and analytics UI
- Deployment across Vercel, Render, and Neon
- README and recruiter-focused project documentation

---

## Recommended GitHub Topics

```txt
fullstack
react
typescript
express
postgresql
drizzle-orm
career-tech
resume-analyzer
github-analyzer
job-tracker
dashboard
vercel
render
neon
portfolio-project
```

---

## Demo Credentials

```txt
User:  alex@hireforge.ai / password123
Admin: jordan@hireforge.ai / password123
```

---

## Roadmap

- Add full production authentication
- Add resume PDF upload
- Add AI/LLM-based resume feedback
- Add saved GitHub analysis history
- Add advanced admin analytics
- Add automated email notifications
- Add screenshots and demo video

---

## Author

**Ankit Sharma**

- GitHub: [ankitraj21805-lgtm](https://github.com/ankitraj21805-lgtm)
- LinkedIn: [ankitsharma-frontend](https://www.linkedin.com/in/ankitsharma-frontend/)
- Email: [ankitraj21805@gmail.com](mailto:ankitraj21805@gmail.com)
