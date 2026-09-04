"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHashTarget } from "@/lib/scroll";
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

  // Re-applies #hu / #ex / #em / #co / #tr once these sections actually exist.
  useHashTarget();

  // Which right the reader is currently inside. Observed rather than computed
  // from scroll offsets, so it stays correct when the Division filter changes
  // every section's height underneath it.
  const [activeRight, setActiveRight] = useState<RightCode>("HU");
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = RIGHT_ORDER.map((r) => document.getElementById(r.toLowerCase()))
      .filter((e): e is HTMLElement => e !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (onScreen?.target.id) {
          setActiveRight(onScreen.target.id.toUpperCase() as RightCode);
        }
      },
      // Top band of the viewport, just under the sticky header.
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [division]);

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

      {/* Evidence tiers */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-10">
        <div className="flex items-start gap-2.5 mb-4">
          <Info className="w-4 h-4 text-aic-copper shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-[#0f1f3d] mb-1">
              Evidence tiers
            </h2>
            <p className="text-sm text-[#6b7280] leading-relaxed">
              Each requirement names the strongest evidence it admits. Providing
              the best evidence available earns full marks; providing weaker
              evidence than you could have earns proportionally less.
              Over-providing earns no bonus. This is why an organisation cannot
              buy its way to a score with paperwork.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(TIER_MEANING) as EvidenceTier[]).map((t) => (
            <div key={t} className="flex items-start gap-3 p-3 rounded-lg bg-[#f0f4f8]">
              <span
                className={`shrink-0 w-7 h-7 rounded-md border flex items-center justify-center text-xs font-bold ${TIER_TONE[t]}`}
              >
                {t}
              </span>
              <div>
                <div className="text-sm font-medium text-[#0f1f3d]">
                  {TIER_MEANING[t].label}
                  <span className="ml-2 text-xs font-mono text-[#9ca3af]">
                    ×{TIER_MEANING[t].weight.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-[#6b7280] leading-relaxed mt-0.5">
                  {TIER_MEANING[t].desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A rail that stays with you.
          44 requirements across five rights is a long document, and the
          reader's question part-way down is always "which right am I in, and
          how do I get to the one I actually need". The rail answers both
          without scrolling back, and the active state is driven by which
          section is under the header — not by scroll maths, so it stays honest
          when sections change height under a Division filter. */}
      {/* The requirements.
          Rendered as a specification, not a feed of cards. 44 identical
          rounded cards down a single column made the reader scroll past the
          document rather than read across it — and a standard is a thing you
          scan and compare, so it wants the density of a table. One DOM: a
          grid that stacks on a phone and lines up into columns from md. */}
      <div className="grid lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
        <nav
          aria-label="The five rights"
          className="hidden lg:block lg:sticky lg:top-32"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af] block mb-3">
            Five rights
          </span>
          <ul className="space-y-0.5">
            {RIGHT_ORDER.map((right) => {
              const n = visible.filter((r) => r.right === right).length;
              if (n === 0) return null;
              const isActive = activeRight === right;
              return (
                <li key={right}>
                  <a
                    href={`#${right.toLowerCase()}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-baseline gap-2 py-1.5 px-2.5 -mx-2.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-aic-copper/10 text-[#0f1f3d]"
                        : "text-[#6b7280] hover:text-[#0f1f3d]"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold shrink-0 ${
                        isActive ? "text-aic-copper" : "text-[#9ca3af]"
                      }`}
                    >
                      {right}
                    </span>
                    <span className="text-sm flex-1 min-w-0 truncate">
                      {RIGHTS[right].name}
                    </span>
                    <span className="font-mono text-[10px] text-[#9ca3af] tabular-nums shrink-0">
                      {n}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div ref={sectionsRef} className="space-y-12 min-w-0">
        {RIGHT_ORDER.map((right) => {
          const group = visible.filter((r) => r.right === right);
          if (group.length === 0) return null;
          return (
            <section key={right} id={right.toLowerCase()}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                <h2
                  className="text-2xl text-[#0f1f3d] font-bold"
                  style={{ fontFamily: "'Merriweather', serif" }}
                >
                  {RIGHTS[right].name}
                </h2>
                <span className="font-mono text-xs uppercase tracking-wide text-aic-copper">
                  {right} · {group.length}{" "}
                  {group.length === 1 ? "requirement" : "requirements"}
                </span>
              </div>
              <p className="text-[#6b7280] mb-4">{RIGHTS[right].blurb}</p>

              <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                {/* Column headings, desktop only — on a phone each row is
                    labelled inline instead. */}
                <div className="hidden md:grid grid-cols-[5.5rem_minmax(0,1fr)_7rem_minmax(0,15rem)] gap-x-5 px-5 py-2.5 bg-[#f8f9fb] border-b border-[#e5e7eb] font-mono text-[10px] uppercase tracking-[0.12em] text-[#9ca3af]">
                  <span>Code</span>
                  <span>Requirement</span>
                  <span>Applies to</span>
                  <span>Evidence · tier</span>
                </div>

                <ul>
                  {group.map((r) => (
                    <li
                      key={r.code}
                      className={`grid md:grid-cols-[5.5rem_minmax(0,1fr)_7rem_minmax(0,15rem)] gap-x-5 gap-y-2 px-5 py-4 border-b border-[#f1f1f0] last:border-b-0 ${
                        r.flagship ? "bg-aic-copper/[0.04]" : ""
                      }`}
                    >
                      <div className="flex md:block items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0f1f3d]">
                          {r.code}
                        </span>
                        {r.flagship && (
                          <span
                            className="inline-flex items-center gap-1 md:mt-1.5 text-[9px] font-bold uppercase tracking-wide text-aic-copper"
                            title="Difficult to satisfy without actually doing the work"
                          >
                            <Star className="w-2.5 h-2.5 fill-aic-copper" />
                            Hard to fake
                          </span>
                        )}
                      </div>

                      <p className="text-[#0f1f3d] leading-relaxed text-[15px]">
                        {r.text}
                      </p>

                      <div className="font-mono text-[11px] text-[#6b7280] leading-relaxed">
                        <span className="md:hidden text-[#9ca3af]">Applies to </span>
                        D{r.divisions.join(" · D")}
                      </div>

                      <div className="text-[13px] text-[#6b7280] leading-relaxed">
                        {r.evidence}
                        <span
                          className={`inline-flex items-center ml-2 px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide align-middle ${TIER_TONE[r.tier]}`}
                          title={`Best obtainable evidence: ${TIER_MEANING[r.tier].label}`}
                        >
                          {r.tier}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
        </div>
      </div>

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
