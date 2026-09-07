// A single, shared slugifier for organisation names — used both server-side
// (matching a requested badge slug against the real AIC Aware directory,
// lib/aware-badge.ts) and client-side (building the badge URL to show someone
// right after they declare, app/aware/AwareResults.tsx). Kept in one place so
// the two sides can never drift and produce a slug that fails to match.
export function slugifyCompany(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
