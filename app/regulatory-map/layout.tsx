import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulatory Map",
  description:
    "An interactive map of AI regulation by jurisdiction, with draft compliance-measure summaries. Coverage is deliberately partial — we map what we can verify.",
  openGraph: {
    title: "Regulatory Map | AIC",
    description:
      "An interactive map of AI regulation by jurisdiction, with draft compliance-measure summaries. Coverage is deliberately partial — we map what we can verify.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
