import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Portal",
  description:
    "Individual credential portal.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Professional Portal | AIC",
    description:
      "Individual credential portal.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
