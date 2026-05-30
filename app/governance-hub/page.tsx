import { getPolicyUpdates } from "@/lib/notion";
import GovernanceHubClient from "./GovernanceHubClient";

// force-dynamic: prevents build-time prerender so Notion calls only happen
// at request time when env vars are available. Switch to `revalidate = 3600`
// once Notion databases are confirmed and the integration is tested.
export const dynamic = "force-dynamic";

const fallbackPolicyUpdates = [
  {
    id: 1,
    date: "Feb 2026",
    tag: "Regulatory",
    title: "EU AI Act High-Risk System Compliance Deadline Approaches",
    summary: "Organizations deploying high-risk AI systems under Annex III must achieve ISO/IEC 42001 compliance by August 2026. AIC has expanded its conformity assessment capacity.",
  },
  {
    id: 2,
    date: "Jan 2026",
    tag: "Standards",
    title: "ISO/IEC 42001:2023 Amendment Published for Generative AI",
    summary: "The International Organization for Standardization has published Technical Corrigendum 1 addressing generative AI and large language model deployment requirements.",
  },
];

export default async function GovernanceHubPage() {
  let policyUpdatesData: { results: any[]; nextCursor: string | null } = { results: [], nextCursor: null };
  try {
    policyUpdatesData = await getPolicyUpdates(4);
  } catch {
    // fall through to fallback policy updates below
  }

  const displayPolicyUpdates = policyUpdatesData.results.length > 0 ? policyUpdatesData.results : fallbackPolicyUpdates;

  return (
    <GovernanceHubClient 
      initialPolicyUpdates={displayPolicyUpdates}
      initialNextCursor={policyUpdatesData.nextCursor}
    />
  );
}
