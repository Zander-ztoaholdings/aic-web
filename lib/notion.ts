import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = process.env.NOTION_API_KEY 
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;

const n2m = notion ? new NotionToMarkdown({ notionClient: notion }) : null;

const ARTICLES_DATABASE_ID = process.env.NOTION_ARTICLES_DATABASE_ID;
const POLICY_UPDATES_DATABASE_ID = process.env.NOTION_POLICY_UPDATES_DATABASE_ID;

export async function getArticles(pageSize = 12, startCursor?: string) {
  if (!notion || !ARTICLES_DATABASE_ID) return { results: [], nextCursor: null };

  try {
    const response = await notion.databases.query({
      database_id: ARTICLES_DATABASE_ID,
      page_size: pageSize,
      start_cursor: startCursor,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const results = response.results.map((page: any) => {
      return {
        id: page.id,
        title: page.properties.Title?.title[0]?.plain_text || "Untitled",
        excerpt: page.properties.Excerpt?.rich_text[0]?.plain_text || "",
        category: page.properties.Category?.select?.name || "Uncategorized",
        author: page.properties.Author?.rich_text[0]?.plain_text || "AIC Team",
        date: page.properties.Date?.date?.start || "",
        readTime: page.properties.ReadTime?.rich_text[0]?.plain_text || "5 min read",
        image: page.properties.Image?.url || "https://images.unsplash.com/photo-1764087957302-ef0756ed8e0a?auto=format&fit=crop&q=80&w=1080",
        featured: page.properties.Featured?.checkbox || false,
        slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
      };
    });

    return {
      results,
      nextCursor: response.next_cursor,
    };
  } catch (error) {
    console.error("Notion API Error (getArticles):", error);
    return { results: [], nextCursor: null };
  }
}

export async function getArticleBySlug(slug: string) {
  if (!notion || !n2m || !ARTICLES_DATABASE_ID) return null;

  try {
    const response = await notion.databases.query({
      database_id: ARTICLES_DATABASE_ID,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    const page = response.results[0];
    if (!page) return null;

    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
      id: page.id,
      title: (page as any).properties.Title?.title[0]?.plain_text || "Untitled",
      excerpt: (page as any).properties.Excerpt?.rich_text[0]?.plain_text || "",
      category: (page as any).properties.Category?.select?.name || "Uncategorized",
      author: (page as any).properties.Author?.rich_text[0]?.plain_text || "AIC Team",
      date: (page as any).properties.Date?.date?.start || "",
      readTime: (page as any).properties.ReadTime?.rich_text[0]?.plain_text || "5 min read",
      image: (page as any).properties.Image?.url || "https://images.unsplash.com/photo-1764087957302-ef0756ed8e0a?auto=format&fit=crop&q=80&w=1080",
      content: mdString.parent,
    };
  } catch (error) {
    console.error("Notion API Error (getArticleBySlug):", error);
    return null;
  }
}

export async function getPolicyUpdates(pageSize = 4, startCursor?: string) {
  if (!notion || !POLICY_UPDATES_DATABASE_ID) return { results: [], nextCursor: null };

  try {
    const response = await notion.databases.query({
      database_id: POLICY_UPDATES_DATABASE_ID,
      page_size: pageSize,
      start_cursor: startCursor,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const results = response.results.map((page: any) => {
      return {
        id: page.id,
        date: page.properties.Date?.date?.start || "",
        tag: page.properties.Tag?.select?.name || "Update",
        title: page.properties.Title?.title[0]?.plain_text || "Untitled Update",
        summary: page.properties.Summary?.rich_text[0]?.plain_text || "",
      };
    });

    return {
      results,
      nextCursor: response.next_cursor,
    };
  } catch (error) {
    console.error("Notion API Error (getPolicyUpdates):", error);
    return { results: [], nextCursor: null };
  }
}
