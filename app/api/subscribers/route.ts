import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

const HQ_URL = process.env.HQ_URL || 'https://hq.aiccertified.cloud';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const { allowed } = checkRateLimit(`subscribe:${ip}`, 3, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    
    // Proxy the request to the internal HQ API which has DB access
    const response = await fetch(`${HQ_URL}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('HQ API failed to process subscription');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Web Subscribe Error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
