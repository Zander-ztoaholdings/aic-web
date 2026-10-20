/**
 * The impartiality safeguards and their actual status, shared by
 * /impartiality and the Impartiality tab on /disclosures. They used to be
 * written out twice, and the copy on /disclosures fell four safeguards behind
 * version 2.0 of the statement. One list means the two pages cannot disagree.
 */
export type SafeguardState = "in force" | "committed" | "not yet in place";

export const SAFEGUARDS: { title: string; state: SafeguardState; desc: string }[] = [
  {
    title: "No advisory relationship",
    state: "in force",
    desc: "AIC never certifies an organisation it has a commercial or advisory relationship with. Not a cooling-off period — a permanent bar, and the rule the entire body is built on.",
  },
  {
    title: "Training separated from certification",
    state: "in force",
    desc: "AIC's governance workshops teach only. They never design, review or implement an organisation's controls, because doing so would put AIC in the position of grading its own work.",
  },
  {
    title: "Conflict declaration per engagement",
    state: "committed",
    desc: "A written independence declaration, naming the organisation, signed before assessment work begins. The form is drafted; it has not been used, because no assessment has been carried out.",
  },
  {
    title: "Client concentration limit",
    state: "committed",
    desc: "No single client to exceed 15% of annual revenue. AIC has issued no certificates, so this commitment has not been tested in practice.",
  },
  {
    title: "Assessor and decision-maker separated",
    state: "not yet in place",
    desc: "AIC is currently small enough that the person who would assess and the person who would decide are the same person. No wording fixes that. It will be resolved by appointing an independent reviewer before the first certificate is issued, not before accreditation.",
  },
  {
    title: "Impartiality risk analysis",
    state: "committed",
    desc: "AIC maintains a risk register covering the business as a whole, including the structural conflicts that threaten impartiality. A dedicated impartiality analysis against each recognised threat category is being added to it, with the first quarterly review scheduled for December 2026.",
  },
  {
    title: "Independent conflicts panel",
    state: "not yet in place",
    desc: "Conflict allegations are currently handled by AIC's founders, because AIC is a small body and there is no panel yet. Balanced representation of interested parties is not achievable at AIC's present size; it is a prerequisite for accreditation and will be in place before the first certificate is issued.",
  },
  {
    title: "Published impartiality report",
    state: "not yet in place",
    desc: "No impartiality report has been published. Once AIC is accredited, its accreditation body reviews these arrangements; until then there is no external auditor of them and we will not imply otherwise.",
  },
];

