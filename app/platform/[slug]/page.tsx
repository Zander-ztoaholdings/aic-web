import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { CAPABILITIES, CAPABILITY_BY_SLUG } from "@/app/data/capabilities";

export const dynamicParams = false;

export function generateStaticParams() {
  return CAPABILITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CAPABILITY_BY_SLUG[slug];
  if (!c) return {};
  return pageMetadata({ path: `/platform/${slug}`, title: c.seoTitle, description: c.description, cardTitle: c.name, cardKicker: "The AIC platform" });
}

const relatedHref = (s: string) => (s === "integrations" ? "/integrations" : `/platform/${s}`);
const relatedName = (s: string) => (s === "integrations" ? "Integrations" : CAPABILITY_BY_SLUG[s]?.name ?? s);

/** One page per platform capability: what it does, and what it answers to. */
export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CAPABILITY_BY_SLUG[slug];
  if (!c) notFound();

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `AIC platform: ${c.name}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: c.description,
      url: `${SITE_URL}/platform/${slug}`,
      featureList: c.points.map((p) => p.title),
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "The platform", path: "/platform" }, { name: c.name, path: `/platform/${slug}` }]),
  ];

  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <Link href="/platform" className="hover:text-white">The platform</Link> / {c.name}
          </nav>
          <div className="max-w-3xl mt-5">
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>{c.name}</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">{c.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/intake" className="inline-flex items-center rounded-lg bg-[#c9920a] px-6 py-3 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">Join the November intake</Link>
              <Link href="/contact?topic=platform" className="inline-flex items-center rounded-lg border border-white/25 px-6 py-3 text-[15px] font-semibold text-white hover:bg-white/10 transition-colors">Ask for a walk-through</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>What it does</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {c.points.map((p) => (
            <li key={p.title} className="rounded-xl border border-[#dde2e8] bg-white p-6">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#2b3a4d]">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>What it answers to</h2>
          <div>
            <ul className="space-y-3 text-[17px] leading-relaxed text-[#2b3a4d]">
              {c.answersTo.map((a) => <li key={a} className="border-l-[3px] border-[#a8772a] pl-4">{a}</li>)}
            </ul>
            <p className="mt-6 text-sm text-[#5e6b7b] leading-relaxed">
              The platform is a tool. Using it neither raises nor lowers the chance of AIC certification, which is decided only against the{" "}
              <Link href="/standard" className="text-[#8a6114] underline underline-offset-2">published standard</Link>. See{" "}
              <Link href="/impartiality" className="text-[#8a6114] underline underline-offset-2">impartiality</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Works with</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {c.related.map((r) => (
            <li key={r}><Link href={relatedHref(r)} className="block rounded-xl border border-[#dde2e8] bg-white p-5 font-semibold hover:border-[#a8772a] transition-colors">{relatedName(r)}</Link></li>
          ))}
        </ul>
        <p className="mt-8 text-[15px] text-[#5e6b7b]"><Link href="/platform" className="font-semibold text-[#8a6114] hover:underline">See everything the platform does</Link></p>
      </section>
    </div>
  );
}
