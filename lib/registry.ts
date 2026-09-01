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
} from "@/lib/db";

/** Public status bands. Deliberately coarse — status is binary-ish by design
 *  so there is nothing to rank or game (PRD §8.2). */
export type RegistryStatus =
  | "Certified — Active"
  | "Certified — Provisional"
  | "Suspended"
  | "Lapsed"
  | "Expired";

/** Statuses that appear on the public register. "Assessed" and "Registered"
 *  deliberately do not appear here: they are confirmable at /verify but are
 *  never listed (§8.2). */
const LISTABLE: ReadonlySet<RegistryStatus> = new Set<RegistryStatus>([
  "Certified — Active",
  "Certified — Provisional",
  "Suspended",
  "Lapsed",
  "Expired",
]);

/** What /verify can return for a certificate that exists but is not listed. */
export type UnlistedStatus = "Assessed";

/** A public register listing. Note the absence of any numeric field — see the
 *  header comment. Findings, requirement-level results and telemetry are
 *  likewise absent by construction (§8.3 "Never public"). */
export interface RegistryListing {
  certId: string;
  organisation: string;
  status: RegistryStatus;
  division: string;
  scope: string;
  issued: string;
  expires: string;
  /** Present only where the organisation is provisional (§8.2). */
  remediationNote?: string;
}

export type VerificationResult =
  | { outcome: "listed"; listing: RegistryListing }
  | {
      outcome: "confirmed-unlisted";
      certId: string;
      organisation: string;
      status: UnlistedStatus;
      scope: string;
      issued: string;
    }
  | {
      outcome: "not-current";
      certId: string;
      organisation: string;
      status: Extract<RegistryStatus, "Suspended" | "Lapsed" | "Expired">;
      since: string;
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

/** Score → band. The ONLY place the number is interpreted, and the number does
 *  not escape this function. Bands per PRD §8.2. */
function bandFromScore(score: number): RegistryStatus | UnlistedStatus | "Registered" {
  if (score >= 80) return "Certified — Active";
  if (score >= 60) return "Certified — Provisional";
  if (score >= 40) return "Assessed";
  return "Registered";
}

const DIVISION_BY_TIER: Record<string, string> = {
  TIER_1: "Division 1 — Critical Accountability",
  TIER_2: "Division 2 — Elevated Supervision",
  TIER_3: "Division 3 — Standard Assurance",
};

function divisionLabel(tier: string | null): string {
  return (tier && DIVISION_BY_TIER[tier]) || "Division not recorded";
}

function isoDate(value: Date | string | null): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/** Certificate-level status overrides the score band: a suspended certificate
 *  is suspended regardless of how the organisation scored (§8.2, D7 — status
 *  history stays visible, certificates are never silently deleted). */
function certOverride(
  certStatus: string | null,
  expiry: Date | string | null
): Extract<RegistryStatus, "Suspended" | "Lapsed" | "Expired"> | null {
  const s = (certStatus || "").toUpperCase();
  if (s === "SUSPENDED") return "Suspended";
  if (s === "LAPSED" || s === "REVOKED") return "Lapsed";
  if (expiry) {
    const d = expiry instanceof Date ? expiry : new Date(expiry);
    if (!Number.isNaN(d.getTime()) && d.getTime() < Date.now()) return "Expired";
  }
  return null;
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

    const rows = await db
      .select({
        certNumber: issuedCertifications.certNumber,
        certStatus: issuedCertifications.status,
        issueDate: issuedCertifications.issueDate,
        expiryDate: issuedCertifications.expiryDate,
        standard: issuedCertifications.standard,
        orgName: organizations.name,
        tier: organizations.tier,
        // Read here, converted to a band below, and never returned.
        score: organizations.integrityScore,
      })
      .from(issuedCertifications)
      .innerJoin(organizations, eq(issuedCertifications.orgId, organizations.id))
      .orderBy(desc(issuedCertifications.issueDate));

    const listings: RegistryListing[] = [];

    for (const row of rows) {
      const override = certOverride(row.certStatus, row.expiryDate);
      const band = override ?? bandFromScore(row.score ?? 0);

      // "Assessed" and "Registered" are never listed (§8.2). They remain
      // confirmable by certificate ID at /verify.
      if (!LISTABLE.has(band as RegistryStatus)) continue;

      const status = band as RegistryStatus;
      listings.push({
        certId: row.certNumber,
        organisation: row.orgName,
        status,
        division: divisionLabel(row.tier),
        scope: row.standard ?? "",
        issued: isoDate(row.issueDate),
        expires: isoDate(row.expiryDate),
        ...(status === "Certified — Provisional"
          ? { remediationNote: "Provisional — 90-day remediation period in effect." }
          : {}),
      });
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
  const certId = rawCertId.trim();
  if (!certId) return { outcome: "no-record" };

  // Nothing provisioned means nothing has ever been issued — the honest answer
  // is "no certificates exist", not "verification is broken".
  if (!registerIsProvisioned()) return { outcome: "register-empty" };

  try {
    const db = getSystemDb();

    const [row] = await db
      .select({
        certNumber: issuedCertifications.certNumber,
        certStatus: issuedCertifications.status,
        issueDate: issuedCertifications.issueDate,
        expiryDate: issuedCertifications.expiryDate,
        standard: issuedCertifications.standard,
        orgName: organizations.name,
        tier: organizations.tier,
        score: organizations.integrityScore,
      })
      .from(issuedCertifications)
      .innerJoin(organizations, eq(issuedCertifications.orgId, organizations.id))
      .where(eq(issuedCertifications.certNumber, certId))
      .limit(1);

    if (!row) {
      // Distinguish "we have issued nothing at all" from "this specific ID is
      // not ours". Both are honest; they are not the same statement.
      const [any] = await db
        .select({ certNumber: issuedCertifications.certNumber })
        .from(issuedCertifications)
        .limit(1);
      return any ? { outcome: "no-record" } : { outcome: "register-empty" };
    }

    const override = certOverride(row.certStatus, row.expiryDate);
    if (override) {
      return {
        outcome: "not-current",
        certId: row.certNumber,
        organisation: row.orgName,
        status: override,
        since: isoDate(row.expiryDate),
      };
    }

    const band = bandFromScore(row.score ?? 0);

    if (band === "Assessed") {
      // Confirms without listing (§8.4) — this is the anti-forgery path.
      return {
        outcome: "confirmed-unlisted",
        certId: row.certNumber,
        organisation: row.orgName,
        status: "Assessed",
        scope: row.standard ?? "",
        issued: isoDate(row.issueDate),
      };
    }

    if (band === "Registered") {
      // Internal only (§8.2) — nothing is confirmed publicly.
      return { outcome: "no-record" };
    }

    const status = band as RegistryStatus;
    return {
      outcome: "listed",
      listing: {
        certId: row.certNumber,
        organisation: row.orgName,
        status,
        division: divisionLabel(row.tier),
        scope: row.standard ?? "",
        issued: isoDate(row.issueDate),
        expires: isoDate(row.expiryDate),
        ...(status === "Certified — Provisional"
          ? { remediationNote: "Provisional — 90-day remediation period in effect." }
          : {}),
      },
    };
  } catch (error) {
    console.error("[registry] verifyCertificate failed:", error);
    return { outcome: "unavailable" };
  }
}
