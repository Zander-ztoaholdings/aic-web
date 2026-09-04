"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

      {/* The requirements */}
      <div className="space-y-10">
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
                <span className="text-xs font-mono uppercase tracking-wide text-aic-copper">
                  {right} · {group.length}{" "}
                  {group.length === 1 ? "requirement" : "requirements"}
                </span>
              </div>
              <p className="text-[#6b7280] mb-5">{RIGHTS[right].blurb}</p>

              <div className="space-y-3">
                {group.map((r, i) => (
                  <motion.div
                    key={r.code}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i, 6) * 0.03 }}
                    className={`bg-white border rounded-xl p-5 ${
                      r.flagship ? "border-aic-copper/40" : "border-[#e5e7eb]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="font-mono text-xs font-bold text-[#0f1f3d] bg-[#f0f4f8] px-2 py-1 rounded">
                        {r.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${TIER_TONE[r.tier]}`}
                        title={`Best obtainable evidence: ${TIER_MEANING[r.tier].label}`}
                      >
                        Tier {r.tier}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wide text-[#9ca3af]">
                        D{r.divisions.join(" · D")}
                      </span>
                      {r.flagship && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-aic-copper">
                          <Star className="w-3 h-3 fill-aic-copper" />
                          Hard to fake
                        </span>
                      )}
                    </div>
                    <p className="text-[#0f1f3d] leading-relaxed mb-2.5">{r.text}</p>
                    <p className="text-sm text-[#6b7280]">
                      <span className="font-semibold text-[#0f1f3d]">Evidence: </span>
                      {r.evidence}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
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
