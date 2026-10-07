"use client";

import { useEffect } from "react";
import { track, trackSignUpClick } from "@/lib/analytics";

const PLATFORM = (process.env.NEXT_PUBLIC_PLATFORM_URL || "https://app.aiccertified.cloud").replace(/\/+$/, "");

/**
 * Click events that matter for the funnel, measured from one listener rather
 * than wired into every button: leaving for the platform to register or sign
 * in, starting a conversation, and opening AIC Aware. Mounted only after
 * analytics consent. The section a click came from is read from the nearest
 * heading, so "which part of which page sends people to sign up" is
 * answerable without tagging each link by hand.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    function placement(el: Element): string {
      const section = el.closest("section, header, footer, nav, aside");
      if (!section) return window.location.pathname;
      if (section.tagName === "NAV") return "navigation";
      if (section.tagName === "FOOTER") return "footer";
      const h = section.querySelector("h1, h2, h3");
      return `${window.location.pathname} ${h?.textContent?.trim().slice(0, 60) ?? ""}`.trim();
    }

    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      let url: URL;
      try { url = new URL(href, window.location.href); } catch { return; }
      const where = placement(a);
      const text = (a.textContent || "").trim().slice(0, 60);

      if (url.origin === PLATFORM && url.pathname.startsWith("/signup")) trackSignUpClick(where);
      else if ((url.origin === PLATFORM && url.pathname.startsWith("/login")) || (url.origin === window.location.origin && url.pathname === "/login")) track("login_click", { placement: where });
      else if (url.origin === window.location.origin && url.pathname === "/contact") track("contact_click", { placement: where, topic: url.searchParams.get("topic") ?? url.searchParams.get("enquiry") ?? "" });
      else if (url.origin === window.location.origin && url.pathname === "/aware") track("aware_click", { placement: where });
      else if (url.protocol === "mailto:") track("email_click", { placement: where });
      else if (url.origin === window.location.origin && url.pathname === "/platform") track("platform_click", { placement: where, link_text: text });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
