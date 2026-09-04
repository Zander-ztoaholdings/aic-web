import Link from "next/link";
import Image from "next/image";
import { Shield, Mail, MapPin, ChevronRight } from "lucide-react";
import { navGroups } from "./Navbar";

// Footer intentionally does NOT reuse the top nav's dropdown interaction —
// footers are conventionally a flat, always-visible sitemap rather than a
// second set of hover/click menus (see e.g. charteredaccountantsworldwide.com's
// footer: branding, then plain categorised link columns, then legal, then
// social — never a footer dropdown). So this renders the same navGroups data
// as static sub-headed lists instead of mirroring the nav's dropdown behaviour.

const standards = [
  { label: "ISO/IEC 42001 (AIMS)",      url: "https://www.iso.org/standard/81230.html" },
  { label: "POPIA Section 71",          url: "https://popia.co.za/section-71-automated-decision-making/" },
  { label: "NIST AI RMF",               url: "https://airc.nist.gov/RMF" },
  { label: "EU AI Act Alignment",       url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
  { label: "IEEE 7000 Series",          url: "https://standards.ieee.org/ieee/IEEE-7000/6781/" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0a1628] text-white overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#c9920a] via-transparent to-transparent" />
      </div>

      {/* Manifesto band */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="text-[#c9920a] text-[10px] uppercase tracking-[0.3em] font-mono font-bold mb-5">
                Our Mission
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-serif italic leading-relaxed">
                Certifying that a named human remains accountable for every decision that matters.
              </h2>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 bg-[#c9920a] hover:bg-[#b07d08] text-white px-7 py-4 rounded transition-all text-xs font-bold uppercase tracking-widest font-sans shadow-xl shadow-[#c9920a]/20 self-start lg:self-auto"
            >
              Contact us
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block group">
              <Image
                src="/AIC-Logo-White.svg"
                alt="AI Integrity Certification"
                width={110}
                height={180}
                className="h-[72px] w-auto sm:h-20 group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Certifying the humans accountable for AI systems. AI Integrity Certification (Pty) Ltd, South Africa.
            </p>
            {/* Links to the accreditation status rather than standing alone,
                so what the mark does and does not assert is published on the
                site rather than explained after someone challenges it. */}
            <Link
              href="/disclosures#accreditation"
              title="What this mark means, and AIC's accreditation status"
              className="pt-2 flex items-center gap-2 text-[10px] text-[#c9920a] hover:text-[#dcae4c] font-mono uppercase tracking-widest transition-colors"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>METHODOLOGY ASSESSED</span>
            </Link>
            <Link
              href="/verify"
              className="inline-block text-white/40 hover:text-[#c9920a] text-xs font-mono uppercase tracking-widest transition-colors"
            >
              Verify a certificate →
            </Link>
          </div>

          {/* Explore — flat sitemap, grouped with sub-headers to match the nav's categories */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-7 font-mono">
              Explore
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-3">
                    {group.label}
                  </h5>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-white/60 hover:text-[#c9920a] text-xs transition-colors font-mono uppercase tracking-widest"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Standards */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-7 font-mono">
              Standards
            </h4>
            <ul className="space-y-4 text-xs text-white/60 font-mono uppercase tracking-widest">
              {standards.map((std) => (
                <li key={std.label}>
                  <a
                    href={std.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#c9920a] transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c9920a] shrink-0 group-hover:scale-150 transition-transform" />
                    {std.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-7 font-mono">
              Contact
            </h4>
            <ul className="space-y-5 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#c9920a]" />
                </div>
                <div className="leading-relaxed">
                  <div>Johannesburg, South Africa</div>
                  <div className="text-white/40 text-xs mt-1">
                    15 Smit Street, Johannesburg,<br />
                    Gauteng, 2000
                  </div>
                </div>
              </li>
              <li className="flex flex-col gap-3">
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#c9920a]" />
                  </div>
                  <a
                    href="mailto:zander@ztoaholdings.com"
                    className="hover:text-white transition-colors break-all"
                  >
                    zander@ztoaholdings.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/50 text-[10px] font-mono uppercase tracking-widest text-center sm:text-left">
            aiccertified.cloud | © 2026 AI Integrity Certification (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 sm:gap-8 text-[10px] text-white/50 font-mono uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-[#c9920a] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#c9920a] transition-colors">
              Terms of Use
            </Link>
            <Link href="/disclosures" className="hover:text-[#c9920a] transition-colors">
              Impartiality Statement
            </Link>
            {/* Consent has to be as easy to withdraw as it was to give,
                otherwise it is not consent. Dispatches an event the banner
                listens for, so it reopens without a page reload. */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("aic:review-cookie-consent"))
              }
              /* A <button> does not inherit font-size or font-family from its
                 parent — the UA stylesheet sets its own — so the utility
                 classes on the surrounding row applied to the sibling links
                 and not to this. Stated explicitly so it matches them. */
              className="text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-[#c9920a] transition-colors cursor-pointer"
            >
              Analytics Preference
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
