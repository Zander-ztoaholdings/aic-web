"use client";

import { motion } from "framer-motion";
import { Scale, AlertTriangle, Ban, Globe } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-aic-paper py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">Agreement</span>
            </div>
            <h1 className="text-5xl mb-6 font-serif italic">
              Terms of Use
            </h1>
            <p className="text-xl text-aic-paper/70 max-w-3xl leading-relaxed">
              These terms govern your access to the AIC website, certification platform, public
              registry, and all intellectual property relating to the AIC certification programme
              and the Declaration of Algorithmic Rights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-aic prose-lg max-w-none">
            <p className="text-[#6b7280]/60 mb-12 italic font-mono text-sm uppercase tracking-widest">Last Updated: April 2026</p>

            {/* 1 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4">1. Parties and Acceptance</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              These Terms of Use (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
              (&ldquo;you&rdquo;, &ldquo;user&rdquo;) and AI Integrity Certification (Pty) Ltd (&ldquo;AIC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
              a company registered in the Republic of South Africa.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              By accessing this website, creating an account on the Governance Platform, or
              engaging AIC&apos;s certification services, you confirm that you have read, understood,
              and agree to be bound by these Terms and our Privacy Policy. If you are accepting
              on behalf of an organisation, you warrant that you have authority to bind that
              organisation.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              If you do not agree to these Terms, you must not access or use our services.
            </p>

            {/* 2 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">2. Definitions</h2>
            <div className="space-y-3 mb-8">
              {[
                { term: "\"Platform\"", def: "The AIC Governance Platform at aiccertified.cloud, including the certification workspace, public registry, and assessment tools." },
                { term: "\"Services\"", def: "Organisational certification assessments, CAAP practitioner credentialling, bias analysis, and related advisory outputs." },
                { term: "\"Certification Marks\"", def: "The trademarks, logos, badges, and trust mark SVGs owned by AIC, including \"AIC Certified\" and \"AIC Methodology Assessed\"." },
                { term: "\"Declaration\"", def: "The Declaration of Algorithmic Rights published by AIC under Creative Commons Attribution 4.0." },
                { term: "\"Accountable Person\"", def: "The named individual documented as responsible for an AI system under the AIC certification framework." },
                { term: "\"Integrity Score\"", def: "The 0–100 numeric representation of an organisation&apos;s verified compliance across the five algorithmic rights." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-[#e5e7eb] last:border-0">
                  <span className="font-mono text-aic-copper font-bold text-sm shrink-0 w-52">{item.term}</span>
                  <span className="text-[#6b7280] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item.def }} />
                </div>
              ))}
            </div>

            {/* 3 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">3. Access and Account Registration</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              Certain features of the Platform require account registration. You agree to:
            </p>
            <div className="bg-aic-paper rounded-2xl p-8 mb-8 space-y-4">
              {[
                "Provide accurate, current, and complete registration information.",
                "Keep your login credentials confidential and notify us immediately of any unauthorised access.",
                "Take responsibility for all activity that occurs under your account.",
                "Not share or transfer your account to any other person or entity.",
                "Ensure that the Accountable Person records registered on the Platform accurately reflect your organisation&apos;s actual governance structure.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-aic-copper shrink-0 mt-2.5" />
                  <p className="text-[#0f1f3d] text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>

            {/* 4 — Certification Mark critical block */}
            <div className="bg-aic-paper border border-aic-copper/20 rounded-2xl p-10 my-12 shadow-sm">
              <div className="flex items-start gap-6">
                <AlertTriangle className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-aic-navy mb-4 font-serif text-xl">4. Certification Marks — Critical</h3>
                  <p className="text-[#0f1f3d] mb-4 leading-relaxed">
                    The AIC Certification Marks are registered trademarks of AI Integrity Certification
                    (Pty) Ltd. Their use is strictly governed by the Trust Mark Licence Agreement
                    issued at the time of certification.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Only organisations and individuals with active, verified certification status may display an AIC mark.",
                      "Certified organisations must immediately remove all marks upon suspension, withdrawal, or expiry of their certificate.",
                      "The trust mark SVG issued by AIC must link to the certified organisation&apos;s registry entry at aiccertified.cloud/registry.",
                      "Modification, recolouring, or re-proportioning of any AIC mark is prohibited without prior written consent.",
                      "Misrepresentation of certification status — including use of the marks after expiry — may constitute fraud and will result in legal action.",
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <Ban className="w-4 h-4 text-aic-copper shrink-0 mt-1" />
                        <p className="text-[#0f1f3d] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">5. Acceptable Use</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              You may use the Platform and Services for lawful purposes related to AI governance.
              You may not:
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Submit false, misleading, or fabricated evidence in support of a certification application.",
                "Attempt to reverse-engineer, scrape, or systematically extract data from the Platform.",
                "Use automated tools to access the Platform in a manner that exceeds normal usage patterns.",
                "Interfere with or disrupt the integrity or performance of the Platform.",
                "Impersonate another organisation, practitioner, or AIC personnel.",
                "Use the Platform for any purpose that violates applicable South African law or international law.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start py-2 border-b border-[#e5e7eb] last:border-0">
                  <Ban className="w-4 h-4 text-[#d4183d] shrink-0 mt-1" />
                  <p className="text-[#6b7280] text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              AIC reserves the right to suspend or permanently revoke platform access, and to
              withdraw or refuse certification, for any breach of these acceptable use obligations.
            </p>

            {/* 6 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">6. Intellectual Property</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              All content on this website and Platform — including the AIC methodology, scoring
              rubric, Empathy Engine, assessment frameworks, and Integrity Score algorithm — is
              the proprietary intellectual property of AI Integrity Certification (Pty) Ltd.
            </p>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              The <strong>Declaration of Algorithmic Rights</strong> is published under Creative Commons
              Attribution 4.0 International (CC BY 4.0). You may freely use, adapt, and republish
              it with attribution to AIC. The Declaration is separate from — and does not include
              — AIC&apos;s proprietary assessment methodology.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              Nothing in these Terms transfers any intellectual property rights to you. You may
              not reproduce, distribute, or create derivative works from AIC&apos;s proprietary
              materials without prior written consent.
            </p>

            {/* 7 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">7. Disclaimer of Warranties</h2>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              AIC provides its website and Platform on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
              We make no warranties, express or implied, regarding the accuracy, completeness,
              or fitness for a particular purpose of any content. AIC certification does not
              constitute a warranty that a certified organisation&apos;s AI systems are free from
              error or bias — it certifies that named, accountable human oversight exists and is
              functioning.
            </p>

            {/* 8 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">8. Limitation of Liability</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              To the maximum extent permitted by South African law, AIC shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from
              your use of the Platform or Services, or from any decision made — or not made —
              in reliance on an AIC Integrity Score or certification outcome.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              AIC&apos;s total liability for any direct claim shall not exceed the fees paid by the
              affected party for the specific service giving rise to the claim.
            </p>

            {/* 9 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">9. Suspension and Termination</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AIC may suspend or terminate your access to the Platform or withdraw certification at any time, with or without notice, for:
            </p>
            <div className="bg-aic-paper rounded-2xl p-8 mb-8 space-y-3">
              {[
                "Breach of these Terms or the Assessment Agreement.",
                "Submission of false, misleading, or fabricated information.",
                "Failure to pay fees when due.",
                "Non-compliance with annual renewal obligations.",
                "Material deterioration in governance standards verified through a re-assessment.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-aic-copper shrink-0 mt-2.5" />
                  <p className="text-[#0f1f3d] text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              Upon termination, your obligations regarding certification marks (Section&nbsp;4)
              survive and remain binding.
            </p>

            {/* 10 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">10. Governing Law and Disputes</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the
              Republic of South Africa. You irrevocably submit to the exclusive jurisdiction of
              the courts in South Africa for the resolution of any dispute arising from these
              Terms or your use of the Platform.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              Before commencing legal proceedings, both parties agree to attempt to resolve any
              dispute through good-faith negotiation for a period of 30 days from written notice
              of the dispute.
            </p>

            {/* 11 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">11. Changes to These Terms</h2>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide at least
              14 days&apos; notice of material changes to registered platform users via email.
              Continued use of the Services after the effective date constitutes acceptance of
              the revised Terms.
            </p>

            {/* 12 */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">12. Contact</h2>
            <div className="bg-aic-paper border border-[#e5e7eb] rounded-2xl p-10 shadow-sm">
              <div className="flex items-start gap-6">
                <Globe className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-aic-navy mb-2 font-serif text-xl">Legal Enquiries</h3>
                  <p className="text-[#6b7280] mb-1">AI Integrity Certification (Pty) Ltd</p>
                  <p className="text-[#6b7280] mb-4">South Africa</p>
                  <a href="mailto:zander@ztoaholdings.co.za" className="text-aic-copper underline font-bold text-lg">
                    zander@ztoaholdings.co.za
                  </a>
                  <p className="text-[#6b7280]/80 text-sm mt-4 leading-relaxed">
                    For general enquiries and platform support, use the contact form at
                    aiccertified.cloud/contact.
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
