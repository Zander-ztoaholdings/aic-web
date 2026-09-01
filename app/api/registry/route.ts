import { NextRequest, NextResponse } from "next/server";
import { listRegistry, verifyCertificate } from "@/lib/registry";

// Public registry API.
//
// Rewritten to comply with D6 (no numeric scores on the registry). The previous
// implementation returned `integrity_score` on every record and filtered on
// `integrityScore >= 100`, which both breached D6 and used a threshold that
// exists nowhere in the certification framework (the bands are 80+ / 60–79).
// It also verified against `organizations.id` — an internal UUID — rather than
// the certificate number printed on the badge.
//
// All score handling now lives in lib/registry.ts, where the number is
// converted to a status band and dropped. See the header comment there.

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const verifyId = searchParams.get("verify_id") ?? searchParams.get("cert_id");

  if (verifyId) {
    const result = await verifyCertificate(verifyId);

    switch (result.outcome) {
      case "listed":
        return NextResponse.json({
          verified: true,
          listed: true,
          certificate: result.listing,
          verified_at: new Date().toISOString(),
        });

      case "confirmed-unlisted":
        return NextResponse.json({
          verified: true,
          listed: false,
          certificate: {
            certId: result.certId,
            organisation: result.organisation,
            status: result.status,
            scope: result.scope,
            issued: result.issued,
          },
          verified_at: new Date().toISOString(),
        });

      case "not-current":
        return NextResponse.json({
          verified: true,
          listed: true,
          current: false,
          certificate: {
            certId: result.certId,
            organisation: result.organisation,
            status: result.status,
            since: result.since,
          },
          verified_at: new Date().toISOString(),
        });

      case "register-empty":
      case "no-record":
        return NextResponse.json(
          { verified: false, error: "No record" },
          { status: 404 }
        );

      case "unavailable":
        // Explicitly not a 404: saying "no record" during an outage would be an
        // untrue negative answer about a certificate that may well be valid.
        return NextResponse.json(
          { error: "Verification temporarily unavailable" },
          { status: 503 }
        );
    }
  }

  const listings = await listRegistry();

  if (listings === null) {
    return NextResponse.json(
      { error: "Registry temporarily unavailable" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    registry: listings,
    count: listings.length,
    retrieved_at: new Date().toISOString(),
  });
}
