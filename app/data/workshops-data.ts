// AI Integrity Certification — Workshops dataset
//
// Workshops are a teaching product, kept deliberately separate from
// certification and assessment work (see the Arthur Andersen Rule — AIC
// never certifies an organisation it has advised or consulted for). Topics
// below are syllabus-level: what a session covers, not a consulting
// deliverable, and no participant self-assessment is collected or scored.

export interface WorkshopIndustry {
  slug: string;
  label: string;
  shortLabel: string;
  summary: string;
  topics: string[];
  frameworkSlug: string;
}

export const workshopIndustries: WorkshopIndustry[] = [
  {
    slug: "process-industry",
    label: "Engineering & Process Industry",
    shortLabel: "Engineering",
    summary:
      "For EPCM, process safety, and engineering teams introducing AI-assisted decisioning into or alongside existing safety-critical systems.",
    topics: [
      "Where AI-assisted decisioning fits around a Safety Instrumented System — and where it doesn't",
      "Translating HAZOP, LOPA, and FMEA discipline to AI failure modes",
      "Why AI can't currently produce a demonstrable SIL number, and what to do instead",
      "Management-of-change practice for a model that gets retrained",
      "Building the case for named, competent human accountability over an AI-assisted safety decision",
    ],
    frameworkSlug: "process-industry",
  },
  {
    slug: "financial-services",
    label: "Financial Services",
    shortLabel: "Financial Services",
    summary:
      "For risk, compliance, and model-governance teams applying model risk management discipline to AI and machine learning models.",
    topics: [
      "SR 11-7's three pillars, and where AI/ML models actually sit in your model inventory today",
      "What 'effective challenge' looks like for a model nobody in the room can fully explain",
      "Back-testing and outcomes analysis for AI-driven credit, fraud, and trading decisions",
      "Governance gaps that show up first in a regulator's model risk review",
      "Naming an accountable owner for an AI-assisted decision — not a committee, not a vendor",
    ],
    frameworkSlug: "financial-services",
  },
  {
    slug: "medical-devices",
    label: "Medical Devices & Health Software",
    shortLabel: "Health & MedTech",
    summary:
      "For quality, regulatory affairs, and product teams building or deploying AI/ML-based software as a medical device.",
    topics: [
      "IEC 62304 safety classification, applied to the AI/ML component specifically",
      "Good Machine Learning Practice: training data, held-out validation, and documented limitations",
      "Predetermined Change Control Plans — governing a model that's allowed to change after clearance",
      "Post-market monitoring for AI-driven diagnostic and clinical decision-support tools",
      "Where ML-use disclosure has to be plain, not buried in the fine print",
    ],
    frameworkSlug: "medical-devices",
  },
];
