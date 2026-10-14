import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/partners",
  title: "Partner programme for AI accountability",
  description: "How law firms, privacy consultants, auditors, HR and AI technology companies and insurers partner with AIC, and the independence rules every partner keeps.",
  cardKicker: "Partners",
});

const KINDS = [
  { title: "Advisers who introduce clients", who: "POPIA and privacy law firms, data protection consultants, ISO and governance auditors.", how: "You introduce organisations that need to show who answers for their automated decisions. We pay an introduction fee on clients who sign for the platform. You keep advising your client; we never do." },
  { title: "Technology companies", who: "HR and recruitment platforms, credit and fraud models, AI vendors whose products decide about people.", how: "Help your customers stay accountable for the decisions your product makes: answer their supplier AI questions once, connect to the platform, and show what your product lets them oversee." },
  { title: "Insurers and brokers", who: "Cyber, liability and specialist underwriters, and the brokers who place them.", how: "Read a client's record, with their permission, as evidence of whether a person really answers for its AI decisions.", href: "/insurers" },
];

const RULES = [
  "Partners never sell, price or influence AIC certification. Only AIC decides who is certified, and only against the published standard.",
  "Partnering with AIC does not certify the partner, its products or its clients.",
  "An introduction fee is paid for platform clients only, never for a certification outcome.",
  "AIC does not consult on the systems it certifies, and does not refer clients to a partner for work on systems AIC is assessing.",
];

export default function PartnersPage() {
  const ld = [
    { "@context": "https://schema.org", "@type": "WebPage", name: "AIC partner programme", url: `${SITE_URL}/partners`, publisher: { "@id": `${SITE_URL}/#organization` } },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Partners", path: "/partners" }]),
  ];
  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4">Partners</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>Partner with AIC, on terms that keep certification independent</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">Your clients are being asked who answers for their automated decisions. We help them answer it with evidence. Here is how we work together, and the rules that do not bend.</p>
            <Link href="/contact?topic=partnership" className="mt-8 inline-flex items-center rounded-lg bg-[#c9920a] px-6 py-3 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">Talk to us about partnering</Link>
          </div>
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <ul className="grid gap-5 lg:grid-cols-3">
          {KINDS.map((k) => (
            <li key={k.title} className="flex flex-col rounded-xl border border-[#dde2e8] bg-white p-6">
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>{k.title}</h2>
              <p className="mt-3 text-[15px] text-[#5e6b7b]">{k.who}</p>
              <p className="mt-3 text-[16px] leading-relaxed text-[#2b3a4d]">{k.how}</p>
              {k.href && <Link href={k.href} className="mt-auto pt-4 text-[15px] font-semibold text-[#8a6114] hover:underline">How it works for insurers</Link>}
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Rules every partner keeps</h2>
          <div>
            <ol className="list-decimal pl-5 space-y-3 text-[17px] leading-relaxed text-[#2b3a4d]">{RULES.map((r) => <li key={r}>{r}</li>)}</ol>
            <p className="mt-6 text-sm text-[#5e6b7b]">They follow from our <Link href="/impartiality" className="text-[#8a6114] underline underline-offset-2">impartiality commitments</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
