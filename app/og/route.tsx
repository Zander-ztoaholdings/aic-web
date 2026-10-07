import { ImageResponse } from "next/og";

/**
 * Share cards for every page: /og?title=…&kicker=…
 *
 * One template, so a page shared on LinkedIn unfurls with its own headline
 * rather than the home page's. Navy ground, white headline, the brass rule
 * that marks AIC elsewhere; no claims beyond the page's own title.
 */
export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "AI Integrity Certification").slice(0, 110);
  const kicker = (searchParams.get("kicker") || "aiccertified.cloud").slice(0, 60);
  const size = title.length > 70 ? 52 : title.length > 40 ? 62 : 72;

  return new ImageResponse(
    (
      <div style={{ background: "#0a1728", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>AIC</div>
          <div style={{ display: "flex", width: 10, height: 10, borderRadius: 10, background: "#c9920a" }} />
          <div style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: 24, fontFamily: "sans-serif" }}>AI Integrity Certification</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: 26, marginBottom: 22, fontFamily: "sans-serif" }}>{kicker}</div>
          <div style={{ display: "flex", color: "#ffffff", fontSize: size, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", width: 120, height: 4, background: "#a8772a" }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
