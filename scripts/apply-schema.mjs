#!/usr/bin/env node
/**
 * Apply the generated schema to the database this container is already
 * connected to.
 *
 * Why this exists: the VPS firewall blocks 5432 inbound, so drizzle-kit cannot
 * reach Postgres from a laptop, and exposing the database to the internet for a
 * one-off migration is a bad trade for a certification register. This runs
 * INSIDE the app container, which already holds a valid DATABASE_URL and can
 * reach the database over the internal Docker network.
 *
 *   Coolify -> Terminal -> aic-web container:
 *     node scripts/apply-schema.mjs
 *
 * Safety properties, in order of how much they matter here:
 *   - Runs in a single transaction. A partially-created register is worse than
 *     no register: either all 44 tables exist or none do.
 *   - Refuses to run if application tables are already present, so it cannot be
 *     used to clobber a live register by accident.
 *   - Read-only until it commits, and prints what it is about to do.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATION = join(here, "..", "db", "migrations", "0000_rich_exodus.sql");

const connectionString =
  process.env["DATABASE_URL"] || process.env["POSTGRES_URL"];

if (!connectionString) {
  console.error(
    "DATABASE_URL is not set in this container. Nothing to connect to."
  );
  process.exit(1);
}

if (!existsSync(MIGRATION)) {
  console.error(`Migration file not found at ${MIGRATION}`);
  console.error(
    "This script must run from the deployed repo, which includes db/migrations."
  );
  process.exit(1);
}

const sql = readFileSync(MIGRATION, "utf8");

// Redact credentials before printing anything.
function safeTarget(url) {
  try {
    const u = new URL(url);
    return `${u.hostname}:${u.port || "5432"}${u.pathname}`;
  } catch {
    return "(unparseable)";
  }
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log(`Connected to ${safeTarget(connectionString)}`);

  const { rows: existing } = await client.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name`
  );

  if (existing.length > 0) {
    console.error(
      `\nRefusing to run: ${existing.length} table(s) already exist in this database:`
    );
    console.error("  " + existing.map((r) => r.table_name).join(", "));
    console.error(
      "\nIf this is a fresh database that somehow has tables, inspect it first." +
        "\nThis script will not modify an existing schema — that is deliberate."
    );
    process.exit(1);
  }

  const statements = sql.split("--> statement-breakpoint").length;
  console.log(`Applying ${statements} statements in one transaction...`);

  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");

  const { rows: after } = await client.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name`
  );

  console.log(`\nDone. ${after.length} tables created.`);

  const expected = [
    "organizations",
    "issued_certifications",
    "audit_ledger",
    "conflict_checks",
  ];
  const names = new Set(after.map((r) => r.table_name));
  const missing = expected.filter((t) => !names.has(t));

  if (missing.length) {
    console.error(`\nWARNING — expected tables missing: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log("Registry tables present: " + expected.join(", "));
  console.log("\nCheck https://aiccertified.cloud/api/registry — expect 200 with an empty register.");
} catch (err) {
  // The transaction is rolled back automatically when the connection closes
  // without a COMMIT, but be explicit about it.
  try {
    await client.query("ROLLBACK");
    console.error("\nRolled back — no changes were applied.");
  } catch {
    /* connection already gone */
  }
  console.error(`\nFailed: ${err?.code ? err.code + ": " : ""}${err?.message}`);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
