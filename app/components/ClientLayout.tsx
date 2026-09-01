"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-aic-paper">
      {/* Skip link — WCAG 2.4.1. Visually hidden until focused, so keyboard and
          screen-reader users can jump past the nav instead of tabbing the whole
          menu on every page. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-[#0f1f3d] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
