import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import NewsHub from "@/app/news/NewsHub";

// Cached, not force-dynamic: a fresh Notion round trip per request was most of
// this page's response time, and an article five minutes stale is harmless.
// Never apply this to /registry or /verify, which state something about now.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  path: "/articles",
  title: "AI governance analysis and articles",
  description: "Writing from AIC on AI accountability, certification practice and AI regulation, from POPIA section 71 to the EU AI Act.",
  cardKicker: "Analysis",
});

export default function ArticlesPage() {
  return <NewsHub kind="article" />;
}
