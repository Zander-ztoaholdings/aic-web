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

export const regulatoryDataReviewedAt = "2026-09-01";

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
}

export const regulatoryData: Record<string, CountryRegulation> = {
  "840": {
    id: "840",
    region: "North America",
    framework: "NIST AI Risk Management Framework",
    authority: "U.S. National Institute of Standards and Technology",
    status: "Voluntary framework",
    summary:
      "No single federal AI law. NIST's AI RMF is the reference voluntary framework at national level; a growing patchwork of state-level rules (e.g. Colorado's AI Act) adds binding obligations for specific sectors and states.",
    pdfSlug: "united-states",
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
  },
};

export function getCountryRegulation(id: string): CountryRegulation | undefined {
  return regulatoryData[id];
}
