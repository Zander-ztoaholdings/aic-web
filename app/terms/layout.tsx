import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of the AI Integrity Certification website, registry and verification service.",
  openGraph: {
    title: "Terms of Use | AIC",
    description:
      "The terms governing use of the AI Integrity Certification website, registry and verification service.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
