'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Menu,
  X,
  ChevronDown,
  Shield,
  ClipboardCheck,
  ShieldCheck,
  Search,
  Scale,
  FileText,
  Building2,
  Handshake,
  Globe2,
  Newspaper,
  Radio,
  Layers,
  GraduationCap,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
  label: string;
  href?: string;
  items: NavLink[];
}

// A standalone top-level nav item — rendered as a plain link, not a dropdown.
// Workshops lives here deliberately: it's a temporary, standalone product, not
// a sub-item of an existing category (see the "own spot in the ribbon" call).
export interface TopLevelLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Grouped by function rather than audience — see /governance-hub and /disclosures
// for how the underlying pages are organised. Footer.tsx renders its own flat,
// categorised version of this same structure (see the comment there for why).
export const navGroups: NavGroup[] = [
  {
    label: "Certification",
    items: [
      { href: "/certification", label: "Certification Framework", icon: Shield, description: "The Five-Division accountability model" },
      { href: "/standard", label: "The Standard", icon: ClipboardCheck, description: "All 44 requirements we assess against" },
      { href: "/registry", label: "Public Registry", icon: ShieldCheck, description: "Search certified organisations" },
      { href: "/verify", label: "Verify a Certificate", icon: Search, description: "Confirm a certificate ID in seconds" },
      { href: "/governance-hub#declaration", label: "Algorithmic Rights", icon: Scale, description: "The Declaration of Algorithmic Rights" },
      { href: "/disclosures", label: "Governance & Disclosures", icon: FileText, description: "Impartiality, methodology, appeals" },
    ],
  },
  {
    label: "Partnerships",
    items: [
      { href: "/insurers", label: "Insurers", icon: Building2, description: "How underwriters recognise and verify AIC certification" },
      { href: "/contact", label: "Become a Partner", icon: Handshake, description: "Discuss another kind of partnership with us" },
    ],
  },
  {
    label: "Where We Operate",
    items: [
      { href: "/regulatory-map", label: "Regulatory Map", icon: Globe2, description: "AI regulation by jurisdiction, with draft compliance summaries" },
      { href: "/frameworks", label: "Frameworks", icon: Layers, description: "AI mapped against established industry safety frameworks" },
    ],
  },
  {
    label: "News",
    items: [
      { href: "/articles", label: "Articles", icon: Newspaper, description: "Governance insights and updates" },
      { href: "/policy", label: "Policy Updates", icon: Radio, description: "Regulatory developments, with their sources" },
    ],
  },
];

// Standalone links, rendered next to the dropdown groups rather than inside one.
export const topLevelLinks: TopLevelLink[] = [
  { href: "/workshops", label: "Workshops", icon: GraduationCap },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar — solid dark, no transparency */}
      <div className="bg-[#0a1628] text-white/70 text-[10px] uppercase tracking-wider py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/disclosures#accreditation"
              title="What this mark means, and AIC's accreditation status"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Globe className="w-3 h-3" />
              METHODOLOGY ASSESSED
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav — light background, dark text */}
      <nav
        ref={navRef}
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[rgba(0,0,0,0.1)]"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <div>
                <div className="font-bold text-lg leading-tight tracking-tight text-[#0f1f3d]">AIC</div>
                <div className="text-[10px] leading-tight tracking-widest uppercase text-[#6b7280]">AI Integrity Certification</div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navGroups.map((group) => {
                const isOpen = openGroup === group.label;
                return (
                  <div key={group.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : group.label)}
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                        isOpen
                          ? "text-[#0f1f3d] bg-[#f0f4f8]"
                          : "text-[#6b7280] hover:text-[#0f1f3d] hover:bg-[#f0f4f8]"
                      }`}
                    >
                      {group.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#e5e7eb] py-2 z-50">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-[#f0f4f8] transition-colors"
                              onClick={() => setOpenGroup(null)}
                            >
                              <Icon className="w-4 h-4 text-[#c9920a] mt-0.5 shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-[#0f1f3d]">{item.label}</div>
                                <div className="text-xs text-[#6b7280] mt-0.5">{item.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Standalone top-level links — plain, no dropdown */}
              {topLevelLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#0f1f3d] bg-[#f0f4f8]"
                        : "text-[#6b7280] hover:text-[#0f1f3d] hover:bg-[#f0f4f8]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Copper CTA */}
              {/* LOG IN LINK TEMPORARILY REMOVED — 4 Sep 2026.
                  app.aiccertified.cloud currently serves a client dashboard to
                  anyone, with no authentication, populated with a fictional
                  certified client ("Meridian Financial Group", an Accountable
                  Person named Dr. Sarah Chen, Division 2, INTEGRITY: SECURE).
                  Verified from a cookieless fetch, so it is not a stale local
                  session. Linking the public site to it would advertise a
                  certified client relationship that does not exist, on a site
                  whose register correctly says nobody has been certified.
                  Restore this block once the platform is genuinely gated and
                  the demo data is gone — the /login redirect is already fixed
                  and waiting in next.config.ts. */}
              <Link
                href="/contact"
                className="ml-2 bg-[#c9920a] text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-[#b07d08] transition-all shadow-md active:scale-95"
              >
                Contact us
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-[#0f1f3d]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — accordion by group */}
        {menuOpen && (
          <div
            className="lg:hidden bg-white border-t border-[rgba(0,0,0,0.1)] overflow-y-auto"
            style={{ maxHeight: "calc(100dvh - 120px)" }}
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navGroups.map((group) => {
                const isOpen = openMobileGroup === group.label;
                return (
                  <div key={group.label} className="border-b border-[rgba(0,0,0,0.06)] last:border-0">
                    <button
                      type="button"
                      onClick={() => setOpenMobileGroup(isOpen ? null : group.label)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between px-4 py-4 text-left"
                    >
                      <span className="text-base font-semibold text-[#0f1f3d]">{group.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#6b7280] transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 flex flex-col gap-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="px-4 py-3 rounded-lg text-sm text-[#6b7280] hover:bg-[#f0f4f8] hover:text-[#0f1f3d] transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Standalone top-level links in mobile menu */}
              <div className="border-b border-[rgba(0,0,0,0.06)] pb-1">
                {topLevelLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 px-4 py-4 text-base font-semibold text-[#0f1f3d]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-[#c9920a]" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 mt-2 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="flex items-center justify-center text-base bg-[#c9920a] text-white px-4 py-4 rounded font-bold transition-all hover:bg-[#b07d08]"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
