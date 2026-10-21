// AI Integrity Certification — registry domain layer
//
// D6 (Website Master PRD §8.2): NO NUMERIC SCORES ON THE REGISTRY.
//
// This module is the only place the integrity score is allowed to be read, and
// it is deliberately designed so the score cannot leak by accident:
//
//   * The score is read inside this file, converted to a status band, and
//     dropped. It is never assigned to a returned object.
//   * The exported types (RegistryListing, VerificationResult) have no field
//     that could carry it. A future edit that tries to pass a score out fails
//     to compile rather than quietly shipping a number to the public register.
//
// That is the point: D6 should be enforced by the type system, not by whoever
// is editing the file remembering the rule.
//
// Publication rules implemented here come from PRD §8.2 and are settled — do
// not relax them without changing the PRD first.

import "server-only";

import {
  getSystemDb,
  organizations,
  issuedCertifications,
  eq,
  desc,
  sql,
} from "@/lib/db";
import { divisionProfile } from "@/app/data/divisions";

/** Public status bands. Deliberately coarse — status is binary-ish by design
 *  so there is nothing to rank or game (PRD §8.2). */
export type RegistryStatus =
  | "Certified — Active"
  | "Certified — Provisional"
  | "Suspended"
  | "Revoked"
  | "Withdrawn"
  | "Expired";

/** Statuses for a certificate that exists but is not currently valid. */
export type NotCurrentStatus = Extract<
  RegistryStatus,
  "Suspended" | "Revoked" | "Withdrawn" | "Expired"
>;

/** Statuses that appear on the public register. Every status an issued
 *  certificate can have is listed: status history stays visible (D7). */
const LISTABLE: ReadonlySet<RegistryStatus> = new Set<RegistryStatus>([
  "Certified — Active",
  "Certified — Provisional",
  "Suspended",
  "Revoked",
  "Withdrawn",
  "Expired",
]);

/** A public register listing. Note the absence of any numeric field — see the
 *  header comment. Findings, requirement-level results and telemetry are
 *  likewise absent by construction (§8.3 "Never public"). */
export interface RegistryListing {
  certId: string;
  organisation: string;
  status: RegistryStatus;
  /** Empty when the certificate does not record a Division. */
  division: string;
  /** The scheme the certificate was issued under, with its version. */
  standard: string;
  /** Free-text scope from the certificate, if recorded. */
  scope: string;
  /** Names of the systems in scope, if recorded. Names only, never IDs. */
  scopeSystems: string[];
  issued: string;
  expires: string;
  /** For a certificate that is not current: the date it stopped being so. */
  since?: string;
  /** Present only where the organisation is provisional (§8.2). */
  remediationNote?: string;
}

export type VerificationResult =
  | { outcome: "listed"; listing: RegistryListing }
  | {
      outcome: "not-current";
      listing: RegistryListing & { status: NotCurrentStatus };
    }
  | { outcome: "no-record" }
  /** The register is reachable but has nothing in it yet — distinct from a
   *  lookup miss, and distinct from an outage. §8.5. */
  | { outcome: "register-empty" }
  /** The datastore could not be reached. We say so rather than implying "no
   *  record", which would be an untrue negative answer about a real
   *  certificate. */
  | { outcome: "unavailable" };

/**
 * Whether a register datastore is configured at all.
 *
 * There is a real difference between "the register exists and we cannot reach
 * it" (an outage — say so) and "no register has been provisioned yet" (nothing
 * is certified, which is simply true). Conflating them would either cry outage
 * on a site that has never issued a certificate, or — worse — report an empty
 * register during a genuine database failure.
 */
function registerIsProvisioned(): boolean {
  // Read through a computed key. `process.env.DATABASE_URL` (dot access) is
  // statically replaced at build time in the server-component bundle, so when
  // the build runs without the variable — the normal case, since Coolify build
  // args and runtime env are separate — it is baked in as `undefined` and stays
  // that way at runtime no matter what the container's environment says.
  //
  // The symptom was ugly and specific: with the database configured but DOWN,
  // /registry announced "no organisation currently holds AIC certification"
  // instead of admitting it could not reach the register. A false negative
  // about certification is the one answer this page must never give.
  //
  // A computed key cannot be statically analysed, so this is read at runtime.
  const env = process.env;
  return Boolean(env["DATABASE_URL"] || env["POSTGRES_URL"]);
}

// October 2026 review: the Division used to be derived from organizations.tier
// (TIER_1 to TIER_3), with names that are not AIC's Divisions at all. Tier is a
// different axis. The Division now comes from the certificate itself (migration
// 026) and is named from app/data/divisions.ts, so the register and the
// standard can never disagree about what a Division is called.
function divisionLabel(division: number | string | null | undefined): string {
  const n = Number(division);
  if (division === null || division === undefined || !Number.isInteger(n)) return "";
  const profile = divisionProfile(n);
  return profile ? `Division ${n} (${profile.name})` : `Division ${n}`;
}

// October 2026 review: issued_certifications.standard defaulted to
// 'ISO/IEC 42001:2023' on the platform, so every certificate issued before
// migration 026 carries that string even though AIC certifies against its own
// published standard and is not an ISO/IEC 42001 certification body. Showing
// it would tell a reader the certificate is something it is not, so that
// value is read as "AIC standard". New certificates say 'AIC Standard'.
function standardLabel(
  standard: string | null | undefined,
  version: string | null | undefined
): string {
  const raw = (standard ?? "").trim();
  if (!raw) return "";
  const name = /^ISO\/IEC 42001/i.test(raw) ? "AIC standard" : raw;
  const v = (version ?? "").trim();
  return v ? `${name}, version ${v}` : name;
}

/** Only human-readable names leave this module. scope_systems is jsonb whose
 *  exact shape belongs to the platform; anything that is not a plain string or
 *  an object with a string `name` is dropped rather than risk publishing an
 *  internal identifier. */
function scopeSystemNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const names: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) names.push(item.trim());
    else if (item && typeof item === "object") {
      const name = (item as Record<string, unknown>).name;
      if (typeof name === "string" && name.trim()) names.push(name.trim());
    }
  }
  return names;
}

function isoDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function isPast(value: Date | string | null | undefined): boolean {
  if (!value) return false;
  const d = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}

/** The certificate's own status, mapped to its public meaning and the date it
 *  took effect. October 2026 review: REVOKED used to show as "Lapsed" dated by
 *  the expiry date, which is both the wrong word (a revocation is a decision,
 *  not a lapse) and the wrong date; WITHDRAWN was not handled at all and fell
 *  through as if active. Each status now carries its own date column. Returns
 *  null for a certificate that is current. Throws on a status this module does
 *  not know, so the caller fails closed rather than confirming it. */
function certOverride(row: CertRow): { status: NotCurrentStatus; since: string } | null {
  // NULL is the column default's absence, which the platform treats as ACTIVE.
  const s = (row.certStatus ?? "ACTIVE").toUpperCase();
  switch (s) {
    case "SUSPENDED":
      return { status: "Suspended", since: isoDate(row.suspendedAt ?? row.updatedAt) };
    case "REVOKED":
      return { status: "Revoked", since: isoDate(row.revokedAt ?? row.updatedAt) };
    case "WITHDRAWN":
      // No withdrawn_at column exists; the platform records a withdrawal's
      // time in revoked_at where it records one at all, else updated_at.
      return { status: "Withdrawn", since: isoDate(row.revokedAt ?? row.updatedAt) };
    case "EXPIRED":
      return { status: "Expired", since: isoDate(row.expiryDate) };
    case "ACTIVE":
      // No job sets EXPIRED yet, so an ACTIVE row past its expiry date is
      // expired in fact and must be shown as such.
      return isPast(row.expiryDate)
        ? { status: "Expired", since: isoDate(row.expiryDate) }
        : null;
    default:
      throw new Error(`[registry] unknown certificate status: ${s}`);
  }
}

/** The public band for a current (ACTIVE, unexpired) certificate.
 *
 *  October 2026 review, and the cause of /verify answering "no record" for a
 *  real ACTIVE certificate: the band used to come from
 *  organizations.integrity_score alone, and a score under 40 meant
 *  "Registered", which /verify reports as no record. The platform issues a
 *  certificate through a certification decision and never sets that score as
 *  part of it (it is 0 until the separate intelligence job runs), so a freshly
 *  issued certificate was denied. An issued, current certificate is the record
 *  of certification; the score may only mark it Provisional (§8.2), never
 *  unmake it. This is now the ONLY place the score is interpreted, and it
 *  does not escape this function (D6).
 *
 *  "Assessed" (40 to 59) was removed with it: it described an organisation's
 *  score, not a certificate, and confirmed a row in a table of issued
 *  certificates as something less than certified. */
function bandForCurrent(score: number | null): Extract<
  RegistryStatus,
  "Certified — Active" | "Certified — Provisional"
> {
  const n = score ?? 0;
  return n >= 60 && n < 80 ? "Certified — Provisional" : "Certified — Active";
}

type CertRow = {
  certNumber: string;
  certStatus: string | null;
  issueDate: Date | string | null;
  expiryDate: Date | string | null;
  standard: string | null;
  suspendedAt?: Date | string | null;
  revokedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  orgName: string;
  score: number | null;
  standardVersion?: string | null;
  division?: number | string | null;
  scope?: string | null;
  scopeSystems?: unknown;
};

// Migration 026 adds these to issued_certifications. The website reads the
// platform's database and may be deployed before the migration has run, so
// each one is selected only once it exists. A positive answer is cached
// because columns do not disappear; a negative one is re-checked on each
// request so the page picks the columns up as soon as the migration runs.
const OPTIONAL_COLUMNS = ["standard_version", "division", "scope", "scope_systems"] as const;
type OptionalColumn = (typeof OPTIONAL_COLUMNS)[number];
let presentColumns: Set<OptionalColumn> | null = null;

async function optionalColumns(
  db: ReturnType<typeof getSystemDb>
): Promise<Set<OptionalColumn>> {
  if (presentColumns && presentColumns.size === OPTIONAL_COLUMNS.length) return presentColumns;
  try {
    const result = await db.execute(sql`
      select column_name from information_schema.columns
      where table_name = 'issued_certifications'
        and table_schema = current_schema()
        and column_name in ('standard_version', 'division', 'scope', 'scope_systems')
    `);
    const found = new Set<OptionalColumn>();
    for (const r of result.rows as { column_name: string }[]) {
      if ((OPTIONAL_COLUMNS as readonly string[]).includes(r.column_name)) {
        found.add(r.column_name as OptionalColumn);
      }
    }
    presentColumns = found;
    return found;
  } catch (error) {
    // Not being able to tell is not a reason to fail the lookup: answer from
    // the columns that have always existed.
    console.error("[registry] column detection failed:", error);
    return new Set();
  }
}

/** The projection shared by the register and /verify. The score is selected
 *  so it can be turned into a band, and is never copied into a result. */
async function certSelection(db: ReturnType<typeof getSystemDb>) {
  const cols = await optionalColumns(db);
  return {
    certNumber: issuedCertifications.certNumber,
    certStatus: issuedCertifications.status,
    issueDate: issuedCertifications.issueDate,
    expiryDate: issuedCertifications.expiryDate,
    standard: issuedCertifications.standard,
    // From the platform's 002 lifecycle migration; not in the website's schema
    // mirror, so named directly.
    suspendedAt: sql<Date | string | null>`"issued_certifications"."suspended_at"`,
    revokedAt: sql<Date | string | null>`"issued_certifications"."revoked_at"`,
    updatedAt: sql<Date | string | null>`"issued_certifications"."updated_at"`,
    orgName: organizations.name,
    score: organizations.integrityScore,
    ...(cols.has("standard_version")
      ? { standardVersion: sql<string | null>`"issued_certifications"."standard_version"` }
      : {}),
    ...(cols.has("division")
      ? { division: sql<number | null>`"issued_certifications"."division"` }
      : {}),
    ...(cols.has("scope") ? { scope: sql<string | null>`"issued_certifications"."scope"` } : {}),
    ...(cols.has("scope_systems")
      ? { scopeSystems: sql<unknown>`"issued_certifications"."scope_systems"` }
      : {}),
  };
}

function toListing(row: CertRow): RegistryListing {
  const override = certOverride(row);
  const status: RegistryStatus = override?.status ?? bandForCurrent(row.score);
  return {
    certId: row.certNumber,
    organisation: row.orgName,
    status,
    division: divisionLabel(row.division),
    standard: standardLabel(row.standard, row.standardVersion),
    scope: (row.scope ?? "").trim(),
    scopeSystems: scopeSystemNames(row.scopeSystems),
    issued: isoDate(row.issueDate),
    expires: isoDate(row.expiryDate),
    ...(override ? { since: override.since } : {}),
    ...(status === "Certified — Provisional"
      ? { remediationNote: "Provisional — 90-day remediation period in effect." }
      : {}),
  };
}

/**
 * The public register.
 *
 * Returns null when the datastore is unreachable, so callers can distinguish
 * "nothing is certified yet" (empty array — the honest §8.5 empty state) from
 * "we cannot answer right now". Those must never render the same way: the
 * first is a true statement about the world, the second is an outage.
 */
export async function listRegistry(): Promise<RegistryListing[] | null> {
  // No datastore provisioned yet: nothing has been certified, which is exactly
  // what the §8.5 empty state says. This is the current production state.
  if (!registerIsProvisioned()) return [];

  try {
    const db = getSystemDb();

    const rows = (await db
      .select(await certSelection(db))
      .from(issuedCertifications)
      .innerJoin(organizations, eq(issuedCertifications.orgId, organizations.id))
      .orderBy(desc(issuedCertifications.issueDate))) as CertRow[];

    const listings: RegistryListing[] = [];

    for (const row of rows) {
      // organizations.publicDirectoryVisible is deliberately NOT consulted here.
      // Listing follows the certificate's status; the flag is an exceptional
      // override for AIC, not a client opt-in, and must never hide a
      // suspension. See the note on the column in lib/db/schema.ts.
      //
      // A row with a status this module does not recognise is left off the
      // register rather than taking the whole register down with it.
      try {
        const listing = toListing(row);
        if (LISTABLE.has(listing.status)) listings.push(listing);
      } catch (error) {
        console.error("[registry] skipped a certificate:", error);
      }
    }

    return listings;
  } catch (error) {
    console.error("[registry] listRegistry failed:", error);
    return null;
  }
}

/**
 * Certificate lookup for /verify/[certId] — answers for ALL statuses (§8.4),
 * including certificates that exist but are not listed.
 */
export async function verifyCertificate(
  rawCertId: string
): Promise<VerificationResult> {
  // Certificate numbers are issued in upper case (AIC-XXXXXXXXXX-YYYY). A
  // number read off a badge and typed in lower case is the same certificate.
  const certId = rawCertId.trim().toUpperCase();
  if (!certId) return { outcome: "no-record" };

  // Nothing provisioned means nothing has ever been issued — the honest answer
  // is "no certificates exist", not "verification is broken".
  if (!registerIsProvisioned()) return { outcome: "register-empty" };

  try {
    const db = getSystemDb();

    const [row] = (await db
      .select(await certSelection(db))
      .from(issuedCertifications)
      .innerJoin(organizations, eq(issuedCertifications.orgId, organizations.id))
      .where(eq(issuedCertifications.certNumber, certId))
      .limit(1)) as CertRow[];

    if (!row) {
      // Distinguish "we have issued nothing at all" from "this specific ID is
      // not ours". Both are honest; they are not the same statement.
      const [any] = await db
        .select({ certNumber: issuedCertifications.certNumber })
        .from(issuedCertifications)
        .limit(1);
      return any ? { outcome: "no-record" } : { outcome: "register-empty" };
    }

    const listing = toListing(row);
    if (listing.since !== undefined) {
      return {
        outcome: "not-current",
        listing: listing as RegistryListing & { status: NotCurrentStatus },
      };
    }
    return { outcome: "listed", listing };
  } catch (error) {
    console.error("[registry] verifyCertificate failed:", error);
    return { outcome: "unavailable" };
  }
}
