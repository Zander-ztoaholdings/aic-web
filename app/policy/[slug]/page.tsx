import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getPolicyUpdateBySlug, getPolicyUpdateSlugs } from "@/lib/notion";
import { getNews, relatedNews } from "@/lib/news";
import EditorialArticle from "@/app/components/EditorialArticle";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPolicyUpdateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const update = await getPolicyUpdateBySlug(slug);
  if (!update) return { title: "Policy update not found", robots: { index: false } };

  const base = pageMetadata({ path: `/policy/${slug}`, title: update.title, description: update.summary, cardKicker: "Policy update", type: "article", publishedAt: update.date });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", publishedTime: update.date || undefined, modifiedTime: update.date || undefined, section: update.tag },
  };
}

export default async function PolicyUpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [update, news] = await Promise.all([getPolicyUpdateBySlug(slug), getNews()]);
  if (!update) notFound();

  const topic = update.tag === "Update" ? "Regulatory" : update.tag;
  const self = news?.find((n) => n.kind === "policy" && n.slug === slug);
  return (
    <EditorialArticle
      kind="policy"
      slug={slug}
      title={update.title}
      summary={update.summary}
      date={update.date}
      topic={topic}
      author=""
      content={update.content}
      jurisdictions={self?.jurisdictions ?? []}
      related={relatedNews(news ?? [], { kind: "policy", slug, topic })}
    />
  );
}
