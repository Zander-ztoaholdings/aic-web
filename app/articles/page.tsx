import type { Metadata } from "next";
import { getArticles } from "@/lib/notion";
import ArticlesClient from "./ArticlesClient";

// Cached, not force-dynamic. Every request was previously making a fresh Notion
// round trip (~1.1s of the 1.19s TTFB), which is the whole reason this page felt
// slow. Editorial content does not need to be real-time: an article five minutes
// stale is harmless.
//
// This is deliberately NOT applied to /registry or /verify. A certification
// status is a claim about the present, and serving a suspended certificate from
// cache as "active" is the exact failure the register exists to prevent. Cache
// what is editorial; never cache a status.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Writing from AI Integrity Certification on algorithmic accountability, certification practice, and the regulatory landscape for AI governance.",
  openGraph: {
    title: "Articles | AIC",
    description:
      "Writing from AI Integrity Certification on algorithmic accountability, certification practice and AI regulation.",
  },
};

const heroBg =
  "https://images.unsplash.com/photo-1764087957302-ef0756ed8e0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3VudGFpbiUyMHBlbiUyMHBhcGVyJTIwd3JpdGluZyUyMG5vdGVib29rfGVufDF8fHx8MTc3NTUwODgxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const categories = [
  "All Articles",
  "AI Governance",
  "Certification",
  "Policy Updates",
  "Case Studies",
  "Research",
  "Best Practices",
];

// No fallback articles. Previously this file shipped three fabricated pieces
// with invented author bylines and dates, which rendered whenever the Notion
// source was empty or unreachable — indexed by search engines as if real.
// An empty list renders the honest empty state in ArticlesClient instead.
export default async function ArticlesPage() {
  // null = the CMS could not be reached; [] = reachable but nothing published.
  // The page must not report the first as the second.
  const articlesData = await getArticles(12);

  return (
    <ArticlesClient
      initialArticles={articlesData ? articlesData.results : null}
      initialNextCursor={articlesData ? articlesData.nextCursor : null}
      heroBg={heroBg}
      categories={categories}
    />
  );
}
