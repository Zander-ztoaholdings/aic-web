import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/insurers",
  title: "AI risk for insurers and underwriters",
  description: "A verifiable signal of AI accountability for underwriters: what an AIC record shows, how to check it without asking the insured, and what AIC does not do.",
  cardTitle: "You are already writing AI risk. You just cannot see it.",
  cardKicker: "For insurers",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
