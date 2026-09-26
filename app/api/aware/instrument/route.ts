import { NextResponse } from "next/server";
import { getAwareInstrument } from "@/lib/aware-instrument";

// Public by design: these are the same questions anyone can read by taking the
// assessment at /aware. The platform fetches them from here so it never holds
// a competing copy.
export async function GET() {
  return NextResponse.json(getAwareInstrument(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
