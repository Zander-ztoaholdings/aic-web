/**
 * Solutions by industry (/solutions/[slug]). Each names the decisions AI makes
 * about people in that industry, the rules that already apply, and what the
 * platform gives the people who answer for them. Laws are named precisely;
 * nothing here is legal advice.
 */
export type Solution = {
  slug: string; name: string; seoTitle: string; description: string; h1: string; lede: string;
  decisions: string[];
  rules: { name: string; text: string; href?: string }[];
  platform: { title: string; text: string; href: string }[];
  extra?: { title: string; text: string; href: string; label: string };
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "hr-and-recruitment",
    name: "HR and recruitment",
    seoTitle: "AI in hiring: POPIA and accountable recruitment",
    description: "CV screening, candidate ranking and automated assessments decide about people. How POPIA section 71 applies to AI in hiring, and how to show who answers for it.",
    h1: "AI in hiring decides about people. Someone has to answer for it.",
    lede: "Screening, ranking and assessing candidates is one of the clearest cases of a decision about a person made by profiling. Most of it runs on tools bought in from suppliers, and the employer still answers for every outcome.",
    decisions: ["Screening out CVs before a person reads them", "Ranking candidates for a shortlist", "Scoring video interviews or online assessments", "Flagging employees for performance or attrition risk"],
    rules: [
      { name: "POPIA section 71", text: "Restricts decisions based solely on automated processing that profile a person and have legal or substantial effect. Rejecting an application is such an effect.", href: "/guides/popia-section-71-automated-decisions" },
      { name: "Employment Equity Act", text: "Prohibits unfair discrimination in employment policy and practice, which includes how candidates are screened, whoever's software does it." },
      { name: "EU AI Act", text: "Lists AI used for recruitment and selection as high-risk, for any company whose AI's output is used in the EU.", href: "/guides/eu-ai-act-south-african-companies" },
    ],
    platform: [
      { title: "Every screening tool on the register", text: "Including the ones you buy, with the person who answers for each.", href: "/platform/ai-register" },
      { title: "Ask your HR vendors five questions", text: "Can you override a rejection, can they explain it, have they tested for unfair outcomes.", href: "/platform/supplier-ai-review" },
      { title: "A person before the rejection", text: "Hold automated rejections for review, and keep every override with its reason.", href: "/platform/decision-log" },
      { title: "Tell candidates how to contest", text: "A public page that says AI is involved and how to ask for a person.", href: "/platform/trust-page" },
    ],
    extra: { title: "For recruitment agencies and HR technology companies", text: "If your product or service screens candidates for other companies, partner with us so your clients can show they stay accountable.", href: "/partners", label: "The partner programme" },
  },
  {
    slug: "financial-services",
    name: "Financial services",
    seoTitle: "AI in credit and lending: accountable decisions",
    description: "Credit, fraud and collections models decide about customers. How POPIA section 71 and fair treatment rules apply, and how to evidence human oversight.",
    h1: "Credit decisions made by models are still your decisions",
    lede: "Lenders and financial services firms were early to automate decisions about customers. Regulators, boards and customers now ask the same question: who answers for the outcome, and can you show it?",
    decisions: ["Approving or declining credit applications", "Setting limits and prices", "Flagging transactions or customers as fraudulent", "Prioritising accounts for collection"],
    rules: [
      { name: "POPIA section 71", text: "A customer declined by an automated decision that profiles them must have safeguards, including the chance to make representations.", href: "/guides/popia-section-71-automated-decisions" },
      { name: "National Credit Act", text: "A consumer refused credit can ask the credit provider for the dominant reason for the refusal, which an unexplained model cannot give." },
      { name: "Treating Customers Fairly", text: "The FSCA's fair treatment outcomes apply to the results a model produces as much as to a person's decisions." },
      { name: "Model risk frameworks", text: "How AI maps onto the model risk management financial firms already run.", href: "/frameworks/financial-services" },
    ],
    platform: [
      { title: "Every model, its decision and its owner", text: "The register separates models that decide about customers from the rest.", href: "/platform/ai-register" },
      { title: "Reasons and overrides, logged", text: "The reason given for each decision and every human override, as they happen.", href: "/platform/decision-log" },
      { title: "Risk tied to the model", text: "Unfair outcomes, drift and vendor model changes on the risk register, against the system.", href: "/platform/risk-management" },
      { title: "A pack for the board", text: "A sealed copy of the record for the board and the regulator's questions.", href: "/platform/evidence-packs" },
    ],
  },
  {
    slug: "insurance",
    name: "Insurance",
    seoTitle: "AI in insurance: underwriting, claims and accountability",
    description: "Insurers use AI to price and triage claims, and now insure AI risk. How AIC helps on both sides: accountable decisions, and evidence for underwriting AI.",
    h1: "Insurers use AI, and insure it. Both need evidence.",
    lede: "Pricing, underwriting and claims triage decide about policyholders. At the same time, insurers are being asked to cover the losses AI causes for their clients. In both cases the question is whether a person really answers for the decision.",
    decisions: ["Pricing and accepting cover", "Triaging and settling claims", "Flagging claims as possible fraud", "Deciding which policies to renew"],
    rules: [
      { name: "POPIA section 71", text: "Applies to automated decisions about policyholders and claimants that profile them.", href: "/guides/popia-section-71-automated-decisions" },
      { name: "Policyholder Protection Rules", text: "Fair treatment of policyholders, including in how claims are handled, whoever or whatever handles them." },
      { name: "King V", text: "Boards are expected to oversee how technology and AI are governed, including accountability for outputs.", href: "/guides/king-v-ai-governance" },
    ],
    platform: [
      { title: "Your own AI, accountable", text: "Pricing and claims models on the register, with owners, risks and logged overrides.", href: "/platform/ai-register" },
      { title: "Evidence when you insure AI", text: "With a client's permission, read whether a person answers for its AI decisions.", href: "/insurers" },
      { title: "Sealed packs for underwriting", text: "A client can give you a pack you can check has not been changed.", href: "/platform/evidence-packs" },
    ],
    extra: { title: "Underwriting AI risk?", text: "See how AIC's record can serve as evidence for cyber, liability and AI performance cover.", href: "/insurers", label: "AIC for insurers" },
  },
];
export const SOLUTION_BY_SLUG: Record<string, Solution> = Object.fromEntries(SOLUTIONS.map((s) => [s.slug, s]));
