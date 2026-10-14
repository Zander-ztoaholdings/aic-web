import { NextResponse } from "next/server";
import { standardPayload, scoringModelPayload } from "@/lib/standard-scoring";
import { tokenMatches } from "@/lib/secure-compare";

/**
 * The standard, machine-readable.
 *
 * Public callers get the published standard: requirements, Rights and evidence
 * tiers by label and order. The scoring model (weights, gates, bands,
 * aggregation) is returned only to aic-platform / aic-engine presenting
 * x-standard-token matching STANDARD_API_TOKEN.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const env = process.env;
  const internal = tokenMatches(request.headers.get("x-standard-token"), env["STANDARD_API_TOKEN"]);
  const payload = internal ? scoringModelPayload() : standardPayload();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": internal ? "private, no-store" : "public, max-age=3600, stale-while-revalidate=86400",
      "X-Standard-Version": payload.version,
      Vary: "x-standard-token",
    },
  });
}
