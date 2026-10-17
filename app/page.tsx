'use client';

import Link from "next/link";
import { useState } from "react";
import SealArt from "@/app/components/SealArt";
import HeroFilm from "@/app/components/HeroFilm";
import StripeFrame from "@/app/components/StripeFrame";
import DeclineLetterArt from "@/app/components/DeclineLetterArt";
import TabletStage from "@/app/components/TabletStage";
import { PLATFORM_AREAS } from "@/app/data/platform-data";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EmpathyScorer from "@/app/components/EmpathyScorer";

// Kept short and in the question's own words; the full list is /guides.
const HOME_GUIDES = [
  { href: "/guides/popia-section-71-automated-decisions", q: "What does POPIA section 71 say about automated decisions?", d: "The three tests, the exceptions, and what a compliant decision looks like in practice." },
  { href: "/guides/ai-governance-south-africa", q: "What AI rules apply in South Africa in 2026?", d: "No AI Act yet, but POPIA, King V and sector rules already reach your AI." },
  { href: "/guides/king-v-ai-governance", q: "What does King V ask boards to oversee on AI?", d: "Accountability for outputs, and how to turn the principle into evidence." },
  { href: "/guides/eu-ai-act-south-african-companies", q: "Does the EU AI Act apply to South African companies?", d: "When it reaches you from outside Europe, and the dates after the Digital Omnibus." },
];

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

// The rules a client's AI is already held to. Statuses and dates match
// regulatory-data.ts, which carries the sources; nothing here goes further.
const frameworks = [
  { name: "POPIA section 71", where: "South Africa", status: "In force", detail: "Rights around decisions based solely on automated processing with legal or similarly significant effect.", href: "/regulatory-map/south-africa" },
  { name: "EU AI Act", where: "European Union", status: "High-risk duties from 2 Dec 2027", detail: "Human oversight, logging and accountability for high-risk systems, after the Digital Omnibus deferral.", href: "/regulatory-map" },
  { name: "GDPR article 22", where: "European Union", status: "In force", detail: "The right not to be subject to a solely automated decision with significant effect.", href: "/regulatory-map" },
  { name: "ISO/IEC 42001", where: "International", status: "Certifiable standard", detail: "A management system for AI: roles, risk and impact assessment, life-cycle controls.", href: "/platform" },
  { name: "NIST AI RMF", where: "United States", status: "Voluntary", detail: "A risk framework many global buyers and insurers use as their reference point.", href: "/regulatory-map/united-states" },
  { name: "Industry frameworks", where: "Engineering, finance, health", status: "IEC 61511, SR 11-7, IEC 62304", detail: "AI mapped against the safety and model-risk disciplines your sector already audits.", href: "/frameworks" },
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
  // On a phone the argument opens with its first and sharpest paragraphs;
  // the rest is one tap away rather than five screens of text.
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <div className="bg-[#0a1628] selection:bg-[#c9920a] selection:text-[#0a1628]">
      {/* SECTION 1 — HERO */}
      <HeroFilm>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-14 lg:pt-20 lg:pb-32 w-full">
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
                className="text-[2.6rem] md:text-8xl text-white mb-6 lg:mb-8 leading-[1.08] lg:leading-[1.05] tracking-[-0.03em] font-bold"
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
                className="text-lg md:text-xl text-white/80 mb-8 lg:mb-12 max-w-3xl leading-[1.6] lg:leading-[1.65]"
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
                {/* Phone: one primary action and one quiet link. */}
                <Link
                  href="/contact?topic=platform"
                  className="lg:hidden inline-flex items-center gap-3 bg-white text-[#0e1b2c] pl-6 pr-2 py-2 rounded-full text-[15px] font-semibold"
                >
                  Book a walk-through
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#c9920a] text-white"><ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link
                  href="/certification"
                  className="lg:hidden inline-flex items-center py-3 text-[15px] font-medium text-white/80 underline underline-offset-4 decoration-white/30"
                >
                  See how it works
                </Link>
                <Link
                  href="/contact"
                  className="max-lg:hidden inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-10 py-5 rounded-full transition-all text-sm font-bold shadow-2xl shadow-[#c9920a]/30 hover:-translate-y-1"
                >
                  Contact us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/certification"
                  className="max-lg:hidden inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-full transition-all text-sm font-bold hover:-translate-y-1"
                >
                  SEE HOW IT WORKS <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/governance-hub"
                  className="max-lg:hidden inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 px-10 py-5 rounded-full transition-all text-sm font-bold hover:-translate-y-1"
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
        <div className="max-lg:hidden absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-[2px] h-12 bg-white/10 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 w-full h-1/3 bg-[#c9920a] rounded-full"
              style={{ animation: "scrollDot 2s infinite ease-in-out" }}
            />
          </div>
        </div>
      </HeroFilm>

      {/* ── THE PROBLEM, MADE CONCRETE ──────────────────────────────
          Asymmetric on purpose. The previous version of this section was a
          centred heading over three equal cards, which said "these three
          things are of identical importance" — they are not. The argument
          leads; the letter is the evidence that makes it land. */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-start">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper max-lg:font-sans max-lg:text-sm max-lg:normal-case max-lg:tracking-normal max-lg:text-[#8a6114]">
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
                <p className={whyOpen ? "" : "max-lg:hidden"}>
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
                {/* The sharpest thing certification actually does, stated as a
                    cost rather than a benefit. A mark whose only effect is to
                    make you look better is a mark nobody should believe. */}
                <p className={whyOpen ? "" : "max-lg:hidden"}>
                  Which closes a door. When an automated decision causes harm,
                  the position available today is that the system did it and
                  nobody understood it well enough to be responsible — no
                  individual knew, so no individual answers. A certified
                  organisation cannot take that position. Someone has signed a
                  declaration accepting personal accountability for those
                  decisions, and was tested on whether they could describe how
                  the system actually behaves without checking with anyone
                  else.
                </p>
                <p className={whyOpen ? "" : "max-lg:hidden"}>
                  That is a defence given up, not a badge acquired. It is also
                  the reason the mark is worth anything.
                </p>
                {!whyOpen && (
                  <button
                    type="button"
                    onClick={() => setWhyOpen(true)}
                    className="lg:hidden text-[15px] font-semibold text-[#8a6114] underline underline-offset-4"
                  >
                    Read the whole argument
                  </button>
                )}
              </div>
            </div>

            <div className="lg:pt-4">
              {/* The letter the argument is about, marked up the way an assessor reads it. */}
              <StripeFrame className="mb-10">
                <DeclineLetterArt />
              </StripeFrame>
              <div className="border-l-2 border-aic-copper pl-5 py-1">
                <p className="text-[15px] text-[#3d4a58] leading-relaxed">
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
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper max-lg:font-sans max-lg:text-sm max-lg:normal-case max-lg:tracking-normal max-lg:text-[#8a6114]">
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
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper max-lg:font-sans max-lg:text-sm max-lg:normal-case max-lg:tracking-normal max-lg:text-[#8a6114]">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-t border-[#e5e7eb] max-sm:flex max-sm:gap-3 max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:border-t-0 max-sm:-mx-5 max-sm:px-5 max-sm:pb-2 [scrollbar-width:none]">
            {algorithmicRights.map((right) => (
              <div
                key={right.title}
                className="border-b sm:border-r border-[#e5e7eb] last:border-r-0 p-6 flex flex-col gap-3 hover:bg-[#f8f9fb] transition-colors max-sm:snap-start max-sm:shrink-0 max-sm:w-[78%] max-sm:rounded-2xl max-sm:border max-sm:last:border-r max-sm:bg-[#f5f7f9] max-sm:min-h-[220px]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-aic-copper max-lg:font-sans max-lg:text-sm max-lg:tracking-normal max-lg:text-[#8a6114]">
                    {right.code}
                  </span>
                  <span className="font-mono text-[11px] text-[#9ca3af] tabular-nums max-lg:font-sans max-lg:text-sm max-lg:text-[#5e6b7b]">
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

      {/* ── THE RULES ────────────────────────────────────────────────
          Replaces "Check us" until there are clients to point to. The laws
          and frameworks a client's AI is already held to, each linking to the
          map or framework page that sources it. */}
      <section className="bg-[#0a1628] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] gap-12 lg:gap-16 items-start">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-aic-copper max-lg:font-sans max-lg:text-sm max-lg:normal-case max-lg:tracking-normal max-lg:text-[#c9920a]">
                The rules
              </span>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-white font-bold mt-4 mb-5 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                The laws and frameworks your AI is already held to
              </h2>
              <p className="text-white/60 leading-relaxed">
                Each requirement in the AIC standard is mapped to the law or
                framework it helps you meet, and the platform tracks them for
                you. Where a country stands, with its sources and the date we
                last checked, is on the regulatory map.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/regulatory-map" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0a1628] hover:bg-white/90 transition-colors">
                  Open the regulatory map <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/frameworks" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:border-white/60 transition-colors">
                  Industry frameworks <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden [&>*]:min-w-0">
              {frameworks.map((f) => (
                <Link
                  key={f.name}
                  href={f.href}
                  className="group bg-[#0a1628] p-6 max-sm:p-5 hover:bg-[#0f1f3d] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white leading-snug" style={{ fontFamily: "'Merriweather', serif" }}>
                      {f.name}
                    </h3>
                    <ArrowRight className="mt-1 w-4 h-4 shrink-0 text-aic-copper transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[13px] text-white/50 mb-3">{f.where}</p>
                  <span className="inline-block rounded-full border border-[#c9920a]/40 bg-[#c9920a]/10 px-2.5 py-1 text-[12px] font-semibold text-[#e0b85c] mb-3">
                    {f.status}
                  </span>
                  <p className="text-[13.5px] text-white/65 leading-relaxed">{f.detail}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ─────────────────────────────────────────────
          October 2026. The workspace had grown into most of what AIC offers
          and the home page did not mention it. Its own four menus are the
          structure, so the page and the product describe the same thing. */}
      <section className="bg-white py-20 md:py-24 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
            <div>
              <p className="text-sm text-[#5e6b7b]">The platform</p>
              <h2
                className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-3 mb-5 text-balance"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Between audits, the record keeps itself
              </h2>
              <p className="text-[#3d4a58] leading-relaxed">
                Every AI system you run and who answers for it, the decisions it makes, the
                frameworks you are held to, and evidence AIC reads every night from the systems
                you already use. Nothing in it raises or lowers your chance of certification; it
                is where the record lives that an audit then tests.
              </p>
              <Link
                href="/platform"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a6114] underline-offset-2 hover:underline mt-6"
              >
                See what the platform does
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6 content-start">
              {PLATFORM_AREAS.map((a) => (
                <li key={a.id} className="border-t border-[#dde2e8] pt-4">
                  <Link href={`/platform#${a.id}`} className="font-semibold text-[#0f1f3d] hover:text-[#8a6114] transition-colors">
                    {a.name}
                  </Link>
                  <p className="text-sm text-[#5e6b7b] leading-[1.6] mt-1">{a.summary}</p>
                  <p className="max-lg:hidden text-[13px] text-[#5e6b7b] leading-[1.6] mt-2">
                    {a.features.map((f) => f.name).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM, IN USE ─────────────────────────────────────
          The workspace itself on a tablet, rising out of the dark as the
          page scrolls, the way FNZ shows its platform. Filmed from the
          product with sample data, and labelled. */}
      <section className="relative overflow-hidden bg-[#070d18] text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-28 md:pb-36">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-[2.75rem] leading-[1.1] tracking-[-0.02em] font-bold text-balance" style={{ fontFamily: "'Merriweather', serif" }}>
              The record, in use
            </h2>
            <p className="mt-4 text-white/65 leading-relaxed">
              The record, the AI register, the decision log, the risk register and the frameworks you track, as your team sees them every day.
            </p>
          </div>
          <div className="mt-14 md:mt-20">
            <TabletStage />
          </div>
          <p className="mt-24 text-center text-[13px] text-white/45">Karoo Lending (Demo) is sample data.</p>
        </div>
      </section>

      {/* ── AIC AWARE ────────────────────────────────────────────────
          The free, self-declared entry point. Deliberately placed after the
          proof section (real figures, real registry) rather than the hero,
          so the free tool reads as a companion to the evidence above it, not
          as the headline claim — that is still AIC Certified. */}
      <section className="bg-aic-paper py-20 md:py-24 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 md:p-12 grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 items-center shadow-sm">
            <div>
              <p className="text-sm text-[#5e6b7b]">
                Free and self-declared
              </p>
              <h2
                className="text-3xl md:text-4xl text-[#0f1f3d] mt-3 mb-4 font-bold leading-[1.1]"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Not ready for a full audit? Start with AIC Aware.
              </h2>
              <p className="text-[#6b7280] leading-relaxed max-w-xl">
                Twenty questions, the same four categories AIC audits against, about ten minutes.
                You get a risk-level snapshot and a downloadable PDF — no account, no cost. It is
                self-declared, not verified, and we say so throughout: only an independent AIC
                audit earns the Certified mark and a place on the public registry.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/aware"
                className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-8 py-4 rounded-full transition-all text-sm font-bold shadow-md hover:-translate-y-0.5 max-sm:w-full max-sm:justify-center max-sm:px-5"
              >
                Take the free self-assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALIGNMENT ────────────────────────────────────────────────
          Merged from two near-identical sections that both said "we align to
          frameworks", one immediately after the other. */}
      <section className="bg-white py-20 md:py-28 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm text-[#5e6b7b]">
                Built with reference to
              </p>
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
                  <dt className="font-mono text-sm font-semibold text-[#0f1f3d] tracking-tight max-lg:font-sans">
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

      {/* ── GUIDES ───────────────────────────────────────────────────
          The questions buyers search for, answered on this site. Links use the
          question itself as their text, which is what tells a search engine
          what each guide answers. */}
      <section className="bg-[#f5f7f9] py-20 md:py-24 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm text-[#5e6b7b]">Guides</p>
              <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] tracking-[-0.02em] text-[#0f1f3d] font-bold mt-4 text-balance" style={{ fontFamily: "'Merriweather', serif" }}>
                The questions we are asked most
              </h2>
            </div>
            <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a6114] hover:gap-3 transition-all">
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {HOME_GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="group flex h-full flex-col rounded-xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] transition-colors">
                  <span className="text-lg font-bold leading-snug text-[#0f1f3d] group-hover:underline decoration-[#a8772a] underline-offset-4" style={{ fontFamily: "'Merriweather', serif" }}>{g.q}</span>
                  <span className="mt-2 text-[15px] text-[#5e6b7b] leading-relaxed">{g.d}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CLOSE ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1628] py-20 md:py-28">
        <SealArt className="pointer-events-none absolute -right-24 -top-10 w-[300px] lg:right-[-60px] lg:top-1/2 lg:-translate-y-1/2 lg:w-[560px] opacity-60" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8">
          <p className="text-sm text-white/60">
            Founding cohort, November intake
          </p>
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
              href="/intake"
              className="inline-flex items-center justify-center gap-2.5 bg-aic-copper text-[#0e1b2c] px-8 py-4 rounded-lg font-semibold hover:bg-[#dcae4c] transition-colors"
            >
              Join the November intake{" "}
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
