import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { TERMS } from "@/app/data/glossary";

export const metadata: Metadata = pageMetadata({
  path: "/glossary",
  title: "AI governance glossary: terms defined plainly",
  description: "Automated decision, human in the loop, disparate impact, conformity assessment, POPIA, King V and more: the terms of AI governance, defined in a sentence or two.",
  cardTitle: "AI governance glossary",
  cardKicker: "Glossary",
});

export default function GlossaryPage() {
  const terms = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));
  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))];
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/glossary`,
      name: "AI governance glossary",
      url: `${SITE_URL}/glossary`,
      inLanguage: "en-ZA",
      publisher: { "@id": `${SITE_URL}/#organization` },
      hasDefinedTerm: terms.map((t) => ({
        "@type": "DefinedTerm",
        "@id": `${SITE_URL}/glossary#${t.id}`,
        name: t.term,
        description: t.definition,
        ...(t.also ? { alternateName: t.also } : {}),
        inDefinedTermSet: `${SITE_URL}/glossary`,
      })),
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: "Glossary", path: "/glossary" }]),
  ];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4"><Link href="/guides" className="hover:text-white">Guides</Link> / Glossary</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>AI governance, in plain words</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              The terms that come up in AI law, standards and board papers, each defined in a sentence or two,
              with a link to where we say more.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <nav aria-label="Jump to letter" className="flex flex-wrap gap-1.5">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="w-9 h-9 rounded-md bg-white border border-[#dde2e8] flex items-center justify-center text-sm font-semibold hover:border-[#a8772a]">{l}</a>
          ))}
        </nav>

        <div className="mt-8 max-w-[75ch]">
          {letters.map((l) => (
            <section key={l} id={`letter-${l}`} className="scroll-mt-28">
              <h2 className="text-2xl font-bold mt-10 mb-2 text-[#a8772a]" style={{ fontFamily: "'Merriweather', serif" }}>{l}</h2>
              <dl className="divide-y divide-[#dde2e8]">
                {terms.filter((t) => t.term[0].toUpperCase() === l).map((t) => (
                  <div key={t.id} id={t.id} className="py-5 scroll-mt-28">
                    <dt className="text-lg font-bold text-[#0e1b2c]">
                      <a href={`#${t.id}`} className="hover:text-[#8a6114]">{t.term}</a>
                      {t.also && <span className="ml-2 text-sm font-normal text-[#5e6b7b]">also {t.also.join(", ")}</span>}
                    </dt>
                    <dd className="mt-2 text-[#2b3a4d] leading-relaxed">
                      {t.definition}
                      {t.link && <> <Link href={t.link.href} className="text-[#8a6114] underline underline-offset-2">{t.link.label}</Link></>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
