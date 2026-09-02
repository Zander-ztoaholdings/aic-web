import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { Client } from "@notionhq/client";
import { getSystemDb, contactSubmissions } from "@/lib/db";

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

const RATE_LIMIT_MAP = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
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
  const ip = getClientIp(req);
  const now = Date.now();
  const existing = RATE_LIMIT_MAP.get(ip);

  if (existing && now - existing.timestamp < RATE_LIMIT_WINDOW) {
    if (existing.count >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    existing.count += 1;
  } else {
    RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data: Submission = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    organization: body.organization || body.company,
    role: body.role || body.jobTitle,
    country: body.country,
    enquiryType: body.enquiryType || body.certificationType,
    message: body.message,
  };

  if (
    !data.firstName || !data.lastName || !data.email ||
    !data.organization || !data.role || !data.country || !data.enquiryType
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ipHash = hashIp(ip);
  const userAgent = req.headers.get("user-agent");

  // Durable first, then notifications.
  const ref = await saveToDatabase(data, ipHash, userAgent);
  const [emailed, notioned] = await Promise.all([
    notifyByEmail(data, ref),
    saveToNotion(data),
  ]);

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
          "We could not record your message. Please email us directly at zander@ztoaholdings.com so it isn't lost.",
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

  return NextResponse.json({ success: true, reference: ref }, { status: 200 });
}
