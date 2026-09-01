import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AI Integrity Certification collects, uses and protects personal information, including your rights under POPIA.",
  openGraph: {
    title: "Privacy Policy | AIC",
    description:
      "How AI Integrity Certification collects, uses and protects personal information, including your rights under POPIA.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
