"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Gauge,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  FileDown,
  ExternalLink,
} from "lucide-react";
import { questions, type Category } from "@/app/data/questions";
import { calculateAssessmentResult, type AssessmentResult } from "@/lib/scoring";

type Stage = "intro" | "quiz" | "gate" | "results";

const CATEGORY_LABEL: Record<Category, string> = {
  USAGE: "AI Usage Context",
  OVERSIGHT: "Human Oversight",
  TRANSPARENCY: "Transparency",
  INFRASTRUCTURE: "Infrastructure & Compliance",
};

// The self-assessment engine's own TierInfo.color values are Tailwind classes
// ('text-aic-red' etc.) that predate this page and are pinned by
// __tests__/lib/scoring.test.ts — changing them would break passing tests for
// no benefit. They're also not real risk colours: aic-red resolves to the
// site's gold accent, and aic-orange/aic-green don't exist in the theme at
// all. Rather than touch shared theme tokens (used elsewhere for unrelated
// hover states) this page maps risk level to colour locally, matching the
// RGB values already used in the PDF (lib/report-generator.ts).
const RISK_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  "Tier 1": { text: "text-[#c41e3a]", bg: "bg-[#c41e3a]/10", border: "border-[#c41e3a]/30" },
  "Tier 2": { text: "text-[#ff8c42]", bg: "bg-[#ff8c42]/10", border: "border-[#ff8c42]/30" },
  "Tier 3": { text: "text-[#2c5f2d]", bg: "bg-[#2c5f2d]/10", border: "border-[#2c5f2d]/30" },
};

export default function AwareClient() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [wantsListed, setWantsListed] = useState(false);
  const [attested, setAttested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const result: AssessmentResult | null = useMemo(() => {
    if (stage !== "gate" && stage !== "results") return null;
    return calculateAssessmentResult(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const q = questions[current];
  const answeredCount = Object.keys(answers).length;

  function selectOption(value: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 150);
    } else {
      setTimeout(() => setStage("gate"), 150);
    }
  }

  function goBack() {
    if (current > 0) setCurrent((c) => c - 1);
    else setStage("intro");
  }

  async function submitGate(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setSubmitError(null);

    if (!attested) {
      setSubmitError("Please confirm the declaration before continuing — this is what keeps AIC Aware honest.");
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
          tier: result.tier.name === "Tier 1" ? "TIER_1" : result.tier.name === "Tier 2" ? "TIER_2" : "TIER_3",
          answers,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setSubmitError(data?.message || "Something went wrong recording your declaration. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setStage("results");
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadPDF() {
    if (!result) return;
    const { generatePDFReport } = await import("@/lib/report-generator");
    await generatePDFReport(result, company.trim() || "Your Organisation");
  }

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero — makes the Aware/Certified split the first thing anyone reads */}
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
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mb-8">
            A free, rigorous self-declaration against the same governance questions AIC audits
            against — so you can see your own gaps before anyone else does. It is intentionally
            not the same thing as certification, and we say so at every step.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-aic-copper" />
                <span className="text-sm font-bold text-white">AIC Aware</span>
              </div>
              <ul className="text-sm text-white/70 space-y-1.5 leading-relaxed">
                <li>Free, self-declared, 20-question assessment</li>
                <li>Endorses the Declaration of Algorithmic Rights</li>
                <li>Optional listing by name only — no scores made public</li>
                <li>Signals intent, not verified compliance</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-aic-copper" />
                <span className="text-sm font-bold text-white">AIC Certified</span>
              </div>
              <ul className="text-sm text-white/70 space-y-1.5 leading-relaxed">
                <li>Independent, evidence-based audit</li>
                <li>Carries the Certified mark on the public registry</li>
                <li>Annual recertification, Pulse monitoring for Divisions 2–4</li>
                <li>What insurers and regulators can rely on</li>
              </ul>
              <Link
                href="/certification"
                className="inline-flex items-center gap-1.5 text-aic-copper text-sm font-semibold mt-3 hover:gap-2.5 transition-all"
              >
                See the certification path <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h2
                className="text-2xl md:text-3xl text-[#0f1f3d] font-bold mb-4"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                20 questions. About ten minutes. No account needed.
              </h2>
              <p className="text-[#6b7280] leading-relaxed mb-4">
                These are the same four categories AIC audits against — AI usage context, human
                oversight, transparency, and infrastructure &amp; compliance — weighted the same
                way. Answer honestly: the value is in seeing where the gaps actually are, not in
                the number you end up with.
              </p>
              <p className="text-[#6b7280] leading-relaxed mb-8">
                At the end, you&apos;ll get a risk-level snapshot, a category breakdown, and a
                downloadable PDF. You can choose to be listed in the public AIC Aware directory by
                name — we never publish scores, so there is nothing to rank or misrepresent.
              </p>
              <button
                type="button"
                onClick={() => setStage("quiz")}
                className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-lg hover:-translate-y-0.5"
              >
                Start the free self-assessment <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-6">
                <Link
                  href="/aware/directory"
                  className="text-sm text-[#6b7280] hover:text-aic-copper transition-colors inline-flex items-center gap-1"
                >
                  See who else has declared <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {stage === "quiz" && q && (
            <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                    {CATEGORY_LABEL[q.category]}
                  </span>
                  <span className="text-xs text-[#6b7280] font-mono">
                    {current + 1} / {questions.length}
                  </span>
                </div>
                <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9920a] transition-all duration-300"
                    style={{ width: `${((current) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl md:text-2xl text-[#0f1f3d] font-semibold mb-6 leading-snug">
                {q.text}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.text}
                      type="button"
                      onClick={() => selectOption(opt.value)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                        selected
                          ? "border-[#c9920a] bg-[#c9920a]/5"
                          : "border-[#e5e7eb] hover:border-[#c9920a]/50 hover:bg-[#f0f4f8]"
                      }`}
                    >
                      <span className="text-sm text-[#0f1f3d]">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#0f1f3d] mt-8 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </motion.div>
          )}

          {stage === "gate" && result && (
            <motion.div key="gate" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#2c5f2d]" />
                <span className="text-sm font-semibold text-[#0f1f3d]">
                  All {answeredCount} questions answered.
                </span>
              </div>
              <h2
                className="text-2xl text-[#0f1f3d] font-bold mb-3"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                One last step before your result
              </h2>
              <p className="text-[#6b7280] leading-relaxed mb-8">
                We ask for an email so we can send your snapshot and, if you&apos;d like, follow up
                with the gaps it surfaced. Nothing here is shared or sold, and it is never
                confused with an AIC-verified status.
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
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] focus:border-[#c9920a] focus:outline-none text-sm"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="aware-company" className="block text-sm font-medium text-[#0f1f3d] mb-1.5">
                    Organisation name {wantsListed && <span className="text-[#c9920a]">(required to be listed)</span>}
                  </label>
                  <input
                    id="aware-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] focus:border-[#c9920a] focus:outline-none text-sm"
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
                    List my organisation in the public AIC Aware directory by name and date only —
                    my score and answers are never published.
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
                    I confirm the answers above reflect my organisation&apos;s AI governance
                    practices to the best of my knowledge, and I understand this is a self-declared
                    result, not an independent audit.
                  </span>
                </label>

                {submitError && (
                  <p className="text-sm text-[#c41e3a] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] disabled:opacity-60 text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-lg"
                >
                  {submitting ? "Recording your declaration…" : "See my result"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {stage === "results" && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {(() => {
                const c = RISK_COLOR[result.tier.name] ?? RISK_COLOR["Tier 2"];
                return (
                  <div className={`rounded-2xl border ${c.border} ${c.bg} p-8 mb-8`}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b7280]">
                      Self-declared integrity score
                    </span>
                    <div className="flex items-end gap-4 mt-2 mb-3">
                      <span className="text-5xl font-bold text-[#0f1f3d]" style={{ fontFamily: "'Merriweather', serif" }}>
                        {result.integrityScore}
                      </span>
                      <span className="text-lg text-[#6b7280] mb-1.5">/ 100</span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${c.text} bg-white/60 text-sm font-semibold mb-3`}>
                      {result.tier.title}
                    </div>
                    <p className="text-sm text-[#0f1f3d]/80 leading-relaxed">{result.tier.desc}</p>
                  </div>
                );
              })()}

              <h3 className="text-lg font-bold text-[#0f1f3d] mb-4">Category breakdown</h3>
              <div className="space-y-4 mb-10">
                {Object.values(result.categoryScores).map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#0f1f3d] font-medium">{CATEGORY_LABEL[cat.name as Category]}</span>
                      <span className="text-[#6b7280] font-mono">{cat.score}%</span>
                    </div>
                    <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0f1f3d] rounded-full" style={{ width: `${cat.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 bg-[#0f1f3d] hover:bg-[#0a1628] text-white px-6 py-3.5 rounded-full transition-all text-sm font-bold"
                >
                  <FileDown className="w-4 h-4" /> Download PDF snapshot
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white border border-[#e5e7eb] hover:border-[#c9920a] text-[#0f1f3d] px-6 py-3.5 rounded-full transition-all text-sm font-bold"
                >
                  Talk to us about AIC Certified <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-[#f0f4f8] border border-[#e5e7eb] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-aic-copper" />
                  <span className="text-sm font-bold text-[#0f1f3d]">We endorse the Declaration of Algorithmic Rights</span>
                </div>
                <p className="text-sm text-[#6b7280] leading-relaxed mb-2">
                  This badge means your organisation has completed AIC Aware and endorses the five
                  rights the Declaration sets out. It is not the AIC Certified mark, it does not
                  appear on the public registry, and it cannot be verified by a third party — only
                  an independent AIC audit produces a checkable result.
                </p>
                <Link
                  href="/governance-hub#declaration"
                  className="text-aic-copper text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Read the Declaration <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {submitted && (
                <p className="text-xs text-[#6b7280] mt-6">
                  Recorded for {email}
                  {wantsListed ? " — you'll appear in the AIC Aware directory shortly." : "."}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
