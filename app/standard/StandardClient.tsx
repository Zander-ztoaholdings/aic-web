"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  requirements,
  requirementsForDivision,
  RIGHTS,
  TIER_MEANING,
  DIVISIONS,
  type RightCode,
  type EvidenceTier,
  type Requirement,
} from "@/app/data/requirements-data";
import { divisionProfile } from "@/app/data/divisions";

/**
 * The standard, October 2026.
 *
 * The previous version was correct and dull: a narrow column of forty-four
 * identical cards, one right at a time. The content was never the problem.
 * The shape was, because it hid the one thing that makes a standard legible:
 * how the whole of it fits together.
 *
 * So the page now leads with the standard as a single object. Five rights as
 * five columns, every requirement a cell, each cell filled by the strongest
 * evidence it admits. Choosing a Division dims what does not apply, so the
 * reader sees their own standard take shape rather than reading a count of
 * it. Selecting a cell opens the requirement beside the map, in full. That
 * map is the page's one bold element; everything around it is quiet.
 *
 * Below it, each right reads as a ruled list rather than a stack of cards,
 * and every requirement keeps its #req-CODE anchor, which the regulatory map
 * links to.
 */

const RIGHT_ORDER: RightCode[] = ["HU", "EX", "EM", "CO", "TR"];
const TIERS = Object.keys(TIER_MEANING) as EvidenceTier[];
// Column headings on a phone, where five full names will not fit side by side.
const SHORT: Record<RightCode, string> = { HU: "Agency", EX: "Explain", EM: "Empathy", CO: "Correct", TR: "Truth" };

// Strongest evidence reads darkest, in AIC's own navy and brass rather than a
// traffic-light green. Colour is never the only carrier: the
// reading panel and the lists name the tier in words.
const TIER_FILL: Record<EvidenceTier, { cell: string; dot: string; text: string }> = {
  A: { cell: "bg-[#0e1b2c] text-white border-[#0e1b2c]", dot: "bg-[#0e1b2c]", text: "text-[#0e1b2c]" },
  B: { cell: "bg-[#4a5d78] text-white border-[#4a5d78]", dot: "bg-[#4a5d78]", text: "text-[#3b4c63]" },
  C: { cell: "bg-[#a8772a]/15 text-[#6b4a14] border-[#a8772a]/40", dot: "bg-[#a8772a]", text: "text-[#7a5518]" },
  D: { cell: "bg-white text-[#5e6b7b] border-[#c3cad3] border-dashed", dot: "bg-[#c3cad3]", text: "text-[#5e6b7b]" },
};

const flagshipCount = requirements.filter((r) => r.flagship).length;

export default function StandardClient() {
  // null = the whole standard. A Division narrows it to what that
  // organisation would actually be assessed against.
  const [division, setDivision] = useState<number | null>(null);
  const [selected, setSelected] = useState<string>(() => requirements.find((r) => r.flagship)?.code ?? requirements[0].code);
  const [openRight, setOpenRight] = useState<RightCode>("HU");
  const panelRef = useRef<HTMLDivElement>(null);

  // #hu opens a right; #req-HU-4 opens and selects that requirement.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const up = hash.toUpperCase();
    if ((RIGHT_ORDER as readonly string[]).includes(up)) {
      setOpenRight(up as RightCode);
      return;
    }
    if (hash.startsWith("req-")) {
      const code = hash.slice(4).toUpperCase();
      const r = requirements.find((x) => x.code === code);
      if (r) {
        setSelected(r.code);
        setOpenRight(r.right);
        requestAnimationFrame(() => document.getElementById(`req-${r.code}`)?.scrollIntoView({ block: "center" }));
      }
    }
  }, []);

  const applies = (r: Requirement) => division === null || r.divisions.includes(division);
  const visibleCount = useMemo(() => (division === null ? requirements.length : requirementsForDivision(division).length), [division]);
  const current = requirements.find((r) => r.code === selected) ?? requirements[0];
  const profile = division ? divisionProfile(division) : undefined;

  function choose(r: Requirement) {
    setSelected(r.code);
    setOpenRight(r.right);
    // On a phone the panel sits under the map; bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      {/* ── The standard as one object ───────────────────────────── */}
      <section aria-labelledby="map-title" className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 mb-8">
            <div className="max-w-xl">
              <h2 id="map-title" className="text-2xl md:text-[2rem] font-bold text-[#0e1b2c] leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: "'Merriweather', serif" }}>
                {division === null ? "The whole standard on one page" : `What Division ${division} is assessed against`}
              </h2>
              <p className="text-[#5e6b7b] leading-[1.65] mt-2">
                {division === null
                  ? "Five rights, each a column. Every cell is a requirement, filled by the strongest evidence it accepts. Choose your Division to see your own standard take shape, and select any requirement to read it."
                  : `${visibleCount} of ${requirements.length} requirements apply. ${profile?.tagline ?? ""}`}
              </p>
            </div>

            <div role="group" aria-label="Division" className="flex flex-wrap gap-1.5">
              <DivisionButton active={division === null} onClick={() => setDivision(null)} label="All" count={requirements.length} />
              {[1, 2, 3, 4, 5].map((d) => (
                <DivisionButton key={d} active={division === d} onClick={() => setDivision(d)} label={`${d} ${DIVISIONS[d]}`} count={requirementsForDivision(d).length} />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] gap-8 lg:gap-12 items-start">
            {/* The map */}
            <div>
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {RIGHT_ORDER.map((right) => {
                  const all = requirements.filter((r) => r.right === right);
                  const n = all.filter(applies).length;
                  return (
                    <div key={right} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setOpenRight(right)}
                        className="block w-full text-left mb-3 group"
                      >
                        <span className="block text-[12px] sm:text-[15px] font-semibold text-[#0e1b2c] leading-tight group-hover:text-[#a8772a] transition-colors">
                          <span className="hidden sm:inline">{RIGHTS[right].name}</span>
                          <span className="sm:hidden">{SHORT[right]}</span>
                        </span>
                        <span className="block text-[12px] text-[#5e6b7b] tabular-nums">
                          {n === all.length ? `${n}` : `${n} of ${all.length}`}
                        </span>
                      </button>
                      <ul className="grid gap-1.5 sm:gap-2">
                        {all.map((r) => {
                          const on = applies(r);
                          const isSel = r.code === selected;
                          return (
                            <li key={r.code}>
                              <button
                                type="button"
                                onClick={() => choose(r)}
                                aria-pressed={isSel}
                                aria-label={`${r.code}, ${TIER_MEANING[r.tier].label}${r.flagship ? ", hard to fake" : ""}${on ? "" : ", does not apply"}: ${r.text}`}
                                className={`relative flex h-9 sm:h-11 w-full items-center justify-between rounded-lg border px-2 sm:px-3 text-[12px] sm:text-[13px] font-semibold transition-all duration-200 motion-reduce:transition-none ${TIER_FILL[r.tier].cell} ${
                                  on ? "opacity-100" : "opacity-[0.18] saturate-0"
                                } ${isSel ? "ring-2 ring-offset-2 ring-[#a8772a]" : "hover:-translate-y-px"}`}
                              >
                                <span>
                                  <span className="hidden sm:inline">{r.code}</span>
                                  <span className="sm:hidden">{r.code.split("-")[1]}</span>
                                </span>
                                {r.flagship && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Legend: what a fill means, and what the mark means. */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[#5e6b7b]">
                {TIERS.map((t) => (
                  <span key={t} className="inline-flex items-center gap-2">
                    <span className={`inline-block h-3.5 w-5 rounded border ${TIER_FILL[t].cell}`} aria-hidden="true" />
                    {TIER_MEANING[t].label}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0e1b2c]" aria-hidden="true" />
                  Hard to fake ({flagshipCount})
                </span>
              </div>
            </div>

            {/* The reading panel */}
            <div ref={panelRef} className="scroll-mt-28 lg:sticky lg:top-32">
              <ReadingPanel r={current} division={division} />
            </div>
          </div>
        </div>
      </section>

      {/* ── How evidence is weighed ──────────────────────────────── */}
      <section aria-labelledby="tiers-title" className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-8 lg:gap-14">
          <div>
            <h2 id="tiers-title" className="text-xl md:text-[1.6rem] font-bold text-[#0e1b2c] leading-[1.2]" style={{ fontFamily: "'Merriweather', serif" }}>
              Paperwork cannot buy a score
            </h2>
            <p className="text-[#5e6b7b] leading-[1.65] mt-3">
              Each requirement names the strongest evidence it admits. The best available evidence
              earns full marks, weaker evidence than you could have given earns proportionally less,
              and piling on more earns nothing extra.
            </p>
          </div>
          <ol className="grid sm:grid-cols-2 xl:grid-cols-4 gap-px bg-[#dde2e8] rounded-xl overflow-hidden border border-[#dde2e8]">
            {TIERS.map((t) => {
              const m = TIER_MEANING[t];
              const n = requirements.filter((r) => r.tier === t).length;
              return (
                <li key={t} className="bg-white p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`text-[15px] font-semibold ${TIER_FILL[t].text}`}>{m.label}</span>
                    <span className="text-[13px] text-[#5e6b7b] tabular-nums">counts {Math.round(m.weight * 100)}%</span>
                  </div>
                  {/* The weight, drawn to scale. */}
                  <div className="mt-3 h-1.5 rounded-full bg-[#eef1f5]" aria-hidden="true">
                    <div className={`h-1.5 rounded-full ${TIER_FILL[t].dot}`} style={{ width: `${m.weight * 100}%` }} />
                  </div>
                  <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-3">{m.desc}</p>
                  <p className="text-[13px] text-[#0e1b2c] mt-3 tabular-nums">
                    {n} {n === 1 ? "requirement" : "requirements"} at best
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Read a right in full ─────────────────────────────────── */}
      <section aria-labelledby="read-title" className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 id="read-title" className="text-xl md:text-[1.6rem] font-bold text-[#0e1b2c] leading-[1.2] mb-5" style={{ fontFamily: "'Merriweather', serif" }}>
            Read a right in full
          </h2>
          <div role="tablist" aria-label="Rights" className="flex gap-1.5 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
            {RIGHT_ORDER.map((right) => (
              <button
                key={right}
                role="tab"
                id={right.toLowerCase()}
                aria-selected={openRight === right}
                onClick={() => setOpenRight(right)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors scroll-mt-32 ${
                  openRight === right ? "bg-[#0e1b2c] text-white" : "border border-[#dde2e8] text-[#0e1b2c] hover:border-[#a8772a]"
                }`}
              >
                {RIGHTS[right].name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-6 lg:gap-14">
            <div>
              <p className="text-lg text-[#0e1b2c] leading-[1.5]" style={{ fontFamily: "'Merriweather', serif" }}>
                {RIGHTS[openRight].blurb}
              </p>
              <p className="text-sm text-[#5e6b7b] mt-3">
                {division === null
                  ? `${requirements.filter((r) => r.right === openRight).length} requirements.`
                  : `Requirements that do not apply to Division ${division} are greyed.`}
              </p>
            </div>
            <ol className="border-t border-[#dde2e8]">
              {requirements
                .filter((r) => r.right === openRight)
                .map((r) => {
                  const on = applies(r);
                  return (
                    <li
                      key={r.code}
                      id={`req-${r.code}`}
                      className={`scroll-mt-32 border-b border-[#dde2e8] py-5 grid sm:grid-cols-[4.5rem_minmax(0,1fr)] gap-x-5 gap-y-2 transition-opacity ${on ? "" : "opacity-40"} ${
                        r.code === selected ? "bg-[#a8772a]/[0.05] -mx-3 px-3 rounded-lg" : ""
                      }`}
                    >
                      <button type="button" onClick={() => setSelected(r.code)} className="text-left text-[15px] font-semibold text-[#0e1b2c] tabular-nums hover:text-[#a8772a]">
                        {r.code}
                      </button>
                      <div>
                        <p className="text-[#0e1b2c] text-[16px] leading-[1.6] max-w-[68ch]">{r.text}</p>
                        <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-2 max-w-[68ch]">
                          <span className="font-medium text-[#0e1b2c]">Evidence:</span> {r.evidence}
                        </p>
                        <p className="text-[13px] text-[#5e6b7b] mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          <span className={TIER_FILL[r.tier].text}>{TIER_MEANING[r.tier].label}</span>
                          <span>{divisionsLabel(r.divisions)}</span>
                          {r.flagship && <span className="font-medium text-[#0e1b2c]">Hard to fake</span>}
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Challenge ────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-[minmax(0,1fr)_auto] gap-6 items-center">
          <div className="max-w-2xl">
            <h2 className="text-xl md:text-[1.6rem] font-bold text-[#0e1b2c] leading-[1.2]" style={{ fontFamily: "'Merriweather', serif" }}>
              Tell us where this is wrong
            </h2>
            <p className="text-[#5e6b7b] leading-[1.65] mt-3">
              This is version 1, published to be challenged. If a requirement cannot be measured, a
              threshold sits in the wrong place, or we have missed something that matters in your
              sector, we would rather hear it now than defend it later. Substantive challenges change
              the standard and are credited in the revision record.
            </p>
          </div>
          <Link
            href="/contact?enquiry=standard"
            className="inline-flex items-center justify-center rounded-lg bg-[#0e1b2c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a3160] transition-colors"
          >
            Challenge a requirement
          </Link>
        </div>
      </section>
    </>
  );
}

function divisionsLabel(ds: number[]): string {
  if (ds.length === 5) return "All Divisions";
  if (ds.length === 1) return `Division ${ds[0]} only`;
  return `Divisions ${ds.slice(0, -1).join(", ")} and ${ds[ds.length - 1]}`;
}

function DivisionButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
        active ? "bg-[#0e1b2c] text-white font-semibold" : "border border-[#dde2e8] bg-white text-[#0e1b2c] hover:border-[#a8772a]"
      }`}
    >
      {label}
      <span className={`ml-1.5 text-[12px] tabular-nums ${active ? "text-white/70" : "text-[#5e6b7b]"}`}>{count}</span>
    </button>
  );
}

function ReadingPanel({ r, division }: { r: Requirement; division: number | null }) {
  const on = division === null || r.divisions.includes(division);
  return (
    <article aria-live="polite" className="rounded-2xl bg-[#f5f7f9] p-6 md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-semibold text-[#0e1b2c] tabular-nums">{r.code}</p>
        <p className="text-[13px] text-[#5e6b7b]">{RIGHTS[r.right].name}</p>
      </div>
      <p className="mt-4 text-[1.2rem] md:text-[1.3rem] leading-[1.45] text-[#0e1b2c]" style={{ fontFamily: "'Merriweather', serif" }}>
        {r.text}
      </p>
      {r.flagship && (
        <p className="mt-4 text-sm leading-[1.6] text-[#0e1b2c]">
          <span className="font-semibold">Hard to fake.</span>{" "}
          <span className="text-[#5e6b7b]">One of the {flagshipCount} requirements that test whether a control is real rather than merely present.</span>
        </p>
      )}
      <dl className="mt-5 border-t border-[#dde2e8] pt-4 space-y-3 text-sm">
        <div>
          <dt className="text-[13px] text-[#5e6b7b]">Evidence it takes</dt>
          <dd className="text-[#0e1b2c] leading-[1.55] mt-0.5">{r.evidence}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#5e6b7b]">Strongest evidence it accepts</dt>
          <dd className={`leading-[1.55] mt-0.5 font-medium ${TIER_FILL[r.tier].text}`}>
            {TIER_MEANING[r.tier].label}, counting {Math.round(TIER_MEANING[r.tier].weight * 100)}%
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#5e6b7b]">Applies to</dt>
          <dd className="mt-1.5 flex gap-1.5" aria-label={divisionsLabel(r.divisions)}>
            {[1, 2, 3, 4, 5].map((d) => (
              <span
                key={d}
                title={`Division ${d}, ${DIVISIONS[d]}`}
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[12px] font-semibold tabular-nums ${
                  r.divisions.includes(d) ? "bg-[#0e1b2c] text-white" : "bg-white text-[#c3cad3] border border-[#dde2e8]"
                } ${division === d ? "ring-2 ring-offset-1 ring-[#a8772a]" : ""}`}
              >
                {d}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      {!on && (
        <p className="mt-4 text-sm text-[#b45309]">This does not apply to Division {division}.</p>
      )}
    </article>
  );
}
