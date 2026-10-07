import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AwareClient from "./AwareClient";

export const metadata: Metadata = pageMetadata({
  path: "/aware",
  title: "AIC Aware: free AI governance self-assessment",
  description: "A free self-assessment against the governance questions AIC audits against: twenty questions, about ten minutes, and a report you keep. Self-declared.",
  cardTitle: "How accountable is your AI? Find out free",
  cardKicker: "AIC Aware",
});

export default function AwarePage() {
  return <AwareClient />;
}
