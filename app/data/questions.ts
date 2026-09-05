// PRD Reference: FR-ASSESS-01 & FR-ASSESS-03
//
// The AIC Aware question bank.
//
// Each question now carries two things it did not before: the reason it is
// asked, and the requirement codes from the published standard
// (app/data/requirements-data.ts) that the answer bears on. That mapping is
// what makes this an instrument rather than a quiz — a person answering can
// see which of the 44 published requirements each answer speaks to, and the
// result can name the specific requirements their own answers put at risk.
//
// The codes are real and resolve against requirements-data.ts; a test asserts
// that every code referenced here exists in the published standard, because a
// self-assessment that cites requirement numbers which do not exist would be
// precisely the unbacked claim this body exists to catch.
//
// USAGE questions are deliberately NOT mapped to requirement gaps. They
// establish the Division — the mode of operation — and a high-risk profile is
// not a failing. The control questions (OVERSIGHT, TRANSPARENCY,
// INFRASTRUCTURE) are the ones whose weak answers indicate likely findings.

export type Category = 'USAGE' | 'OVERSIGHT' | 'TRANSPARENCY' | 'INFRASTRUCTURE';

export interface Option {
  text: string;
  value: number; // 0-4
  tierSignal?: number[]; // [1, 2, 3] indicating likely tier
}

export interface Question {
  id: string;
  category: Category;
  text: string;
  options: Option[];
  /** Why this question is asked — shown to the person answering it. */
  rationale?: string;
  /**
   * Requirement codes from the published standard that this answer bears on.
   * Empty for questions that establish context rather than test a control.
   */
  requirements?: string[];
}

export interface CategoryMeta {
  key: Category;
  name: string;
  weight: number;
  /** What this section is establishing. */
  purpose: string;
  /** Which of the five Algorithmic Rights this section touches. */
  rights: string[];
}

// Category Weights:
// USAGE: 20% — establishes the Division, not a score of quality
// OVERSIGHT: 35% — the heaviest, because human agency is the load-bearing right
// TRANSPARENCY: 25%
// INFRASTRUCTURE: 20%
export const categoryMeta: CategoryMeta[] = [
  {
    key: 'USAGE',
    name: 'AI Usage Context',
    weight: 0.20,
    purpose:
      'Establishes which Division your organisation would be assessed in. Divisions are modes of operation, not grades — a Supervised organisation is not worse than a Sovereign one, it is answering a different set of requirements.',
    rights: ['HU'],
  },
  {
    key: 'OVERSIGHT',
    name: 'Human Oversight',
    weight: 0.35,
    purpose:
      'Tests whether a named human is genuinely accountable and can actually intervene. Weighted heaviest because every other right depends on someone being able to stop, reverse or explain a decision.',
    rights: ['HU', 'CO'],
  },
  {
    key: 'TRANSPARENCY',
    name: 'Transparency',
    weight: 0.25,
    purpose:
      'Tests whether people know an AI is involved before it affects them, and whether the reason they are given is the reason that actually operated.',
    rights: ['TR', 'EX', 'EM'],
  },
  {
    key: 'INFRASTRUCTURE',
    name: 'Infrastructure & Compliance',
    weight: 0.20,
    purpose:
      'Tests whether the governance around the systems exists as structure rather than intention — policy, privacy posture, and where liability currently sits.',
    rights: ['HU', 'TR'],
  },
];

export const questions: Question[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 1: AI USAGE CONTEXT (20% Weight) — establishes the Division
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q1',
    category: 'USAGE',
    text: 'How many AI-powered decision systems does your organisation currently operate?',
    rationale:
      'The standard requires a current inventory of every AI system making or influencing consequential decisions (HU-3). Organisations routinely undercount here — the number given at the start of an audit is rarely the number found by the end of it.',
    requirements: ['HU-3'],
    options: [
      { text: 'None — we are evaluating AI adoption', value: 0, tierSignal: [3] },
      { text: '1–2 systems in production', value: 2, tierSignal: [3] },
      { text: '3–5 systems across departments', value: 3, tierSignal: [2, 3] },
      { text: '6+ systems, some in critical functions', value: 4, tierSignal: [1, 2] },
    ],
  },
  {
    id: 'q21',
    category: 'USAGE',
    text: 'Does your organisation build, train or sell AI systems that other organisations use to make decisions?',
    rationale:
      'Division 5 (Artificial) exists for builders, whose accountability runs upstream — they are responsible for the accountability architecture their customers’ decisions rest on. Being certified as a builder does not relieve your customers of needing their own certification.',
    requirements: [],
    options: [
      { text: 'No — we only use AI internally', value: 4, tierSignal: [3] },
      { text: 'We build internal tools, not sold externally', value: 3, tierSignal: [2, 3] },
      { text: 'Yes — we develop and sell AI systems or models to others', value: 1, tierSignal: [1, 2] },
    ],
  },
  {
    id: 'q2',
    category: 'USAGE',
    text: 'Do any of your AI systems make decisions that produce legal effects (e.g. loan denial, hiring, medical diagnosis)?',
    rationale:
      'This is the single question that most determines your Division, and the one POPIA §71 turns on: a decision with legal or substantially similar effect, made solely by automated means, requires safeguards and an explanation.',
    requirements: [],
    options: [
      { text: 'No, purely advisory or internal use', value: 4, tierSignal: [3] },
      { text: 'Yes, but humans review all final outputs', value: 2, tierSignal: [2] },
      { text: 'Yes, some decisions are fully automated', value: 0, tierSignal: [1] },
    ],
  },
  {
    id: 'q3',
    category: 'USAGE',
    text: 'Do your systems process special personal information (health records, biometrics, children\'s data, criminal history)?',
    rationale:
      'Special personal information raises the stakes on disparate impact testing (EM-7) rather than changing the requirements themselves. Where it is core to the system, refusing to supply disaggregated outcome data at audit is recorded as Not Testable — which is itself a finding.',
    requirements: ['EM-6', 'EM-7'],
    options: [
      { text: 'No special personal data is processed', value: 4, tierSignal: [3] },
      { text: 'Yes, but only incidentally', value: 2, tierSignal: [2] },
      { text: 'Yes, core functionality relies on special data', value: 0, tierSignal: [1] },
    ],
  },
  {
    id: 'q4',
    category: 'USAGE',
    text: 'What is the primary deployment environment of your AI systems?',
    rationale:
      'Who is on the receiving end determines which requirements apply and how hard the evidence bar sits. A system affecting the public carries disclosure and correction duties that an internal tool does not.',
    requirements: [],
    options: [
      { text: 'Internal tools only (employee-facing)', value: 4, tierSignal: [3] },
      { text: 'Customer-facing, low stakes (e.g. chatbot, recommendations)', value: 3, tierSignal: [3] },
      { text: 'Customer-facing, high stakes (e.g. credit decisions, claims)', value: 1, tierSignal: [1, 2] },
      { text: 'Public sector / government services', value: 0, tierSignal: [1] },
    ],
  },
  {
    id: 'q5',
    category: 'USAGE',
    text: 'What volume of decisions does your AI system process monthly?',
    rationale:
      'Volume is what makes silence suspicious. Across material decision volume, zero overrides (HU-7) and near-zero appeal uptake (CO-7) are not evidence that nothing went wrong — they indicate a control nobody is using or nobody can find.',
    requirements: ['HU-7', 'CO-7'],
    options: [
      { text: 'Less than 100 decisions', value: 4, tierSignal: [3] },
      { text: '100 – 1,000 decisions', value: 3, tierSignal: [2, 3] },
      { text: '1,000 – 10,000 decisions', value: 2, tierSignal: [2] },
      { text: 'More than 10,000 decisions', value: 1, tierSignal: [1, 2] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 2: HUMAN OVERSIGHT (35% Weight)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q6',
    category: 'OVERSIGHT',
    text: 'Is there a documented process for humans to intervene in AI decisions?',
    rationale:
      'The standard separates having an override process (HU-4) from the override actually working in production (HU-5) — the second is demonstrated live at audit, because a documented process nobody has exercised is a document, not a control.',
    requirements: ['HU-4', 'HU-5'],
    options: [
      { text: 'No formal intervention process exists', value: 0, tierSignal: [1] },
      { text: 'Ad-hoc intervention is possible but not documented', value: 1, tierSignal: [1, 2] },
      { text: 'Formal review process for flagged cases only', value: 3, tierSignal: [2] },
      { text: 'Mandatory human sign-off on all critical outputs', value: 4, tierSignal: [2, 3] },
    ],
  },
  {
    id: 'q7',
    category: 'OVERSIGHT',
    text: 'Who is accountable for the AI system\'s outcomes in your organisation?',
    rationale:
      'Accountability must attach to a named individual, not a role or a department (HU-1), and that person signs a declaration accepting it personally (HU-2). At audit they must be able to describe operational reality unaided — needing to check with someone else is a finding (HU-11).',
    requirements: ['HU-1', 'HU-2', 'HU-11'],
    options: [
      { text: 'Unclear or not assigned', value: 0, tierSignal: [1] },
      { text: 'IT Department or vendor', value: 1, tierSignal: [1, 2] },
      { text: 'Product Owner or Business Unit Head', value: 2, tierSignal: [2] },
      { text: 'Designated Compliance Officer or Executive', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q8',
    category: 'OVERSIGHT',
    text: 'Do you track the rate at which humans override AI recommendations?',
    rationale:
      'Overrides must carry a stored reason (HU-6), and the override record is the primary evidence that oversight is real. This is the metric AIC treats as load-bearing: an untracked override rate cannot be distinguished from an override rate of zero.',
    requirements: ['HU-6', 'HU-7'],
    options: [
      { text: 'No, we don\'t track overrides', value: 0, tierSignal: [1] },
      { text: 'Anecdotal monitoring only', value: 2, tierSignal: [2] },
      { text: 'Yes, formal metrics tracked and reviewed monthly', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q9',
    category: 'OVERSIGHT',
    text: 'Are decision-makers trained on the limitations and potential biases of the AI model?',
    rationale:
      'An override right that the operator does not know how to exercise, or does not know when to exercise, is not oversight. This bears directly on whether the Accountable Person can describe operational reality unaided at audit (HU-11).',
    requirements: ['HU-11'],
    options: [
      { text: 'No specific training provided', value: 0, tierSignal: [1] },
      { text: 'Basic onboarding includes AI overview', value: 2, tierSignal: [2] },
      { text: 'Regular, documented training on bias and limitations', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q10',
    category: 'OVERSIGHT',
    text: 'Can an affected person appeal a decision made or influenced by the AI?',
    rationale:
      'The correction route must be publicly accessible (CO-1) and findable by an ordinary person rather than someone who already knows it exists (CO-2) — at audit, the assessor must locate it unaided. A named human must own the response (CO-9).',
    requirements: ['CO-1', 'CO-2', 'CO-9'],
    options: [
      { text: 'No appeal mechanism exists', value: 0, tierSignal: [1] },
      { text: 'General support ticket (not AI-specific)', value: 1, tierSignal: [1, 2] },
      { text: 'Dedicated appeal workflow with guaranteed human review', value: 4, tierSignal: [2, 3] },
    ],
  },
  {
    id: 'q11',
    category: 'OVERSIGHT',
    text: 'How quickly can a human intervene to stop the AI from making further decisions?',
    rationale:
      'The override must be functional and demonstrable in the production system (HU-5), and the escalation path traceable end to end (HU-9). An intervention that requires an engineering ticket is not an intervention available at decision speed.',
    requirements: ['HU-5', 'HU-9'],
    options: [
      { text: 'Would require engineering/IT involvement', value: 0, tierSignal: [1] },
      { text: 'Within hours (requires escalation)', value: 2, tierSignal: [2] },
      { text: 'Immediately (kill switch accessible to operators)', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q12',
    category: 'OVERSIGHT',
    text: 'Do you have a policy for how long AI decisions can operate without human review?',
    rationale:
      'The observed oversight ratio must be consistent with the Division you have declared (HU-8). Declaring Supervised while operating at Monitored review rates is the specific mismatch Pulse monitoring exists to catch between audits.',
    requirements: ['HU-4', 'HU-8'],
    options: [
      { text: 'No policy exists', value: 0, tierSignal: [1] },
      { text: 'Informal guidelines only', value: 2, tierSignal: [2] },
      { text: 'Formal policy with defined review intervals', value: 4, tierSignal: [3] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 3: TRANSPARENCY (25% Weight)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q13',
    category: 'TRANSPARENCY',
    text: 'Do users know they are interacting with an AI system?',
    rationale:
      'Disclosure must occur before the interaction affects the person (TR-3) and be specific about what the AI does in this decision (TR-4). A terms-and-conditions checkbox at signup generally fails for a decision made months later.',
    requirements: ['TR-2', 'TR-3', 'TR-4'],
    options: [
      { text: 'Not explicitly disclosed', value: 0, tierSignal: [1] },
      { text: 'Mentioned in Terms of Service', value: 2, tierSignal: [2] },
      { text: 'Prominent disclosure at point of interaction', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q14',
    category: 'TRANSPARENCY',
    text: 'Can you explain WHY the model reached a specific decision to an affected person?',
    rationale:
      'The hardest requirement in the standard sits here: the reason given must materially match the actual driver of the decision (EX-5). Divergence between the stated reason and the dominant feature is a critical finding — that is rationalisation, not explanation.',
    requirements: ['EX-1', 'EX-2', 'EX-5'],
    options: [
      { text: 'No, it is a "black box" model', value: 0, tierSignal: [1] },
      { text: 'Partially (feature importance scores available)', value: 2, tierSignal: [2] },
      { text: 'Yes, full decision logic is interpretable and documented', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q15',
    category: 'TRANSPARENCY',
    text: 'Is there documentation of how the AI model was trained and validated?',
    rationale:
      'A current model card or equivalent is required (EX-7), including identification of proxy variables (EX-6). Vendor documentation alone does not discharge this where the deploying organisation cannot say what the model actually uses.',
    requirements: ['EX-6', 'EX-7'],
    options: [
      { text: 'No documentation available', value: 0, tierSignal: [1] },
      { text: 'Vendor documentation only', value: 2, tierSignal: [2] },
      { text: 'Full internal documentation including data sources and validation', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q16',
    category: 'TRANSPARENCY',
    text: 'Have you tested the AI for bias across protected characteristics (race, gender, age)?',
    rationale:
      'Bias testing must be recent, scoped and methodologically sound (EM-6), and the disparate impact ratio must reach at least 0.8 across tested characteristics (EM-7). Testing once during development does not survive a model that has since been retrained.',
    requirements: ['EM-6', 'EM-7'],
    options: [
      { text: 'No bias testing performed', value: 0, tierSignal: [1] },
      { text: 'Initial testing during development only', value: 2, tierSignal: [2] },
      { text: 'Regular bias audits with documented results', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q17',
    category: 'TRANSPARENCY',
    text: 'Do you maintain records of individual AI decisions for audit purposes?',
    rationale:
      'Explanations must be retained and retrievable per individual decision (EX-3), and correction requests logged immutably with their outcome (CO-5). Aggregate statistics cannot answer a question about one person’s decision, which is the only question that person is asking.',
    requirements: ['EX-3', 'CO-5'],
    options: [
      { text: 'No decision logs maintained', value: 0, tierSignal: [1] },
      { text: 'Aggregate statistics only', value: 2, tierSignal: [2] },
      { text: 'Full decision audit trail with inputs and outputs', value: 4, tierSignal: [3] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 4: INFRASTRUCTURE & COMPLIANCE (20% Weight)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q18',
    category: 'INFRASTRUCTURE',
    text: 'Does your organisation have an AI governance policy or framework?',
    rationale:
      'Governance is what makes the named accountability (HU-1) and the system inventory (HU-3) survive staff turnover. Without it, both tend to exist in one person’s memory, which is not a control that outlives them.',
    requirements: ['HU-1', 'HU-3', 'TR-1'],
    options: [
      { text: 'No AI-specific governance', value: 0, tierSignal: [1] },
      { text: 'General data governance applies', value: 2, tierSignal: [2] },
      { text: 'Dedicated AI governance framework with defined roles', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q19',
    category: 'INFRASTRUCTURE',
    text: 'How do you handle data privacy in your AI systems (POPIA compliance)?',
    rationale:
      'POPIA §71 is the binding local hook for automated decision-making, and a documented AI disclosure policy (TR-1) with a current public statement (TR-7) is the visible half of discharging it.',
    requirements: ['TR-1', 'TR-7'],
    options: [
      { text: 'Not specifically addressed for AI', value: 0, tierSignal: [1] },
      { text: 'Basic POPIA compliance measures in place', value: 2, tierSignal: [2] },
      { text: 'Comprehensive privacy impact assessment for AI systems', value: 4, tierSignal: [3] },
    ],
  },
  {
    id: 'q20',
    category: 'INFRASTRUCTURE',
    text: 'Do you have insurance coverage or legal protections for AI-related liability?',
    rationale:
      'This maps to no requirement in the standard — AIC does not assess your cover. It is asked because underwriters increasingly do, and because the answer tells you where the liability currently sits if a decision goes wrong tomorrow.',
    requirements: [],
    options: [
      { text: 'No specific coverage', value: 0, tierSignal: [1] },
      { text: 'General liability may apply', value: 2, tierSignal: [2] },
      { text: 'Specific AI/technology errors & omissions coverage', value: 4, tierSignal: [3] },
    ],
  },
];

// Category weights for final score calculation
export const categoryWeights = {
  USAGE: 0.20,
  OVERSIGHT: 0.35,
  TRANSPARENCY: 0.25,
  INFRASTRUCTURE: 0.20,
};
