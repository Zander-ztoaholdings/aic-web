import { ImageResponse } from "next/og";

export const alt = "AI Integrity Certification (Pty) Ltd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a1628",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#c9920a",
            fontSize: 13,
            letterSpacing: 6,
            marginBottom: 32,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          South African Standard · POPIA Compliant
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ffffff",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          <span>AI Integrity</span>
          <span>Certification</span>
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 22,
            maxWidth: 680,
            lineHeight: 1.55,
            display: "flex",
          }}
        >
          The global standard for AI governance, ethics, and human accountability.
        </div>

        <div
          style={{
            marginTop: 64,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#c9920a",
              display: "flex",
            }}
          />
          <div
            style={{
            color: "#c9920a",
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: 4,
              display: "flex",
            }}
          >
            aiccertified.cloud
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
