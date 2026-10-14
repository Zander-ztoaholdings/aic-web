import { CONTACT_EMAIL } from "@/lib/contact";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { Client } from "@notionhq/client";
import { getSystemDb, contactSubmissions, eq } from "@/lib/db";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/validation";

// Contact form intake.
//
// The previous version could accept a submission, store it nowhere, and still
// answer {success: true}. It wrote to Notion only if NOTION_CONTACT_DATABASE_ID
// resolved, forwarded to HQ only if HQ_URL was set, and had no email path at
// all — while production Notion was returning "Could not find database ... make
// sure it is shared with your integration". Every CTA on the site says "Contact
// us", so that was the whole funnel reporting success into a void.
//
// Two rules now:
//   1. Durability first. The submission is written to Postgres — which we run —
//      before any third party is involved. Notion and email are notifications,
//      not storage.
//   2. Never claim a success we cannot back. If nothing durable accepted the
//      submission, the caller is told so and can try another route, rather than
//      being thanked for a message that no longer exists.
//
// Email uses the Resend REST API directly over fetch, deliberately with no new
// npm dependency.

export const dynamic = "force-dynamic";

/** Field caps. Anything longer is rejected rather than silently truncated. */
const LIMITS = {
  name: 120,
  email: 200,
  organization: 200,
  role: 120,
  country: 100,
  enquiryType: 100,
  message: 5000,
} as const;

/** Trimmed string within the cap, or null. Empty counts as absent. */
function field(value: unknown, max: number): string | null | false {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return null;
  return v.length <= max ? v : false;
}

/** IP addresses are personal information under POPIA. We only need to
 *  recognise repeat abuse, which a salted hash does equally well. */
function hashIp(ip: string): string {
  const salt = process.env["CONTACT_IP_SALT"] || "aic-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 64);
}

interface Submission {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  country: string;
  enquiryType: string;
  message?: string;
}

/** Primary, durable sink. */
async function saveToDatabase(
  data: Submission,
  ipHash: string,
  userAgent: string | null
): Promise<string | null> {
  try {
    const db = getSystemDb();
    const [row] = await db
      .insert(contactSubmissions)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        organization: data.organization,
        role: data.role,
        country: data.country,
        enquiryType: data.enquiryType,
        message: data.message ?? null,
        source: "website",
        ipHash,
        userAgent,
      })
      .returning({ id: contactSubmissions.id });
    return row?.id ?? null;
  } catch (error) {
    console.error("[contact] database write FAILED:", error);
    return null;
  }
}

/** Secondary sink — an operator gets told, without opening a dashboard. */
async function notifyByEmail(data: Submission, ref: string | null): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["CONTACT_NOTIFY_TO"];
  const from = process.env["CONTACT_NOTIFY_FROM"];
  if (!apiKey || !to || !from) return false;

  const lines = [
    `Name:       ${data.firstName} ${data.lastName}`,
    `Email:      ${data.email}`,
    `Company:    ${data.organization}`,
    `Role:       ${data.role}`,
    `Country:    ${data.country}`,
    `Enquiry:    ${data.enquiryType}`,
    ``,
    data.message || "(no message)",
    ``,
    ref ? `Reference:  ${ref}` : `Reference:  NOT STORED — database write failed`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `AIC enquiry — ${data.organization} (${data.enquiryType})`,
        text: lines,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Resend error:", error);
    return false;
  }
}

/** Tertiary sink — convenience only. Never load-bearing. */
async function saveToNotion(data: Submission): Promise<boolean> {
  const apiKey = process.env["NOTION_API_KEY"];
  const databaseId = process.env["NOTION_CONTACT_DATABASE_ID"];
  if (!apiKey || !databaseId) return false;

  try {
    const notion = new Client({ auth: apiKey });
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: `${data.firstName} ${data.lastName}` } }],
        },
        Email: { email: data.email },
        Company: { rich_text: [{ text: { content: data.organization } }] },
        "Job Title": { rich_text: [{ text: { content: data.role } }] },
        Country: { rich_text: [{ text: { content: data.country } }] },
        "Enquiry Type": { select: { name: data.enquiryType } },
        Message: { rich_text: [{ text: { content: data.message || "" } }] },
        Status: { select: { name: "New" } },
        "Submitted At": { date: { start: new Date().toISOString() } },
      },
    });
    return true;
  } catch (error) {
    console.error("[contact] Notion save failed:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(`contact:${ip}`, 3, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const firstName = field(body.firstName, LIMITS.name);
  const lastName = field(body.lastName, LIMITS.name);
  const email = field(body.email, LIMITS.email);
  const organization = field(body.organization ?? body.company, LIMITS.organization);
  const role = field(body.role ?? body.jobTitle, LIMITS.role);
  // Optional: the workshop form does not ask, and a missing country was
  // rejecting every workshop enquiry with "Missing required fields".
  const country = field(body.country, LIMITS.country);
  const enquiryType = field(body.enquiryType ?? body.certificationType, LIMITS.enquiryType);
  const message = field(body.message, LIMITS.message);

  if ([firstName, lastName, email, organization, role, country, enquiryType, message].some((v) => v === false)) {
    return NextResponse.json({ error: "One or more fields are too long or invalid" }, { status: 400 });
  }
  if (!firstName || !lastName || !email || !organization || !role || !enquiryType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const data: Submission = {
    firstName,
    lastName,
    email,
    organization,
    role,
    country: country || "Not given",
    enquiryType,
    ...(message ? { message } : {}),
  };

  const ipHash = hashIp(ip);
  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;

  // Durable first, then notifications.
  const ref = await saveToDatabase(data, ipHash, userAgent);
  const [emailed, notioned] = await Promise.all([
    notifyByEmail(data, ref),
    saveToNotion(data),
  ]);

  // Record that a human was actually told. Without this, "the enquiry arrived
  // but the notification silently failed" is an invisible state — the row looks
  // identical either way, and the first you would know is a prospect asking why
  // nobody replied. With it, stranded enquiries are one query away:
  //
  //   SELECT * FROM contact_submissions
  //    WHERE notified_at IS NULL AND handled_at IS NULL
  //    ORDER BY created_at;
  if (ref && emailed) {
    try {
      await getSystemDb()
        .update(contactSubmissions)
        .set({ notifiedAt: new Date() })
        .where(eq(contactSubmissions.id, ref));
    } catch (error) {
      // Never fail the submission over bookkeeping — the enquiry is already
      // stored and the email already sent.
      console.error("[contact] could not record notified_at:", error);
    }
  }

  if (ref && !emailed) {
    console.warn(
      `[contact] stored but NOT notified (ref ${ref}). ` +
        `Set RESEND_API_KEY, CONTACT_NOTIFY_TO and CONTACT_NOTIFY_FROM, ` +
        `or this enquiry waits until someone looks.`
    );
  }

  // "Durable" means we can retrieve it later. An email that reached an operator
  // counts; a Notion page counts. If none of them accepted it, the submission is
  // gone and saying otherwise would be a lie told to a prospect.
  const durable = Boolean(ref) || emailed || notioned;

  if (!durable) {
    console.error(
      `[contact] LOST SUBMISSION from ${data.email} (${data.organization}) — ` +
        `no sink accepted it. db=${Boolean(ref)} email=${emailed} notion=${notioned}`
    );
    return NextResponse.json(
      {
        success: false,
        error:
          `We could not record your message. Please email us directly at ${CONTACT_EMAIL} so it isn't lost.`,
      },
      { status: 503 }
    );
  }

  if (!ref) {
    // Notified but not stored — recoverable from the inbox, still worth flagging.
    console.warn(
      `[contact] stored via fallback only (db write failed). email=${emailed} notion=${notioned}`
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
