# AIC Website

The public website for AI Integrity Certification at **aiccertified.cloud**: what AIC certifies and how, the published standard, the public certification register and certificate verification, AIC Aware, news, guides and the regulatory map, and the contact and intake forms.

AIC records and tracks. It does not consult, and it never certifies the output of its own tools.

## What is in this repository

| Path | What it is |
| --- | --- |
| [`app/`](app/README.md) | Pages, API routes and components (Next.js App Router). |
| [`lib/`](lib/README.md) | Logic shared by pages and routes: scoring, registry, Aware, news, SEO, analytics. |
| [`db/`](db/README.md) | Drizzle migrations for the website's tables. |
| [`scripts/`](scripts/README.md) | Applying migrations, the `db:push` guard, and the map data builders. |
| [`data/`](data/README.md) | Raw source data the map builders read. |
| `public/` | Static files: logos, images, the Declaration PDF, prebuilt map data. |
| `deploy/directus/` | Runbook and compose file for Directus, the admin interface for the register. |
| [`docs/`](docs/README.md) | Explanatory documents: architecture, development, database, deployment and releases. |
| `__tests__/` | Vitest tests. |

## Stack

Next.js 15 (App Router) and React 19, TypeScript, Tailwind CSS 4, Framer Motion, Drizzle ORM on PostgreSQL (the database shared with the platform), Notion as the CMS for articles and policy updates, Resend for contact notifications, Google Analytics 4 after consent. Node 22.

## Quick start

```bash
nvm use                  # Node 22, from .nvmrc
cp .env.example .env.local
npm ci
npm run dev              # http://localhost:3000
```

Pages that read the database (register, verification, forms) need `DATABASE_URL`, and news and articles need `NOTION_API_KEY`; the rest of the site runs without them. Full set-up: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Everyday commands

| Command | Does |
| --- | --- |
| `npm run dev` | Runs the site on port 3000. |
| `npm test` | Runs the Vitest suite. |
| `npm run type-check` | TypeScript, no output files. |
| `npm run lint` | ESLint. |
| `npm run build` | Production build. |

## Deploying

Coolify builds the site with Nixpacks: `main` to production, `staging` to staging.aiccertified.cloud. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Security

See [SECURITY.md](SECURITY.md) to report a vulnerability. Proprietary. Copyright 2026 AI Integrity Certification (AIC), Johannesburg, South Africa.
