import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certification Framework",
  description:
    "How AIC certification works: the Five-Division accountability model, what an assessment covers, and what a certificate does and does not claim.",
  openGraph: {
    title: "Certification Framework | AIC",
    description:
      "How AIC certification works: the Five-Division accountability model, what an assessment covers, and what a certificate does and does not claim.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
