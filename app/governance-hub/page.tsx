import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getPolicyUpdates } from "@/lib/notion";
import GovernanceHubClient from "./GovernanceHubClient";

// Notion databases are now confirmed and tested, so this moves off
// force-dynamic as that comment anticipated. Same reasoning as /articles:
// editorial content tolerates being minutes old; certification status does not.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  path: "/governance-hub",
  title: "Declaration of Algorithmic Rights",
  description: "The five Algorithmic Rights behind AIC certification, with AIC's governance positions and the policy record on accountable AI.",
  cardKicker: "Governance hub",
});

// No fallback policy updates. The previous placeholders asserted a specific
// EU AI Act compliance deadline that is not correct, and a capacity claim
// about AIC that was never true. An empty list is the honest state.
export default async function GovernanceHubPage() {
  // null = unreachable, [] = nothing published. See lib/notion.ts.
  const policyUpdatesData = await getPolicyUpdates(4);

  return (
    <GovernanceHubClient
      initialPolicyUpdates={policyUpdatesData ? policyUpdatesData.results : null}
      initialNextCursor={policyUpdatesData ? policyUpdatesData.nextCursor : null}
    />
  );
}
