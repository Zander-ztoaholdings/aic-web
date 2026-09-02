import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import { getArticleBySlug } from "@/lib/notion";
import PeekModal from "@/app/components/PeekModal";

// Intercepting route: this renders INSTEAD of app/articles/[slug]/page.tsx when
// the user clicks through from /articles, so the article opens as a centre peek
// without a full page navigation. The URL still changes, so refreshing, sharing
// or arriving from search renders the real page — which is what keeps the
// per-article metadata and Article structured data doing their job.
export const revalidate = 300;

export default async function ArticlePeek({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <PeekModal label={article.title}>
      {/* Cover band — same visual language as the governance-index peek MVP */}
      <div className="relative h-28 bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#162640] shrink-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aic-copper to-transparent" />
        <div className="absolute top-4 left-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aic-copper bg-aic-copper/15 border border-aic-copper/30 px-3 py-1.5 rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      <div className="px-6 sm:px-10 pt-6 pb-4 border-b border-[#f1f1f0]">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#0f1f3d] leading-tight"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {article.title}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-[#6b7280] font-mono uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-aic-copper" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-aic-copper" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-aic-copper" />
            {article.readTime}
          </span>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-8">
        <article className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#0f1f3d] prose-a:text-aic-copper prose-strong:text-[#0f1f3d]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </article>

        <div className="mt-10 pt-6 border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/articles/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-aic-copper hover:gap-2.5 transition-all"
          >
            Open as a full page <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="text-sm text-[#6b7280] hover:text-[#0f1f3d] transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </PeekModal>
  );
}
