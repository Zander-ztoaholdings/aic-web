import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

// The 44-table schema in lib/db/schema.ts had no way to be applied — there was
// no drizzle-kit, no config, and init.sql only creates the `assessments` table.
// So even with DATABASE_URL set correctly, the registry tables would not exist.
//
// Usage:
//   npm run db:push      — apply the schema directly (right for now, pre-cohort)
//   npm run db:generate  — write a migration file instead (switch to this once
//                          real certificates exist and schema history matters)
//   npm run db:studio    — browse the data locally
//
// Once certificates are live, prefer generate+migrate over push: a certification
// register wants a reviewable history of schema changes, not silent mutation.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});
