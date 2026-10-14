import { CONTACT_EMAIL } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";

// RFC 9116 security.txt. Served at /.well-known/security.txt through a rewrite
// in next.config.ts (and at /security.txt, which the RFC allows as a fallback).
// Expires is computed per request so it is always about a year out.
export const dynamic = "force-dynamic";

export function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  expires.setUTCHours(0, 0, 0, 0);
  const body = [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/security`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
