# Database

The website and the platform (`aic-platform`) share **one** production PostgreSQL database. Each repository has its own Drizzle schema file, and ownership is split by domain:

| Owner | Tables |
| --- | --- |
| This repo (aic-web) | The standard, scoring, the public register, `/verify`, and the certification path (`assessments`, `assessment_requirements`). Also the site's own forms: `contact_submissions`, `leads`, `newsletter_subscribers`, `alpha_applications`. |
| aic-platform | Identity and sessions (`users` and the rest of authentication), AIC Aware (`accountable_persons`, `aware_assessments`), and everything the platform app does. |

The schema in `lib/db/schema.ts` declares many tables the platform owns, so the site can read them. Declaring a table here does not make it ours to change.

## Why `npm run db:push` refuses

`drizzle-kit push` makes the live database match the schema file it runs from. With two schema files that differ, it would propose dropping the other repo's tables. `scripts/db-push-guard.mjs` stands in front of it. `npm run db:push:unsafe` exists only for a local database of your own.

## How a change to a website table reaches production

1. Change `lib/db/schema.ts`.
2. `npm run db:generate` writes a migration into `db/migrations`. Read the SQL: it must only touch tables this repo owns, and must not drop anything with data in it.
3. Run it on staging first: Coolify, the staging aic-web app, Terminal: `node scripts/migrate.mjs --dry-run`, then without `--dry-run`.
4. Check the site, then do the same on production **before** pushing the code that needs it.

`scripts/migrate.mjs` runs each migration in its own transaction and records it in `schema_migrations`, so it is safe to run again and only applies what is outstanding.

A change to a table the platform owns is made in the platform repo instead, as a hand-written migration in its `db/manual` folder.

## Connection

`lib/db/db.ts` reads `DATABASE_URL` (or `POSTGRES_URL`). In Coolify the host must be the database's internal service name, never `localhost`.
