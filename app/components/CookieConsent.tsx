"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { ANALYTICS_DEFAULT_ON } from "@/lib/analytics-mode";
import { captureLanding, startAnalytics } from "@/lib/analytics";
import AnalyticsEvents from "./AnalyticsEvents";

/**
 * Cookie consent, by category.
 *
 * Two categories exist on this site, and only two are offered: essential
 * (always on, sets no cookies, only remembers this choice in the browser) and
 * analytics (Google Analytics, off until switched on). Nothing optional loads
 * before a choice is made. "Reject optional", "Manage" and "Accept all" carry
 * equal visual weight, so declining is as easy as accepting.
 *
 * Switching analytics off after it was on stops it straight away: GA's own
 * opt-out flag is set, its cookies are removed and the page reloads, so the
 * script that was already running is gone.
 */

const STORAGE_KEY = "aic-cookie-consent";
const LEGACY_KEY = "aic-analytics-consent";
type Prefs = { analytics: boolean };
type Stored = Prefs & { v: 1; at: string };

function readPrefs(): Prefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Stored>;
      if (typeof p.analytics === "boolean") return { analytics: p.analytics };
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy === "granted" || legacy === "denied") return { analytics: legacy === "granted" };
  } catch {
    // Storage blocked: treat as no choice yet, which is the safe direction.
  }
  return null;
}

/** Kept for callers that only need yes or no. */
export function readConsent(): "granted" | "denied" | null {
  const p = readPrefs();
  return p ? (p.analytics ? "granted" : "denied") : null;
}

function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (!name || !(name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat"))) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}

function Toggle({ checked, onChange, disabled, label }: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 min-h-0 min-w-0 p-0 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed ${
        checked ? "bg-[#0f1f3d]" : "bg-[#d1d5db]"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
    </button>
  );
}

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(false);

  useEffect(() => { captureLanding(); }, []);

  const started = useRef(false);
  useEffect(() => {
    if (prefs?.analytics && gaId && !started.current) {
      started.current = true;
      (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = false;
      startAnalytics(gaId);
    }
  }, [prefs, gaId]);

  useEffect(() => {
    if (ANALYTICS_DEFAULT_ON) {
      setPrefs({ analytics: true });
      return;
    }
    const stored = readPrefs();
    setPrefs(stored);
    setOpen(stored === null);
    setDraftAnalytics(stored?.analytics ?? false);

    // The footer's "Cookie settings" opens straight to the toggles.
    const reopen = () => {
      setDraftAnalytics(readPrefs()?.analytics ?? false);
      setManage(true);
      setOpen(true);
    };
    window.addEventListener("aic:review-cookie-consent", reopen);
    return () => window.removeEventListener("aic:review-cookie-consent", reopen);
  }, []);

  const save = useCallback(
    (next: Prefs) => {
      const wasOn = started.current;
      try {
        const stored: Stored = { ...next, v: 1, at: new Date().toISOString() };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        window.localStorage.removeItem(LEGACY_KEY);
      } catch {
        // Without storage the banner returns next visit, which is safe.
      }
      setPrefs(next);
      setOpen(false);
      setManage(false);
      if (!next.analytics && wasOn) {
        if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true;
        clearAnalyticsCookies();
        window.location.reload();
      }
    },
    [gaId],
  );

  const btn = "flex-1 sm:flex-none px-5 py-2.5 rounded-lg border text-sm font-semibold transition-colors";
  const quiet = `${btn} border-[#e5e7eb] bg-white text-[#0f1f3d] hover:border-[#0f1f3d]`;
  const solid = `${btn} border-[#0f1f3d] bg-[#0f1f3d] text-white hover:bg-aic-navy`;

  return (
    <>
      {prefs?.analytics && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <AnalyticsEvents />
        </>
      )}

      <AnimatePresence>
        {open && (
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
              <h2 id="cookie-consent-title" className="text-base font-semibold text-[#0f1f3d] mb-2">
                {manage ? "Cookie settings" : "Cookies on this site"}
              </h2>
              {!manage ? (
                <p className="text-sm text-[#6b7280] leading-relaxed mb-4">
                  We use essential storage to make the site work and remember your choice. With your permission we&apos;d
                  also use Google Analytics to see which pages people read. It sets cookies and sends your browsing on this
                  site to Google. Nothing on the site needs it. Details are in our{" "}
                  <Link href="/privacy" className="text-aic-copper hover:underline">privacy notice</Link>.
                </p>
              ) : (
                <ul className="mb-5 divide-y divide-[#eef0f3] border-y border-[#eef0f3]">
                  <li className="flex items-start justify-between gap-4 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-[#0f1f3d]">Essential</p>
                      <p className="text-[13px] text-[#6b7280] leading-relaxed mt-0.5">
                        Keeps the site working and remembers this choice on your device. Sets no tracking cookies. Always on.
                      </p>
                    </div>
                    <Toggle checked disabled label="Essential, always on" />
                  </li>
                  <li className="flex items-start justify-between gap-4 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-[#0f1f3d]">Analytics</p>
                      <p className="text-[13px] text-[#6b7280] leading-relaxed mt-0.5">
                        Google Analytics: which pages are read and which links bring people here. Sets cookies and is processed by Google, including outside South Africa.
                      </p>
                    </div>
                    <Toggle checked={draftAnalytics} onChange={setDraftAnalytics} label="Analytics" />
                  </li>
                </ul>
              )}
              <div className="flex flex-wrap gap-2.5">
                {!manage ? (
                  <>
                    <button type="button" onClick={() => save({ analytics: false })} className={quiet}>Reject optional</button>
                    <button type="button" onClick={() => setManage(true)} className={quiet}>Manage</button>
                    <button type="button" onClick={() => save({ analytics: true })} className={solid}>Accept all</button>
                  </>
                ) : (
                  <>
                    {prefs !== null && (
                      <button type="button" onClick={() => { setOpen(false); setManage(false); }} className={quiet}>Cancel</button>
                    )}
                    <button type="button" onClick={() => save({ analytics: false })} className={quiet}>Reject optional</button>
                    <button type="button" onClick={() => save({ analytics: draftAnalytics })} className={solid}>Save choices</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
