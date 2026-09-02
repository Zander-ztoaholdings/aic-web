#!/usr/bin/env node
/**
 * Apply pending migrations, from inside the container that already holds a
 * working DATABASE_URL.
 *
 *   Coolify -> Terminal -> aic-web:  node scripts/migrate.mjs
 *   Add --dry-run to see what would be applied without touching anything.
 *
 * Replaces scripts/apply-schema.mjs, which could only bootstrap an empty
 * database and refused once any table existed — no use for the second migration
 * onwards.
 *
 * Design notes, all of them about not corrupting a certification register:
 *
 *   - Each migration runs in its own transaction. drizzle-kit's generated SQL is
 *     NOT transactional; applying 0001 without a transaction once left the
 *     schema half-migrated (indexes dropped, constraints not added) and the
 *     retry then failed on the already-dropped index. Never again.
 *   - Applied migrations are recorded in schema_migrations, so this is safe to
 *     re-run and only does outstanding work.
 *   - BASELINING: production had 0000 applied by the old bootstrap script, with
 *     no bookkeeping table. If bookkeeping is missing but application tables
 *     already exist, 0000 is recorded as an out-of-band baseline rather than
 *     re-run — re-running it would fail on every CREATE TABLE and tell us
 *     nothing useful.
 *   - Credentials never appear in output.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const DIR = join(here, "..", "db", "migrations");
const DRY = process.argv.includes("--dry-run");

const connectionString =
  process.env["DATABASE_URL"] || process.env["POSTGRES_URL"];

if (!connectionString) {
  console.error("DATABASE_URL is not set in this container.");
  process.exit(1);
}
if (!existsSync(DIR)) {
  console.error(`No migrations directory at ${DIR}`);
  process.exit(1);
}

function safeTarget(url) {
  try {
    const u = new URL(url);
    return `${u.hostname}:${u.port || "5432"}${u.pathname}`;
  } catch {
    return "(unparseable)";
  }
}

const files = readdirSync(DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("No migration files found.");
  process.exit(0);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log(`Connected to ${safeTarget(connectionString)}`);
  if (DRY) console.log("DRY RUN — nothing will be written.\n");

  const { rows: bookkeeping } = await client.query(
    `SELECT to_regclass('public.schema_migrations') IS NOT NULL AS present`
  );
  const hasBookkeeping = bookkeeping[0]?.present === true;

  if (!hasBookkeeping && !DRY) {
    await client.query(`
      CREATE TABLE schema_migrations (
        filename    text PRIMARY KEY,
        checksum    text NOT NULL,
        applied_at  timestamptz NOT NULL DEFAULT now(),
        baselined   boolean NOT NULL DEFAULT false
      )`);
    console.log("Created schema_migrations bookkeeping table.");
  }

  // Baseline: schema already present from the old bootstrap script.
  if (!hasBookkeeping) {
    const { rows } = await client.query(
      `SELECT to_regclass('public.organizations') IS NOT NULL AS present`
    );
    if (rows[0]?.present) {
      const first = files[0];
      const sum = createHash("sha256")
        .update(readFileSync(join(DIR, first)))
        .digest("hex")
        .slice(0, 16);
      console.log(
        `Baselining ${first} — application tables already exist, so it was ` +
          `applied out of band. Recording it rather than re-running it.`
      );
      if (!DRY) {
        await client.query(
          `INSERT INTO schema_migrations (filename, checksum, baselined)
           VALUES ($1, $2, true) ON CONFLICT (filename) DO NOTHING`,
          [first, sum]
        );
      }
    }
  }

  const { rows: appliedRows } = DRY && !hasBookkeeping
    ? { rows: [] }
    : await client.query(`SELECT filename FROM schema_migrations`);
  const applied = new Set(appliedRows.map((r) => r.filename));

  const pending = files.filter((f) => !applied.has(f));
  if (pending.length === 0) {
    console.log("\nNothing to do — the database is up to date.");
    process.exit(0);
  }

  console.log(`\n${pending.length} migration(s) pending:`);
  for (const f of pending) console.log("  ", f);
  if (DRY) {
    console.log("\nDry run complete. Re-run without --dry-run to apply.");
    process.exit(0);
  }

  for (const file of pending) {
    const sql = readFileSync(join(DIR, file), "utf8");
    const sum = createHash("sha256").update(sql).digest("hex").slice(0, 16);
    process.stdout.write(`\nApplying ${file} ... `);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`,
        [file, sum]
      );
      await client.query("COMMIT");
      console.log("ok");
    } catch (err) {
      await client.query("ROLLBACK").catch(() => {});
      console.log("FAILED — rolled back, no changes applied");
      console.error(`  ${err?.code ? err.code + ": " : ""}${err?.message}`);
      console.error(
        "\nThe database is unchanged by this migration. Fix the cause and re-run;\n" +
          "already-applied migrations will be skipped."
      );
      process.exit(1);
    }
  }

  const { rows: tables } = await client.query(
    `SELECT count(*)::int AS n FROM information_schema.tables
      WHERE table_schema='public' AND table_type='BASE TABLE'`
  );
  console.log(`\nDone. ${tables[0].n} tables in the database.`);
} catch (err) {
  console.error(`\nFailed: ${err?.code ? err.code + ": " : ""}${err?.message}`);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
