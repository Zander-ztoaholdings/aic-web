"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Gauge,
  ShieldAlert,
  ChevronDown,
  Pencil,
  Clock,
} from "lucide-react";
import {
  questions,
  categoryMeta,
  type Category,
  type Question,
} from "@/app/data/questions";
import { calculateAssessmentResult, type AssessmentResult } from "@/lib/scoring";
import { analyseAware, type AwareAnalysis } from "@/lib/aware-analysis";
import { requirements, RIGHTS } from "@/app/data/requirements-data";
import AwareResults from "./AwareResults";

type Stage = "intro" | "section" | "quiz" | "review" | "gate" | "results";

const CATEGORY_LABEL: Record<Category, string> = {
  USAGE: "AI Usage Context",
  OVERSIGHT: "Human Oversight",
  TRANSPARENCY: "Transparency",
  INFRASTRUCTURE: "Infrastructure & Compliance",
};

const requirementByCode = new Map(requirements.map((r) => [r.code, r]));

function metaFor(category: Category) {
  return categoryMeta.find((c) => c.key === category)!;
}

function countIn(category: Category) {
  return questions.filter((q) => q.category === category).length;
}

/** Which number this question is within its own section. */
function positionInSection(index: number) {
  const cat = questions[index].category;
  return questions.slice(0, index + 1).filter((q) => q.category === cat).length;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
      {children}
    </span>
  );
}

/** The requirements a question tests against, expandable to their full text. */
function RequirementAnchor({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const codes = question.requirements ?? [];
  if (codes.length === 0) return null;

  return (
    <div className="mt-4 border border-[#e5e7eb] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-[#f0f4f8] transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b7280]">
          Tests against
        </span>
        <span className="flex flex-wrap gap-1.5">
          {codes.map((c) => (
            <span
              key={c}
              className="font-mono text-xs font-bold text-[#0f1f3d] bg-[#f0f4f8] border border-[#e5e7eb] px-2 py-0.5 rounded"
            >
              {c}
            </span>
          ))}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#6b7280] ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="divide-y divide-[#e5e7eb] border-t border-[#e5e7eb]">
          {codes.map((c) => {
            const r = requirementByCode.get(c);
            if (!r) return null;
            return (
              <li key={c} className="px-4 py-3.5 bg-[#fcfcfa]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#0f1f3d]">{r.code}</span>
                  <span className="text-[11px] text-[#6b7280]">{RIGHTS[r.right].name}</span>
                  {r.flagship && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c41e3a]">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#0f1f3d] leading-relaxed">{r.text}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function AwareClient() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [returnToReview, setReturnToReview] = useState(false);

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [wantsListed, setWantsListed] = useState(false);
  const [attested, setAttested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const complete = Object.keys(answers).length === questions.length;

  const result: AssessmentResult | null = useMemo(
    () => (complete ? calculateAssessmentResult(answers) : null),
    [answers, complete]
  );
  const analysis: AwareAnalysis | null = useMemo(
    () => (complete ? analyseAware(answers) : null),
    [answers, complete]
  );

  const q = questions[index];

  function answer(value: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));

    if (returnToReview) {
      setReturnToReview(false);
      setTimeout(() => setStage("review"), 140);
      return;
    }

    const next = index + 1;
    if (next >= questions.length) {
      setTimeout(() => setStage("review"), 140);
      return;
    }
    setTimeout(() => {
      const crossing = questions[next].category !== q.category;
      setIndex(next);
      setStage(crossing ? "section" : "quiz");
    }, 140);
  }

  function back() {
    if (returnToReview) {
      setReturnToReview(false);
      setStage("review");
      return;
    }
    if (index > 0) {
      setIndex(index - 1);
      setStage("quiz");
    } else {
      setStage("intro");
    }
  }

  function editAnswer(i: number) {
    setIndex(i);
    setReturnToReview(true);
    setStage("quiz");
  }

  async function submitGate(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setSubmitError(null);

    if (!attested) {
      setSubmitError("Please confirm the declaration — it is what the endorsement rests on.");
      return;
    }
    if (wantsListed && !company.trim()) {
      setSubmitError("A company name is required to appear in the AIC Aware directory.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: company.trim() || undefined,
          wantsListed,
          score: result.integrityScore,
          tier:
            result.tier.name === "Tier 1"
              ? "TIER_1"
              : result.tier.name === "Tier 2"
                ? "TIER_2"
                : "TIER_3",
          answers,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setSubmitError(data?.message || "Something went wrong recording your declaration.");
        setSubmitting(false);
        return;
      }
      setStage("results");
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadPDF() {
    if (!result || !analysis) return;
    const { generatePDFReport } = await import("@/lib/report-generator");
    await generatePDFReport(result, company.trim() || "Your Organisation", analysis);
  }

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-aic-navy text-white py-20 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.15]"
          style={{ background: "radial-gradient(circle at 15% 20%, #c9920a 0%, transparent 45%)" }}
        />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              Free · Self-Declared · Not an Audit
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl mb-6 leading-[1.08] tracking-[-0.02em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            AIC Aware
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
            {questions.length} questions against the same published standard AIC audits to. You get
            back the Division you would be assessed in, and the specific requirements your own
            answers put at risk — by code, with the evidence an assessor would ask for.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 md:py-20">
        <AnimatePresence mode="wait">
          {/* ── Intro ──────────────────────────────────────────────── */}
          {stage === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-6">
                <Clock className="w-4 h-4 text-aic-copper" />
                About ten minutes · no account · nothing published without your say-so
              </div>
              <h2
                className="text-2xl md:text-3xl text-[#0f1f3d] font-bold mb-5 leading-tight"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Four sections, weighted the way the standard weights them
              </h2>
              <p className="text-[#6b7280] leading-relaxed mb-8">
                Answer honestly — the output is a list of your own gaps, and a list built from
                flattering answers is worth nothing to you. Every question shows why it is asked and
                which published requirements it bears on, so you can check the instrument rather
                than trust it.
              </p>

              <div className="divide-y divide-[#e5e7eb] border-y border-[#e5e7eb] mb-9">
                {categoryMeta.map((cat) => (
                  <div key={cat.key} className="py-5">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3 className="text-base font-bold text-[#0f1f3d]">
                        {CATEGORY_LABEL[cat.key]}
                      </h3>
                      <span className="font-mono text-xs text-[#6b7280] tabular-nums shrink-0">
                        {countIn(cat.key)} questions · {Math.round(cat.weight * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-[#6b7280] leading-relaxed">{cat.purpose}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStage("section")}
                className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-lg hover:-translate-y-0.5"
              >
                Begin the assessment <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-6">
                <Link
                  href="/aware/directory"
                  className="text-sm text-[#6b7280] hover:text-aic-copper transition-colors"
                >
                  See who else has declared →
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── Section intro ──────────────────────────────────────── */}
          {stage === "section" && (
            <motion.div key={`sec-${q.category}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Eyebrow>
                Section {categoryMeta.findIndex((c) => c.key === q.category) + 1} of{" "}
                {categoryMeta.length}
              </Eyebrow>
              <h2
                className="text-3xl md:text-4xl text-[#0f1f3d] font-bold mt-3 mb-5 leading-tight"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {CATEGORY_LABEL[q.category]}
              </h2>
              <p className="text-[#6b7280] leading-relaxed mb-6">{metaFor(q.category).purpose}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#6b7280] mb-9 pb-9 border-b border-[#e5e7eb]">
                <span>
                  <strong className="text-[#0f1f3d] tabular-nums">{countIn(q.category)}</strong>{" "}
                  questions
                </span>
                <span>
                  <strong className="text-[#0f1f3d] tabular-nums">
                    {Math.round(metaFor(q.category).weight * 100)}%
                  </strong>{" "}
                  of the score
                </span>
                <span className="flex items-center gap-1.5">
                  Rights touched:
                  {metaFor(q.category).rights.map((r) => (
                    <span key={r} className="font-mono font-bold text-[#0f1f3d]">
                      {r}
                    </span>
                  ))}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStage("quiz")}
                className="inline-flex items-center gap-2 bg-[#0f1f3d] hover:bg-[#0a1628] text-white px-7 py-3.5 rounded-full transition-all text-sm font-bold"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── Question ───────────────────────────────────────────── */}
          {stage === "quiz" && (
            <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <Eyebrow>{CATEGORY_LABEL[q.category]}</Eyebrow>
                  <span className="font-mono text-xs text-[#6b7280] tabular-nums shrink-0">
                    {positionInSection(index)} / {countIn(q.category)} in section · {index + 1} of{" "}
                    {questions.length}
                  </span>
                </div>
                <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9920a] transition-all duration-300"
                    style={{ width: `${(index / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl md:text-2xl text-[#0f1f3d] font-semibold mb-5 leading-snug">
                {q.text}
              </h2>

              {q.rationale && (
                <div className="border-l-2 border-aic-copper pl-4 mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-aic-copper mb-1.5">
                    Why this is asked
                  </div>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{q.rationale}</p>
                </div>
              )}

              <div className="space-y-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.text}
                      type="button"
                      onClick={() => answer(opt.value)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                        selected
                          ? "border-[#c9920a] bg-[#c9920a]/5"
                          : "border-[#e5e7eb] bg-white hover:border-[#c9920a]/50 hover:bg-[#f0f4f8]"
                      }`}
                    >
                      <span className="text-sm text-[#0f1f3d]">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              <RequirementAnchor question={q} />

              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#0f1f3d] mt-8 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {returnToReview ? "Back to review" : "Back"}
              </button>
            </motion.div>
          )}

          {/* ── Review ─────────────────────────────────────────────── */}
          {stage === "review" && (
            <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Eyebrow>Before you see the result</Eyebrow>
              <h2
                className="text-2xl md:text-3xl text-[#0f1f3d] font-bold mt-3 mb-4 leading-tight"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Review your answers
              </h2>
              <p className="text-[#6b7280] leading-relaxed mb-8">
                The gap register is built directly from these, so it is worth thirty seconds. Change
                anything that reads more optimistically than the reality.
              </p>

              {categoryMeta.map((cat) => (
                <div key={cat.key} className="mb-8">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-aic-copper mb-3">
                    {CATEGORY_LABEL[cat.key]}
                  </div>
                  <ul className="divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
                    {questions
                      .map((qq, i) => ({ qq, i }))
                      .filter(({ qq }) => qq.category === cat.key)
                      .map(({ qq, i }) => {
                        const chosen = qq.options.find((o) => o.value === answers[qq.id]);
                        return (
                          <li key={qq.id} className="py-3.5 flex items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-[#6b7280] leading-snug mb-1">{qq.text}</p>
                              <p className="text-sm text-[#0f1f3d] font-medium leading-snug">
                                {chosen?.text ?? "—"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => editAnswer(i)}
                              className="inline-flex items-center gap-1 text-xs text-aic-copper font-semibold hover:underline shrink-0 mt-0.5"
                            >
                              <Pencil className="w-3 h-3" /> Change
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setStage("gate")}
                className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-lg"
              >
                These are accurate — continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── Gate ───────────────────────────────────────────────── */}
          {stage === "gate" && result && (
            <motion.div key="gate" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Eyebrow>Last step</Eyebrow>
              <h2
                className="text-2xl md:text-3xl text-[#0f1f3d] font-bold mt-3 mb-4 leading-tight"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Where should the report go?
              </h2>
              <p className="text-[#6b7280] leading-relaxed mb-8">
                Your answers are already recorded against nothing but this session until you submit.
                We ask for an email so the report has somewhere to go and so we can follow up on the
                gaps it surfaces — nothing here is sold or shared.
              </p>

              <form onSubmit={submitGate} className="space-y-5">
                <div>
                  <label htmlFor="aware-email" className="block text-sm font-medium text-[#0f1f3d] mb-1.5">
                    Work email
                  </label>
                  <input
                    id="aware-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:border-[#c9920a] focus:outline-none text-sm"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="aware-company" className="block text-sm font-medium text-[#0f1f3d] mb-1.5">
                    Organisation name{" "}
                    {wantsListed && <span className="text-[#c9920a]">(required to be listed)</span>}
                  </label>
                  <input
                    id="aware-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:border-[#c9920a] focus:outline-none text-sm"
                    placeholder="Optional, unless listing"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsListed}
                    onChange={(e) => setWantsListed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#c9920a]"
                  />
                  <span className="text-sm text-[#6b7280] leading-relaxed">
                    List my organisation in the public AIC Aware directory, by name and date only.
                    My score, my answers and my gap register are never published.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attested}
                    onChange={(e) => setAttested(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#c9920a]"
                  />
                  <span className="text-sm text-[#6b7280] leading-relaxed">
                    I confirm these answers reflect my organisation&apos;s AI governance practices to
                    the best of my knowledge, and I understand this is a self-declaration — Tier D
                    evidence under the standard — not an independent audit, and that it confers
                    neither AIC Assessed nor AIC Certified status.
                  </span>
                </label>

                {submitError && (
                  <p className="text-sm text-[#c41e3a] flex items-start gap-1.5">
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" /> {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] disabled:opacity-60 text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-lg"
                >
                  {submitting ? "Recording your declaration…" : "See my full result"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* ── Results ────────────────────────────────────────────── */}
          {stage === "results" && result && analysis && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <AwareResults
                result={result}
                analysis={analysis}
                organisation={company.trim()}
                onDownload={downloadPDF}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
