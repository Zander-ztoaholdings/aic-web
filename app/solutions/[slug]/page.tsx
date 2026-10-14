import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { SOLUTIONS, SOLUTION_BY_SLUG } from "@/app/data/solutions";
import AppStage from "@/app/components/product/AppStage";

export const dynamicParams = false;
export function generateStaticParams() { return SOLUTIONS.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SOLUTION_BY_SLUG[slug];
  return s ? pageMetadata({ path: `/solutions/${slug}`, title: s.seoTitle, description: s.description, cardTitle: s.h1, cardKicker: s.name }) : {};
}

const serif = { fontFamily: "'Merriweather', serif" } as const;

/**
 * One page per industry: the product doing the industry's work, who it is
 * for, where AI decides and what goes wrong, the moment someone asks who
 * answered for a decision, the rules and what each asks of you, what the
 * platform gives you, and questions.
 */
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SOLUTION_BY_SLUG[slug];
  if (!s) notFound();
  const others = SOLUTIONS.filter((x) => x.slug !== slug);

  const ld = [
    { "@context": "https://schema.org", "@type": "WebPage", name: s.h1, description: s.description, url: `${SITE_URL}/solutions/${slug}`, about: s.name, audience: s.audience.map((a) => ({ "@type": "Audience", audienceType: a })), publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: s.name, path: `/solutions/${slug}` }]),
  ];

  return (
    <div className="bg-white text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Opening */}
      <section className="bg-[#f5f7f9] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-24 md:pb-32">
          <nav aria-label="Breadcrumb" className="text-center text-sm text-[#5e6b7b]">
            <Link href="/solutions" className="hover:text-[#0e1b2c]">Solutions</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span>{s.name}</span>
          </nav>
          {s.status && (
            <p className="mt-5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f6eedf] px-4 py-1.5 text-[13.5px] font-semibold text-[#8a6114]">
                <span className="h-2 w-2 rounded-full bg-[#c9920a]" aria-hidden="true" />
                {s.status.label} in {s.status.note}
              </span>
            </p>
          )}
          <h1 className="mt-5 mx-auto max-w-4xl text-center text-[2.1rem] md:text-[3.2rem] font-bold leading-[1.07] tracking-[-0.03em] text-balance" style={serif}>{s.h1}</h1>
          <p className="mt-5 mx-auto max-w-2xl text-center text-[17px] md:text-lg text-[#3d4a58] leading-[1.65] text-balance">{s.lede}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={s.cta.href} className="group inline-flex items-center gap-3 rounded-full bg-[#0e1b2c] pl-6 pr-2 py-2 text-[15px] font-semibold text-white hover:bg-[#1c2f47] transition-colors">
              {s.cta.label}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9920a] text-white transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-4 w-4" /></span>
            </Link>
            <Link href="/aware" className="inline-flex items-center rounded-full border border-[#c9ced6] bg-white px-6 py-3 text-[15px] font-semibold hover:border-[#0e1b2c] transition-colors">
              Check where you stand, free
            </Link>
          </div>
          <div className="mt-14 md:mt-16">
            <AppStage main={s.scene} menu={s.menu} org={s.org} />
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-12 md:py-14">
          <p className="text-center text-sm text-white/60">For</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {s.audience.map((a) => <li key={a} className="rounded-full border border-white/15 px-4 py-2 text-[14px] text-white/90">{a}</li>)}
          </ul>
        </div>
      </section>

      {/* Where AI decides */}
      <section>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em] max-w-2xl" style={serif}>Where AI decides, and what goes wrong</h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {s.decisions.map((d) => (
              <li key={d.title} className="rounded-2xl border border-[#dde2e8] bg-white p-6 md:p-7">
                <p className="text-[13px] text-[#5e6b7b]">Decides about: <span className="font-semibold text-[#0e1b2c]">{d.affects}</span></p>
                <h3 className="mt-2 text-[19px] font-bold leading-snug" style={serif}>{d.title}</h3>
                <p className="mt-3 border-l-[3px] border-[#b45309]/60 pl-3 text-[15.5px] leading-[1.65] text-[#3d4a58]">{d.risk}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The moment */}
      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 self-start">
            <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em]" style={serif}>{s.scenario.title}</h2>
            <p className="mt-4 text-[17px] leading-[1.7] text-[#3d4a58]">{s.scenario.intro}</p>
          </div>
          <ol className="relative">
            <span aria-hidden="true" className="absolute left-[19px] top-3 bottom-3 w-px bg-[#c9ced6]" />
            {s.scenario.steps.map((st, i) => (
              <li key={st.title} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-5 pb-10 last:pb-0">
                <span className={`relative z-10 grid h-10 w-10 place-items-center rounded-full text-[15px] font-bold ${i === s.scenario.steps.length - 1 ? "bg-[#0e1b2c] text-white" : "bg-white border border-[#c9ced6] text-[#8a6114]"}`}>{i + 1}</span>
                <div className="pt-1.5">
                  <h3 className="text-[18px] font-bold">{st.title}</h3>
                  <p className="mt-2 text-[16px] leading-[1.7] text-[#3d4a58] max-w-[60ch]">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rules */}
      <section>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em]" style={serif}>Rules that already apply</h2>
          <p className="mt-3 text-[15px] text-[#5e6b7b]">A summary, not legal advice about your organisation.</p>
          <div className="mt-10 divide-y divide-[#dde2e8] border-y border-[#dde2e8]">
            {s.rules.map((r) => (
              <div key={r.name} className="grid grid-cols-1 gap-3 py-7 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
                <h3 className="text-[18px] font-bold leading-snug" style={serif}>{r.name}</h3>
                <p className="text-[16px] leading-[1.7] text-[#2b3a4d]">
                  {r.text}
                  {r.href && <> <Link href={r.href} className="font-semibold text-[#8a6114] underline underline-offset-2">Read the guide</Link></>}
                </p>
                <p className="text-[15.5px] leading-[1.7] text-[#3d4a58]">
                  <span className="block text-[13px] font-semibold text-[#8a6114] mb-1">What it asks of you</span>
                  {r.asks}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <h2 className="text-[1.75rem] md:text-[2.4rem] font-bold leading-[1.12] tracking-[-0.02em]" style={serif}>What the platform gives you</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {s.platform.map((p) => (
              <li key={p.title}>
                <Link href={p.href} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#c9920a]/60 transition-colors">
                  <h3 className="text-[18px] font-semibold">{p.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.65] text-white/70">{p.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#e0b85c]">
                    How it works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {s.extra && (
            <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-white p-6 md:p-8 text-[#0e1b2c] md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-[1.25rem] font-bold" style={serif}>{s.extra.title}</h3>
                <p className="mt-2 text-[15.5px] leading-[1.65] text-[#3d4a58]">{s.extra.text}</p>
              </div>
              <Link href={s.extra.href} className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[#c9ced6] px-5 py-2.5 text-[14.5px] font-semibold hover:border-[#0e1b2c] transition-colors">
                {s.extra.label} <ArrowRight className="h-4 w-4 text-[#a8772a]" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Questions */}
      <section>
        <div className="max-w-[880px] mx-auto px-5 md:px-8 py-16 md:py-20">
          <h2 className="text-[1.6rem] md:text-[2rem] font-bold leading-[1.15] text-center" style={serif}>Questions</h2>
          <div className="mt-8 divide-y divide-[#dde2e8] border-y border-[#dde2e8]">
            {s.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#dde2e8] text-[#a8772a] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#3d4a58]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other industries */}
      <section className="border-t border-[#eef1f5] bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-16">
          <h2 className="text-[1.4rem] font-bold" style={serif}>Other industries</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/solutions/${o.slug}`} className="block h-full rounded-xl border border-[#dde2e8] bg-white p-4 hover:border-[#a8772a] transition-colors">
                  <span className="block font-semibold">{o.name}</span>
                  <span className="mt-1 block text-[13.5px] leading-snug text-[#5e6b7b]">{o.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
