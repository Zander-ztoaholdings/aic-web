import { NextResponse } from 'next/server';
import { getSystemDb, leads, sql } from '@/lib/db';
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

    const { email, score, tier, answers, company } = body;

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

    // The website no longer lists anyone in the AIC Aware directory or issues
    // badges. Both come from a free platform account, where an organisation is
    // registered and a named accountable person makes the declaration. An
    // anonymous form could list, and badge, any company name.
    let companyName: string | undefined;
    if (company !== undefined && company !== null && company !== '') {
      if (!isNonEmptyString(company, 200)) {
        return NextResponse.json({ success: false, message: 'Company name is too long.' }, { status: 400 });
      }
      companyName = company;
    }

    const db = getSystemDb();

    // 1. Record the lead. Rows already LISTED are legacy directory entries from
    // before badges moved to the platform: a retake by the same email must not
    // silently delist them or rename the company they were listed under, so
    // their status and company are left as they are.
    await db
      .insert(leads)
      .values({
        email,
        score: Math.round(score),
        source: 'QUIZ',
        status: 'NEW',
        ...(companyName ? { company: companyName } : {}),
      })
      .onConflictDoUpdate({
        target: leads.email,
        set: {
          score: Math.round(score),
          status: sql`CASE WHEN ${leads.status} = 'LISTED' THEN 'LISTED' ELSE 'RE-ENGAGED' END`,
          ...(companyName
            ? { company: sql`CASE WHEN ${leads.status} = 'LISTED' THEN ${leads.company} ELSE ${companyName} END` }
            : {}),
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
