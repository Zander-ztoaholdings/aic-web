import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle, ExternalLink } from "lucide-react";
import { frameworks, frameworksReviewedAt } from "@/app/data/frameworks-data";

export function generateStaticParams() {
  return frameworks.map((fw) => ({ slug: fw.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fw = frameworks.find((f) => f.slug === slug);
  if (!fw) return { title: "Framework not found" };
  return {
    title: `${fw.industry} — Frameworks`,
    description: fw.title,
  };
}

export default async function FrameworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fw = frameworks.find((f) => f.slug === slug);
  if (!fw) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://aiccertified.cloud",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Frameworks",
        item: "https://aiccertified.cloud/frameworks",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: fw.industry,
        item: `https://aiccertified.cloud/frameworks/${fw.slug}`,
      },
    ],
  };

  return (
    <div className="bg-aic-paper min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Hero */}
      <section className="bg-aic-navy text-white py-24 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <Link
            href="/frameworks"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-widest font-mono mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All frameworks
          </Link>
          <span className="text-aic-copper text-xs uppercase tracking-widest font-mono font-bold">
            {fw.kicker}
          </span>
          <h1
            className="text-4xl md:text-5xl mt-4 mb-6 leading-[1.1] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            {fw.title}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">{fw.intro}</p>

          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
            <div>
              <div className="text-white/40 text-[0.65rem] uppercase tracking-widest font-mono mb-1">
                Reference standard
              </div>
              <div className="text-white font-semibold">{fw.standardName}</div>
              <div className="text-white/40 text-xs mt-0.5">{fw.standardBodies}</div>
            </div>
            <div>
              <div className="text-white/40 text-[0.65rem] uppercase tracking-widest font-mono mb-1">
                Rating concept
              </div>
              <div className="text-white font-semibold">{fw.ratingScale}</div>
              <div className="text-white/40 text-xs mt-0.5 max-w-xs">{fw.ratingScaleDetail}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="py-20 border-b border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            Positioning
          </span>
          <h2 className="text-2xl md:text-3xl text-[#0f1f3d] mt-4 mb-6 font-bold tracking-[-0.02em]">
            What AIC maps, and against what
          </h2>
          <p className="text-[#6b7280] text-lg leading-relaxed">{fw.positioning}</p>
        </div>
      </section>

      {/* Translation table */}
      <section className="py-20 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            Translation
          </span>
          <h2 className="text-2xl md:text-3xl text-[#0f1f3d] mt-4 mb-10 font-bold tracking-[-0.02em]">
            The established concept, and its AI equivalent
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b-2 border-[#0f1f3d]">
                  <th className="py-3 pr-4 text-xs uppercase tracking-widest text-[#9ca3af] font-mono font-semibold">
                    Established
                  </th>
                  <th className="py-3 px-4 text-xs uppercase tracking-widest text-[#9ca3af] font-mono font-semibold">
                    AI equivalent
                  </th>
                  <th className="py-3 pl-4 text-xs uppercase tracking-widest text-[#9ca3af] font-mono font-semibold">
                    What it means here
                  </th>
                </tr>
              </thead>
              <tbody>
                {fw.translations.map((t) => (
                  <tr key={t.established} className="border-b border-[#e5e7eb] align-top">
                    <td className="py-4 pr-4 font-semibold text-[#0f1f3d] text-sm whitespace-nowrap">
                      {t.established}
                    </td>
                    <td className="py-4 px-4 text-aic-copper text-sm font-medium whitespace-nowrap">
                      {t.aiEquivalent}
                    </td>
                    <td className="py-4 pl-4 text-[#6b7280] text-sm leading-relaxed">{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Safety measures */}
      <section className="py-20 border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-aic-copper text-[0.7rem] uppercase tracking-[0.3em] font-bold">
            Assessed Against
          </span>
          <h2 className="text-2xl md:text-3xl text-[#0f1f3d] mt-4 mb-10 font-bold tracking-[-0.02em]">
            The safety measures a subject demonstrates
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {fw.safetyMeasures.map((m, i) => (
              <div key={m.title} className="flex gap-4 bg-white border border-[#e5e7eb] rounded-lg p-6">
                <div className="text-aic-copper font-mono text-sm shrink-0">0{i + 1}</div>
                <div>
                  <h3 className="text-[#0f1f3d] font-semibold text-sm mb-1.5">{m.title}</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gap warning */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-start gap-4 border border-[#e5e7eb] rounded-xl p-8">
            <AlertTriangle className="w-6 h-6 text-aic-copper shrink-0 mt-1" />
            <div>
              <h3 className="text-[#0f1f3d] font-semibold text-lg mb-3">
                Where this mapping has limits
              </h3>
              <p className="text-[#6b7280] leading-relaxed">{fw.gapWarning}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {fw.externalLinks.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-aic-copper transition-colors font-mono uppercase tracking-wide"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {l.label}
              </a>
            ))}
          </div>

          <p className="text-xs text-[#9ca3af] mt-8">Reviewed {frameworksReviewedAt}.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-aic-navy text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl mb-6 leading-[1.1] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Want to talk through how this applies to your organisation?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 bg-aic-copper text-white px-10 py-5 rounded-full font-bold hover:bg-[#b07d08] transition-all shadow-xl shadow-aic-copper/20 hover:-translate-y-1"
          >
            Contact us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
