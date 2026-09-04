// AI Integrity Certification — Regulatory Map dataset
//
// Coverage rule: only jurisdictions with a real, publicly identifiable AI-specific
// (or AI-relevant automated-decision-making) regulatory reference point are listed
// here. Everything else on the map is intentionally left uncovered rather than
// filled in with a guess — see the "not yet mapped" state in RegulatoryMap.tsx.
//
// This is a general orientation guide, not legal advice. Status descriptions are
// deliberately high-level (enacted / in force / proposed / voluntary / none
// identified) rather than citing specific articles or clauses we have not verified
// against the primary text. Review date should be bumped whenever this file is
// revisited, and is surfaced on the page itself per the claims-register discipline
// applied to the rest of the site.

/**
 * The oldest verification date across every entry.
 *
 * This is what the page states publicly, because it is the only claim that is
 * true of the whole dataset: "every jurisdiction here has been checked since
 * this date". Displaying the NEWEST date would let one recently-reviewed row
 * vouch for twenty-seven that had not been looked at in months, which is
 * exactly the kind of quiet overclaim this site exists to avoid making.
 */
export function oldestVerification(): string {
  return Object.values(regulatoryData)
    .map((c) => c.verifiedAt)
    .sort()[0];
}

/** The most recent check, for a "last activity" line. Never the headline claim. */
export function newestVerification(): string {
  return Object.values(regulatoryData)
    .map((c) => c.verifiedAt)
    .sort()
    .slice(-1)[0];
}

/** Entries not checked since the given ISO date — the review queue. */
export function stalerThan(isoDate: string): CountryRegulation[] {
  return Object.values(regulatoryData).filter((c) => c.verifiedAt < isoDate);
}

export type RegStatus =
  | "In force"
  | "Enacted — phasing in"
  | "Proposed / draft legislation"
  | "Voluntary framework"
  | "Guidance only"
  | "No dedicated AI law identified";

export interface CountryRegulation {
  /** ISO 3166-1 numeric id — matches world-atlas topojson feature.id */
  id: string;
  region:
    | "North America"
    | "Latin America"
    | "Europe"
    | "Africa"
    | "Middle East"
    | "Asia-Pacific";
  framework: string;
  authority: string;
  status: RegStatus;
  summary: string;
  /** Draft compliance-measures PDF, generated from public framework info. */
  pdfSlug: string;
  /**
   * Depth, for the jurisdictions where AIC actually operates and where anyone
   * will check our work. Deliberately absent elsewhere: 28 shallow entries
   * honestly labelled beat 28 padded ones, and a thin entry on a country
   * nobody asks about costs nothing, while a thin entry on the EU costs the
   * reader we most want.
   */
  detail?: JurisdictionDetail;
  /**
   * ISO date this specific entry was last checked against its primary source.
   *
   * Per-entry rather than one date for the whole file, because a single global
   * date lets a stale row hide behind a fresh one: bumping the header after
   * reviewing three jurisdictions would silently re-date the other twenty-five.
   * It also makes partial review possible — check six, bump those six.
   */
  verifiedAt: string;
}

export interface JurisdictionDetail {
  /** What the instrument actually requires, in plain terms. */
  obligations: string[];
  /** Dates that have already bitten, or are about to. */
  keyDates: { date: string; event: string }[];
  /** Who enforces it, and the ceiling. */
  enforcement: string;
  /** The instrument itself, so a reader can check us rather than trust us. */
  sources: { label: string; url: string }[];
}

// One object shared by every EU member state on the map. The obligations are
// the Regulation's, not each country's, and duplicating them seven times would
// mean seven places to get wrong.
const EU_AI_ACT_DETAIL: JurisdictionDetail = {
  obligations: [
    "Article 5 prohibitions are in force: social scoring, untargeted facial-image scraping, emotion inference in workplaces and schools, and certain biometric categorisation and predictive policing.",
    "Article 50 transparency applies: people must be told when they are interacting with an AI system, and synthetic audio, image, video and text must be marked in a machine-readable way.",
    "General-purpose AI model obligations under Articles 51–56 apply to providers, including technical documentation and copyright policy.",
    "High-risk obligations — risk management, data governance, logging, human oversight, conformity assessment — are deferred, not cancelled. Systems being built now will be in scope on the new dates.",
  ],
  keyDates: [
    { date: "2 Feb 2025", event: "Article 5 prohibitions took effect." },
    { date: "2 Aug 2025", event: "General-purpose AI model obligations took effect." },
    { date: "27 Jul 2026", event: "Digital Omnibus on AI entered into force, amending the Act." },
    { date: "2 Aug 2026", event: "Article 50 transparency obligations took effect." },
    { date: "2 Dec 2026", event: "Grace period closes for marking content from systems already on the market, and for the new prohibition covering non-consensual intimate imagery and CSAM generation." },
    { date: "2 Dec 2027", event: "Annex III standalone high-risk obligations apply — deferred from 2 Aug 2026." },
    { date: "2 Aug 2028", event: "Annex I high-risk obligations for regulated products apply — deferred from 2 Aug 2027." },
  ],
  enforcement:
    "The European AI Office, alongside national market surveillance authorities in each member state. The Omnibus gave the AI Office direct investigation and on-site inspection powers, the ability to accept binding commitments, and the power to impose fines.",
  sources: [
    {
      label: "Regulation (EU) 2024/1689 — the AI Act",
      url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    },
    {
      label: "Regulation (EU) 2026/1744 — Digital Omnibus on AI",
      url: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
    },
  ],
};

const SOUTH_AFRICA_DETAIL: JurisdictionDetail = {
  obligations: [
    "A decision producing legal consequences, or affecting someone to a substantial degree, may not be based solely on automated processing — this expressly covers profiling of work performance, creditworthiness, reliability, location, health, personal preferences and conduct.",
    "The prohibition lifts where the decision is made in connection with a contract and either the data subject's request has been met or appropriate safeguards are in place, or where a law provides safeguards.",
    "Where an automated decision is permitted, the data subject must be given an opportunity to make representations about it.",
    "The responsible party must supply sufficient information about the underlying logic of the processing for that response to be meaningful — which is, in practice, an explainability duty.",
  ],
  keyDates: [
    { date: "1 Jul 2021", event: "POPIA compliance deadline passed; the Act applies in full." },
    { date: "10 Apr 2026", event: "Draft National AI Policy gazetted." },
    { date: "12 Jun 2026", event: "Draft National AI Policy withdrawn in its entirety." },
  ],
  enforcement:
    "The Information Regulator. Administrative fines reach R10 million; serious offences carry up to R10 million and/or 10 years' imprisonment. The Regulator has begun issuing administrative fines in practice rather than only enforcement notices.",
  sources: [
    {
      label: "POPIA section 71 — automated decision making",
      url: "https://popia.co.za/section-71-automated-decision-making/",
    },
  ],
};

const UK_DETAIL: JurisdictionDetail = {
  obligations: [
    "No dedicated AI statute and no AI-specific obligations. Existing law applies unchanged: data protection, equality, consumer, financial services and sectoral safety rules all reach AI systems already.",
    "Five non-statutory principles guide regulators — safety and robustness, transparency and explainability, fairness, accountability and governance, and contestability and redress.",
    "Obligations arrive through your sector regulator rather than through an AI law, so the compliance question is which regulator you already answer to.",
  ],
  keyDates: [
    { date: "2023", event: "AI White Paper set out the five cross-sectoral principles, on a non-statutory basis." },
    { date: "4 Jun 2026", event: "An AI Regulation Bill was debated in the House of Lords; the Government's own proposals for the most capable models have not yet been introduced." },
  ],
  enforcement:
    "No single AI regulator. The ICO, FCA, PRA, CMA, Ofcom, MHRA, HSE and NCSC each apply their existing powers and penalties within their own remit.",
  sources: [
    {
      label: "CMS AI Regulation Scanner — United Kingdom",
      url: "https://cms.law/en/int/expert-guides/ai-regulation-scanner/united-kingdom",
    },
  ],
};

const US_DETAIL: JurisdictionDetail = {
  obligations: [
    "No binding federal AI statute. Congress has not preempted state AI law, and previous attempts to do so have failed.",
    "The NIST AI Risk Management Framework is voluntary. It is the de facto national reference and is what most US procurement language points at, but nothing makes it mandatory.",
    "Binding obligations come from states, and the state picture is actively unsettled rather than merely fragmented — the leading example was repealed and rewritten in 2026.",
    "Sector regulators (FTC, EEOC, financial and health regulators) apply existing law to AI, which is where most live enforcement risk actually sits.",
  ],
  keyDates: [
    { date: "14 May 2026", event: "Colorado repealed its original AI Act (SB 24-205) and replaced it with SB 26-189, dropping mandatory risk-management programmes, impact assessments and the standalone anti-discrimination duty." },
    { date: "1 Jan 2027", event: "Colorado's replacement law takes effect — consumer notice for consequential automated decisions, adverse-outcome disclosure within 30 days, and three-year record retention. Enforcement depends on Attorney General rulemaking, currently subject to a court stay." },
  ],
  enforcement:
    "State attorneys general for state AI statutes; federal sector regulators under existing authority. A federal executive order has directed the Justice Department to challenge state AI laws and threatened federal broadband funding over them, so the preemption question is live and unresolved.",
  sources: [
    {
      label: "NIST AI Risk Management Framework",
      url: "https://www.nist.gov/itl/ai-risk-management-framework",
    },
  ],
};

export const regulatoryData: Record<string, CountryRegulation> = {
  "840": {
    id: "840",
    region: "North America",
    framework: "NIST AI Risk Management Framework",
    authority: "U.S. National Institute of Standards and Technology",
    status: "Voluntary framework",
    summary:
      "No single federal AI law, and no federal preemption of state law. NIST's AI RMF is the voluntary national reference. Binding rules come from individual states, and that layer is unsettled rather than merely patchy — Colorado repealed and rewrote its AI Act in 2026, and a federal executive order now directs litigation against state AI laws.",
    pdfSlug: "united-states",
    detail: US_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "124": {
    id: "124",
    region: "North America",
    framework: "Artificial Intelligence and Data Act (AIDA)",
    authority: "Innovation, Science and Economic Development Canada",
    status: "Proposed / draft legislation",
    summary:
      "AIDA, introduced as part of Bill C-27, would create binding obligations for high-impact AI systems. It has not yet been enacted — track its progress before citing it as current law.",
    pdfSlug: "canada",
    verifiedAt: "2026-09-01",
  },
  "484": {
    id: "484",
    region: "North America",
    framework: "General data protection law only",
    authority: "INAI (data protection)",
    status: "No dedicated AI law identified",
    summary:
      "No AI-specific statute identified. Automated processing of personal data falls under Mexico's federal data protection law, without AI-specific accountability requirements.",
    pdfSlug: "mexico",
    verifiedAt: "2026-09-01",
  },
  "076": {
    id: "076",
    region: "Latin America",
    framework: "PL 2338/2023 (AI Legal Framework Bill)",
    authority: "Brazilian Congress / ANPD",
    status: "Proposed / draft legislation",
    summary:
      "A comprehensive, EU-style risk-tiered AI bill has been under legislative debate. Brazil's data protection authority (ANPD) already has relevant automated-decision powers under the LGPD in the meantime.",
    pdfSlug: "brazil",
    verifiedAt: "2026-09-01",
  },
  "250": {
    id: "250",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / national market surveillance authorities",
    status: "Enacted — phasing in",
    summary:
      "As an EU member state, France applies the EU AI Act directly. The Act is risk-tiered (unacceptable / high / limited / minimal risk) and its obligations are phasing in on a multi-year timetable from 2024.",
    pdfSlug: "eu-france",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "276": {
    id: "276",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / BNetzA and other national authorities",
    status: "Enacted — phasing in",
    summary:
      "Germany applies the EU AI Act directly as an EU member state, alongside its own data protection and sectoral supervisory bodies for enforcement.",
    pdfSlug: "eu-germany",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "380": {
    id: "380",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / national authorities",
    status: "Enacted — phasing in",
    summary:
      "Italy applies the EU AI Act directly as an EU member state; obligations phase in through 2026–2027 by risk tier.",
    pdfSlug: "eu-italy",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "724": {
    id: "724",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / AESIA (Spain's AI supervisory agency)",
    status: "Enacted — phasing in",
    summary:
      "Spain applies the EU AI Act directly and has stood up AESIA, a dedicated national AI supervisory agency — one of the first EU states to do so.",
    pdfSlug: "eu-spain",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "528": {
    id: "528",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / national authorities",
    status: "Enacted — phasing in",
    summary:
      "The Netherlands applies the EU AI Act directly as an EU member state.",
    pdfSlug: "eu-netherlands",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "616": {
    id: "616",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / national authorities",
    status: "Enacted — phasing in",
    summary:
      "Poland applies the EU AI Act directly as an EU member state.",
    pdfSlug: "eu-poland",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "372": {
    id: "372",
    region: "Europe",
    framework: "EU Artificial Intelligence Act",
    authority: "European Commission / national authorities",
    status: "Enacted — phasing in",
    summary:
      "Ireland applies the EU AI Act directly as an EU member state and hosts EU headquarters for a number of AI-deploying multinationals, raising its practical enforcement profile.",
    pdfSlug: "eu-ireland",
    detail: EU_AI_ACT_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "826": {
    id: "826",
    region: "Europe",
    framework: "Pro-innovation, principles-based approach",
    authority: "Sector regulators (ICO, FCA, CMA, etc.), coordinated centrally",
    status: "Guidance only",
    summary:
      "The UK has deliberately not passed a standalone AI Act, relying instead on existing sector regulators applying shared cross-sectoral principles. This is a live policy area and could change.",
    pdfSlug: "united-kingdom",
    detail: UK_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "756": {
    id: "756",
    region: "Europe",
    framework: "No dedicated AI law; Council of Europe AI treaty signatory",
    authority: "Federal Council / sector regulators",
    status: "No dedicated AI law identified",
    summary:
      "Switzerland is not an EU member and has no domestic AI-specific statute. It is a signatory to the Council of Europe's Framework Convention on AI, a human-rights-oriented treaty rather than direct regulation.",
    pdfSlug: "switzerland",
    verifiedAt: "2026-09-01",
  },
  "578": {
    id: "578",
    region: "Europe",
    framework: "EEA extension of EU AI Act under discussion",
    authority: "Norwegian Data Protection Authority (Datatilsynet)",
    status: "Proposed / draft legislation",
    summary:
      "As an EEA (not EU) member, Norway's incorporation of the EU AI Act is being worked through the EEA agreement process rather than automatic. Not yet in force domestically.",
    pdfSlug: "norway",
    verifiedAt: "2026-09-01",
  },
  "710": {
    id: "710",
    region: "Africa",
    framework: "POPIA Section 71 (automated decision-making)",
    authority: "Information Regulator (South Africa)",
    status: "In force",
    summary:
      "South Africa has no standalone AI law. POPIA Section 71 gives data subjects rights around solely automated decision-making with legal or similarly significant effect — the closest existing binding hook for AI accountability, and the anchor for AIC's own methodology.",
    pdfSlug: "south-africa",
    detail: SOUTH_AFRICA_DETAIL,
    verifiedAt: "2026-09-01",
  },
  "404": {
    id: "404",
    region: "Africa",
    framework: "National AI strategy (non-binding)",
    authority: "Ministry of ICT",
    status: "Guidance only",
    summary:
      "Kenya has published national AI strategy documents oriented around economic development and ethics principles, without binding AI-specific obligations to date.",
    pdfSlug: "kenya",
    verifiedAt: "2026-09-01",
  },
  "566": {
    id: "566",
    region: "Africa",
    framework: "National AI strategy (draft)",
    authority: "National Information Technology Development Agency (NITDA)",
    status: "Proposed / draft legislation",
    summary:
      "Nigeria has circulated a draft National AI Strategy; NITDA has issued non-binding guidance. No enacted AI-specific statute identified.",
    pdfSlug: "nigeria",
    verifiedAt: "2026-09-01",
  },
  "646": {
    id: "646",
    region: "Africa",
    framework: "National AI Policy (non-binding)",
    authority: "Ministry of ICT and Innovation",
    status: "Guidance only",
    summary:
      "Rwanda has published a national AI policy setting ethical and economic-development principles, without binding AI-specific legal obligations identified to date.",
    pdfSlug: "rwanda",
    verifiedAt: "2026-09-01",
  },
  "784": {
    id: "784",
    region: "Middle East",
    framework: "National AI strategy + emirate-level initiatives",
    authority: "UAE AI Office / DIFC, ADGM free-zone regulators",
    status: "Guidance only",
    summary:
      "The UAE has an active national AI strategy and free-zone-specific initiatives (Dubai, Abu Dhabi) but no single binding cross-sector AI statute identified at federal level.",
    pdfSlug: "uae",
    verifiedAt: "2026-09-01",
  },
  "682": {
    id: "682",
    region: "Middle East",
    framework: "SDAIA AI Ethics Principles",
    authority: "Saudi Data & AI Authority (SDAIA)",
    status: "Voluntary framework",
    summary:
      "SDAIA has published national AI ethics principles as voluntary guidance. No binding AI-specific statute identified to date.",
    pdfSlug: "saudi-arabia",
    verifiedAt: "2026-09-01",
  },
  "376": {
    id: "376",
    region: "Middle East",
    framework: "Draft AI policy / regulation principles",
    authority: "Ministry of Innovation, Science and Technology",
    status: "Proposed / draft legislation",
    summary:
      "Israel has published a policy document proposing a principles-based, sector-led approach to AI regulation, drawing on existing regulators rather than a single new AI law.",
    pdfSlug: "israel",
    verifiedAt: "2026-09-01",
  },
  "156": {
    id: "156",
    region: "Asia-Pacific",
    framework: "Interim Measures for Generative AI + algorithm regulations",
    authority: "Cyberspace Administration of China (CAC)",
    status: "In force",
    summary:
      "China regulates AI through a series of targeted rules rather than one omnibus law: the Generative AI Interim Measures, the Algorithm Recommendation regulations, and Deep Synthesis rules, all administered by the CAC.",
    pdfSlug: "china",
    verifiedAt: "2026-09-01",
  },
  "392": {
    id: "392",
    region: "Asia-Pacific",
    framework: "AI Guidelines for Business (non-binding)",
    authority: "METI / Cabinet Office AI Strategy Council",
    status: "Guidance only",
    summary:
      "Japan has taken a deliberately light-touch, principles-based approach, issuing non-binding AI guidelines for business rather than a dedicated AI statute.",
    pdfSlug: "japan",
    verifiedAt: "2026-09-01",
  },
  "410": {
    id: "410",
    region: "Asia-Pacific",
    framework: "AI Framework Act (Basic Act on AI)",
    authority: "Ministry of Science and ICT",
    status: "Enacted — phasing in",
    summary:
      "South Korea's Basic Act on AI Development and Trust was passed and takes effect on a phased timetable — one of the first comprehensive binding AI statutes outside the EU.",
    pdfSlug: "south-korea",
    verifiedAt: "2026-09-01",
  },
  "702": {
    id: "702",
    region: "Asia-Pacific",
    framework: "Model AI Governance Framework (MGAI)",
    authority: "Infocomm Media Development Authority (IMDA)",
    status: "Voluntary framework",
    summary:
      "Singapore's MGAI is a widely-referenced voluntary governance framework, paired with the AI Verify testing toolkit, rather than binding cross-sector legislation.",
    pdfSlug: "singapore",
    verifiedAt: "2026-09-01",
  },
  "356": {
    id: "356",
    region: "Asia-Pacific",
    framework: "IT Rules + draft national AI governance guidelines",
    authority: "Ministry of Electronics and Information Technology (MeitY)",
    status: "Proposed / draft legislation",
    summary:
      "India regulates AI-adjacent activity through amendments to its IT Rules and has circulated draft national AI governance guidelines. No standalone binding AI statute identified to date.",
    pdfSlug: "india",
    verifiedAt: "2026-09-01",
  },
  "036": {
    id: "036",
    region: "Asia-Pacific",
    framework: "Voluntary AI Safety Standard + proposed mandatory guardrails",
    authority: "Department of Industry, Science and Resources",
    status: "Proposed / draft legislation",
    summary:
      "Australia has published a Voluntary AI Safety Standard and proposed mandatory guardrails for high-risk AI use, which have not yet been enacted as binding law.",
    pdfSlug: "australia",
    verifiedAt: "2026-09-01",
  },
  "554": {
    id: "554",
    region: "Asia-Pacific",
    framework: "No dedicated AI law identified",
    authority: "—",
    status: "No dedicated AI law identified",
    summary:
      "No AI-specific statute identified. Existing privacy and consumer-protection law applies to AI systems without AI-specific accountability requirements.",
    pdfSlug: "new-zealand",
    verifiedAt: "2026-09-01",
  },
};

export function getCountryRegulation(id: string): CountryRegulation | undefined {
  return regulatoryData[id];
}

/**
 * Maps a jurisdiction label (as tagged on a policy update in Notion) to the ISO
 * numeric country codes it covers on the map.
 *
 * The indirection exists because updates are written about legal instruments,
 * not countries: one Digital Omnibus item applies to every EU member state, and
 * duplicating it across seven tags would mean seven places to get wrong. The
 * label set here must stay in step with the Jurisdictions multi-select options
 * in the Notion database — a label with no entry here simply matches nothing,
 * which fails quietly and visibly rather than crashing the map.
 */
export const JURISDICTION_COUNTRIES: Record<string, string[]> = {
  // The seven EU member states currently on the map.
  "European Union": ["250", "276", "380", "724", "528", "616", "372"],
  "South Africa": ["710"],
  "United States": ["840"],
  "United Kingdom": ["826"],
  Canada: ["124"],
  Brazil: ["076"],
  China: ["156"],
  Japan: ["392"],
  "South Korea": ["410"],
  Singapore: ["702"],
  India: ["356"],
  Australia: ["036"],
  // Applies everywhere on the map rather than to one country.
  Global: Object.keys(regulatoryData),
};

/** Country codes an update touches, given its jurisdiction labels. */
export function countriesForJurisdictions(labels: string[]): string[] {
  const codes = new Set<string>();
  for (const label of labels) {
    for (const code of JURISDICTION_COUNTRIES[label] ?? []) codes.add(code);
  }
  return [...codes];
}
