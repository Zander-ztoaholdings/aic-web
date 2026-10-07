import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/impartiality",
  title: "Impartiality statement",
  description: "Why AIC never certifies an organisation it has advised, and the safeguards that keep certification independent of the tools and workshops AIC offers.",
  cardKicker: "Impartiality",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
