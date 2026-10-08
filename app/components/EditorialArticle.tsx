import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import { SITE_URL, SITE_NAME, breadcrumbLd } from "@/lib/seo";
import { KIND_LABEL, authorHref, formatDate, headingId, markdownHeadings, readingMinutes, type NewsItem, type NewsKind } from "@/lib/news";

/**
 * One reading page for everything editorial: articles and policy updates.
 *
 * Replaces two pages that each had a stock photograph for a hero, tracked
 * uppercase monospace labels and no way onward except "Back". This one puts
 * the headline and the summary first, says who wrote it and when, lists the
 * sections, and ends with related reading, which is what keeps a reader (and
 * a crawler) on the site.
 */

function textOf(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textOf((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export default function EditorialArticle({
  kind,
  slug,
  title,
  summary,
  date,
  topic,
  author,
  content,
  related,
  jurisdictions = [],
}: {
  kind: NewsKind;
  slug: string;
  title: string;
  summary: string;
  date: string;
  topic: string;
  author: string;
  content: string;
  related: NewsItem[];
  jurisdictions?: string[];
}) {
  const path = `/${kind === "article" ? "articles" : "policy"}/${slug}`;
  const url = `${SITE_URL}${path}`;
  const minutes = readingMinutes(content);
  const toc = markdownHeadings(content);
  const byline = author || "AIC editorial team";
  const bylineHref = author ? authorHref(author) : "/about";

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": kind === "policy" ? "NewsArticle" : "BlogPosting",
      headline: title.slice(0, 110),
      description: summary,
      image: `${SITE_URL}/og?title=${encodeURIComponent(title)}&kicker=${encodeURIComponent(KIND_LABEL[kind])}`,
      datePublished: date || undefined,
      dateModified: date || undefined,
      inLanguage: "en-ZA",
      articleSection: topic,
      wordCount: (content || "").split(/\s+/).filter(Boolean).length,
      timeRequired: `PT${minutes}M`,
      author: author
        ? { "@type": "Person", name: author, url: bylineHref ? `${SITE_URL}${bylineHref}` : undefined }
        : { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@type": "Blog", name: "AIC news", url: `${SITE_URL}/news` },
      ...(jurisdictions.length ? { spatialCoverage: jurisdictions.map((j) => ({ "@type": "Place", name: j })) } : {}),
    },
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "News", path: "/news" },
      { name: title, path },
    ]),
  ];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <header className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/news" className="hover:text-white">News</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/news?kind=${kind}`} className="hover:text-white">{KIND_LABEL[kind]}</Link></li>
            </ol>
          </nav>
          <div className="max-w-3xl mt-6">
            <p className="text-sm text-[#e0b85a]">{topic}</p>
            <h1 className="mt-3 text-[2rem] md:text-[3rem] font-bold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: "'Merriweather', serif" }}>
              {title}
            </h1>
            {summary && <p className="text-lg text-white/75 leading-[1.7] mt-5">{summary}</p>}
            <p className="mt-6 text-sm text-white/65">
              {bylineHref ? <Link href={bylineHref} className="text-white hover:underline">{byline}</Link> : <span className="text-white">{byline}</span>}
              {date && <>, <time dateTime={date}>{formatDate(date)}</time></>}
              {`, ${minutes} minute read`}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-[minmax(0,1fr)_17rem] gap-10 lg:gap-14">
        <article className="min-w-0 max-w-[70ch]">
          <div className="aic-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h2 id={headingId(textOf(children))}>{children}</h2>,
                h2: ({ children }) => <h2 id={headingId(textOf(children))}>{children}</h2>,
                img: ({ src, alt }) => (
                  <img src={typeof src === "string" ? src : ""} alt={alt || ""} loading="lazy" decoding="async" />
                ),
                a: ({ href, children }) => {
                  const external = typeof href === "string" && /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
                  return external
                    ? <a href={href} target="_blank" rel="noopener">{children}</a>
                    : <a href={href}>{children}</a>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {kind === "policy" && (
            <p className="mt-10 text-sm text-[#5e6b7b] leading-relaxed border-t border-[#dde2e8] pt-6">
              Policy updates record a development and its primary source. They are not legal advice.
              For where the law stands today in each country, see the{" "}
              <Link href="/regulatory-map" className="text-[#8a6114] underline underline-offset-2">regulatory map</Link>.
            </p>
          )}

          <section className="mt-12 rounded-xl bg-aic-navy text-white p-7 md:p-9">
            <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>See where your organisation stands</h2>
            <p className="text-white/75 mt-3 leading-relaxed">
              AIC Aware is a free self-assessment against the AIC standard. It takes about ten minutes
              and shows which decisions still lack a named, accountable person.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/aware" className="inline-flex items-center rounded-lg bg-[#c9920a] px-5 py-2.5 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">Start AIC Aware</Link>
              <Link href="/guides" className="inline-flex items-center rounded-lg border border-white/25 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-white/10 transition-colors">Read the guides</Link>
            </div>
          </section>
        </article>

        <aside className="space-y-8 lg:sticky lg:top-28 self-start">
          {toc.length >= 2 && (
            <nav aria-label="On this page">
              <h2 className="text-sm font-semibold text-[#0e1b2c]">On this page</h2>
              <ol className="mt-3 space-y-2 text-sm">
                {toc.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`} className="text-[#5e6b7b] hover:text-[#0e1b2c]">{h.text}</a></li>
                ))}
              </ol>
            </nav>
          )}
          {related.length > 0 && (
            <nav aria-label="Related reading">
              <h2 className="text-sm font-semibold text-[#0e1b2c]">Related reading</h2>
              <ul className="mt-3 space-y-4">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="group block">
                      <span className="block text-xs text-[#5e6b7b]">{KIND_LABEL[r.kind]}{r.date ? `, ${formatDate(r.date)}` : ""}</span>
                      <span className="block text-[15px] font-semibold leading-snug text-[#0e1b2c] group-hover:text-[#8a6114]">{r.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/news" className="mt-4 inline-block text-sm font-semibold text-[#8a6114] hover:underline">All news</Link>
            </nav>
          )}
        </aside>
      </div>
    </div>
  );
}
