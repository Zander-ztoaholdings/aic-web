import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

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

async function saveToNotion(data: {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  country: string;
  enquiryType: string;
  message?: string;
}) {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_CONTACT_DATABASE_ID;
  if (!apiKey || !databaseId) return;

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

  const firstName = body.firstName;
  const lastName = body.lastName;
  const email = body.email;
  const organization = body.organization || body.company;
  const role = body.role || body.jobTitle;
  const country = body.country;
  const enquiryType = body.enquiryType || body.certificationType;
  const message = body.message;

  if (!firstName || !lastName || !email || !organization || !role || !country || !enquiryType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Save to Notion (non-blocking — form success doesn't depend on this)
  saveToNotion({ firstName, lastName, email, organization, role, country, enquiryType, message })
    .catch((err) => console.error("[Contact] Notion save failed:", err));

  // Forward to HQ if configured
  const hqUrl = process.env.HQ_URL;
  if (hqUrl) {
    try {
      const hqRes = await fetch(`${hqUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, organization, role, country, enquiryType, message }),
      });
      if (!hqRes.ok) console.error("HQ contact forward failed:", hqRes.status);
    } catch (err) {
      console.error("HQ contact forward error:", err);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
