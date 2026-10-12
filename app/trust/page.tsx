import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { SECTIONS } from "@/app/data/security";

export const metadata: Metadata = pageMetadata({
  path: "/trust",
  title: "Trust centre: security, privacy and independence",
  description: "How AIC protects your data, keeps organisations apart, stays independent of what it certifies, and where its accreditation stands, in one place.",
  cardKicker: "Trust centre",
});

const PLATFORM = process.env["NEXT_PUBLIC_PLATFORM_URL"] || "https://app.aiccertified.cloud";

/**
 * AIC's own trust centre. A certification body asking clients for evidence
 * should publish its own. Everything here is a link to the page that states
 * it in full, or an item from /security, so nothing is claimed twice in two
 * different ways.
 */
export default function TrustPage() {
  const glance = SECTIONS.flatMap((s) => s.items.slice(0, 1).map((i) => ({ area: s.title, item: i })));
  const DOCS = [
    { title: "Security", text: "Encryption, separation between organisations, who at AIC can see what, backups, and reporting a vulnerability.", href: "/security" },
    { title: "Privacy notice", text: "What personal information AIC holds, why, for how long, who else processes it, and your rights under POPIA.", href: "/privacy" },
    { title: "Impartiality", text: "How AIC keeps certification independent of the platform, of partners and of commercial pressure.", href: "/impartiality" },
    { title: "Governance and disclosures", text: "Methodology, appeals and accreditation status, stated plainly.", href: "/disclosures" },
    { title: "Terms", text: "The terms for using the website and the platform.", href: "/terms" },
    { title: "The standard", text: "Every requirement AIC assesses against, published in full.", href: "/standard" },
  ];
  const ld = [
    { "@context": "https://schema.org", "@type": "WebPage", name: "AIC trust centre", url: `${SITE_URL}/trust`, about: { "@id": `${SITE_URL}/#organization` } },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Trust centre", path: "/trust" }]),
  ];
  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4">Trust centre</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>We ask for evidence, so we publish ours</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">How AIC protects the information you give it, keeps organisations apart, stays independent of what it certifies, and where its own accreditation stands.</p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[1.9rem] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>At a glance</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {glance.map((g) => (
            <li key={g.area} className="rounded-xl border border-[#dde2e8] bg-white p-5">
              <p className="text-sm font-semibold text-[#8a6114]">{g.area}</p>
              <p className="mt-1.5 text-[16px] leading-relaxed text-[#2b3a4d]">{g.item}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[15px]"><Link href="/security" className="font-semibold text-[#8a6114] hover:underline">Read the full security page</Link></p>
      </section>

      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
          <div>
            <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Accreditation, stated plainly</h2>
          </div>
          <div className="text-[17px] leading-[1.75] text-[#2b3a4d] space-y-4 max-w-[66ch]">
            <p>AIC is not yet accredited. Our disclosures page says exactly what that means for a certificate AIC issues today, and what it does not mean.</p>
            <Link href="/disclosures#accreditation" className="inline-block text-[15px] font-semibold text-[#8a6114] hover:underline">Accreditation status</Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[1.9rem] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Documents</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DOCS.map((d) => (
            <li key={d.href}><Link href={d.href} className="block h-full rounded-xl border border-[#dde2e8] bg-white p-5 hover:border-[#a8772a] transition-colors">
              <h3 className="text-lg font-bold">{d.title}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-[#5e6b7b]">{d.text}</p>
            </Link></li>
          ))}
        </ul>
        <h2 className="mt-14 text-2xl md:text-[1.9rem] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Check something you were given</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          <li><Link href="/verify" className="block h-full rounded-xl border border-[#dde2e8] bg-white p-5 hover:border-[#a8772a] transition-colors"><h3 className="text-lg font-bold">A certificate</h3><p className="mt-1.5 text-[15px] text-[#5e6b7b]">Confirm a certificate is genuine and current.</p></Link></li>
          <li><a href={`${PLATFORM}/verify-pack`} className="block h-full rounded-xl border border-[#dde2e8] bg-white p-5 hover:border-[#a8772a] transition-colors"><h3 className="text-lg font-bold">An evidence pack</h3><p className="mt-1.5 text-[15px] text-[#5e6b7b]">Check a pack was issued by AIC and has not been changed. The file stays on your computer.</p></a></li>
        </ul>
      </section>
    </div>
  );
}
