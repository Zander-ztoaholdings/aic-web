import { NextResponse } from "next/server";
import { getSystemDb, sql } from "@/lib/db";

// Health check with actionable diagnostics.
//
// Previously this reported `err.message`, which for a Drizzle failure is always
// "Failed query: SELECT 1" — true, but useless. The real cause sits on the
// error's `cause` (the underlying pg error), where the code distinguishes
// "Postgres is down", "wrong hostname", "bad password" and "connected fine but
// the tables don't exist". Those need completely different fixes.
//
// Note on disclosure: this endpoint reports the database host and port with
// credentials stripped. Those are internal Docker hostnames, not reachable
// externally, and knowing them is what makes the common misconfiguration
// diagnosable. If you would rather not publish even that, set
// HEALTH_HIDE_TARGET=1 and the target line is omitted.

const ENGINE_URL = process.env.ENGINE_URL;
const ENGINE_API_KEY = process.env.ENGINE_API_KEY || "";

interface ServiceCheck {
  status: "ok" | "error" | "not_configured";
  latency_ms: number;
  detail?: string;
  hint?: string;
  target?: string;
}

/** Map a driver/Postgres error to a plain-English next action. */
function diagnose(code: string | undefined, message: string): string {
  switch (code) {
    case "ECONNREFUSED":
      return "Nothing is listening at that host and port. Either Postgres is stopped, or DATABASE_URL points at the wrong host — inside Docker this must be the service name, not localhost.";
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "That hostname does not resolve. The app and the database are probably not on the same Docker network, or the service name is wrong.";
    case "ETIMEDOUT":
      return "Connection timed out — reachable name but blocked route. Check the firewall or network policy between the containers.";
    case "28P01":
      return "Password authentication failed. The credentials in DATABASE_URL do not match the database user.";
    case "28000":
      return "Authorisation rejected — check the username and the pg_hba rules.";
    case "3D000":
      return "That database name does not exist on the server. Create it, or correct the name in DATABASE_URL.";
    case "42P01":
      return "Connected successfully, but the tables do not exist. The schema has not been applied yet — this is a migration step, not a connection problem.";
    case "53300":
      return "Too many connections. Something is not releasing the pool.";
    default:
      return message.includes("self signed certificate") || message.includes("SSL")
        ? "TLS negotiation failed. Managed Postgres usually needs ?sslmode=require appended to DATABASE_URL."
        : "Unrecognised database error — see detail.";
  }
}

/** Unwrap Drizzle's wrapper to reach the underlying driver error. */
function rootCause(err: unknown): { code?: string; message: string } {
  let current: unknown = err;
  let message = err instanceof Error ? err.message : String(err);
  for (let depth = 0; depth < 5 && current; depth++) {
    const e = current as { code?: string; message?: string; cause?: unknown };
    if (e.code) return { code: String(e.code), message: e.message || message };
    if (e.message) message = e.message;
    current = e.cause;
  }
  return { message };
}

/** Connection target with credentials removed. */
function safeTarget(): string {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!raw) return "unset";
  try {
    const u = new URL(raw);
    return `${u.hostname}:${u.port || "5432"}${u.pathname}`;
  } catch {
    return "malformed";
  }
}

export async function GET() {
  const checks: Record<string, ServiceCheck> = {};
  const hideTarget = process.env.HEALTH_HIDE_TARGET === "1";
  const dbConfigured = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  // 1. Database
  const dbStart = Date.now();
  if (!dbConfigured) {
    checks.database = {
      status: "not_configured",
      latency_ms: 0,
      detail: "Neither DATABASE_URL nor POSTGRES_URL is set.",
      hint: "Set DATABASE_URL to a single connection string: postgresql://user:password@host:5432/dbname. The split POSTGRES_USER/HOST/PORT variables in the README are not read by lib/db.",
    };
  } else {
    try {
      await getSystemDb().execute(sql`SELECT 1`);
      checks.database = {
        status: "ok",
        latency_ms: Date.now() - dbStart,
        ...(hideTarget ? {} : { target: safeTarget() }),
      };
    } catch (err) {
      const { code, message } = rootCause(err);
      checks.database = {
        status: "error",
        latency_ms: Date.now() - dbStart,
        detail: code ? `${code}: ${message}` : message,
        hint: diagnose(code, message),
        ...(hideTarget ? {} : { target: safeTarget() }),
      };
    }
  }

  // 2. Engine — "not deployed yet" is a different statement from "broken",
  //    and reporting the first as the second makes the whole check cry wolf.
  const engineStart = Date.now();
  if (!ENGINE_URL) {
    checks.engine = {
      status: "not_configured",
      latency_ms: 0,
      detail: "ENGINE_URL is not set — the analysis engine is not wired up to this deployment.",
    };
  } else {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${ENGINE_URL}/health`, {
        signal: controller.signal,
        headers: ENGINE_API_KEY ? { "X-API-Key": ENGINE_API_KEY } : {},
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        checks.engine = {
          status: "ok",
          latency_ms: Date.now() - engineStart,
          detail: `v${data.version || "unknown"}`,
        };
      } else {
        checks.engine = {
          status: "error",
          latency_ms: Date.now() - engineStart,
          detail: `HTTP ${res.status}`,
        };
      }
    } catch (err) {
      const { message } = rootCause(err);
      checks.engine = {
        status: "error",
        latency_ms: Date.now() - engineStart,
        detail: (err as Error)?.name === "AbortError" ? "Timeout (5s)" : message,
      };
    }
  }

  // Only a real error is unhealthy. A service that was never configured is a
  // deployment state, not a fault, and shouldn't page anyone at 3am.
  const anyError = Object.values(checks).some((c) => c.status === "error");

  return NextResponse.json(
    {
      status: anyError ? "degraded" : "healthy",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: anyError ? 503 : 200 }
  );
}
