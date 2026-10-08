import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_URL, SITE_NAME, breadcrumbLd } from "@/lib/seo";
import { GUIDES, GUIDE_BY_SLUG, guideText, type GuideBlock } from "@/app/data/guides";
import { formatDate } from "@/lib/news-shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) return {};
  const base = pageMetadata({ path: `/guides/${slug}`, title: g.seoTitle, description: g.description, cardTitle: g.title, cardKicker: "Guide", type: "article", publishedAt: g.updated });
  return {
    ...base,
    keywords: g.keywords,
    authors: [{ name: "Zander Wilken", url: `${SITE_URL}/about` }],
    openGraph: { ...base.openGraph, type: "article", modifiedTime: g.updated, authors: ["Zander Wilken"], section: "Guides" },
  };
}

function Block({ b }: { b: GuideBlock }) {
  switch (b.kind) {
    case "h2": return <h2 id={b.id}>{b.text}</h2>;
    case "p": return <p>{b.text}</p>;
    case "list": return <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "steps":
      return (
        <ol className="!list-none !pl-0 space-y-3">
          {b.items.map((s, n) => (
            <li key={s.title} className="flex gap-4 rounded-lg border border-[#dde2e8] bg-white p-4 !mt-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#0e1b2c] text-white text-sm font-semibold flex items-center justify-center" aria-hidden="true">{n + 1}</span>
              <span><strong className="block">{s.title}</strong><span className="block mt-1 text-[16px]">{s.text}</span></span>
            </li>
          ))}
        </ol>
      );
    case "note": return <p className="rounded-lg bg-[#a8772a]/10 border-l-[3px] border-[#a8772a] px-4 py-3 text-[#0e1b2c]">{b.text}</p>;
    case "quote": return <blockquote><p>{b.text}</p><footer className="mt-2 not-italic text-sm text-[#5e6b7b]">{b.cite}</footer></blockquote>;
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) notFound();

  const url = `${SITE_URL}/guides/${slug}`;
  const toc = g.body.filter((b): b is Extract<GuideBlock, { kind: "h2" }> => b.kind === "h2");
  const related = g.related.map((s) => GUIDE_BY_SLUG[s]).filter(Boolean);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: g.title,
      description: g.description,
      image: `${SITE_URL}/og?title=${encodeURIComponent(g.title)}&kicker=Guide`,
      datePublished: g.updated,
      dateModified: g.updated,
      inLanguage: "en-ZA",
      keywords: g.keywords.join(", "),
      wordCount: guideText(g).split(/\s+/).length,
      timeRequired: `PT${g.readMinutes}M`,
      author: { "@type": "Person", name: "Zander Wilken", url: `${SITE_URL}/about`, jobTitle: "Co-founder and Chief Executive Officer", worksFor: { "@id": `${SITE_URL}/#organization` } },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      citation: g.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
      about: { "@type": "Thing", name: g.question },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ q: g.question, a: g.answer }, ...g.faq].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${slug}` }]),
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
              <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
            </ol>
          </nav>
          <div className="max-w-3xl mt-6">
            <h1 className="text-[2rem] md:text-[3rem] font-bold leading-[1.08] tracking-[-0.02em]" style={{ fontFamily: "'Merriweather', serif" }}>{g.title}</h1>
            <p className="mt-6 text-sm text-white/65">
              <Link href="/about" className="text-white hover:underline">Zander Wilken</Link>, AIC. Checked against its sources on{" "}
              <time dateTime={g.updated}>{formatDate(g.updated)}</time>, {g.readMinutes} minute read
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-[minmax(0,1fr)_17rem] gap-10 lg:gap-14">
        <article className="min-w-0 max-w-[70ch]">
          <section id="answer" aria-label="The short answer" className="rounded-xl border border-[#dde2e8] bg-white p-6 md:p-7">
            <h2 className="text-base font-semibold text-[#8a6114]">{g.question}</h2>
            <p className="mt-2 text-[18px] leading-[1.7] text-[#0e1b2c]">{g.answer}</p>
          </section>

          <div className="aic-prose mt-8">
            {g.body.map((b, i) => <Block key={i} b={b} />)}
          </div>

          {g.faq.length > 0 && (
            <section className="mt-12" aria-labelledby="faq">
              <h2 id="faq" className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Questions people also ask</h2>
              <div className="mt-5 divide-y divide-[#dde2e8] border-y border-[#dde2e8]">
                {g.faq.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="cursor-pointer list-none flex justify-between gap-4 font-semibold text-[#0e1b2c]">
                      {f.q}<span aria-hidden="true" className="text-[#a8772a] group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-[#2b3a4d] leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12" aria-labelledby="sources">
            <h2 id="sources" className="text-xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Sources</h2>
            <ol className="mt-4 list-decimal pl-5 space-y-2 text-[15px] text-[#2b3a4d]">
              {g.sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener" className="text-[#8a6114] underline underline-offset-2 break-words">{s.label}</a></li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-[#5e6b7b] leading-relaxed">
              This guide explains the law and standards in general terms. It is not legal advice about your
              organisation. {SITE_NAME} is a certification body and does not consult on the systems it certifies.
            </p>
          </section>

          <section className="mt-12 rounded-xl bg-aic-navy text-white p-7 md:p-9">
            <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Check your own organisation</h2>
            <p className="text-white/75 mt-3 leading-relaxed">
              AIC Aware is a free self-assessment against the AIC standard. It takes about ten minutes and
              shows where accountability for automated decisions is missing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/aware" className="inline-flex items-center rounded-lg bg-[#c9920a] px-5 py-2.5 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">Start AIC Aware</Link>
              <Link href="/standard" className="inline-flex items-center rounded-lg border border-white/25 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-white/10 transition-colors">Read the standard</Link>
            </div>
          </section>
        </article>

        <aside className="space-y-8 lg:sticky lg:top-28 self-start">
          {toc.length >= 2 && (
            <nav aria-label="On this page">
              <h2 className="text-sm font-semibold">On this page</h2>
              <ol className="mt-3 space-y-2 text-sm">
                <li><a href="#answer" className="text-[#5e6b7b] hover:text-[#0e1b2c]">The short answer</a></li>
                {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-[#5e6b7b] hover:text-[#0e1b2c]">{h.text}</a></li>)}
                {g.faq.length > 0 && <li><a href="#faq" className="text-[#5e6b7b] hover:text-[#0e1b2c]">Questions people also ask</a></li>}
                <li><a href="#sources" className="text-[#5e6b7b] hover:text-[#0e1b2c]">Sources</a></li>
              </ol>
            </nav>
          )}
          {related.length > 0 && (
            <nav aria-label="Related guides">
              <h2 className="text-sm font-semibold">Related guides</h2>
              <ul className="mt-3 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}><Link href={`/guides/${r.slug}`} className="text-[15px] font-semibold leading-snug text-[#0e1b2c] hover:text-[#8a6114]">{r.title}</Link></li>
                ))}
              </ul>
              <Link href="/guides" className="mt-4 inline-block text-sm font-semibold text-[#8a6114] hover:underline">All guides</Link>
            </nav>
          )}
        </aside>
      </div>
    </div>
  );
}
