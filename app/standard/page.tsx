import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, EyeOff, ArrowRight } from "lucide-react";
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
  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24">
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#162640] pt-24 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aic-copper to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="w-5 h-5 text-aic-copper" />
            <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
              The Standard · {STANDARD_VERSION}
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl text-aic-paper font-bold leading-tight mb-6"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            What we actually test
          </h1>
          <p className="text-lg text-aic-paper/70 leading-relaxed max-w-3xl">
            Every organisation asks the same first question: what specifically
            will you assess us against? This is the answer, in full — all{" "}
            {requirements.length} requirements, what each one demands, and what
            evidence it takes to satisfy it. We publish it because a
            certification scheme nobody can read is a scheme nobody should
            trust.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        {/* What is withheld, and why. Stating this up front is the point: a
            reader should not have to discover an omission. */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-8">
          <div className="flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-aic-copper shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-[#0f1f3d] mb-2">
                Two things are deliberately not on this page
              </h2>
              <p className="text-sm text-[#6b7280] leading-relaxed mb-2">
                <strong className="text-[#0f1f3d]">The verification method.</strong>{" "}
                How an auditor tests each requirement stays with AIC. What we
                test and what evidence it takes is public; the procedure for
                testing it is not.
              </p>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                <strong className="text-[#0f1f3d]">
                  The ISO/IEC 42001 clause mapping.
                </strong>{" "}
                It is drafted, but indicative until we have verified it against
                the purchased standard text. Publishing an unverified mapping to
                an international standard would be exactly the kind of unbacked
                claim this organisation exists to catch, so it stays off the page
                until it is checked.
              </p>
            </div>
          </div>
        </div>

        {/* Version honesty */}
        <div className="bg-aic-navy/5 border border-aic-copper/20 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-2">
            This is version 1, issued {STANDARD_ISSUED}
          </h2>
          <p className="text-sm text-[#6b7280] leading-relaxed">
            The requirement set is settled enough to be assessed against and
            open enough to be argued with. Specific numeric thresholds — the
            empathy floor, the disparate impact ratio, correction response times
            — are provisional and will be confirmed before the first certificate
            is issued. Where a threshold moves, the revision record will say so
            and why. No organisation has been certified against this standard
            yet; the{" "}
            <Link href="/registry" className="text-aic-copper hover:underline">
              public register
            </Link>{" "}
            is empty and will stay that way until one has been.
          </p>
        </div>

        <StandardClient />

        <div className="mt-8 text-center">
          <Link
            href="/certification"
            className="inline-flex items-center gap-2 text-sm font-semibold text-aic-copper hover:gap-3 transition-all"
          >
            How the Divisions and the assessment work{" "}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
