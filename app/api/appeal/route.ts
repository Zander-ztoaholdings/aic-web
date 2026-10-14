import { NextRequest, NextResponse } from 'next/server';
import { getTenantDb, incidents, notifications } from '@/lib/db';
import { isValidEmail, isNonEmptyString, isValidLongText, safeParseJSON } from '@/lib/validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const { allowed } = checkRateLimit(`appeal:${ip}`, 3, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await safeParseJSON(request);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { orgId, citizen_email, system_name, description } = body;

    // A UUID, nothing else: the value goes into a tenant-scoping setting.
    if (typeof orgId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orgId)) {
      return NextResponse.json({ error: 'A valid organisation reference is required' }, { status: 400 });
    }
    if (!isValidEmail(citizen_email)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    if (!isValidLongText(description)) {
      return NextResponse.json({ error: 'Description is required (max 5000 characters)' }, { status: 400 });
    }

    if (system_name !== undefined && system_name !== null && system_name !== '' && !isNonEmptyString(system_name, 200)) {
      return NextResponse.json({ error: 'System name must be 200 characters or fewer' }, { status: 400 });
    }
    const safeName = isNonEmptyString(system_name, 200) ? system_name.trim() : 'Unknown';
    const db = getTenantDb(orgId);

    return await db.query(async (tx) => {
      // 1. Log the Incident
      await tx
        .insert(incidents)
        .values({
          orgId,
          citizenEmail: citizen_email,
          systemName: safeName,
          description,
          status: 'OPEN'
        });

      // 2. Notify the Organization
      await tx
        .insert(notifications)
        .values({
          orgId,
          title: 'NEW CITIZEN APPEAL',
          message: `A citizen has contested an automated decision from "${safeName}". Action required within 72 hours.`,
          type: 'ALERT',
          status: 'UNREAD'
        });

      return NextResponse.json({
        success: true,
        message: 'Your appeal has been received. The organisation will be in touch at the email address you gave.',
      });
    });

  } catch (error) {
    console.error('Public Appeal API Error:', error);
    return NextResponse.json({ error: 'Failed to process appeal' }, { status: 500 });
  }
}
