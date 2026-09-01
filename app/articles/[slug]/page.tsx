import type { Metadata } from "next";
import Image from "next/image";
import { getArticleBySlug } from "@/lib/notion";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Clock, User, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { Card } from "@/app/components/ui/card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [{ url: article.image }] : undefined,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: "AI Integrity Certification" },
    publisher: {
      "@type": "Organization",
      name: "AI Integrity Certification",
      logo: {
        "@type": "ImageObject",
        url: "https://aiccertified.cloud/icon",
      },
    },
    mainEntityOfPage: `https://aiccertified.cloud/articles/${slug}`,
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {/* Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-aic-paper/70 hover:text-[#c9920a] mb-6 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>
            <div className="flex items-center gap-3 text-xs text-aic-paper/70 mb-4 uppercase tracking-widest font-mono">
              <span className="px-2 py-1 bg-[#c9920a] text-white rounded font-medium">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-aic-paper font-bold leading-tight"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <Card className="p-8 md:p-12 shadow-2xl border-none">
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-[#e5e7eb]">
            <div className="w-12 h-12 rounded-full bg-[#0a1628] flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-[#6b7280]/60 uppercase tracking-widest font-mono">Author</div>
              <div className="font-semibold text-[#0f1f3d]">{article.author}</div>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none prose-slate prose-headings:font-serif prose-headings:text-[#0f1f3d] prose-a:text-[#c9920a] prose-strong:text-[#0f1f3d]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </article>

          <div className="mt-16 pt-10 border-t border-[#e5e7eb] flex flex-col items-center text-center">
            <Shield className="w-10 h-10 text-[#c9920a] mb-4" />
            <h3 className="text-xl font-bold text-[#0f1f3d] mb-2 font-serif">
              Built for Algorithmic Accountability
            </h3>
            <p className="text-[#6b7280] max-w-md mx-auto mb-6">
              AIC provides the world's most rigorous certification for AI professionals and organizations.
            </p>
            <Link
              href="/contact"
              className="bg-[#c9920a] hover:bg-[#b07d08] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-[#c9920a]/20"
            >
              Get Certified
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
