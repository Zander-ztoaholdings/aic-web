"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  CircleSlash,
  BookOpen,
} from "lucide-react";
import { workshopIndustries } from "@/app/data/workshops-data";

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

            {/* Rotating teaser card */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 md:p-10 min-h-[220px] flex flex-col justify-center">
              <span className="text-[#9ca3af] text-[0.65rem] uppercase tracking-[0.25em] font-mono font-bold mb-6">
                In this session
              </span>
              <div className="relative min-h-[96px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${active.slug}-${topicIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-xl md:text-2xl text-[#0f1f3d] font-medium leading-snug"
                    style={{ fontFamily: "'Merriweather', serif" }}
                  >
                    {active.topics[topicIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex gap-1.5 mt-8">
                {active.topics.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === topicIndex ? "w-8 bg-aic-copper" : "w-1.5 bg-[#e5e7eb]"
                    }`}
                  />
                ))}
              </div>
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

      {/* CTA */}
      <section className="py-24 bg-aic-navy text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl mb-6 leading-[1.1] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Want to bring a session to your team?
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Tell us your industry and team size, and we&apos;ll let you know what a session could look
            like.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 bg-aic-copper text-white px-10 py-5 rounded-full font-bold hover:bg-[#b07d08] transition-all shadow-xl shadow-aic-copper/20 hover:-translate-y-1"
          >
            Contact us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
