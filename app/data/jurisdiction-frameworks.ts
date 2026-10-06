// How every framework AIC offers meets each jurisdiction on the regulatory map.
//
// Three kinds of framework, kept apart because they promise different things:
//
//  1. Frameworks a client can TRACK in the AIC platform (app.aiccertified.cloud,
//     Compliance tracking). Evidence from connected systems is mapped to their
//     requirements. A mapping says "this evidence usually supports this
//     requirement"; it is not an auditor's conclusion and not AIC certification.
//     The list mirrors the platform's own catalogue (lib/frameworks/data in the
//     platform repo) and must be kept in step with it.
//  2. AIC's INDUSTRY frameworks (/frameworks): AI mapped against established
//     safety disciplines. They do not change by country, but who the local
//     authority is does, and that is the only thing said per country here.
//  3. The AIC STANDARD itself, which applies the same way everywhere. Where a
//     jurisdiction has obligation-level detail on the map, each obligation is
//     mapped to the requirements that test for it (see `coverage` in
//     regulatory-data.ts). That mapping is AIC's reading, not legal advice.
//
// Nothing here is a claim about what any law requires beyond what
// regulatory-data.ts already states and sources.

export interface TrackedFramework {
  key: string;
  name: string;
  /** Who publishes it, in plain words. */
  publisher: string;
}

export const TRACKED: Record<string, TrackedFramework> = {
  eu_ai_act: { key: "eu_ai_act", name: "EU AI Act", publisher: "European Union, Regulation 2024/1689" },
  gdpr: { key: "gdpr", name: "GDPR", publisher: "European Union, Regulation 2016/679" },
  nis2: { key: "nis2", name: "NIS2", publisher: "European Union, Directive 2022/2555" },
  dora: { key: "dora", name: "DORA", publisher: "European Union, financial entities" },
  popia: { key: "popia", name: "POPIA", publisher: "South Africa, Act 4 of 2013" },
  cyber_essentials: { key: "cyber_essentials", name: "Cyber Essentials", publisher: "UK National Cyber Security Centre" },
  nist_ai_rmf: { key: "nist_ai_rmf", name: "NIST AI RMF", publisher: "US National Institute of Standards and Technology" },
  nist_csf: { key: "nist_csf", name: "NIST CSF 2.0", publisher: "US National Institute of Standards and Technology" },
  usdp: { key: "usdp", name: "US Data Privacy", publisher: "California CCPA and CPRA, including the automated decision rules" },
  soc2: { key: "soc2", name: "SOC 2", publisher: "AICPA, United States" },
  hipaa: { key: "hipaa", name: "HIPAA", publisher: "US health information" },
  hitrust: { key: "hitrust", name: "HITRUST CSF", publisher: "HITRUST Alliance, United States" },
  cri: { key: "cri", name: "CRI Profile", publisher: "Cyber Risk Institute, financial sector" },
  cmmc: { key: "cmmc", name: "CMMC Level 1", publisher: "US Department of Defense suppliers" },
  fedramp: { key: "fedramp", name: "FedRAMP", publisher: "US federal cloud services" },
  cjis: { key: "cjis", name: "CJIS Security Policy", publisher: "US criminal justice information" },
  essential_eight: { key: "essential_eight", name: "Essential Eight", publisher: "Australian Signals Directorate" },
  cps234: { key: "cps234", name: "CPS 234", publisher: "Australian Prudential Regulation Authority" },
  iso42001: { key: "iso42001", name: "ISO/IEC 42001", publisher: "International standard for AI management systems" },
  iso27001: { key: "iso27001", name: "ISO/IEC 27001", publisher: "International standard for information security" },
};

/** Frameworks that apply wherever an organisation operates. */
export const INTERNATIONAL = ["iso42001", "iso27001"];

const EU = ["eu_ai_act", "gdpr", "nis2", "dora"];

/** A jurisdiction's own law, where the platform tracks it. Keyed by ISO numeric id. */
export const HOME_TRACKED: Record<string, { keys: string[]; note?: string }> = {
  "250": { keys: EU }, "276": { keys: EU }, "380": { keys: EU }, "724": { keys: EU },
  "528": { keys: EU }, "616": { keys: EU }, "372": { keys: EU },
  "578": { keys: ["gdpr"], note: "GDPR applies in Norway through the EEA Agreement." },
  "826": { keys: ["cyber_essentials"] },
  "710": { keys: ["popia"] },
  "036": { keys: ["essential_eight", "cps234"] },
  "840": {
    keys: ["nist_ai_rmf", "nist_csf", "usdp", "soc2", "hipaa", "hitrust", "cri", "cmmc", "fedramp", "cjis"],
    note: "Most of these are sector or customer requirements rather than law that binds everyone. Track the ones your customers and regulators ask for.",
  },
};

export function trackedFor(countryId: string): { home: TrackedFramework[]; international: TrackedFramework[]; note?: string } {
  const home = HOME_TRACKED[countryId];
  return {
    home: (home?.keys ?? []).map((k) => TRACKED[k]),
    international: INTERNATIONAL.map((k) => TRACKED[k]),
    note: home?.note,
  };
}

export type IndustrySlug = "process-industry" | "financial-services" | "medical-devices";

/**
 * One line per industry framework, for this country. Only facts about where a
 * framework comes from; never a claim about which local rule applies, because
 * that research has not been done.
 */
export function industryNote(slug: IndustrySlug, countryId: string, countryName: string): string {
  if (slug === "process-industry") {
    return "IEC 61508 and IEC 61511 are international standards, so this mapping applies in " + countryName + " exactly as it does anywhere else.";
  }
  if (slug === "financial-services") {
    return countryId === "840"
      ? "SR 11-7 is a US supervisory guideline, so in the United States this is the home framework, not a reference point."
      : "AIC uses the structure of SR 11-7, a US guideline, as the reference point. In " + countryName + ", your own financial supervisor’s expectations for model risk apply alongside it.";
  }
  const gmlp: Record<string, string> = { "840": "the US FDA", "124": "Health Canada", "826": "the MHRA" };
  return gmlp[countryId]
    ? "IEC 62304 is international, and the GMLP principles were published jointly by the FDA, Health Canada and the MHRA, so " + gmlp[countryId] + " is one of their authors."
    : "IEC 62304 is international. The GMLP principles come from the US, Canadian and UK regulators; in " + countryName + ", your own medical device regulator decides how far they are recognised.";
}
