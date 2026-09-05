"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileDown,
  Layers,
  Flag,
} from "lucide-react";
import type { AssessmentResult } from "@/lib/scoring";
import type { AwareAnalysis } from "@/lib/aware-analysis";
import { RIGHTS, TIER_MEANING, type RightCode } from "@/app/data/requirements-data";
import { categoryMeta, type Category } from "@/app/data/questions";

// The engine's own TierInfo.color values are Tailwind classes pinned by
// __tests__/lib/scoring.test.ts, and they are not real risk colours —
// aic-red resolves to the site's gold accent and aic-orange/aic-green are not
// in the theme at all. Mapping locally avoids touching shared tokens used
// elsewhere for unrelated hover states. Values match the PDF generator.
const RISK: Record<string, { text: string; bg: string; border: string; bar: string }> = {
  "Tier 1": { text: "text-[#c41e3a]", bg: "bg-[#c41e3a]/[0.06]", border: "border-[#c41e3a]/25", bar: "bg-[#c41e3a]" },
  "Tier 2": { text: "text-[#b8651b]", bg: "bg-[#ff8c42]/[0.08]", border: "border-[#ff8c42]/30", bar: "bg-[#ff8c42]" },
  "Tier 3": { text: "text-[#2c5f2d]", bg: "bg-[#2c5f2d]/[0.06]", border: "border-[#2c5f2d]/25", bar: "bg-[#2c5f2d]" },
};

const CATEGORY_LABEL: Record<Category, string> = {
  USAGE: "AI Usage Context",
  OVERSIGHT: "Human Oversight",
  TRANSPARENCY: "Transparency",
  INFRASTRUCTURE: "Infrastructure & Compliance",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
      {children}
    </span>
  );
}

export default function AwareResults({
  result,
  analysis,
  organisation,
  onDownload,
}: {
  result: AssessmentResult;
  analysis: AwareAnalysis;
  organisation: string;
  onDownload: () => void;
}) {
  const risk = RISK[result.tier.name] ?? RISK["Tier 2"];
  const { indication, gaps, applicableCount, gapsByRight, flagshipGaps, consistent } = analysis;

  const rightsWithGaps = (Object.keys(gapsByRight) as RightCode[]).filter(
    (r) => gapsByRight[r] > 0
  );

  return (
    <div className="space-y-14">
      {/* ── Score ─────────────────────────────────────────────────────── */}
      <section>
        <Eyebrow>Self-declared result</Eyebrow>
        <div className={`mt-3 rounded-2xl border ${risk.border} ${risk.bg} p-8`}>
          <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
            <span
              className="text-6xl font-bold text-[#0f1f3d] leading-none tabular-nums"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {result.integrityScore}
            </span>
            <span className="text-lg text-[#6b7280] mb-1">/ 100</span>
            <span
              className={`ml-auto inline-flex items-center px-3.5 py-1.5 rounded-full bg-white ${risk.text} text-sm font-bold`}
            >
              {result.tier.title}
            </span>
          </div>
          <p className="text-sm text-[#0f1f3d]/80 leading-relaxed mt-5 max-w-2xl">
            {result.tier.desc}
          </p>
        </div>
        <p className="text-xs text-[#6b7280] leading-relaxed mt-3 max-w-2xl">
          This number is not comparable to a certification score. The certified scale is computed
          from evidence weighted across 44 requirements; this one is computed from your own answers
          about yourself. They are different instruments measuring different things, and putting
          them on one axis would be the exact confusion AIC Aware exists to remove.
        </p>
      </section>

      {/* ── Indicated Division ────────────────────────────────────────── */}
      <section>
        <Eyebrow>Where you would be assessed</Eyebrow>
        <h2
          className="text-2xl md:text-3xl text-[#0f1f3d] font-bold mt-3 mb-4 leading-tight"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          Division {indication.division} — {indication.name}
        </h2>
        <p className="text-[#6b7280] leading-relaxed max-w-2xl mb-4">{indication.rationale}</p>
        {indication.caveat && (
          <div className="flex items-start gap-3 bg-[#f0f4f8] border border-[#e5e7eb] rounded-xl p-5 max-w-2xl mb-5">
            <AlertTriangle className="w-4 h-4 text-aic-copper mt-0.5 shrink-0" />
            <p className="text-sm text-[#0f1f3d]/80 leading-relaxed">{indication.caveat}</p>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm text-[#0f1f3d]">
          <Layers className="w-4 h-4 text-aic-copper" />
          <span>
            <strong className="tabular-nums">{applicableCount}</strong> of the 44 published
            requirements apply at this Division.
          </span>
          <Link href="/standard" className="text-aic-copper font-semibold hover:underline">
            Read them
          </Link>
        </div>
        <p className="text-xs text-[#6b7280] mt-3 max-w-2xl">
          Indicative. The Division is confirmed at audit against your actual system inventory, not
          from five multiple-choice answers about it.
        </p>
      </section>

      {/* ── Category breakdown ────────────────────────────────────────── */}
      <section>
        <Eyebrow>Category breakdown</Eyebrow>
        <div className="mt-4 divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
          {categoryMeta.map((cat) => {
            const score = result.categoryScores[cat.key]?.score ?? 0;
            return (
              <div key={cat.key} className="py-5">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <span className="text-sm font-semibold text-[#0f1f3d]">
                    {CATEGORY_LABEL[cat.key]}
                  </span>
                  <span className="font-mono text-xs text-[#6b7280] tabular-nums shrink-0">
                    {Math.round(cat.weight * 100)}% weight · {score}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0f1f3d] rounded-full transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Gap register ──────────────────────────────────────────────── */}
      <section>
        <Eyebrow>Gap register</Eyebrow>
        <h2
          className="text-2xl md:text-3xl text-[#0f1f3d] font-bold mt-3 mb-4 leading-tight"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {gaps.length === 0
            ? "Your answers raised no requirement-level gaps"
            : `Your answers indicate likely findings against ${gaps.length} requirement${gaps.length === 1 ? "" : "s"}`}
        </h2>

        {gaps.length === 0 ? (
          <p className="text-[#6b7280] leading-relaxed max-w-2xl">
            Nothing in your answers points at a specific requirement failing. That is a good
            starting position and it is not a pass — every answer here is your own account of your
            own controls, and an audit tests the controls rather than the account.
          </p>
        ) : (
          <>
            <p className="text-[#6b7280] leading-relaxed max-w-2xl mb-6">
              These are real requirement codes from the published standard, filtered to the ones
              that apply at Division {indication.division}. Each is raised because of a specific
              answer you gave, and each shows the evidence an assessor would ask for.
            </p>

            {rightsWithGaps.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-7">
                {rightsWithGaps.map((code) => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f4f8] border border-[#e5e7eb] text-xs"
                  >
                    <span className="font-mono font-bold text-[#0f1f3d]">{code}</span>
                    <span className="text-[#6b7280]">{RIGHTS[code].name}</span>
                    <span className="font-mono font-bold text-aic-copper tabular-nums">
                      {gapsByRight[code]}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {flagshipGaps.length > 0 && (
              <div className="flex items-start gap-3 bg-[#c41e3a]/[0.05] border border-[#c41e3a]/20 rounded-xl p-5 mb-7 max-w-3xl">
                <Flag className="w-4 h-4 text-[#c41e3a] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#0f1f3d] mb-1">
                    {flagshipGaps.length} of these {flagshipGaps.length === 1 ? "is a" : "are"}{" "}
                    flagship requirement{flagshipGaps.length === 1 ? "" : "s"}
                  </p>
                  <p className="text-sm text-[#6b7280] leading-relaxed">
                    Flagship requirements are the ones that test whether a control is real rather
                    than merely present, and they are the hardest to satisfy retroactively. They are
                    where remediation takes months rather than weeks, so they are worth starting on
                    first.
                  </p>
                </div>
              </div>
            )}

            <ul className="space-y-px bg-[#e5e7eb] border border-[#e5e7eb] rounded-xl overflow-hidden">
              {gaps.map(({ requirement: r, triggeredBy }) => (
                <li key={r.code} className="bg-white p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <span className="font-mono text-sm font-bold text-[#0f1f3d]">{r.code}</span>
                    <span className="text-xs text-[#6b7280]">{RIGHTS[r.right].name}</span>
                    {r.flagship && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c41e3a]/10 text-[#c41e3a] text-[10px] font-bold uppercase tracking-wider">
                        <Flag className="w-2.5 h-2.5" /> Flagship
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-[#6b7280] shrink-0">
                      Evidence tier {r.tier} · {TIER_MEANING[r.tier].label}
                    </span>
                  </div>
                  <p className="text-sm text-[#0f1f3d] leading-relaxed mb-3">{r.text}</p>
                  <dl className="text-xs text-[#6b7280] space-y-1.5">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-[#0f1f3d] shrink-0">Evidence required:</dt>
                      <dd>{r.evidence}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-[#0f1f3d] shrink-0">Raised by:</dt>
                      <dd className="italic">{triggeredBy.join(" · ")}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ── Consistent-with ───────────────────────────────────────────── */}
      {consistent.length > 0 && (
        <section>
          <Eyebrow>Answers consistent with</Eyebrow>
          <p className="text-[#6b7280] leading-relaxed max-w-2xl mt-3 mb-4">
            Your answers are consistent with {consistent.length} further requirement
            {consistent.length === 1 ? "" : "s"} being met. Consistent is not passed — these are the
            ones where an audit would be looking for the evidence to confirm what you have said, and
            where you are most likely to already have it.
          </p>
          <div className="flex flex-wrap gap-2">
            {consistent.map(({ requirement: r }) => (
              <span
                key={r.code}
                title={r.text}
                className="font-mono text-xs px-2.5 py-1 rounded bg-[#f0f4f8] border border-[#e5e7eb] text-[#0f1f3d]"
              >
                {r.code}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Why this is not certification ─────────────────────────────── */}
      <section className="bg-aic-navy text-white rounded-2xl p-8 md:p-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
          The boundary
        </span>
        <h2
          className="text-2xl md:text-3xl font-bold mt-3 mb-5 leading-tight"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          Why none of this is certification
        </h2>
        <p className="text-white/70 leading-relaxed max-w-2xl mb-6">
          The standard grades evidence in four tiers, and weights each accordingly. Everything you
          have just produced sits in the bottom one.
        </p>
        <div className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden mb-6">
          {(["A", "B", "C", "D"] as const).map((t) => (
            <div
              key={t}
              className={`p-4 ${t === "D" ? "bg-[#c9920a]/15" : "bg-aic-navy"}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-bold text-white">Tier {t}</span>
                <span className="text-xs text-white/60">{TIER_MEANING[t].label}</span>
                <span className="ml-auto font-mono text-xs text-aic-copper tabular-nums">
                  ×{TIER_MEANING[t].weight}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{TIER_MEANING[t].desc}</p>
              {t === "D" && (
                <p className="text-xs text-aic-copper font-semibold mt-2">
                  ← every answer in this assessment
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-white/70 leading-relaxed max-w-2xl">
          An AIC Certified audit replaces attestation with operational data: your actual override
          records, your actual adverse communications, your actual disaggregated outcomes. That is
          the difference between saying a control exists and showing that it ran.
        </p>
      </section>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 bg-[#0f1f3d] hover:bg-[#0a1628] text-white px-6 py-3.5 rounded-full transition-all text-sm font-bold"
        >
          <FileDown className="w-4 h-4" /> Download the full report
        </button>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-6 py-3.5 rounded-full transition-all text-sm font-bold"
        >
          Talk to us about closing these gaps <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ── Declaration badge ─────────────────────────────────────────── */}
      <section className="bg-[#f0f4f8] border border-[#e5e7eb] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-aic-copper" />
          <span className="text-sm font-bold text-[#0f1f3d]">
            {organisation ? `${organisation} endorses` : "We endorse"} the Declaration of
            Algorithmic Rights
          </span>
        </div>
        <p className="text-sm text-[#6b7280] leading-relaxed mb-2">
          This is what AIC Aware confers: an endorsement of the five rights, declared by you. It is
          not the AIC Certified mark, it does not appear on the public registry, and no third party
          can verify it — only an independent audit produces a checkable result.
        </p>
        <Link
          href="/governance-hub#declaration"
          className="text-aic-copper text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
        >
          Read the Declaration <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
