import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { findAwareBadgeEntry } from "@/lib/aware-badge";
import { normaliseBadgeCode, verifyBadge } from "@/lib/aware-platform";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Embeddable badge for AIC Aware.
//
// Two kinds of key:
//   AWR-XXXX-XXXX  a badge issued by the platform to a registered organisation
//                  with a named accountable person. Rendered from the
//                  platform's verify endpoint on every request (short cache),
//                  so an expired or revoked badge shows as such on every site
//                  that embeds it.
//   a company slug the legacy badge, from the website's own directory opt-in
//                  before badges moved to the platform. Kept rendering so
//                  existing embeds do not break; no new ones are created.

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

function render(opts: { company: string; tag: string; line: string; muted?: boolean }) {
  const { company, tag, line, muted = false } = opts;
  const accent = muted ? "#9ca3af" : "#c9920a";
  return (
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
            background: muted ? "#6b7280" : "#0a1628",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width={34} height={40} viewBox="0 0 22 26" fill="none">
            <path
              d="M11 1L2 4.5V12C2 17.5 5.8 22.5 11 24C16.2 22.5 20 17.5 20 12V4.5L11 1Z"
              stroke={accent}
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="11" cy="9.5" r="2.5" fill={accent} />
            <path
              d="M6.5 19C6.5 15.5 8.5 13.5 11 13.5C13.5 13.5 15.5 15.5 15.5 19"
              stroke={accent}
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
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              {tag}
            </span>
          </div>
          <div style={{ fontSize: 15, color: "#374151", marginTop: 2, fontWeight: 600 }}>
            {company}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
            {line}
          </div>
        </div>
      </div>
    )
  );
}

function image(el: React.ReactElement, filename: string, download: boolean, maxAge: number) {
  return new ImageResponse(el, {
    width: 400,
    height: 120,
    headers: {
      "Cache-Control": `public, max-age=${maxAge}`,
      ...(download ? { "Content-Disposition": `attachment; filename="${filename}"` } : {}),
    },
  });
}

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
  const download = new URL(request.url).searchParams.get("download") === "1";

  const code = normaliseBadgeCode(decodeURIComponent(slug));
  if (code) {
    const badge = await verifyBadge(code);
    if (badge === null) {
      return new Response("Badge verification is temporarily unavailable.", {
        status: 503,
        headers: { "Retry-After": "60" },
      });
    }
    if (badge === "not-found") {
      return new Response("No AIC Aware badge with this code.", { status: 404 });
    }
    const valid = badge.status === "valid";
    return image(
      render({
        company: badge.organisation,
        tag: valid ? "Self-Declared" : badge.status === "expired" ? "Expired" : "Revoked",
        line: valid
          ? `${badge.code} · valid to ${fmt(badge.expiresAt)} · not AIC Certified`
          : `${badge.code} · ${badge.status === "expired" ? `expired ${fmt(badge.expiresAt)}` : "no longer valid"}`,
        muted: !valid,
      }),
      `aic-aware-badge-${badge.code}.png`,
      download,
      300
    );
  }

  const entry = await findAwareBadgeEntry(slug);
  if (!entry) {
    return new Response("Not found — this organisation hasn't declared via AIC Aware.", {
      status: 404,
    });
  }

  const declaredDate = entry.declaredOn ? fmt(`${entry.declaredOn}T00:00:00Z`) : "an unspecified date";
  return image(
    render({
      company: entry.company,
      tag: "Self-Declared",
      line: `Declared ${declaredDate} · not AIC Certified, not independently verified`,
    }),
    `aic-aware-badge-${slug}.png`,
    download,
    3600
  );
}
