import { describe, it, expect } from "vitest";
import {
  score,
  geometricMean,
  requirementScore,
  standardPayload,
  BANDS,
  GATES,
  type EvidenceSubmission,
} from "@/lib/standard-scoring";
import { requirementsForDivision, requirements } from "@/app/data/requirements-data";

/** Every applicable requirement satisfied at exactly the tier it asks for. */
function perfect(division: number): EvidenceSubmission[] {
  return requirementsForDivision(division).map((r) => ({
    code: r.code,
    provided: r.tier,
  }));
}
const ALL_GATES = GATES.map((g) => g.id);

describe("requirement scoring", () => {
  it("gives full marks for the best evidence a requirement admits", () => {
    expect(requirementScore("A", "A")).toBe(1);
    expect(requirementScore("C", "C")).toBe(1);
  });

  it("penalises weaker evidence proportionally", () => {
    expect(requirementScore("A", "C")).toBeCloseTo(0.6);
    expect(requirementScore("A", "D")).toBeCloseTo(0.4);
  });

  // Fifty policy documents cannot substitute for one operational log.
  it("gives no bonus for over-providing", () => {
    expect(requirementScore("C", "A")).toBe(1);
    expect(requirementScore("D", "A")).toBe(1);
  });

  it("scores nothing where nothing was provided", () => {
    expect(requirementScore("A", null)).toBe(0);
  });
});

describe("geometric mean", () => {
  it("penalises imbalance against the arithmetic mean", () => {
    // The vault's own illustration: 10 and 90.
    expect(geometricMean([10, 90])).toBeCloseTo(30, 0);
    expect(geometricMean([50, 50])).toBe(50);
  });

  it("loses nothing when performance is even", () => {
    expect(geometricMean([70, 70, 70, 70, 70])).toBeCloseTo(70);
  });

  // Beautiful disclosure notices do not help someone wrongly rejected by a
  // broken oversight process.
  it("takes the whole score to zero if any right is zero", () => {
    expect(geometricMean([100, 100, 100, 100, 0])).toBe(0);
  });
});

describe("gates", () => {
  it("produces no score rather than a low one when a gate fails", () => {
    const r = score(3, perfect(3), ["ai-inventory-submitted"]);
    expect(r.overall).toBeNull();
    expect(r.status).toMatch(/gate/i);
    expect(r.gatesFailed).toContain("accountable-person-signed");
  });

  it("does not require continuous monitoring of Divisions 1 and 5", () => {
    const r = score(1, perfect(1), [
      "accountable-person-signed",
      "ai-inventory-submitted",
    ]);
    expect(r.gatesFailed).toEqual([]);
    expect(r.overall).not.toBeNull();
  });

  it("does require it of Divisions 2 to 4", () => {
    const r = score(3, perfect(3), [
      "accountable-person-signed",
      "ai-inventory-submitted",
    ]);
    expect(r.gatesFailed).toContain("pulse-installed");
  });
});

describe("bands and floors", () => {
  it("awards Certified — Active for full evidence across every right", () => {
    const r = score(3, perfect(3), ALL_GATES);
    expect(r.overall).toBe(100);
    expect(r.status).toBe("Certified — Active");
  });

  // Layer 2: a status requires a minimum on EVERY right, not an average.
  it("holds back a status when one right is below its floor", () => {
    const subs = perfect(3).map((s) =>
      s.code.startsWith("EM") ? { ...s, provided: null } : s
    );
    const r = score(3, subs, ALL_GATES);
    expect(r.status).not.toBe("Certified — Active");
    expect(r.overall).toBe(0); // a right at zero takes the product to zero
  });

  it("names what limited the status", () => {
    const subs = perfect(3).map((s) =>
      s.code.startsWith("TR") ? { ...s, provided: "D" as const } : s
    );
    const r = score(3, subs, ALL_GATES);
    if (r.status !== "Certified — Active") {
      expect(r.limitedBy).not.toBeNull();
    }
  });

  it("orders bands from strongest to weakest with no gaps", () => {
    const mins = BANDS.map((b) => b.min);
    expect(mins).toEqual([...mins].sort((a, b) => b - a));
    expect(mins).toEqual([80, 60, 40, 0]);
  });
});

describe("evidence ceiling", () => {
  // Attestation-only caps around 65 no matter how much of it there is.
  it("bounds the score by the best evidence actually supplied", () => {
    const subs = requirementsForDivision(3).map((r) => ({
      code: r.code,
      provided: "D" as const,
    }));
    const r = score(3, subs, ALL_GATES);
    expect(r.evidenceCeiling).toBeCloseTo(40);
    expect(r.overall!).toBeLessThanOrEqual(40);
  });
});

describe("not testable", () => {
  it("records a limitation and caps the status at Provisional", () => {
    const subs = perfect(3).map((s) =>
      s.code === "EM-7" ? { ...s, notTestable: true, provided: null } : s
    );
    const r = score(3, subs, ALL_GATES);
    expect(r.notTestableCount).toBe(1);
    expect(r.status).not.toBe("Certified — Active");
  });
});

describe("the payload consuming systems read", () => {
  it("carries every requirement", () => {
    expect(standardPayload().requirements).toHaveLength(requirements.length);
  });

  // The whole reason this exists: aic-platform's HU-1 means "AI Systems
  // Register" while the published HU-1 is the Accountable Person. Anything
  // consuming this payload gets the published meanings.
  it("keeps codes bound to their published meaning", () => {
    const hu1 = standardPayload().requirements.find((r) => r.code === "HU-1")!;
    expect(hu1.text).toMatch(/Accountable Person is named in writing/i);
    const hu3 = standardPayload().requirements.find((r) => r.code === "HU-3")!;
    expect(hu3.text).toMatch(/inventory of AI systems/i);
  });

  // Scoped to the requirements themselves: the payload's own notes field
  // mentions ISO/IEC 42001 precisely to say the mapping is withheld.
  it("never exposes a verification method or an ISO mapping", () => {
    const blob = JSON.stringify(standardPayload().requirements);
    expect(blob).not.toMatch(/ISO\/IEC 42001/);
    expect(blob).not.toMatch(/"verification"/);
    expect(blob).not.toMatch(/\bA\.\d+\b/);
  });
});
