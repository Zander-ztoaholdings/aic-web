/**
 * The small product scenes on each /platform page: a few rows of what the
 * screen looks like, with one thing changing as it scrolls into view (a row
 * added, a status moving on, a pack sealing). They are drawn from the real
 * screens, filled with sample data for Karoo Lending (Demo), and every scene
 * says so. No figure here is a claim about outcomes.
 */

export type Tone = "good" | "warn" | "bad" | "neutral" | "brass";

/** A status that starts as `from` and moves to `to` once the scene is in view. */
export type Chip = { from: string; to?: string; tone: Tone; toTone?: Tone };

export type Mock = { sample?: boolean } & (
  | { kind: "table"; title: string; cols: string[]; rows: { cells: string[]; chip?: Chip }[] }
  | { kind: "list"; title: string; note?: string; items: { label: string; sub?: string; chip: Chip }[] }
  | { kind: "detail"; title: string; sub?: string; fields: [string, string][]; chip?: Chip; actions?: string[] }
  | { kind: "meter"; title: string; bars: { label: string; value: number; display: string; tone: Tone }[]; note?: string }
  | { kind: "seal"; title: string; items: string[]; hash: string }
  | { kind: "log"; title: string; entries: { when: string; text: string }[] }
  | { kind: "chat"; title: string; question: string; tool: string; answer: string[] }
  | { kind: "code"; title: string; request: string[]; response: string[]; status: Chip }
  | { kind: "page"; title: string; sections: { label: string; tone: Tone; items: string[] }[] }
);

export type CapabilityScenes = {
  /** The large scene under the page heading. */
  hero: Mock;
  /** One scene for each of the first three points, in order. */
  points: Mock[];
};

export const SCENES: Record<string, CapabilityScenes> = {
  "ai-register": {
    hero: {
      kind: "table",
      title: "AI register",
      cols: ["System", "Decides about", "Answered for by", "Status"],
      rows: [
        { cells: ["Loan pre-screening", "People", "Thandi Mokoena"], chip: { from: "Complete", tone: "good" } },
        { cells: ["Claims triage", "People", "Sipho Dlamini"], chip: { from: "No risk recorded", tone: "warn", to: "Complete", toTone: "good" } },
        { cells: ["CV screener (TalentScreen)", "People", "Not named"], chip: { from: "No owner", tone: "bad", to: "Owner named", toTone: "good" } },
        { cells: ["Fraud scoring", "Transactions", "Ayesha Patel"], chip: { from: "Complete", tone: "good" } },
      ],
    },
    points: [
      {
        kind: "detail",
        title: "Loan pre-screening",
        sub: "In production",
        fields: [
          ["What it decides", "Declines or refers personal loan applications under R50,000"],
          ["About people", "Yes"],
          ["Supplier", "Built in-house"],
        ],
        chip: { from: "Section 71 questions off", tone: "neutral", to: "Section 71 questions on", toTone: "brass" },
      },
      {
        kind: "detail",
        title: "Claims triage",
        sub: "Accountable person",
        fields: [
          ["Was", "Sipho Dlamini (left on 2 October)"],
          ["Now", "Lerato Khumalo, Head of Claims"],
          ["Handed over", "1 system, 2 risks"],
        ],
        chip: { from: "Owner has left", tone: "bad", to: "Handed over", toTone: "good" },
      },
      {
        kind: "list",
        title: "Found in your record, not on the register",
        items: [
          { label: "credit-scoring", sub: "14 decisions logged", chip: { from: "Add", tone: "neutral", to: "Added", toTone: "good" } },
          { label: "OpenAI, gpt-4o", sub: "Used by 3 people this month", chip: { from: "Add", tone: "neutral", to: "Added", toTone: "good" } },
          { label: "claims-model-v2", sub: "6 decisions logged", chip: { from: "Add", tone: "neutral", to: "Added", toTone: "good" } },
        ],
      },
    ],
  },

  "risk-management": {
    hero: {
      kind: "table",
      title: "Risk register",
      cols: ["Risk", "System", "Score", "Treatment"],
      rows: [
        { cells: ["Unfair outcomes across groups", "Loan pre-screening", "16 High"], chip: { from: "Treating", tone: "brass" } },
        { cells: ["Reviewers approve without looking", "Claims triage", "12 Medium"], chip: { from: "Open", tone: "warn", to: "Treating", toTone: "brass" } },
        { cells: ["Supplier changes the model unannounced", "CV screener", "9 Medium"], chip: { from: "Open", tone: "warn" } },
        { cells: ["A leaver still has access", "Microsoft 365", "15 High"], chip: { from: "Open", tone: "bad", to: "Closed", toTone: "good" } },
      ],
    },
    points: [
      {
        kind: "meter",
        title: "Unfair outcomes across groups",
        bars: [
          { label: "Inherent", value: 64, display: "16", tone: "bad" },
          { label: "Current", value: 48, display: "12", tone: "warn" },
          { label: "Target", value: 24, display: "6", tone: "good" },
        ],
        note: "Likelihood times impact, each from one to five",
      },
      {
        kind: "list",
        title: "Risk library",
        items: [
          { label: "Unfair outcomes across groups", sub: "AI decisions about people", chip: { from: "Add", tone: "neutral", to: "Added", toTone: "good" } },
          { label: "Reviewers approve without looking", sub: "Human oversight", chip: { from: "Add", tone: "neutral", to: "Added", toTone: "good" } },
          { label: "Model drift goes unnoticed", sub: "Monitoring", chip: { from: "Add", tone: "neutral" } },
          { label: "No route to challenge a decision", sub: "Correction", chip: { from: "Add", tone: "neutral", to: "Added", toTone: "good" } },
        ],
      },
      {
        kind: "list",
        title: "AIC noticed",
        note: "From your connected systems",
        items: [
          { label: "Accounts can sign in without a second factor", sub: "Microsoft 365", chip: { from: "Suggested", tone: "warn", to: "Added", toTone: "good" } },
          { label: "A leaver still holds 3 accounts", sub: "BambooHR and Microsoft 365", chip: { from: "Suggested", tone: "warn", to: "Added", toTone: "good" } },
          { label: "AI used by a system not on the register", sub: "OpenAI", chip: { from: "Suggested", tone: "warn", to: "Dismissed, with reason", toTone: "neutral" } },
        ],
      },
    ],
  },

  "supplier-ai-review": {
    hero: {
      kind: "detail",
      title: "TalentScreen (Demo)",
      sub: "CV screening, decides about candidates",
      fields: [
        ["Trains on your data", "No"],
        ["You can override one decision", "Yes"],
        ["Can explain one decision", "In part"],
        ["Tested for unfair outcomes this year", "Yes, March 2026"],
        ["Tells you before the model changes", "Yes, 30 days"],
      ],
      chip: { from: "Waiting for supplier", tone: "warn", to: "Answered by supplier", toTone: "good" },
    },
    points: [
      {
        kind: "table",
        title: "Suppliers",
        cols: ["Supplier", "Criticality", "Agreement", "Review"],
        rows: [
          { cells: ["TalentScreen (Demo)", "High", "Signed"], chip: { from: "Due", tone: "warn", to: "Reviewed", toTone: "good" } },
          { cells: ["Bureau Data (Demo)", "High", "Signed"], chip: { from: "Reviewed", tone: "good" } },
          { cells: ["Cloud Mail (Demo)", "Medium", "Not signed"], chip: { from: "Overdue", tone: "bad" } },
        ],
      },
      {
        kind: "list",
        title: "Five questions about their AI",
        items: [
          { label: "Do you train on our data?", chip: { from: "Unknown", tone: "neutral", to: "No", toTone: "good" } },
          { label: "Can we override an individual decision?", chip: { from: "Unknown", tone: "neutral", to: "Yes", toTone: "good" } },
          { label: "Can you explain an individual decision?", chip: { from: "Unknown", tone: "neutral", to: "In part", toTone: "warn" } },
          { label: "Tested for unfair outcomes this year?", chip: { from: "Unknown", tone: "neutral", to: "Yes", toTone: "good" } },
          { label: "Will you tell us before the model changes?", chip: { from: "Unknown", tone: "neutral", to: "Yes", toTone: "good" } },
        ],
      },
      {
        kind: "log",
        title: "Request to TalentScreen (Demo)",
        entries: [
          { when: "Mon 09:12", text: "Link sent to the supplier's head of product" },
          { when: "Tue 14:40", text: "Answered by the supplier, no account needed" },
          { when: "Tue 16:05", text: "Read and applied by Thandi Mokoena" },
        ],
      },
    ],
  },

  "decision-log": {
    hero: {
      kind: "table",
      title: "Decision log",
      cols: ["When", "System", "Outcome", "Review"],
      rows: [
        { cells: ["09:14", "Loan pre-screening", "Declined"], chip: { from: "Held for review", tone: "warn", to: "Overridden: approved", toTone: "brass" } },
        { cells: ["09:21", "Loan pre-screening", "Referred"], chip: { from: "Reviewed", tone: "good" } },
        { cells: ["09:30", "Claims triage", "Fast track"], chip: { from: "No review needed", tone: "neutral" } },
        { cells: ["09:42", "Claims triage", "Investigate"], chip: { from: "Held for review", tone: "warn", to: "Upheld", toTone: "good" } },
      ],
    },
    points: [
      {
        kind: "code",
        title: "From your system",
        request: ["POST /decisions", "{", '  "system": "loan-pre-screening",', '  "outcome": "decline",', '  "reason": "Affordability below threshold",', '  "hold_for_review": true', "}"],
        response: ["201 Created", '{ "id": "dec_8f2c", "status": "held" }'],
        status: { from: "Sending", tone: "neutral", to: "Recorded", toTone: "good" },
      },
      {
        kind: "detail",
        title: "Held for a person",
        sub: "Loan pre-screening, 09:14",
        fields: [
          ["Outcome proposed", "Decline"],
          ["Reason given", "Affordability below threshold"],
          ["Reviewer", "Thandi Mokoena"],
          ["Note", "Income verified from payslips; approved"],
        ],
        actions: ["Uphold", "Override"],
        chip: { from: "Waiting", tone: "warn", to: "Overridden by Thandi Mokoena", toTone: "brass" },
      },
      {
        kind: "meter",
        title: "Override rate, last 30 days",
        bars: [
          { label: "Loan pre-screening", value: 22, display: "9 of 41", tone: "brass" },
          { label: "Claims triage", value: 1, display: "0 of 212", tone: "warn" },
        ],
        note: "Zero overrides across many decisions is a question, not a pass",
      },
    ],
  },

  "evidence-packs": {
    hero: {
      kind: "seal",
      title: "Board pack, July to September 2026",
      items: ["AI register, 4 systems", "Accountable person", "Open risks", "Check results", "Framework coverage", "Decision and override counts", "Suppliers"],
      hash: "9b41e0c7d2a85f36e1b0c4d97a2f58e3c61d0b7a94e2f15c8d36a07be19c4f2a",
    },
    points: [
      {
        kind: "log",
        title: "Shared with N. Botha, assessor",
        entries: [
          { when: "10:02", text: "Link sent for July to September" },
          { when: "10:15", text: "Email confirmed with a one-time code" },
          { when: "10:16", text: "Record opened, watermarked with her name" },
          { when: "16:30", text: "Link withdrawn by Thandi Mokoena" },
        ],
      },
      {
        kind: "list",
        title: "What goes in the pack",
        items: [
          { label: "AI register and accountable person", chip: { from: "Copying", tone: "neutral", to: "Included", toTone: "good" } },
          { label: "Open risks and check results", chip: { from: "Copying", tone: "neutral", to: "Included", toTone: "good" } },
          { label: "Framework coverage", chip: { from: "Copying", tone: "neutral", to: "Included", toTone: "good" } },
          { label: "Decision and override counts, suppliers", chip: { from: "Copying", tone: "neutral", to: "Included", toTone: "good" } },
        ],
      },
      {
        kind: "detail",
        title: "Board pack, July to September 2026",
        sub: "Sealed 1 October 2026",
        fields: [
          ["Fingerprint", "SHA-256, 9b41e0c7…19c4f2a"],
          ["Change attempted", "Edit title"],
        ],
        chip: { from: "Saving", tone: "neutral", to: "Refused: packs are sealed", toTone: "bad" },
      },
    ],
  },

  "trust-page": {
    hero: {
      kind: "page",
      title: "Karoo Lending (Demo): how we use AI",
      sections: [
        { label: "Issued by AIC", tone: "brass", items: ["AIC Aware badge, verifiable"] },
        { label: "Observed by AIC", tone: "good", items: ["Second factor on every account, checked nightly", "Every AI system has a named person"] },
        { label: "Declared by us", tone: "neutral", items: ["AI use policy, version 3", "How to ask for a person to review a decision"] },
      ],
    },
    points: [
      {
        kind: "list",
        title: "Each line says who stands behind it",
        items: [
          { label: "AIC Aware badge", chip: { from: "Issued by AIC", tone: "brass" } },
          { label: "Second factor on every account", chip: { from: "Observed by AIC", tone: "good" } },
          { label: "AI use policy, version 3", chip: { from: "Declared by you", tone: "neutral" } },
        ],
      },
      {
        kind: "log",
        title: "Read from your record",
        entries: [
          { when: "Opened", text: "A customer opens your trust page" },
          { when: "Now", text: "AIC reads your record as it is today" },
          { when: "Shown", text: "Only what is true now appears" },
        ],
      },
      {
        kind: "list",
        title: "What shows",
        items: [
          { label: "Badge and certificate", chip: { from: "Hidden", tone: "neutral", to: "Shown", toTone: "good" } },
          { label: "Accountable person", chip: { from: "Hidden", tone: "neutral", to: "Shown", toTone: "good" } },
          { label: "Policies", chip: { from: "Hidden", tone: "neutral", to: "Shown", toTone: "good" } },
          { label: "Systems", chip: { from: "Hidden", tone: "neutral" } },
        ],
      },
    ],
  },

  questionnaires: {
    hero: {
      kind: "table",
      title: "Insurer proposal form",
      cols: ["Question", "Drafted from", "Answer", "Status"],
      rows: [
        { cells: ["Do you use AI in decisions about customers?", "AI register", "Yes, 2 systems"], chip: { from: "Drafted", tone: "neutral", to: "Approved", toTone: "good" } },
        { cells: ["Is a second factor enforced for all users?", "Microsoft 365 check", "Yes"], chip: { from: "Drafted", tone: "neutral", to: "Approved", toTone: "good" } },
        { cells: ["Do you test models for unfair outcomes?", "Nothing on record", "Not answered"], chip: { from: "Needs your input", tone: "warn" } },
      ],
    },
    points: [
      {
        kind: "list",
        title: "Where each answer came from",
        items: [
          { label: "AI use in customer decisions", sub: "AI register", chip: { from: "Drafted", tone: "neutral" } },
          { label: "Human review of declines", sub: "Decision log", chip: { from: "Drafted", tone: "neutral" } },
          { label: "Data processing agreements", sub: "Suppliers", chip: { from: "Drafted", tone: "neutral" } },
        ],
      },
      {
        kind: "list",
        title: "Gaps, flagged",
        items: [
          { label: "Bias testing in the last 12 months", chip: { from: "Checking", tone: "neutral", to: "Needs your input", toTone: "warn" } },
          { label: "Incident response test date", chip: { from: "Checking", tone: "neutral", to: "Needs your input", toTone: "warn" } },
        ],
      },
      {
        kind: "detail",
        title: "Is a second factor enforced for all users?",
        sub: "Drafted from the Microsoft 365 check",
        fields: [
          ["Answer", "Yes, for all 48 accounts"],
          ["Source", "Checked 13 October 2026"],
        ],
        actions: ["Approve", "Edit"],
        chip: { from: "Drafted", tone: "neutral", to: "Approved by Thandi Mokoena", toTone: "good" },
      },
    ],
  },

  "api-and-mcp": {
    hero: {
      kind: "chat",
      title: "Your assistant, connected to AIC",
      question: "Which of our AI systems have no owner right now?",
      tool: "List systems (read-only)",
      answer: ["One: Claims triage.", "Its owner left on 2 October and it has not been handed over.", "It has 2 open risks."],
    },
    points: [
      {
        kind: "code",
        title: "Read, never write",
        request: ["DELETE /systems/claims-triage"],
        response: ["405 Method Not Allowed", '{ "error": "This API is read-only" }'],
        status: { from: "Sending", tone: "neutral", to: "Refused", toTone: "bad" },
      },
      {
        kind: "list",
        title: "What it can read",
        items: [
          { label: "AI systems and their gaps", chip: { from: "Read-only", tone: "neutral" } },
          { label: "Open risks", chip: { from: "Read-only", tone: "neutral" } },
          { label: "Automated check results", chip: { from: "Read-only", tone: "neutral" } },
          { label: "Coverage of each framework", chip: { from: "Read-only", tone: "neutral" } },
          { label: "Accountabilities held by leavers", chip: { from: "Read-only", tone: "neutral" } },
        ],
      },
      {
        kind: "chat",
        title: "Ask in plain words",
        question: "What failed this week?",
        tool: "List check results (read-only)",
        answer: ["Two checks failed:", "a second factor is off for 3 accounts,", "and one leaver still has a Microsoft 365 licence."],
      },
    ],
  },
};
