// What the AIC platform (app.aiccertified.cloud) does, for the website.
//
// Mirrors the platform's own navigation (app/components/workspace/nav.ts) and
// connector catalogue (lib/connectors/catalog.ts, lib/integrations) in the
// platform repo. Only what exists is listed. Anything marked "soon" there is
// left out here rather than advertised.

export const PLATFORM_URL = (process.env.NEXT_PUBLIC_PLATFORM_URL || "https://app.aiccertified.cloud").replace(/\/+$/, "");

export interface PlatformFeature {
  name: string;
  what: string;
}

export interface PlatformArea {
  id: string;
  name: string;
  summary: string;
  features: PlatformFeature[];
}

export const PLATFORM_AREAS: PlatformArea[] = [
  {
    id: "overview",
    name: "AI overview",
    summary: "What you run, what it decided, and who answered for it.",
    features: [
      { name: "Dashboard", what: "Your AI exposure at a glance: systems, decisions, spend, and what needs you this week." },
      { name: "AI estate", what: "Every AI system you run, what it is for, and the named person accountable for it." },
      { name: "Decision log", what: "Decisions your systems record through the API, the ones a person overrode, and who made the call." },
      { name: "AI spend", what: "What you spend on AI models, by provider, model and system, read from your provider accounts." },
      { name: "Continuity record", what: "The standing record of your AI estate and every change to it, kept so it cannot be quietly rewritten." },
    ],
  },
  {
    id: "compliance",
    name: "Compliance tracking",
    summary: "The frameworks that apply to you, and the evidence against each requirement.",
    features: [
      { name: "Frameworks", what: "Choose which frameworks you track, from the list below, or add your own." },
      { name: "Controls", what: "Each requirement, and the evidence behind it. Evidence is collected once and counts for every framework it supports." },
      { name: "Connected systems", what: "AIC reads your systems every night with read-only access and records what changed." },
      { name: "Automated checks", what: "What AIC found in your connected systems, why it matters, and the steps to fix it." },
      { name: "Evidence vault", what: "The evidence you have filed, against the requirements for your Division." },
      { name: "Policies", what: "Your policies, the version in force, and who has accepted it." },
      { name: "Policy against practice", what: "Where what your policies promise and what your systems show disagree." },
      { name: "Incidents and findings", what: "AI incidents and how each was resolved, and your assessor’s findings with your corrective actions." },
    ],
  },
  {
    id: "risk",
    name: "Risk and people",
    summary: "What could go wrong, who holds your data, who has access, and who is trained.",
    features: [
      { name: "Risk register", what: "What could go wrong, how bad it would be and who owns it, with risks suggested from what your connected systems show." },
      { name: "Suppliers", what: "Who holds your data or runs part of your service, their documents, and when you last checked them." },
      { name: "People", what: "Joiners and leavers from your HR system, matched to the accounts they hold." },
      { name: "Access reviews", what: "Confirm, person by person, who still needs each account." },
      { name: "Training", what: "Security, POPIA and AI modules, and who has completed them." },
    ],
  },
  {
    id: "certification",
    name: "AIC certification",
    summary: "Where you stand against the AIC standard, and what you can show others.",
    features: [
      { name: "AIC Aware", what: "Declare your AI awareness and hold a badge anyone can verify. Self-declared, and labelled as such." },
      { name: "Your certificate", what: "Your current status, and what stands between you and the next stage." },
      { name: "Trust page", what: "A public page for your customers, live from your record rather than written once and left." },
      { name: "Questionnaires", what: "Answer a buyer’s security questionnaire from your record instead of from memory." },
      { name: "Correspondence", what: "Messages with your assessor, kept on the record." },
    ],
  },
];

/** Frameworks the platform tracks. Mirrors lib/frameworks/data in the platform. */
export const TRACKED_FRAMEWORKS: { name: string; where: string }[] = [
  { name: "POPIA", where: "South Africa" },
  { name: "EU AI Act", where: "European Union" },
  { name: "GDPR", where: "European Union" },
  { name: "NIS2", where: "European Union" },
  { name: "DORA", where: "European Union" },
  { name: "ISO/IEC 42001", where: "International" },
  { name: "ISO/IEC 27001", where: "International" },
  { name: "NIST AI RMF", where: "United States" },
  { name: "NIST CSF 2.0", where: "United States" },
  { name: "SOC 2", where: "United States" },
  { name: "US Data Privacy", where: "United States" },
  { name: "HIPAA", where: "United States" },
  { name: "HITRUST CSF", where: "United States" },
  { name: "CRI Profile", where: "Financial sector" },
  { name: "CMMC Level 1", where: "United States" },
  { name: "FedRAMP", where: "United States" },
  { name: "CJIS Security Policy", where: "United States" },
  { name: "Cyber Essentials", where: "United Kingdom" },
  { name: "Essential Eight", where: "Australia" },
  { name: "CPS 234", where: "Australia" },
];

/** Systems AIC can read. Mirrors the platform's integrations and connector catalogue. */
export const CONNECTOR_GROUPS: { group: string; names: string[] }[] = [
  { group: "AI providers", names: ["OpenAI", "Anthropic"] },
  { group: "Code", names: ["GitHub", "GitLab", "Bitbucket", "Snyk"] },
  { group: "Cloud", names: ["Amazon Web Services", "Google Cloud", "Microsoft Azure", "Cloudflare", "Datadog"] },
  { group: "Identity and passwords", names: ["Microsoft 365", "Google Workspace", "Okta", "1Password"] },
  { group: "Devices and security", names: ["Microsoft Intune", "Jamf Pro", "Kandji", "CrowdStrike Falcon"] },
  { group: "People", names: ["BambooHR", "HiBob", "Personio", "Deel", "Rippling"] },
  { group: "Work and customers", names: ["Jira", "Linear", "Zendesk", "Slack", "Salesforce"] },
];
