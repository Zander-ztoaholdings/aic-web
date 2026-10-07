import Link from "next/link";
import { ExternalLink, Download, CalendarClock } from "lucide-react";
import type { CountryRegulation } from "@/app/data/regulatory-data";
import JurisdictionStandardLayer from "@/app/components/JurisdictionStandardLayer";
import JurisdictionFrameworks from "@/app/components/JurisdictionFrameworks";
import { RecordHeading } from "@/app/components/RecordHeading";

/** A policy update as both callers already shape it. */
export interface RecordUpdate {
  slug: string;
  title: string;
  date: string;
  tag?: string;
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
 * October 2026: the record now reads in the order a reader's questions arrive.
 * What the law asks, duty by duty, with where each duty meets the AIC standard
 * beside it; then every framework AIC offers that applies here, not only
 * certification; then what certification itself would ask. The tracked-caps
 * monospace labels are gone in favour of plain headings.
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
      <div className="max-w-5xl mx-auto px-5 md:px-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] gap-10 lg:gap-14 items-start">
        <div className="space-y-14">
          {/* The instrument and what it asks */}
          <div>
            <RecordHeading
              lede={<>Administered by <strong className="font-semibold text-[#0f1f3d]">{j.authority}</strong>.</>}
            >
              {j.framework}
            </RecordHeading>

            {j.detail ? (
              <>
                <h3 className="text-[15px] font-semibold text-[#0f1f3d] mb-1">What it asks of you</h3>
                <p className="text-sm text-[#5e6b7b] leading-[1.6] mb-4 max-w-[62ch]">
                  Beside each duty, where it meets the AIC standard. That pairing is AIC&apos;s reading, not legal advice.
                </p>
                <ol className="border-y border-[#dde2e8] divide-y divide-[#dde2e8]">
                  {j.detail.obligations.map((o, i) => {
                    const c = j.detail?.coverage?.[i] ?? null;
                    return (
                      <li key={i} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] gap-3 md:gap-8 py-5">
                        <p className="text-[#0f1f3d] text-[15px] leading-[1.65]">{o}</p>
                        {c ? (
                          <div className="text-sm leading-[1.6] md:border-l md:border-[#dde2e8] md:pl-5">
                            <p className="text-[#5e6b7b] mb-2">{c.note}</p>
                            <p className="flex flex-wrap gap-1.5" aria-label="AIC requirements">
                              {c.codes.map((code) => (
                                <Link
                                  key={code}
                                  href={`/standard#req-${code}`}
                                  className="rounded-full border border-[#dde2e8] bg-white px-2 py-0.5 text-[12.5px] font-medium text-[#0f1f3d] hover:border-[#a8772a] hover:text-[#8a6114] transition-colors"
                                >
                                  {code}
                                </Link>
                              ))}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-[#5e6b7b] leading-[1.6] md:border-l md:border-[#dde2e8] md:pl-5">
                            Nothing in the AIC standard maps to this.
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>

                <h3 className="text-[15px] font-semibold text-[#0f1f3d] mt-10 mb-3">Timeline</h3>
                <dl className="border-y border-[#dde2e8] divide-y divide-[#dde2e8]">
                  {j.detail.keyDates.map((d, i) => (
                    <div key={i} className="grid sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-1 sm:gap-5 py-3">
                      <dt className="text-sm text-[#5e6b7b] flex items-center gap-1.5 tabular-nums">
                        <CalendarClock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {d.date}
                      </dt>
                      <dd className="text-sm text-[#0f1f3d] leading-[1.6]">{d.event}</dd>
                    </div>
                  ))}
                </dl>

                <h3 className="text-[15px] font-semibold text-[#0f1f3d] mt-10 mb-2">Who enforces it</h3>
                <p className="text-[#5e6b7b] leading-[1.65] max-w-[62ch]">{j.detail.enforcement}</p>
              </>
            ) : (
              /* The honest state. Most jurisdictions sit here, and saying so is
                 better than padding the page out to look like the ones that
                 don't. */
              <div className="border border-dashed border-[#dde2e8] rounded-xl p-6 bg-white">
                <h3 className="text-[#0f1f3d] font-semibold mb-2">Not yet mapped duty by duty</h3>
                <p className="text-[#5e6b7b] text-sm leading-[1.65] mb-3">
                  AIC has verified {j.name}&apos;s regulatory position: the status, the
                  instrument and the administering body are checked against primary
                  sources. What is not here is the breakdown of what the instrument
                  requires, because we have not done that work for this jurisdiction yet,
                  and the frameworks below are not paired to it duty by duty for the same reason.
                </p>
                <p className="text-[#5e6b7b] text-sm leading-[1.65]">
                  If {j.name} matters to your organisation,{" "}
                  <Link href="/contact" className="text-[#8a6114] underline-offset-2 hover:underline">
                    tell us
                  </Link>{" "}
                  and it moves up the queue.
                </p>
              </div>
            )}
          </div>

          <JurisdictionFrameworks j={j} />

          <JurisdictionStandardLayer j={j} />

          {updates.length > 0 && (
            <div>
              <RecordHeading>What changed</RecordHeading>
              <ul className="border-y border-[#dde2e8] divide-y divide-[#dde2e8]">
                {updates.map((u) => (
                  <li key={u.slug}>
                    <Link href={`/policy/${u.slug}`} className="group block py-4">
                      <span className="block text-[13px] text-[#5e6b7b] mb-1">
                        {u.date}
                        {u.tag ? `, ${u.tag}` : ""}
                      </span>
                      <span className="text-[#0f1f3d] font-semibold leading-snug group-hover:text-[#8a6114] transition-colors">
                        {u.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rail: check our work, then the one commercial line. */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="rounded-xl bg-white border border-[#dde2e8] p-6">
            <h3 className="text-[#0f1f3d] font-semibold mb-2">Checked {j.verifiedAt}</h3>
            <p className="text-sm text-[#5e6b7b] leading-[1.65]">
              Each jurisdiction carries its own date, because one date across the whole map
              lets a stale entry hide behind a fresh one. If this looks old to you, it is
              old: tell us and we will check it again.
            </p>
            {j.detail && j.detail.sources.length > 0 && (
              <>
                <h3 className="text-[#0f1f3d] font-semibold mt-5 mb-2">Primary sources</h3>
                <ul className="space-y-2.5">
                  {j.detail.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-2 text-sm text-[#0f1f3d] hover:text-[#8a6114] transition-colors leading-[1.5]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#5e6b7b]" aria-hidden="true" />
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <a
            href={`/compliance-measures/${j.pdfSlug}.pdf`}
            className="flex items-center justify-center gap-2 border border-[#dde2e8] rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0f1f3d] hover:border-[#a8772a] hover:text-[#8a6114] transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download the draft compliance measures
          </a>

          {/* The commercial line. One block, after the useful part, and careful
              not to imply certification equals compliance. */}
          <div className="rounded-xl bg-[#f5f7f9] p-6">
            <h3 className="text-[#0f1f3d] font-semibold mb-2">Where do you stand?</h3>
            <p className="text-sm text-[#5e6b7b] leading-[1.65] mb-4">
              AIC Aware is a free self-check against the five Algorithmic Rights. It is not a
              legal compliance check and no certification follows from it. It tells you which
              of your own governance controls are missing, which is usually the first thing
              anyone needs to know.
            </p>
            <Link href="/aware" className="text-sm font-semibold text-[#8a6114] underline-offset-2 hover:underline">
              Take the AIC Aware check
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
