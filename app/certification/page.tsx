'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Users,
  Eye,
  Activity,
  Code2,
  CheckCircle,
  ChevronRight,
  Award,
} from "lucide-react";

const divisions = [
  {
    number: "01",
    name: "Sovereign",
    tagline: "We make decisions. Humans make them.",
    who: "Organisations making no use of AI in consequential decisions.",
    accentBg: "bg-[#f0f4f8]",
    accentText: "text-[#c9920a]",
    accentBorderColor: "border-[#e5e7eb]",
    accentStripBg: "bg-[#e5e7eb]",
    icon: Shield,
    what: "Human accountability structures documented, no undisclosed AI in use, POPIA-compliant human data processing. Shadow AI audit confirms no automated decision systems.",
    product: "Sovereign Assessment — point-in-time audit + annual renewal.",
    valueProp: "Prove you are fully human-accountable before regulators, clients, or media ask.",
    kpi: "No AI in consequential decisions — verified annually",
  },
  {
    number: "02",
    name: "Supervised",
    tagline: "AI assists. Humans decide.",
    who: "AI generates recommendations; a named human makes every consequential decision.",
    accentBg: "bg-[#c9920a]",
    accentText: "text-[#c9920a]",
    accentBorderColor: "border-[#c9920a]/40",
    accentStripBg: "bg-[#c9920a]",
    icon: Users,
    examples: "Bank using AI credit model where loan officer decides. Hospital using AI diagnostic where clinician signs off. Employer using AI CV screening where recruiter approves shortlist.",
    what: "Every AI system registered. Override process tested and evidenced. Decision records include both AI recommendation and human decision. Explanation mechanisms exist. Rejection communications meet dignity standards. Appeal processes functional. AI involvement disclosed to affected persons.",
    product: "Full Pulse monitoring.",
    kpi: "Human override rate is the primary KPI.",
  },
  {
    number: "03",
    name: "Reviewed",
    tagline: "AI decides. Humans review patterns and cases.",
    who: "AI makes operational decisions; humans conduct periodic reviews and investigate flagged cases.",
    accentBg: "bg-[#1a3160]",
    accentText: "text-[#c9920a]",
    accentBorderColor: "border-[#1a3160]/40",
    accentStripBg: "bg-[#1a3160]",
    icon: Eye,
    examples: "Lender with automated credit decisions + compliance officer reviewing weekly flags. HR tech platform auto-screening applications + recruiter reviewing rejected candidates weekly.",
    what: "AI systems registered with documented risk categories. Periodic human review schedules documented and evidenced. Escalation protocols for flagged decisions functional. Bias testing conducted quarterly. Correction SLA ≤ 10 business days. Full transparency to users.",
    product: "Pulse monitoring.",
    kpi: "Periodic human review rate is the primary KPI.",
  },
  {
    number: "04",
    name: "Monitored",
    tagline: "AI operates. Systems and humans monitor outcomes.",
    who: "AI operates autonomously with continuous technical monitoring; humans monitor aggregate metrics and investigate anomalies.",
    accentBg: "bg-[#0a1628]",
    accentText: "text-[#c9920a]",
    accentBorderColor: "border-[#0a1628]/40",
    accentStripBg: "bg-[#0a1628]",
    icon: Activity,
    examples: "E-commerce AI recommendations monitored by algorithm team. AI fraud detection monitored by security team. AI route optimisation monitored by operations management.",
    what: "All AI systems registered with documented purpose and risk category. Continuous technical monitoring in place (drift detection, performance metrics). Annual human review documented. Users informed they are interacting with AI. Anomaly escalation path exists.",
    product: "Pulse monitoring focused on drift detection and aggregate pattern alerts.",
    kpi: "Drift detection and aggregate outcome pattern monitoring.",
  },
  {
    number: "05",
    name: "Artificial",
    tagline: "We build AI. Others use it to make decisions.",
    who: "Organisations that develop, train, and sell AI systems or models to other organisations. Their accountability is upstream — they are responsible for the accountability architecture their customers' decisions rest on.",
    accentBg: "bg-[#0a1628]",
    accentText: "text-[#c9920a]",
    accentBorderColor: "border-[#0a1628]/40",
    accentStripBg: "bg-[#0a1628]",
    icon: Code2,
    examples: "SA LLM company selling to banks. Credit scoring SaaS selling to lenders. AI-powered medical diagnostic tool provider. HR tech company selling AI hiring tools.",
    what: "AI product has documented accountability architecture for downstream users. Product includes human override capabilities. Explanation mechanisms built into the product. Bias testing conducted on training data and documented. Transparency disclosure published for each product. Process exists for receiving and responding to downstream incident reports.",
    product: "Builder Certification — product-level certification. Each AI product sold receives its own certification. Analogous to CE marking or ISO product certification.",
    kpi: "Product accountability architecture completeness.",
    note: "Division 5 certification does NOT replace the obligation of the Division 5 company's customers to hold their own AIC certification.",
  },
];

const journeySteps = [
  { step: "01", title: "Self-Assessment", desc: "Complete AIC's diagnostic questionnaire to identify your Division classification based on how your organisation relates to AI in consequential decisions." },
  { step: "02", title: "Gap Analysis", desc: "AIC conducts a structured gap analysis against the accountability requirements for your Division, identifying what evidence and controls are needed." },
  { step: "03", title: "Evidence Review", desc: "Submit documentation of your human accountability structures, AI system registrations, override processes, and monitoring mechanisms." },
  { step: "04", title: "Certification Audit", desc: "An AIC-accredited auditor conducts the formal assessment. For Sovereign and Builder certifications, this is a point-in-time audit." },
  { step: "05", title: "Certification & Pulse", desc: "Upon passing, receive your AIC Division certificate. Supervised, Reviewed, and Monitored organisations enter continuous Pulse monitoring." },
];

const heroBg = "https://images.unsplash.com/photo-1683447551794-1c287cd42675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5ldHdvcmslMjBjb25uZWN0aW9ucyUyMGFjY291bnRhYmlsaXR5JTIwc3RydWN0dXJlfGVufDF8fHx8MTc3NTcyNDY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export default function CertificationPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 to-[#0a1628]/80" />
        <div className="absolute inset-0 subtle-grid opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#c9920a]" />
              <span className="text-[#c9920a] text-sm uppercase tracking-widest font-medium">
                AIC Five-Division Framework
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl text-white mb-6" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
              Accountability<br />
              <span className="text-[#c9920a]">Calibrated to AI</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              AIC certification is structured around how your organisation actually relates to AI in consequential decisions — not a one-size-fits-all compliance checkbox. Choose the Division that reflects your reality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-8 py-4 rounded-lg transition-all text-sm font-bold shadow-xl shadow-[#c9920a]/20"
              >
                ENQUIRE ABOUT CERTIFICATION <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro — accountability calibrated */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="eyebrow">The Framework</span>
              <h2 className="text-[#0f1f3d] mt-3 mb-6">
                Your relationship with AI determines your certification path
              </h2>
              <p className="text-[#6b7280] mb-6">
                The AIC Five-Division Framework recognises that organisations sit at very different points on the human-AI accountability spectrum. A hospital where clinicians sign off every AI diagnostic is fundamentally different from a platform where algorithms operate autonomously with periodic human review.
              </p>
              <p className="text-[#6b7280]">
                AIC certification is calibrated to your actual relationship with AI. Each Division has distinct requirements, monitoring obligations, and primary accountability KPIs — because generic compliance frameworks miss the nuance that matters.
              </p>
            </motion.div>

            {/* Division summary grid */}
            <div className="grid grid-cols-1 gap-3">
              {divisions.map((div, i) => {
                const Icon = div.icon;
                return (
                  <motion.a
                    key={div.number}
                    href={`#division-${div.number}`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-4 p-4 rounded border border-[#e5e7eb] bg-[#f0f4f8] hover:bg-white transition-colors`}
                  >
                    <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 bg-white`}>
                      <Icon className={`w-5 h-5 ${div.accentText}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest">Division {div.number}</span>
                        <span className="text-sm font-semibold text-[#0f1f3d]">{div.name}</span>
                      </div>
                      <p className="text-xs text-[#6b7280] truncate">{div.tagline}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#e5e7eb] shrink-0" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Division Cards */}
      <section id="divisions" className="py-12 lg:py-24 bg-[#f0f4f8]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="eyebrow">Full Detail</span>
            <h2 className="text-[#0f1f3d] mt-3 mb-4">
              The Five Divisions
            </h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto">
              Each Division maps to a distinct accountability model. Find yours and see exactly what AIC certifies.
            </p>
          </motion.div>

          <div className="space-y-6">
            {divisions.map((div, i) => {
              const Icon = div.icon;
              return (
                <motion.div
                  key={div.number}
                  id={`division-${div.number}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#0a1628] rounded overflow-hidden border border-white/10 shadow-2xl"
                >
                  {/* Colored top accent strip */}
                  <div className={`h-1 ${div.accentStripBg}`} />

                  <div className="p-8 md:p-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left — identity */}
                      <div className="lg:w-64 shrink-0">
                        <div className={`w-14 h-14 rounded bg-white/5 flex items-center justify-center mb-4`}>
                          <Icon className={`w-7 h-7 ${div.accentText}`} />
                        </div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Division {div.number}</div>
                        <h3 className="text-2xl text-white font-bold mb-2">
                          {div.name}
                        </h3>
                        <p className={`text-sm font-medium italic mb-4 ${div.accentText}`}>
                          &ldquo;{div.tagline}&rdquo;
                        </p>
                        <div className="p-4 rounded bg-white/5 border border-white/10">
                          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Primary KPI</div>
                          <p className="text-white/80 text-xs leading-relaxed">{div.kpi}</p>
                        </div>
                      </div>

                      {/* Right — detail */}
                      <div className="flex-1 space-y-5">
                        <div>
                          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Who This Is</div>
                          <p className="text-white/80 text-sm leading-relaxed">{div.who}</p>
                        </div>

                        {div.examples && (
                          <div>
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Examples</div>
                            <p className="text-white/60 text-sm leading-relaxed">{div.examples}</p>
                          </div>
                        )}

                        <div>
                          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">What AIC Certifies</div>
                          <p className="text-white/80 text-sm leading-relaxed">{div.what}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 p-4 rounded bg-white/5 border border-white/10">
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">AIC Product</div>
                            <p className="text-white/80 text-xs leading-relaxed">{div.product}</p>
                          </div>
                          {div.valueProp && (
                            <div className="flex-1 p-4 rounded bg-[#c9920a]/10 border border-[#c9920a]/20">
                              <div className="text-[10px] font-mono text-[#c9920a]/70 uppercase tracking-widest mb-2">Value Proposition</div>
                              <p className="text-white/80 text-xs leading-relaxed italic">{div.valueProp}</p>
                            </div>
                          )}
                        </div>

                        {div.note && (
                          <div className="p-4 rounded bg-white/5 border border-white/10 flex items-start gap-3">
                            <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${div.accentText}`} />
                            <p className="text-white/60 text-xs leading-relaxed">{div.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certification Journey */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="eyebrow">How It Works</span>
            <h2 className="text-[#0f1f3d] mt-3 mb-4">
              Your Certification Journey
            </h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto">
              Five steps from self-assessment to certified — with ongoing Pulse monitoring for organisations in Divisions 2, 3, and 4.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {journeySteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-[#f0f4f8] border border-[#e5e7eb] rounded p-6 h-full hover:border-[#c9920a]/30 hover:shadow-md transition-all">
                  <div className="text-[#c9920a] text-2xl font-bold font-mono mb-4">{step.step}</div>
                  <h3 className="text-[#0f1f3d] font-semibold mb-3 text-sm">{step.title}</h3>
                  <p className="text-[#6b7280] text-xs leading-relaxed">{step.desc}</p>
                </div>
                {i < journeySteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-[#e5e7eb]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 lg:py-24 bg-[#0a1628] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, #c9920a 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow text-[#c9920a] bg-[#c9920a]/10 px-3 py-1 rounded-full inline-block mb-6">
              Get Certified
            </span>
            <h2 className="text-white mb-4">
              Ready to Certify Your Accountability?
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-2xl mx-auto">
              Start with a diagnostic conversation. AIC will help you identify the right Division, understand the gap, and design a certification pathway that fits your organisation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-10 py-4 rounded font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#c9920a]/25 text-sm"
            >
              Enquire About Certification
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
