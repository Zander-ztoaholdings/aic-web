/**
 * The AIC certification scoring model.
 *
 * Distinct from lib/scoring.ts, which scores the public self-assessment
 * questionnaire. This one implements the audited certification scale from the
 * Scoring Architecture — gates, floors, geometric mean, evidence ceiling — and
 * is the definition served to the platform and engine.
 *
 * WHY THIS LIVES HERE, NEXT TO THE PUBLISHED STANDARD
 *
 * Three systems currently disagree about what AIC assesses and how it scores:
 *
 *   - This site publishes 44 coded requirements with evidence tiers.
 *   - aic-platform stores a generic checklist (title, description, category,
 *     status) with no requirement code, no tier and no Division scoping. Its
 *     only use of the codes is demo data whose meanings conflict with the
 *     published set — its HU-1 is "AI Systems Register", which is HU-3 here,
 *     and its HU-4 is "Accountable Person RACI", which is HU-1 here.
 *   - aic-engine scores with a band at 50, from the retired three-band scale.
 *
 * A certificate is a claim that an organisation was measured against a
 * published standard. If the thing doing the measuring and the thing being
 * published are different documents, the certificate does not mean what the
 * standard says it means — which is EX-5, "the stated reason must materially
 * match the actual driver", failing inside AIC's own tooling.
 *
 * So the definition is served from the same file the public reads, over
 * /api/standard, and the platform and engine consume it rather than keeping
 * their own copies. The standard people can read and the standard an auditor
 * scores against are the same bytes, by construction.
 */

import {
  requirements,
  requirementsForDivision,
  TIER_MEANING,
  type EvidenceTier,
  type RightCode,
} from "@/app/data/requirements-data";

export const SCORING_VERSION = "1.0.0";

/** Layer 2: every status requires a minimum on EVERY right, not an average. */
export const BANDS = [
  { status: "Certified — Active", min: 80, floorPerRight: 70 },
  { status: "Certified — Provisional", min: 60, floorPerRight: 50 },
  { status: "Assessed", min: 40, floorPerRight: 0 },
  { status: "Registered", min: 0, floorPerRight: 0 },
] as const;

/**
 * Layer 1: binary gates, checked before any scoring happens. Failing one
 * produces no score rather than a low one — the ISO/IEC 17021-1
 * major-nonconformity shape, which is deliberate: it reads as familiar rigour
 * to an accreditation assessor.
 */
export const GATES = [
  { id: "accountable-person-signed", label: "Accountable Person has signed the declaration", divisions: [1, 2, 3, 4, 5] },
  { id: "ai-inventory-submitted", label: "AI system inventory submitted", divisions: [1, 2, 3, 4, 5] },
  { id: "pulse-installed", label: "Continuous monitoring installed", divisions: [2, 3, 4] },
] as const;

export interface EvidenceSubmission {
  /** Requirement code, e.g. "HU-7". */
  code: string;
  /** The tier of evidence actually provided, or null where nothing was. */
  provided: EvidenceTier | null;
  /**
   * Set where a requirement could not be tested — EM-7 when a client cannot
   * supply demographic data. Scores zero but is recorded as a documented
   * limitation rather than a failure, and caps the result at Provisional.
   */
  notTestable?: boolean;
}

export interface ScoreResult {
  /** Null when a gate failed: no score, not a low one. */
  overall: number | null;
  perRight: Record<RightCode, number>;
  status: string;
  gatesFailed: string[];
  /** Layer 4: the ceiling implied by the best evidence actually supplied. */
  evidenceCeiling: number;
  /** Which floor, if any, held the status below what the overall would allow. */
  limitedBy: string | null;
  notTestableCount: number;
  version: typeof SCORING_VERSION;
}

const weight = (t: EvidenceTier) => TIER_MEANING[t].weight;

/**
 * Per requirement: min(provided ÷ expected, 1). Supplying the best evidence a
 * requirement admits earns full marks; supplying weaker evidence than was
 * obtainable is penalised proportionally; over-supplying earns no bonus, which
 * is what stops paperwork-flooding.
 */
export function requirementScore(expected: EvidenceTier, provided: EvidenceTier | null): number {
  if (!provided) return 0;
  return Math.min(weight(provided) / weight(expected), 1);
}

/**
 * Layer 3: geometric mean across the five rights, not arithmetic.
 *
 * Arithmetic mean treats accountability as a pile of points. Geometric mean
 * treats it as a chain, and chains fail at the weakest link — beautiful
 * disclosure notices do not help the person wrongly rejected by a broken
 * oversight process. Two consequences fall out of the maths rather than being
 * invented: an imbalance penalty (the gap to the arithmetic mean), and a hard
 * floor at zero, since any right scoring zero takes the product to zero.
 */
export function geometricMean(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.some((v) => v <= 0)) return 0;
  const logSum = values.reduce((n, v) => n + Math.log(v), 0);
  const result = Math.exp(logSum / values.length);
  // The log/exp form drifts: five rights at exactly 50 came back as
  // 49.99999999999999. Harmless in most arithmetic, not here — the band
  // minimums and the per-right floors are exact comparisons, so a value one
  // part in 10^15 below a threshold silently downgrades a certificate.
  // Rounded well inside any meaningful precision but past the drift.
  return Math.round(result * 1e9) / 1e9;
}

export function score(division: number, submissions: EvidenceSubmission[], gatesPassed: string[]): ScoreResult {
  const applicable = requirementsForDivision(division);
  const byCode = new Map(submissions.map((s) => [s.code, s]));

  const gatesFailed = GATES.filter(
    (g) => (g.divisions as readonly number[]).includes(division) && !gatesPassed.includes(g.id)
  ).map((g) => g.id);

  const perRight = { HU: 0, EX: 0, EM: 0, CO: 0, TR: 0 } as Record<RightCode, number>;
  const rightsPresent: RightCode[] = [];
  let bestTierWeight = 0;
  let notTestableCount = 0;

  for (const right of ["HU", "EX", "EM", "CO", "TR"] as RightCode[]) {
    const inRight = applicable.filter((r) => r.right === right);
    if (inRight.length === 0) continue;
    rightsPresent.push(right);

    let total = 0;
    for (const req of inRight) {
      const sub = byCode.get(req.code);
      if (sub?.notTestable) {
        notTestableCount++;
        continue; // scores zero, recorded as a limitation
      }
      if (sub?.provided) bestTierWeight = Math.max(bestTierWeight, weight(sub.provided));
      total += requirementScore(req.tier, sub?.provided ?? null);
    }
    perRight[right] = (total / inRight.length) * 100;
  }

  if (gatesFailed.length > 0) {
    return {
      overall: null,
      perRight,
      status: "Not assessed — gate not met",
      gatesFailed,
      evidenceCeiling: bestTierWeight * 100,
      limitedBy: null,
      notTestableCount,
      version: SCORING_VERSION,
    };
  }

  const raw = geometricMean(rightsPresent.map((r) => perRight[r]));
  // Layer 4: bounded by the best evidence supplied, independent of volume.
  const evidenceCeiling = bestTierWeight * 100;
  const overall = Math.min(raw, evidenceCeiling);

  let status = "Registered";
  let limitedBy: string | null = null;
  for (const band of BANDS) {
    if (overall < band.min) continue;
    const belowFloor = rightsPresent.find((r) => perRight[r] < band.floorPerRight);
    if (belowFloor) {
      limitedBy = `${belowFloor} below the ${band.floorPerRight} floor for ${band.status}`;
      continue;
    }
    status = band.status;
    break;
  }

  // A documented limitation caps the result at Provisional.
  if (notTestableCount > 0 && status === "Certified — Active") {
    status = "Certified — Provisional";
    limitedBy = `${notTestableCount} requirement(s) recorded as Not Testable`;
  }

  return {
    overall: Math.round(overall * 10) / 10,
    perRight,
    status,
    gatesFailed: [],
    evidenceCeiling,
    limitedBy,
    notTestableCount,
    version: SCORING_VERSION,
  };
}

/** Everything a consuming system needs, in one payload. */
export function standardPayload() {
  return {
    version: SCORING_VERSION,
    issued: "2026-09-04",
    requirements: requirements.map((r) => ({
      code: r.code,
      right: r.right,
      text: r.text,
      evidence: r.evidence,
      tier: r.tier,
      divisions: r.divisions,
      flagship: Boolean(r.flagship),
    })),
    tiers: TIER_MEANING,
    gates: GATES,
    bands: BANDS,
    aggregation: "geometric-mean-across-rights",
    notes:
      "Verification methods and ISO/IEC 42001 clause mappings are deliberately not published. Scores are never exposed on the public register — status bands only.",
  };
}
