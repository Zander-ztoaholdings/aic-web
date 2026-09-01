import { describe, it, expect, vi, beforeEach } from "vitest";

// D6 (PRD §8.2): no numeric scores on the registry.
//
// These tests exist because "we remembered not to include the score" is not a
// control. They assert the guarantee at runtime against representative rows,
// including the boundary values of every band, so a future refactor that
// reintroduces the number fails here rather than on the public register.

type Row = {
  certNumber: string;
  certStatus: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  standard: string | null;
  orgName: string;
  tier: string | null;
  score: number | null;
};

let rows: Row[] = [];

// Minimal Drizzle-shaped chain: select().from().innerJoin().orderBy() and the
// .where().limit() variant used by verifyCertificate. The mock honours the
// where clause — otherwise a lookup for an unknown ID would wrongly return the
// first row and the "unknown ID" test would pass for the wrong reason.
type Eq = { __col: unknown; __val: unknown };

function makeDb() {
  const build = (data: Row[], project: (r: Row) => unknown) => {
    let filtered = data;
    const chain: Record<string, unknown> = {};
    for (const m of ["from", "innerJoin", "orderBy", "limit"]) {
      chain[m] = () => chain;
    }
    chain.where = (cond: Eq) => {
      if (cond && cond.__col === "certNumber") {
        filtered = filtered.filter((r) => r.certNumber === cond.__val);
      }
      return chain;
    };
    chain.then = (resolve: (v: unknown[]) => unknown) =>
      resolve(filtered.map(project));
    return chain;
  };

  return {
    select: (fields?: Record<string, unknown>) => {
      // verifyCertificate's "has anything been issued at all?" probe selects a
      // single column; everything else selects the full projection.
      const isProbe = fields && Object.keys(fields).length === 1;
      return build(rows, (r) => (isProbe ? { certNumber: r.certNumber } : r));
    },
  };
}

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
  getSystemDb: () => makeDb(),
  organizations: { name: "name", tier: "tier", integrityScore: "score", id: "id" },
  issuedCertifications: {
    certNumber: "certNumber",
    status: "certStatus",
    issueDate: "issueDate",
    expiryDate: "expiryDate",
    standard: "standard",
    orgId: "orgId",
  },
  eq: (col: unknown, val: unknown) => ({ __col: col, __val: val }),
  desc: () => ({}),
}));

const { listRegistry, verifyCertificate } = await import("@/lib/registry");

const future = new Date(Date.now() + 365 * 24 * 3600 * 1000);
const past = new Date(Date.now() - 24 * 3600 * 1000);

function row(over: Partial<Row> = {}): Row {
  return {
    certNumber: "AIC-00000001-2026",
    certStatus: "ACTIVE",
    issueDate: new Date("2026-01-15"),
    expiryDate: future,
    standard: "ISO/IEC 42001:2023",
    orgName: "Example Org",
    tier: "TIER_2",
    score: 90,
    ...over,
  };
}

/** Recursively assert no key or value anywhere in the payload carries a score. */
function assertNoScore(value: unknown, path = "$"): void {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoScore(v, `${path}[${i}]`));
    return;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      expect(
        /score|integrity|rating|rank/i.test(k),
        `forbidden key "${k}" at ${path}`
      ).toBe(false);
      assertNoScore(v, `${path}.${k}`);
    }
  }
}

beforeEach(() => {
  rows = [];
  // A provisioned register is the default for these tests; the unprovisioned
  // case is covered explicitly at the bottom of the file.
  process.env.DATABASE_URL = "postgres://test/test";
});

describe("D6 — no numeric scores on the registry", () => {
  it("never exposes a score field on any listing, at any band", async () => {
    rows = [
      row({ certNumber: "AIC-A-2026", score: 100 }),
      row({ certNumber: "AIC-B-2026", score: 80 }),
      row({ certNumber: "AIC-C-2026", score: 79 }),
      row({ certNumber: "AIC-D-2026", score: 60 }),
    ];
    const listings = await listRegistry();
    expect(listings).not.toBeNull();
    assertNoScore(listings);
  });

  it("never exposes a score through verification, at any band", async () => {
    for (const score of [100, 80, 79, 60, 59, 40, 39, 0]) {
      rows = [row({ score })];
      assertNoScore(await verifyCertificate("AIC-00000001-2026"));
    }
  });
});

describe("publication rules (§8.2)", () => {
  it("lists Certified — Active at the 80 boundary", async () => {
    rows = [row({ score: 80 })];
    const [listing] = (await listRegistry())!;
    expect(listing.status).toBe("Certified — Active");
  });

  it("lists Certified — Provisional between 60 and 79, with the remediation note", async () => {
    rows = [row({ score: 79 })];
    const [listing] = (await listRegistry())!;
    expect(listing.status).toBe("Certified — Provisional");
    expect(listing.remediationNote).toMatch(/90-day/);
  });

  it("does NOT list Assessed (40–59) — confirmable at /verify only", async () => {
    rows = [row({ score: 55 })];
    expect(await listRegistry()).toEqual([]);

    const result = await verifyCertificate("AIC-00000001-2026");
    expect(result.outcome).toBe("confirmed-unlisted");
  });

  it("does NOT list or confirm Registered (<40) — internal only", async () => {
    rows = [row({ score: 20 })];
    expect(await listRegistry()).toEqual([]);
    expect((await verifyCertificate("AIC-00000001-2026")).outcome).toBe("no-record");
  });
});

describe("D7 — status history stays visible", () => {
  it("keeps a suspended certificate listed rather than deleting it", async () => {
    rows = [row({ certStatus: "SUSPENDED" })];
    const [listing] = (await listRegistry())!;
    expect(listing.status).toBe("Suspended");
  });

  it("reports an expired certificate as expired, not as valid", async () => {
    rows = [row({ expiryDate: past })];
    const result = await verifyCertificate("AIC-00000001-2026");
    expect(result.outcome).toBe("not-current");
  });

  it("lets certificate status override a high score", async () => {
    rows = [row({ score: 100, certStatus: "SUSPENDED" })];
    const result = await verifyCertificate("AIC-00000001-2026");
    expect(result).toMatchObject({ outcome: "not-current", status: "Suspended" });
  });
});

describe("honest failure states", () => {
  it("distinguishes an empty register from an unknown ID", async () => {
    rows = [];
    expect((await verifyCertificate("AIC-NOPE-2026")).outcome).toBe("register-empty");

    rows = [row({ certNumber: "AIC-REAL-2026" })];
    expect((await verifyCertificate("AIC-NOPE-2026")).outcome).toBe("no-record");
  });

  it("returns an empty array, not null, when nothing is certified", async () => {
    rows = [];
    expect(await listRegistry()).toEqual([]);
  });
});

describe("register not yet provisioned (current production state)", () => {
  // The live database is not connected yet. Until it is, the register must show
  // the §8.5 founding-cohort empty state — NOT an outage banner. "Nothing is
  // certified" is true; "the register is down" would not be.
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
  });

  it("renders as an empty register, not an outage", async () => {
    expect(await listRegistry()).toEqual([]);
  });

  it("answers verification with register-empty, not unavailable", async () => {
    expect((await verifyCertificate("AIC-00000001-2026")).outcome).toBe(
      "register-empty"
    );
  });
});
