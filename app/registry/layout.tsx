import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/registry",
  title: "Public register of AI-certified organisations",
  description: "The public register of organisations certified against the AIC standard, with each one's status band. It opens with the founding cohort.",
  cardTitle: "The public register of AI-certified organisations",
  cardKicker: "Public register",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
