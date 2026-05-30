import Link from "next/link";
import Image from "next/image";
import { Shield, Mail, MapPin, ChevronRight } from "lucide-react";
import { navItems } from "./Navbar";

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
              Become a Founding Partner
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block group">
              <Image
                src="/AIC-Logo-White.svg"
                alt="AI Integrity Certification — Methodology Assessed"
                width={110}
                height={180}
                className="h-[72px] w-auto sm:h-20 group-hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              The global standard for certifying the humans accountable for AI systems — ensuring transparency, accountability, and trust in the age of artificial intelligence.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] text-[#c9920a] font-mono uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>METHODOLOGY ASSESSED</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-7 font-mono">
              Navigation
            </h4>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-[#c9920a] text-xs transition-colors font-mono uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-[#c9920a] opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
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
                    href="mailto:albert@ztoaholdings.com"
                    className="hover:text-white transition-colors break-all"
                  >
                    albert@ztoaholdings.com
                  </a>
                </div>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
