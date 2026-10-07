import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact AIC",
  description: "Talk to AI Integrity Certification about certification, the platform, workshops, the regulatory map or partnership. Based in Johannesburg, South Africa.",
  cardKicker: "Contact",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
