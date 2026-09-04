"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  CircleSlash,
  BookOpen,
} from "lucide-react";
import { workshopIndustries } from "@/app/data/workshops-data";
import WorkshopIntake from "./WorkshopIntake";
import { DURATION, EASE_OUT } from "@/lib/motion";

export default function WorkshopsPage() {
  const [activeSlug, setActiveSlug] = useState(workshopIndustries[0].slug);
  const [topicIndex, setTopicIndex] = useState(0);

  const active =
    workshopIndustries.find((w) => w.slug === activeSlug) ?? workshopIndustries[0];

  // Reset the teaser cycle whenever the selected industry changes.
  useEffect(() => {
    setTopicIndex(0);
  }, [activeSlug]);

  // Auto-cycle the teaser topic every 4 seconds.
  useEffect(() => {
    const id = setInterval(() => {
      setTopicIndex((i) => (i + 1) % active.topics.length);
    }, 4000);
    return () => clearInterval(id);
  }, [active.topics.length]);

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              Workshops
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl mb-6 leading-[1.05] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            We teach the framework. We don&apos;t consult on it.
          </h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
            Industry-specific sessions on how AI-assisted decisioning maps against the safety and
            governance frameworks your industry already runs on. Pick an industry below to see what a
            session covers.
          </p>
        </div>
      </section>

      {/* Industry selector + rotating teaser */}
      <section className="py-20 md:py-24">
        <div className="max-w-[1600px] mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            {workshopIndustries.map((w) => {
              const isActive = w.slug === activeSlug;
              return (
                <button
                  key={w.slug}
                  type="button"
                  onClick={() => setActiveSlug(w.slug)}
                  aria-pressed={isActive}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-aic-navy text-white shadow-md"
                      : "bg-white text-[#6b7280] border border-[#e5e7eb] hover:border-aic-copper/40 hover:text-[#0f1f3d]"
                  }`}
                >
                  {w.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
            {/* Summary */}
            <div>
              <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
                {active.label}
              </span>
              <h2 className="text-2xl md:text-3xl text-[#0f1f3d] mt-4 mb-6 font-bold tracking-[-0.02em] leading-[1.15]">
                {active.summary}
              </h2>
              <Link
                href={`/frameworks/${active.frameworkSlug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-aic-copper hover:gap-3 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                See the underlying framework mapping
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* The syllabus, in full.
                This rotated one topic at a time through a card, which meant a
                visitor deciding whether to book saw a fifth of what a session
                covers and had to wait out a carousel for the rest. The whole
                list is now visible; the rotation only moves the emphasis, so
                the movement still draws the eye without withholding anything. */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 md:p-10">
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <span className="text-[#9ca3af] text-[0.65rem] uppercase tracking-[0.25em] font-mono font-bold">
                  In this session
                </span>
                <span className="font-mono text-[11px] text-[#9ca3af] tabular-nums">
                  {active.topics.length} topics
                </span>
              </div>
              <ul className="space-y-1">
                {active.topics.map((topic, i) => {
                  const isCurrent = i === topicIndex;
                  return (
                    <li key={topic}>
                      <motion.button
                        type="button"
                        onClick={() => setTopicIndex(i)}
                        animate={{ opacity: isCurrent ? 1 : 0.55 }}
                        transition={{ duration: DURATION.base, ease: EASE_OUT }}
                        className="w-full text-left flex gap-4 py-3 border-b border-[#f1f1f0] last:border-b-0"
                      >
                        <span
                          className={`font-mono text-[11px] tabular-nums pt-1 shrink-0 transition-colors ${
                            isCurrent ? "text-aic-copper" : "text-[#9ca3af]"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`leading-snug transition-all ${
                            isCurrent
                              ? "text-[#0f1f3d] text-lg md:text-xl font-medium"
                              : "text-[#6b7280] text-[15px]"
                          }`}
                          style={
                            isCurrent
                              ? { fontFamily: "'Merriweather', serif" }
                              : undefined
                          }
                        >
                          {topic}
                        </span>
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Boundary statement — the Andersen firewall, stated plainly */}
      <section className="py-20 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-start gap-4 border border-[#e5e7eb] rounded-xl p-8">
            <CircleSlash className="w-6 h-6 text-[#6b7280] shrink-0 mt-1" />
            <div>
              <h3 className="text-[#0f1f3d] font-semibold text-lg mb-3">
                What an AIC workshop does not do
              </h3>
              <p className="text-[#6b7280] leading-relaxed mb-4">
                AIC workshops teach the framework. They do not constitute an assessment, and completing
                one has no bearing on certification outcomes for your organisation — attending a session
                is not a step toward, or a substitute for, an independent AIC audit.
              </p>
              <p className="text-[#6b7280] leading-relaxed">
                We don&apos;t review your specific systems, score your organisation, or advise on your
                compliance posture in a workshop setting. That firewall exists because AIC never
                certifies an organisation it has consulted for — the same independence principle that
                governs every certification we issue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intake.
          This said "tell us your industry and team size" above a button to the
          general contact form, which asks for neither — so the two facts needed
          to answer a workshop enquiry were exactly the two we did not collect,
          and every reply began by asking for them. */}
      <section id="enquire" className="py-20 md:py-24 bg-[#f0f4f8] border-t border-[#e5e7eb]">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                Bring a session to your team
              </span>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-4 mb-5 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Four questions, and we can tell you what a session looks like
              </h2>
              <p className="text-[#3d4a58] leading-relaxed mb-6">
                Sessions are scoped to the industry and the room. Tell us which
                one and how many people, and you get a straight answer on
                format, length and cost rather than a discovery call.
              </p>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                We ask nothing about your AI governance here, on purpose.
                Workshops teach and do not assess, and profiling a prospect&apos;s
                compliance posture at the enquiry stage is the first crack in
                the firewall that lets AIC certify you later.
              </p>
            </div>
            <WorkshopIntake industrySlug={active.slug} />
          </div>
        </div>
      </section>
    </div>
  );
}
