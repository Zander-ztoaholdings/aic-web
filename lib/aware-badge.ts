// AI Integrity Certification — AIC Aware badge domain layer
//
// The badge is an embeddable image an organisation can put on their own
// website. It must never be able to say something the organisation hasn't
// actually declared: there is no account system yet (that's a separate,
// later build), so the public AIC Aware directory (lib/aware-directory.ts —
// leads.status = 'LISTED') is the only source of truth for "is this real".
// A badge request is matched against that same data, by slug, so the trust
// boundary here is identical to the directory page's — this is just that
// data rendered as an image instead of a list row.
//
// This deliberately does NOT let anyone hand-place a badge for an
// organisation that hasn't gone through the actual self-assessment and
// opted in. If AIC wants to give a specific client an AIC Aware badge, the
// honest path is the same one everyone else uses: they complete /aware and
// tick "list me in the directory" — after that, this endpoint picks them up
// automatically, no manual database edit required.

import "server-only";

import { listAwareDirectory, type AwareListing } from "@/lib/aware-directory";
import { slugifyCompany } from "@/lib/slug";

export async function findAwareBadgeEntry(slug: string): Promise<AwareListing | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  const entries = await listAwareDirectory();
  if (!entries) return null; // outage — never fabricate a badge from nothing

  return entries.find((e) => slugifyCompany(e.company) === normalized) ?? null;
}
