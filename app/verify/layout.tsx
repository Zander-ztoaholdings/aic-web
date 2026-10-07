import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/verify",
  title: "Verify an AIC certificate",
  description: "Check an AIC certificate directly with the certification body. No login: status, scope and expiry, confirmed at source rather than taken on trust.",
  cardKicker: "Verify",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
