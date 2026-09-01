import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Industry-specific workshops on how AI-assisted decisioning maps against the safety and governance frameworks your industry already runs on. We teach; we don't consult.",
  openGraph: {
    title: "Workshops | AIC",
    description:
      "Industry-specific workshops on how AI-assisted decisioning maps against the safety and governance frameworks your industry already runs on. We teach; we don't consult.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
