# scripts

| Script | Does |
| --- | --- |
| `migrate.mjs` | Applies outstanding migrations from `db/migrations`, each in its own transaction, recorded in `schema_migrations`. Run in Coolify, aic-web, Terminal: `node scripts/migrate.mjs` (add `--dry-run` first). |
| `db-push-guard.mjs` | Stands in front of `npm run db:push` and refuses, because the database is shared with aic-platform. See [docs/DATABASE.md](../docs/DATABASE.md). |
| `build-country-detail.mjs` | Generates `app/data/country-frames.ts` and `app/data/country-detail.ts`. |
| `build-world-map.mjs` | Generates `public/data/world-map.json` (the projected world map) from `data/countries-50m.json`. |

Run the two build scripts with `node scripts/<name>.mjs` after changing their inputs, and commit what they generate.
