import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { findAwareBadgeEntry } from "@/lib/aware-badge";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Embeddable <img>-style badge for AIC Aware. Renders only for an
// organisation that has actually declared and opted into the public
// directory (see lib/aware-badge.ts) — everyone else gets a 404, same as
// requesting an image that doesn't exist, rather than a badge that implies
// a declaration nobody made.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(`aware-badge:${ip}`, 60, 60_000);
  if (!allowed) {
    return new Response("Too many requests", { status: 429 });
  }

  const { slug } = await params;
  const entry = await findAwareBadgeEntry(slug);

  if (!entry) {
    return new Response("Not found — this organisation hasn't declared via AIC Aware.", {
      status: 404,
    });
  }

  const { searchParams } = new URL(request.url);
  const download = searchParams.get("download") === "1";

  const declaredDate = entry.declaredOn
    ? new Date(`${entry.declaredOn}T00:00:00Z`).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : "an unspecified date";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#ffffff",
          border: "2px solid #e5e7eb",
          borderRadius: 16,
          padding: "20px 26px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: "#0a1628",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width={34} height={40} viewBox="0 0 22 26" fill="none">
            <path
              d="M11 1L2 4.5V12C2 17.5 5.8 22.5 11 24C16.2 22.5 20 17.5 20 12V4.5L11 1Z"
              stroke="#c9920a"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="11" cy="9.5" r="2.5" fill="#c9920a" />
            <path
              d="M6.5 19C6.5 15.5 8.5 13.5 11 13.5C13.5 13.5 15.5 15.5 15.5 19"
              stroke="#c9920a"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 18,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#0f1f3d", letterSpacing: -0.5 }}>
              AIC Aware
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#c9920a",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              Self-Declared
            </span>
          </div>
          <div style={{ fontSize: 15, color: "#374151", marginTop: 2, fontWeight: 600 }}>
            {entry.company}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
            Declared {declaredDate} · not AIC Certified, not independently verified
          </div>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 120,
      headers: {
        "Cache-Control": "public, max-age=3600",
        ...(download
          ? { "Content-Disposition": `attachment; filename="aic-aware-badge-${slug}.png"` }
          : {}),
      },
    }
  );
}
