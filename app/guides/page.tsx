import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { GUIDES } from "@/app/data/guides";
import { formatDate } from "@/lib/news-shared";

export const metadata: Metadata = pageMetadata({
  path: "/guides",
  title: "AI governance guides for South African organisations",
  description: "Plain-language guides to POPIA section 71, King V and AI, the EU AI Act, ISO/IEC 42001 and AI governance in South Africa, each with its sources.",
  cardTitle: "AI governance guides, with the sources",
  cardKicker: "Guides",
});

export default function GuidesIndex() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "AI governance guides",
      url: `${SITE_URL}/guides`,
      inLanguage: "en-ZA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@type": "ItemList", itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/guides/${g.slug}`, name: g.title })) },
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]),
  ];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4">Guides</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>
              The questions we are asked most, answered in full
            </h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              What South African law asks of automated decisions, what boards must now oversee, and how
              the international standards fit. Each guide answers its question in the first paragraph and
              lists every source it relies on.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col rounded-xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] transition-colors">
                <h2 className="text-lg font-bold leading-snug group-hover:underline decoration-[#a8772a] underline-offset-4" style={{ fontFamily: "'Merriweather', serif" }}>{g.title}</h2>
                <p className="mt-3 text-[15px] text-[#5e6b7b] leading-relaxed">{g.description}</p>
                <p className="mt-auto pt-5 text-sm text-[#5e6b7b]">{g.readMinutes} minute read, checked {formatDate(g.updated)}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Link href="/glossary" className="group rounded-xl bg-white border border-[#dde2e8] p-6 hover:border-[#a8772a] transition-colors">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Glossary</h2>
            <p className="mt-2 text-[15px] text-[#5e6b7b] leading-relaxed">The terms used in AI governance, from automated decision to conformity assessment, defined in a sentence or two.</p>
          </Link>
          <Link href="/news" className="group rounded-xl bg-white border border-[#dde2e8] p-6 hover:border-[#a8772a] transition-colors">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Merriweather', serif" }}>News and policy updates</h2>
            <p className="mt-2 text-[15px] text-[#5e6b7b] leading-relaxed">What has changed recently in AI regulation, each development with its primary source.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
