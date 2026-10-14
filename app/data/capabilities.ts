/**
 * What the AIC platform does, one page per capability (/platform/[slug]).
 *
 * Rules for editing: describe only what the platform does today; every claim
 * about a law or standard names it precisely; no figures about outcomes. The
 * platform is a tool: using it neither raises nor lowers the chance of
 * certification, and each page says so where it matters.
 */

export type Capability = {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  lede: string;
  points: { title: string; text: string }[];
  answersTo: string[];
  related: string[];
};

export const CAPABILITIES: Capability[] = [
  {
    slug: "ai-register",
    name: "AI register",
    seoTitle: "AI register for POPIA section 71 and ISO 42001",
    description: "Keep a live register of every AI system that decides about people: what it decides, who answers for it, which supplier provides it, and what is missing.",
    lede: "Every system that makes or shapes a decision, what it decides, whether that decision is about a person, and the named person who answers for it.",
    points: [
      { title: "What it decides, in plain words", text: "Each system records the decision it makes and who it affects. A system that decides about people switches on the POPIA section 71 questions and the human oversight requirements of the AIC standard." },
      { title: "A person, not a department", text: "Every system has an accountable owner who is a named member of your organisation. When that person leaves, the register says so and asks you to hand the system over." },
      { title: "Found in your record", text: "AIC flags systems that appear in your connected data but not on your register. Shadow AI shows up instead of hiding." },
      { title: "Bought-in AI counts", text: "A system can name the supplier that provides it, so the CV screener or the credit bureau score is on the register with the models you built yourself." },
      { title: "Gaps, stated", text: "Each system lists what it still lacks: no owner, no described decision, or a system deciding about people with no risk recorded against it." },
    ],
    answersTo: ["POPIA section 71: knowing which decisions are based solely on automated processing", "ISO/IEC 42001: an inventory of AI systems within the management system's scope", "EU AI Act: identifying systems that fall in the high-risk categories", "AIC standard, Human Agency requirements (HU)"],
    related: ["risk-management", "supplier-ai-review", "decision-log"],
  },
  {
    slug: "risk-management",
    name: "AI risk management",
    seoTitle: "AI risk register and risk management",
    description: "A risk register built for AI decisions about people: likelihood and impact, owners, treatment, review dates, and risks raised from what your connected systems show.",
    lede: "What could go wrong, how likely it is, how bad it would be, who owns it, and whether the evidence says it is getting better or worse.",
    points: [
      { title: "Scored the usual way", text: "Likelihood and impact from one to five, an inherent score, a target once treated, and a current score that rises when the evidence behind a risk is failing." },
      { title: "A library to start from", text: "Ready-made scenarios for AI decisions about people, such as unfair outcomes across groups or reviewers who approve without looking, alongside the core security risks." },
      { title: "AIC notices first", text: "Failing checks, undeclared systems, leavers who still have access and model retirements are raised as suggested risks, with the evidence, for you to add or dismiss with a reason." },
      { title: "Owned and reviewed", text: "Every risk has an owner and a review date set by its score. Overdue reviews and risks without an owner are counted where you will see them." },
      { title: "Tied to the system", text: "A risk can name the AI system it concerns, so each system on the register shows its open risks, and each risk shows its system." },
    ],
    answersTo: ["ISO/IEC 42001 clause 6.1: actions to address risks and opportunities, including AI risk assessment", "EU AI Act Article 9: a risk management system for high-risk AI", "King V: risk governance by the governing body", "NIST AI RMF: the Map and Manage functions"],
    related: ["ai-register", "evidence-packs", "integrations"],
  },
  {
    slug: "supplier-ai-review",
    name: "Supplier AI review",
    seoTitle: "Supplier and vendor AI risk review",
    description: "Review the AI inside the software you buy. Ask suppliers five questions with a link, record their answers, and see what that means for decisions you answer for.",
    lede: "If a supplier's AI decides about your customers or staff, you still answer for that decision. Find out how it behaves, in writing, from the supplier.",
    points: [
      { title: "A supplier register first", text: "Who holds your data or runs part of your service, how much rides on them, whether a data processing agreement is signed, whether data leaves South Africa, and when you last reviewed them." },
      { title: "Five questions about their AI", text: "Do they train on your data, can you override an individual decision, can they explain one, have they tested for unfair outcomes in the last year, and will they tell you before the model changes." },
      { title: "Ask the supplier directly", text: "Send a link to the person at the supplier who knows. They answer without an account. Nothing changes on your record until you read their answers and choose to apply them." },
      { title: "What it means for you", text: "Answers that leave you unable to override, explain or test a decision about a person are raised as concerns, in plain words." },
      { title: "Their documents, read", text: "Upload a SOC 2 report, ISO 27001 certificate, penetration test or data processing agreement, and AIC lists what it found for you to check." },
    ],
    answersTo: ["POPIA section 21: written agreements with operators who process personal information for you", "POPIA section 71: decisions made by a supplier's system on your behalf", "ISO/IEC 42001: third-party and customer relationships", "AIC standard, Explanation (EX) and Empathy (EM) requirements"],
    related: ["ai-register", "risk-management", "evidence-packs"],
  },
  {
    slug: "decision-log",
    name: "Decision log",
    seoTitle: "AI decision log and human review API",
    description: "Record what your AI decides from the systems that decide it, hold a decision for a named person to review, and keep every override with its reason.",
    lede: "The evidence that a person was really in the loop: each decision, the ones held for review, the overrides, and who made them.",
    points: [
      { title: "Logged where it happens", text: "Your systems send each consequential decision to AIC with an API key: what was decided, on what, and the reason given." },
      { title: "Held for a person", text: "Mark a decision for review and it waits for a named person to approve or override it before you act. Your system polls, or AIC calls back with a signed message." },
      { title: "Overrides belong to people", text: "A key identifies a system, not a person, so it cannot record an override. The person who changed the outcome records it while signed in." },
      { title: "Rubber-stamping shows", text: "The override rate and its sample size sit at the top of the platform. A large volume of decisions with no overrides at all is a question, not a pass." },
    ],
    answersTo: ["POPIA section 71: a person's opportunity to make representations about an automated decision", "EU AI Act Article 14: human oversight of high-risk AI", "UK GDPR Articles 22A to 22D: safeguards for automated decisions", "AIC standard, Human Agency (HU) and Correction (CO) requirements"],
    related: ["ai-register", "evidence-packs", "api-and-mcp"],
  },
  {
    slug: "evidence-packs",
    name: "Evidence packs and record shares",
    seoTitle: "Sealed AI evidence packs for boards and insurers",
    description: "Share your AI record with an assessor, board or insurer: live with a link only the named person can open, or as a fingerprinted pack anyone can check matches the record AIC holds.",
    lede: "Two ways to show your record to someone outside the organisation, both built so a change to the record is evident.",
    points: [
      { title: "Live, for one named person", text: "Share a period of your continuity record with a named reader. They confirm their email with a one-time code, the record is watermarked with their name, every view is logged, and you can withdraw the link." },
      { title: "Sealed, for a file they keep", text: "An evidence pack copies your AI register, accountable person, open risks, check results, framework coverage, decision and override counts and suppliers for a period, and fingerprints it with SHA-256." },
      { title: "Tamper-evident", text: "Once made, a pack is locked in the application. Any change to it would no longer match its SHA-256 fingerprint." },
      { title: "Checkable without an account", text: "Whoever holds the file can check it matches the record AIC holds, without an account. The file never leaves their computer; only its fingerprint is checked." },
    ],
    answersTo: ["King V: evidence for the governing body's oversight of technology and AI", "Insurers: underwriting and renewal evidence", "ISO/IEC 42001: documented information as evidence", "Assessments against the AIC standard"],
    related: ["risk-management", "decision-log", "trust-page"],
  },
  {
    slug: "trust-page",
    name: "Trust page",
    seoTitle: "Public AI trust page for your customers",
    description: "A public page for your customers, live from your record, that separates what AIC issued, what AIC observed and what you declared.",
    lede: "Show customers how you use AI responsibly, without overclaiming. Every line says who stands behind it.",
    points: [
      { title: "Three kinds of statement", text: "Each item is labelled as issued by AIC, such as a certificate or AIC Aware badge, observed by AIC from your connected systems, or declared by you. Readers can tell the difference." },
      { title: "Live, not a brochure", text: "The page reads your record when someone opens it, so it cannot drift from the truth." },
      { title: "You choose what shows", text: "Badge, certificate, accountable person, policies, frameworks, monitoring and systems: switch each on or off." },
    ],
    answersTo: ["AIC standard, Truth requirements (TR): telling people when AI is involved", "POPIA openness: information people can find without asking"],
    related: ["evidence-packs", "questionnaires", "ai-register"],
  },
  {
    slug: "questionnaires",
    name: "Questionnaires",
    seoTitle: "Answer AI and security questionnaires from your record",
    description: "Answer a buyer's or insurer's AI and security questionnaire from what your record already holds, with every answer approved by a person before it goes.",
    lede: "The questions customers and insurers ask, answered from your policies, checks, AI register and decision log, with the gaps flagged instead of guessed.",
    points: [
      { title: "Drafted from the record", text: "Answers are drafted from your policies, automated checks, AI inventory, decision log and certificates, with the source of each answer shown." },
      { title: "Gaps flagged, not filled", text: "Where the record cannot answer a question, the item is marked as needing your input rather than given a confident guess." },
      { title: "A person approves", text: "Nothing is final until someone in your organisation approves each answer. Then export the set." },
    ],
    answersTo: ["Customer due diligence and supplier reviews", "Insurer proposal forms"],
    related: ["trust-page", "evidence-packs", "supplier-ai-review"],
  },
  {
    slug: "api-and-mcp",
    name: "Read API and MCP server",
    seoTitle: "AI governance API and MCP server",
    description: "Let your own dashboards and AI assistants read your AI register, risks, checks and framework coverage through a read-only API and MCP server.",
    lede: "Your record, available to your own tools, without giving anything the power to change it.",
    points: [
      { title: "Read-only by construction", text: "The read API and the MCP server have no write path. Changes stay in the app, where a named person makes them and the oversight log records who." },
      { title: "The views that matter", text: "AI systems and their gaps, open risks, automated check results, coverage of each framework you track, and accountabilities still held by people who have left." },
      { title: "For assistants that speak MCP", text: "Connect an assistant that supports the Model Context Protocol and ask which systems have no owner, or what failed this week. Every tool is marked read-only." },
      { title: "Your key, your control", text: "Access uses an organisation API key you create and can withdraw at any time." },
    ],
    answersTo: ["Internal reporting and dashboards", "AI assistants used by your risk and compliance teams"],
    related: ["decision-log", "ai-register", "integrations"],
  },
];

export const CAPABILITY_BY_SLUG: Record<string, Capability> = Object.fromEntries(CAPABILITIES.map((c) => [c.slug, c]));
