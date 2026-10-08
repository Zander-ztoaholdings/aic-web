/**
 * Guides: the long answers to the questions people actually search for.
 *
 * Each guide answers one question completely, in plain language, with its
 * sources listed so a reader (or a search engine) can check every claim. They
 * are written to be useful on their own, not as a funnel: the AIC angle is a
 * short closing note, never the body. Dates are the date each guide was last
 * checked against its sources.
 *
 * Rules for editing: no claim without a source in `sources`; British English;
 * if a law or deadline changes, change the guide and its `updated` date the
 * same day.
 */

export type GuideBlock =
  | { kind: "h2"; text: string; id: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: { title: string; text: string }[] }
  | { kind: "note"; text: string }
  | { kind: "quote"; text: string; cite: string };

export type Guide = {
  slug: string;
  title: string;
  /** The search-result title, under about 60 characters with " | AIC". */
  seoTitle: string;
  description: string;
  /** The question the guide answers, as someone would type it. */
  question: string;
  /** Two or three sentences that answer it outright, shown first. */
  answer: string;
  keywords: string[];
  updated: string;
  readMinutes: number;
  body: GuideBlock[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: string[];
};

const S = {
  popia: { label: "Protection of Personal Information Act 4 of 2013 (POPIA), section 71", url: "https://www.gov.za/documents/protection-personal-information-act" },
  bowmans: { label: "Bowmans: AI in the workplace, POPIA considerations", url: "https://bowmanslaw.com/insights/south-africa-ai-in-the-workplace-2-of-6-popia-considerations/" },
  regulator: { label: "Information Regulator (South Africa)", url: "https://inforegulator.org.za/" },
  fines: { label: "BusinessTech: Information Regulator fines under POPIA (August 2026 briefing)", url: "https://businesstech.co.za/news/business/872960/two-departments-nailed-with-r5-million-fines-in-south-africa/" },
  kingV: { label: "Clyde & Co: King V enhances principles on AI governance and cyber risk", url: "https://www.clydeco.com/en/insights/2025/11/king-v-code-enhances-principles-regarding-ai-gover" },
  aiPolicy: { label: "Fasken: Minister withdraws draft National AI Policy (April 2026)", url: "https://www.fasken.com/en/knowledge/2026/04/the-hallucinatory-irony-of-it-all-minister-withdraws-draft-national-ai-policy" },
  omnibus: { label: "Grant Thornton: the EU AI Act after the high-risk deadline moved", url: "https://www.grantthornton.co.uk/insights/the-eu-ai-act-what-uk-and-cross-border-general-counsel-need-to-know-now-the-high-risk-deadline-has-moved/" },
  aiAct: { label: "Regulation (EU) 2024/1689, the Artificial Intelligence Act", url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
  iso42001: { label: "ISO/IEC 42001:2023, AI management systems", url: "https://www.iso.org/standard/81230.html" },
  sanas: { label: "SANAS, the South African National Accreditation System", url: "https://www.sanas.co.za/" },
  ibm: { label: "IBM Cost of a Data Breach Report 2025 (summary)", url: "https://www.kiteworks.com/cybersecurity-risk-management/ibm-2025-data-breach-report-ai-risks/" },
  standard: { label: "The AIC standard, published in full", url: "https://aiccertified.cloud/standard" },
};

export const GUIDES: Guide[] = [
  {
    slug: "popia-section-71-automated-decisions",
    title: "POPIA section 71: automated decision-making, explained",
    seoTitle: "POPIA section 71 and automated decisions explained",
    description: "What section 71 of POPIA says about decisions made solely by automated processing, the two exceptions, the safeguards it requires, and how to show you meet them.",
    question: "What does POPIA section 71 require for automated decisions?",
    answer: "Section 71 of POPIA says a person may not be subjected to a decision that has legal consequences for them, or affects them to a substantial degree, if it is based solely on automated processing that profiles them. It is allowed only where a contract or a law or code of conduct applies and appropriate safeguards are in place, including a way for the person to make representations and enough information about the logic to do so.",
    keywords: ["POPIA section 71", "automated decision making South Africa", "POPIA automated processing", "profiling POPIA", "credit scoring POPIA"],
    updated: "2026-10-07",
    readMinutes: 7,
    body: [
      { kind: "h2", id: "what-it-says", text: "What section 71 says" },
      { kind: "p", text: "The Protection of Personal Information Act (POPIA) contains one section written directly about machines making decisions about people. Section 71 says a data subject may not be subject to a decision which results in legal consequences for them, or which affects them to a substantial degree, where that decision is based solely on the automated processing of personal information intended to provide a profile of that person." },
      { kind: "p", text: "The section names the kinds of profile it has in mind: performance at work, creditworthiness, reliability, location, health, personal preferences and conduct. Commentators read the list as examples rather than a closed set, so a model that profiles people in some other way is not outside the section simply because its subject is not named." },
      { kind: "h2", id: "three-tests", text: "The three tests that bring a decision inside it" },
      { kind: "steps", items: [
        { title: "It is a decision with real effect", text: "Legal consequences (a contract refused, a benefit stopped) or a substantial effect (a job application rejected, a claim delayed, a price that shuts someone out)." },
        { title: "It is based solely on automated processing", text: "No person meaningfully considered it before it took effect. A human who signs off every output without looking does not change this; a human who can and does disagree does." },
        { title: "The processing profiles the person", text: "It evaluates aspects of them: how risky, reliable, healthy or productive they are, or what they will probably do." },
      ] },
      { kind: "h2", id: "exceptions", text: "When an automated decision is still allowed" },
      { kind: "p", text: "Section 71 does not ban automated decisions. It allows them in two situations:" },
      { kind: "list", items: [
        "The decision is taken in connection with concluding or performing a contract, and either the person's request was granted or appropriate measures protect their legitimate interests.",
        "A law or a code of conduct governs the decision and itself sets out appropriate measures to protect the people affected.",
      ] },
      { kind: "p", text: "For the contract route, the measures must at least give the person an opportunity to make representations about the decision, and give them enough information about the underlying logic of the automated processing to make those representations meaningful." },
      { kind: "h2", id: "in-practice", text: "What that means in practice" },
      { kind: "p", text: "Read together, the safeguards describe something an organisation can build and show: someone the affected person can reach, a way to contest the outcome, an explanation that reflects what actually drove the decision, and a person with the authority to change it. Most organisations that run credit, insurance, hiring or fraud models already have some of this. What they rarely have is evidence that it works: that people find the route to contest, that someone answers, and that decisions are overturned when they should be." },
      { kind: "list", items: [
        "Know which of your systems make or shape decisions about people. You cannot apply section 71 to a model nobody has listed.",
        "Name a person accountable for each one, and give them a real override.",
        "Tell people, before the decision, that automated processing is involved, in words specific to that decision.",
        "Give a reason that matches the actual drivers of the decision, not a generic one.",
        "Make the route to contest easy to find, and measure how quickly it is answered and how often it changes the outcome.",
      ] },
      { kind: "note", text: "The Information Regulator enforces POPIA. It has issued administrative fines, including R5 million each against two national departments, and in 2026 signalled an end to leniency. The maximum administrative fine under POPIA is R10 million." },
      { kind: "h2", id: "how-aic-fits", text: "Where AIC fits" },
      { kind: "p", text: "The AIC standard turns these safeguards into 44 requirements an assessor can test, from a named accountable person for each system (HU-1) to a correction route an ordinary person can find (CO-2) and reasons that match the real drivers of a decision (EX-5). It is published in full, and AIC Aware is a free ten-minute self-assessment against it." },
    ],
    faq: [
      { q: "Does section 71 ban AI in credit or hiring decisions?", a: "No. It restricts decisions made solely by automated processing that profile a person, and allows them under a contract or a law or code of conduct when appropriate safeguards are in place." },
      { q: "Is a human signing off enough to take a decision outside section 71?", a: "Only if the human genuinely considers the decision and can change it. A sign-off that never disagrees with the system is unlikely to count as meaningful human involvement." },
      { q: "Who enforces section 71?", a: "The Information Regulator, which can investigate complaints, issue enforcement notices and impose administrative fines of up to R10 million." },
    ],
    sources: [S.popia, S.bowmans, S.regulator, S.fines, S.standard],
    related: ["ai-governance-south-africa", "ai-accountability-checklist", "king-v-ai-governance"],
  },
  {
    slug: "ai-governance-south-africa",
    title: "AI governance in South Africa: what applies in 2026",
    seoTitle: "AI governance in South Africa: the rules in 2026",
    description: "South Africa has no AI Act. Here is what does govern AI in 2026: POPIA, King V, sector regulators, the withdrawn draft AI policy, and the EU AI Act for exporters.",
    question: "What laws govern AI in South Africa?",
    answer: "South Africa has no dedicated AI law in 2026, and the draft National AI Policy was withdrawn in April 2026. AI is governed by existing law, mainly POPIA and its section 71 on automated decisions, by the King V governance code for boards, by sector regulators in finance and health, and, for companies whose AI reaches Europe, by the EU AI Act.",
    keywords: ["AI governance South Africa", "AI regulation South Africa", "AI law South Africa", "South Africa AI policy", "responsible AI South Africa"],
    updated: "2026-10-07",
    readMinutes: 8,
    body: [
      { kind: "h2", id: "no-ai-act", text: "There is no AI Act, and the draft policy was withdrawn" },
      { kind: "p", text: "The Department of Communications and Digital Technologies published a Draft National AI Policy for comment on 10 April 2026. On 26 April the Minister withdrew it, after checks confirmed its reference list contained fictitious sources, most plausibly AI-generated citations included without verification. There is therefore no national AI policy or AI-specific statute in force. That does not leave AI unregulated: existing law already reaches most of what AI systems do to people." },
      { kind: "h2", id: "popia", text: "POPIA: the law that already applies" },
      { kind: "p", text: "The Protection of Personal Information Act governs any processing of personal information, which covers most AI systems that touch customers or staff. Its conditions on lawful processing, security safeguards (section 19) and data subject rights all apply. Section 71 goes further for automated decisions: a decision with legal or substantial effect may not be based solely on automated profiling unless a contract or a law or code of conduct applies and safeguards are in place." },
      { kind: "h2", id: "king-v", text: "King V: what boards are expected to oversee" },
      { kind: "p", text: "King V, published on 31 October 2025, applies to financial years beginning on or after 1 January 2026. Its principle on data, information and technology expects the governing body to oversee AI against values including accountability, transparency and explainability, to ensure clear accountability for AI outputs and outcomes, and to scale human oversight and override to the risk. It comes with a disclosure template. King V is voluntary, but JSE listing requirements and investor expectations make it the reference for listed and many large private companies." },
      { kind: "h2", id: "sectors", text: "Sector rules" },
      { kind: "list", items: [
        "Financial services: the FSCA and the Prudential Authority expect firms to manage model, conduct and cyber risk, including through their 2024 joint standard on cybersecurity and cyber resilience. Credit and insurance decisions are where section 71 bites hardest.",
        "Health: clinical decision support sits under health professions rules and, where it is a medical device, device regulation.",
        "Employment: AI used in hiring, performance or dismissal is exposed to employment equity and labour law as well as POPIA.",
      ] },
      { kind: "h2", id: "eu", text: "The EU AI Act, for anyone whose AI reaches Europe" },
      { kind: "p", text: "The EU AI Act applies to providers and deployers anywhere in the world when an AI system's output is used in the EU. Prohibited practices have applied since February 2025 and rules for general-purpose models since August 2025. Obligations for high-risk systems such as credit scoring and recruitment now apply from 2 December 2027, after the Digital Omnibus moved them." },
      { kind: "h2", id: "what-to-do", text: "What a South African organisation should do now" },
      { kind: "steps", items: [
        { title: "List your AI", text: "Every system that makes or shapes a decision about a person, including tools bought in and AI inside software you already use." },
        { title: "Name who answers for each", text: "A person, not a department, with the authority to override it." },
        { title: "Check the section 71 safeguards", text: "Disclosure before the decision, a real reason, a route to contest it, and someone who answers." },
        { title: "Keep evidence as you go", text: "Boards under King V, insurers and the Information Regulator will ask for evidence, not intentions." },
      ] },
    ],
    faq: [
      { q: "Does South Africa have an AI law?", a: "Not in 2026. The draft National AI Policy was withdrawn in April 2026. AI is governed by existing law, chiefly POPIA, plus King V for governance and sector regulators." },
      { q: "Is King V mandatory?", a: "King V is a voluntary code, applied on an apply-and-explain basis, but it is the reference for listed companies and many large organisations, and it expects boards to oversee AI." },
      { q: "Does the EU AI Act apply to South African companies?", a: "It can. It applies when an AI system's output is used in the EU, whoever provides or deploys it." },
    ],
    sources: [S.aiPolicy, S.popia, S.kingV, S.omnibus, S.regulator],
    related: ["popia-section-71-automated-decisions", "king-v-ai-governance", "eu-ai-act-south-african-companies"],
  },
  {
    slug: "king-v-ai-governance",
    title: "King V and AI: what boards must now oversee",
    seoTitle: "King V and AI governance: what boards must oversee",
    description: "King V expects boards to govern AI: accountability for outputs, oversight scaled to risk, and disclosure. What that means and how to evidence it.",
    question: "What does King V say about AI governance?",
    answer: "King V, which applies to financial years starting on or after 1 January 2026, expects the board to govern technology so it is effective, compliant and ethical. For AI specifically, it expects clear accountability for AI outputs and outcomes, human oversight and override scaled to risk, and adherence to values such as accountability, transparency and explainability, reported through a disclosure template.",
    keywords: ["King V AI", "King V governance AI", "board AI oversight South Africa", "King V principle 10", "King V disclosure"],
    updated: "2026-10-07",
    readMinutes: 6,
    body: [
      { kind: "h2", id: "when", text: "When King V applies" },
      { kind: "p", text: "The Institute of Directors in South Africa and the King Committee published King V on 31 October 2025. It replaces King IV for financial years beginning on or after 1 January 2026, with early adoption encouraged, and reduces the principles from 17 to 13." },
      { kind: "h2", id: "ai", text: "What it asks of boards on AI" },
      { kind: "list", items: [
        "Govern data, information and technology so they support the organisation's strategy.",
        "Make sure technology is acquired, developed and used in a way that is effective, compliant and ethical.",
        "Oversee AI against values including human centricity, accountability, transparency and explainability.",
        "Ensure clear accountability for AI outputs and outcomes, with human oversight and override mechanisms scaled to risk.",
        "Assess emerging technologies against the organisation's existing risk appetite and tolerance.",
      ] },
      { kind: "p", text: "Commentators have summed up the shift as boards needing to be technologically literate, not only financially literate. The board may delegate this work to a risk or technology committee, but it keeps the accountability." },
      { kind: "h2", id: "disclosure", text: "Disclosure" },
      { kind: "p", text: "A disclosure template accompanies the code, and the governing body approves what goes into it. In practice that means a board will be asked what AI the organisation uses, who is accountable for it and how oversight works, and will need evidence to answer." },
      { kind: "h2", id: "evidence", text: "Turning the principle into evidence" },
      { kind: "steps", items: [
        { title: "An AI register", text: "Every system that makes or shapes consequential decisions, kept current. Without it the board cannot know what it oversees." },
        { title: "A named person for each system", text: "Accountability for outputs means a person, with the authority to override, not a committee." },
        { title: "Override that works and is used", text: "A mechanism nobody ever uses is not oversight. Records of overrides, and the reasons, show it is real." },
        { title: "A record over time", text: "Board reporting is stronger when it rests on a continuous record rather than a point-in-time attestation." },
      ] },
      { kind: "note", text: "King V is voluntary and applied on an apply-and-explain basis. It supplements law, it does not replace it: POPIA and sector rules still apply in full." },
    ],
    faq: [
      { q: "Does King V mention AI directly?", a: "Yes. Its principle on data, information and technology expects boards to oversee AI, ensure accountability for AI outputs and outcomes, and scale human oversight to risk." },
      { q: "When does King V take effect?", a: "For financial years beginning on or after 1 January 2026. Early adoption is encouraged." },
    ],
    sources: [S.kingV, S.popia],
    related: ["ai-governance-south-africa", "ai-accountability-checklist", "popia-section-71-automated-decisions"],
  },
  {
    slug: "eu-ai-act-south-african-companies",
    title: "Does the EU AI Act apply to South African companies?",
    seoTitle: "Does the EU AI Act apply to South African companies?",
    description: "The EU AI Act reaches firms outside Europe when their AI's output is used in the EU. Who in South Africa is in scope, the dates, and what to do first.",
    question: "Does the EU AI Act apply to companies in South Africa?",
    answer: "It can. The EU AI Act applies to providers and deployers anywhere in the world when an AI system's output is used in the EU, and to anyone placing AI on the EU market. A South African firm serving EU customers, running AI for an EU subsidiary or selling AI products into Europe is likely in scope. High-risk obligations now apply from 2 December 2027.",
    keywords: ["EU AI Act South Africa", "EU AI Act extraterritorial", "EU AI Act non-EU companies", "EU AI Act high-risk deadline 2027", "Digital Omnibus AI Act"],
    updated: "2026-10-07",
    readMinutes: 6,
    body: [
      { kind: "h2", id: "scope", text: "Who is in scope outside Europe" },
      { kind: "p", text: "The Act reaches beyond the EU in the same way the GDPR does. It applies to providers who place AI systems on the EU market, and to providers and deployers located outside the EU where the output of the AI system is used in the EU. Importers, distributors and authorised representatives are covered too." },
      { kind: "list", items: [
        "A South African lender or insurer that scores EU residents.",
        "A software company that sells an AI product to European customers.",
        "A group whose South African shared-services centre runs AI for an EU subsidiary.",
        "A recruiter screening candidates for roles in the EU.",
      ] },
      { kind: "h2", id: "dates", text: "The dates, after the Digital Omnibus" },
      { kind: "list", items: [
        "2 February 2025: prohibited practices banned, and general provisions in force.",
        "2 August 2025: rules for general-purpose AI models, governance and penalties.",
        "2 December 2026: new bans on AI-generated non-consensual intimate imagery and child sexual abuse material, and the end of the shortened grace period for marking AI-generated content.",
        "2 December 2027: obligations for stand-alone high-risk systems, such as credit scoring, recruitment and education (Annex III).",
        "2 August 2028: obligations for high-risk AI embedded in regulated products such as medical devices (Annex I).",
      ] },
      { kind: "p", text: "The Digital Omnibus, Regulation (EU) 2026/1744, moved the high-risk dates and entered into force on 27 July 2026. The underlying requirements did not change." },
      { kind: "h2", id: "first", text: "What to do first" },
      { kind: "steps", items: [
        { title: "Map where your AI's output lands", text: "Which systems produce decisions or content used by people in the EU." },
        { title: "Classify each system", text: "Prohibited, high-risk, limited-risk (transparency duties) or minimal risk." },
        { title: "Start the high-risk evidence early", text: "Risk management, data governance, logging, human oversight and documentation take longer to build than to describe." },
        { title: "Reuse what POPIA already makes you do", text: "Human oversight, explanation and a route to contest decisions overlap heavily with POPIA section 71." },
      ] },
    ],
    faq: [
      { q: "When do EU AI Act high-risk rules apply?", a: "From 2 December 2027 for stand-alone high-risk systems such as credit scoring and recruitment, and 2 August 2028 for AI in regulated products, following the Digital Omnibus." },
      { q: "Does a South African company need an EU representative?", a: "Providers outside the EU placing high-risk systems on the EU market generally must appoint an authorised representative in the EU. Check your role and system under the Act." },
    ],
    sources: [S.aiAct, S.omnibus],
    related: ["ai-governance-south-africa", "popia-section-71-automated-decisions", "iso-42001-south-africa"],
  },
  {
    slug: "iso-42001-south-africa",
    title: "ISO/IEC 42001 in South Africa: what it is, and how AIC differs",
    seoTitle: "ISO/IEC 42001 in South Africa explained",
    description: "ISO/IEC 42001 is the management system standard for AI. What it covers, how certification to it works in South Africa, and how it differs from AIC certification.",
    question: "What is ISO/IEC 42001 and how do you get certified in South Africa?",
    answer: "ISO/IEC 42001:2023 is the international standard for an AI management system: the policies, roles, risk processes and controls an organisation uses to govern AI. Certification to it is issued by certification bodies accredited for that standard, in South Africa through SANAS. It certifies that the management system exists and works, which is different from AIC, which certifies that a named person stays accountable for specific automated decisions.",
    keywords: ["ISO 42001 South Africa", "ISO/IEC 42001 certification", "AI management system standard", "ISO 42001 vs", "AI certification South Africa"],
    updated: "2026-10-07",
    readMinutes: 6,
    body: [
      { kind: "h2", id: "what", text: "What ISO/IEC 42001 is" },
      { kind: "p", text: "Published in 2023, ISO/IEC 42001 sets out requirements for an artificial intelligence management system. Like ISO 27001 for information security, it is about the system an organisation runs: leadership commitment, an AI policy, defined roles, risk and impact assessment, controls (in its Annex A), monitoring, internal audit and continual improvement." },
      { kind: "h2", id: "certification", text: "How certification works" },
      { kind: "p", text: "Certification to ISO/IEC 42001 is done by a certification body accredited to audit that standard. In South Africa, accreditation is the work of SANAS, the South African National Accreditation System. Before you appoint a certification body, ask to see that ISO/IEC 42001 is within its accredited scope; a certificate from a body that is not accredited for the standard carries far less weight." },
      { kind: "h2", id: "difference", text: "How it differs from AIC" },
      { kind: "list", items: [
        "ISO/IEC 42001 certifies a management system across the organisation. AIC certifies something narrower and sharper: that for each consequential AI system, a named person remains accountable for its decisions.",
        "ISO/IEC 42001 is largely about having the right processes. The AIC standard tests outcomes too: that overrides happen, that reasons match the real drivers of decisions, and that affected people can contest a decision and get an answer.",
        "AIC is not an ISO/IEC 42001 certification body and does not issue ISO certificates. Its standard maps to ISO/IEC 42001, so evidence gathered for one helps with the other.",
      ] },
      { kind: "note", text: "AIC is itself not yet accredited. Its accreditation status and roadmap are published on the disclosures page." },
      { kind: "h2", id: "which", text: "Which do you need?" },
      { kind: "p", text: "Organisations that need to show a mature, organisation-wide AI governance system to customers or regulators abroad often want ISO/IEC 42001. Organisations whose exposure is in specific decisions about people, such as credit, claims, hiring and pricing, need to show accountability for those decisions, which is what POPIA section 71 and the AIC standard address. Many will want both, built on one set of evidence." },
    ],
    faq: [
      { q: "Is ISO 42001 certification mandatory in South Africa?", a: "No. It is voluntary, though customers, partners and regulators may ask for it." },
      { q: "Does AIC issue ISO 42001 certificates?", a: "No. AIC certifies against its own published standard, which maps to ISO/IEC 42001. ISO certificates come from certification bodies accredited for that standard." },
    ],
    sources: [S.iso42001, S.sanas, S.standard],
    related: ["ai-governance-south-africa", "ai-accountability-checklist", "eu-ai-act-south-african-companies"],
  },
  {
    slug: "ai-accountability-checklist",
    title: "AI accountability checklist: 12 questions an assessor will ask",
    seoTitle: "AI accountability checklist: 12 assessor questions",
    description: "Twelve questions that test whether a person really answers for your AI decisions: inventory, override, explanation, fairness, correction and disclosure.",
    question: "How do you check whether your AI decisions are accountable?",
    answer: "Ask whether you can name every AI system that decides things about people, the person accountable for each, and show that their override works and is used. Then test whether each decision gives a true reason, whether people can contest it and get an answer, and whether they were told AI was involved before it affected them.",
    keywords: ["AI audit checklist", "AI accountability checklist", "AI governance checklist", "responsible AI checklist", "AI risk assessment questions"],
    updated: "2026-10-07",
    readMinutes: 8,
    body: [
      { kind: "p", text: "Each question below maps to requirements in the published AIC standard. They are written as an assessor would ask them: what you can show, not what your policy says." },
      { kind: "h2", id: "people", text: "Who is accountable" },
      { kind: "steps", items: [
        { title: "Can you list every AI system that makes or shapes a consequential decision?", text: "Including bought-in tools and AI inside software you already use. A register that misses shadow AI fails the rest of the list. (HU-3, HU-10)" },
        { title: "Is a person, not a role, named for each one, and have they accepted it?", text: "A named individual who has signed to say so. (HU-1, HU-2)" },
        { title: "Can that person describe how the system works today without checking with someone?", text: "Needing to ask is itself a finding. (HU-11)" },
      ] },
      { kind: "h2", id: "oversight", text: "Whether oversight is real" },
      { kind: "steps", items: [
        { title: "Does the override work in production, and does it ask for a reason?", text: "Demonstrated live, with the reason stored. (HU-4, HU-5, HU-6)" },
        { title: "Has it been used?", text: "Zero overrides across a large volume of decisions is not a pass; it means nobody is really looking. (HU-7)" },
      ] },
      { kind: "h2", id: "explanation", text: "Whether reasons are true" },
      { kind: "steps", items: [
        { title: "Is there a plain-language explanation for each decision, kept and retrievable?", text: "One a person can be given on request. (EX-1 to EX-4)" },
        { title: "Does the stated reason match what actually drove the decision?", text: "A reason that differs from the dominant feature is post-hoc rationalisation, a critical finding. (EX-5)" },
      ] },
      { kind: "h2", id: "fairness", text: "Whether outcomes are fair" },
      { kind: "steps", items: [
        { title: "Has disparate impact been tested recently, including across combinations of attributes?", text: "With a ratio of at least 0.8 across tested characteristics, and proxies identified. (EM-6 to EM-8, EM-10)" },
      ] },
      { kind: "h2", id: "correction", text: "Whether people can contest it" },
      { kind: "steps", items: [
        { title: "Can an ordinary person find the route to contest a decision?", text: "Not just someone who already knows it exists. (CO-1, CO-2)" },
        { title: "Do you meet your own response time, and do upheld challenges change the outcome?", text: "Measured, logged and traceable, with a named person responsible. (CO-3 to CO-5, CO-8, CO-9)" },
      ] },
      { kind: "h2", id: "disclosure", text: "Whether people were told" },
      { kind: "steps", items: [
        { title: "Were people told AI was involved, specifically and before it affected them?", text: "A generic clause in terms and conditions accepted at sign-up generally fails for a decision made later. (TR-2 to TR-5)" },
      ] },
      { kind: "note", text: "AIC Aware asks a short version of these questions and gives you a free result in about ten minutes." },
    ],
    faq: [
      { q: "How often should AI accountability be checked?", a: "Continuously where possible. Point-in-time audits miss drift; a record kept over time shows whether oversight held between audits." },
      { q: "What is a good disparate impact ratio?", a: "The AIC standard uses at least 0.8 across tested protected characteristics, the widely used four-fifths rule, and expects intersectional analysis too." },
    ],
    sources: [S.standard, S.popia, S.ibm],
    related: ["popia-section-71-automated-decisions", "king-v-ai-governance", "iso-42001-south-africa"],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

/** Plain text of a guide, for word counts and feeds. */
export function guideText(g: Guide): string {
  return [g.answer, ...g.body.map((b) => ("text" in b ? b.text : "items" in b ? (b.items as (string | { title: string; text: string })[]).map((i) => (typeof i === "string" ? i : `${i.title} ${i.text}`)).join(" ") : ""))].join(" ");
}
