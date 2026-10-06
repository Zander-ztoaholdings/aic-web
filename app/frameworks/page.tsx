import type { Metadata } from "next";
import Link from "next/link";
import { TRACKED_FRAMEWORKS } from "@/app/data/platform-data";
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
        <div className="max-w-[1600px] mx-auto px-5 md:px-4 relative z-10">
          <p className="text-sm text-white/60 mb-4">Frameworks</p>
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
        <div className="max-w-[1600px] mx-auto px-5 md:px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {frameworks.map((fw) => (
              <Link
                key={fw.slug}
                href={`/frameworks/${fw.slug}`}
                className="group bg-white border border-[#e5e7eb] rounded-xl p-8 hover:border-[#a8772a]/50 transition-colors flex flex-col"
              >
                <span className="text-[13px] text-[#5e6b7b] mb-2">
                  {fw.kicker}
                </span>
                <h2 className="text-xl font-semibold text-[#0f1f3d] mb-3 leading-snug">
                  {fw.industry}
                </h2>
                <p className="text-[#6b7280] text-sm leading-relaxed mb-6 flex-1">
                  {fw.title}
                </p>
                <div className="flex items-center justify-between text-sm text-[#5e6b7b] pt-4 border-t border-[#dde2e8]">
                  <span>Rated on {fw.ratingScale}</span>
                  <span className="font-semibold text-[#a8772a] group-hover:underline underline-offset-2">Read the mapping</span>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-xs text-[#5e6b7b] mt-10 max-w-3xl">
            Reviewed {frameworksReviewedAt}. These are the industries where we currently have enough
            genuine depth to publish a mapping — not an exhaustive list. We&apos;re researching further
            industries and will add them here once the same standard applies: real, publicly documented
            frameworks, honestly translated.
          </p>
        </div>
      </section>

      {/* The other kind of framework AIC offers. Kept on this page so that
          "frameworks" on the website means everything AIC offers, while the
          difference between the two kinds stays explicit. */}
      <section className="py-16 md:py-20 bg-white border-t border-[#dde2e8]">
        <div className="max-w-[1600px] mx-auto px-5 md:px-4 grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-8 lg:gap-16">
          <div>
            <h2 className="text-2xl md:text-[1.75rem] text-[#0f1f3d] font-bold leading-[1.2]" style={{ fontFamily: "'Merriweather', serif" }}>
              {TRACKED_FRAMEWORKS.length} frameworks you can track in the platform
            </h2>
            <p className="text-[#5e6b7b] leading-[1.65] mt-3">
              The mappings above are AIC&apos;s position on how AI fits an industry&apos;s safety
              discipline. These are different: published laws and standards whose requirements the{" "}
              <Link href="/platform#compliance" className="font-semibold text-[#a8772a] underline-offset-2 hover:underline">platform</Link>{" "}
              tracks, with evidence from your connected systems mapped to each one. A mapping says
              the evidence usually supports a requirement; it is not an auditor&apos;s conclusion.
            </p>
            <p className="text-[#5e6b7b] leading-[1.65] mt-3">
              The <Link href="/regulatory-map" className="font-semibold text-[#a8772a] underline-offset-2 hover:underline">regulatory map</Link>{" "}
              shows which of them apply in each country.
            </p>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 content-start">
            {TRACKED_FRAMEWORKS.map((f) => (
              <li key={f.name} className="border-t border-[#dde2e8] pt-3 leading-snug">
                <span className="block font-medium text-[#0f1f3d]">{f.name}</span>
                <span className="block text-[13px] text-[#5e6b7b]">{f.where}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Boundary note */}
      <section className="py-20 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-5 md:px-4">
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
