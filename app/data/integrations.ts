/**
 * The systems the AIC platform reads, for /integrations.
 *
 * Status follows the platform's own catalogue. "live" connections are the four
 * the platform was built around. "built" connectors are written and tested
 * against each provider's published interface but have not yet run against a
 * real client account; they move to "live" when they have. Every connection is
 * read-only. Keep each "reads" line to what the connector actually reads.
 */

export type IntegrationStatus = "live" | "built";

export type Integration = {
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  reads: string;
};

export const CATEGORIES = [
  "AI providers",
  "Code",
  "Cloud",
  "Identity and access",
  "Productivity",
  "People and HR",
  "Devices",
  "Security",
  "Work and support",
  "Observability",
] as const;

export type IntegrationCategory = (typeof CATEGORIES)[number];

export const INTEGRATIONS: Integration[] = [
  // Live
  { name: "GitHub", category: "Code", status: "live", reads: "Branch protection, required review, AI-written changes reviewed by a person before merging, exposed secrets, critical vulnerabilities, AI usage declared, and two-factor sign-in across the organisation." },
  { name: "Microsoft 365 and Entra ID", category: "Productivity", status: "live", reads: "Whether a second factor is enforced and registered, how many global administrators there are, and accounts no one has used in months." },
  { name: "OpenAI", category: "AI providers", status: "live", reads: "Which models are used, by which system, and what they cost, so AI nobody declared shows up. Through an exporter you run, or a read-only key." },
  { name: "Anthropic", category: "AI providers", status: "live", reads: "Usage and spend for Claude models, by model and system, so undeclared use is flagged. Through an exporter you run, or a read-only key." },

  // Built, awaiting a first client account
  { name: "Claude Enterprise", category: "AI providers", status: "built", reads: "Who in your organisation uses Claude each day, and how much, with seat totals. Never a prompt, a conversation or a file." },
  { name: "Amazon Web Services", category: "Cloud", status: "built", reads: "IAM users and their second factors, unused credentials, S3 public access settings, and CloudTrail logging." },
  { name: "Google Cloud", category: "Cloud", status: "built", reads: "Who holds Owner and Editor on your project, whether storage buckets prevent public access, and audit log settings." },
  { name: "Microsoft Azure", category: "Cloud", status: "built", reads: "Who holds Owner on each subscription, storage public access and TLS settings, activity log export, and high-severity Defender for Cloud recommendations." },
  { name: "Cloudflare", category: "Security", status: "built", reads: "HTTPS and TLS settings on each website, and whether account members use two-factor sign-in." },
  { name: "Google Workspace", category: "Identity and access", status: "built", reads: "Each user's 2-Step Verification, who is a super admin, and accounts not signed in to for 90 days." },
  { name: "Okta", category: "Identity and access", status: "built", reads: "Sign-on policies that allow one factor, users without a second factor, super administrators, and unused accounts." },
  { name: "1Password Business", category: "Identity and access", status: "built", reads: "Whether sign-in attempts are being reported, and who keeps failing their second factor." },
  { name: "GitLab", category: "Code", status: "built", reads: "Default branch protection on each project, whether your group requires two-factor sign-in, and who holds Owner." },
  { name: "Bitbucket Cloud", category: "Code", status: "built", reads: "Branch restrictions on each repository's main branch, and who owns the workspace." },
  { name: "Snyk", category: "Security", status: "built", reads: "Open critical vulnerabilities, and which projects Snyk is monitoring." },
  { name: "CrowdStrike Falcon", category: "Security", status: "built", reads: "Whether the Falcon sensor is active on every machine, and open critical vulnerabilities from Spotlight." },
  { name: "BambooHR", category: "People and HR", status: "built", reads: "Your employee list with start and leaving dates, so leavers are checked against every other system." },
  { name: "HiBob", category: "People and HR", status: "built", reads: "Your employee list, including people who have left, with start and leaving dates." },
  { name: "Personio", category: "People and HR", status: "built", reads: "Your employee list with hire and termination dates." },
  { name: "Deel", category: "People and HR", status: "built", reads: "Employees and contractors on Deel, with start and termination dates." },
  { name: "Rippling", category: "People and HR", status: "built", reads: "Your worker list with start and end dates." },
  { name: "Microsoft Intune", category: "Devices", status: "built", reads: "Each managed laptop and phone: encryption, compliance with your policies, and when it last checked in." },
  { name: "Jamf Pro", category: "Devices", status: "built", reads: "Each Mac: FileVault, macOS version, and when it last checked in." },
  { name: "Kandji", category: "Devices", status: "built", reads: "Each Mac: FileVault, OS version, and when it last checked in." },
  { name: "Jira", category: "Work and support", status: "built", reads: "Open security tickets past their deadline, and active Jira users." },
  { name: "Linear", category: "Work and support", status: "built", reads: "Admins, whether SAML single sign-on is on, and open urgent or high security issues past their deadline." },
  { name: "Zendesk", category: "Work and support", status: "built", reads: "Agents and admins without two-factor sign-in, how many admins there are, and agents who have not signed in for 90 days." },
  { name: "Slack", category: "Work and support", status: "built", reads: "Members without two-factor sign-in, and how many admins and owners there are." },
  { name: "Salesforce", category: "Work and support", status: "built", reads: "Who can modify all data, and users who have not signed in for 90 days." },
  { name: "Datadog", category: "Observability", status: "built", reads: "How many people hold the Admin role, invitations nobody accepted, and whether Audit Trail is collecting." },
];
