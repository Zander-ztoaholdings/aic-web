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

    if (!isNonEmptyString(orgId)) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }
    if (!isValidEmail(citizen_email)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    if (!isValidLongText(description)) {
      return NextResponse.json({ error: 'Description is required (max 5000 characters)' }, { status: 400 });
    }

    const safeName = isNonEmptyString(system_name) ? system_name : 'Unknown';
    const db = getTenantDb(orgId);

    return await db.query(async (tx) => {
      // 1. Log the Incident
      const [newIncident] = await tx
        .insert(incidents)
        .values({
          orgId,
          citizenEmail: citizen_email,
          systemName: safeName,
          description,
          status: 'OPEN'
        })
        .returning({ id: incidents.id });

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

      return NextResponse.json({ success: true, appealId: newIncident.id });
    });

  } catch (error) {
    console.error('Public Appeal API Error:', error);
    return NextResponse.json({ error: 'Failed to process appeal' }, { status: 500 });
  }
}
