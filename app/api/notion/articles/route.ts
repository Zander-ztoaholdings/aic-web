import { NextResponse } from "next/server";
import { getArticles } from "@/lib/notion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") || undefined;
  const pageSize = parseInt(searchParams.get("pageSize") || "12");

  try {
    const data = await getArticles(pageSize, cursor);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching articles from Notion:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
