import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to AI Integrity Certification about certification, insurer recognition, workshops or partnership. Based in Johannesburg, South Africa.",
  openGraph: {
    title: "Contact | AIC",
    description:
      "Talk to AI Integrity Certification about certification, insurer recognition, workshops or partnership. Based in Johannesburg, South Africa.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
