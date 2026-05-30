import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_CONTACT_DATABASE_ID?.trim();

  if (!apiKey || !databaseId) {
    return NextResponse.json({
      error: "Missing env vars",
      hasApiKey: !!apiKey,
      hasDatabaseId: !!databaseId,
    }, { status: 500 });
  }

  const notion = new Client({ auth: apiKey });

  // Step 1: fetch the database schema
  let dbSchema: Record<string, string> = {};
  try {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    dbSchema = Object.fromEntries(
      Object.entries(db.properties).map(([name, prop]) => [name, prop.type])
    );
  } catch (err: unknown) {
    return NextResponse.json({
      step: "retrieve_database",
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }

  // Step 2: try creating a test page
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: "TEST ENTRY — safe to delete" } }] },
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      step: "create_page",
      error: err instanceof Error ? err.message : String(err),
      databaseColumns: dbSchema,
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Test entry created in Notion — check your database",
    databaseColumns: dbSchema,
  });
}
