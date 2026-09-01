// AI Integrity Certification — Frameworks dataset
//
// Publishing rule: each entry states AIC's *position* on a mapped framework —
// what industry it applies to, the acceptable-use boundary, and the safety
// measures a subject is expected to demonstrate against — as outcomes, not
// as AIC's internal scoring weights, evidence thresholds, or audit procedure.
// The translation tables below name real, publicly documented industry
// concepts (HAZOP, SR 11-7, GMLP, etc.); how AIC weighs or verifies them in
// an actual assessment is not published here or anywhere on the site.
//
// See the "AIC - Framework Research Backlog" node in the Obsidian vault for
// the industries considered and deferred alongside these three.

export const frameworksReviewedAt = "2026-09-01";

export interface FrameworkTranslation {
  established: string;
  aiEquivalent: string;
  note: string;
}

export interface FrameworkSafetyMeasure {
  title: string;
  detail: string;
}

export interface Framework {
  slug: string;
  industry: string;
  kicker: string;
  title: string;
  standardName: string;
  standardBodies: string;
  ratingScale: string;
  ratingScaleDetail: string;
  intro: string;
  positioning: string;
  translations: FrameworkTranslation[];
  safetyMeasures: FrameworkSafetyMeasure[];
  gapWarning: string;
  externalLinks: { label: string; url: string }[];
}

export const frameworks: Framework[] = [
  {
    slug: "process-industry",
    industry: "Engineering / Process Industry",
    kicker: "Engineering & Process Safety",
    title: "Where AI decisioning meets functional-safety engineering",
    standardName: "IEC 61508 / IEC 61511",
    standardBodies: "IEC — International Electrotechnical Commission",
    ratingScale: "SIL 1–4",
    ratingScaleDetail:
      "Safety Integrity Level, the standard's rating for how reliably a safety function must perform on demand.",
    intro:
      "Process and engineering environments already run on a mature, decades-old discipline for rating how much a safety-critical function can be trusted: Safety Integrity Levels under IEC 61508 and its process-sector counterpart, IEC 61511. Where an AI system sits inside or alongside a Safety Instrumented System — an anomaly-detection model feeding an interlock, an AI-assisted alarm-management layer, a predictive-maintenance model informing a shutdown decision — the question isn't whether AI is a fifth SIL. It's whether the surrounding engineering discipline that makes SIL meaningful has actually been applied to the AI component too.",
    positioning:
      "AIC maps AI-assisted decisioning in process and engineering environments against the same hazard-and-risk discipline the industry already uses for physical safety functions, using the plant's own SIL-rated architecture as the reference frame rather than inventing a parallel one. This applies to AI used for anomaly detection, predictive maintenance, alarm rationalisation, and decision-support feeding into (but not replacing) an existing Safety Instrumented System.",
    translations: [
      { established: "HAZOP", aiEquivalent: "AI-aware HAZOP", note: "Hazard and operability review extended to cover how an AI component's failure modes and drift could propagate into the process." },
      { established: "LOPA / Independent Protection Layers", aiEquivalent: "AI as a claimed layer, or not", note: "Whether an AI system can be credited as an independent protection layer at all, and what has to be true for that claim to hold." },
      { established: "FMEA", aiEquivalent: "AI-FMEA", note: "Failure Mode and Effects Analysis applied to model failure modes — not just component failure modes." },
      { established: "Management of Change (MOC)", aiEquivalent: "Model change control", note: "The same change-control discipline applied to a retrained or re-tuned model as to a physical modification." },
      { established: "Permit-to-work / Responsible Charge", aiEquivalent: "Named human accountability", note: "A named, competent person accountable for the AI-assisted decision — the same principle underlying every AIC certification." },
    ],
    safetyMeasures: [
      { title: "Named accountable engineer", detail: "A specific, competent individual is accountable for the AI component's role in the safety architecture — not a team, not a vendor." },
      { title: "Documented failure-mode analysis", detail: "The AI component has been through a hazard and failure-mode review appropriate to its role, with findings on record." },
      { title: "Change control on the model", detail: "Retraining, re-tuning, or model updates go through the same management-of-change discipline as any other safety-relevant modification." },
      { title: "Drift and performance monitoring", detail: "Ongoing monitoring exists for the model's performance and data drift, not just a one-time validation at deployment." },
      { title: "Clear protection-layer status", detail: "Whether the AI system is, or is not, being credited as a protection layer is explicit and documented — never assumed." },
    ],
    gapWarning:
      "This translation has real limits, and AIC states them rather than papering over them. SIL is built on demonstrable, quantified failure rates for hardware and well-understood software — a probability of failure on demand that can be calculated and audited. Most AI/ML components cannot currently produce an equivalent, traceable number: this is a recognised assurance gap in current guidance (see IET and BSI commentary on AI in safety-related systems), not something AIC or anyone else has solved. AI failure modes also tend to be systematic rather than random, harder to make \"fail-safe\" in the classical sense, and vulnerable to common-cause failure through shared training data or supply chains. Standards are still catching up — ISO/IEC TR 5469:2024 and ISO/IEC TS 22440 (in committee) are early steps, and no AI/ML-specific verification and validation standard exists yet in the ASME VVUQ series. Treat this mapping as a rigorous translation of engineering discipline, not a claim that AI has been reduced to a SIL number.",
    externalLinks: [
      { label: "IEC 61508 — Functional Safety", url: "https://www.iec.ch/functionalsafety" },
      { label: "ISO/IEC TR 5469:2024 — AI safety-related systems", url: "https://www.iso.org/standard/81283.html" },
    ],
  },
  {
    slug: "financial-services",
    industry: "Financial Services",
    kicker: "Banking & Model Risk",
    title: "Where AI-driven decisioning meets model risk management",
    standardName: "SR 11-7, Basel III, Sarbanes-Oxley",
    standardBodies: "US Federal Reserve / OCC · Basel Committee on Banking Supervision",
    ratingScale: "Three-pillar governance, not a numeric score",
    ratingScaleDetail:
      "SR 11-7 doesn't rate a model on a scale — it requires development rigor, independent validation, and governance around every model in use.",
    intro:
      "Banks have run a formal model risk management discipline for over a decade under supervisory guidance like SR 11-7: every model — including, now, AI and machine learning models used for credit decisioning, fraud detection, and trading — is expected to sit in an inventory, be independently validated, and be subject to \"effective challenge\" from people who didn't build it. That structure already exists in most regulated institutions. What AIC maps is whether an AI-assisted decision has actually been run through that structure, honestly, or just labelled as if it had.",
    positioning:
      "AIC maps AI-driven decisioning in financial services against the model risk management discipline institutions are already expected to run — model inventory, independent validation, and governance — applied specifically to AI and machine learning models used in credit, fraud, and trading decisions. This is a governance mapping, not a substitute for regulatory model validation or a bank's own SR 11-7 programme.",
    translations: [
      { established: "Model inventory", aiEquivalent: "AI/ML model inventory", note: "Every AI model used in a consequential decision is logged, tracked, and known to exist — not shadow-deployed." },
      { established: "Effective challenge", aiEquivalent: "Independent AI validation", note: "Critical review of an AI model by technically competent people who didn't build it, empowered to flag it." },
      { established: "Back-testing / outcomes analysis", aiEquivalent: "Ongoing AI performance monitoring", note: "The model's real-world outcomes are checked against what it predicted, on an ongoing basis, not just at launch." },
      { established: "Conceptual soundness review", aiEquivalent: "AI development documentation", note: "The reasoning and evidence behind why the model should work is documented, not just the fact that it does." },
      { established: "Governance & policy ownership", aiEquivalent: "Named accountable owner", note: "A specific, accountable person or function owns the AI model's use in the decision — consistent with AIC's named-human-accountability principle." },
    ],
    safetyMeasures: [
      { title: "Model inventory entry", detail: "The AI system is logged as a model, with its purpose, scope, and owner documented — not deployed informally." },
      { title: "Independent validation function", detail: "Someone outside the model's development team has reviewed and challenged it before and after deployment." },
      { title: "Documented conceptual soundness", detail: "There is a written basis for why the model is expected to perform as intended, reviewable by a third party." },
      { title: "Ongoing monitoring and back-testing", detail: "Model outcomes are tracked against predictions on a continuing basis, with a defined escalation path when they diverge." },
      { title: "Named accountable owner", detail: "A specific individual, not a committee or vendor, is accountable for the AI-assisted decision's governance." },
    ],
    gapWarning:
      "SR 11-7 was written in 2011, before modern generative and agentic AI existed, and its application to those systems is still actively being worked out by supervisors — the \"Minimum Viable Governance\" concept referenced by regulators in 2026 is an emerging extension, not settled guidance. SR 11-7 is also US-centric; Basel III operates at the international capital-adequacy level and doesn't itself specify AI model governance in the same detail, and other jurisdictions (the EU, UK, South Africa) apply different supervisory expectations. AIC's mapping draws on the SR 11-7 structure as the clearest, most established reference point available, not as a claim that it is the universal or final standard for AI model risk.",
    externalLinks: [
      { label: "Federal Reserve SR 11-7 guidance", url: "https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm" },
      { label: "Basel Committee on Banking Supervision", url: "https://www.bis.org/bcbs/" },
    ],
  },
  {
    slug: "medical-devices",
    industry: "Medical Devices & Health Software",
    kicker: "Health & Life Sciences",
    title: "Where AI/ML medical software meets safety classification",
    standardName: "IEC 62304, FDA GMLP & PCCP",
    standardBodies: "IEC · US FDA · IMDRF (Health Canada, MHRA, FDA)",
    ratingScale: "Software Safety Classification A / B / C",
    ratingScaleDetail:
      "IEC 62304's classification of a software item by the severity of harm a failure could cause a patient.",
    intro:
      "Medical device software already carries a formal safety classification under IEC 62304 — Class A (no injury possible), B (non-serious injury possible), or C (death or serious injury possible) — that determines how rigorously it must be developed, documented, and maintained. AI/ML-based Software as a Medical Device adds a specific wrinkle regulators have been actively building guidance for since the early 2020s: these models can change after approval through retraining, so the FDA and international partners built Good Machine Learning Practice (GMLP) and Predetermined Change Control Plans (PCCPs) to govern that.",
    positioning:
      "AIC maps AI/ML-based medical software and clinical decision-support tools against the IEC 62304 safety-classification discipline and the emerging GMLP/PCCP framework for how such software is allowed to change over time. This applies to organisations building or deploying AI-assisted diagnostic, monitoring, or clinical decision-support software — not to clinical practice itself, and not as a substitute for FDA, MHRA, or other regulatory clearance.",
    translations: [
      { established: "IEC 62304 safety classification (A/B/C)", aiEquivalent: "AI/ML software safety classification", note: "The same severity-of-harm classification applied to the AI component's role in the device or software." },
      { established: "Design history / lifecycle documentation", aiEquivalent: "GMLP data & training documentation", note: "Training data representativeness, held-out validation, and algorithm limitations documented as part of the software lifecycle record." },
      { established: "Change control", aiEquivalent: "Predetermined Change Control Plan (PCCP)", note: "Anticipated model updates are pre-specified and bounded, rather than each retraining requiring a fresh, unplanned review." },
      { established: "Post-market surveillance", aiEquivalent: "Ongoing model performance monitoring", note: "The model's real-world performance is tracked after deployment, not assumed to hold indefinitely from validation-time results." },
      { established: "Labelling & disclosure", aiEquivalent: "ML-use disclosure", note: "End users are told the device incorporates machine learning and, where relevant, that a PCCP governs how it may change." },
    ],
    safetyMeasures: [
      { title: "Documented safety classification", detail: "The AI component's role has been classified for severity of potential harm, consistent with IEC 62304 discipline." },
      { title: "GMLP-aligned development record", detail: "Training data, validation approach, and known limitations are documented, not just the model's headline performance." },
      { title: "A defined change-control plan", detail: "How the model is allowed to change post-deployment is pre-specified and bounded, not open-ended." },
      { title: "Post-deployment monitoring", detail: "Real-world performance is tracked on an ongoing basis, with a path to act if it degrades." },
      { title: "Clear ML-use disclosure", detail: "Clinicians and patients are told, plainly, that machine learning is part of the software they're relying on." },
    ],
    gapWarning:
      "The PCCP framework was only finalised in December 2024 and is still maturing through 2025–2026 — practice and regulatory expectations are evolving faster than in the more settled parts of IEC 62304. This mapping is US-FDA-centric by default; the EU (MDR/IVDR), UK, and other regulators apply related but distinct requirements, and AIC's assessment does not substitute for any regulator's clearance process. Most importantly, none of this replaces clinical judgement — it maps the software governance around an AI tool, not the clinical decision a practitioner makes using it.",
    externalLinks: [
      { label: "FDA — AI/ML-Based Software as a Medical Device", url: "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device" },
      { label: "IEC 62304 — Medical device software lifecycle", url: "https://www.iso.org/standard/38421.html" },
    ],
  },
];
