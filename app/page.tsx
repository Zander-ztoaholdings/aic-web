'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  MessageSquare,
  Bell,
  RefreshCw,
  UserCheck,
} from "lucide-react";

const algorithmicRights = [
  {
    icon: Eye,
    title: "Human Agency",
    description: "Every consequential automated decision must be reviewable and overridable by a named, accountable human being.",
  },
  {
    icon: MessageSquare,
    title: "Explanation",
    description: "Individuals have the right to receive a meaningful, human-readable explanation of any autooutcome that affects their rights, welfare, or opportunities.",
  },
  {
    icon: Bell,
    title: "Empathy",
    description: "Automated communications — rejections, decisions, notifications — must meet minimum standards of human dignity. Cold, algorithmic language that strips the humanity from consequential outcomes is a governance failure.",
  },
  {
    icon: RefreshCw,
    title: "Correction",
    description: "No individual shall be permanently bound by an algorithmic decision. Every person has the right to trigger a review, receive a human reconsideration, and have errors corrected within a documented timeframe.",
  },
  {
    icon: UserCheck,
    title: "Truth",
    description: "Every person must be informed when they are interacting with or being evaluated by an AI system, prior to that interaction affecting them.",
  },
];

const standards = [
  { code: "ISO/IEC 42001", name: "AI Management Systems", desc: "Framework for establishing, implementing, and continually improving an Artificial Intelligence Management System." },
  { code: "POPIA / GDPR", name: "Privacy & Data Rights", desc: "Frameworks for protecting individual data rights and ensuring lawful processing of personal information in automated systems." },
  { code: "NIST AI RMF", name: "Risk Management Framework", desc: "Voluntary framework for managing AI risks across the full lifecycle, mapping to Govern, Map, Measure, and Manage functions." },
];

const alignmentBars = [
  { standard: "POPIA · §71" },
  { standard: "EU AI Act" },
  { standard: "NIST AI RMF" },
  { standard: "Singapore MGAI" },
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
                      transition={{ delay: 1.2 + (i * 0.08) }}
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

      {/* SECTION 2 — 2 MIN EXPLAINER */}
      <section className="bg-white py-24 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#c9920a] mb-6">
              <span className="w-6 h-[1.5px] bg-[#c9920a] inline-block" />
              2 min read
            </span>
            <h2
              className="text-3xl md:text-5xl font-bold text-[#0f1f3d] leading-[1.1] tracking-[-0.03em]"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Why AIC exists — and what we actually do.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 border border-[#e5e7eb] rounded-2xl overflow-hidden">
            {[
              {
                tag: "The Problem",
                heading: "AI is making decisions about people.",
                body: "Hiring. Lending. Insurance. Healthcare. Parole. Millions of life-changing decisions are now made — or heavily influenced — by automated systems. Most people never know it happened. Most companies cannot explain why.",
              },
              {
                tag: "The Gap",
                heading: "Nobody is accountable for the outcome.",
                body: "Technology can be audited. Code can be reviewed. But accountability only exists when a human being is responsible. Right now, the industry has no recognised standard for who that person is — or what they must know.",
              },
              {
                tag: "The Answer",
                heading: "AIC certifies the humans behind the algorithm.",
                body: "We are a certification body focused on the professionals responsible for AI governance. Our certification is built on global best practices, aligned to the EU AI Act, NIST AI RMF, and POPIA — and it means something when it matters most.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-10 border-r border-[#e5e7eb] last:border-r-0 group hover:bg-[#0a1628] transition-colors duration-300"
              >
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#c9920a] mb-5 block">
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold text-[#0f1f3d] group-hover:text-white mb-5 leading-snug transition-colors">
                  {item.heading}
                </h3>
                <p className="text-[#6b7280] group-hover:text-white/60 text-[15px] leading-relaxed transition-colors">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — FIVE ALGORITHMIC RIGHTS (Manifesto layout) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 text-center"
          >
            <span className="text-[#c9920a] text-[0.7rem] uppercase tracking-[0.3em] font-bold">The Manifesto</span>
            <h2 
              className="text-4xl md:text-6xl text-[#0a1628] mt-4 mb-8 leading-[1.1] tracking-[-0.03em] font-bold mx-auto max-w-3xl"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              The Five Fundamental Algorithmic Rights
            </h2>
          </motion.div>

          <div className="space-y-0">
            {algorithmicRights.map((right, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative border-t border-[#e5e7eb] last:border-b py-16 transition-all hover:bg-[#0a1628] overflow-hidden"
                >
                  <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center px-4">
                    <div className="text-5xl font-bold text-[#c9920a]/20 group-hover:text-[#c9920a]/40 transition-colors font-serif italic mb-6">
                      0{i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#0a1628] group-hover:text-white transition-colors">{right.title}</h3>
                      <p className="text-[#6b7280] group-hover:text-white/60 transition-colors max-w-2xl mx-auto leading-relaxed text-lg">
                        {right.description}
                      </p>
                    </div>
                  </div>
                  {/* Accent bottom border */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-[#c9920a] w-0 group-hover:w-full transition-all duration-700" />
                </motion.div>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/governance-hub"
              className="inline-flex items-center gap-4 text-[#0a1628] font-bold uppercase tracking-widest text-xs group"
            >
              <span>Explore the full governance framework</span>
              <div className="w-12 h-px bg-[#0a1628] group-hover:w-20 transition-all" />
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — REGULATORY ALIGNMENT BARS */}
      <section className="py-32 bg-[#0a1628] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#c9920a] text-[0.7rem] uppercase tracking-[0.3em] font-bold">Global Benchmarking</span>
              <h2 
                className="text-4xl md:text-5xl text-white mt-4 mb-8 leading-[1.1] tracking-[-0.03em] font-bold"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Aligned With the World&apos;s Toughest AI Regulations
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                AIC certification is an evidence-based audit against published requirements, mapped to the regulatory frameworks that apply to your organisation.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-white/40 text-[0.7rem] uppercase tracking-[0.3em] font-bold">Built with reference to:</span>
              <div className="space-y-4">
                {alignmentBars.map((bar, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                    className="text-sm font-bold tracking-wider uppercase text-white border-b border-white/10 pb-4"
                  >
                    {bar.standard}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — STANDARDS & CREDIBILITY */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <span className="text-[#c9920a] text-[0.7rem] uppercase tracking-[0.3em] font-bold">Technical Foundation</span>
            <h2 
              className="text-4xl md:text-5xl text-[#0a1628] mt-4 leading-[1.1] tracking-[-0.03em] font-bold"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Built on International Frameworks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {standards.map((std, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group p-10 bg-[#f0f4f8] border border-[#e5e7eb] rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-[#c9920a] font-bold text-xl mb-4 font-mono">{std.code}</div>
                <h3 className="text-[#0a1628] text-lg font-bold mb-4">{std.name}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed mb-8">{std.desc}</p>
                <div className="pt-6 border-t border-[#e5e7eb] flex items-center gap-2 text-[#c9920a] text-[0.7rem] font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>AIC Aligned</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6 — CTA BAND */}
      <section className="py-32 bg-[#0a1628] relative overflow-hidden">
        {/* Particle effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#c9920a] rounded-full opacity-20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: "110%",
                opacity: 0
              }}
              animate={{ 
                y: "-10%",
                opacity: [0, 0.4, 0],
                x: (Math.random() * 100 - 50) + "px"
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: Math.random() * 100 + "%"
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-6xl text-white mb-8 leading-[1.05] tracking-[-0.03em] font-bold"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Ready to Lead Responsible AI?
            </h2>
            <p className="text-white/60 mb-12 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              AIC is assembling its founding cohort — a small group of organisations that shape the methodology and carry the mark first.
            </p>
            <div className="flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-[#c9920a] text-white px-10 py-5 rounded-full font-bold hover:bg-[#b07d08] transition-all shadow-xl shadow-[#c9920a]/20 hover:-translate-y-1"
              >
                Contact us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
