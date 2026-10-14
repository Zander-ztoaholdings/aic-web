import type { Mock } from "@/app/data/capability-mocks";

/**
 * Solutions by industry (/solutions/[slug]).
 *
 * Each page names the decisions AI makes in that industry and who they land
 * on, walks through the moment someone asks who answered for one, names the
 * rules that already apply and what each asks of you, and shows what the
 * platform gives the person accountable. Laws are named precisely and dated
 * where a date matters; nothing here is legal advice. EU AI Act dates are as
 * amended in July 2026: high-risk systems listed in Annex III from
 * 2 December 2027, AI in regulated products under Annex I from 2 August 2028.
 */

export type Solution = {
  slug: string;
  name: string;
  /** A one-line description for menus and the index. */
  short: string;
  seoTitle: string;
  description: string;
  h1: string;
  lede: string;
  /** Set when the sector is not yet open for assessment: "<label> in <note>". */
  status?: { label: string; note: string };
  audience: string[];
  decisions: { title: string; affects: string; risk: string }[];
  scenario: { title: string; intro: string; steps: { title: string; text: string }[] };
  rules: { name: string; text: string; asks: string; href?: string }[];
  platform: { title: string; text: string; href: string }[];
  faqs: { q: string; a: string }[];
  scene: Mock;
  /** Which of the workspace's four menus the opening scene sits under. */
  menu: number;
  /** The sample organisation whose workspace the opening scene shows. */
  org: string;
  cta: { label: string; href: string };
  extra?: { title: string; text: string; href: string; label: string };
};

const S71 = "/guides/popia-section-71-automated-decisions";
const EUAI = "/guides/eu-ai-act-south-african-companies";

export const SOLUTIONS: Solution[] = [
  {
    slug: "hr-and-recruitment",
    name: "HR and recruitment",
    short: "Screening, ranking and assessing candidates and staff",
    seoTitle: "AI in hiring: POPIA and accountable recruitment",
    description: "CV screening, candidate ranking and automated assessments decide about people. How POPIA section 71 applies to AI in hiring, and how to show who answers for it.",
    h1: "AI in hiring decides about people. Someone has to answer for it.",
    lede: "Screening, ranking and assessing candidates is one of the clearest cases of a decision about a person made by profiling. Most of it runs on tools bought from suppliers, and the employer still answers for every outcome.",
    audience: ["Heads of HR and talent", "Recruitment agencies", "HR technology companies", "Employment equity committees"],
    decisions: [
      { title: "Screening CVs before a person reads them", affects: "Applicants", risk: "Qualified people filtered out on proxies such as a postcode, a gap in employment or the university attended." },
      { title: "Ranking a shortlist", affects: "Candidates", risk: "The ranking learns who was hired before rather than who can do the job." },
      { title: "Scoring video interviews and online assessments", affects: "Candidates", risk: "An accent, a disability or a poor connection is marked down as poor performance." },
      { title: "Flagging staff for performance or attrition risk", affects: "Employees", risk: "A label follows someone into decisions about pay and promotion without their knowing." },
    ],
    scenario: {
      title: "A rejected candidate asks why",
      intro: "The moment that tests whether anyone really answers for an automated decision.",
      steps: [
        { title: "The question arrives", text: "A candidate rejected minutes after applying writes to ask who decided and on what basis. Under POPIA section 71 they may make representations about an automated decision." },
        { title: "You find the decision", text: "The decision log shows the screener's outcome, the reason it gave, and whether a person looked at it before the rejection went out." },
        { title: "A named person answers", text: "The register names who answers for the screener. They review the rejection and record whether it stands, with their reason." },
        { title: "The record holds", text: "The review, the reason and the person stay on the record, ready for an assessor or for the day the decision is challenged." },
      ],
    },
    rules: [
      { name: "POPIA section 71", text: "Restricts decisions based solely on automated processing that profile a person and have legal or substantial effect. Rejecting an application is such an effect.", asks: "A person able to intervene, a chance for the candidate to make representations, and enough about the logic to make that meaningful.", href: S71 },
      { name: "Employment Equity Act, sections 6 and 8", text: "Section 6 prohibits unfair discrimination in employment policy and practice. Section 8 allows psychological testing and similar assessments only if they are scientifically valid and reliable, applied fairly and not biased against any employee or group.", asks: "Evidence that an AI assessment is valid and fair for the people it is used on, whoever built it." },
      { name: "EU AI Act", text: "Lists AI used for recruitment and selection as high-risk, for any company whose AI's output is used in the EU. Obligations apply from 2 December 2027.", asks: "Human oversight, logging, and a risk management system for the screening tools in scope.", href: EUAI },
    ],
    platform: [
      { title: "Every screening tool on the register", text: "Including the ones you buy, with the person who answers for each.", href: "/platform/ai-register" },
      { title: "Ask your HR vendors five questions", text: "Can you override a rejection, can they explain it, have they tested for unfair outcomes.", href: "/platform/supplier-ai-review" },
      { title: "A person before the rejection", text: "Hold automated rejections for review, and keep every override with its reason.", href: "/platform/decision-log" },
      { title: "Tell candidates how to contest", text: "A public page that says AI is involved and how to ask for a person.", href: "/platform/trust-page" },
    ],
    faqs: [
      { q: "Is our CV screener making decisions based solely on automated processing?", a: "If no person meaningfully reviews an application before it is rejected, it very likely is. A person who approves rejections in bulk without looking does not change that. This is general information, not legal advice about your process." },
      { q: "We buy the screening tool. Are we still responsible?", a: "Yes. Under POPIA the employer is the responsible party for the decisions it makes about applicants, and the supplier processes information for you as an operator under a written agreement. Asking the supplier how its AI behaves is part of answering for it." },
      { q: "Do we have to stop using AI in recruitment?", a: "No. The law restricts decisions made solely by automated processing. A named person who can intervene, and a route for the candidate to be heard, are the safeguards it expects." },
    ],
    scene: {
      kind: "table",
      title: "Decision log: CV screening",
      cols: ["Applicant", "Role", "Screener", "Review"],
      rows: [
        { cells: ["Applicant 4471", "Credit analyst", "Rejected"], chip: { from: "Held for review", tone: "warn", to: "Reviewed: invited", toTone: "brass" } },
        { cells: ["Applicant 4472", "Credit analyst", "Shortlisted"], chip: { from: "No review needed", tone: "neutral" } },
        { cells: ["Applicant 4473", "Branch consultant", "Rejected"], chip: { from: "Held for review", tone: "warn", to: "Upheld, reason recorded", toTone: "good" } },
        { cells: ["Applicant 4474", "Branch consultant", "Shortlisted"], chip: { from: "No review needed", tone: "neutral" } },
      ],
    },
    menu: 0,
    org: "Karoo Lending (Demo)",
    cta: { label: "Book a walk-through", href: "/contact?topic=platform" },
    extra: { title: "For recruitment agencies and HR technology companies", text: "If your product or service screens candidates for other companies, partner with us so your clients can show they stay accountable.", href: "/partners", label: "The partner programme" },
  },

  {
    slug: "financial-services",
    name: "Financial services",
    short: "Credit, pricing, fraud and collections",
    seoTitle: "AI in credit and lending: accountable decisions",
    description: "Credit, fraud and collections models decide about customers. How POPIA section 71, the National Credit Act and fair treatment rules apply, and how to evidence oversight.",
    h1: "Credit decisions made by models are still your decisions",
    lede: "Lenders and financial services firms were early to automate decisions about customers. Regulators, boards and customers now ask the same question: who answers for the outcome, and can you show it?",
    audience: ["Credit risk and model risk teams", "Compliance and conduct", "Fraud and collections", "Boards and risk committees"],
    decisions: [
      { title: "Approving or declining credit", affects: "Applicants", risk: "People with thin credit files declined on proxies the model learned, with no reason anyone can give." },
      { title: "Setting limits and prices", affects: "Customers", risk: "Similar customers offered different terms for reasons nobody can trace." },
      { title: "Flagging transactions or customers as fraud", affects: "Customers", risk: "Accounts frozen at the worst moment, with no person looking until the customer complains." },
      { title: "Prioritising accounts for collection", affects: "Debtors", risk: "Customers in hardship pushed hardest because they are most likely to respond." },
    ],
    scenario: {
      title: "A declined customer asks for the reason",
      intro: "The National Credit Act gives a consumer the right to ask. The answer has to come from somewhere.",
      steps: [
        { title: "The request arrives", text: "A customer declined online asks for the dominant reason their application was refused, as the National Credit Act allows." },
        { title: "The reason is on the log", text: "The decision log holds the reason the model gave when it decided, not one reconstructed weeks later." },
        { title: "A person reviews it", text: "The analyst who answers for the model reviews the decline. If it is overturned, the override and its reason are recorded." },
        { title: "The board can see the pattern", text: "Override rates and open model risks reach the board in a sealed pack, so oversight is evidence rather than assurance." },
      ],
    },
    rules: [
      { name: "POPIA section 71", text: "A customer declined by an automated decision that profiles them must have safeguards, including the chance to make representations.", asks: "Human intervention and a way for the customer to be heard, with enough about the logic to make it real.", href: S71 },
      { name: "National Credit Act, section 62", text: "A consumer refused credit may ask the credit provider for the dominant reason for the refusal.", asks: "A reason you can state for each decline, which an unexplained model cannot give." },
      { name: "Joint Standard 1 of 2023", text: "The Prudential Authority and FSCA standard on IT governance and risk management for financial institutions.", asks: "Governance and risk management over the technology, models included, that the business depends on." },
      { name: "EU AI Act", text: "Lists AI used to evaluate creditworthiness or set a credit score for individuals as high-risk, from 2 December 2027, where its output is used in the EU.", asks: "Human oversight, logging, data governance and a risk management system.", href: EUAI },
    ],
    platform: [
      { title: "Every model, its decision and its owner", text: "The register separates models that decide about customers from the rest.", href: "/platform/ai-register" },
      { title: "Reasons and overrides, logged", text: "The reason given for each decision and every human override, as they happen.", href: "/platform/decision-log" },
      { title: "Risk tied to the model", text: "Unfair outcomes, drift and vendor model changes on the risk register, against the system.", href: "/platform/risk-management" },
      { title: "A pack for the board", text: "A sealed copy of the record for the board and the regulator's questions.", href: "/platform/evidence-packs" },
    ],
    faqs: [
      { q: "We already run model risk management. What does AIC add?", a: "Model risk asks whether a model is sound. AIC asks whether a named person answers for each decision it makes about a customer, and keeps the evidence that they did. The two meet on the risk register, where model risks are tied to the system and its owner." },
      { q: "Does every declined application need a person to review it?", a: "Not necessarily. The law looks for safeguards such as the ability to intervene and to make representations. Many lenders hold a sample, or every decline near a threshold, for review. Which design fits is your decision; the log shows what you actually do." },
      { q: "Can we show our regulator or board without giving them access?", a: "Yes. An evidence pack is a sealed copy of the record for a period. Anyone holding it can check it has not been changed, without an account." },
    ],
    scene: {
      kind: "table",
      title: "Decision log: personal loans",
      cols: ["When", "Product", "Model", "Review"],
      rows: [
        { cells: ["09:14", "Personal loan", "Declined"], chip: { from: "Held for review", tone: "warn", to: "Overridden: approved", toTone: "brass" } },
        { cells: ["09:21", "Personal loan", "Referred"], chip: { from: "Reviewed", tone: "good" } },
        { cells: ["09:30", "Credit card", "Approved"], chip: { from: "No review needed", tone: "neutral" } },
        { cells: ["09:42", "Personal loan", "Declined"], chip: { from: "Held for review", tone: "warn", to: "Upheld, reason sent", toTone: "good" } },
      ],
    },
    menu: 0,
    org: "Karoo Lending (Demo)",
    cta: { label: "Book a walk-through", href: "/contact?topic=platform" },
    extra: { title: "Mapping AI to model risk", text: "How AI fits the model risk management financial firms already run, requirement by requirement.", href: "/frameworks/financial-services", label: "Financial services frameworks" },
  },

  {
    slug: "insurance",
    name: "Insurance",
    short: "Pricing, underwriting and claims, and insuring AI",
    seoTitle: "AI in insurance: underwriting, claims and accountability",
    description: "Insurers use AI to price and triage claims, and now insure AI risk. How AIC helps on both sides: accountable decisions, and evidence for underwriting AI.",
    h1: "Insurers use AI, and insure it. Both need evidence.",
    lede: "Pricing, underwriting and claims triage decide about policyholders. At the same time, insurers are being asked to cover the losses AI causes for their clients. In both cases the question is whether a person really answers for the decision.",
    audience: ["Underwriting and pricing", "Claims and fraud", "Conduct and compliance", "Cyber and liability underwriters"],
    decisions: [
      { title: "Pricing and accepting cover", affects: "Applicants and policyholders", risk: "Premiums that track a proxy for a protected group rather than the risk." },
      { title: "Triaging and settling claims", affects: "Claimants", risk: "Valid claims slowed or short-paid because a model scored them as unusual." },
      { title: "Flagging claims as possible fraud", affects: "Claimants", risk: "An honest claimant treated as a suspect with no person reviewing the flag." },
      { title: "Deciding which policies to renew", affects: "Policyholders", risk: "Cover quietly withdrawn from people a model rates as unprofitable." },
    ],
    scenario: {
      title: "A claim is flagged as possible fraud",
      intro: "Fair treatment in claims is measured by what happens to the claimant, not by how the flag was raised.",
      steps: [
        { title: "The flag is raised", text: "The triage model marks a vehicle claim for investigation and holds it, rather than declining it." },
        { title: "A handler reviews it", text: "The claims handler who answers for the model sees the reason it gave and the evidence behind the flag." },
        { title: "The outcome is recorded", text: "The handler clears the claim, with a reason. The override joins the log against the model." },
        { title: "The pattern is visible", text: "If one model's flags are overturned again and again, it shows on the risk register before it shows in complaints." },
      ],
    },
    rules: [
      { name: "POPIA section 71", text: "Applies to automated decisions about policyholders and claimants that profile them.", asks: "Safeguards including human intervention and a chance to make representations.", href: S71 },
      { name: "Policyholder Protection Rules", text: "The fair treatment rules for long-term and short-term insurance, including how claims are handled, whoever or whatever handles them.", asks: "Outcomes that are fair to the policyholder, which a model's results are judged by as much as a person's." },
      { name: "King V", text: "Boards are expected to oversee how technology and AI are governed, including accountability for outputs.", asks: "Evidence for the board that AI is governed, not only a policy saying it should be.", href: "/guides/king-v-ai-governance" },
      { name: "EU AI Act", text: "Lists AI used for risk assessment and pricing of individuals in life and health insurance as high-risk, from 2 December 2027, where its output is used in the EU.", asks: "Human oversight, logging and a risk management system for the systems in scope.", href: EUAI },
    ],
    platform: [
      { title: "Your own AI, accountable", text: "Pricing and claims models on the register, with owners, risks and logged overrides.", href: "/platform/ai-register" },
      { title: "Evidence when you insure AI", text: "With a client's permission, read whether a person answers for its AI decisions.", href: "/insurers" },
      { title: "Sealed packs for underwriting", text: "A client can give you a pack you can check has not been changed.", href: "/platform/evidence-packs" },
      { title: "Flags and overrides, logged", text: "Every fraud flag a person reviewed, and what they decided.", href: "/platform/decision-log" },
    ],
    faqs: [
      { q: "Can AIC evidence be used in underwriting?", a: "Yes, with the client's permission. A client can share a read-only extract or a sealed evidence pack. AIC gives no rating or recommendation; pricing and acceptance remain the insurer's decisions." },
      { q: "Does AIC replace our own model governance?", a: "No. It records who answers for each decision a model makes about a policyholder, and keeps the evidence. Your model governance decides whether the model is sound." },
      { q: "Is fraud detection exempt from the automated decision rules?", a: "Not automatically. Where a flag profiles a claimant and has a substantial effect on them, the safeguards apply. Holding flagged claims for a person, rather than declining them, is the usual design." },
    ],
    scene: {
      kind: "table",
      title: "Decision log: claims triage",
      cols: ["Claim", "Line", "Model", "Review"],
      rows: [
        { cells: ["CLM-20931", "Motor", "Investigate"], chip: { from: "Held for review", tone: "warn", to: "Cleared by handler", toTone: "brass" } },
        { cells: ["CLM-20932", "Home", "Fast track"], chip: { from: "No review needed", tone: "neutral" } },
        { cells: ["CLM-20933", "Motor", "Fast track"], chip: { from: "No review needed", tone: "neutral" } },
        { cells: ["CLM-20934", "Home", "Investigate"], chip: { from: "Held for review", tone: "warn", to: "Upheld, reason recorded", toTone: "good" } },
      ],
    },
    menu: 0,
    org: "Karoo Mutual (Demo)",
    cta: { label: "Book a walk-through", href: "/contact?topic=platform" },
    extra: { title: "Underwriting AI risk?", text: "See how AIC's record can serve as evidence for cyber, liability and AI performance cover.", href: "/insurers", label: "AIC for insurers" },
  },

  {
    slug: "engineering",
    name: "Engineering",
    short: "Design checks, inspection, maintenance and plant control",
    seoTitle: "AI in engineering: accountable design and operations",
    description: "Design checks, inspections, predictive maintenance and plant control increasingly run through AI. How ECSA, OHSA and the EU AI Act apply, and how to show who signed off.",
    h1: "Engineering judgement can use AI. It cannot hand over the signature.",
    lede: "Design checks, inspections and plant control increasingly run through models. South African law already expects a registered person to take responsibility for engineering work. AIC makes that responsibility visible when part of the work is done by AI.",
    audience: ["Consulting engineers", "Asset owners and operators", "Plant and process engineering teams", "Health and safety officers"],
    decisions: [
      { title: "Checking designs against codes", affects: "Clients and the public", risk: "A model passes a design outside what it was trained to judge, and the check is taken as the engineer's." },
      { title: "Finding defects in inspections", affects: "Operators and the public", risk: "A crack or corrosion missed in drone or camera footage because the model was confident." },
      { title: "Deciding when to maintain", affects: "Workers and the public", risk: "Maintenance deferred on a forecast that was wrong in a way nobody reviewed." },
      { title: "Monitoring workers for safety", affects: "Employees", risk: "A camera's flag becomes a disciplinary decision without a person looking." },
    ],
    scenario: {
      title: "A model passes a design check",
      intro: "The question an inspector, a client or an inquiry will ask is simple: who signed off, and what did they see?",
      steps: [
        { title: "The check runs", text: "A structural design is run through an AI code-checking tool, which reports that it complies." },
        { title: "The engineer is named", text: "The register names the registered person who answers for the tool's use on this project." },
        { title: "The review is recorded", text: "The tool's output and the engineer's own review are logged together, including anything the engineer overrode." },
        { title: "The file stands up", text: "A sealed evidence pack gives the client or an inspector a copy of the record that can be checked has not been changed." },
      ],
    },
    rules: [
      { name: "Engineering Profession Act, 2000", text: "Work identified by ECSA as engineering work is reserved for registered persons, or work under their supervision, under the Identification of Engineering Work rules.", asks: "A registered person who takes responsibility for the work, including the parts an AI tool performed." },
      { name: "Occupational Health and Safety Act, 1993", text: "Section 8 requires employers to provide and maintain systems of work that are, as far as reasonably practicable, safe and without risk to health.", asks: "Evidence that automated control and monitoring systems are part of a safe system of work, with someone accountable for them." },
      { name: "POPIA section 71", text: "Applies when AI monitoring of workers leads to decisions about them, such as discipline.", asks: "A person able to intervene, and a way for the employee to be heard.", href: S71 },
      { name: "EU AI Act", text: "AI that is a safety component of machinery is high-risk from 2 August 2028. AI that is a safety component in managing critical infrastructure, such as water, gas, heating or electricity supply, is high-risk from 2 December 2027.", asks: "Risk management, logging and human oversight for systems placed on the EU market or used there.", href: EUAI },
    ],
    platform: [
      { title: "Every AI tool, with its engineer", text: "Design, inspection and control tools on the register, each with the registered person who answers for it.", href: "/platform/ai-register" },
      { title: "Output and review, side by side", text: "Log what the tool concluded and what the engineer decided, through the API or by hand.", href: "/platform/decision-log" },
      { title: "Safety risks tied to the system", text: "Missed defects, drift and unannounced vendor changes on the risk register, against the tool.", href: "/platform/risk-management" },
      { title: "A file for the client or inspector", text: "A sealed pack of the record for a project or a period.", href: "/platform/evidence-packs" },
    ],
    faqs: [
      { q: "Does using an AI design or inspection tool change who is responsible?", a: "No. The registered person who takes responsibility for the work remains responsible for it, whatever tools were used. AIC records that responsibility and the review behind it." },
      { q: "Our AI controls plant, not people. Does AIC still apply?", a: "AIC's standard is about decisions with consequences for people, and plant control affects the safety of workers and the public. The platform's register, risks and decision log work the same way for safety-critical systems." },
      { q: "How does this relate to process safety management?", a: "It sits alongside it. Process safety asks whether the plant is safe; AIC records who answers for each automated decision that affects it, and keeps the evidence." },
    ],
    scene: {
      kind: "table",
      title: "AI register: engineering",
      cols: ["System", "Used for", "Answered for by", "Status"],
      rows: [
        { cells: ["Code-check assistant", "Structural design", "N. Dube, Pr Eng"], chip: { from: "Complete", tone: "good" } },
        { cells: ["Drone crack detection", "Bridge inspection", "Not named"], chip: { from: "No owner", tone: "bad", to: "Owner named", toTone: "good" } },
        { cells: ["Pump failure forecast", "Maintenance", "K. Naidoo, Pr Tech Eng"], chip: { from: "No risk recorded", tone: "warn", to: "Complete", toTone: "good" } },
        { cells: ["Site safety cameras", "Worker monitoring", "Safety officer"], chip: { from: "Decides about people", tone: "brass" } },
      ],
    },
    menu: 0,
    org: "Highveld Consulting Engineers (Demo)",
    cta: { label: "Book a walk-through", href: "/contact?topic=platform" },
    extra: { title: "Process industries", text: "How AI maps onto the safety and operational frameworks process plants already run.", href: "/frameworks/process-industry", label: "Process industry frameworks" },
  },

  {
    slug: "technology",
    name: "IT and software",
    short: "AI in your product, and in how IT runs",
    seoTitle: "AI in software products: answer your customers' questions",
    description: "If your product decides for your customers, they will ask who answers for it. How POPIA, the EU AI Act and buyers' reviews apply to software and IT providers, and how to answer.",
    h1: "If your product makes decisions, your customers will ask who answers for them",
    lede: "Software companies are building AI into products their customers use to decide about people. Enterprise buyers, insurers and regulators now ask the vendor for evidence before they sign, and internal IT runs AI over access and security too.",
    audience: ["Software and SaaS companies", "IT service providers", "CIOs and CISOs", "Product and engineering leads"],
    decisions: [
      { title: "AI features that decide for your customers", affects: "Your customers' customers", risk: "You become the supplier your customer must review, and cannot answer their questions." },
      { title: "Suspending accounts and moderating content", affects: "Users", risk: "People locked out or silenced with no route to a person." },
      { title: "Granting and removing access", affects: "Employees", risk: "Access changed by an automated rule nobody reviews, in both directions." },
      { title: "AI writing and changing code", affects: "Systems and the data in them", risk: "Unreviewed changes reach production because the assistant was usually right." },
    ],
    scenario: {
      title: "An enterprise customer sends its AI review",
      intro: "The procurement question that now arrives before the contract does.",
      steps: [
        { title: "The questions arrive", text: "The customer asks whether you train on their data, whether they can override a decision, whether you can explain one, whether you test for unfair outcomes, and whether you will warn them before the model changes." },
        { title: "Answers come from the record", text: "Answers are drafted from your register, decision log, checks and policies, and anything the record cannot answer is flagged rather than guessed." },
        { title: "A person approves", text: "The person who answers for the product feature approves each answer before it goes." },
        { title: "The customer can check", text: "Your trust page shows what AIC observed and what you declared, and a sealed pack backs up the answers." },
      ],
    },
    rules: [
      { name: "POPIA sections 19 and 21", text: "Section 19 requires appropriate security safeguards. Section 21 requires a written agreement when you process personal information for a customer as their operator.", asks: "Security you can evidence, and contract terms your customers will ask you to prove." },
      { name: "POPIA section 71", text: "Applies to your customers' automated decisions, and to yours when your product decides about people directly.", asks: "Features that let a person intervene and let the affected person be heard.", href: S71 },
      { name: "EU AI Act", text: "Places obligations on providers of AI systems used in the EU, including transparency when people interact with AI, and full provider duties for high-risk systems from 2 December 2027.", asks: "Documentation, logging and human oversight built into the product for customers who use it in the EU.", href: EUAI },
      { name: "ISO/IEC 42001 and SOC 2", text: "The management system and assurance standards enterprise buyers most often ask software suppliers about.", asks: "Evidence collected once that answers each framework's requirements." },
    ],
    platform: [
      { title: "Answer reviews from the record", text: "Draft answers from what the record holds, with every gap flagged and every answer approved.", href: "/platform/questionnaires" },
      { title: "A trust page your buyers can read", text: "Live from your record, separating what AIC issued, observed and you declared.", href: "/platform/trust-page" },
      { title: "Log decisions from your product", text: "Send decisions to AIC through the API and hold the ones that need a person.", href: "/platform/decision-log" },
      { title: "Read it from your own tools", text: "A read-only API and MCP server for your dashboards and assistants.", href: "/platform/api-and-mcp" },
    ],
    faqs: [
      { q: "Our customers make the decisions, not us. Why does this matter to us?", a: "Because your customers answer for decisions your product makes for them, and they will ask you how it behaves. A supplier that can answer clearly, with evidence, is easier to buy." },
      { q: "Can the decision log run inside our product?", a: "Yes. Your product can send each consequential decision to AIC with an API key and hold it for a named person to review. Overrides are recorded by the signed-in person who made them." },
      { q: "We already have SOC 2. What does AIC add?", a: "SOC 2 shows your security controls work. It does not show who answers for each decision your AI makes about people. AIC records that, and evidence collected once counts towards both." },
    ],
    scene: {
      kind: "table",
      title: "Customer AI review: Enterprise Bank (Demo)",
      cols: ["Question", "Drafted from", "Answer", "Status"],
      rows: [
        { cells: ["Do you train on our data?", "Data processing policy", "No"], chip: { from: "Drafted", tone: "neutral", to: "Approved", toTone: "good" } },
        { cells: ["Can we override a single decision?", "Decision log", "Yes"], chip: { from: "Drafted", tone: "neutral", to: "Approved", toTone: "good" } },
        { cells: ["Tested for unfair outcomes this year?", "Nothing on record", "Not answered"], chip: { from: "Needs your input", tone: "warn" } },
        { cells: ["Will you tell us before the model changes?", "Change policy", "Yes, 30 days"], chip: { from: "Drafted", tone: "neutral", to: "Approved", toTone: "good" } },
      ],
    },
    menu: 3,
    org: "Karoo Software (Demo)",
    cta: { label: "Book a walk-through", href: "/contact?topic=platform" },
    extra: { title: "Building AI products for other companies?", text: "Partner with AIC so your customers can show they stay accountable for what your product decides.", href: "/partners", label: "The partner programme" },
  },

  {
    slug: "healthcare",
    name: "Healthcare",
    short: "Clinical AI. Preparing for deployment in Q2 2027",
    seoTitle: "AI in healthcare: accountable clinical AI, from 2027",
    description: "Triage, imaging and decision support use AI, and the practitioner stays responsible. AIC's healthcare programme is preparing for deployment in the second quarter of 2027.",
    h1: "In healthcare, the practitioner makes the final decision. AI has to leave room for it.",
    lede: "Triage, imaging and clinical decision support are moving quickly, and the rules are explicit that the practitioner stays responsible. AIC's healthcare programme is being prepared with the sector and opens in the second quarter of 2027.",
    status: { label: "Preparing for deployment", note: "Q2 2027" },
    audience: ["Hospital groups and clinics", "Medical schemes and administrators", "Health technology companies", "Clinical governance committees"],
    decisions: [
      { title: "Triage and prioritisation", affects: "Patients", risk: "A patient's urgency underrated by a model trained on a different population." },
      { title: "Reading images and flagging findings", affects: "Patients", risk: "A finding missed, or a false one acted on, without the practitioner's own read." },
      { title: "Clinical decision support", affects: "Patients", risk: "A suggestion followed because it was there, not because it was right for this patient." },
      { title: "Pre-authorisations and claims", affects: "Medical scheme members", risk: "Treatment refused by an automated rule with no clinician reviewing it." },
    ],
    scenario: {
      title: "What we are preparing",
      intro: "Healthcare needs more than the general standard. This is the work under way before assessments open.",
      steps: [
        { title: "Requirements for clinical AI", text: "AIC's standard extended for clinical settings, mapped to the HPCSA's guidance on AI and SAHPRA's requirements for AI-enabled medical devices." },
        { title: "Built with the sector", text: "Draft requirements tested with practitioners, hospital groups and health technology companies before they are published." },
        { title: "Published for comment", text: "The healthcare requirements published in full, as the general standard is, before anyone is assessed against them." },
        { title: "Assessments open", text: "Assessments for healthcare organisations open in the second quarter of 2027." },
      ],
    },
    rules: [
      { name: "HPCSA Booklet 20, Guidelines on the Use of Artificial Intelligence", text: "Announced in November 2025. The practitioner must always make the final decision on patient care, and patients who decline AI may not be disadvantaged.", asks: "AI that supports the practitioner's judgement, with the final decision visibly theirs." },
      { name: "SAHPRA guidance MD08-2025/2026", text: "SAHPRA's communication to industry on the regulatory requirements for AI and machine learning enabled medical devices, published in August 2025.", asks: "AI that is a medical device to meet the medical device requirements, including registration where required." },
      { name: "POPIA and the National Health Act", text: "Health information is special personal information under POPIA, processed only on the grounds it allows. The National Health Act protects the confidentiality of patient information.", asks: "Care over what health data reaches an AI system and its supplier." },
      { name: "EU AI Act", text: "AI in medical devices regulated under the EU's medical device rules is high-risk from 2 August 2028.", asks: "Risk management, logging and human oversight for devices placed on the EU market.", href: EUAI },
    ],
    platform: [
      { title: "Every clinical tool on the register", text: "With the practitioner or committee that answers for it, and whether it decides about patients.", href: "/platform/ai-register" },
      { title: "Supplier AI, reviewed", text: "Ask health technology suppliers how their AI behaves, in writing.", href: "/platform/supplier-ai-review" },
      { title: "Risks tied to the tool", text: "Clinical risks, drift and vendor changes against the system they concern.", href: "/platform/risk-management" },
    ],
    faqs: [
      { q: "When can a healthcare organisation be assessed?", a: "Assessments for healthcare open in the second quarter of 2027, once the healthcare requirements have been published for comment." },
      { q: "Can we use the platform before then?", a: "The register, risk and supplier tools work for any organisation today. The healthcare requirements, and assessment against them, follow in 2027." },
      { q: "Will AIC certify medical devices?", a: "No. Medical devices are regulated by SAHPRA. AIC assesses whether a named person answers for the decisions AI makes, not whether a device is safe or effective." },
    ],
    scene: {
      kind: "list",
      sample: false,
      title: "Healthcare requirements in preparation",
      items: [
        { label: "HPCSA Booklet 20, Guidelines on the Use of AI", sub: "Practitioner's final decision", chip: { from: "Mapping", tone: "neutral", to: "Mapped", toTone: "good" } },
        { label: "SAHPRA MD08-2025/2026", sub: "AI and ML enabled medical devices", chip: { from: "Mapping", tone: "neutral", to: "Mapped", toTone: "good" } },
        { label: "POPIA, special personal information", sub: "Health information", chip: { from: "Mapping", tone: "neutral", to: "Mapped", toTone: "good" } },
        { label: "Testing with the sector", sub: "Practitioners and hospital groups", chip: { from: "Under way", tone: "brass" } },
      ],
    },
    menu: 1,
    org: "AIC healthcare programme",
    cta: { label: "Register your interest", href: "/contact?topic=healthcare" },
    extra: { title: "Medical device frameworks", text: "How AI maps onto the quality and safety frameworks medical device makers already run.", href: "/frameworks/medical-devices", label: "Medical device frameworks" },
  },
];

export const SOLUTION_BY_SLUG: Record<string, Solution> = Object.fromEntries(SOLUTIONS.map((s) => [s.slug, s]));
