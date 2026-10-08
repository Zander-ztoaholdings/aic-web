import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PeekModal from "@/app/components/PeekModal";
import { formatDate, readingMinutes } from "@/lib/news-shared";

/** The centre peek for an article or policy update opened from a list. The
 *  full page (with its structured data) is one click away and is what a
 *  refresh, a shared link or a crawler gets. */
export default function PeekArticle({ href, kicker, title, summary, date, author, content }: {
  href: string; kicker: string; title: string; summary: string; date: string; author: string; content: string;
}) {
  return (
    <PeekModal label={title}>
      <div className="bg-aic-navy text-white px-6 sm:px-10 pt-7 pb-7 shrink-0">
        <p className="text-sm text-[#e0b85a]">{kicker}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: "'Merriweather', serif" }}>{title}</h2>
        <p className="mt-3 text-sm text-white/65">
          {author || "AIC editorial team"}
          {date && <>, <time dateTime={date}>{formatDate(date)}</time></>}
          {`, ${readingMinutes(content)} minute read`}
        </p>
      </div>
      <div className="px-6 sm:px-10 py-8">
        {summary && <p className="text-[#0e1b2c] text-lg leading-relaxed mb-8 pb-6 border-b border-[#dde2e8]">{summary}</p>}
        <div className="aic-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        <div className="mt-10 pt-6 border-t border-[#dde2e8] flex flex-wrap items-center justify-between gap-4">
          <Link href={href} className="text-sm font-semibold text-[#8a6114] hover:underline">Open as a full page</Link>
          <Link href="/news" className="text-sm text-[#5e6b7b] hover:text-[#0e1b2c]">All news</Link>
        </div>
      </div>
    </PeekModal>
  );
}
