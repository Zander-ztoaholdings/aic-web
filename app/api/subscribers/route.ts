import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getSystemDb, contactSubmissions, and, eq } from "@/lib/db";

// Email sign-ups for news.
//
// This used to forward to hq.aiccertified.cloud, a service that is not
// running, so every sign-up failed. Sign-ups are now stored on the website's
// own database, in the same table as enquiries (enquiry type "Newsletter"),
// which needs no migration and keeps every inbound contact in one place:
//
//   SELECT email, created_at FROM contact_submissions
//    WHERE enquiry_type = 'Newsletter' ORDER BY created_at DESC;

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(`subscribe:${ip}`, 3, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: { email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase().slice(0, 255);
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const db = getSystemDb();
    const existing = await db
      .select({ id: contactSubmissions.id })
      .from(contactSubmissions)
      .where(and(eq(contactSubmissions.email, email), eq(contactSubmissions.enquiryType, "Newsletter")))
      .limit(1);
    if (!existing.length) {
      const salt = process.env["CONTACT_IP_SALT"] || "aic-contact";
      await db.insert(contactSubmissions).values({
        firstName: "Newsletter",
        lastName: "subscriber",
        email,
        enquiryType: "Newsletter",
        message: `Signed up from ${String(body.source ?? "website").slice(0, 40)}`,
        source: "newsletter",
        ipHash: createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 64),
        userAgent: request.headers.get("user-agent"),
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[subscribers] could not store sign-up:", error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 503 });
  }
}
