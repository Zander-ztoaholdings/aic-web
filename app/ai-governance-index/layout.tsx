import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Governance Index",
  description:
    "AIC's public index of organisational AI accountability. The index opens with our founding cohort, currently forming.",
  openGraph: {
    title: "AI Governance Index | AIC",
    description:
      "AIC's public index of organisational AI accountability. The index opens with our founding cohort, currently forming.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
