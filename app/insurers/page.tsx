"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  BadgeCheck,
  ArrowRight,
  CircleSlash,
} from "lucide-react";

const steps = [
  {
    title: "An insured presents an AIC badge",
    detail:
      "Every AIC certificate carries a QR code and a verify URL — printed on the badge, not just claimed in a proposal.",
  },
  {
    title: "You confirm it directly with AIC",
    detail:
      "The verify page answers in under 30 seconds, with no login: status, scope, Division, expiry, and whether continuous Pulse monitoring is live.",
  },
  {
    title: "The status is never taken on trust",
    detail:
      "A suspended or lapsed certification shows plainly, with its history — a badge that can visibly lapse is a badge that means something.",
  },
];

export default function InsurersPage() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 1, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
                For Insurers &amp; Underwriters
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl mb-6 leading-[1.05] tracking-[-0.03em] font-bold"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Insurers recognise AIC certification.
            </h1>
            <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
              AIC certifies that a named, accountable human stands behind an organisation&apos;s
              consequential automated decisions, and publishes the result. What you do with that
              signal — pricing, underwriting appetite, portfolio review — stays entirely yours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What the mark verifies */}
      <section className="py-24 border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            What the Mark Verifies
          </span>
          <h2
            className="text-3xl md:text-4xl text-[#0f1f3d] mt-4 mb-8 leading-[1.1] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            An evidence-based audit, not a self-declaration
          </h2>
          <p className="text-[#6b7280] text-lg leading-relaxed mb-6">
            AIC certification is an evidence-based audit against published requirements, mapped to
            the regulatory frameworks that apply to the certified organisation. It confirms that a
            named individual is accountable for the organisation&apos;s AI-driven decisions, that an
            override process exists, and that the certification is checkable — not just claimed.
          </p>
          <p className="text-[#6b7280] text-lg leading-relaxed">
            A certification that can quietly lapse without anyone noticing isn&apos;t worth much.
            Certified organisations can carry the <strong className="text-[#0f1f3d]">Continuously
            Monitored</strong> overlay when Pulse telemetry is live and coherent — the visible face
            of a mark that stays accountable after the audit, not only on the day of it.
          </p>
        </div>
      </section>

      {/* How verification works */}
      <section className="py-24 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            How Verification Works
          </span>
          <h2
            className="text-3xl md:text-4xl text-[#0f1f3d] mt-4 mb-12 leading-[1.1] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Confirm a status directly from AIC — never from the insured
          </h2>
          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 border-t border-[#e5e7eb] pt-8"
              >
                <div className="text-aic-copper font-mono text-sm shrink-0 w-8">0{i + 1}</div>
                <div>
                  <h3 className="text-[#0f1f3d] font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-[#6b7280] leading-relaxed">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 mt-12 bg-aic-navy text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-all"
          >
            <Search className="w-4 h-4" />
            Verify a certificate
          </Link>
        </div>
      </section>

      {/* Insurer Recognised programme */}
      <section className="py-24 border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            Insurer Recognised
          </span>
          <h2
            className="text-3xl md:text-4xl text-[#0f1f3d] mt-4 mb-8 leading-[1.1] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Naming who recognises the mark — not what AIC does for you
          </h2>
          <p className="text-[#6b7280] text-lg leading-relaxed mb-6">
            Where an insurer has agreed to treat AIC certification as a factor in underwriting, the
            certificate&apos;s verify page names that directly:
          </p>
          <div className="flex items-start gap-3 bg-white border border-[#e5e7eb] rounded-lg p-6 mb-8">
            <BadgeCheck className="w-5 h-5 text-aic-copper shrink-0 mt-0.5" />
            <p className="text-[#0f1f3d] font-mono text-sm">
              AIC Certified · Recognised by [Insurer Name] for premium benefit
            </p>
          </div>
          <p className="text-[#6b7280] text-lg leading-relaxed">
            The direction matters: insurers recognise AIC certification — AIC does not certify{" "}
            <em>for</em> insurance, and does not perform risk analysis, pricing, or underwriting
            work on an insurer&apos;s behalf. That line is what keeps the certification body
            impartial, and it&apos;s not open to blurring.
          </p>
        </div>
      </section>

      {/* Boundary statement */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-4 border border-[#e5e7eb] rounded-xl p-8">
            <CircleSlash className="w-6 h-6 text-[#6b7280] shrink-0 mt-1" />
            <div>
              <h3 className="text-[#0f1f3d] font-semibold text-lg mb-3">
                What AIC does not do
              </h3>
              <p className="text-[#6b7280] leading-relaxed">
                AIC certifies governance, not products, and does not conduct assessments on behalf
                of an insurer or for insurance purposes. AIC does not price risk, underwrite, or
                advise on coverage. An AIC certification is one input an insurer may choose to use —
                the decision, and the terms, remain the insurer&apos;s alone.
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
            Considering AIC certification as an underwriting signal?
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Talk to us about how recognition works, what the methodology covers, and what a pilot
            with your team could look like.
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
