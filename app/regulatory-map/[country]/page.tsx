import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Download, ShieldCheck, CalendarClock } from "lucide-react";
import {
  allJurisdictions,
  jurisdictionBySlug,
  countriesForJurisdictions,
  type CountryRegulation,
} from "@/app/data/regulatory-data";
import { getPolicyUpdates } from "@/lib/notion";

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

function VerificationNote({ j }: { j: CountryRegulation }) {
  return (
    <div className="border border-[#e5e7eb] rounded-xl bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-aic-copper" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
          Verification
        </span>
      </div>
      <p className="text-sm text-[#0f1f3d] leading-[1.65] mb-2">
        This entry was last checked against its primary source on{" "}
        <strong>{j.verifiedAt}</strong>.
      </p>
      <p className="text-sm text-[#6b7280] leading-[1.65]">
        AIC dates every jurisdiction separately rather than stamping one date across the
        whole dataset, because a single date lets a stale entry hide behind a fresh one.
        If this date looks old to you, it is old — tell us and we will re-check it.
      </p>
    </div>
  );
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
      {/* lg:min-h is load-bearing, not styling: it guarantees the room the
          country silhouette needs. The silhouette itself is positioned against
          a fixed axis in lib/country-flight.ts, and this block is anchored to
          the top of the section rather than centred in it, so that the heading
          lands in the same place whether the summary runs to one line or four.
          The map's hand-off veil reproduces this exact structure. */}
      <section className="bg-aic-navy text-white py-12 md:py-14 lg:min-h-[30rem]">
        {/* The right-hand padding is reserving space for the country
            silhouette, which is not rendered here — it belongs to
            CountrySilhouetteLayer in the segment layout, because it has to
            outlive the navigation that brings you to this page. See
            lib/country-flight.ts. */}
        <div className="max-w-5xl mx-auto px-4 lg:pr-[23rem]">
          <Link
            href="/regulatory-map"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-aic-copper transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Regulatory map
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

      <section className="py-12 md:py-14">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] gap-10 lg:gap-14 items-start">
          {/* Main column — WHAT, WHEN, WHO ENFORCES */}
          <div className="space-y-10">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                The instrument
              </span>
              <h2
                className="text-xl md:text-2xl text-[#0f1f3d] mt-2 mb-4 font-bold leading-[1.2]"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {j.framework}
              </h2>
              <p className="text-[#6b7280] leading-[1.65]">
                Administered by <strong className="text-[#0f1f3d]">{j.authority}</strong>.
              </p>
            </div>

            {j.detail ? (
              <>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                    What it requires
                  </span>
                  <ul className="mt-4 space-y-3">
                    {j.detail.obligations.map((o, i) => (
                      <li
                        key={i}
                        className="text-[#0f1f3d] text-[15px] leading-[1.65] pl-4 border-l-2 border-[#e5e7eb]"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                    Timeline
                  </span>
                  <div className="mt-4 border border-[#e5e7eb] rounded-xl bg-white divide-y divide-[#f1f1f0]">
                    {j.detail.keyDates.map((d, i) => (
                      <div
                        key={i}
                        className="grid sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-1 sm:gap-5 px-5 py-3.5"
                      >
                        <dt className="font-mono text-[11px] uppercase tracking-wide text-[#9ca3af] pt-0.5 flex items-center gap-1.5">
                          <CalendarClock className="w-3 h-3 shrink-0" />
                          {d.date}
                        </dt>
                        <dd className="text-sm text-[#0f1f3d] leading-[1.6]">{d.event}</dd>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                    Enforcement
                  </span>
                  <p className="text-[#6b7280] leading-[1.65] mt-3">{j.detail.enforcement}</p>
                </div>
              </>
            ) : (
              /* The honest state. Eighteen of twenty-eight jurisdictions sit
                 here, and saying so is better than padding the page out to look
                 like the ones that don't. */
              <div className="border border-dashed border-[#e5e7eb] rounded-xl p-6 bg-white">
                <h2 className="text-[#0f1f3d] font-semibold mb-2">
                  Not yet mapped to obligation level
                </h2>
                <p className="text-[#6b7280] text-sm leading-[1.65] mb-3">
                  AIC has verified {j.name}&apos;s regulatory position — the status, the
                  instrument and the administering body above are checked against primary
                  sources. What is not here is the clause-by-clause breakdown of what the
                  instrument requires, because we have not done that work for this
                  jurisdiction yet.
                </p>
                <p className="text-[#6b7280] text-sm leading-[1.65]">
                  We would rather leave that visible than write a plausible-sounding
                  summary nobody checked. If {j.name} matters to your organisation,{" "}
                  <Link href="/contact" className="text-aic-copper hover:underline">
                    tell us
                  </Link>{" "}
                  and it moves up the queue.
                </p>
              </div>
            )}

            {updates.length > 0 && (
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                  What changed
                </span>
                <div className="mt-4 space-y-3">
                  {updates.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/policy/${u.slug}`}
                      className="block border border-[#e5e7eb] rounded-xl bg-white p-5 hover:border-aic-copper/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-[#9ca3af]">
                          {u.date}
                        </span>
                        {u.tag && (
                          <span className="font-mono text-[10px] uppercase tracking-wide text-aic-copper">
                            {u.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[#0f1f3d] font-semibold leading-snug group-hover:text-aic-copper transition-colors">
                        {u.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rail — check our work, then the one commercial line. */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            <VerificationNote j={j} />

            {j.detail && j.detail.sources.length > 0 && (
              <div className="border border-[#e5e7eb] rounded-xl bg-white p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                  Primary sources
                </span>
                <p className="text-xs text-[#9ca3af] leading-[1.6] mt-2 mb-4">
                  Read the instrument rather than trusting our summary of it.
                </p>
                <ul className="space-y-3">
                  {j.detail.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-2 text-sm text-[#0f1f3d] hover:text-aic-copper transition-colors leading-[1.5]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9ca3af]" />
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={`/compliance-measures/${j.pdfSlug}.pdf`}
              className="flex items-center justify-center gap-2 border border-[#e5e7eb] rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0f1f3d] hover:border-aic-copper hover:text-aic-copper transition-colors"
            >
              <Download className="w-4 h-4" />
              Draft compliance measures
            </a>

            {/* The commercial line. One block, at the end, after the useful part
                — and careful not to imply certification equals compliance. */}
            <div className="border border-aic-copper/30 rounded-xl bg-aic-copper/[0.04] p-6">
              <h3 className="text-[#0f1f3d] font-semibold mb-2">Where do you stand?</h3>
              <p className="text-sm text-[#6b7280] leading-[1.65] mb-4">
                AIC Aware is a free self-assessment against the five Algorithmic Rights. It
                is not a legal compliance check and no certification follows from it — it
                tells you which of your own governance controls are missing, which is
                usually the first thing anyone needs to know.
              </p>
              <Link
                href="/aware"
                className="inline-flex items-center gap-2 text-sm font-bold text-aic-copper hover:underline"
              >
                Run AIC Aware →
              </Link>
            </div>
          </aside>
        </div>
      </section>

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
