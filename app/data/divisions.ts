/**
 * What each AIC Division means, in AIC's own words.
 *
 * Extracted from /certification so the regulatory map can put the standard
 * beside a jurisdiction's law without either page paraphrasing the other. The
 * commercial copy — what the audit covers, which product it maps to — stays on
 * the certification page, because that is a sales question and this is not.
 *
 * A Division is a mode of operation, not a grade: a Supervised organisation is
 * not worse than a Sovereign one, it is answering a different set of
 * requirements. `examples` is the closest thing AIC publishes to a sector view,
 * and it describes how an organisation operates — never what a regulator
 * requires of that sector, which is a different claim and not one this data
 * supports.
 */
export interface DivisionProfile {
  division: number;
  name: string;
  tagline: string;
  who: string;
  examples?: string;
  kpi: string;
  note?: string;
}

export const DIVISION_PROFILES: DivisionProfile[] = [
  {
    division: 1,
    name: "Sovereign",
    tagline: "We make decisions. Humans make them.",
    who: "Organisations making no use of AI in consequential decisions.",
    kpi: "No AI in consequential decisions — verified annually",
  },
  {
    division: 2,
    name: "Supervised",
    tagline: "AI assists. Humans decide.",
    who: "AI generates recommendations; a named human makes every consequential decision.",
    examples: "Bank using AI credit model where loan officer decides. Hospital using AI diagnostic where clinician signs off. Employer using AI CV screening where recruiter approves shortlist.",
    kpi: "Human override rate is the primary KPI.",
  },
  {
    division: 3,
    name: "Reviewed",
    tagline: "AI decides. Humans review patterns and cases.",
    who: "AI makes operational decisions; humans conduct periodic reviews and investigate flagged cases.",
    examples: "Lender with automated credit decisions + compliance officer reviewing weekly flags. HR tech platform auto-screening applications + recruiter reviewing rejected candidates weekly.",
    kpi: "Periodic human review rate is the primary KPI.",
  },
  {
    division: 4,
    name: "Monitored",
    tagline: "AI operates. Systems and humans monitor outcomes.",
    who: "AI operates autonomously with continuous technical monitoring; humans monitor aggregate metrics and investigate anomalies.",
    examples: "E-commerce AI recommendations monitored by algorithm team. AI fraud detection monitored by security team. AI route optimisation monitored by operations management.",
    kpi: "Drift detection and aggregate outcome pattern monitoring.",
  },
  {
    division: 5,
    name: "Artificial",
    tagline: "We build AI. Others use it to make decisions.",
    who: "Organisations that develop, train, and sell AI systems or models to other organisations. Their accountability is upstream — they are responsible for the accountability architecture their customers' decisions rest on.",
    examples: "SA LLM company selling to banks. Credit scoring SaaS selling to lenders. AI-powered medical diagnostic tool provider. HR tech company selling AI hiring tools.",
    kpi: "Product accountability architecture completeness.",
    note: "Division 5 certification does NOT replace the obligation of the Division 5 company's customers to hold their own AIC certification.",
  },
];

export function divisionProfile(division: number): DivisionProfile | undefined {
  return DIVISION_PROFILES.find((d) => d.division === division);
}
