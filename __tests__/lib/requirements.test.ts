import { describe, it, expect } from "vitest";
import {
  requirements,
  requirementsForDivision,
  countByRight,
  RIGHTS,
  TIER_MEANING,
  type RightCode,
} from "@/app/data/requirements-data";

describe("requirement matrix", () => {
  it("publishes all 44 requirements", () => {
    expect(requirements).toHaveLength(44);
  });

  it("matches the per-right counts the framework specifies", () => {
    const counts: Record<string, number> = {};
    for (const r of requirements) counts[r.right] = (counts[r.right] ?? 0) + 1;
    expect(counts).toEqual({ HU: 11, EX: 7, EM: 10, CO: 9, TR: 7 });
  });

  it("has unique, well-formed codes", () => {
    const codes = requirements.map((r) => r.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const r of requirements) {
      expect(r.code).toMatch(/^(HU|EX|EM|CO|TR)-\d{1,2}$/);
      expect(r.code.startsWith(r.right)).toBe(true);
    }
  });

  it("applies every requirement to at least one valid Division", () => {
    for (const r of requirements) {
      expect(r.divisions.length, r.code).toBeGreaterThan(0);
      for (const d of r.divisions) expect([1, 2, 3, 4, 5]).toContain(d);
      // Sorted and unique, so the rendered list is stable.
      expect([...r.divisions].sort((a, b) => a - b)).toEqual(r.divisions);
      expect(new Set(r.divisions).size).toBe(r.divisions.length);
    }
  });

  it("states what it tests and what evidence it takes", () => {
    for (const r of requirements) {
      expect(r.text.trim().length, r.code).toBeGreaterThan(20);
      expect(r.evidence.trim(), r.code).not.toBe("");
      expect(r.tier in TIER_MEANING, r.code).toBe(true);
      expect(r.right in RIGHTS, r.code).toBe(true);
    }
  });

  // The verification method and the ISO clause mapping are deliberately not
  // published. This asserts they have not crept in through the text fields.
  it("does not leak the withheld columns", () => {
    for (const r of requirements) {
      const blob = `${r.text} ${r.evidence}`;
      expect(blob, r.code).not.toMatch(/ISO\/IEC 42001|ISO 42001/i);
      expect(blob, r.code).not.toMatch(/\bA\.\d+\b/); // ISO annex clause refs
    }
  });

  // The source matrix hand-totalled its applicability table and got D5 wrong
  // — it claimed 31 where the listed requirements come to 29. Deriving the
  // counts is the fix; this is the regression test for it.
  it("derives Division totals rather than trusting a hand-written table", () => {
    expect(requirementsForDivision(1)).toHaveLength(17);
    expect(requirementsForDivision(2)).toHaveLength(41);
    expect(requirementsForDivision(3)).toHaveLength(43);
    expect(requirementsForDivision(4)).toHaveLength(43);
    expect(requirementsForDivision(5)).toHaveLength(29);
  });

  it("keeps per-right counts consistent with the Division totals", () => {
    for (const d of [1, 2, 3, 4, 5]) {
      const byRight = countByRight(d);
      const summed = (Object.keys(byRight) as RightCode[]).reduce(
        (acc, k) => acc + byRight[k],
        0
      );
      expect(summed, `division ${d}`).toBe(requirementsForDivision(d).length);
    }
  });

  it("marks the requirements that are hardest to fake", () => {
    const flagship = requirements.filter((r) => r.flagship).map((r) => r.code);
    expect(flagship).toContain("EX-5"); // stated reason vs actual driver
    expect(flagship).toContain("CO-6"); // overturn rate non-zero
    expect(flagship).toContain("TR-3"); // disclosure before the effect
    expect(flagship).toContain("HU-11"); // can describe reality unaided
  });

  it("orders evidence tiers by strength", () => {
    expect(TIER_MEANING.A.weight).toBeGreaterThan(TIER_MEANING.B.weight);
    expect(TIER_MEANING.B.weight).toBeGreaterThan(TIER_MEANING.C.weight);
    expect(TIER_MEANING.C.weight).toBeGreaterThan(TIER_MEANING.D.weight);
  });
});
