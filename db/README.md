# db

`migrations/` holds the Drizzle migrations for the tables this repository owns (0000 to 0003 so far), with Drizzle's `meta/` snapshots. `scripts/migrate.mjs` applies them in production.

Before changing the schema, read [docs/DATABASE.md](../docs/DATABASE.md): the database is shared with aic-platform, and only some tables are this repository's to change.
