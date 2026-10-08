import { notFound } from "next/navigation";
import { getPolicyUpdateBySlug } from "@/lib/notion";
import PeekArticle from "@/app/components/PeekArticle";

// Intercepting route: the centre peek for an update opened from /policy. A
// refresh, a shared link or a crawler gets the full page.
export const revalidate = 300;

export default async function PolicyUpdatePeek({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = await getPolicyUpdateBySlug(slug);
  if (!u) notFound();
  return <PeekArticle href={`/policy/${slug}`} kicker={`Policy update, ${u.tag === "Update" ? "regulatory" : u.tag.toLowerCase()}`} title={u.title} summary={u.summary} date={u.date} author="" content={u.content} />;
}
