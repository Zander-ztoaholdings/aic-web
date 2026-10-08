import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import NewsHub from "./NewsHub";

// Editorial, so cached for five minutes rather than fetched per request.
export const revalidate = 300;

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/news",
    title: "AI regulation news for South Africa and beyond",
    description: "Policy updates on AI law in South Africa and abroad, each with its primary source, and AIC analysis on POPIA section 71, King V, the EU AI Act and AI accountability.",
    cardTitle: "AI regulation news, with the sources",
    cardKicker: "News",
  }),
  alternates: { canonical: "/news", types: { "application/rss+xml": [{ url: "/news/feed.xml", title: "AIC news" }] } },
};

export default function NewsPage() {
  return <NewsHub kind="all" />;
}
