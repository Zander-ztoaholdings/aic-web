import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About AIC: who we are and why we exist",
  description: "An independent certification body for AI accountability, founded in Johannesburg in 2026: who runs it, why it exists and where it stands.",
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
    role: "Co-founder and Chief Executive Officer",
    photo: "/team/zander-wilken.jpg" as string | null,
    linkedin: "https://www.linkedin.com/in/zander-wilken-b81349323/",
    answersFor: ["The AIC standard and its development", "The AIC platform", "Client relationships", "Information Officer under POPIA and PAIA"],
    bio: "Driven, principled and commercially minded, Zander founded AIC on the conviction that when systems make decisions about people, people must remain accountable. He leads the company's strategy, client relationships and the development of the AIC platform, turning South Africa's POPIA requirements into a practical, verifiable standard for organisations that rely on algorithmic decision systems.",
  },
  {
    name: "Albert von Ronge",
    role: "Co-founder, Chief Financial and Operating Officer",
    // Shown once public/team/albert-von-ronge.jpg is added; initials until then.
    photo: existsSync(join(process.cwd(), "public/team/albert-von-ronge.jpg")) ? "/team/albert-von-ronge.jpg" : (null as string | null),
    linkedin: "https://www.linkedin.com/in/albert-von-r%C3%B6nge-15754528b",
    answersFor: ["Finance and the financial model", "Contracts and commercial agreements", "Operations, day to day"],
    bio: "Structured in his approach and with a sharp eye for detail, Albert oversees AIC's finance, operations and commercial agreements. As the founder of Ronge Dental Management, a practice management company built on HPCSA-compliant service agreements, he brings first-hand experience of working within a tightly regulated professional environment.",
  },
];

const serif = { fontFamily: "'Merriweather', serif" } as const;

/** How AIC itself is held to account, each with where to check it. */
const CHECKS = [
  { title: "A published standard", text: "Every requirement an organisation is assessed against is public, and anyone can challenge one.", href: "/standard", label: "Read the standard" },
  { title: "A public register", text: "Who holds a certificate, and whether it is valid, can be checked without asking the organisation.", href: "/registry", label: "Search the register" },
  { title: "Impartiality, in writing", text: "Tools on one side, assessment on the other, and the rules that keep them apart.", href: "/impartiality", label: "The impartiality statement" },
  { title: "What is not true yet", text: "AIC is not yet accredited and has certified no one yet. The disclosures say so, and say what is under way.", href: "/disclosures", label: "Our disclosures" },
];

export default function AboutPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/about`,
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: PEOPLE.map((p) => ({ "@type": "Person", name: p.name, jobTitle: p.role, image: p.photo ? `${SITE_URL}${p.photo}` : undefined, sameAs: [p.linkedin], worksFor: { "@id": `${SITE_URL}/#organization` } })),
  };

  return (
    <div className="bg-white text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 pt-14 md:pt-24 pb-16 md:pb-24 text-center">
          <p className="text-sm text-[#5e6b7b]">About AIC</p>
          <h1 className="mt-4 mx-auto max-w-3xl text-[2.3rem] md:text-[3.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance" style={serif}>
            Someone should answer for the decision
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-[17px] md:text-lg text-[#3d4a58] leading-[1.7] text-balance">
            AI Integrity Certification is an independent certification body for AI accountability, founded in Johannesburg in 2026. We certify that a named person remains accountable for the automated decisions that matter, and we publish the result so anyone can check it.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em]" style={serif}>Why AIC exists</h2>
          <div className="text-[#2b3a4d] text-[17px] leading-[1.8] max-w-[64ch] space-y-5">
            <p>
              More and more of the decisions that shape people&apos;s lives, who gets credit, a job, a claim paid, are made or shaped by systems nobody in the organisation can fully explain. South African law already says a person may not be subject to a decision based solely on automated processing without safeguards, and that they may ask how it was reached. Very few organisations can show who answers for those decisions.
            </p>
            <p>
              AIC exists to make that answerable. We publish a standard of 44 requirements, assess organisations against it, and keep a public register anyone can check without asking the organisation itself.
            </p>
          </div>
        </div>
      </section>

      {/* The founders, large, with what each of them answers for: AIC keeps to its own standard. */}
      <section className="bg-[#0a1628] text-white" aria-labelledby="founders">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 id="founders" className="text-center text-[1.75rem] md:text-[2.6rem] font-bold leading-[1.1] tracking-[-0.02em]" style={serif}>The founders</h2>
          <p className="mt-4 mx-auto max-w-xl text-center text-white/65 leading-[1.7]">We ask every organisation to name who answers for what. So here is who answers for what at AIC.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {PEOPLE.map((p) => (
              <article key={p.name} className="rounded-[28px] bg-white/[0.04] border border-white/10 p-5 sm:p-7">
                {/* Portraits are shown whole and at no more than their own resolution: a 640px
                    square at 168px is sharp on a retina screen, where the old full-width crop
                    was enlarged and cut off at the top and bottom. */}
                <div className="flex items-center gap-5 sm:gap-6">
                  <div className="relative h-32 w-32 sm:h-[168px] sm:w-[168px] shrink-0 overflow-hidden rounded-2xl bg-[#eef1f5]">
                    {p.photo ? (
                      <Image src={p.photo} alt={`Portrait of ${p.name}`} fill quality={90} sizes="168px" className="object-cover" />
                    ) : (
                      <div aria-hidden="true" className="absolute inset-0 grid place-items-center text-4xl font-bold text-[#5e6b7b]" style={serif}>
                        {p.name.split(" ").map((w) => w[0]).filter((c) => c === c.toUpperCase()).join("")}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[1.45rem] sm:text-[1.6rem] font-bold leading-tight" style={serif}>{p.name}</h3>
                    <p className="mt-1.5 text-[15px] text-[#e0b85c]">{p.role}</p>
                  </div>
                </div>
                <div className="pt-6 pb-1">
                  <p className="text-[15.5px] leading-[1.75] text-white/75">{p.bio}</p>
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-[13px] text-white/55">Answers for</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {p.answersFor.map((a) => <li key={a} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13.5px] text-white/90">{a}</li>)}
                    </ul>
                  </div>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold text-white hover:text-[#e0b85c] transition-colors">
                    {p.name.split(" ")[0]} on LinkedIn <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em] max-w-2xl" style={serif}>How AIC is held to account</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-[#3d4a58]">A certification body that asks to be trusted has already lost the argument. These are the things you can check about us without speaking to us.</p>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {CHECKS.map((c) => (
              <li key={c.title}>
                <Link href={c.href} className="group flex h-full flex-col rounded-2xl border border-[#dde2e8] bg-white p-6 md:p-7 hover:border-[#a8772a] hover:shadow-[0_20px_40px_-28px_rgba(10,22,40,0.4)] transition-all">
                  <h3 className="text-[19px] font-bold" style={serif}>{c.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.65] text-[#3d4a58]">{c.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8a6114]">
                    {c.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#dde2e8] bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-10 flex flex-col gap-3 text-sm text-[#5e6b7b] leading-[1.7] md:flex-row md:items-center md:justify-between">
          <p>AI Integrity Certification (Pty) Ltd, 15 Smit Street, Johannesburg, Gauteng, 2000, South Africa.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/paia" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">PAIA manual</Link>
            <Link href="/contact" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">Contact</Link>
            <a href="https://www.linkedin.com/company/ai-integrity-certification/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">AIC on LinkedIn</a>
          </p>
        </div>
      </section>
    </div>
  );
}
