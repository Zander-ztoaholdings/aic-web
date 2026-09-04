import { NextResponse } from "next/server";
import { standardPayload } from "@/lib/standard-scoring";

/**
 * The standard, machine-readable.
 *
 * aic-platform and aic-engine read this rather than holding their own copies.
 * That is the point: today the platform stores a generic checklist whose demo
 * codes contradict the published set — its HU-1 is the AI systems register,
 * which is HU-3 here — and the engine bands at 50, from the retired
 * three-band scale. Three systems, three answers to "what does AIC assess".
 *
 * A certificate asserts that an organisation was measured against a published
 * standard. If the measuring and the publishing are different documents, the
 * certificate does not mean what the standard says it means, which is EX-5
 * failing inside AIC's own tooling. Serving the definition from the same file
 * the public reads removes the possibility rather than the temptation.
 *
 * Public and uncached-by-version on purpose: anyone can diff what an auditor
 * scored against, which is the sort of thing a certification body should be
 * happy to be held to.
 */
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(standardPayload(), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Standard-Version": standardPayload().version,
    },
  });
}
