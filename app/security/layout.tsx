import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/security",
  title: "Security at AIC",
  description: "How AIC protects your data and the evidence you share: encryption, read-only connections, access controls and how to report a vulnerability.",
  cardKicker: "Security",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
