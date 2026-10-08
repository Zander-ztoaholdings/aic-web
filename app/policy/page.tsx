import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import NewsHub from "@/app/news/NewsHub";

// Editorial content, safe to cache. The registry and /verify stay dynamic
// because they assert something about the present; this does not.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  path: "/policy",
  title: "AI policy updates for South Africa and beyond",
  description: "Regulatory and standards developments affecting AI accountability, from the Information Regulator to the EU AI Act, each with its primary source.",
  cardKicker: "Policy updates",
});

export default function PolicyIndexPage() {
  return <NewsHub kind="policy" />;
}
