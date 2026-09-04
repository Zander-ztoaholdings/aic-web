import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = process.env.NOTION_API_KEY 
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;

const n2m = notion ? new NotionToMarkdown({ notionClient: notion }) : null;

const ARTICLES_DATABASE_ID = process.env.NOTION_ARTICLES_DATABASE_ID;
const POLICY_UPDATES_DATABASE_ID = process.env.NOTION_POLICY_UPDATES_DATABASE_ID;

/**
 * Returns null when the CMS cannot be reached or is not configured, and an
 * empty results array when it is reachable but has nothing published.
 *
 * These must stay distinguishable. Previously every failure was swallowed into
 * an empty array, so /articles told visitors "nothing published here yet" when
 * the truth was that the database ID pointed at a deleted page. Same failure
 * mode the registry had, and the same fix: an outage is not a fact about the
 * world, and the page should not state it as one.
 */
export async function getArticles(pageSize = 12, startCursor?: string) {
  if (!notion || !ARTICLES_DATABASE_ID) {
    console.warn("[notion] articles not configured (missing API key or database ID)");
    return null;
  }

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
    return null;
  }
}

export async function getArticleBySlug(slug: string) {
  if (!notion || !n2m || !ARTICLES_DATABASE_ID) return null;

  try {
    const response = await notion.databases.query({
      database_id: ARTICLES_DATABASE_ID,
      // Status is filtered here as well as on Slug. Without it, ANY draft was
      // publicly readable by URL — the article list correctly hid unpublished
      // rows while /articles/<slug> served them in full to anyone with the
      // link. Drafts are exactly the things not ready to be read.
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Status", select: { equals: "Published" } },
        ],
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

/** Null when unreachable/unconfigured; empty results when simply nothing is
 *  published. See the note on getArticles. */
export async function getPolicyUpdates(pageSize = 4, startCursor?: string) {
  if (!notion || !POLICY_UPDATES_DATABASE_ID) {
    console.warn("[notion] policy updates not configured (missing API key or database ID)");
    return null;
  }

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
        // Empty when the row predates the Slug property or an editor left it
        // blank. Callers must treat a slug-less update as unlinkable rather
        // than linking to /policy/undefined.
        slug: page.properties.Slug?.rich_text[0]?.plain_text || "",
        // Which jurisdictions this update touches, used to attach it to
        // countries on the regulatory map and to scope alert subscriptions.
        jurisdictions: (page.properties.Jurisdictions?.multi_select ?? []).map(
          (o: any) => o.name
        ) as string[],
      };
    });

    return {
      results,
      nextCursor: response.next_cursor,
    };
  } catch (error) {
    console.error("Notion API Error (getPolicyUpdates):", error);
    return null;
  }
}

/**
 * A single policy update with its body.
 *
 * Same Status filter as getArticleBySlug, and for the same reason: without it
 * a draft is publicly readable by anyone holding the URL, which defeats the
 * point of having a draft state. The Slug filter alone is not access control.
 *
 * Returns null both for "not found" and "not configured" — the caller renders
 * notFound() either way, because a 404 is the honest answer to a URL we cannot
 * serve, and an outage banner on a single update would be noise.
 */
export async function getPolicyUpdateBySlug(slug: string) {
  if (!notion || !n2m || !POLICY_UPDATES_DATABASE_ID) return null;

  try {
    const response = await notion.databases.query({
      database_id: POLICY_UPDATES_DATABASE_ID,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Status", select: { equals: "Published" } },
        ],
      },
    });

    const page = response.results[0];
    if (!page) return null;

    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
      id: page.id,
      title: (page as any).properties.Title?.title[0]?.plain_text || "Untitled Update",
      summary: (page as any).properties.Summary?.rich_text[0]?.plain_text || "",
      tag: (page as any).properties.Tag?.select?.name || "Update",
      date: (page as any).properties.Date?.date?.start || "",
      slug,
      content: mdString.parent,
    };
  } catch (error) {
    console.error("Notion API Error (getPolicyUpdateBySlug):", error);
    return null;
  }
}

/**
 * Slugs of every published update, for generateStaticParams and the sitemap.
 * Rows without a slug are dropped: they have no addressable URL.
 */
export async function getPolicyUpdateSlugs(): Promise<string[]> {
  if (!notion || !POLICY_UPDATES_DATABASE_ID) return [];

  try {
    const response = await notion.databases.query({
      database_id: POLICY_UPDATES_DATABASE_ID,
      filter: { property: "Status", select: { equals: "Published" } },
      page_size: 100,
    });
    return response.results
      .map((page: any) => page.properties.Slug?.rich_text[0]?.plain_text || "")
      .filter(Boolean);
  } catch (error) {
    console.error("Notion API Error (getPolicyUpdateSlugs):", error);
    return [];
  }
}
