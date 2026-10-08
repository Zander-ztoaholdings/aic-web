import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/notion";
import { cleanAuthor } from "@/lib/news";
import PeekArticle from "@/app/components/PeekArticle";

// Intercepting route: renders INSTEAD of app/articles/[slug]/page.tsx when the
// reader clicks through from /articles, so the article opens as a centre peek.
// The URL still changes, so a refresh, a shared link or a crawler gets the real
// page with its metadata and structured data.
export const revalidate = 300;

export default async function ArticlePeek({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) notFound();
  return <PeekArticle href={`/articles/${slug}`} kicker={a.category === "Uncategorized" ? "Analysis" : a.category} title={a.title} summary={a.excerpt} date={a.date} author={cleanAuthor(a.author)} content={a.content} />;
}
