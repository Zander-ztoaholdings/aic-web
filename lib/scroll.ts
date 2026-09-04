"use client";

import { useEffect } from "react";

/**
 * Where the top of the page actually begins.
 *
 * The header is sticky and 111px tall, so anything scrolled to y=0 sits
 * underneath it. This is the one place that number lives; globals.css derives
 * its scroll-padding-top from the same value via --header-offset, and every
 * programmatic scroll on the site uses scrollToY below rather than inventing
 * its own offset.
 */
export const HEADER_OFFSET = 128;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scrolls so `el` sits just below the sticky header. */
export function scrollElementToTop(el: Element | null) {
  if (!el) return;
  const y = window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET;
  window.scrollTo({
    top: Math.max(0, y),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

/** True when `el` is already sitting roughly where scrollElementToTop would put it. */
export function isAtTop(el: Element | null, tolerance = 24): boolean {
  if (!el) return false;
  return Math.abs(el.getBoundingClientRect().top - HEADER_OFFSET) <= tolerance;
}

/**
 * Re-applies the URL hash once client-rendered content exists.
 *
 * Browsers resolve a hash at document load. Any anchor target rendered by a
 * client component does not exist yet at that moment, so the browser silently
 * gives up and the reader lands at the top of the page wondering why the link
 * did nothing. /standard#em did exactly this: the section was 3,591px down the
 * page and the browser had already stopped looking.
 */
export function useHashTarget(ready = true) {
  useEffect(() => {
    if (!ready) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // One frame for the content to paint before measuring it.
    const raf = requestAnimationFrame(() => {
      scrollElementToTop(document.getElementById(hash));
    });
    return () => cancelAnimationFrame(raf);
  }, [ready]);
}
