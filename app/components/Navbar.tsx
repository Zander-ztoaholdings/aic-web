'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";
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
  Gauge,
  LayoutGrid,
  CalendarCheck,
  Users,
  Mail,
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
      { href: "/certification", label: "How certification works", icon: Shield, description: "The five Divisions and what an assessment covers" },
      { href: "/standard", label: "The standard", icon: ClipboardCheck, description: "All 44 requirements we assess against" },
      { href: "/aware", label: "AIC Aware", icon: Gauge, description: "Free self-assessment against the standard, self-declared" },
      { href: "/registry", label: "Public register", icon: ShieldCheck, description: "Organisations certified against the standard" },
      { href: "/verify", label: "Verify a certificate", icon: Search, description: "Confirm a certificate in seconds" },
      { href: "/governance-hub#declaration", label: "Algorithmic Rights", icon: Scale, description: "The Declaration of Algorithmic Rights" },
      { href: "/disclosures", label: "Governance and disclosures", icon: FileText, description: "Impartiality, methodology, appeals" },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/platform", label: "The platform", icon: LayoutGrid, description: "Your AI estate, kept on the record" },
      { href: "/intake", label: "November intake", icon: CalendarCheck, description: "Join the founding cohort" },
    ],
  },
  {
    label: "Where we operate",
    items: [
      { href: "/regulatory-map", label: "Regulatory map", icon: Globe2, description: "AI regulation by country, and how AIC's frameworks apply" },
      { href: "/frameworks", label: "Frameworks", icon: Layers, description: "AI mapped onto the safety frameworks your industry uses" },
    ],
  },
  {
    label: "News",
    items: [
      { href: "/articles", label: "Articles", icon: Newspaper, description: "Analysis on AI accountability and regulation" },
      { href: "/policy", label: "Policy updates", icon: Radio, description: "Regulatory developments, with their sources" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/about", label: "About AIC", icon: Users, description: "Who we are and why AIC exists" },
      { href: "/insurers", label: "For insurers", icon: Building2, description: "A verifiable signal of AI accountability" },
      { href: "/contact?topic=partnership", label: "Become a partner", icon: Handshake, description: "Research, distribution, training or another partnership" },
      { href: "/contact", label: "Contact", icon: Mail, description: "Talk to AIC" },
    ],
  },
];

// Standalone links, rendered next to the dropdown groups rather than inside one.
// Workshops keeps its own spot: a temporary, standalone product.
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
  const reduced = useReducedMotion() ?? false;

  // Whether anything is open over the page. Both the desktop dropdown and the
  // mobile sheet dim and blur what is behind them, for the same reason: while
  // a menu is open the page is not what you are looking at.
  const overlayOpen = openGroup !== null || menuOpen;

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
      {/* Backdrop for an open menu.
          Only opacity is animated — the motion system permits transform and
          opacity and nothing else, and animating backdrop-filter from 0 would
          repaint the blur every frame for no gain. The blur is a fixed value
          that fades in as a whole.
          The tint is brand navy rather than neutral grey so the page reads as
          suspended rather than greyed out, and -webkit- is written explicitly
          because Safari still wants it. */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            aria-hidden
            onClick={() => {
              setOpenGroup(null);
              setMenuOpen(false);
            }}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : DURATION.fast, ease: EASE_OUT }}
            className="fixed inset-0 z-40 bg-[#0a1628]/20"
            style={{
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Top utility bar — solid dark, no transparency.
          relative z-50 keeps it above the backdrop: the header chrome stays
          sharp while the page behind it blurs. */}
      <div className="relative z-50 bg-[#0a1628] text-white/70 text-[12px] py-2">
        <div className="max-w-[1520px] mx-auto px-5 md:px-6 lg:px-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Was "Methodology assessed". No accreditation body has assessed
                AIC yet (see /disclosures#accreditation), so the line now says
                something that is true and checkable. */}
            <Link
              href="/standard"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Globe className="w-3 h-3" />
              Our standard, published in full
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
        className={`relative z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[rgba(0,0,0,0.1)]"
            : "bg-white shadow-sm"
        }`}
      >
        {/* Wider on desktop (Oct 2026): at max-w-7xl the four menus, two links
            and the call to action were packed into the middle of a wide screen.
            The logo, the menus and the account actions now each get their own
            zone, and the menus sit centred between them. */}
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20 xl:h-[5.5rem]">

            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <div>
                <div className="font-bold text-lg xl:text-xl leading-tight tracking-tight text-[#0f1f3d]">AIC</div>
                <div className="text-[12px] leading-tight text-[#5e6b7b]">AI Integrity Certification</div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex flex-1 items-center justify-between ml-6 xl:ml-14">
              <div className="flex flex-1 items-center justify-center gap-0.5 xl:gap-3">
              {navGroups.map((group) => {
                const isOpen = openGroup === group.label;
                return (
                  <div key={group.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : group.label)}
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 whitespace-nowrap px-2.5 xl:px-4 py-2 rounded-lg text-sm xl:text-[15px] font-medium transition-colors ${
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
                      <div
                        className="absolute left-0 top-full mt-2 w-80 rounded-xl shadow-2xl border border-white/60 py-2 z-50 bg-white/80"
                        style={{
                          backdropFilter: "blur(20px) saturate(180%)",
                          WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        }}
                      >
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
                    className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 xl:px-4 py-2 rounded-lg text-sm xl:text-[15px] font-medium transition-colors ${
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

              </div>
              <div className="flex items-center gap-2 shrink-0">
              {/* Log in — removed 4 Sep 2026 while app.aiccertified.cloud
                  served an ungated dashboard populated with a fictional
                  certified client. Restored 7 Sep 2026: the platform now
                  redirects unauthenticated requests to /login, and the
                  fictional client is gone. This is a relative href on purpose
                  — next.config.ts redirects /login to the platform, so the
                  platform's URL lives in one place rather than being hardcoded
                  into the nav. */}
              <Link
                href="/login"
                className="whitespace-nowrap px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-[15px] font-medium text-[#5e6b7b] hover:text-[#0f1f3d] hover:bg-[#f0f4f8] transition-colors"
              >
                Log in
              </Link>

              {/* Copper CTA */}
              <Link
                href="/intake"
                className="whitespace-nowrap bg-[#c9920a] text-[#0e1b2c] px-5 xl:px-6 py-2.5 rounded-lg text-sm xl:text-[15px] font-semibold hover:bg-[#dcae4c] transition-colors"
              >
                <span className="hidden min-[1400px]:inline">Join the </span>November intake
              </Link>
              </div>
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
            className="lg:hidden relative z-50 bg-white/85 border-t border-[rgba(0,0,0,0.1)] overflow-y-auto"
            style={{
              maxHeight: "calc(100dvh - 120px)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
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
                  href="/intake"
                  className="flex items-center justify-center text-base bg-[#c9920a] text-[#0e1b2c] px-4 py-4 rounded-lg font-semibold transition-colors hover:bg-[#dcae4c]"
                  onClick={() => setMenuOpen(false)}
                >
                  Join the November intake
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center text-base border border-[#e5e7eb] text-[#0f1f3d] px-4 py-4 rounded font-bold transition-all hover:bg-[#f0f4f8]"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
