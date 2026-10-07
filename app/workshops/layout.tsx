import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/workshops",
  title: "AI governance workshops for executives",
  description: "Workshops on how AI decisioning maps onto the frameworks your industry already uses, ending with South African regulation. We teach; we do not consult.",
  cardTitle: "AI governance workshops for executives",
  cardKicker: "Workshops",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
