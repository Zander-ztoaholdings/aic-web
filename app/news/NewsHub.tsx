import Link from "next/link";
import { getNews } from "@/lib/news";
import { SITE_URL, breadcrumbLd } from "@/lib/seo";
import { GUIDES } from "@/app/data/guides";
import NewsList, { NewsSignup } from "./NewsList";

const COPY = {
  all: { kicker: "News", h1: "AI regulation and accountability, as it happens", lede: "Policy updates on AI law in South Africa and beyond, each with its primary source, and analysis from AIC on what they mean for the people who answer for automated decisions.", path: "/news" },
  policy: { kicker: "Policy updates", h1: "AI policy updates, with their sources", lede: "Regulatory and standards developments affecting accountable AI. Each entry states its primary source. We do not assert a deadline we have not read in the instrument itself.", path: "/policy" },
  article: { kicker: "Analysis", h1: "Analysis on AI accountability", lede: "Writing from AIC on AI accountability, certification practice and regulation, from POPIA section 71 to the EU AI Act.", path: "/articles" },
} as const;

/** The page behind /news, /policy and /articles: one design, one list. */
export default async function NewsHub({ kind }: { kind: "all" | "policy" | "article" }) {
  const news = await getNews();
  const items = news ?? [];
  const scoped = kind === "all" ? items : items.filter((i) => i.kind === kind);
  const c = COPY[kind];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: c.h1,
      description: c.lede,
      url: `${SITE_URL}${c.path}`,
      inLanguage: "en-ZA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: scoped.slice(0, 30).map((i, n) => ({ "@type": "ListItem", position: n + 1, url: `${SITE_URL}${i.href}`, name: i.title })),
      },
    },
    breadcrumbLd(kind === "all" ? [{ name: "Home", path: "/" }, { name: "News", path: "/news" }] : [{ name: "Home", path: "/" }, { name: "News", path: "/news" }, { name: c.kicker, path: c.path }]),
  ];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4">
              {kind === "all" ? c.kicker : <><Link href="/news" className="hover:text-white">News</Link> / {c.kicker}</>}
            </p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>{c.h1}</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">{c.lede}</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-[minmax(0,1fr)_19rem] gap-10 lg:gap-14">
        <div className="min-w-0">
          <NewsList items={scoped} initialKind={kind} lockKind={kind !== "all"} unavailable={news === null} />
          <div className="mt-12"><NewsSignup /></div>
        </div>

        <aside className="space-y-8 self-start">
          <nav aria-label="Guides">
            <h2 className="text-base font-bold text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>Guides</h2>
            <p className="mt-1 text-sm text-[#5e6b7b]">The questions we are asked most, answered in full.</p>
            <ul className="mt-4 space-y-3">
              {GUIDES.map((g) => (
                <li key={g.slug}><Link href={`/guides/${g.slug}`} className="text-[15px] font-semibold leading-snug text-[#0e1b2c] hover:text-[#8a6114]">{g.title}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-[#dde2e8] pt-6">
            <h2 className="text-base font-bold text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>Where the law stands</h2>
            <p className="mt-1 text-sm text-[#5e6b7b] leading-relaxed">Updates record what changed. The regulatory map records the current position in each country we track.</p>
            <Link href="/regulatory-map" className="mt-3 inline-block text-sm font-semibold text-[#8a6114] hover:underline">Open the regulatory map</Link>
          </div>
          <div className="border-t border-[#dde2e8] pt-6">
            <h2 className="text-base font-bold text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>Words we use</h2>
            <p className="mt-1 text-sm text-[#5e6b7b] leading-relaxed">Automated decision, human in the loop, conformity assessment and the rest, defined plainly.</p>
            <Link href="/glossary" className="mt-3 inline-block text-sm font-semibold text-[#8a6114] hover:underline">Open the glossary</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
