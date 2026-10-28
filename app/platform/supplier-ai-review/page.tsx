import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { CAPABILITY_BY_SLUG } from "@/app/data/capabilities";
import { PLATFORM_URL } from "@/app/data/platform-data";

const c = CAPABILITY_BY_SLUG["supplier-ai-review"];

export const metadata: Metadata = pageMetadata({
  path: "/platform/supplier-ai-review",
  title: "Third-party and supplier AI risk management",
  description: "Find the suppliers whose AI decides for you, ask them about it in writing, read their documents, flag POPIA gaps and review each supplier on a cycle set by how much rides on it.",
  cardTitle: "Supplier AI review",
  cardKicker: "The AIC platform",
});

const serif = { fontFamily: "'Merriweather', serif" } as const;

/** The supplier lifecycle, in the order the platform works through it. Describe only what the platform does today. */
const STEPS = [
  { title: "Discover", text: "Suppliers AIC can already see from your connected systems, such as the AI providers your models call, are suggested for the register so nothing you use is left off." },
  { title: "Register", text: "Record what each supplier does for you, the data it holds, whether that data leaves South Africa, whether a data processing agreement is signed, who owns the relationship and how critical the supplier is." },
  { title: "Ask the supplier", text: "Send five questions about its AI to the person at the supplier who knows. They answer through a secure link with no account. Nothing changes on your record until you read the answers and choose to apply them." },
  { title: "Read their documents", text: "Upload a SOC 2 report, ISO 27001 certificate, penetration test summary or data processing agreement. AIC reads it and lists what it found for a person on your side to check." },
  { title: "Flag the gaps", text: "Answers and records that leave you exposed are raised in plain words: personal information without a written agreement, data leaving South Africa unprotected, or AI you cannot override or explain." },
  { title: "Review on a cycle", text: "Each review is recorded as approved, approved with conditions or not approved, and the next one is scheduled from how much rides on the supplier." },
];

const QUESTIONS = [
  "Do you train your models on our data?",
  "Can we override an individual decision your AI makes?",
  "Can you explain an individual decision to the person it affected?",
  "Have you tested for unfair outcomes in the last year?",
  "Will you tell us before the model changes?",
];

const FLAGS = [
  { rule: "Personal information held with no written data processing agreement", law: "POPIA section 21" },
  { rule: "Personal information leaving South Africa without an agreement that protects it", law: "POPIA section 72" },
  { rule: "Special personal information held by a supplier rated low criticality", law: "POPIA sections 26 to 33" },
  { rule: "A supplier's AI decides about people, but you cannot override or explain the decision", law: "POPIA section 71" },
];

const CADENCE = [
  { level: "High", months: 12, example: "Hosts a scoring model or holds special personal information" },
  { level: "Medium", months: 24, example: "Processes personal information as part of a service" },
  { level: "Low", months: 36, example: "Holds little or no personal information" },
];

const FAQS = [
  {
    q: "Which suppliers should be on the register?",
    a: "Start with the AI providers your models call, your cloud host and your payroll provider: anyone who holds personal information for you or runs part of a decision about a person. POPIA section 21 expects a written agreement with each of them.",
  },
  {
    q: "Does the supplier need an AIC account?",
    a: "No. They answer through a link that lasts 30 days. The link is stored only as a fingerprint, and their answers are kept exactly as given until someone in your organisation applies them.",
  },
  {
    q: "Does AIC decide whether a supplier is safe?",
    a: "No. AIC reads documents and raises concerns, and a person in your organisation decides. The outcome and its date are recorded against the supplier.",
  },
  {
    q: "Can I share supplier reviews with an assessor or insurer?",
    a: "Yes. Suppliers and their flags are part of the evidence pack, alongside your AI register, risks, checks and decision records.",
  },
  {
    q: "Does using it make AIC certification more likely?",
    a: "No. The platform is a tool. Using it neither raises nor lowers the chance of certification, which is decided only against the published AIC standard.",
  },
];

/**
 * The supplier AI review page, laid out like the strongest third-party risk
 * pages in the category: the promise, the lifecycle step by step, what gets
 * flagged and why, the review cycle, then questions.
 */
export default function SupplierAiReviewPage() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "AIC platform: Supplier AI review",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: c?.description,
      url: `${SITE_URL}/platform/supplier-ai-review`,
      featureList: STEPS.map((s) => s.title),
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "The platform", path: "/platform" }, { name: "Supplier AI review", path: "/platform/supplier-ai-review" }]),
  ];

  return (
    <div className="bg-white text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="bg-aic-navy text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4"><Link href="/platform" className="hover:text-white">The platform</Link> / Supplier AI review</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={serif}>Third-party AI risk, answered in writing</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">
              Most AI that decides about your customers and staff is bought in: the CV screener, the credit score, the fraud model inside the payment processor. You still answer for those decisions. Find your suppliers, ask them how their AI behaves, read their documents and review each one on a cycle.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/contact?topic=platform" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-semibold text-[#0e1b2c] hover:bg-white/90 transition-colors">
                Book a walk-through
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9920a] text-white transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-4 w-4" /></span>
              </Link>
              <a href={`${PLATFORM_URL}/signup`} className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-[15px] font-semibold text-white hover:border-white transition-colors">
                Register your organisation
              </a>
            </div>
          </div>
        </div>
      </section>

      {c && (
        <section className="bg-[#0a1628] text-white">
          <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-10">
            <p className="text-center text-sm text-white/60">Built to answer to</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
              {c.answersTo.map((a) => (
                <li key={a} className="rounded-full border border-white/20 px-4 py-1.5 text-[14px] text-white/85">{a.split(":")[0].trim()}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <h2 className="text-2xl md:text-[2.1rem] font-bold" style={serif}>From discovery to review, in one place</h2>
          <p className="mt-3 max-w-3xl text-[16.5px] leading-relaxed text-[#3d4a58]">Six steps replace the spreadsheet, the email chain and the folder of PDFs nobody reopens.</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-[#dde2e8] bg-white p-6">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0e1b2c] text-[14px] font-bold text-white" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-[#2b3a4d]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl md:text-[1.9rem] font-bold" style={serif}>Five questions about their AI</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[#3d4a58]">Sent to the supplier with a link. Each answer is kept exactly as given, with who gave it and when.</p>
          <ol className="mt-6 space-y-3">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="flex gap-3 rounded-lg border border-[#dde2e8] bg-white p-4 text-[16px]">
                <span className="font-bold text-[#a8772a]">{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-2xl md:text-[1.9rem] font-bold" style={serif}>What gets flagged</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[#3d4a58]">Raised in plain words, with the law it touches, for a person to resolve.</p>
          <ul className="mt-6 space-y-3">
            {FLAGS.map((f) => (
              <li key={f.rule} className="rounded-lg border border-[#dde2e8] bg-white p-4">
                <p className="text-[16px]">{f.rule}</p>
                <p className="mt-1 text-[14px] font-medium text-[#8a6114]">{f.law}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <h2 className="text-2xl md:text-[1.9rem] font-bold" style={serif}>Reviewed as often as the risk demands</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#3d4a58]">The next review date follows from how critical the supplier is. A supplier past its date shows as review due.</p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-[#dde2e8] bg-white">
            <table className="w-full min-w-[520px] text-left text-[15.5px]">
              <thead className="text-[13.5px] text-[#5e6b7b]">
                <tr className="border-b border-[#dde2e8]">
                  <th scope="col" className="px-5 py-3 font-semibold">Criticality</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Reviewed every</th>
                  <th scope="col" className="px-5 py-3 font-semibold">For example</th>
                </tr>
              </thead>
              <tbody>
                {CADENCE.map((r) => (
                  <tr key={r.level} className="border-b border-[#eef1f5] last:border-0">
                    <td className="px-5 py-3.5 font-semibold">{r.level}</td>
                    <td className="px-5 py-3.5">{r.months} months</td>
                    <td className="px-5 py-3.5 text-[#3d4a58]">{r.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-5 md:px-8 py-14 md:py-20">
        <h2 className="text-2xl md:text-[1.9rem] font-bold" style={serif}>Questions</h2>
        <div className="mt-6 divide-y divide-[#dde2e8] border-y border-[#dde2e8]">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none text-[17px] font-semibold marker:hidden">{f.q}</summary>
              <p className="mt-2 text-[16px] leading-relaxed text-[#3d4a58]">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/platform/risk-management" className="rounded-xl border border-[#dde2e8] p-5 hover:border-[#a8772a] transition-colors sm:flex-1">
            <h3 className="font-bold">Risk management</h3>
            <p className="mt-1 text-[15px] text-[#5e6b7b]">Supplier concerns sit beside the rest of your risks.</p>
          </Link>
          <Link href="/platform/evidence-packs" className="rounded-xl border border-[#dde2e8] p-5 hover:border-[#a8772a] transition-colors sm:flex-1">
            <h3 className="font-bold">Evidence packs</h3>
            <p className="mt-1 text-[15px] text-[#5e6b7b]">Share supplier reviews with an assessor or insurer.</p>
          </Link>
          <Link href="/integrations" className="rounded-xl border border-[#dde2e8] p-5 hover:border-[#a8772a] transition-colors sm:flex-1">
            <h3 className="font-bold">Integrations</h3>
            <p className="mt-1 text-[15px] text-[#5e6b7b]">Where discovered suppliers come from.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
