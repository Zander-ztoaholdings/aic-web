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
            {/* Was "Insurers recognise AIC certification." — stated as present
                fact, and not one. No insurer recognises it: there are no
                certified organisations and no recognition arrangement in place.
                The body copy below was already careful and conditional; the
                headline contradicted it. The honest version is also the more
                interesting one, because the underwriter's actual problem is
                more compelling than a claim about our own standing. */}
            <h1
              className="text-4xl md:text-6xl mb-6 leading-[1.05] tracking-[-0.03em] font-bold max-w-4xl text-balance"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              You are already writing AI risk. You just cannot see it.
            </h1>
            <p className="text-xl text-white/70 max-w-3xl leading-relaxed mb-8">
              Somewhere in your book are insureds whose consequential decisions
              are made by systems nobody in the business can explain, with no
              named human accountable for the outcome. Nothing on a proposal
              form asks. AIC exists to make that answerable — and verifiable by
              you in under thirty seconds, without taking anyone&apos;s word for it.
            </p>
            <p className="text-sm text-white/50 max-w-3xl leading-relaxed border-l-2 border-aic-copper/40 pl-4">
              To be plain about where this stands: no insurer currently
              recognises AIC certification, and no organisation has been
              certified yet. This page sets out what the signal would be and how
              recognition would work. We would rather propose it than describe
              it as though it already exists.
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

      {/* The artefact. An underwriter does not want to be told verification is
          fast — they want to see what comes back. This is what /verify returns
          against a certificate number, laid out as they would meet it. */}
      <section className="py-20 md:py-24 bg-[#0a1628]">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                What you would get back
              </span>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-white font-bold mt-4 mb-5 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                One field on a proposal form, answerable in thirty seconds
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                No login, no account, no call to us. A certificate number
                resolves to a record that states its own scope and its own
                expiry, and shows plainly when something has lapsed or been
                suspended.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                A badge that cannot visibly lapse is a badge that means nothing.
                The status history stays on the record — a revoked certificate
                is marked revoked, never quietly deleted.
              </p>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-white/10">
              <div className="px-5 py-3 bg-[#f8f9fb] border-b border-[#e5e7eb] flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af]">
                  aiccertified.cloud/verify
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af]">
                  Illustrative record
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded bg-[#10b981]/10 text-[#0a7a54] border border-[#10b981]/20">
                    <BadgeCheck className="w-3.5 h-3.5" /> Certified — Active
                  </span>
                  <span className="font-mono text-xs text-[#9ca3af]">
                    AIC-D3-2027-0041
                  </span>
                </div>
                <dl className="divide-y divide-[#f1f1f0] border-y border-[#f1f1f0]">
                  {[
                    ["Division", "D3 Reviewed — AI decides, humans review a defined sample"],
                    ["Scope", "Retail credit origination and collections decisioning"],
                    ["Accountable Person", "Named on the certificate record"],
                    ["Issued", "14 February 2027"],
                    ["Expires", "14 August 2028 · 18-month cycle for D3"],
                    ["Continuous monitoring", "Live — telemetry coherent with declared Division"],
                    ["Status history", "No suspensions, no revocations"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="grid sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-1 sm:gap-5 py-3"
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-[#9ca3af] pt-0.5">
                        {k}
                      </dt>
                      <dd className="text-sm text-[#0f1f3d] leading-relaxed">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-xs text-[#9ca3af] leading-relaxed mt-5">
                  Illustrative. AIC has issued no certificates — the{" "}
                  <Link href="/registry" className="text-aic-copper hover:underline">
                    public register
                  </Link>{" "}
                  is empty and says so. This is the shape of the record, not a
                  real one.
                </p>
              </div>
            </div>
          </div>
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
