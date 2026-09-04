"use client";

import { useEffect, useMemo, useState } from "react";
import { scrollElementToTop } from "@/lib/scroll";
import Link from "next/link";
import { Star, Info, ArrowRight } from "lucide-react";
import {
  requirements,
  requirementsForDivision,
  RIGHTS,
  TIER_MEANING,
  DIVISIONS,
  type RightCode,
  type EvidenceTier,
} from "@/app/data/requirements-data";

const TIER_TONE: Record<EvidenceTier, string> = {
  A: "bg-[#10b981]/10 text-[#0a7a54] border-[#10b981]/20",
  B: "bg-[#1a3160]/10 text-[#1a3160] border-[#1a3160]/20",
  C: "bg-aic-copper/10 text-[#8a6607] border-aic-copper/20",
  D: "bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20",
};

const RIGHT_ORDER: RightCode[] = ["HU", "EX", "EM", "CO", "TR"];

export default function StandardClient() {
  // null = show everything. Filtering by Division is the question a prospect
  // actually has: not "what do you test" but "what do you test *me* on".
  const [division, setDivision] = useState<number | null>(null);

  // Which right is open, and which single requirement the reader jumped to.
  const [openRight, setOpenRight] = useState<RightCode>("HU");
  const [focused, setFocused] = useState<string | null>(null);

  // A hash of #hu / #ex / … opens that right rather than scrolling to a
  // section that is no longer rendered.
  useEffect(() => {
    const hash = window.location.hash.slice(1).toUpperCase();
    if ((RIGHT_ORDER as readonly string[]).includes(hash)) {
      setOpenRight(hash as RightCode);
    }
  }, []);

  // Clear the highlight once the reader moves on, so it marks where they
  // jumped to rather than becoming permanent decoration.
  useEffect(() => {
    if (!focused) return;
    const t = setTimeout(() => setFocused(null), 2500);
    return () => clearTimeout(t);
  }, [focused]);

  const visible = useMemo(
    () => (division === null ? requirements : requirementsForDivision(division)),
    [division]
  );

  return (
    <>
      {/* Division filter */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#0f1f3d] mb-1">
          Which of these apply to you?
        </h2>
        <p className="text-sm text-[#6b7280] mb-4">
          Requirements are scoped by Division — how much human agency sits
          between the system and the person it affects. Pick yours to see the
          set you would actually be assessed against.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDivision(null)}
            aria-pressed={division === null}
            className={`text-sm px-3.5 py-2 rounded-lg border transition-all ${
              division === null
                ? "border-aic-copper bg-aic-copper/10 text-aic-copper font-semibold"
                : "border-[#e5e7eb] bg-white text-[#0f1f3d] hover:border-aic-copper/40"
            }`}
          >
            All {requirements.length}
          </button>
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => setDivision(d)}
              aria-pressed={division === d}
              className={`text-sm px-3.5 py-2 rounded-lg border transition-all ${
                division === d
                  ? "border-aic-copper bg-aic-copper/10 text-aic-copper font-semibold"
                  : "border-[#e5e7eb] bg-white text-[#0f1f3d] hover:border-aic-copper/40"
              }`}
            >
              D{d} {DIVISIONS[d]}
              <span className="ml-1.5 text-xs opacity-60">
                {requirementsForDivision(d).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Evidence tiers, as a legend rather than a lecture.
          This was a card carrying a paragraph and four sub-cards — a screen of
          preamble standing between the reader and the standard they came for.
          The scoring rule is worth one sentence; the tiers are worth a strip. */}
      <details className="bg-white border border-[#e5e7eb] rounded-xl mb-8 group">
        <summary className="flex items-center gap-2.5 p-5 cursor-pointer list-none">
          <Info className="w-4 h-4 text-aic-copper shrink-0" />
          <span className="text-sm font-semibold text-[#0f1f3d]">
            Evidence tiers
          </span>
          <span className="flex-1 flex flex-wrap gap-1.5 min-w-0">
            {(Object.keys(TIER_MEANING) as EvidenceTier[]).map((t) => (
              <span
                key={t}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TIER_TONE[t]}`}
              >
                {t} · {TIER_MEANING[t].label}
              </span>
            ))}
          </span>
          <span className="text-xs text-[#9ca3af] shrink-0 group-open:hidden">
            How scoring works
          </span>
        </summary>
        <div className="px-5 pb-5 -mt-1">
          <p className="text-sm text-[#6b7280] leading-relaxed max-w-[70ch]">
            Each requirement names the strongest evidence it admits. Providing
            the best evidence available earns full marks; providing weaker
            evidence than you could have earns proportionally less, and
            over-providing earns no bonus. This is why an organisation cannot
            buy its way to a score with paperwork.
          </p>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
            {(Object.keys(TIER_MEANING) as EvidenceTier[]).map((t) => (
              <div key={t} className="flex gap-2.5 text-sm">
                <dt className="font-mono font-bold text-[#0f1f3d] shrink-0">
                  {t}
                  <span className="ml-1.5 text-[11px] font-normal text-[#9ca3af]">
                    ×{TIER_MEANING[t].weight.toFixed(1)}
                  </span>
                </dt>
                <dd className="text-[#6b7280] leading-relaxed">
                  {TIER_MEANING[t].desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </details>

      {/* Index, then one right at a time.
          The previous version put all 44 requirements on the page as a dense
          grid, which managed to be too long and too cramped at once: a reader
          scrolled past forty-four rows, and each row squeezed a sentence of
          prose into a table column. Both problems came from the same mistake —
          treating a reference document as something you read top to bottom.
          Nobody does. They either scan for the set that applies to them, or
          look up one code.

          So: a compact index of all 44 up front, then one right at a time
          underneath with the room to actually be read. The index carries every
          requirement's full text on its button label, so all 44 remain in the
          DOM for search and for assistive technology even while only one
          right's cards are rendered. */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
          <h2 className="text-sm font-semibold text-[#0f1f3d]">
            All {requirements.length} requirements
          </h2>
          <p className="text-xs text-[#6b7280]">
            {division === null
              ? "Every requirement in the standard."
              : `Dimmed codes do not apply to D${division}.`}
          </p>
        </div>

        <div className="space-y-2.5">
          {RIGHT_ORDER.map((right) => {
            const all = requirements.filter((r) => r.right === right);
            return (
              <div
                key={right}
                className="grid sm:grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-x-4 gap-y-1.5 items-baseline"
              >
                <button
                  type="button"
                  onClick={() => setOpenRight(right)}
                  className="text-left group"
                >
                  <span
                    className={`font-mono text-[11px] font-bold mr-1.5 ${
                      openRight === right ? "text-aic-copper" : "text-[#9ca3af]"
                    }`}
                  >
                    {right}
                  </span>
                  <span
                    className={`text-sm group-hover:text-[#0f1f3d] transition-colors ${
                      openRight === right
                        ? "text-[#0f1f3d] font-semibold"
                        : "text-[#6b7280]"
                    }`}
                  >
                    {RIGHTS[right].name}
                  </span>
                </button>

                <div className="flex flex-wrap gap-1">
                  {all.map((r) => {
                    const applies =
                      division === null || r.divisions.includes(division);
                    return (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => {
                          setOpenRight(right);
                          setFocused(r.code);
                        }}
                        title={r.text}
                        aria-label={`${r.code}: ${r.text}`}
                        className={`font-mono text-[10px] px-1.5 py-1 rounded border transition-colors ${
                          focused === r.code
                            ? "border-aic-copper bg-aic-copper text-white"
                            : applies
                            ? "border-[#e5e7eb] bg-white text-[#0f1f3d] hover:border-aic-copper/50"
                            : "border-transparent bg-[#f4f6f8] text-[#c3cbd4]"
                        }`}
                      >
                        {r.code.split("-")[1]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The open right, with room to read. */}
      <section id={openRight.toLowerCase()} className="scroll-mt-32">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
          <h2
            className="text-2xl text-[#0f1f3d] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            {RIGHTS[openRight].name}
          </h2>
          <span className="font-mono text-xs uppercase tracking-wide text-aic-copper">
            {openRight} · {visible.filter((r) => r.right === openRight).length}{" "}
            shown
          </span>
        </div>
        <p className="text-[#6b7280] mb-6">{RIGHTS[openRight].blurb}</p>

        <ol className="space-y-3">
          {visible
            .filter((r) => r.right === openRight)
            .map((r) => (
              <li
                key={r.code}
                id={`req-${r.code}`}
                ref={(el) => {
                  if (focused === r.code && el) {
                    scrollElementToTop(el);
                  }
                }}
                className={`bg-white border rounded-xl px-6 py-5 sm:px-8 sm:py-7 scroll-mt-32 transition-colors ${
                  focused === r.code
                    ? "border-aic-copper"
                    : r.flagship
                    ? "border-aic-copper/30"
                    : "border-[#e5e7eb]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="font-mono text-xs font-bold text-[#0f1f3d]">
                    {r.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${TIER_TONE[r.tier]}`}
                    title={`Best obtainable evidence: ${TIER_MEANING[r.tier].label}`}
                  >
                    Tier {r.tier} · {TIER_MEANING[r.tier].label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-[#9ca3af]">
                    D{r.divisions.join(" · D")}
                  </span>
                  {r.flagship && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-aic-copper">
                      <Star className="w-3 h-3 fill-aic-copper" />
                      Hard to fake
                    </span>
                  )}
                </div>

                <p className="text-[#0f1f3d] text-[17px] leading-[1.65] max-w-[68ch]">
                  {r.text}
                </p>

                <p className="text-sm text-[#6b7280] leading-relaxed mt-4 pt-4 border-t border-[#f1f1f0] max-w-[68ch]">
                  <span className="font-semibold text-[#0f1f3d]">
                    Evidence:{" "}
                  </span>
                  {r.evidence}
                </p>
              </li>
            ))}
        </ol>

        {visible.filter((r) => r.right === openRight).length === 0 && (
          <p className="text-[#6b7280] bg-white border border-[#e5e7eb] rounded-xl p-6">
            No {RIGHTS[openRight].name} requirements apply to Division{" "}
            {division}. That is a fact about the Division, not a gap in the
            standard.
          </p>
        )}
      </section>

      <div className="mt-14 border border-[#e5e7eb] rounded-xl bg-white p-8">
        <h2 className="text-xl font-bold text-[#0f1f3d] mb-2 font-serif">
          Tell us where this is wrong
        </h2>
        <p className="text-[#6b7280] leading-relaxed mb-5 max-w-2xl">
          This is version 1 and it is published to be challenged. If a
          requirement is unmeasurable, if a threshold is set in the wrong place,
          or if we have missed something that matters in your sector, we would
          rather hear it now than defend it later. Substantive challenges change
          the standard and are credited in the revision record.
        </p>
        <Link
          href="/contact?enquiry=standard"
          className="inline-flex items-center gap-2 bg-aic-copper hover:bg-[#b07d08] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all"
        >
          Challenge a requirement <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}
