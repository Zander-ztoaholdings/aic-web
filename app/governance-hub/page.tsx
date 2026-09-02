import type { Metadata } from "next";
import { getPolicyUpdates } from "@/lib/notion";
import GovernanceHubClient from "./GovernanceHubClient";

// Notion databases are now confirmed and tested, so this moves off
// force-dynamic as that comment anticipated. Same reasoning as /articles:
// editorial content tolerates being minutes old; certification status does not.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Governance Hub",
  description:
    "The Declaration of Algorithmic Rights, policy updates, and AIC's governance positions on accountable AI.",
  openGraph: {
    title: "Governance Hub | AIC",
    description:
      "The Declaration of Algorithmic Rights, policy updates and AIC's governance positions.",
  },
};

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
