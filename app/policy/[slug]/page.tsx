import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, ArrowLeft, Shield } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { getPolicyUpdateBySlug, getPolicyUpdateSlugs } from "@/lib/notion";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPolicyUpdateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const update = await getPolicyUpdateBySlug(slug);
  if (!update) return { title: "Policy update not found" };

  return {
    title: update.title,
    description: update.summary,
    alternates: { canonical: `/policy/${slug}` },
    openGraph: {
      type: "article",
      title: update.title,
      description: update.summary,
      publishedTime: update.date,
    },
    twitter: {
      card: "summary",
      title: update.title,
      description: update.summary,
    },
  };
}

export default async function PolicyUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = await getPolicyUpdateBySlug(slug);

  if (!update) notFound();

  // NewsArticle rather than Article: these report a dated development from a
  // primary source, which is what the type is for.
  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: update.title,
    description: update.summary,
    datePublished: update.date,
    author: { "@type": "Organization", name: "AI Integrity Certification" },
    publisher: {
      "@type": "Organization",
      name: "AI Integrity Certification",
      logo: {
        "@type": "ImageObject",
        url: "https://aiccertified.cloud/icon",
      },
    },
    mainEntityOfPage: `https://aiccertified.cloud/policy/${slug}`,
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Typographic band. Policy updates carry no hero image, and inventing a
          stock photo for a regulatory notice would dress up a fact. */}
      <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#162640] pt-24 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aic-copper to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative">
          <Link
            href="/policy"
            className="inline-flex items-center gap-2 text-aic-paper/70 hover:text-aic-copper mb-6 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All policy updates
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs text-aic-paper/70 mb-4 uppercase tracking-widest font-mono">
            <span className="px-2 py-1 bg-aic-copper text-white rounded font-medium">
              {update.tag}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={update.date}>{update.date}</time>
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-aic-paper font-bold leading-tight"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            {update.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <Card className="p-8 md:p-12 shadow-2xl border-none">
          {update.summary && (
            <p className="text-lg text-[#0f1f3d] leading-relaxed mb-10 pb-8 border-b border-[#e5e7eb]">
              {update.summary}
            </p>
          )}

          <article className="prose prose-lg max-w-none prose-slate prose-headings:font-serif prose-headings:text-[#0f1f3d] prose-a:text-aic-copper prose-strong:text-[#0f1f3d]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {update.content}
            </ReactMarkdown>
          </article>

          <div className="mt-16 pt-10 border-t border-[#e5e7eb] flex flex-col items-center text-center">
            <Shield className="w-10 h-10 text-aic-copper mb-4" />
            <h2 className="text-xl font-bold text-[#0f1f3d] mb-2 font-serif">
              Certifying the human behind the algorithm
            </h2>
            <p className="text-[#6b7280] max-w-md mx-auto mb-6">
              AIC certifies that a named human remains accountable for the
              automated decisions that matter, and publishes the result so
              anyone can check it.
            </p>
            <Link
              href="/contact"
              className="bg-aic-copper hover:bg-[#b07d08] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-aic-copper/20"
            >
              Contact us
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
