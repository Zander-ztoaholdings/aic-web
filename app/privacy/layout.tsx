import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy notice",
  description: "How AI Integrity Certification collects, uses and protects personal information, what it reads from connected systems, and your rights under POPIA.",
  cardKicker: "Privacy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
