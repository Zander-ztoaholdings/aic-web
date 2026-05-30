import { NextResponse } from 'next/server';
import { getSystemDb, leads } from '@/lib/db';
import { isValidEmail, isNonEmptyString, safeParseJSON } from '@/lib/validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { allowed } = checkRateLimit(`alpha:${ip}`, 5, 60_000);
    if (!allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await safeParseJSON(request);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const firstName = body['first-name'];
    const lastName = body['last-name'];
    const { email, company } = body;

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 });
    }
    if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
      return NextResponse.json({ success: false, message: 'First and last name are required.' }, { status: 400 });
    }
    if (!isNonEmptyString(company)) {
      return NextResponse.json({ success: false, message: 'Company name is required.' }, { status: 400 });
    }

    const db = getSystemDb();

    // 1. Insert or Update leads table (Lead management is unified)
    await db
      .insert(leads)
      .values({
        email,
        company,
        source: 'ALPHA_FORM',
        status: 'ALPHA_APPLIED'
      })
      .onConflictDoUpdate({
        target: leads.email,
        set: { 
          company, 
          status: 'ALPHA_APPLIED' 
        }
      });

    // Note: alpha_applications table is managed via leads status now
    // to maintain a lean institutional schema.

    return NextResponse.json({
      success: true,
      message: 'Application received. Our team will contact you shortly.'
    });
  } catch (error) {
    console.error('Error processing alpha application:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
