'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Shield, BookOpen, FileText, Newspaper, Menu, X } from "lucide-react";

export const navItems = [
  { href: "/certification",  label: "Certification",         icon: Shield,    description: "Five-Division Accountability Framework" },
  { href: "/governance-hub", label: "Standards & Recognition", icon: BookOpen,  description: "Algorithmic Rights & Global Standards" },
  { href: "/articles",       label: "Articles",             icon: Newspaper, description: "Governance insights and updates" },
  { href: "/disclosures",    label: "Disclosures",          icon: FileText,  description: "Public impartiality and conflict-of-interest statements" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar — solid dark, no transparency */}
      <div className="bg-[#0a1628] text-white/70 text-[10px] uppercase tracking-wider py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              METHODOLOGY ASSESSED
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9920a] inline-block" />
              Certification Status: Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav — light background, dark text */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[rgba(0,0,0,0.1)]" 
          : "bg-white shadow-sm"
      }`}>
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
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded text-sm font-medium transition-colors relative text-[#6b7280] hover:text-[#0f1f3d] hover:bg-[#f0f4f8]"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Burgundy CTA */}
              <Link
                href="/contact"
                className="ml-2 bg-[#c9920a] text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-[#b07d08] transition-all shadow-md active:scale-95"
              >
                Get Certified
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

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="lg:hidden bg-white border-t border-[rgba(0,0,0,0.1)] overflow-y-auto"
            style={{ maxHeight: "calc(100dvh - 120px)" }}
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#0f1f3d] text-white"
                        : "text-[#0f1f3d] hover:bg-[#f0f4f8]"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="text-base font-semibold">{item.label}</div>
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-[rgba(0,0,0,0.1)] flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="flex items-center justify-center text-base bg-[#c9920a] text-white px-4 py-4 rounded font-bold transition-all hover:bg-[#b07d08]"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Certified
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
