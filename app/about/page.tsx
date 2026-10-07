import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About AIC: who we are and why we exist",
  description: "AI Integrity Certification is an independent certification body for AI accountability, founded in Johannesburg in 2026. Who runs it, why it exists and where it stands.",
  cardTitle: "Who is behind AI Integrity Certification",
  cardKicker: "About AIC",
});

/**
 * /about, October 2026. LinkedIn visitors arrive asking who is behind this,
 * and the site had no answer. Everything here is either a fact about AIC or
 * a fact the founders gave; where something is not true yet (accreditation,
 * a certified client) the page says so rather than leaving the reader to
 * infer it.
 */

const PEOPLE = [
  {
    name: "Zander Wilken",
    role: "Co-founder and Chief Executive",
    photo: "/team/zander-wilken.jpg",
    bio: "Zander leads AIC and builds it: the standard, the certification workflow and the platform clients use. He works across engineering, strategy and sales, and is also Chief Operating Officer of Seventh Star Tuition in Centurion.",
  },
  {
    name: "Albert von Ronge",
    role: "Co-founder, Chief Financial and Operating Officer",
    photo: null,
    bio: "Albert is AIC's co-founder and its seed investor, responsible for its finances and operations.",
  },
];

export default function AboutPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/about`,
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: PEOPLE.map((p) => ({ "@type": "Person", name: p.name, jobTitle: p.role, worksFor: { "@id": `${SITE_URL}/#organization` } })),
  };

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
          <p className="text-sm text-white/60 mb-4">About AIC</p>
          <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>
            Someone should answer for the decision
          </h1>
          <p className="text-lg text-white/75 leading-[1.7] mt-5">
            AI Integrity Certification is an independent certification body for AI accountability,
            founded in Johannesburg in 2026. We certify that a named person remains accountable for
            the automated decisions that matter, and we publish the result so anyone can check it.
          </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
        <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Why AIC exists</h2>
        <div className="text-[#2b3a4d] text-[17px] leading-[1.75] max-w-[66ch] space-y-4">
          <p>
            More and more of the decisions that shape people&apos;s lives, who gets credit, a job, a
            claim paid, are made or shaped by systems nobody in the organisation can fully explain.
            South African law already says a person may not be subject to a decision based solely on
            automated processing without safeguards, and that they may ask how it was reached. Very
            few organisations can show who answers for those decisions.
          </p>
          <p>
            AIC exists to make that answerable. We publish a standard of 44 requirements, assess
            organisations against it, and keep a public register anyone can check without asking the
            organisation itself.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15] mb-8" style={{ fontFamily: "'Merriweather', serif" }}>The people</h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {PEOPLE.map((p) => (
              <article key={p.name} className="grid grid-cols-[7.5rem_minmax(0,1fr)] sm:grid-cols-[9rem_minmax(0,1fr)] gap-5 sm:gap-6 items-start">
                {p.photo ? (
                  <Image src={p.photo} alt={`Portrait of ${p.name}`} width={288} height={288} className="aspect-square w-full rounded-2xl object-cover" />
                ) : (
                  <div aria-hidden="true" className="aspect-square w-full rounded-2xl bg-[#eef1f5] border border-[#dde2e8] flex items-center justify-center text-3xl font-bold text-[#5e6b7b]" style={{ fontFamily: "'Merriweather', serif" }}>
                    {p.name.split(" ").map((w) => w[0]).filter((c) => c === c.toUpperCase()).join("")}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="text-[#5e6b7b] text-[15px] mt-0.5">{p.role}</p>
                  <p className="text-[#2b3a4d] text-[15px] leading-[1.7] mt-3">{p.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
        <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Where we stand</h2>
        <div className="text-[#2b3a4d] text-[17px] leading-[1.75] max-w-[66ch] space-y-4">
          <p>
            AIC is young, and we would rather you heard it from us. No accreditation body has
            assessed AIC yet: accreditation needs witnessed audits of real clients, and those begin
            with the founding cohort in November. No organisation has been certified, so the public
            register is empty and says so.
          </p>
          <p>
            What is in place is published: the standard in full, our impartiality arrangements, and
            the line we keep between the tools we offer and the audit we perform.
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
            <Link href="/standard" className="text-[#8a6114] underline-offset-2 hover:underline">The standard</Link>
            <Link href="/impartiality" className="text-[#8a6114] underline-offset-2 hover:underline">Impartiality statement</Link>
            <Link href="/disclosures#accreditation" className="text-[#8a6114] underline-offset-2 hover:underline">Accreditation status</Link>
            <Link href="/intake" className="text-[#8a6114] underline-offset-2 hover:underline">The November intake</Link>
          </p>
        </div>
      </section>

      <section className="bg-white border-t border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 text-sm text-[#5e6b7b] leading-[1.7]">
          AI Integrity Certification (Pty) Ltd, 15 Smit Street, Johannesburg, Gauteng, 2000, South Africa.{" "}
          <a href="https://www.linkedin.com/company/ai-integrity-certification/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">
            AIC on LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
