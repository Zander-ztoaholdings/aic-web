import { NextResponse } from "next/server";
import { getPolicyUpdates } from "@/lib/notion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") || undefined;
  const pageSize = parseInt(searchParams.get("pageSize") || "4");

  try {
    const data = await getPolicyUpdates(pageSize, cursor);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching policy updates from Notion:", error);
    return NextResponse.json({ error: "Failed to fetch policy updates" }, { status: 500 });
  }
}
