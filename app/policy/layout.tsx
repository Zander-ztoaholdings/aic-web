import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/policy",
  title: "AI policy and regulation updates",
  description: "Developments in AI regulation and standards that affect accountable AI, from South Africa to the EU, each recorded with its primary source.",
  cardKicker: "Policy updates",
});

// `modal` renders alongside `children` and stays empty (see @modal/default.tsx)
// until an intercepting route fills it, at which point an update opens as a
// centre peek over the list instead of navigating away.
export default function PolicyLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
