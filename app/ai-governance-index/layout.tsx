import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/ai-governance-index",
  title: "AI Governance Index",
  description: "AIC's public index of organisational AI accountability. It opens with the founding cohort, which is forming now.",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
