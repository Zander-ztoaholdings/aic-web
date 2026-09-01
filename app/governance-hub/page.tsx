import type { Metadata } from "next";
import { getPolicyUpdates } from "@/lib/notion";
import GovernanceHubClient, { type PolicyUpdate } from "./GovernanceHubClient";

// force-dynamic: prevents build-time prerender so Notion calls only happen
// at request time when env vars are available. Switch to `revalidate = 3600`
// once Notion databases are confirmed and the integration is tested.
export const dynamic = "force-dynamic";

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
  let policyUpdatesData: { results: PolicyUpdate[]; nextCursor: string | null } = {
    results: [],
    nextCursor: null,
  };
  try {
    policyUpdatesData = await getPolicyUpdates(4);
  } catch {
    // Leave empty rather than substituting placeholder content.
  }

  return (
    <GovernanceHubClient
      initialPolicyUpdates={policyUpdatesData.results}
      initialNextCursor={policyUpdatesData.nextCursor}
    />
  );
}
