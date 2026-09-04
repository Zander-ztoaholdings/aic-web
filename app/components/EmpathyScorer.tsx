"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { DURATION, EASE_OUT, STAGGER, countTo } from "@/lib/motion";

/**
 * The homepage's one interactive moment.
 *
 * A visitor scores a real-shaped rejection letter against the dimensions of
 * AIC's own Empathy Rubric (requirement EM-1), then sees what AIC scored it and
 * where they disagreed.
 *
 * Why this and not more copy: the site's whole product is scrutiny, and until
 * now there was nothing on it a visitor could scrutinise. Making the reader
 * apply the standard themselves teaches it in a way no paragraph does, and it
 * is not something a body without a real rubric could build — which is exactly
 * why it works as evidence rather than assertion.
 *
 * Nothing is transmitted. All state is local to the component.
 */

type Verdict = 0 | 5 | 10;

interface Dimension {
  key: string;
  label: string;
  /** What the assessor is actually looking for. */
  hint: string;
  /** AIC's own score, 0-10. These sum to 12 of a possible 70. */
  aic: number;
  /** Why. Shown after the reader has committed to their own score. */
  note: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: "reason",
    label: "States the reason",
    hint: "Does it say why, specifically?",
    aic: 1,
    note: "“In accordance with our internal credit policy” names a document, not a reason. The applicant cannot act on it.",
  },
  {
    key: "plain",
    label: "Plain language",
    hint: "Would an ordinary reader understand it without effort?",
    aic: 6,
    note: "The grammar is clear enough. This is the letter's only real strength, and it is doing a lot of work to disguise the rest.",
  },
  {
    key: "contact",
    label: "Human contact point",
    hint: "Is there a person, reachable?",
    aic: 0,
    note: "“Do not reply to this message” is the opposite of a contact point. It closes the only channel the letter opened.",
  },
  {
    key: "steps",
    label: "Actionable next steps",
    hint: "Does the person know what to do now?",
    aic: 1,
    note: "“At this time” implies a later time exists, and then says nothing about how to reach it.",
  },
  {
    key: "who",
    label: "Names the decision-maker",
    hint: "Is anyone accountable for this outcome?",
    aic: 0,
    note: "Nobody is named anywhere. This is the failure AIC exists for — there is no human attached to a decision that changed someone's year.",
  },
  {
    key: "challenge",
    label: "Route to challenge",
    hint: "Can the decision be contested?",
    aic: 1,
    note: "No appeal route is offered. Under POPIA §71 the applicant is entitled to make representations about a solely automated decision.",
  },
  {
    key: "tone",
    label: "Tone and dignity",
    hint: "Does it treat the reader as a person?",
    aic: 3,
    note: "“Dear Applicant” addresses a category. The letter is polite, which is not the same as respectful.",
  },
];

const MAX = DIMENSIONS.length * 10;
const AIC_TOTAL = DIMENSIONS.reduce((n, d) => n + d.aic, 0);
const BLOCK_THRESHOLD = 40;

const CHOICES: { value: Verdict; label: string }[] = [
  { value: 0, label: "Absent" },
  { value: 5, label: "Partial" },
  { value: 10, label: "Present" },
];

export default function EmpathyScorer() {
  const [scores, setScores] = useState<Record<string, Verdict>>({});
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion() ?? false;

  // The two totals count up rather than appearing. The number is the payload
  // here — the whole exercise exists to make the size of the gap felt — so
  // giving it weight is the motion doing a job. Reduced motion gets the final
  // value immediately, because the figure is the information and the movement
  // is only emphasis.
  const [shownReader, setShownReader] = useState(0);
  const [shownAic, setShownAic] = useState(0);

  useEffect(() => {
    if (!revealed) {
      setShownReader(0);
      setShownAic(0);
      return;
    }
    const total = Object.values(scores).reduce<number>((n, v) => n + v, 0);
    const stopA = countTo(total, setShownReader, { reduced });
    const stopB = countTo(AIC_TOTAL, setShownAic, { reduced });
    return () => {
      stopA();
      stopB();
    };
  }, [revealed, scores, reduced]);

  const answered = Object.keys(scores).length;
  const complete = answered === DIMENSIONS.length;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
      {/* ── The letter ──────────────────────────────────────────────── */}
      <div className="border-b lg:border-b-0 lg:border-r border-[#e5e7eb] bg-[#f8f9fb]">
        <div className="px-5 py-3 border-b border-[#e5e7eb] bg-white">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9ca3af]">
            Automated decline · composite, no organisation named
          </span>
        </div>
        <div className="p-6 sm:p-8 text-[15px] leading-relaxed text-[#3d4a58] space-y-4">
          <p className="font-semibold text-[#0f1f3d]">Dear Applicant,</p>
          <p>
            Thank you for your recent application. After careful consideration,
            we regret to inform you that we are unable to approve your request
            at this time.
          </p>
          <p>
            This decision was made in accordance with our internal credit
            policy. We are unable to provide further detail regarding the
            specific factors involved.
          </p>
          <p>
            This is an automated notification. Please do not reply to this
            message.
          </p>
          <p className="pt-2 text-[#6b7280]">Customer Operations</p>
        </div>
      </div>

      {/* ── Scoring ─────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8">
        {!revealed ? (
          <>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h3 className="text-lg font-semibold text-[#0f1f3d]">
                Score it yourself
              </h3>
              <span className="font-mono text-xs text-[#9ca3af] tabular-nums">
                {answered}/{DIMENSIONS.length}
              </span>
            </div>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-6">
              Seven dimensions from the rubric AIC uses on real adverse
              communications. Nothing you enter leaves your browser.
            </p>

            <div className="space-y-3.5">
              {DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-1.5">
                    <span className="text-sm font-medium text-[#0f1f3d]">
                      {d.label}
                    </span>
                    <span className="text-xs text-[#9ca3af]">{d.hint}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={d.label}>
                    {CHOICES.map((c) => {
                      const active = scores[d.key] === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setScores((s) => ({ ...s, [d.key]: c.value }))
                          }
                          className={`text-xs font-medium py-2 rounded-md border transition-colors ${
                            active
                              ? "border-aic-copper bg-aic-copper/10 text-[#8a6607]"
                              : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-aic-copper/40 hover:text-[#0f1f3d]"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!complete}
              onClick={() => setRevealed(true)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-aic-navy text-white px-5 py-3 rounded-lg font-semibold text-sm transition-all enabled:hover:bg-[#0f1f3d] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {complete
                ? "Compare with AIC's assessment"
                : `Score all seven to compare`}
              {complete && <ArrowRight className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-[#0f1f3d]">
                  Where you and AIC differ
                </h3>
                <p className="text-sm text-[#6b7280] mt-0.5">
                  Rubric EM-1 · out of {MAX}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScores({});
                  setRevealed(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#0f1f3d] transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 border border-[#e5e7eb] rounded-lg p-3.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9ca3af] mb-1">
                  You scored it
                </div>
                <div className="text-3xl font-bold text-[#0f1f3d] tabular-nums">
                  {shownReader}
                </div>
              </div>
              <div className="flex-1 border border-aic-copper/40 bg-aic-copper/5 rounded-lg p-3.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8a6607] mb-1">
                  AIC scored it
                </div>
                <div className="text-3xl font-bold text-[#0f1f3d] tabular-nums">
                  {shownAic}
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {DIMENSIONS.map((d, i) => {
                const mine = scores[d.key] ?? 0;
                const gap = Math.abs(mine - d.aic);
                return (
                  <motion.li
                    key={d.key}
                    className="border-b border-[#f1f1f0] pb-3 last:border-b-0"
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DURATION.base,
                      ease: EASE_OUT,
                      delay: reduced ? 0 : i * STAGGER,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-[#0f1f3d] flex-1">
                        {d.label}
                      </span>
                      <span className="font-mono text-xs text-[#9ca3af] tabular-nums shrink-0">
                        you {mine} · AIC {d.aic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-[#f0f4f8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#94a3b8]"
                          style={{ width: `${mine * 10}%` }}
                        />
                      </div>
                      <div className="h-1.5 flex-1 rounded-full bg-[#f0f4f8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-aic-copper"
                          style={{ width: `${d.aic * 10}%` }}
                        />
                      </div>
                    </div>
                    {gap >= 5 && (
                      <p className="text-xs text-[#6b7280] leading-relaxed">
                        {d.note}
                      </p>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {/* The point of the whole exercise, delivered at the moment the
                reader has just personally judged the letter. */}
            <div className="border-l-2 border-[#d4183d] pl-4 py-1 mb-5">
              <p className="text-sm text-[#0f1f3d] leading-relaxed">
                <strong>A score below {BLOCK_THRESHOLD} blocks certification
                outright.</strong>{" "}
                This letter scores {AIC_TOTAL}. It is also, in our experience,
                an entirely ordinary letter — which is the problem.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/standard#em"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-aic-copper hover:gap-2.5 transition-all"
              >
                See all 10 Empathy requirements <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?enquiry=empathy"
                className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#0f1f3d] transition-colors"
              >
                Have us score yours
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
