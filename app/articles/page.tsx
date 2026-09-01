import type { Metadata } from "next";
import { getArticles } from "@/lib/notion";
import ArticlesClient, { type Article } from "./ArticlesClient";

export const dynamic = "force-dynamic";

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
  let articlesData: { results: Article[]; nextCursor: string | null } = {
    results: [],
    nextCursor: null,
  };
  try {
    articlesData = await getArticles(12);
  } catch {
    // Leave the list empty rather than substituting placeholder content.
  }

  return (
    <ArticlesClient
      initialArticles={articlesData.results}
      initialNextCursor={articlesData.nextCursor}
      heroBg={heroBg}
      categories={categories}
    />
  );
}
