import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Portal",
  description:
    "Organisational certification portal.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Corporate Portal | AIC",
    description:
      "Organisational certification portal.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
