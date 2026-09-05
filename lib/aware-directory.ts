// AI Integrity Certification — AIC Aware directory domain layer
//
// AIC Aware is the free, self-declared companion to AIC Certified. It is
// deliberately kept to the same "no numeric scores public" discipline as the
// certified register (see lib/registry.ts, PRD §8.2 D6): a public list of
// self-declared scores would read as a leaderboard, and a leaderboard of
// unverified numbers is exactly the kind of claim this organisation does not
// make. So this directory lists WHO has declared, and WHEN — never the score,
// never a risk band, never anything that could look audited.
//
// Listing here requires the organisation to have explicitly opted in during
// the assessment flow (app/aware/AwareClient.tsx) — unlike the certified
// register, which lists by status band with no client opt-in (see the note on
// organizations.publicDirectoryVisible in lib/registry.ts). Opting in sets
// leads.status to 'LISTED'; no schema migration was needed for this because
// `status` is a free-text column, not an enum, on this table.

import "server-only";

import { getSystemDb, leads, eq, desc } from "@/lib/db";

export interface AwareListing {
  /** Company name as the organisation entered it. Never an email address. */
  company: string;
  /** ISO date (yyyy-mm-dd) the declaration was made. */
  declaredOn: string;
}

function registerIsProvisioned(): boolean {
  // Same runtime-read rationale as lib/registry.ts: process.env.DATABASE_URL
  // (dot access) gets statically inlined at build time, which is wrong here
  // because Coolify's build-time env and runtime env are separate. Read
  // through a computed key so it's evaluated at request time instead.
  const env = process.env;
  return Boolean(env["DATABASE_URL"] || env["POSTGRES_URL"]);
}

/**
 * The AIC Aware directory.
 *
 * Returns null when the datastore is unreachable, [] when it is reachable but
 * nobody has opted in yet — the same distinction lib/registry.ts draws for
 * the certified register, and for the same reason: an outage must never
 * render as "nobody has declared", because that is a false statement about
 * the world rather than an honest "we can't say right now".
 */
export async function listAwareDirectory(): Promise<AwareListing[] | null> {
  if (!registerIsProvisioned()) return [];

  try {
    const db = getSystemDb();

    const rows = await db
      .select({
        company: leads.company,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(eq(leads.status, "LISTED"))
      .orderBy(desc(leads.createdAt));

    return rows
      .filter((r): r is { company: string; createdAt: Date | null } => Boolean(r.company))
      .map((r) => ({
        company: r.company,
        declaredOn: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : "",
      }));
  } catch (error) {
    console.error("[aware-directory] listAwareDirectory failed:", error);
    return null;
  }
}
