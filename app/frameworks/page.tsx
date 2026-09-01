import type { Metadata } from "next";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { frameworks, frameworksReviewedAt } from "@/app/data/frameworks-data";

export const metadata: Metadata = {
  title: "Frameworks",
  description:
    "Where AI-assisted decisioning maps against established industry safety and governance frameworks — by industry, with an honest account of where the analogy holds and where it doesn't.",
};

export default function FrameworksPage() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              Frameworks
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl mb-6 leading-[1.05] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Industries already have a safety language. We map AI into it.
          </h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
            Rather than invent a new AI risk vocabulary from scratch, AIC maps AI-assisted decisioning
            against the established safety and governance frameworks each industry already runs on —
            engineering&apos;s SIL ratings, banking&apos;s model risk management, medical software&apos;s
            safety classification. Each framework page states the positioning, the acceptable-use
            boundary, and the safety measures a subject is expected to demonstrate against — not AIC&apos;s
            internal assessment methodology.
          </p>
        </div>
      </section>

      {/* Framework cards */}
      <section className="py-20 md:py-24">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {frameworks.map((fw) => (
              <Link
                key={fw.slug}
                href={`/frameworks/${fw.slug}`}
                className="group bg-white border border-[#e5e7eb] rounded-xl p-8 hover:border-aic-copper/40 hover:shadow-lg transition-all flex flex-col"
              >
                <span className="text-aic-copper text-[0.65rem] uppercase tracking-[0.25em] font-mono font-bold mb-3">
                  {fw.kicker}
                </span>
                <h2 className="text-xl font-semibold text-[#0f1f3d] mb-3 leading-snug">
                  {fw.industry}
                </h2>
                <p className="text-[#6b7280] text-sm leading-relaxed mb-6 flex-1">
                  {fw.title}
                </p>
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#9ca3af] pt-4 border-t border-[#e5e7eb]">
                  <span>{fw.ratingScale}</span>
                  <ArrowRight className="w-4 h-4 text-aic-copper group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <p className="text-xs text-[#9ca3af] mt-10 max-w-3xl">
            Reviewed {frameworksReviewedAt}. These are the industries where we currently have enough
            genuine depth to publish a mapping — not an exhaustive list. We&apos;re researching further
            industries and will add them here once the same standard applies: real, publicly documented
            frameworks, honestly translated.
          </p>
        </div>
      </section>

      {/* Boundary note */}
      <section className="py-20 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-[#0f1f3d] mb-3">
            What these pages are, and aren&apos;t
          </h2>
          <p className="text-[#6b7280] leading-relaxed">
            Each framework page names the real, publicly documented standard it draws on, states
            AIC&apos;s positioning against it, and lists the safety measures a subject is expected to
            demonstrate — as outcomes. What&apos;s deliberately not published is AIC&apos;s internal
            scoring, evidence thresholds, or audit procedure — the same way a safety standard tells you
            what to demonstrate without telling you exactly how an individual auditor will judge whether
            you&apos;ve demonstrated it well enough.
          </p>
        </div>
      </section>
    </div>
  );
}
