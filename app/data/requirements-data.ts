// AIC Requirement Matrix v1 — the public standard.
//
// These 44 requirements are what AIC assesses an organisation against. They
// are published in full because a certification scheme nobody can read is a
// scheme nobody can trust, and because most of these cannot be gamed by
// reading them: an organisation either has a named Accountable Person who can
// describe operational reality unaided, or it does not.
//
// TWO COLUMNS ARE DELIBERATELY WITHHELD.
//
// 1. Verification method — how an auditor tests each requirement stays with
//    AIC. What we test and what evidence it takes is public; the testing
//    procedure is not.
// 2. ISO/IEC 42001 clause mapping — drafted, but indicative only until
//    verified against the purchased standard text. Publishing an unverified
//    mapping to an international standard would be precisely the kind of
//    unbacked claim this body exists to catch.

export type RightCode = "HU" | "EX" | "EM" | "CO" | "TR";

/** Best obtainable evidence for a requirement, and its weight in scoring. */
export type EvidenceTier = "A" | "B" | "C" | "D";

export const TIER_MEANING: Record<EvidenceTier, { label: string; weight: number; desc: string }> = {
  A: { label: "Operational data", weight: 1.0, desc: "Live system data, telemetry or records — the organisation's actual behaviour rather than its account of it." },
  B: { label: "Third-party or observed", weight: 0.8, desc: "Evidence an auditor observes directly, or that an independent party produced." },
  C: { label: "Self-certified", weight: 0.6, desc: "Documentation the organisation maintains and supplies." },
  D: { label: "Attestation", weight: 0.4, desc: "A statement that something is so, with nothing behind it but the statement." },
};

export const RIGHTS: Record<RightCode, { name: string; blurb: string }> = {
  HU: { name: "Human Agency", blurb: "A named individual is accountable, and can actually intervene." },
  EX: { name: "Explanation", blurb: "The reason given is the reason that operated." },
  EM: { name: "Empathy", blurb: "Adverse decisions are communicated like a person receives them." },
  CO: { name: "Correction", blurb: "Getting a decision wrong is recoverable, and demonstrably happens." },
  TR: { name: "Truth", blurb: "People know an AI is involved, before it affects them." },
};

export interface Requirement {
  code: string;
  right: RightCode;
  text: string;
  /** Divisions this applies to (1 Sovereign … 5 Artificial). */
  divisions: number[];
  evidence: string;
  tier: EvidenceTier;
  /**
   * The requirements that do the most work — each one tests whether a control
   * is real rather than merely present, and each is difficult to fake.
   */
  flagship?: boolean;
}

const ALL = [1, 2, 3, 4, 5];

export const requirements: Requirement[] = [
  // ── HU — Human Agency (11) ────────────────────────────────────────────────
  { code: "HU-1", right: "HU", divisions: ALL, tier: "C", text: "An Accountable Person is named in writing, as an individual and not a role, for each registered AI system.", evidence: "System register or governance record naming a person" },
  { code: "HU-2", right: "HU", divisions: ALL, tier: "B", text: "The Accountable Person has signed a declaration acknowledging personal accountability.", evidence: "Signed Accountable Person Declaration" },
  { code: "HU-3", right: "HU", divisions: ALL, tier: "C", text: "A complete inventory of AI systems making or influencing consequential decisions is maintained and current.", evidence: "AI system register with purpose, risk category and affected population" },
  { code: "HU-4", right: "HU", divisions: [2, 3, 4], tier: "C", text: "A documented override or human intervention process exists for each system.", evidence: "Written override procedure" },
  { code: "HU-5", right: "HU", divisions: [2, 3, 4], tier: "B", text: "The override mechanism is functional and demonstrable in the production system.", evidence: "Live demonstration or screen-recorded walkthrough" },
  { code: "HU-6", right: "HU", divisions: [2, 3, 4], tier: "A", text: "Exercising an override requires a reason to be entered, and that reason is stored.", evidence: "Override records containing a populated reason field" },
  { code: "HU-7", right: "HU", divisions: [2, 3, 4], tier: "A", flagship: true, text: "Override events are evidenced during the assessment period. Zero overrides across material decision volume is not a pass — it triggers interrogation.", evidence: "System override records with reviewer identity" },
  { code: "HU-8", right: "HU", divisions: [2, 3, 4], tier: "A", text: "The observed human oversight ratio is consistent with the Division the organisation has declared.", evidence: "Human review completion rate from live telemetry" },
  { code: "HU-9", right: "HU", divisions: [2, 3, 4], tier: "B", text: "An escalation path exists and is traceable end to end.", evidence: "One escalation traced from initial flag through to outcome" },
  { code: "HU-10", right: "HU", divisions: [1], tier: "B", text: "A Shadow AI audit has been completed, establishing that no undisclosed AI operates in consequential decisions.", evidence: "Software asset register, procurement review, departmental questionnaires, and a CEO or MD attestation" },
  { code: "HU-11", right: "HU", divisions: ALL, tier: "B", flagship: true, text: "The Accountable Person can describe operational reality unaided. Needing to check with someone else is a finding.", evidence: "Recorded walk-me-through interview" },

  // ── EX — Explanation (7) ──────────────────────────────────────────────────
  { code: "EX-1", right: "EX", divisions: [2, 3, 4, 5], tier: "C", text: "A decision explanation mechanism exists for each system.", evidence: "Explanation process documentation" },
  { code: "EX-2", right: "EX", divisions: ALL, tier: "B", text: "Explanations are produced in plain language rather than raw technical output.", evidence: "Sample explanations actually issued to affected people" },
  { code: "EX-3", right: "EX", divisions: [2, 3, 4], tier: "A", text: "Explanations are retained and retrievable for each individual decision.", evidence: "Decision records containing the explanation payload" },
  { code: "EX-4", right: "EX", divisions: ALL, tier: "B", text: "Explanations are accessible to the affected person on request.", evidence: "Request process and evidence that requests were fulfilled" },
  { code: "EX-5", right: "EX", divisions: [2, 3, 4], tier: "A", flagship: true, text: "The stated reasons materially match the actual drivers of the decision. Divergence between the reason given and the dominant feature is a critical finding — it is post-hoc rationalisation, not explanation.", evidence: "Issued adverse notices, alongside feature-attribution output on those same decisions" },
  { code: "EX-6", right: "EX", divisions: [2, 3, 4, 5], tier: "B", text: "Feature inputs are documented, including identification of proxy variables.", evidence: "Feature documentation or model card" },
  { code: "EX-7", right: "EX", divisions: [2, 3, 4, 5], tier: "C", text: "System documentation equivalent to a model card is maintained and current — purpose, data, limitations, version.", evidence: "Model card or equivalent, with version history" },

  // ── EM — Empathy (10) ─────────────────────────────────────────────────────
  { code: "EM-1", right: "EM", divisions: ALL, tier: "A", flagship: true, text: "Adverse automated communications score at least 60 on the AIC Empathy Rubric. A score below 40 blocks certification outright.", evidence: "Between three and ten real adverse communications" },
  { code: "EM-2", right: "EM", divisions: ALL, tier: "B", text: "Communications meet the plain-language standard — an ordinary person of the intended class understands them without undue effort.", evidence: "The same communication sample" },
  { code: "EM-3", right: "EM", divisions: ALL, tier: "B", text: "Adverse communications state the reason for the decision. Generic boilerplate fails.", evidence: "The same communication sample" },
  { code: "EM-4", right: "EM", divisions: ALL, tier: "B", text: "Adverse communications provide an accessible human contact point that is specific and reachable.", evidence: "The same communication sample" },
  { code: "EM-5", right: "EM", divisions: ALL, tier: "B", text: "Adverse communications provide clear, actionable next steps.", evidence: "The same communication sample" },
  { code: "EM-6", right: "EM", divisions: [2, 3, 4, 5], tier: "B", text: "Bias and disparate impact testing has been conducted within the defined period.", evidence: "Bias testing report, assessed for recency, methodology and scope" },
  { code: "EM-7", right: "EM", divisions: [2, 3, 4, 5], tier: "A", flagship: true, text: "The disparate impact ratio is at least 0.8 across tested protected characteristics. Refusal to supply the data is recorded as Not Testable, which is itself a finding.", evidence: "Outcome data disaggregated by group" },
  { code: "EM-8", right: "EM", divisions: [3, 4, 5], tier: "A", text: "Intersectional analysis has been performed across multiple attributes, not one at a time.", evidence: "Multi-attribute outcome analysis" },
  { code: "EM-9", right: "EM", divisions: [2, 3, 4], tier: "C", text: "A mechanism exists to flag decisions where material human context was unavailable to the system.", evidence: "Process documentation and sample flag records" },
  { code: "EM-10", right: "EM", divisions: [2, 3, 4, 5], tier: "B", text: "Proxy variables are identified and either justified or removed.", evidence: "Feature review record" },

  // ── CO — Correction (9) ───────────────────────────────────────────────────
  { code: "CO-1", right: "CO", divisions: ALL, tier: "B", text: "A correction or appeal mechanism exists and is publicly accessible.", evidence: "Public-facing appeal route, which the auditor must locate unaided" },
  { code: "CO-2", right: "CO", divisions: ALL, tier: "B", text: "The mechanism is discoverable by an ordinary affected person, not only by someone who knows it exists.", evidence: "User journey evidence" },
  { code: "CO-3", right: "CO", divisions: ALL, tier: "C", text: "A defined service level for correction response is documented.", evidence: "Policy stating the response SLA" },
  { code: "CO-4", right: "CO", divisions: [2, 3, 4], tier: "A", text: "The service level is met in practice — median time to response falls within the stated SLA.", evidence: "Correction request logs with timestamps" },
  { code: "CO-5", right: "CO", divisions: [2, 3, 4], tier: "A", text: "Correction requests are logged immutably, with their outcome.", evidence: "Correction records, checked for ledger integrity" },
  { code: "CO-6", right: "CO", divisions: [2, 3, 4], tier: "A", flagship: true, text: "The overturn rate is non-zero and explicable. A pipeline where nothing is ever overturned is not a correction pipeline; a very high rate indicates a problem in the underlying model.", evidence: "Correction outcomes across the assessment period" },
  { code: "CO-7", right: "CO", divisions: [2, 3, 4], tier: "A", text: "Uptake is consistent with decision volume. Near-zero uptake indicates a mechanism nobody can find.", evidence: "Appeals as a proportion of adverse decisions" },
  { code: "CO-8", right: "CO", divisions: [2, 3, 4], tier: "A", text: "Upheld corrections result in a traceable change to the outcome.", evidence: "Before and after decision records" },
  { code: "CO-9", right: "CO", divisions: ALL, tier: "C", text: "A named human is responsible for correction responses.", evidence: "Governance record, cross-checked against HU-1" },

  // ── TR — Truth (7) ────────────────────────────────────────────────────────
  { code: "TR-1", right: "TR", divisions: ALL, tier: "C", text: "An AI disclosure policy is documented.", evidence: "Written disclosure policy" },
  { code: "TR-2", right: "TR", divisions: [2, 3, 4, 5], tier: "B", text: "Disclosure is present at each consequential decision point.", evidence: "Screenshots of the decision points themselves" },
  { code: "TR-3", right: "TR", divisions: [2, 3, 4, 5], tier: "B", flagship: true, text: "Disclosure occurs before the interaction affects the person. Post-hoc disclosure fails, and a terms-and-conditions checkbox at signup generally fails for a decision made later.", evidence: "Timed user journey evidence" },
  { code: "TR-4", right: "TR", divisions: [2, 3, 4, 5], tier: "B", text: "Disclosure is specific rather than generic legal boilerplate — it says what the AI does in this decision.", evidence: "The disclosure text as shown" },
  { code: "TR-5", right: "TR", divisions: [2, 3, 4, 5], tier: "B", text: "Disclosure is discoverable in the real user journey rather than buried.", evidence: "Journey walkthrough" },
  { code: "TR-6", right: "TR", divisions: [2, 3, 4, 5], tier: "C", text: "System metadata accurately describes the AI's role in each decision.", evidence: "Decision records with role metadata" },
  { code: "TR-7", right: "TR", divisions: [3, 4, 5], tier: "C", text: "Public disclosure of AI use is maintained and current.", evidence: "Published disclosures page or statement" },
];

export const DIVISIONS: Record<number, string> = {
  1: "Sovereign",
  2: "Supervised",
  3: "Reviewed",
  4: "Monitored",
  5: "Artificial",
};

/**
 * How many requirements apply to a Division — DERIVED, never hand-written.
 *
 * The source matrix carried a hand-totalled applicability table, and its D5
 * row said 31 where the listed requirements come to 29. Publishing a standard
 * whose own arithmetic disagrees with itself is not survivable for a
 * certification body, so the count is computed and a test asserts it.
 */
export function requirementsForDivision(division: number): Requirement[] {
  return requirements.filter((r) => r.divisions.includes(division));
}

export function countByRight(division: number): Record<RightCode, number> {
  const out = { HU: 0, EX: 0, EM: 0, CO: 0, TR: 0 } as Record<RightCode, number>;
  for (const r of requirementsForDivision(division)) out[r.right]++;
  return out;
}

/** Version of the published standard, and the date it was issued. */
export const STANDARD_VERSION = "v1";
export const STANDARD_ISSUED = "2026-09-04";
