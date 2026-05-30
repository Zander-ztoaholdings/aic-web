import { getArticles } from "@/lib/notion";
import ArticlesClient from "./ArticlesClient";

export const dynamic = "force-dynamic";

const heroBg = "https://images.unsplash.com/photo-1764087957302-ef0756ed8e0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3VudGFpbiUyMHBlbiUyMHBhcGVyJTIwd3JpdGluZyUyMG5vdGVib29rfGVufDF8fHx8MTc3NTUwODgxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const categories = [
  "All Articles",
  "AI Governance",
  "Certification",
  "Policy Updates",
  "Case Studies",
  "Research",
  "Best Practices",
];

const fallbackArticles = [
  {
    id: 1,
    title: "The Rise of Algorithmic Accountability: Why Human Certification Matters in 2026",
    excerpt: "As AI systems permeate every sector, organizations face mounting pressure to demonstrate human oversight. This comprehensive analysis explores why certifying the professionals behind AI—not just the algorithms—has become the cornerstone of responsible deployment.",
    image: "https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWxzJTIwbWVldGluZ3xlbnwxfHx8fDE3NzU0ODExMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "AI Governance",
    author: "Dr. Sarah Chen",
    date: "April 1, 2026",
    readTime: "12 min read",
    featured: true,
    slug: "rise-of-algorithmic-accountability",
  },
  {
    id: 2,
    title: "ISO/IEC 42001 Implementation Guide: From Gap Analysis to Full Compliance",
    excerpt: "A step-by-step roadmap for Chief Risk Officers navigating the complexities of ISO/IEC 42001 certification. Includes real-world case studies from Fortune 500 implementations and common pitfalls to avoid.",
    image: "https://images.unsplash.com/photo-1770681381576-f1fdceb2ea01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGFuYWx5dGljcyUyMHNjcmVlbnxlbnwxfHx8fDE3NzU1MDgzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Certification",
    author: "Michael Torres, CAEL",
    date: "March 28, 2026",
    readTime: "18 min read",
    featured: true,
    slug: "iso-iec-42001-implementation-guide",
  },
  {
    id: 3,
    title: "EU AI Act Enforcement Begins: What AIC-Certified Professionals Need to Know",
    excerpt: "With the EU AI Act entering its enforcement phase, certified AI Ethics Leads face new compliance obligations. This analysis breaks down key requirements and how AIC certification aligns with regulatory expectations.",
    image: "https://images.unsplash.com/photo-1768224656445-33d078c250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBjaXJjdWl0JTIwYm9hcmQlMjBkaWdpdGFsfGVufDF8fHx8MTc3NTUwODM1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Policy Updates",
    author: "Elena Popescu, LL.M.",
    date: "March 25, 2026",
    readTime: "10 min read",
    featured: false,
    slug: "eu-ai-act-enforcement-begins",
  },
];

export default async function ArticlesPage() {
  let articlesData: { results: any[]; nextCursor: string | null } = { results: [], nextCursor: null };
  try {
    articlesData = await getArticles(12);
  } catch {
    // fall through to fallback articles below
  }

  // Use fallback if no articles are found in Notion
  const displayArticles = articlesData.results.length > 0 ? articlesData.results : fallbackArticles;

  return (
    <ArticlesClient 
      initialArticles={displayArticles} 
      initialNextCursor={articlesData.nextCursor}
      heroBg={heroBg} 
      categories={categories} 
    />
  );
}
