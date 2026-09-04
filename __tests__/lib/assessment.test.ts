import { describe, it, expect } from "vitest";
import {
  instantiate,
  scoreAssessment,
  expiryFor,
  certificateNumber,
  VALIDITY_MONTHS,
} from "@/lib/assessment";
import { requirementsForDivision } from "@/app/data/requirements-data";
import { GATES } from "@/lib/standard-scoring";

const ALL_GATES = GATES.map((g) => g.id);

describe("instantiating an assessment", () => {
  it("creates exactly the requirements that apply to the Division", () => {
    for (const d of [1, 2, 3, 4, 5]) {
      const { requirements } = instantiate(d);
      expect(requirements).toHaveLength(requirementsForDivision(d).length);
    }
  });

  it("gives D1 seventeen and D5 twenty-nine", () => {
    expect(instantiate(1).requirements).toHaveLength(17);
    expect(instantiate(5).requirements).toHaveLength(29);
  });

  // Pinned so a certificate can always name the version it was measured under.
  it("pins the standard version onto the assessment", () => {
    expect(instantiate(3).standardVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("carries the expected tier through from the published standard", () => {
    const hu7 = instantiate(3).requirements.find((r) => r.code === "HU-7")!;
    expect(hu7.expectedTier).toBe("A");
    expect(hu7.right).toBe("HU");
  });

  it("refuses a Division that does not exist", () => {
    expect(() => instantiate(9)).toThrow();
  });
});

describe("scoring a stored assessment", () => {
  it("scores full marks when every requirement is met at its tier", () => {
    const stored = requirementsForDivision(3).map((r) => ({
      code: r.code,
      providedTier: r.tier as string,
    }));
    const result = scoreAssessment(3, stored, ALL_GATES);
    expect(result.overall).toBe(100);
    expect(result.status).toBe("Certified — Active");
  });

  it("returns no score at all when a gate is unmet", () => {
    const stored = requirementsForDivision(3).map((r) => ({
      code: r.code,
      providedTier: r.tier as string,
    }));
    expect(scoreAssessment(3, stored, []).overall).toBeNull();
  });

  it("treats a missing tier as nothing supplied", () => {
    const stored = requirementsForDivision(1).map((r) => ({
      code: r.code,
      providedTier: null,
    }));
    const result = scoreAssessment(1, stored, ALL_GATES);
    expect(result.overall).toBe(0);
  });
});

describe("certificate validity", () => {
  // A flat term would make a 24-month D2 and a 12-month D4 the same promise.
  it("is calibrated per Division, not flat", () => {
    expect(new Set(Object.values(VALIDITY_MONTHS)).size).toBeGreaterThan(1);
    expect(VALIDITY_MONTHS[2]).toBe(24);
    expect(VALIDITY_MONTHS[4]).toBe(12);
  });

  it("computes expiry from the issue date", () => {
    const issued = new Date("2027-02-14T00:00:00Z");
    expect(expiryFor(3, issued).toISOString().slice(0, 10)).toBe("2028-08-14");
    expect(expiryFor(2, issued).toISOString().slice(0, 10)).toBe("2029-02-14");
  });

  it("never returns an expiry before the issue date", () => {
    const issued = new Date("2027-06-01T00:00:00Z");
    for (const d of [1, 2, 3, 4, 5]) {
      expect(expiryFor(d, issued).getTime()).toBeGreaterThan(issued.getTime());
    }
  });
});

describe("certificate numbering", () => {
  it("carries the Division and year on its face", () => {
    const n = certificateNumber(3, new Date("2027-02-14T00:00:00Z"), 41);
    expect(n).toBe("AIC-D3-2027-0041");
  });

  it("pads the sequence so numbers sort", () => {
    const a = certificateNumber(1, new Date("2027-01-01T00:00:00Z"), 9);
    const b = certificateNumber(1, new Date("2027-01-01T00:00:00Z"), 10);
    expect([b, a].sort()).toEqual([a, b]);
  });
});
