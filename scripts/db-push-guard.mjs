/**
 * A deliberate obstacle in front of `drizzle-kit push` from this repo.
 *
 * Two repositories point at the same production database with two schema
 * files, and ownership is split by DOMAIN rather than by file:
 *
 *   this repo (aic-web)    owns the standard, the scoring, the register,
 *                          /verify, and the certification-path tables
 *                          (assessments, assessment_requirements) — see the
 *                          note above them in lib/db/schema.ts.
 *
 *   aic-platform           owns identity and session state, because that is
 *                          where authentication lives: users, and the AIC
 *                          Aware tables (accountable_persons,
 *                          aware_assessments).
 *
 * `drizzle-kit push` reconciles the live database against the schema it is run
 * from, dropping whatever that schema does not declare. This schema does not
 * declare the platform-owned tables, so running push here proposes destroying
 * them — including every Accountable Person declaration, which is a signed
 * record of somebody accepting personal accountability.
 *
 * WHAT TO DO INSTEAD. Additive changes: write SQL by hand, as in
 * aic-platform/db/manual/. Anything structural: resolve the enum drift in the
 * migration snapshots first, then use generate + migrate. Push infers
 * deletions from absence, which is the entire hazard; migrations state changes
 * explicitly and leave a history you can review. This repo's own drizzle
 * config already says as much.
 *
 * If you have genuinely reconciled both schemas: npm run db:push:unsafe
 */

console.error(`
  db:push is disabled in this repository.

  Schema ownership is split by domain across two repos that share one
  database. drizzle-kit push drops whatever the schema it runs from does not
  declare. Running it here would propose dropping the platform-owned tables:

    accountable_persons  — signed declarations of personal accountability
    aware_assessments    — in-progress and submitted self-assessments

  Use a hand-written additive migration, or generate + migrate. See
  scripts/db-push-guard.mjs for the full explanation.

  If you have reconciled both schemas and are certain: npm run db:push:unsafe
`);

process.exit(1);
