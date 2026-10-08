import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getArticleBySlug, getArticles } from "@/lib/notion";
import { cleanAuthor, getNews, relatedNews } from "@/lib/news";
import EditorialArticle from "@/app/components/EditorialArticle";

// The heaviest page: a database query plus a fetch of every block in the page.
// Caching takes it from ~1.5s to near-instant for everyone after the first hit.
export const revalidate = 300;

export async function generateStaticParams() {
  const data = await getArticles(100).catch(() => null);
  return (data?.results ?? []).filter((a) => a.slug).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };

  const author = cleanAuthor(article.author);
  const base = pageMetadata({
    path: `/articles/${slug}`,
    title: article.title,
    description: article.excerpt,
    cardKicker: article.category === "Uncategorized" ? "Analysis" : article.category,
    type: "article",
    publishedAt: article.date,
  });
  return {
    ...base,
    authors: author ? [{ name: author }] : [{ name: "AI Integrity Certification" }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.date || undefined,
      modifiedTime: article.date || undefined,
      section: article.category,
      authors: author ? [author] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, news] = await Promise.all([getArticleBySlug(slug), getNews()]);
  if (!article) notFound();

  const topic = article.category === "Uncategorized" ? "AI governance" : article.category;
  return (
    <EditorialArticle
      kind="article"
      slug={slug}
      title={article.title}
      summary={article.excerpt}
      date={article.date}
      topic={topic}
      author={cleanAuthor(article.author)}
      content={article.content}
      related={relatedNews(news ?? [], { kind: "article", slug, topic })}
    />
  );
}
