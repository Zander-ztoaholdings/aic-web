"use client";

import { motion } from "framer-motion";
import { Shield, Scale, CheckCircle, AlertCircle, Download, ExternalLink, Users, RefreshCw, FileSearch } from "lucide-react";

export default function ImpartialityStatement() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-aic-paper py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">Regulatory Requirement</span>
            </div>
            <h1 className="text-5xl mb-6 font-serif italic">
              Statement of Impartiality
            </h1>
            <p className="text-xl text-aic-paper/70 max-w-3xl leading-relaxed">
              Independence and objectivity are not aspirational values — they are operational
              requirements. This statement sets out AIC&apos;s binding commitments, prohibitions,
              and processes for maintaining impartiality in every certification decision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-aic prose-lg max-w-none">
            <p className="text-[#6b7280]/60 mb-12 italic font-mono text-sm uppercase tracking-widest">Last Updated: April 2026 — Version 1.0</p>

            {/* Commitment */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4">1. Our Commitment</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AI Integrity Certification (Pty) Ltd (&ldquo;AIC&rdquo;) is committed to impartiality in all
              its certification activities. Impartiality means that AIC&apos;s certification decisions
              are based solely on objective evidence, assessed by competent and independent
              personnel, and are not influenced by commercial, financial, or personal interests.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              AIC will not allow commercial pressure, applicant relationships, or external
              influences to compromise the integrity of any assessment or certification decision.
              This commitment applies to all directors, employees, contractors, and auditors
              acting on behalf of AIC.
            </p>

            {/* The Arthur Andersen Rule */}
            <div className="bg-aic-navy text-aic-paper rounded-2xl p-10 my-12">
              <div className="flex items-start gap-6">
                <Scale className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-aic-paper mb-3 font-serif text-xl">The AIC Separation Rule</h3>
                  <p className="text-aic-paper/80 leading-relaxed text-base mb-0">
                    AIC will never consult <strong className="text-aic-paper">and</strong> certify the same client.
                    Any organisation that has received consultancy services from AIC — or from
                    any person associated with AIC within the past three years — is ineligible to
                    be assessed by that same person or entity. This separation is absolute.
                    There are no exceptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Conflict Prohibitions */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">2. Conflict of Interest Prohibitions</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AIC prohibits its personnel from engaging in any activity that creates, or could
              reasonably be perceived to create, a conflict of interest. Specifically, AIC
              personnel may not:
            </p>
            <div className="bg-aic-paper border border-[#e5e7eb] rounded-2xl p-10 my-8 shadow-sm">
              <div className="flex items-start gap-6">
                <AlertCircle className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div className="space-y-4 w-full">
                  {[
                    { prohibition: "Provide consultancy or advisory services to any organisation that is currently applying for, or holds, AIC certification.", note: null },
                    { prohibition: "Audit work they have personally produced, reviewed, or approved — regardless of how much time has passed.", note: null },
                    { prohibition: "Assess any organisation by which they have been employed within the preceding 24 months.", note: null },
                    { prohibition: "Accept gifts, entertainment, or other inducements from certification applicants or certificate holders, beyond token hospitality.", note: null },
                    { prohibition: "Participate in any certification decision — including scoring, reviewing, or approving — for a candidate they have trained, coached, or mentored within the preceding 12 months.", note: null },
                    { prohibition: "Hold a financial interest in, or receive remuneration from, any organisation subject to AIC assessment.", note: null },
                    { prohibition: "Make a certification decision that is contingent on the applicant procuring any other AIC service.", note: null },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-aic-copper shrink-0 mt-0.5" />
                      <p className="text-[#0f1f3d] text-sm leading-relaxed">{item.prohibition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Declaration requirement */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">3. Conflict Declaration Obligations</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              All AIC personnel — including contracted auditors and external reviewers — are
              required to:
            </p>
            <div className="space-y-4 mb-8">
              {[
                { step: "01", title: "Declare on appointment", desc: "Complete a Conflicts of Interest Declaration prior to commencing any role at AIC, disclosing all relevant relationships, employment history, and financial interests." },
                { step: "02", title: "Declare per engagement", desc: "Before each assessment, certify in writing that no conflict exists with the applicant organisation, or disclose any potential conflict for review." },
                { step: "03", title: "Declare ongoing changes", desc: "Notify AIC&apos;s impartiality oversight function within 5 business days of any new relationship, employment offer, or financial interest that could affect impartiality." },
                { step: "04", title: "Accept recusal", desc: "Where a declared conflict cannot be adequately managed, the individual must recuse themselves from the engagement entirely. The applicant will be reassigned without prejudice." },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start border border-[#e5e7eb] rounded-xl p-6">
                  <span className="font-mono text-aic-copper font-bold text-2xl shrink-0">{item.step}</span>
                  <div>
                    <p className="font-bold text-aic-navy mb-1 font-serif">{item.title}</p>
                    <p className="text-[#6b7280] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Decision-making independence */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">4. Independent Decision-Making</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AIC certification decisions follow a separation-of-duties model. The person who
              conducts the assessment and the person who approves the certification decision
              are always different individuals. This separation cannot be waived for any
              reason, including time pressure or resource constraints.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: <FileSearch className="w-6 h-6 text-aic-copper mb-4" />, title: "Assessment", desc: "Conducted by a qualified auditor with no conflict with the applicant. Produces a scored Evidence Record." },
                { icon: <Users className="w-6 h-6 text-aic-copper mb-4" />, title: "Review", desc: "A second qualified reviewer examines the Evidence Record and auditor findings independently before a decision is made." },
                { icon: <Scale className="w-6 h-6 text-aic-copper mb-4" />, title: "Decision", desc: "The certification decision is made by a senior AIC officer who has not participated in the assessment or review." },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-aic-paper border border-[#e5e7eb] rounded-2xl shadow-sm">
                  {item.icon}
                  <h4 className="font-bold text-aic-navy mb-2 font-serif text-lg">{item.title}</h4>
                  <p className="text-sm text-[#6b7280]/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Risk identification */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">5. Ongoing Risk Identification</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AIC maintains an active Impartiality Risk Register. Threats to impartiality
              arising from relationships, financial dependencies, commercial arrangements, or
              personnel changes are identified, logged, and assessed at least quarterly.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: <RefreshCw className="w-6 h-6 text-aic-copper mb-4" />, title: "Quarterly Review", desc: "The Impartiality Risk Register is reviewed every quarter. Any emerging risks are assessed and mitigated before the next certification cycle." },
                { icon: <Shield className="w-6 h-6 text-aic-copper mb-4" />, title: "Public Disclosure", desc: "AIC publishes a summary of impartiality safeguards annually. Certificate holders and applicants may request a copy of the current risk register at any time." },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-aic-paper rounded-2xl border border-[#e5e7eb] shadow-sm hover:border-[#c9920a]/30 transition-colors">
                  {item.icon}
                  <h4 className="font-bold text-aic-navy mb-2 font-serif text-lg">{item.title}</h4>
                  <p className="text-sm text-[#6b7280]/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Complaints */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">6. Raising Impartiality Concerns</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              Any applicant, certificate holder, or third party who believes that AIC&apos;s
              impartiality has been compromised may raise a concern at any time. AIC treats
              impartiality complaints with the same seriousness as complaints about incorrect
              assessment decisions.
            </p>
            <div className="bg-aic-paper border border-[#e5e7eb] rounded-2xl p-10 mb-8 shadow-sm">
              <h3 className="font-bold text-aic-navy mb-4 font-serif text-xl">Complaints Process</h3>
              <div className="space-y-4">
                {[
                  "Submit your concern in writing to zander@ztoaholdings.com, marked &ldquo;Impartiality Concern&rdquo;.",
                  "AIC will acknowledge receipt within 5 business days.",
                  "An investigation will be conducted by a person not involved in the matter under review.",
                  "A written response including findings and any remedial action will be provided within 30 days.",
                  "If unsatisfied with AIC&apos;s response, you may escalate to SANAS or the relevant accreditation body once AIC is accredited.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-aic-copper font-bold text-sm shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-[#0f1f3d] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Annual review */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">7. Annual Review and Governance</h2>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              This Statement of Impartiality is reviewed annually by AIC&apos;s directors. Any
              material changes to AIC&apos;s operations, ownership, or personnel structure that
              could affect impartiality are assessed against this statement and, where necessary,
              lead to its revision. The version date at the top of this document reflects the
              most recent review.
            </p>

            {/* Action buttons */}
            <div className="pt-12 border-t border-aic-paper flex flex-wrap gap-4">
              <a
                href="/AIC-Declaration-of-Algorithmic-Rights.pdf"
                download="AIC-Declaration-of-Algorithmic-Rights.pdf"
                className="bg-aic-navy text-aic-paper px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest font-mono hover:bg-aic-navy-mid transition-all shadow-lg shadow-aic-navy/10 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Declaration of Rights
              </a>
              <a
                href="https://www.sanas.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-aic-navy text-aic-navy px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest font-mono hover:bg-aic-paper transition-all"
              >
                <ExternalLink className="w-4 h-4" /> SANAS Requirements
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
