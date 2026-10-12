import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { SOLUTIONS, SOLUTION_BY_SLUG } from "@/app/data/solutions";

export const dynamicParams = false;
export function generateStaticParams() { return SOLUTIONS.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SOLUTION_BY_SLUG[slug];
  return s ? pageMetadata({ path: `/solutions/${slug}`, title: s.seoTitle, description: s.description, cardTitle: s.h1, cardKicker: s.name }) : {};
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SOLUTION_BY_SLUG[slug];
  if (!s) notFound();
  const ld = [
    { "@context": "https://schema.org", "@type": "WebPage", name: s.h1, description: s.description, url: `${SITE_URL}/solutions/${slug}`, about: s.name, publisher: { "@id": `${SITE_URL}/#organization` } },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: s.name, path: `/solutions/${slug}` }]),
  ];
  return (
    <div className="bg-[#f5f7f9] min-h-screen text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-aic-navy text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 mb-4">{s.name}</p>
            <h1 className="text-[2.2rem] md:text-[3.25rem] font-bold leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: "'Merriweather', serif" }}>{s.h1}</h1>
            <p className="text-lg text-white/75 leading-[1.7] mt-5">{s.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/aware" className="inline-flex items-center rounded-lg bg-[#c9920a] px-6 py-3 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">Check where you stand, free</Link>
              <Link href="/contact?topic=platform" className="inline-flex items-center rounded-lg border border-white/25 px-6 py-3 text-[15px] font-semibold text-white hover:bg-white/10 transition-colors">Ask for a walk-through</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
        <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Decisions AI makes here</h2>
        <ul className="grid gap-3 sm:grid-cols-2">{s.decisions.map((d) => <li key={d} className="rounded-xl border border-[#dde2e8] bg-white p-4 text-[16px]">{d}</li>)}</ul>
      </section>
      <section className="bg-white border-y border-[#dde2e8]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-14">
          <h2 className="text-2xl md:text-[1.9rem] font-bold leading-[1.15]" style={{ fontFamily: "'Merriweather', serif" }}>Rules that already apply</h2>
          <div className="space-y-6">
            {s.rules.map((r) => (
              <div key={r.name} className="border-l-[3px] border-[#a8772a] pl-4">
                <h3 className="text-lg font-bold">{r.name}</h3>
                <p className="mt-1 text-[16.5px] leading-relaxed text-[#2b3a4d]">{r.text}</p>
                {r.href && <Link href={r.href} className="mt-1 inline-block text-[15px] font-semibold text-[#8a6114] hover:underline">Read more</Link>}
              </div>
            ))}
            <p className="text-sm text-[#5e6b7b]">A summary, not legal advice about your organisation.</p>
          </div>
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[1.9rem] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>What the platform gives you</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {s.platform.map((p) => (
            <li key={p.title}><Link href={p.href} className="block h-full rounded-xl border border-[#dde2e8] bg-white p-6 hover:border-[#a8772a] transition-colors">
              <h3 className="text-lg font-bold">{p.title}</h3><p className="mt-2 text-[16px] leading-relaxed text-[#5e6b7b]">{p.text}</p>
            </Link></li>
          ))}
        </ul>
        {s.extra && (
          <div className="mt-10 rounded-xl bg-aic-navy text-white p-7 md:p-9">
            <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>{s.extra.title}</h2>
            <p className="mt-3 text-white/75 leading-relaxed max-w-2xl">{s.extra.text}</p>
            <Link href={s.extra.href} className="mt-6 inline-flex items-center rounded-lg bg-[#c9920a] px-5 py-2.5 text-[15px] font-semibold text-[#0e1b2c] hover:bg-[#dcae4c] transition-colors">{s.extra.label}</Link>
          </div>
        )}
      </section>
    </div>
  );
}
