import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/disclosures",
  title: "Governance and disclosures",
  description: "AIC's impartiality arrangements, methodology disclosures, appeals process and governance record, published rather than described.",
  cardKicker: "Governance",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
