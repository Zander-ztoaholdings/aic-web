import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/regulatory-map",
  title: "AI regulation by country: a verified map",
  description: "AI regulation in 28 jurisdictions, each checked against its primary source, with how every AIC framework applies there. From POPIA to the EU AI Act.",
  cardTitle: "Where AI regulation stands, country by country",
  cardKicker: "Regulatory map",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
