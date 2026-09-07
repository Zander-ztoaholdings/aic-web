"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Scale, CheckCircle, AlertCircle, Download, ExternalLink, FileSearch } from "lucide-react";

// Rewritten 7 September 2026. The previous version asserted a set of running
// processes that did not exist: an actively maintained Impartiality Risk
// Register reviewed every quarter, an annually published summary of
// safeguards, a risk register available to certificate holders on request,
// separation between assessor and decision-maker, and an annual directors'
// review. None of it had happened, and AIC's own compliance matrix
// (401-COMPLIANCE-OBLIGATIONS) recorded this statement as not in place while
// the page was live claiming otherwise.
//
// It also contradicted /disclosures twice: that page states the separation
// rule as a permanent bar, while this one downgraded it to a three-year
// cooling-off period, and that page states plainly that no impartiality
// report has ever been published.
//
// The page now uses the same three-state vocabulary as /disclosures —
// in force / committed / not yet in place — because a commitment and a
// running mechanism are different things, and the distinction is the whole
// point of the document.

type State = "in force" | "committed" | "not yet in place";

function StateBadge({ state }: { state: State }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full ${
        state === "in force"
          ? "bg-[#10b981]/10 text-[#0a7a54]"
          : state === "committed"
            ? "bg-[#c9920a]/10 text-[#8a6607]"
            : "bg-[#6b7280]/10 text-[#6b7280]"
      }`}
    >
      {state}
    </span>
  );
}

function SafeguardCard({ title, state, desc }: { title: string; state: State; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-aic-paper rounded-lg border border-[#e5e7eb]">
      {state === "in force" ? (
        <CheckCircle className="w-5 h-5 text-[#0a7a54] shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-[#9ca3af] shrink-0 mt-0.5" />
      )}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-medium text-[#0f1f3d]">{title}</span>
          <StateBadge state={state} />
        </div>
        <p className="text-sm text-[#6b7280] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const SAFEGUARDS: { title: string; state: State; desc: string }[] = [
  {
    title: "No advisory relationship",
    state: "in force",
    desc: "AIC never certifies an organisation it has a commercial or advisory relationship with. Not a cooling-off period — a permanent bar, and the rule the entire body is built on.",
  },
  {
    title: "Training separated from certification",
    state: "in force",
    desc: "AIC's governance workshops teach only. They never design, review or implement an organisation's controls, because doing so would put AIC in the position of grading its own work.",
  },
  {
    title: "Conflict declaration per engagement",
    state: "committed",
    desc: "A written independence declaration, naming the organisation, signed before assessment work begins. The form is drafted; it has not been used, because no assessment has been carried out.",
  },
  {
    title: "Client concentration limit",
    state: "committed",
    desc: "No single client to exceed 15% of annual revenue. AIC has issued no certificates, so this commitment has not been tested in practice.",
  },
  {
    title: "Assessor and decision-maker separated",
    state: "not yet in place",
    desc: "AIC is currently small enough that the person who would assess and the person who would decide are the same person. No wording fixes that. It will be resolved by appointing an independent reviewer before the first certificate is issued, not before accreditation.",
  },
  {
    title: "Impartiality risk analysis",
    state: "committed",
    desc: "AIC maintains a risk register covering the business as a whole, including the structural conflicts that threaten impartiality. A dedicated impartiality analysis against each recognised threat category is being added to it, with the first quarterly review scheduled for December 2026.",
  },
  {
    title: "Independent conflicts panel",
    state: "not yet in place",
    desc: "Conflict allegations are currently handled by AIC's founders, because AIC is a small body and there is no panel yet. Balanced representation of interested parties is not achievable at AIC's present size; it is a prerequisite for accreditation and will be in place before the first certificate is issued.",
  },
  {
    title: "Published impartiality report",
    state: "not yet in place",
    desc: "No impartiality report has been published. Once AIC is accredited, its accreditation body reviews these arrangements; until then there is no external auditor of them and we will not imply otherwise.",
  },
];

const PROHIBITIONS = [
  "Provide consultancy or advisory services to any organisation that is applying for, or holds, AIC certification.",
  "Design, write, review or implement the policies, controls or documentation that AIC will later assess.",
  "Assess work they have personally produced, reviewed or approved — regardless of how much time has passed.",
  "Assess any organisation by which they have been employed within the preceding 24 months.",
  "Accept gifts, entertainment or other inducements from applicants or certificate holders, beyond token hospitality.",
  "Participate in any certification decision — scoring, reviewing or approving — for a candidate they have trained, coached or mentored within the preceding 12 months.",
  "Hold a financial interest in, or receive remuneration from, any organisation subject to AIC assessment.",
  "Make a certification decision contingent on the applicant procuring any other AIC service.",
];

export default function ImpartialityStatement() {
  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-aic-navy text-aic-paper py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-aic-copper" />
              <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
                Governance Document
              </span>
            </div>
            <h1 className="text-5xl mb-6 font-serif italic">Statement of Impartiality</h1>
            <p className="text-xl text-aic-paper/70 max-w-3xl leading-relaxed">
              A certification body that cannot say where its own safeguards stand has no business
              grading anyone else. Every mechanism below is marked with what it actually is today:
              running, committed, or not yet in place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Where AIC actually stands */}
      <section className="py-12 border-b border-[#e5e7eb] bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#c9920a] shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-bold text-[#0f1f3d] mb-2 uppercase tracking-widest font-mono">
                Where AIC stands today
              </h2>
              <p className="text-[#6b7280] leading-relaxed">
                AIC has certified no organisations and holds no accreditation. It is a small body,
                which means some of the separations a mature certification body relies on are
                commitments here rather than running mechanisms. Those are marked as such
                throughout, and the gaps that matter — an independent reviewer, a conflicts panel —
                are tied to the first certificate being issued, not to some later milestone. The
                full position is set out in our{" "}
                <Link href="/disclosures" className="text-aic-copper underline underline-offset-2">
                  public disclosures
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-aic prose-lg max-w-none">
            <p className="text-[#6b7280]/60 mb-12 italic font-mono text-sm uppercase tracking-widest">
              Version 2.0 — 7 September 2026 · Next scheduled review: December 2026
            </p>

            {/* 1. Commitment */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4">1. Our Commitment</h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AI Integrity Certification (Pty) Ltd (&ldquo;AIC&rdquo;) is committed to impartiality
              in all its certification activities. Impartiality means that AIC&apos;s certification
              decisions are based solely on objective evidence, assessed by competent and
              independent personnel, and are not influenced by commercial, financial or personal
              interests.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              AIC will not allow commercial pressure, applicant relationships or external
              influences to compromise the integrity of any assessment or certification decision.
              This commitment applies to all directors, employees, contractors and auditors acting
              on behalf of AIC.
            </p>

            {/* The Separation Rule */}
            <div className="bg-aic-navy text-aic-paper rounded-2xl p-10 my-12">
              <div className="flex items-start gap-6">
                <Scale className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-aic-paper mb-3 font-serif text-xl">
                    The AIC Separation Rule
                  </h3>
                  <p className="text-aic-paper/80 leading-relaxed text-base mb-3">
                    AIC will never advise <strong className="text-aic-paper">and</strong> certify
                    the same organisation. This is a permanent bar, not a cooling-off period.
                    An organisation that has received consultancy or advisory services from AIC, or
                    from any person acting on AIC&apos;s behalf, is not eligible for AIC
                    certification.
                  </p>
                  <p className="text-aic-paper/80 leading-relaxed text-base mb-0">
                    Teaching is treated separately and deliberately. AIC&apos;s workshops explain
                    the standard and the regulation; they never design, review or implement a
                    participant&apos;s controls. An organisation AIC has taught may still seek
                    certification — but the individual who taught them takes no part in assessing
                    or deciding it, and any material that AIC itself shaped is out of scope for
                    AIC to assess, permanently.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Safeguards, honestly stated */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              2. Safeguards, and Their Actual Status
            </h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              A commitment we have made and a mechanism that is already running are different
              things. Each safeguard below is marked with which it is.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8 not-prose">
              {SAFEGUARDS.map((s) => (
                <SafeguardCard key={s.title} title={s.title} state={s.state} desc={s.desc} />
              ))}
            </div>

            {/* 3. Prohibitions */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              3. Conflict of Interest Prohibitions
            </h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              These are binding rules on AIC personnel, in force now. They constrain what AIC may
              do from the first engagement onward, rather than describing a process that has
              already run. AIC personnel may not:
            </p>
            <div className="bg-aic-paper border border-[#e5e7eb] rounded-2xl p-10 my-8 shadow-sm not-prose">
              <div className="flex items-start gap-6">
                <AlertCircle className="w-8 h-8 text-aic-copper shrink-0 mt-1" />
                <div className="space-y-4 w-full">
                  {PROHIBITIONS.map((p, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-aic-copper shrink-0 mt-0.5" />
                      <p className="text-[#0f1f3d] text-sm leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Declarations */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              4. Conflict Declaration Obligations
            </h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              The declaration form is drafted and will be signed before the first assessment AIC
              carries out. No assessment has been carried out, so no declaration has yet been
              signed — which is why this section describes an obligation rather than a history.
            </p>
            <div className="space-y-4 mb-8 not-prose">
              {[
                {
                  step: "01",
                  title: "Declare on appointment",
                  desc: "Complete a Conflicts of Interest Declaration before commencing any role at AIC, disclosing relevant relationships, employment history and financial interests.",
                },
                {
                  step: "02",
                  title: "Declare per engagement",
                  desc: "Before each assessment, certify in writing that no conflict exists with the applicant organisation, or disclose any potential conflict for review.",
                },
                {
                  step: "03",
                  title: "Declare ongoing changes",
                  desc: "Notify AIC's directors within 5 business days of any new relationship, employment offer or financial interest that could affect impartiality.",
                },
                {
                  step: "04",
                  title: "Accept recusal",
                  desc: "Where a declared conflict cannot be adequately managed, the individual recuses themselves from the engagement entirely, and the applicant is reassigned without prejudice.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start border border-[#e5e7eb] rounded-xl p-6">
                  <span className="font-mono text-aic-copper font-bold text-2xl shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-bold text-aic-navy mb-1 font-serif">{item.title}</p>
                    <p className="text-[#6b7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Decision-making */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              5. Independent Decision-Making
            </h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              A certification decision should not be made by the person who carried out the
              assessment. AIC cannot claim that separation today: it is a small body, and the
              assessor and the decision-maker would currently be the same person. We are stating
              that plainly rather than describing a three-stage process that does not yet have
              three people in it.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              The model below is what AIC commits to operating. An independent reviewer will be
              appointed to fill the review and decision roles{" "}
              <strong className="text-[#0f1f3d]">before the first certificate is issued</strong> —
              not deferred to accreditation, because a decision nobody independent has checked is
              the thing certification is supposed to prevent.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8 not-prose">
              {[
                {
                  icon: <FileSearch className="w-6 h-6 text-aic-copper mb-4" />,
                  title: "Assessment",
                  desc: "Conducted by a qualified assessor with no conflict with the applicant. Produces a scored Evidence Record.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-aic-copper mb-4" />,
                  title: "Review",
                  desc: "An independent reviewer examines the Evidence Record and the assessor's findings before any decision is made.",
                },
                {
                  icon: <Scale className="w-6 h-6 text-aic-copper mb-4" />,
                  title: "Decision",
                  desc: "The decision is made by someone who took no part in the assessment or the review.",
                },
              ].map((item) => (
                <div key={item.title} className="p-8 bg-aic-paper border border-[#e5e7eb] rounded-2xl shadow-sm">
                  {item.icon}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-aic-navy font-serif text-lg">{item.title}</h4>
                  </div>
                  <p className="text-sm text-[#6b7280]/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#6b7280] mb-8 italic">
              Status: committed, not yet operating. AIC has issued no certificates.
            </p>

            {/* 6. Risk identification */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              6. Identifying Threats to Impartiality
            </h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              AIC maintains a risk register covering the business as a whole. It already records
              the structural conflicts most likely to compromise a certification body: the
              incentive to pass a paying client, and the deeper conflict that arises when the body
              that certifies also disciplines the people it earns fees from.
            </p>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              What is being added is a dedicated impartiality analysis — each recognised threat
              category (self-interest, self-review, advocacy, over-familiarity, intimidation and
              competition) assessed against AIC&apos;s actual relationships, reviewed on a
              quarterly cycle with the outcome dated. The first such review is scheduled for
              December 2026. Until a review has happened, this page will not describe one as
              routine.
            </p>

            {/* 7. Concerns */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              7. Raising an Impartiality Concern
            </h2>
            <p className="text-[#6b7280] mb-6 text-lg leading-relaxed">
              Any applicant, certificate holder or third party who believes AIC&apos;s impartiality
              has been compromised may raise a concern at any time. AIC treats such concerns as
              seriously as a challenge to an assessment decision.
            </p>
            <div className="bg-aic-paper border border-[#e5e7eb] rounded-2xl p-10 mb-8 shadow-sm not-prose">
              <h3 className="font-bold text-aic-navy mb-4 font-serif text-xl">What we commit to</h3>
              <div className="space-y-4">
                {[
                  "Write to zander@ztoaholdings.com, marked “Impartiality Concern”.",
                  "AIC acknowledges receipt within 5 business days.",
                  "The concern is investigated by someone not involved in the matter under review. Where AIC's size makes that impossible, we will say so, and refer the matter to an external reviewer rather than mark our own work.",
                  "A written response setting out findings and any remedial action, within 30 days.",
                  "Once AIC is accredited, an unsatisfactory response may be escalated to its accreditation body. AIC is not accredited today, so that route does not yet exist — and we would rather say so than imply an appeal path that leads nowhere.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-aic-copper font-bold text-sm shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[#0f1f3d] text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Review */}
            <h2 className="text-aic-navy font-serif italic text-3xl mb-4 mt-16">
              8. How This Statement Is Reviewed
            </h2>
            <p className="text-[#6b7280] mb-8 text-lg leading-relaxed">
              This statement is reviewed on a quarterly cycle alongside the impartiality risk
              analysis, and in full once a year. It is also reviewed out of cycle whenever
              something happens that could change the answer — a new engagement, a change in
              ownership or personnel, a complaint, or an organisation AIC has taught seeking
              certification. The version date above records the last review, and it is intended to
              be checked: a date that has gone stale is itself a finding.
            </p>

            {/* Action buttons */}
            <div className="pt-12 border-t border-[#e5e7eb] flex flex-wrap gap-4 not-prose">
              <Link
                href="/disclosures"
                className="bg-aic-navy text-aic-paper px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest font-mono hover:bg-aic-navy-mid transition-all shadow-lg shadow-aic-navy/10 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Full public disclosures
              </Link>
              <a
                href="/AIC-Declaration-of-Algorithmic-Rights.pdf"
                download="AIC-Declaration-of-Algorithmic-Rights.pdf"
                className="inline-flex items-center gap-2 border-2 border-aic-navy text-aic-navy px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest font-mono hover:bg-white transition-all"
              >
                <Download className="w-4 h-4" /> Declaration of Rights
              </a>
              <a
                href="https://www.sanas.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#e5e7eb] text-[#6b7280] px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest font-mono hover:bg-white transition-all"
              >
                <ExternalLink className="w-4 h-4" /> SANAS
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
