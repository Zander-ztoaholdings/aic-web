/**
 * Turning the published standard into a live assessment.
 *
 * Instantiating pins the standard version onto the assessment. A requirement
 * set that shifted under an assessment in progress would make the resulting
 * certificate unauditable — nobody could later say which version was actually
 * applied — and "which requirements was this organisation measured against"
 * is the first question any accreditation assessor asks about a certificate.
 */

import { requirementsForDivision } from "@/app/data/requirements-data";
import {
  score,
  SCORING_VERSION,
  type EvidenceSubmission,
  type ScoreResult,
} from "@/lib/standard-scoring";

export interface InstantiatedRequirement {
  code: string;
  right: string;
  expectedTier: string;
}

/**
 * The rows to write for a new assessment: exactly the requirements that apply
 * to that Division, no more and no fewer.
 */
export function instantiate(division: number): {
  standardVersion: string;
  requirements: InstantiatedRequirement[];
} {
  const applicable = requirementsForDivision(division);
  if (applicable.length === 0) {
    throw new Error(`No requirements apply to Division ${division}`);
  }
  return {
    standardVersion: SCORING_VERSION,
    requirements: applicable.map((r) => ({
      code: r.code,
      right: r.right,
      expectedTier: r.tier,
    })),
  };
}

/** What the stored rows look like coming back out of the database. */
export interface StoredRequirement {
  code: string;
  providedTier: string | null;
  notTestable?: boolean | null;
}

/**
 * Scores an assessment from its stored rows.
 *
 * Note what this does NOT do: recompute from the current standard. It scores
 * the requirements that were instantiated, so an assessment completed in
 * February still reflects February's standard even after the standard moves.
 */
export function scoreAssessment(
  division: number,
  stored: StoredRequirement[],
  gatesPassed: string[]
): ScoreResult {
  const submissions: EvidenceSubmission[] = stored.map((r) => ({
    code: r.code,
    provided: (r.providedTier ?? null) as EvidenceSubmission["provided"],
    notTestable: Boolean(r.notTestable),
  }));
  return score(division, submissions, gatesPassed);
}

/**
 * Certificate validity is Division-calibrated, not a flat term: D2's lighter
 * ongoing risk earns a longer cycle, D4's heavier one a shorter. A flat
 * default would have made a 24-month D2 and a 12-month D4 the same promise.
 */
export const VALIDITY_MONTHS: Record<number, number> = {
  1: 12,
  2: 24,
  3: 18,
  4: 12,
  5: 12,
};

export function expiryFor(division: number, issued: Date): Date {
  const months = VALIDITY_MONTHS[division];
  if (!months) throw new Error(`No validity period defined for Division ${division}`);
  const d = new Date(issued);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Certificate number. Carries the Division and the year on its face, so the
 * scope of a certificate is legible from the number alone rather than only
 * after a lookup.
 */
export function certificateNumber(division: number, issued: Date, sequence: number): string {
  return `AIC-D${division}-${issued.getUTCFullYear()}-${String(sequence).padStart(4, "0")}`;
}
