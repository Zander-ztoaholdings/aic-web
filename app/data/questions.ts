// PRD Reference: FR-ASSESS-01 & FR-ASSESS-03
// 20 Questions across 4 categories with weighted scoring

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
}

// Category Weights:
// USAGE: 20% (5 questions)
// OVERSIGHT: 35% (7 questions)
// TRANSPARENCY: 25% (5 questions)
// INFRASTRUCTURE: 20% (3 questions)

export const questions: Question[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 1: AI USAGE CONTEXT (20% Weight) - Questions 1-5
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q1',
    category: 'USAGE',
    text: 'How many AI-powered decision systems does your organisation currently operate?',
    options: [
      { text: 'None — we are evaluating AI adoption', value: 0, tierSignal: [3] },
      { text: '1–2 systems in production', value: 2, tierSignal: [3] },
      { text: '3–5 systems across departments', value: 3, tierSignal: [2, 3] },
      { text: '6+ systems, some in critical functions', value: 4, tierSignal: [1, 2] },
    ],
  },
  {
    id: 'q2',
    category: 'USAGE',
    text: 'Do any of your AI systems make decisions that produce legal effects (e.g. loan denial, hiring, medical diagnosis)?',
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
    options: [
      { text: 'Less than 100 decisions', value: 4, tierSignal: [3] },
      { text: '100 – 1,000 decisions', value: 3, tierSignal: [2, 3] },
      { text: '1,000 – 10,000 decisions', value: 2, tierSignal: [2] },
      { text: 'More than 10,000 decisions', value: 1, tierSignal: [1, 2] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 2: HUMAN OVERSIGHT (35% Weight) - Questions 6-12
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q6',
    category: 'OVERSIGHT',
    text: 'Is there a documented process for humans to intervene in AI decisions?',
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
    options: [
      { text: 'No policy exists', value: 0, tierSignal: [1] },
      { text: 'Informal guidelines only', value: 2, tierSignal: [2] },
      { text: 'Formal policy with defined review intervals', value: 4, tierSignal: [3] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 3: TRANSPARENCY (25% Weight) - Questions 13-17
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q13',
    category: 'TRANSPARENCY',
    text: 'Do users know they are interacting with an AI system?',
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
    options: [
      { text: 'No decision logs maintained', value: 0, tierSignal: [1] },
      { text: 'Aggregate statistics only', value: 2, tierSignal: [2] },
      { text: 'Full decision audit trail with inputs and outputs', value: 4, tierSignal: [3] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY 4: INFRASTRUCTURE & COMPLIANCE (20% Weight) - Questions 18-20
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'q18',
    category: 'INFRASTRUCTURE',
    text: 'Does your organisation have an AI governance policy or framework?',
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
