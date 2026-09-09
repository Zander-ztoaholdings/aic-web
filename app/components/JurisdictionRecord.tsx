import Link from "next/link";
import { ExternalLink, Download, ShieldCheck, CalendarClock } from "lucide-react";
import type { CountryRegulation } from "@/app/data/regulatory-data";
import JurisdictionStandardLayer from "@/app/components/JurisdictionStandardLayer";

/** A policy update as both callers already shape it. */
export interface RecordUpdate {
  slug: string;
  title: string;
  date: string;
  tag?: string;
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


/**
 * The full regulatory record for one jurisdiction.
 *
 * Extracted so the standalone page at /regulatory-map/<slug> and the map's
 * in-place expanded view render from one source. They previously would have
 * been two copies of the same two hundred lines, which is how a fix lands on
 * one of them and the site starts telling two versions of the same story —
 * unusually bad for a page whose subject is what a regulator actually requires.
 *
 * Deliberately free of server-only imports so a client component can use it.
 */
export default function JurisdictionRecord({
  j,
  updates,
}: {
  j: CountryRegulation;
  updates: RecordUpdate[];
}) {
  return (
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

            <JurisdictionStandardLayer j={j} />

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
  );
}
