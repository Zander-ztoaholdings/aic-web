import { NextResponse } from 'next/server';
import { getSystemDb, sql } from '@/lib/db';

const ENGINE_URL = process.env.ENGINE_URL || 'http://localhost:8000';
const ENGINE_API_KEY = process.env.ENGINE_API_KEY || '';

interface ServiceCheck {
  status: 'ok' | 'error';
  latency_ms: number;
  detail?: string;
}

export async function GET() {
  const checks: Record<string, ServiceCheck> = {};
  const db = getSystemDb();

  // 1. Database check
  const dbStart = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    checks.database = { status: 'ok', latency_ms: Date.now() - dbStart };
  } catch (err: any) {
    checks.database = { status: 'error', latency_ms: Date.now() - dbStart, detail: err.message };
  }

  // 2. Engine check
  const engineStart = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${ENGINE_URL}/health`, {
      signal: controller.signal,
      headers: ENGINE_API_KEY ? { 'X-API-Key': ENGINE_API_KEY } : {},
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      checks.engine = {
        status: 'ok',
        latency_ms: Date.now() - engineStart,
        detail: `v${data.version || 'unknown'}`,
      };
    } else {
      checks.engine = { status: 'error', latency_ms: Date.now() - engineStart, detail: `HTTP ${res.status}` };
    }
  } catch (err: any) {
    checks.engine = {
      status: 'error',
      latency_ms: Date.now() - engineStart,
      detail: err.name === 'AbortError' ? 'Timeout (5s)' : err.message,
    };
  }

  const allOk = Object.values(checks).every(c => c.status === 'ok');

  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  }, { status: allOk ? 200 : 503 });
}
