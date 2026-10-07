import Link from "next/link";

/**
 * Not found. Restyled October 2026: no monospace "404" or icon tile, just a
 * plain statement and the places people most often meant to go.
 */
const PLACES = [
  { href: "/platform", label: "The platform", note: "Your AI estate, kept on the record" },
  { href: "/standard", label: "The standard", note: "All 44 requirements, published" },
  { href: "/aware", label: "AIC Aware", note: "The free ten-minute self-assessment" },
  { href: "/regulatory-map", label: "Regulatory map", note: "AI regulation, country by country" },
  { href: "/about", label: "About AIC", note: "Who we are and why AIC exists" },
  { href: "/intake", label: "The November intake", note: "Join the founding cohort" },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#f5f7f9] text-[#0e1b2c]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16 md:py-24 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] gap-10 lg:gap-16 items-start">
        <div>
          <p className="text-sm text-[#5e6b7b]">Page not found</p>
          <h1 className="text-[2.2rem] md:text-[3rem] font-bold leading-[1.08] tracking-[-0.02em] mt-2" style={{ fontFamily: "'Merriweather', serif" }}>
            There is nothing at this address
          </h1>
          <p className="text-lg text-[#5e6b7b] leading-[1.7] mt-4 max-w-[52ch]">
            It may have moved, or the link was mistyped. If a link on our own site brought you here,{" "}
            <Link href="/contact" className="font-semibold text-[#8a6114] underline-offset-2 hover:underline">tell us</Link>{" "}
            and we will fix it.
          </p>
          <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#0e1b2c] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#1a3160] transition-colors">
            Go to the home page
          </Link>
        </div>
        <ul className="bg-white border border-[#dde2e8] rounded-xl divide-y divide-[#dde2e8]">
          {PLACES.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="group block px-5 py-4 hover:bg-[#fbfcfd]">
                <span className="block font-semibold group-hover:text-[#8a6114] transition-colors">{p.label}</span>
                <span className="block text-sm text-[#5e6b7b]">{p.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
