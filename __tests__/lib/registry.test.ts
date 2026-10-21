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
  suspendedAt?: Date | null;
  revokedAt?: Date | null;
  updatedAt?: Date | null;
  orgName: string;
  tier: string | null;
  score: number | null;
  standardVersion?: string | null;
  division?: number | null;
  scope?: string | null;
  scopeSystems?: unknown;
};

let rows: Row[] = [];
// Which migration 026 columns information_schema reports; null makes the
// detection query itself fail.
let columns: string[] | null = [];

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
    execute: async () => {
      if (columns === null) throw new Error("permission denied for information_schema");
      return { rows: columns.map((column_name) => ({ column_name })) };
    },
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
  sql: () => ({}),
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
  columns = [];
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

  // October 2026 review: the scenario's real ACTIVE certificate came back as
  // "no record" because its organisation's score was 0, the platform default.
  it("confirms an issued ACTIVE certificate whatever the score", async () => {
    for (const score of [0, 20, 55, null]) {
      rows = [row({ score })];
      const result = await verifyCertificate("AIC-00000001-2026");
      expect(result).toMatchObject({
        outcome: "listed",
        listing: { status: "Certified — Active" },
      });
      const [listing] = (await listRegistry())!;
      expect(listing.status).toBe("Certified — Active");
    }
  });

  it("accepts a certificate number typed in lower case", async () => {
    rows = [row()];
    expect((await verifyCertificate(" aic-00000001-2026 ")).outcome).toBe("listed");
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

  it("shows a revoked certificate as Revoked, dated by revoked_at", async () => {
    const revokedAt = new Date("2026-10-21T08:07:20Z");
    rows = [row({ certStatus: "REVOKED", revokedAt })];
    const [listing] = (await listRegistry())!;
    expect(listing).toMatchObject({ status: "Revoked", since: "2026-10-21" });
    expect(await verifyCertificate("AIC-00000001-2026")).toMatchObject({
      outcome: "not-current",
      listing: { status: "Revoked", since: "2026-10-21" },
    });
  });

  it("dates a suspension by suspended_at and handles WITHDRAWN", async () => {
    rows = [row({ certStatus: "SUSPENDED", suspendedAt: new Date("2026-03-02") })];
    expect((await listRegistry())![0]).toMatchObject({ status: "Suspended", since: "2026-03-02" });

    rows = [row({ certStatus: "WITHDRAWN", updatedAt: new Date("2026-04-05") })];
    expect(await verifyCertificate("AIC-00000001-2026")).toMatchObject({
      outcome: "not-current",
      listing: { status: "Withdrawn", since: "2026-04-05" },
    });
  });

  it("shows an ACTIVE row past its expiry date as Expired", async () => {
    rows = [row({ expiryDate: past })];
    expect((await listRegistry())![0]).toMatchObject({ status: "Expired" });
    expect((await listRegistry())![0].since).toBe(past.toISOString().slice(0, 10));
  });

  it("fails closed on a status it does not know", async () => {
    rows = [row({ certStatus: "PENDING" })];
    expect((await verifyCertificate("AIC-00000001-2026")).outcome).toBe("unavailable");
    expect(await listRegistry()).toEqual([]);
  });

  it("lets certificate status override a high score", async () => {
    rows = [row({ score: 100, certStatus: "SUSPENDED" })];
    const result = await verifyCertificate("AIC-00000001-2026");
    expect(result).toMatchObject({ outcome: "not-current", listing: { status: "Suspended" } });
  });
});

describe("certificate details (migration 026)", () => {
  it("never shows ISO/IEC 42001 as the scheme of an AIC certificate", async () => {
    rows = [row({ standard: "ISO/IEC 42001:2023" })];
    const [listing] = (await listRegistry())!;
    expect(listing.standard).toBe("AIC standard");
    expect(JSON.stringify(listing)).not.toMatch(/42001/);
  });

  it("works when the 026 columns are absent, or cannot be detected", async () => {
    rows = [row({ standard: "AIC Standard" })];
    columns = [];
    expect((await listRegistry())![0]).toMatchObject({
      standard: "AIC Standard",
      division: "",
      scope: "",
      scopeSystems: [],
    });
    columns = null;
    expect((await verifyCertificate("AIC-00000001-2026")).outcome).toBe("listed");
  });

  it("shows standard version, Division and scope when present", async () => {
    columns = ["standard_version", "division", "scope", "scope_systems"];
    rows = [
      row({
        standard: "AIC Standard",
        standardVersion: "1.0",
        division: 2,
        scope: "Motor claims triage",
        scopeSystems: ["Claims triage model", { id: "uuid-1", name: "Fraud flagger" }, { id: "uuid-2" }],
      }),
    ];
    const [listing] = (await listRegistry())!;
    expect(listing).toMatchObject({
      standard: "AIC Standard, version 1.0",
      division: "Division 2 (Supervised)",
      scope: "Motor claims triage",
      scopeSystems: ["Claims triage model", "Fraud flagger"],
    });
    expect(JSON.stringify(listing)).not.toMatch(/uuid/);
  });

  it("tolerates NULLs in the 026 columns", async () => {
    columns = ["standard_version", "division", "scope", "scope_systems"];
    rows = [row({ standardVersion: null, division: null, scope: null, scopeSystems: null })];
    expect((await listRegistry())![0]).toMatchObject({
      standard: "AIC standard",
      division: "",
      scope: "",
      scopeSystems: [],
    });
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
