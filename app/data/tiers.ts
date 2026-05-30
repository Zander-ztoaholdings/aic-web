export interface Tier {
  id: number;
  name: string;
  tagline: string;
  description: string;
  color: string;
  requirements: string[];
}

export const tiers: Tier[] = [
  {
    id: 1,
    name: 'Tier 1: Critical Accountability',
    tagline: '"Every decision reviewed. Every outcome owned."',
    description:
      'For AI systems that make or materially influence decisions with life, liberty, or significant financial consequence. 100% of decisions require individual human review and must be overridable before action is taken.',
    color: 'text-aic-red',
    requirements: [
      '100% individual human review before any action',
      'Named accountable person per decision batch',
      'Mandatory override pathway always available',
      'Annual third-party audit',
      'Full SHAP explainability on every decision',
      'Immutable audit log with RSA-3072 signature',
    ],
  },
  {
    id: 2,
    name: 'Tier 2: Elevated Supervision',
    tagline: '"Human oversight. Proportional review. Mandatory recourse."',
    description:
      'For AI systems making elevated-risk decisions such as credit scoring, resume screening, or insurance underwriting. Statistical sampling with mandatory human review, plus a functional override mechanism for flagged outcomes.',
    color: 'text-aic-gold',
    requirements: [
      'Statistical sampling with documented review rate',
      'Human override mechanism for all flagged decisions',
      'Adverse decision explanation available on request',
      'Annual recertification audit',
      'Drift monitoring with quarterly reporting',
      'Bias testing using Four-Fifths Rule',
    ],
  },
  {
    id: 3,
    name: 'Tier 3: Standard Governance',
    tagline: '"Continuous monitoring. Public disclosure. Transparent accountability."',
    description:
      'For standard-risk AI systems such as content recommendations, spam filtering, or low-value fraud scoring. Aggregate performance monitoring, annual model validation, and public disclosure of system use.',
    color: 'text-gray-400',
    requirements: [
      'Aggregate performance monitoring',
      'Annual model validation report',
      'Public disclosure of AI system use',
      'Biennial recertification',
      'Accessible complaints and corrections process',
      'Privacy impact assessment on deployment',
    ],
  },
];
