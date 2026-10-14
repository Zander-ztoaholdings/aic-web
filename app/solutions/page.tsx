import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata, SITE_URL, breadcrumbLd } from "@/lib/seo";
import { SOLUTIONS } from "@/app/data/solutions";

export const metadata: Metadata = pageMetadata({
  path: "/solutions",
  title: "AI accountability by industry",
  description: "Where AI decides in hiring, lending, insurance, engineering, software and healthcare, the rules that already apply, and how to show who answers for each decision.",
  cardKicker: "Solutions",
});

const serif = { fontFamily: "'Merriweather', serif" } as const;

/** Every industry page, with what AI decides there. */
export default function SolutionsIndex() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "AI accountability by industry",
      url: `${SITE_URL}/solutions`,
      mainEntity: { "@type": "ItemList", itemListElement: SOLUTIONS.map((s, n) => ({ "@type": "ListItem", position: n + 1, name: s.name, url: `${SITE_URL}/solutions/${s.slug}` })) },
    },
    breadcrumbLd([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }]),
  ];
  return (
    <div className="bg-white text-[#0e1b2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-[#f5f7f9]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-14 md:pb-16 text-center">
          <p className="text-sm text-[#5e6b7b]">Solutions</p>
          <h1 className="mt-4 mx-auto max-w-3xl text-[2.2rem] md:text-[3.3rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance" style={serif}>
            Wherever AI decides, someone answers for it
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-[17px] md:text-lg text-[#3d4a58] leading-[1.65] text-balance">
            The decisions AI makes differ by industry, and so do the rules that already apply. What stays the same is the question every regulator, board and customer asks: who answered for this one?
          </p>
        </div>
      </section>
      <section>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <li key={s.slug}>
                <Link href={`/solutions/${s.slug}`} className="group flex h-full flex-col rounded-2xl border border-[#dde2e8] bg-white p-7 hover:border-[#a8772a] hover:shadow-[0_20px_40px_-28px_rgba(10,22,40,0.4)] transition-all">
                  {s.status ? (
                    <span className="self-start rounded-full bg-[#f6eedf] px-3 py-1 text-[12.5px] font-semibold text-[#8a6114]">{s.status.label} in {s.status.note}</span>
                  ) : (
                    <span className="self-start rounded-full bg-[#e7f3ec] px-3 py-1 text-[12.5px] font-semibold text-[#2e7a57]">Open now</span>
                  )}
                  <h2 className="mt-4 text-[1.4rem] font-bold" style={serif}>{s.name}</h2>
                  <p className="mt-2 text-[15.5px] leading-[1.65] text-[#3d4a58]">{s.lede}</p>
                  <ul className="mt-4 space-y-1.5 text-[14.5px] text-[#5e6b7b]">
                    {s.decisions.slice(0, 3).map((d) => <li key={d.title} className="border-l-2 border-[#a8772a]/50 pl-3">{d.title}</li>)}
                  </ul>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[#8a6114]">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
