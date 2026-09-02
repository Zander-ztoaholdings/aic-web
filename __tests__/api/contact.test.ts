import { describe, it, expect, vi, beforeEach } from "vitest";

// The contract this pins: the contact form must never report success for a
// submission it did not store anywhere. The previous route returned
// {success: true} unconditionally while production Notion was misconfigured, so
// enquiries were being thanked and discarded.

let dbShouldFail = false;
let inserted: Record<string, unknown>[] = [];
let notionShouldFail = true;
let notionConfigured = false;
let emailStatus: number | null = null;

vi.mock("@/lib/db", () => ({
  getSystemDb: () => ({
    insert: () => ({
      values: (v: Record<string, unknown>) => ({
        returning: async () => {
          if (dbShouldFail) throw new Error("connection refused");
          inserted.push(v);
          return [{ id: "11111111-2222-3333-4444-555555555555" }];
        },
      }),
    }),
  }),
  contactSubmissions: { id: "id" },
}));

vi.mock("@notionhq/client", () => ({
  Client: class {
    pages = {
      create: async () => {
        if (notionShouldFail) throw new Error("database not shared");
        return {};
      },
    };
  },
}));

const { POST } = await import("@/app/api/contact/route");

function makeReq(overrides: Record<string, unknown> = {}, ip = "1.2.3.4") {
  return {
    headers: {
      get: (k: string) =>
        k === "x-forwarded-for" ? ip : k === "user-agent" ? "vitest" : null,
    },
    json: async () => ({
      firstName: "Chris",
      lastName: "Theron",
      email: "chris@example.com",
      organization: "CEMS Engineering",
      role: "Director",
      country: "South Africa",
      enquiryType: "Certification",
      message: "Interested in the founding cohort.",
      ...overrides,
    }),
  } as unknown as Parameters<typeof POST>[0];
}

beforeEach(() => {
  dbShouldFail = false;
  inserted = [];
  notionShouldFail = true;
  notionConfigured = false;
  emailStatus = null;

  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_NOTIFY_TO;
  delete process.env.CONTACT_NOTIFY_FROM;
  delete process.env.NOTION_API_KEY;
  delete process.env.NOTION_CONTACT_DATABASE_ID;

  vi.stubGlobal("fetch", async () => ({
    ok: emailStatus === 200,
    status: emailStatus ?? 500,
    text: async () => "stub",
  }));

  // Fresh IP each test so the rate limiter (module-level) doesn't bleed across.
  let n = 0;
  vi.stubGlobal("__ipCounter", () => n++);
});

describe("contact form durability contract", () => {
  it("stores to the database and reports success with a reference", async () => {
    const res = await POST(makeReq({}, "10.0.0.1"));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.reference).toBeTruthy();
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      email: "chris@example.com",
      organization: "CEMS Engineering",
    });
  });

  it("REFUSES to claim success when every sink fails", async () => {
    dbShouldFail = true; // notion + email unconfigured by default
    const res = await POST(makeReq({}, "10.0.0.2"));
    const body = await res.json();
    expect(res.status).toBe(503);
    expect(body.success).toBe(false);
    // The visitor is given a route that actually works.
    expect(body.error).toMatch(/zander@ztoaholdings\.com/);
  });

  it("still succeeds if the database is down but email gets through", async () => {
    dbShouldFail = true;
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_NOTIFY_TO = "ops@example.com";
    process.env.CONTACT_NOTIFY_FROM = "site@example.com";
    emailStatus = 200;

    const res = await POST(makeReq({}, "10.0.0.3"));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.reference).toBeNull();
  });

  it("still succeeds if the database is down but Notion accepts it", async () => {
    dbShouldFail = true;
    notionShouldFail = false;
    process.env.NOTION_API_KEY = "secret";
    process.env.NOTION_CONTACT_DATABASE_ID = "db";

    const res = await POST(makeReq({}, "10.0.0.4"));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  it("does not store a raw IP address (POPIA)", async () => {
    await POST(makeReq({}, "196.25.1.99"));
    const row = inserted[0];
    expect(JSON.stringify(row)).not.toContain("196.25.1.99");
    expect(String(row.ipHash)).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects incomplete submissions before touching any sink", async () => {
    const res = await POST(makeReq({ email: "" }, "10.0.0.5"));
    expect(res.status).toBe(400);
    expect(inserted).toHaveLength(0);
  });
});
