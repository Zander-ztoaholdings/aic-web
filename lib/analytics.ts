/**
 * Google Analytics 4, after consent.
 *
 * October 2026, ahead of LinkedIn promotion. Three things were wrong with
 * what was here before:
 *
 *  1. No events were sent at all. The helpers below existed and nothing
 *     called them, so GA could count pages but not a single signup, lead or
 *     completed AIC Aware check.
 *  2. Campaign attribution was lost. A visitor arrives from LinkedIn on
 *     /platform?utm_source=linkedin…, reads two pages, then accepts the
 *     banner. GA starts on the third page, without the campaign tags or the
 *     LinkedIn referrer, and files the visit under "direct". The landing page
 *     and referrer are now kept for the session (sessionStorage, on this
 *     device only, nothing sent anywhere) and replayed as the first page view
 *     once consent is given.
 *  3. The events used Universal Analytics fields (category, label) that GA4
 *     does not report on. They are now GA4 event names and parameters, using
 *     Google's recommended names where one exists (sign_up, generate_lead),
 *     so they can be marked as key events without custom set-up.
 *
 * Nothing here runs before consent. track() is a no-op until gtag exists.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(name: string, params: Params = {}): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

const LANDING_KEY = "aic-landing";

export interface Landing {
  url: string;
  referrer: string;
  replayed?: boolean;
}

/** Remember where this session started. First call in a tab wins. */
export function captureLanding(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(LANDING_KEY)) return;
    const landing: Landing = { url: window.location.href, referrer: document.referrer || "" };
    window.sessionStorage.setItem(LANDING_KEY, JSON.stringify(landing));
  } catch {
    // Storage blocked: attribution falls back to whatever GA sees.
  }
}

export function readLanding(): Landing | null {
  try {
    const raw = window.sessionStorage.getItem(LANDING_KEY);
    return raw ? (JSON.parse(raw) as Landing) : null;
  } catch {
    return null;
  }
}

export function markLandingReplayed(): void {
  const l = readLanding();
  if (!l) return;
  try {
    window.sessionStorage.setItem(LANDING_KEY, JSON.stringify({ ...l, replayed: true }));
  } catch {
    // ignore
  }
}

/**
 * Starts GA once consent is given. The first page view carries the landing
 * page and its referrer, so the campaign that brought the visitor is kept;
 * then the current page is recorded. Later navigations are counted by GA4's
 * enhanced measurement (page changes based on browser history).
 */
export function startAnalytics(gaId: string): void {
  const w = window;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.gtag = w.gtag || function gtag() { (w.dataLayer as unknown[]).push(arguments); };
  const gtag = w.gtag;

  const landing = readLanding();
  const debug = /[?&]ga_debug=1\b/.test(window.location.search) || /[?&]ga_debug=1\b/.test(landing?.url ?? "");

  gtag("js", new Date());
  gtag("config", gaId, { send_page_view: false, ...(debug ? { debug_mode: true } : {}) });

  if (landing && !landing.replayed && landing.url !== window.location.href) {
    gtag("event", "page_view", { page_location: landing.url, page_referrer: landing.referrer || undefined });
    gtag("event", "page_view", { page_location: window.location.href, page_referrer: landing.url });
  } else {
    gtag("event", "page_view", {
      page_location: window.location.href,
      page_referrer: (landing && !landing.replayed ? landing.referrer : document.referrer) || undefined,
    });
  }
  markLandingReplayed();
}

// ── Named events, so the same thing is always called the same name ──────

/** Someone left for the platform to register. GA4 recommended event. */
export const trackSignUpClick = (placement: string) => track("sign_up", { method: "website", placement });

/** A submitted enquiry. GA4 recommended event. */
export const trackLead = (enquiryType: string) => track("generate_lead", { enquiry_type: enquiryType });

export const trackAwareStarted = () => track("aware_started");
export const trackAwareQuestionsDone = () => track("aware_questions_completed");
export const trackAwareCompleted = (tier: string) => track("aware_completed", { tier });
export const trackAwareReport = () => track("aware_report_downloaded");
