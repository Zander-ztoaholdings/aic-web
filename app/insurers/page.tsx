import Link from "next/link";
import { BadgeCheck, CircleSlash, Search } from "lucide-react";

/**
 * /insurers — rewritten 9 Sep 2026, denser and content-first.
 *
 * The copy here was already the strongest on the site and most of it survives
 * unchanged. What was wrong was the shape: a full-screen animated hero carrying
 * three paragraphs, then six py-24 sections at one idea per screen. That is
 * marketing rhythm. The reader is an underwriter deciding whether a signal is
 * worth testing, and that reader wants density — a page they can scan, not a
 * page they have to scroll through.
 *
 * Three substantive changes, from the outside review of 7 Sep:
 *
 *  1. "Risk signal" is now the operating term. Certification is the mechanism;
 *     the signal is the thing an insurer actually wants. The page had been
 *     leading with the mechanism.
 *  2. A direct comparison against what a proposal form already tells them,
 *     because the value is only obvious next to the alternative.
 *  3. "Premium benefit" is gone. It appeared on the illustrative badge as
 *     "Recognised by [Insurer] for premium benefit" — a claim about pricing
 *     effect with no actuarial evidence behind it, on a page whose whole
 *     argument is that unevidenced claims are the problem. It now reads as an
 *     underwriting consideration, which is what it would actually be.
 *
 * Deliberately NOT added: a concrete pilot offer. The review recommended
 * publishing a 90-day structure and a "request the pilot brief" call to
 * action. No pilot protocol document exists yet, and advertising an artefact
 * AIC cannot hand over is the same failure in a different costume. The
 * invitation stays open-ended until the protocol is real.
 *
 * No "use client": every animation here was decorative, and one of them
 * animated opacity from 1 to 1. Removing them makes this a server component
 * that ships no JavaScript at all.
 */

const comparison = [
  {
    dimension: "Source",
    proposal: "The insured, describing themselves",
    aic: "An independent assessment against published requirements",
  },
  {
    dimension: "Basis",
    proposal: "A tick box, or a paragraph of prose",
    aic: "Evidence an assessor examined, graded against 44 published requirements",
  },
  {
    dimension: "Scope",
    proposal: "Rarely defined — “we use AI responsibly”",
    aic: "Named systems and decision types, stated on the record",
  },
  {
    dimension: "Verification",
    proposal: "None available to you",
    aic: "Direct from AIC, no login, without asking the insured",
  },
  {
    dimension: "Currency",
    proposal: "True on the day it was signed, if then",
    aic: "Live status — suspensions and lapses show on the record",
  },
  {
    dimension: "Accountability",
    proposal: "Usually a department",
    aic: "A named individual who has signed a personal declaration",
  },
];

const record: [string, string][] = [
  ["Division", "D3 Reviewed — AI decides, humans review a defined sample"],
  ["Scope", "Retail credit origination and collections decisioning"],
  ["Accountable Person", "Named on the certificate record"],
  ["Issued", "14 February 2027"],
  ["Expires", "14 August 2028 · 18-month cycle for D3"],
  ["Continuous monitoring", "Live — telemetry coherent with declared Division"],
  ["Status history", "No suspensions, no revocations"],
];

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

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
    {children}
  </span>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-2xl md:text-[2rem] text-[#0f1f3d] mt-3 mb-6 leading-[1.15] tracking-[-0.02em] font-bold text-balance"
    style={{ fontFamily: "'Merriweather', serif" }}
  >
    {children}
  </h2>
);

export default function InsurersPage() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Opening. Compact on purpose — it states the problem and where AIC
          actually stands, then gets out of the way. */}
      <section className="bg-aic-navy text-white py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <Kicker>For insurers &amp; underwriters</Kicker>
          <h1
            className="text-3xl md:text-5xl mt-3 mb-5 leading-[1.05] tracking-[-0.03em] font-bold max-w-3xl text-balance"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            You are already writing AI risk. You just cannot see it.
          </h1>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-4xl">
            <p className="text-white/70 leading-[1.7]">
              Somewhere in your book are insureds whose consequential decisions
              are made by systems nobody in the business can explain, with no
              named human accountable for the outcome. Nothing on a proposal
              form asks.
            </p>
            <p className="text-white/70 leading-[1.7]">
              And you know the shape of what comes back when it goes wrong. The
              system made the call, nobody understood it well enough to be
              responsible for it, so no individual can be held to it. AIC exists
              to make that answerable — and verifiable by you, without taking
              anyone&apos;s word for it.
            </p>
          </div>
          <p className="text-sm text-white/50 max-w-3xl leading-[1.7] border-l-2 border-aic-copper/40 pl-4 mt-8">
            To be plain about where this stands: no insurer currently recognises
            AIC certification, and no organisation has been certified yet. This
            page sets out what the signal would be and how recognition would
            work. We would rather propose it than describe it as though it
            already exists.
          </p>
        </div>
      </section>

      {/* The comparison. The value of the signal is only legible next to what
          an underwriter already has, so this is the first thing after the
          opening rather than a supporting detail further down. */}
      <section className="py-14 md:py-16 border-b border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto px-4">
          <Kicker>The signal</Kicker>
          <H2>What you have today, and what this adds</H2>
          <p className="text-[#6b7280] text-[17px] leading-[1.65] max-w-[68ch] mb-8">
            AI governance reaches you the way most non-financial risk does: as
            the insured&apos;s own account of itself. The gap is not that
            organisations lie on proposal forms. It is that nothing on the form
            can be checked.
          </p>

          <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,1fr)] gap-5 px-6 py-3 bg-[#f8f9fb] border-b border-[#e5e7eb]">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af]">
                Proposal form today
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-aic-copper">
                A verified AIC record
              </span>
            </div>
            <div className="divide-y divide-[#f1f1f0]">
              {comparison.map((row) => (
                <div
                  key={row.dimension}
                  className="grid md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 md:gap-5 px-6 py-4"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-[#9ca3af] pt-0.5">
                    {row.dimension}
                  </dt>
                  <dd className="text-sm text-[#6b7280] leading-[1.6]">
                    <span className="md:hidden font-mono text-[10px] uppercase tracking-wide text-[#9ca3af] block mb-0.5">
                      Today
                    </span>
                    {row.proposal}
                  </dd>
                  <dd className="text-sm text-[#0f1f3d] leading-[1.6]">
                    <span className="md:hidden font-mono text-[10px] uppercase tracking-wide text-aic-copper block mb-0.5">
                      With AIC
                    </span>
                    {row.aic}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The artefact. An underwriter does not want to be told verification is
          fast — they want to see what comes back. */}
      <section className="py-14 md:py-16 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] gap-8 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-32">
              <Kicker>What you would get back</Kicker>
              <h2
                className="text-2xl md:text-[2rem] leading-[1.15] tracking-[-0.02em] text-white font-bold mt-3 mb-4 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                One field on a proposal form, answerable in thirty seconds
              </h2>
              <p className="text-white/60 leading-[1.7] mb-4">
                No login, no account, no call to us. A certificate number
                resolves to a record that states its own scope and its own
                expiry, and shows plainly when something has lapsed or been
                suspended.
              </p>
              <p className="text-white/50 text-sm leading-[1.7]">
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
                  {record.map(([k, v]) => (
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

      {/* Verification + what the mark actually covers, side by side. These were
          two full-height sections; they are one screen of reading. */}
      <section className="py-14 md:py-16 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <Kicker>How verification works</Kicker>
            <H2>Confirm a status directly from AIC — never from the insured</H2>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-4 border-t border-[#e5e7eb] pt-4">
                  <div className="text-aic-copper font-mono text-xs shrink-0 w-6 pt-1">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="text-[#0f1f3d] font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-[#6b7280] leading-[1.65]">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 mt-8 bg-aic-navy text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#0f1f3d] transition-colors"
            >
              <Search className="w-4 h-4" />
              Verify a certificate
            </Link>
          </div>

          <div>
            <Kicker>What the mark verifies</Kicker>
            <H2>An evidence-based audit, not a self-declaration</H2>
            <p className="text-[#6b7280] leading-[1.65] mb-4">
              AIC certification is an evidence-based audit against published
              requirements, mapped to the regulatory frameworks that apply to
              the certified organisation. It confirms that a named individual is
              accountable for the organisation&apos;s AI-driven decisions, that
              an override process exists, and that the certification is
              checkable — not just claimed.
            </p>
            <p className="text-[#6b7280] leading-[1.65] mb-4">
              A certification that can quietly lapse without anyone noticing
              isn&apos;t worth much. Certified organisations can carry the{" "}
              <strong className="text-[#0f1f3d]">Continuously Monitored</strong>{" "}
              overlay when Pulse telemetry is live and coherent — a mark that
              stays accountable after the audit, not only on the day of it.
            </p>
            <p className="text-[#6b7280] leading-[1.65]">
              AIC also runs a free, self-declared tool called{" "}
              <Link href="/aware" className="text-aic-copper font-medium hover:underline">
                AIC Aware
              </Link>
              . It carries no independent verification, never appears on the
              certified register, and is not something an underwriter should
              price against — that is what the audited mark is for.
            </p>
          </div>
        </div>
      </section>

      {/* Recognition and the boundary. Previously two sections; they are one
          argument, and the boundary is the more important half. */}
      <section className="py-14 md:py-16 border-b border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto px-4">
          <Kicker>Recognition</Kicker>
          <H2>Naming who recognises the mark — not what AIC does for you</H2>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-[#6b7280] leading-[1.65] mb-5">
                Where an insurer has agreed to treat AIC certification as a
                factor in underwriting, the certificate&apos;s verify page names
                that directly:
              </p>
              <div className="flex items-start gap-3 bg-white border border-[#e5e7eb] rounded-lg p-5 mb-5">
                <BadgeCheck className="w-5 h-5 text-aic-copper shrink-0 mt-0.5" />
                <p className="text-[#0f1f3d] font-mono text-sm leading-relaxed">
                  AIC Certified · Recognised by [Insurer Name] as an
                  underwriting consideration
                </p>
              </div>
              {/* Was "for premium benefit". No actuarial evidence exists for a
                  pricing effect, and there is no data to produce one until
                  certifications and claims experience accumulate. Saying so is
                  cheaper than retracting it later. */}
              <p className="text-sm text-[#6b7280] leading-[1.65]">
                Deliberately not &ldquo;for premium benefit&rdquo;. Whether
                verified AI accountability correlates with insurable risk is an
                open question, and the evidence to answer it does not exist yet.
                That is the question worth testing together — not a claim to
                make in advance of it.
              </p>
            </div>

            <div className="flex items-start gap-3 border border-[#e5e7eb] rounded-xl p-6 bg-white">
              <CircleSlash className="w-5 h-5 text-[#6b7280] shrink-0 mt-1" />
              <div>
                <h3 className="text-[#0f1f3d] font-semibold mb-2">
                  What AIC does not do
                </h3>
                <p className="text-[#6b7280] text-sm leading-[1.65] mb-3">
                  AIC certifies governance, not products, and does not conduct
                  assessments on behalf of an insurer or for insurance purposes.
                  AIC does not price risk, underwrite, or advise on coverage. An
                  AIC certification is one input an insurer may choose to use —
                  the decision, and the terms, remain the insurer&apos;s alone.
                </p>
                <p className="text-[#6b7280] text-sm leading-[1.65]">
                  The direction matters: insurers recognise AIC certification —
                  AIC does not certify <em>for</em> insurance. That line is what
                  keeps the certification body impartial, and it is not open to
                  blurring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Close. An invitation to test the signal, not a request to bless it. */}
      <section className="py-14 md:py-16 bg-aic-navy text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-3xl">
            <Kicker>Testing the signal</Kicker>
            <h2
              className="text-2xl md:text-[2rem] mt-3 mb-5 leading-[1.15] tracking-[-0.02em] font-bold text-balance"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              The useful question is whether this predicts anything
            </h2>
            <p className="text-white/70 leading-[1.7] mb-4">
              AIC is not asking any insurer to endorse a certification. It is
              building an independent, evidence-based measure of AI
              accountability, and the open question — whether it carries real
              underwriting signal — can only be answered with insurers rather
              than at them.
            </p>
            <p className="text-white/60 leading-[1.7] mb-8">
              If that is a question your team finds interesting, we would like
              to talk about how it could be tested: what would need measuring,
              what AIC would provide, and what would count as an answer either
              way.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-aic-copper text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-[#b07d08] transition-colors"
            >
              Start that conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
