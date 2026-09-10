import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  allJurisdictions,
  jurisdictionBySlug,
  countriesForJurisdictions,
} from "@/app/data/regulatory-data";
import { getPolicyUpdates } from "@/lib/notion";
import JurisdictionRecord from "@/app/components/JurisdictionRecord";

/**
 * A jurisdiction's own page.
 *
 * WHY THIS EXISTS, given the side panel already showed all of this.
 *
 * The brief that prompted it assumed the panel was a thin summary and that a
 * country page would add depth. Reading the code, the opposite was true: the
 * panel already rendered the entire record — status, framework, authority,
 * summary, obligations, key dates, enforcement, sources, updates and the PDF.
 * There was no further depth to reveal, because there is no further data.
 *
 * So this page is not built for depth. It is built for distribution. A social
 * campaign cannot point at a country — it can only point at a world map that
 * opens on the Atlantic. Every jurisdiction now has a URL that can be posted,
 * indexed, linked and cited, which is the actual bottleneck.
 *
 * The honest consequence is that the panel should get lighter rather than this
 * page heavier: the panel answers "where does this country stand", and this
 * page is the record.
 *
 * What it deliberately does NOT do is manufacture the sector views, use-case
 * views and control mappings the brief also described. Those are research, not
 * markup. Eighteen of the twenty-eight jurisdictions here have no depth
 * recorded at all, and inventing it for a page about regulatory honesty would
 * be self-refuting. Where depth is missing this page says so.
 */

const SITE = "https://aiccertified.cloud";


/** What a status means for someone deciding whether to act. Plain English. */
const STATUS_MEANING: Record<string, string> = {
  "In force": "Obligations apply now. Non-compliance is actionable today.",
  "Enacted — phasing in":
    "Law is passed and dates are fixed. Some duties already bite; others have a known deadline.",
  "Proposed / draft legislation":
    "Nothing binding yet. The direction is visible enough to design against, but the text can still change.",
  "Voluntary framework":
    "No legal duty. Adoption is a commercial and reputational choice rather than a compliance one.",
  "Guidance only":
    "A regulator has stated expectations without binding force. Often a preview of what becomes law.",
  "No dedicated AI law identified":
    "No AI-specific instrument found. General law — data protection, consumer, sectoral — still applies.",
};

export const revalidate = 300;

export function generateStaticParams() {
  return allJurisdictions().map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const j = jurisdictionBySlug(country);
  if (!j) return {};

  const title = `AI regulation in ${j.name}`;
  const description = `${j.status} — ${j.framework}, administered by ${j.authority}. Last verified ${j.verifiedAt} by AIC.`;

  return {
    title,
    description,
    alternates: { canonical: `/regulatory-map/${j.slug}` },
    openGraph: {
      title: `${title} | AIC`,
      description,
      url: `${SITE}/regulatory-map/${j.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${title} | AIC`, description },
  };
}

export default async function JurisdictionPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const j = jurisdictionBySlug(country);
  if (!j) notFound();

  // Updates that name this jurisdiction, newest first.
  const data = await getPolicyUpdates(100);
  const updates = (data?.results ?? [])
    .filter(
      (u) => u.slug && countriesForJurisdictions(u.jurisdictions).includes(j.id)
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `AI regulation in ${j.name}`,
    description: j.summary,
    dateModified: j.verifiedAt,
    isPartOf: { "@type": "WebSite", name: "AI Integrity Certification", url: SITE },
    publisher: { "@type": "Organization", name: "AI Integrity Certification", url: SITE },
    about: { "@type": "Legislation", name: j.framework, legislationJurisdiction: j.name },
    mainEntityOfPage: `${SITE}/regulatory-map/${j.slug}`,
  };

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* WHERE — and immediately, how current this is. */}
      <section className="bg-aic-navy text-white py-12 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back to the map AND to this country on it. A shared link lands
              here, and this page has no map on it, so without the query the
              only route back into the thing people actually came to use is to
              find the country again by hand. */}
          <Link
            href={`/regulatory-map?j=${j.slug}`}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-aic-copper transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> See {j.name} on the map
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
              {j.region}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
              Verified {j.verifiedAt}
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl mb-5 leading-[1.05] tracking-[-0.03em] font-bold text-balance"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            AI regulation in {j.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded border bg-white/10 border-white/20 text-white">
              {j.status}
            </span>
            <span className="text-sm text-white/60 max-w-xl leading-[1.6]">
              {STATUS_MEANING[j.status]}
            </span>
          </div>

          <p className="text-lg text-white/70 max-w-3xl leading-[1.7]">{j.summary}</p>
        </div>
      </section>

      {/* The same draft-one notice as the map. This page is what a shared
          link opens, so most readers will never see the map's copy of it. */}
      <section className="pt-10 md:pt-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="border border-aic-copper/30 bg-aic-copper/[0.06] rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper font-semibold">
                Draft one
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9ca3af]">
                First published version
              </span>
            </div>
            <p className="text-sm text-[#0f1f3d] leading-[1.7]">
              This is the first public release of AIC&apos;s regulatory map and it
              will change. Orientation, not legal advice — read the primary
              sources before relying on it.{" "}
              <Link href="/contact" className="text-aic-copper hover:underline font-semibold">
                Tell us what is wrong or missing
              </Link>{" "}
              and it goes into the next draft.
            </p>
          </div>
        </div>
      </section>

      <JurisdictionRecord j={j} updates={updates} />

      {/* Scope limit, stated at the bottom of every jurisdiction page. */}
      <section className="py-10 border-t border-[#e5e7eb] bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-sm text-[#6b7280] leading-[1.7] max-w-3xl">
            This page is a general orientation guide built from public sources, not legal
            advice, and it does not establish that any organisation complies with{" "}
            {j.name}&apos;s requirements. AIC certifies governance against its own published
            standard; that is a different question from legal compliance, and neither
            substitutes for the other.{" "}
            <Link href="/regulatory-map" className="text-aic-copper hover:underline">
              Back to the map
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
