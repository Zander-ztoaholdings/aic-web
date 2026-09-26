// AI Integrity Certification — AIC Aware badges, as issued by the platform.
//
// Badges are issued by app.aiccertified.cloud to a registered organisation
// with a named accountable person, each with a unique code (AWR-XXXX-XXXX).
// The website renders the badge image, the verify page and the directory from
// the platform's public endpoints. It keeps no copy: a badge revoked on the
// platform must stop rendering as valid here on the next request.

import "server-only";

export const BADGE_CODE_RE = /^AWR-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

/** Accepts lower case and the Crockford look-alikes a person may type. */
export function normaliseBadgeCode(input: string): string | null {
  const s = input.trim().toUpperCase().replace(/[IL]/g, "1").replace(/O/g, "0");
  return BADGE_CODE_RE.test(s) ? s : null;
}

export interface VerifiedBadge {
  code: string;
  programme: "AIC Aware";
  selfDeclared: true;
  organisation: string;
  status: "valid" | "expired" | "revoked";
  issuedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revocationReason: string | null;
  accountablePersonNamed: boolean;
  questionSetVersion: string;
  listed: boolean;
}

export interface PlatformDirectoryEntry {
  code: string;
  organisation: string;
  issuedAt: string;
  expiresAt: string;
}

/**
 * Where the platform is, in order of preference. PLATFORM_INTERNAL_URL first:
 * this container and the platform share a host, and a container generally
 * cannot reach its own host's public IP (the same reason the platform needs
 * AIC_WEB_INTERNAL_URL to reach this site). Read through a computed key so it
 * is evaluated at request time, not inlined at build.
 */
export function platformCandidates(): string[] {
  const env = process.env;
  const out: string[] = [];
  for (const raw of [env["PLATFORM_INTERNAL_URL"], env["NEXT_PUBLIC_PLATFORM_URL"], "https://app.aiccertified.cloud"]) {
    const v = raw?.trim().replace(/\/+$/, "");
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}

const TIMEOUT_MS = 5_000;

async function platformGet(path: string): Promise<{ status: number; body: unknown } | null> {
  for (const base of platformCandidates()) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${base}${path}`, {
        signal: controller.signal,
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      // A redirect to /login means an old platform build that gates this path;
      // treat as unreachable rather than as "no such badge".
      if (res.redirected && new URL(res.url).pathname.startsWith("/login")) continue;
      if (res.status >= 500) continue;
      return { status: res.status, body: await res.json().catch(() => null) };
    } catch {
      // next candidate
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

/**
 * The badge with this code; "not-found" when the platform says there is none;
 * null when the platform cannot be reached. Callers must render the outage
 * honestly, never as a valid or a missing badge.
 */
export async function verifyBadge(code: string): Promise<VerifiedBadge | "not-found" | null> {
  const r = await platformGet(`/api/public/aware/badges/${encodeURIComponent(code)}`);
  if (!r) return null;
  if (r.status === 404 || r.status === 400) return "not-found";
  const b = r.body as VerifiedBadge | null;
  if (r.status !== 200 || !b?.code) return null;
  return b;
}

/** Listed, current badges; null when the platform cannot be reached. */
export async function listPlatformDirectory(): Promise<PlatformDirectoryEntry[] | null> {
  const r = await platformGet("/api/public/aware/directory");
  if (!r || r.status !== 200) return null;
  const entries = (r.body as { entries?: PlatformDirectoryEntry[] } | null)?.entries;
  return Array.isArray(entries) ? entries : null;
}
