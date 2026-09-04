'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EmpathyScorer from "@/app/components/EmpathyScorer";

// Each right now carries its real requirement count from the published
// standard. Descriptions are deliberately short: these sit five-across so they
// can be compared, which is the whole reason they were pulled out of five
// separate full-height screens.
const algorithmicRights = [
  {
    code: "HU",
    title: "Human Agency",
    count: 11,
    description:
      "A named individual is accountable for the decision, and can actually intervene in it.",
  },
  {
    code: "EX",
    title: "Explanation",
    count: 7,
    description:
      "The reason a person is given is the reason that actually operated. Anything else is rationalisation.",
  },
  {
    code: "EM",
    title: "Empathy",
    count: 10,
    description:
      "Adverse decisions are communicated the way a person receives them, not the way a system emits them.",
  },
  {
    code: "CO",
    title: "Correction",
    count: 9,
    description:
      "Getting a decision wrong is recoverable, and the record shows it demonstrably happens.",
  },
  {
    code: "TR",
    title: "Truth",
    count: 7,
    description:
      "People know an AI is involved before it affects them, not afterwards in the terms.",
  },
];

// Every figure here is real, and the two zeros are the point: a body that
// publishes its own emptiness is making a checkable claim, which is the only
// kind worth making.
const proofPoints = [
  {
    figure: "44",
    label: "Published requirements",
    detail:
      "The full standard — what each test demands and what evidence satisfies it.",
    cta: "Read the standard",
    href: "/standard",
  },
  {
    figure: "28",
    label: "Jurisdictions mapped",
    detail:
      "Each carrying its own verification date and a link to the primary source.",
    cta: "Open the map",
    href: "/regulatory-map",
  },
  {
    figure: "0",
    label: "Certified organisations",
    detail:
      "The register is empty because nobody has been assessed yet. We publish that.",
    cta: "See the register",
    href: "/registry",
  },
  {
    figure: "0",
    label: "Accreditations held",
    detail:
      "AIC is not accredited by UKAS, SANAS or anyone else. The application status is public.",
    cta: "Where we stand",
    href: "/disclosures#accreditation",
  },
];

const standards = [
  {
    code: "ISO/IEC 42001",
    name: "AI management systems",
    desc: "The management-system standard for AI, and the scheme AIC is pursuing accreditation to certify against.",
  },
  {
    code: "POPIA §71",
    name: "Automated decisions",
    desc: "South Africa's binding hook: no solely automated decision with legal or substantial effect, without safeguards and an explanation.",
  },
  {
    code: "EU AI Act",
    name: "Risk-tiered obligations",
    desc: "Transparency duties already apply; high-risk obligations are deferred to December 2027, not cancelled.",
  },
  {
    code: "NIST AI RMF",
    name: "Risk management",
    desc: "The voluntary US reference framework, and the language most American procurement is written in.",
  },
];

export default function MarketingPage() {
  const headlineHuman = "Human".split("");

  return (
    <div className="bg-[#0a1628] selection:bg-[#c9920a] selection:text-[#0a1628]">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1628]">
        {/* Animated radial gradient background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 20%, #c9920a 0%, transparent 40%)",
            animation: "breathe 8s infinite ease-in-out",
            opacity: 0.15
          }}
        />

        {/* Drifting grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "gridDrift 60s linear infinite"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.3 } }
              }}
              className="flex-1"
            >
              <motion.h1
                aria-label="Certifying the Human Behind the Algorithm"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                className="text-5xl md:text-8xl text-white mb-8 leading-[1.05] tracking-[-0.03em] font-bold"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Certifying the{" "}
                <span className="text-[#c9920a] inline-flex">
                  {headlineHuman.map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + (i * 0.04) }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>{" "}
                Behind the Algorithm
              </motion.h1>

              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl leading-[1.65]"
              >
                Certifying that a named human remains accountable for every decision that matters.
              </motion.p>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-10 py-5 rounded-full transition-all text-sm font-bold shadow-2xl shadow-[#c9920a]/30 hover:-translate-y-1"
                >
                  Contact us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/certification"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-full transition-all text-sm font-bold hover:-translate-y-1"
                >
                  SEE HOW IT WORKS <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/governance-hub"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 px-10 py-5 rounded-full transition-all text-sm font-bold hover:-translate-y-1"
                >
                  ALGORITHMIC RIGHTS <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right side — Brand Mark */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="hidden lg:flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 110 180" style={{ height: "420px", width: "auto" }} xmlns="http://www.w3.org/2000/svg">
                <path d="M36,1 L1,1 L1,179 L36,179" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square"/>
                <path d="M74,1 L109,1 L109,179 L74,179" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square"/>
                <text x="55" y="21" fontSize="7.5" fill="#ffffff" textAnchor="middle" letterSpacing="2.5" fontFamily="'Space Grotesk','Helvetica Neue',Arial,sans-serif">METHODOLOGY</text>
                <text x="55" y="33" fontSize="7.5" fill="#ffffff" textAnchor="middle" letterSpacing="2.5" fontFamily="'Space Grotesk','Helvetica Neue',Arial,sans-serif">ASSESSED</text>
                <line x1="8" y1="43" x2="102" y2="43" stroke="#ffffff" strokeWidth="1" opacity="0.4"/>
                <text x="55" y="100" fontSize="42" fontWeight="700" fill="#ffffff" textAnchor="middle" letterSpacing="6" fontFamily="'Space Grotesk','Helvetica Neue',Arial,sans-serif">AIC</text>
                <line x1="8" y1="126" x2="102" y2="126" stroke="#ffffff" strokeWidth="1" opacity="0.4"/>
                <text x="55" y="153" fontSize="5.5" fill="#ffffff" opacity="0.6" textAnchor="middle" letterSpacing="1.5" fontFamily="'Space Grotesk','Helvetica Neue',Arial,sans-serif">AICCERTIFIED.CLOUD</text>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Animated Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-[2px] h-12 bg-white/10 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 w-full h-1/3 bg-[#c9920a] rounded-full"
              style={{ animation: "scrollDot 2s infinite ease-in-out" }}
            />
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM, MADE CONCRETE ──────────────────────────────
          Asymmetric on purpose. The previous version of this section was a
          centred heading over three equal cards, which said "these three
          things are of identical importance" — they are not. The argument
          leads; the letter is the evidence that makes it land. */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-start">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                Why AIC exists
              </span>
              <h2
                className="text-3xl md:text-[2.75rem] leading-[1.08] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-4 mb-6 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Somebody was refused something this morning, and nobody can tell
                them why.
              </h2>
              <div className="space-y-4 text-[#3d4a58] leading-relaxed max-w-[62ch]">
                <p>
                  Hiring. Lending. Insurance. Healthcare. Parole. These
                  decisions are increasingly made, or heavily shaped, by
                  automated systems — and the person on the receiving end
                  usually never learns that a system was involved at all.
                </p>
                <p>
                  Technology can be audited. Code can be reviewed. But
                  accountability is not a property of software; it is a property
                  of a person. Right now there is no recognised standard for who
                  that person is, what they must know, or what they owe the
                  people their systems decide about.
                </p>
                <p className="text-[#0f1f3d] font-medium">
                  AIC certifies that a named human remains accountable — and
                  publishes the result so anyone can check it.
                </p>
              </div>
            </div>

            <div className="lg:pt-12">
              <div className="border-l-2 border-aic-copper pl-5 py-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#9ca3af] mb-3">
                  A decline letter, in full
                </p>
                <p className="text-[#3d4a58] leading-relaxed text-[15px]">
                  “This decision was made in accordance with our internal credit
                  policy. We are unable to provide further detail regarding the
                  specific factors involved. This is an automated notification.
                  Please do not reply to this message.”
                </p>
                <p className="text-sm text-[#6b7280] mt-4 leading-relaxed">
                  Four sentences. No reason, no person, no way to reply, no
                  route to challenge it. We score letters like this against a
                  seven-part rubric, and a score below 40 out of 70 blocks
                  certification outright.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PEAK — the reader does something ─────────────────────
          The only place on the site where a visitor is asked to make a
          judgement rather than receive one. Everything above sets it up. */}
      <section className="bg-[#f0f4f8] py-20 md:py-28 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
              Try the standard
            </span>
            <h2
              className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-4 mb-4 text-balance"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              How would you score this letter?
            </h2>
            <p className="text-[#3d4a58] leading-relaxed">
              Seven dimensions, ten seconds. Score it, then see what our
              assessor scored it and where you disagreed. This is requirement
              EM-1 of the published standard, run exactly as it runs in an
              assessment.
            </p>
          </div>
          <EmpathyScorer />
        </div>
      </section>

      {/* ── THE FIVE RIGHTS — one comparative view ───────────────────
          Previously five full viewports delivering about sixty words, one
          right per screen, so nobody could compare or count them. All five
          now sit together, each carrying its real requirement count from the
          published standard — which connects the philosophy to the thing that
          makes it testable. */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                The framework
              </span>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-4 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Five rights, forty-four tests
              </h2>
              <p className="text-[#3d4a58] leading-relaxed mt-4">
                Principles that cannot be measured are decoration. Each right
                below resolves into specific requirements with defined evidence,
                and every one of them is published.
              </p>
            </div>
            <Link
              href="/standard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-aic-copper hover:gap-3 transition-all shrink-0"
            >
              Read all 44 requirements <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-t border-[#e5e7eb]">
            {algorithmicRights.map((right) => (
              <div
                key={right.title}
                className="border-b sm:border-r border-[#e5e7eb] last:border-r-0 p-6 flex flex-col gap-3 hover:bg-[#f8f9fb] transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-aic-copper">
                    {right.code}
                  </span>
                  <span className="font-mono text-[11px] text-[#9ca3af] tabular-nums">
                    {right.count} tests
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#0f1f3d] leading-snug">
                  {right.title}
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  {right.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROOF ────────────────────────────────────────────────
          The densest, darkest block on the page, and the only one carrying
          bare figures. It exists because the homepage previously argued in
          adjectives — "evidence-based", "world's toughest" — while the actual
          proof sat unlinked in the navigation. Every number here is real, and
          the zero is deliberately included. */}
      <section className="bg-[#0a1628] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] gap-12 lg:gap-16 items-start">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                Check us
              </span>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-white font-bold mt-4 mb-5 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Everything we assert is somewhere you can go and look
              </h2>
              <p className="text-white/60 leading-relaxed">
                A certification body that asks to be trusted has already lost
                the argument. These are the four things you can verify about AIC
                without speaking to us.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
              {proofPoints.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group bg-[#0a1628] p-6 hover:bg-[#0f1f3d] transition-colors"
                >
                  <div
                    className="text-4xl font-bold text-white tabular-nums leading-none mb-2"
                    style={{ fontFamily: "'Merriweather', serif" }}
                  >
                    {p.figure}
                  </div>
                  <div className="text-sm font-medium text-white mb-1.5">
                    {p.label}
                  </div>
                  <p className="text-[13px] text-white/50 leading-relaxed mb-3">
                    {p.detail}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-aic-copper group-hover:gap-2.5 transition-all">
                    {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ALIGNMENT ────────────────────────────────────────────────
          Merged from two near-identical sections that both said "we align to
          frameworks", one immediately after the other. */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-center">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
                Built with reference to
              </span>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-4 mb-5 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Your regulator's language, not ours
              </h2>
              <p className="text-[#3d4a58] leading-relaxed">
                AIC's requirements were written against the instruments that
                already apply to you, so an assessment produces evidence you can
                use elsewhere rather than a second vocabulary to maintain.
              </p>
              <Link
                href="/regulatory-map"
                className="inline-flex items-center gap-2 text-sm font-semibold text-aic-copper hover:gap-3 transition-all mt-6"
              >
                See where regulation stands, by country{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <dl className="divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
              {standards.map((s) => (
                <div
                  key={s.code}
                  className="grid sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-2 sm:gap-6 py-5"
                >
                  <dt className="font-mono text-sm font-semibold text-[#0f1f3d] tracking-tight">
                    {s.code}
                  </dt>
                  <dd className="text-sm text-[#6b7280] leading-relaxed">
                    <span className="text-[#0f1f3d] font-medium">{s.name}.</span>{" "}
                    {s.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── CLOSE ────────────────────────────────────────────────── */}
      <section className="bg-[#0a1628] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper">
            Founding cohort
          </span>
          <h2
            className="text-3xl md:text-5xl text-white mt-4 mb-6 leading-[1.08] tracking-[-0.02em] font-bold text-balance"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            The register is empty. We would rather it stayed that way than fill
            it badly.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-8">
            AIC is assembling a small founding cohort — organisations that shape
            the methodology, are assessed against it first, and carry the mark
            before anyone else. Their audits are also the witnessed activity our
            accreditation depends on, so the arrangement is reciprocal rather
            than promotional.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 bg-aic-copper text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#b07d08] transition-all"
            >
              Talk to us about the founding cohort{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/disclosures#accreditation"
              className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
            >
              Read our accreditation status first
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
