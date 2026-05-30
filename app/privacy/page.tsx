"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-aic-paper py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">Institutional Trust</span>
            </div>
            <h1 className="text-5xl mb-6 font-serif italic">
              Privacy Policy
            </h1>
            <p className="text-xl text-aic-paper/70 max-w-3xl leading-relaxed">
              AI Integrity Certification (Pty) Ltd is committed to the responsible, transparent,
              and lawful handling of personal information in accordance with the Protection of
              Personal Information Act 4 of 2013 (POPIA).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-aic prose-lg max-w-none">
            <p className="text-[#6b7280]/60 mb-12 italic font-mono text-sm uppercase tracking-widest">Last Updated: April 2026</p>

            {/* Principles strip */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              {[
                { icon: <Eye className="w-6 h-6 text-aic-copper mb-4" />, title: "Transparency", desc: "We clearly disclose what data we collect, why we collect it, and how it is used — before we collect it." },
                { icon: <Shield className="w-6 h-6 text-aic-copper mb-4" />, title: "Security", desc: "All data is stored in encrypted environments with strict role-based access controls and regular security reviews." },
                { icon: <UserCheck className="w-6 h-6 text-aic-copper mb-4" />, title: "Your Rights", desc: "You have the right to access, correct, delete, and object to the processing of your personal information at any time." },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-aic-paper rounded-2xl border border-[#e5e7eb] shadow-sm">
                  {item.icon}
                  <h3 className="font-bold text-aic-navy mb-2 font-serif text-lg">{item.title}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 1 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">1. Who We Are</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AI Integrity Certification (Pty) Ltd (&ldquo;AIC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a South African company
              providing AI governance certification services. We operate as a certification body
              and are the responsible party for personal information collected through this website
              and our certification platform.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              Our Information Officer is responsible for ensuring compliance with POPIA and can be
              contacted at the details in Section&nbsp;11 of this policy.
            </p>

            {/* 2 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">2. What Personal Information We Collect</h2>
            <p className="text-[#6b7280] mb-4 text-lg leading-relaxed">
              We collect only the minimum personal information necessary to deliver our services.
              This includes:
            </p>
            <div className="bg-aic-paper rounded-2xl p-8 mb-8 space-y-5">
              {[
                { label: "Identity information", desc: "Name, job title, and professional credentials of Accountable Persons and certification contacts." },
                { label: "Contact information", desc: "Work email addresses and telephone numbers used for certification correspondence." },
                { label: "Organisational information", desc: "Business name, registration number, sector, and address of applicant organisations." },
                { label: "Audit evidence", desc: "Governance documents, policy records, decision logs, and bias assessment data submitted for certification review." },
                { label: "Practitioner data", desc: "Education records, CPD logs, examination results, and competency evidence for CAAP candidates." },
                { label: "Website usage data", desc: "Anonymised analytics data (page visits, session duration) collected via Vercel Analytics. No personal identifiers are stored." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-aic-copper shrink-0 mt-2.5" />
                  <p className="text-[#0f1f3d] text-base leading-relaxed"><strong>{item.label}:</strong> {item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              We do not collect special categories of personal information (race, health, religion,
              political views, biometric data) unless it is directly relevant to a bias audit and
              you have provided explicit written consent.
            </p>

            {/* 3 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">3. Why We Collect It — Lawful Basis</h2>
            <p className="text-[#6b7280] mb-4 text-lg leading-relaxed">
              We process personal information on the following lawful bases under POPIA:
            </p>
            <div className="space-y-4 mb-8">
              {[
                { basis: "Performance of a contract", reason: "To execute certification assessments, issue certificates, and maintain the public registry as agreed in the Assessment Agreement." },
                { basis: "Legitimate interest", reason: "To improve our services, detect fraud, and ensure the integrity of the certification process." },
                { basis: "Legal obligation", reason: "To maintain records required by POPIA, the Companies Act, and our accreditation obligations." },
                { basis: "Consent", reason: "For marketing communications, newsletter subscriptions, and any processing not covered above. You may withdraw consent at any time." },
              ].map((item, i) => (
                <div key={i} className="border border-[#e5e7eb] rounded-xl p-6">
                  <p className="font-bold text-aic-navy mb-1">{item.basis}</p>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>

            {/* 4 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">4. Audit Evidence and Confidentiality</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              Audit evidence submitted through the Governance Platform is processed exclusively
              for the purpose of the certification assessment. AIC does not:
            </p>
            <div className="bg-aic-paper rounded-2xl p-8 mb-8 space-y-4">
              {[
                "Use client audit data to train, fine-tune, or benchmark AI models.",
                "Share audit evidence with other certified or applicant organisations.",
                "Disclose the content of governance documents to third parties without written consent, except where required by law or accreditation oversight.",
                "Retain audit evidence beyond the defined retention period (see Section&nbsp;6).",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Shield className="w-5 h-5 text-aic-copper shrink-0 mt-0.5" />
                  <p className="text-[#0f1f3d] text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>

            {/* 5 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">5. Who We Share Information With</h2>
            <p className="text-[#6b7280] mb-4 text-lg leading-relaxed">
              We do not sell personal information. We share it only in the following circumstances:
            </p>
            <div className="space-y-4 mb-8">
              {[
                { who: "Accreditation bodies", what: "SANAS and equivalent bodies may review our assessment records as part of accreditation oversight. They are bound by confidentiality obligations." },
                { who: "Auditors and assessors", what: "Independent auditors assigned to an assessment receive only the information necessary to conduct that assessment." },
                { who: "Infrastructure providers", what: "Cloud hosting and analytics providers (operating under data processing agreements) may process data on our behalf. They are contractually prohibited from using it for their own purposes." },
                { who: "Legal and regulatory authorities", what: "Where required by South African law, court order, or the Information Regulator." },
                { who: "Public registry", what: "The organisation name, certification tier, Integrity Score, and certificate number are published on the public registry at aiccertified.cloud/registry. No personal information is published without consent." },
              ].map((item, i) => (
                <div key={i} className="border border-[#e5e7eb] rounded-xl p-6">
                  <p className="font-bold text-aic-navy mb-1">{item.who}</p>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{item.what}</p>
                </div>
              ))}
            </div>

            {/* 6 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">6. How Long We Keep Your Information</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-aic-navy text-aic-paper">
                    <th className="text-left p-4 font-mono font-bold">Data Category</th>
                    <th className="text-left p-4 font-mono font-bold">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Certification records and audit evidence", "Duration of certification + 5 years"],
                    ["Accountable Person declarations", "Duration of certification + 5 years"],
                    ["Practitioner examination records", "Duration of credential + 7 years"],
                    ["CPD logs", "7 years from the relevant CPD cycle"],
                    ["Website enquiry data", "24 months from last contact"],
                    ["Marketing consent records", "Until consent is withdrawn, then 2 years"],
                    ["Financial/invoicing records", "5 years (Companies Act requirement)"],
                  ].map(([cat, period], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-aic-paper" : "bg-aic-paper"}>
                      <td className="p-4 text-[#0f1f3d]">{cat}</td>
                      <td className="p-4 text-[#0f1f3d] font-mono text-xs">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              At the end of a retention period, data is securely deleted or anonymised. You may
              request early deletion subject to our legal obligations (see Section&nbsp;7).
            </p>

            {/* 7 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">7. Your Rights Under POPIA</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              As a data subject under POPIA, you have the following rights. To exercise any of
              them, contact our Information Officer (Section&nbsp;11) with proof of identity.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { right: "Right to Access", desc: "Request a copy of the personal information we hold about you." },
                { right: "Right to Correction", desc: "Request correction of inaccurate or incomplete information." },
                { right: "Right to Deletion", desc: "Request deletion of your information where we no longer have a lawful basis to hold it." },
                { right: "Right to Object", desc: "Object to processing based on legitimate interest, including direct marketing." },
                { right: "Right to Restrict Processing", desc: "Request that we limit how we use your data while a dispute is resolved." },
                { right: "Right to Complain", desc: "Lodge a complaint with the Information Regulator of South Africa if you believe we have violated POPIA." },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-aic-paper border border-[#e5e7eb] rounded-xl shadow-sm">
                  <p className="font-bold text-aic-navy mb-1 font-serif">{item.right}</p>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-8">
              <strong>Information Regulator:</strong> complaints can be lodged at{" "}
              <a href="https://inforegulator.org.za" className="text-aic-copper underline" target="_blank" rel="noopener noreferrer">inforegulator.org.za</a>.
              We will respond to all requests within 30 days.
            </p>

            {/* 8 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">8. Automated Decision-Making</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AIC uses automated tools to generate preliminary Integrity Scores and flag potential
              compliance gaps during an assessment. These outputs are <strong>advisory only</strong> —
              no certification decision is made without a qualified human auditor reviewing and
              approving the result. This is consistent with POPIA Section&nbsp;71 and with the
              principles of the AIC Declaration of Algorithmic Rights.
            </p>

            {/* 9 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">9. Cookies and Analytics</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              This website uses Vercel Analytics to collect anonymised, aggregated usage data
              (page views, referral sources, device type). No personal identifiers are stored.
              No third-party advertising or tracking cookies are set. You can disable JavaScript
              in your browser to opt out of analytics entirely, though this may affect site
              functionality.
            </p>

            {/* 10 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">10. Changes to This Policy</h2>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              We may update this policy from time to time. Material changes will be communicated
              via email to registered platform users and noted at the top of this page. Continued
              use of our services after the effective date of a change constitutes acceptance of
              the revised policy.
            </p>

            {/* 11 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">11. Contact Our Information Officer</h2>
            <div className="bg-aic-paper border border-[#e5e7eb] rounded-2xl p-10 shadow-sm">
              <div className="flex items-start gap-6">
                <Mail className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-aic-navy mb-2 font-serif text-xl">Information Officer</h3>
                  <p className="text-[#6b7280] mb-1">Zander Wilken</p>
                  <p className="text-[#6b7280] mb-1">AI Integrity Certification (Pty) Ltd</p>
                  <p className="text-[#6b7280] mb-4">South Africa</p>
                  <a href="mailto:zander@ztoaholdings.co.za" className="text-aic-copper underline font-bold text-lg">
                    zander@ztoaholdings.com
                  </a>
                  <p className="text-[#6b7280]/80 text-sm mt-4 leading-relaxed">
                    All POPIA requests will be acknowledged within 5 business days and
                    responded to within 30 calendar days.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
