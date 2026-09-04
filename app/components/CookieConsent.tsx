"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * Analytics consent.
 *
 * Google Analytics previously loaded on every page for every visitor, before
 * any consent, with a hardcoded measurement ID as a fallback so it ran even
 * with the environment variable unset. Under POPIA that is processing personal
 * information — GA assigns a persistent client identifier and sends behaviour
 * to Google — without a lawful basis. On a site whose product is holding
 * organisations to account for automated processing, it was also the single
 * most quotable thing on the property.
 *
 * This blocks the script outright until someone opts in, rather than using
 * Consent Mode to load gtag in a denied state. Consent Mode is defensible;
 * not loading it at all is simply true, and easier to say out loud.
 *
 * Accept and Decline carry equal visual weight on purpose. A decline hidden
 * behind "manage preferences" while accept is a large primary button is a dark
 * pattern, and a consent record collected that way is not worth having.
 *
 * The choice lives in localStorage, not a cookie, so declining sets nothing.
 */

const STORAGE_KEY = "aic-analytics-consent";
type Consent = "granted" | "denied";

/** Read from anywhere — the footer link uses it to let someone change their mind. */
export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [asked, setAsked] = useState(true);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setAsked(stored !== null);

    // Lets the footer control reopen this without a page reload.
    const reopen = () => setAsked(false);
    window.addEventListener("aic:review-cookie-consent", reopen);
    return () => window.removeEventListener("aic:review-cookie-consent", reopen);
  }, []);

  const decide = useCallback((value: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // A browser refusing storage is not a reason to fail the page. Without a
      // stored choice the banner reappears next visit, which is the safe
      // direction to fail in.
    }
    setConsent(value);
    setAsked(true);
  }, []);

  return (
    <>
      {/* Only mounted once someone has actually said yes. */}
      {consent === "granted" && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      <AnimatePresence>
        {!asked && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-consent-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6"
          >
            <div className="max-w-3xl mx-auto bg-white border border-[#e5e7eb] rounded-xl shadow-[0_16px_50px_-12px_rgba(10,22,40,0.28)] p-5 sm:p-6">
              <h2
                id="cookie-consent-title"
                className="text-base font-semibold text-[#0f1f3d] mb-2"
              >
                Analytics — your call
              </h2>
              <p className="text-sm text-[#6b7280] leading-relaxed mb-4">
                We would like to use Google Analytics to see which pages people
                actually read. It sets a cookie and sends your browsing on this
                site to Google. Nothing here needs it, so declining costs you
                nothing and changes nothing about the site. Details are in our{" "}
                <Link
                  href="/privacy"
                  className="text-aic-copper hover:underline"
                >
                  privacy policy
                </Link>
                .
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => decide("denied")}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-[#e5e7eb] bg-white text-sm font-semibold text-[#0f1f3d] hover:border-[#0f1f3d] transition-colors"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => decide("granted")}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-[#0f1f3d] bg-[#0f1f3d] text-sm font-semibold text-white hover:bg-aic-navy transition-colors"
                >
                  Allow analytics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
