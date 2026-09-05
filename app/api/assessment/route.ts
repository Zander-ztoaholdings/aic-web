import { NextResponse } from 'next/server';
import { getSystemDb, leads } from '@/lib/db';
import { isValidEmail, isValidScore, isValidTier, isNonEmptyString, safeParseJSON } from '@/lib/validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { allowed } = checkRateLimit(`assessment:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await safeParseJSON(request);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { email, score, tier, answers, company, wantsListed } = body;

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 });
    }
    if (!isValidScore(score)) {
      return NextResponse.json({ success: false, message: 'Score must be a number between 0 and 100.' }, { status: 400 });
    }
    if (!isValidTier(tier)) {
      return NextResponse.json({ success: false, message: 'Tier must be TIER_1, TIER_2, or TIER_3.' }, { status: 400 });
    }
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ success: false, message: 'Answers object is required.' }, { status: 400 });
    }

    // Company is required only to be *listed* in the AIC Aware directory — an
    // anonymous email can still get a score and a PDF without naming an
    // organisation, it just can't opt into the public list (there'd be
    // nothing honest to show next to the email address).
    const wantsToBeListed = wantsListed === true;
    let companyName: string | undefined;
    if (company !== undefined && company !== null && company !== '') {
      if (!isNonEmptyString(company, 200)) {
        return NextResponse.json({ success: false, message: 'Company name is too long.' }, { status: 400 });
      }
      companyName = company;
    }
    if (wantsToBeListed && !companyName) {
      return NextResponse.json({ success: false, message: 'A company name is required to appear in the AIC Aware directory.' }, { status: 400 });
    }

    const db = getSystemDb();

    // 1. Record the Lead (Assessment results are merged into lead scoring).
    // status: 'LISTED' is a self-declared opt-in into the public AIC Aware
    // directory (see lib/aware-directory.ts) — distinct from 'NEW' and
    // 're-engaged', which are internal lead-pipeline states only.
    const status = wantsToBeListed ? 'LISTED' : 'NEW';
    const reEngagedStatus = wantsToBeListed ? 'LISTED' : 'RE-ENGAGED';

    await db
      .insert(leads)
      .values({
        email,
        score: Math.round(score),
        source: 'QUIZ',
        status,
        ...(companyName ? { company: companyName } : {}),
      })
      .onConflictDoUpdate({
        target: leads.email,
        set: {
          score: Math.round(score),
          status: reEngagedStatus,
          ...(companyName ? { company: companyName } : {}),
        },
      });

    // Note: detailed quiz answers can be archived in a separate log table
    // if required for deep telemetry.

    return NextResponse.json({
      success: true,
      message: 'Assessment archived securely and lead recorded.'
    });
  } catch (error) {
    console.error('Error processing assessment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
