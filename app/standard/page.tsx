import type { Metadata } from "next";
import Link from "next/link";
import StandardClient from "./StandardClient";
import {
  requirements,
  STANDARD_VERSION,
  STANDARD_ISSUED,
} from "@/app/data/requirements-data";

export const metadata: Metadata = {
  title: "The AIC Standard",
  description:
    "The 44 requirements AIC assesses an organisation against, published in full — what is tested, which Divisions it applies to, and what evidence it takes.",
  alternates: { canonical: "/standard" },
  openGraph: {
    title: "The AIC Standard — 44 requirements, published in full",
    description:
      "What specifically will you test us against? This is the answer: 44 testable requirements across five algorithmic rights.",
  },
};

export default function StandardPage() {
  const flagships = requirements.filter((r) => r.flagship).length;
  const facts: [string, string][] = [
    [String(requirements.length), "requirements"],
    ["5", "rights"],
    ["5", "Divisions"],
    [String(flagships), "hard to fake"],
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#0e1b2c]">
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-10 items-end">
          <div className="max-w-2xl">
            <p className="text-sm text-white/60 mb-4">
              The AIC standard, {STANDARD_VERSION}, issued {STANDARD_ISSUED}
            </p>
            <h1
              className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              What we actually test
            </h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              Every organisation asks the same first question: what exactly will you assess us
              against? This is the answer, in full: every requirement, what it demands, and the
              evidence it takes. A certification scheme nobody can read is a scheme nobody should
              trust.
            </p>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-x-8 gap-y-6">
            {facts.map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-3xl md:text-4xl font-bold tabular-nums" style={{ fontFamily: "'Merriweather', serif" }}>{n}</span>
                  <span className="block text-sm text-white/60 mt-1">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <StandardClient />

      {/* What the page is not. Stated plainly, but after the standard rather
          than as two boxes a reader has to get through first. */}
      <section className="bg-white border-t border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-14 grid md:grid-cols-3 gap-8 md:gap-12 text-sm leading-[1.65]">
          <div>
            <h2 className="text-[15px] font-semibold mb-2">How each requirement is tested stays with AIC</h2>
            <p className="text-[#5e6b7b]">
              What we test and what evidence it takes is public. The procedure an auditor follows to
              test it is not, the same way any standard tells you what to demonstrate without
              telling you how an individual auditor will judge it.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold mb-2">The ISO/IEC 42001 mapping is not here yet</h2>
            <p className="text-[#5e6b7b]">
              It is drafted, but indicative until we have checked it against the purchased standard
              text. Publishing an unverified mapping to an international standard is exactly the kind
              of unbacked claim AIC exists to catch.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold mb-2">Thresholds are provisional</h2>
            <p className="text-[#5e6b7b]">
              The empathy floor, the disparate impact ratio and correction response times will be
              confirmed before the first certificate is issued, and any change is recorded with its
              reason. No organisation has been certified yet; the{" "}
              <Link href="/registry" className="text-[#a8772a] underline-offset-2 hover:underline">public register</Link>{" "}
              is empty and says so.{" "}
              <Link href="/certification" className="text-[#a8772a] underline-offset-2 hover:underline">How the Divisions and the assessment work</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
