import { NextResponse } from "next/server";
import { getAwareInstrument, validateAnswers } from "@/lib/aware-instrument";
import { calculateAssessmentResult } from "@/lib/scoring";
import { analyseAware } from "@/lib/aware-analysis";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { safeParseJSON } from "@/lib/validation";

// The one scorer. The platform posts a completed set of answers here when an
// organisation submits AIC Aware, and stores what comes back against the
// version it was computed under. Pure computation — nothing is stored on this
// side, and nothing about who is asking is needed.
export async function POST(request: Request) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(`aware-score:${ip}`, 60, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await safeParseJSON(request);
  const answers = (body as { answers?: unknown } | null)?.answers;
  const instrument = getAwareInstrument();
  const problems = validateAnswers(answers, instrument);
  if (problems.length > 0) {
    return NextResponse.json({ error: "Incomplete or invalid answers", problems }, { status: 400 });
  }

  const a = answers as Record<string, number>;
  const result = calculateAssessmentResult(a);
  const analysis = analyseAware(a);

  return NextResponse.json({
    version: instrument.version,
    score: result.integrityScore,
    tier: result.tier.name,
    indicatedDivision: analysis.indication.division,
    indicatedDivisionName: analysis.indication.name,
    applicableCount: analysis.applicableCount,
    gapCodes: analysis.gaps.map((g) => g.requirement.code),
    flagshipGapCodes: analysis.flagshipGaps.map((g) => g.requirement.code),
    gapsByRight: analysis.gapsByRight,
  });
}
