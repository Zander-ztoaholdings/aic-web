import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  path: "/paia",
  title: "PAIA manual",
  description: "AI Integrity Certification's manual under section 51 of the Promotion of Access to Information Act: the records we hold, how to request them, the fees, and your remedies.",
  cardKicker: "Access to information",
});

/**
 * PAIA manual, under section 51 of the Promotion of Access to Information Act
 * 2 of 2000, as amended by POPIA, and the Regulations relating to the
 * Promotion of Access to Information, 2021.
 *
 * The processing details mirror the privacy policy, so the two must change
 * together. Fees are the Information Regulator's published private body
 * fees. Review this page whenever the company's records, systems or officers
 * change, and at least once a year.
 */

const UPDATED = "14 October 2026";
const serif = { fontFamily: "'Merriweather', serif" } as const;

const H2 = ({ id, n, children }: { id: string; n: number; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-28 mt-14 text-[1.5rem] md:text-[1.75rem] font-bold leading-[1.2]" style={serif}>
    <span className="text-[#a8772a] mr-2">{n}.</span>{children}
  </h2>
);

const SECTIONS = [
  ["about", "About this manual"],
  ["company", "Company and Information Officer"],
  ["guide", "The Information Regulator's guide"],
  ["available", "Records available without a request"],
  ["legislation", "Records kept under other laws"],
  ["records", "Records we hold"],
  ["processing", "How we process personal information"],
  ["request", "How to request a record"],
  ["fees", "Fees"],
  ["refusal", "Grounds for refusal"],
  ["remedies", "If you are not satisfied"],
  ["availability", "Where this manual is available"],
] as const;

export default function PaiaManual() {
  const ld = [
    { "@context": "https://schema.org", "@type": "WebPage", name: "PAIA manual", url: `${SITE_URL}/paia`, dateModified: "2026-10-14", publisher: { "@id": `${SITE_URL}/#organization` } },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "PAIA manual", path: "/paia" }]),
  ];
  return (
    <div className="bg-white text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-[#f5f7f9] border-b border-[#dde2e8]">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <p className="text-sm text-[#5e6b7b]">Access to information</p>
          <h1 className="mt-3 text-[2.2rem] md:text-[3rem] font-bold leading-[1.08] tracking-[-0.02em]" style={serif}>PAIA manual</h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[#3d4a58]">
            Prepared under section 51 of the Promotion of Access to Information Act 2 of 2000 (PAIA), as amended by the Protection of Personal Information Act 4 of 2013 (POPIA). It explains which records AI Integrity Certification (Pty) Ltd holds and how to ask for them.
          </p>
          <p className="mt-4 text-sm text-[#5e6b7b]">Last updated {UPDATED}</p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-12 md:py-16 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="Contents" className="lg:sticky lg:top-28 self-start">
          <p className="text-sm font-semibold">Contents</p>
          <ol className="mt-3 space-y-1.5 text-[14px]">
            {SECTIONS.map(([id, t], i) => (
              <li key={id}><a href={`#${id}`} className="text-[#5e6b7b] hover:text-[#8a6114]">{i + 1}. {t}</a></li>
            ))}
          </ol>
        </nav>

        <article className="max-w-[68ch] text-[16.5px] leading-[1.75] text-[#2b3a4d] [&_p]:mt-4 [&_li]:mt-1.5">
          <H2 id="about" n={1}>About this manual</H2>
          <p>
            PAIA gives everyone the right to request access to records held by a private body where the record is required to exercise or protect a right. This manual sets out the records AI Integrity Certification (Pty) Ltd (&ldquo;AIC&rdquo;) holds, how to request them, what it costs, and what you can do if a request is refused. It also describes how AIC processes personal information, as section 51 requires since POPIA came into force.
          </p>

          <H2 id="company" n={2}>Company and Information Officer</H2>
          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-[#dde2e8] bg-[#f5f7f9] p-6 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
            <dt className="text-[#5e6b7b]">Company</dt><dd className="font-medium text-[#0e1b2c]">AI Integrity Certification (Pty) Ltd</dd>
            <dt className="text-[#5e6b7b]">Address</dt><dd className="font-medium text-[#0e1b2c]">15 Smit Street, Johannesburg, Gauteng, 2000, South Africa</dd>
            <dt className="text-[#5e6b7b]">Website</dt><dd className="font-medium text-[#0e1b2c]">aiccertified.cloud</dd>
            <dt className="text-[#5e6b7b]">Information Officer</dt><dd className="font-medium text-[#0e1b2c]">Zander Wilken, Chief Executive Officer</dd>
            <dt className="text-[#5e6b7b]">Deputy Information Officer</dt><dd className="font-medium text-[#0e1b2c]">Albert von Ronge, Chief Financial and Operating Officer</dd>
            <dt className="text-[#5e6b7b]">Email for requests</dt><dd><a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-[#8a6114] underline underline-offset-2">{CONTACT_EMAIL}</a></dd>
          </dl>

          <H2 id="guide" n={3}>The Information Regulator&apos;s guide</H2>
          <p>
            The Information Regulator publishes a guide, under section 10 of PAIA, on how to use the Act to exercise your rights. It is available from the Information Regulator&apos;s website, <a href="https://inforegulator.org.za" className="text-[#8a6114] underline underline-offset-2">inforegulator.org.za</a>, and a copy can be inspected at AIC&apos;s address during office hours on request.
          </p>

          <H2 id="available" n={4}>Records available without a request</H2>
          <p>The following are available on this website, free of charge, without a formal request:</p>
          <ul className="list-disc pl-5">
            <li>The <Link href="/standard" className="text-[#8a6114] underline underline-offset-2">AIC standard</Link> and its requirements</li>
            <li>The <Link href="/registry" className="text-[#8a6114] underline underline-offset-2">public register</Link> of certified organisations, and certificate and badge verification</li>
            <li>The <Link href="/privacy" className="text-[#8a6114] underline underline-offset-2">privacy policy</Link>, <Link href="/terms" className="text-[#8a6114] underline underline-offset-2">terms of use</Link>, <Link href="/impartiality" className="text-[#8a6114] underline underline-offset-2">impartiality statement</Link> and <Link href="/disclosures" className="text-[#8a6114] underline underline-offset-2">disclosures</Link>, including accreditation status</li>
            <li>This manual</li>
          </ul>

          <H2 id="legislation" n={5}>Records kept under other laws</H2>
          <p>AIC keeps records as required by, among others, the following laws, where they apply to it:</p>
          <ul className="list-disc pl-5">
            <li>Companies Act 71 of 2008</li>
            <li>Income Tax Act 58 of 1962 and Tax Administration Act 28 of 2011</li>
            <li>Value-Added Tax Act 89 of 1991</li>
            <li>Basic Conditions of Employment Act 75 of 1997 and Labour Relations Act 66 of 1995</li>
            <li>Unemployment Insurance Act 63 of 2001 and Skills Development Levies Act 9 of 1999</li>
            <li>Protection of Personal Information Act 4 of 2013</li>
            <li>Electronic Communications and Transactions Act 25 of 2002</li>
          </ul>

          <H2 id="records" n={6}>Records we hold</H2>
          <dl className="mt-5 space-y-4">
            {[
              ["Company records", "Incorporation documents, the share register, minutes and resolutions, and statutory returns."],
              ["Financial records", "Accounting records, invoices, banking records, tax records and financial statements."],
              ["Client records", "Agreements, correspondence, onboarding information and the records of each client's use of the AIC platform."],
              ["Assessment records", "Evidence submitted for assessment, assessors' working papers, findings, decisions, certificates and appeals."],
              ["The public register", "Certification status, certificate numbers and validity dates of certified organisations."],
              ["Platform and security records", "System logs, access records, the hash-chained audit log and security incident records."],
              ["Supplier and partner records", "Agreements, data processing agreements and correspondence with suppliers and partners."],
              ["Personnel records", "Employment and contractor agreements, payroll and records of training, where applicable."],
              ["Website and enquiry records", "Contact form submissions, newsletter subscriptions and, if you allowed it, analytics data."],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold text-[#0e1b2c]">{k}</dt>
                <dd className="mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>

          <H2 id="processing" n={7}>How we process personal information</H2>
          <p><strong className="text-[#0e1b2c]">Purposes.</strong> To assess and certify organisations against the AIC standard, to provide the AIC platform, to maintain the public register and verification service, to answer enquiries, to meet legal and regulatory duties, and to run the business.</p>
          <p><strong className="text-[#0e1b2c]">Who and what.</strong> Accountable persons and certification contacts at client organisations (names, job titles, professional credentials, work contact details); people named in evidence clients submit for assessment; practitioner candidates (education, examination and competency records); website visitors and people who contact us; suppliers, partners and personnel. The full categories are listed in the <Link href="/privacy" className="text-[#8a6114] underline underline-offset-2">privacy policy</Link>. AIC does not seek to collect special personal information.</p>
          <p><strong className="text-[#0e1b2c]">Recipients.</strong> Independent assessors assigned to an assessment; infrastructure and analytics providers under data processing agreements; an accreditation body, if AIC becomes accredited; and authorities where the law requires it. AIC does not sell personal information.</p>
          <p><strong className="text-[#0e1b2c]">Information sent outside South Africa.</strong> Some of AIC&apos;s cloud and analytics providers process information on infrastructure outside South Africa. Where they do, AIC relies on the safeguards section 72 of POPIA allows, such as binding agreements that give protection substantially similar to POPIA.</p>
          <p><strong className="text-[#0e1b2c]">Security.</strong> Encryption of data in transit and of stored credentials, separation of each client&apos;s data, role-based access with multi-factor authentication, and a tamper-evident audit log. More is set out on the <Link href="/security" className="text-[#8a6114] underline underline-offset-2">security page</Link>.</p>

          <H2 id="request" n={8}>How to request a record</H2>
          <ol className="list-decimal pl-5">
            <li>Complete Form 2, the request for access to a record, prescribed by the Regulations relating to the Promotion of Access to Information, 2021. It is available from the Information Regulator&apos;s website or from AIC on request.</li>
            <li>Send it to the Information Officer at <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#8a6114] underline underline-offset-2">{CONTACT_EMAIL}</a> or by hand to AIC&apos;s address, with proof of identity.</li>
            <li>Describe the record clearly enough to identify it, say how you want access (a copy, inspection, or electronic form), and identify the right you want to exercise or protect and why the record is needed for it.</li>
            <li>If you are requesting on behalf of someone else, include proof of the capacity in which you do so.</li>
            <li>Pay the request fee (section 9). AIC will tell you if an access fee or deposit applies before it does the work.</li>
          </ol>
          <p>AIC will decide on a request within 30 days of receiving it, and may extend that once by up to 30 days in the circumstances section 57 of PAIA allows, telling you why. To ask for your own personal information, or to correct it, you can also use the process in the <Link href="/privacy" className="text-[#8a6114] underline underline-offset-2">privacy policy</Link>.</p>

          <H2 id="fees" n={9}>Fees</H2>
          <p>The fees are those the Information Regulator prescribes for private bodies:</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#dde2e8]">
            <table className="w-full text-[15px]">
              <tbody className="divide-y divide-[#eef1f5]">
                {[
                  ["Request fee, payable by every requester", "R140.00"],
                  ["Photocopy or printed copy, per A4 page", "R2.00"],
                  ["Copy on a flash drive or CD you provide", "R40.00"],
                  ["Copy on a CD provided by AIC", "R60.00"],
                  ["Transcription of an audio record, per A4 page", "R24.00"],
                  ["Search and preparation, per hour after the first hour", "R145.00, to a maximum of R435.00"],
                ].map(([k, v]) => (
                  <tr key={k}><td className="px-4 py-3">{k}</td><td className="px-4 py-3 font-semibold text-[#0e1b2c] whitespace-nowrap">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>If the search and preparation is expected to take more than six hours, AIC may ask for a deposit of one third of the access fee. A requester asking only for their own personal information pays no request fee.</p>

          <H2 id="refusal" n={10}>Grounds for refusal</H2>
          <p>AIC may, and in some cases must, refuse access on the grounds set out in Chapter 4 of Part 3 of PAIA. These include protecting the privacy of a third party who is a natural person; a third party&apos;s commercial information or information supplied in confidence, which covers evidence clients submit for assessment; the safety of individuals and property; records privileged from production in legal proceedings; and AIC&apos;s own commercial information, research or confidential information. Where part of a record can be released, AIC will release that part.</p>

          <H2 id="remedies" n={11}>If you are not satisfied</H2>
          <p>
            AIC has no internal appeal procedure under PAIA. If a request is refused, or you disagree with a fee or an extension, you may, within 180 days, complain to the Information Regulator or apply to a court.
          </p>
          <p>
            Information Regulator: Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191. Email <a href="mailto:enquiries@inforegulator.org.za" className="text-[#8a6114] underline underline-offset-2">enquiries@inforegulator.org.za</a>. Telephone 010 023 5200. Website <a href="https://inforegulator.org.za" className="text-[#8a6114] underline underline-offset-2">inforegulator.org.za</a>.
          </p>

          <H2 id="availability" n={12}>Where this manual is available</H2>
          <p>This manual is published on this website and a copy can be inspected at AIC&apos;s address during office hours. AIC reviews it at least once a year, and whenever its records, systems or Information Officer change.</p>
        </article>
      </div>
    </div>
  );
}
