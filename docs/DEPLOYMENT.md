# Deployment

## How the site runs

Two Coolify apps from this repository: **aic-web** (production, from `main`, aiccertified.cloud) and the staging app (from `staging`, staging.aiccertified.cloud). Each push to those branches deploys automatically.

Coolify builds with **Nixpacks** (`nixpacks.toml`): `npm ci`, then `npm run build`, keeping `.next/cache` between builds. Node comes from `engines` in `package.json` (22.x). `*.tsbuildinfo` must never be committed: Nixpacks mounts a cache volume at that path and a committed file crashes the container.

## Settings

Every variable is listed, with what it does, in `.env.example`. Set them in Coolify, never in a file. The ones that matter most:

| Variable | Without it |
| --- | --- |
| `DATABASE_URL` | Register, verification and forms cannot read or save. Use the database's internal service name as the host. |
| `NOTION_API_KEY` and the database IDs | News, articles and policy updates are empty. |
| `RESEND_API_KEY`, `CONTACT_NOTIFY_TO` | Enquiries are saved but nobody is told. |
| `CONTACT_IP_SALT` | IPs are hashed with a built-in default salt that anyone reading the code knows. Set a long random value. |
| `HEALTH_TOKEN` | `/api/health` gives only ok or degraded, never details. |
| `STANDARD_API_TOKEN` | `/api/standard` returns requirements only, not the scoring model. Same value on aic-platform. |
| `AIC_ENV=staging` | Staging only: keeps staging out of search engines. |

## After a deploy

Open `/api/health` (with the `x-health-token` header for details), the home page, `/registry` and one `/verify` link.

## Database changes

Apply them before the code that needs them: [DATABASE.md](DATABASE.md).

## Directus

The admin interface for the register runs as its own Coolify resource: [deploy/directus/README.md](../deploy/directus/README.md).
