/**
 * Turning AIC Aware answers into something with the standard behind it.
 *
 * The free self-assessment used to produce a number and four bars. That is a
 * quiz. This module makes it an instrument by doing two things the raw score
 * cannot:
 *
 *   1. Indicating a DIVISION. Divisions are modes of operation, not grades —
 *      which requirements apply at all depends on how the organisation uses
 *      AI, so a result that does not establish the Division is answering a
 *      question nobody asked.
 *
 *   2. Naming the REQUIREMENTS the person's own answers put at risk, using
 *      the real published codes from app/data/requirements-data.ts, with the
 *      evidence an auditor would actually ask for.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO. It does not produce a standard-scale
 * score, and it never compares the self-assessment score to the certification
 * bands in lib/standard-scoring.ts. Those bands are computed from
 * evidence-weighted scoring across 44 requirements; this is a person choosing
 * from four options about themselves. Putting the two numbers on one axis
 * would imply an equivalence that does not exist, which is the exact
 * confusion AIC Aware is supposed to remove rather than create.
 *
 * On evidence: every answer here is Tier D — "a statement that something is
 * so, with nothing behind it but the statement", weight 0.4, the lowest the
 * standard recognises. That is not a flaw in the instrument, it is the
 * instrument's whole boundary, and the results surface it explicitly.
 */

import { questions } from "@/app/data/questions";
import {
  requirements,
  requirementsForDivision,
  DIVISIONS,
  RIGHTS,
  type Requirement,
  type RightCode,
} from "@/app/data/requirements-data";

/** Answers at or below this indicate the control is absent or informal. */
const GAP_THRESHOLD = 2;
/** Answers at or above this are consistent with the control existing. */
const STRENGTH_THRESHOLD = 4;

export interface DivisionIndication {
  division: number;
  name: string;
  /** Why these answers point at this Division, in plain language. */
  rationale: string;
  /** Present where the answers suggest a second Division may also apply. */
  caveat?: string;
}

export interface RequirementFinding {
  requirement: Requirement;
  /** The question text(s) whose answers raised this. */
  triggeredBy: string[];
}

export interface AwareAnalysis {
  indication: DivisionIndication;
  /** Requirements that apply to the indicated Division. */
  applicableCount: number;
  /** Requirements the answers suggest would produce findings. */
  gaps: RequirementFinding[];
  /** Requirements the answers are consistent with — not evidence of a pass. */
  consistent: RequirementFinding[];
  /** Gap counts by Right, for the five-rights breakdown. */
  gapsByRight: Record<RightCode, number>;
  /** Flagship requirements among the gaps — the ones hardest to fake. */
  flagshipGaps: RequirementFinding[];
}

const byCode = new Map(requirements.map((r) => [r.code, r]));

/**
 * Which Division these answers point at.
 *
 * Indicative only, and labelled as such wherever it is shown: the Division is
 * confirmed at audit against the actual system inventory, not from five
 * multiple-choice answers about it.
 */
export function indicateDivision(answers: Record<string, number>): DivisionIndication {
  const systems = answers["q1"];
  const builder = answers["q21"];
  const legalEffect = answers["q2"];
  const interventionProcess = answers["q6"];

  // Division 5 — Artificial. Builders answer upstream, for the accountability
  // architecture their customers' decisions rest on, so this takes precedence
  // over how they happen to use AI internally.
  if (builder === 1) {
    return {
      division: 5,
      name: DIVISIONS[5],
      rationale:
        "You build or sell AI systems that other organisations use to make decisions. Division 5 certifies the product rather than the organisation — each AI product sold carries its own certification, closer to a CE mark than a company certificate.",
      caveat:
        "If you also use AI in your own consequential decisions, that use would be assessed separately under whichever Division it falls in. Division 5 does not cover it, and it does not relieve your customers of needing their own certification.",
    };
  }

  // Division 1 — Sovereign. No AI in consequential decisions.
  if (systems === 0) {
    return {
      division: 1,
      name: DIVISIONS[1],
      rationale:
        "You report no AI systems in production. Division 1 certifies exactly that — human accountability structures documented, and a Shadow AI audit confirming no undisclosed automated decision systems are operating anywhere in the organisation.",
      caveat:
        "The Shadow AI audit is the substance of Division 1, and it is where organisations are most often surprised: procurement records and departmental questionnaires routinely surface AI nobody centrally knew about.",
    };
  }

  // Division 2 — Supervised. AI recommends, a named human decides each one.
  if (legalEffect === 2) {
    return {
      division: 2,
      name: DIVISIONS[2],
      rationale:
        "AI produces consequential outputs and a human makes every final decision. Division 2 is the most evidence-heavy Division because the claim being certified — that a human genuinely decides — is falsifiable from your own override records.",
    };
  }

  // Division 3 or 4 — AI decides. What separates them is whether human review
  // is a scheduled, case-level activity or aggregate monitoring.
  if (legalEffect === 0) {
    if (interventionProcess >= 3) {
      return {
        division: 3,
        name: DIVISIONS[3],
        rationale:
          "AI makes consequential decisions and humans review flagged cases on a defined process. Division 3 turns on the periodic human review rate, with bias testing quarterly and a correction SLA of 10 business days or better.",
      };
    }
    return {
      division: 4,
      name: DIVISIONS[4],
      rationale:
        "AI makes consequential decisions with no formal case-level human review process behind it. That places you at Division 4 on the evidence you have given, where drift detection and aggregate pattern monitoring are the primary controls.",
      caveat:
        "Division 4 is a demanding place to sit when decisions carry legal effect. Most organisations in this position are aiming at Division 2 or 3 and have not yet built the review process that would get them there.",
    };
  }

  // Advisory or internal use only — AI operates, humans monitor outcomes.
  return {
    division: 4,
    name: DIVISIONS[4],
    rationale:
      "Your AI operates without producing decisions of legal effect, which places you at Division 4 — systems and humans monitoring outcomes, with disclosure to users and an anomaly escalation path.",
    caveat:
      "Advisory systems drift into consequential ones quietly. If an internal recommendation is what a decision-maker actually follows, the decision is being influenced by AI whatever the system is called.",
  };
}

/** Resolve the codes a question maps to, dropping any that are unknown. */
function resolve(codes: string[] | undefined): Requirement[] {
  if (!codes) return [];
  return codes.map((c) => byCode.get(c)).filter((r): r is Requirement => Boolean(r));
}

/**
 * The full analysis.
 *
 * Only control questions contribute findings. USAGE questions establish the
 * Division and the risk profile — operating high-volume AI in a regulated
 * sector is a fact about the organisation, not a failing, and reporting it as
 * one would make the instrument dishonest in the direction that sells more
 * audits.
 */
export function analyseAware(answers: Record<string, number>): AwareAnalysis {
  const indication = indicateDivision(answers);
  const applicable = requirementsForDivision(indication.division);
  const applicableCodes = new Set(applicable.map((r) => r.code));

  const gapMap = new Map<string, RequirementFinding>();
  const consistentMap = new Map<string, RequirementFinding>();

  for (const q of questions) {
    // USAGE is context. It sets the Division; it does not produce findings.
    if (q.category === "USAGE") continue;

    const answer = answers[q.id];
    if (answer === undefined) continue;

    const mapped = resolve(q.requirements).filter((r) => applicableCodes.has(r.code));
    if (mapped.length === 0) continue;

    const target =
      answer <= GAP_THRESHOLD ? gapMap : answer >= STRENGTH_THRESHOLD ? consistentMap : null;
    if (!target) continue;

    for (const r of mapped) {
      const existing = target.get(r.code);
      if (existing) existing.triggeredBy.push(q.text);
      else target.set(r.code, { requirement: r, triggeredBy: [q.text] });
    }
  }

  // A requirement raised as a gap by one answer is not a strength because
  // another answer brushed against it. Gaps win.
  for (const code of gapMap.keys()) consistentMap.delete(code);

  const gaps = [...gapMap.values()].sort((a, b) =>
    a.requirement.code.localeCompare(b.requirement.code)
  );

  const gapsByRight = { HU: 0, EX: 0, EM: 0, CO: 0, TR: 0 } as Record<RightCode, number>;
  for (const g of gaps) gapsByRight[g.requirement.right]++;

  return {
    indication,
    applicableCount: applicable.length,
    gaps,
    consistent: [...consistentMap.values()].sort((a, b) =>
      a.requirement.code.localeCompare(b.requirement.code)
    ),
    gapsByRight,
    flagshipGaps: gaps.filter((g) => g.requirement.flagship),
  };
}

export { RIGHTS };
