import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Governance Index",
  description:
    "AIC's public index of organisational AI accountability. The index opens with our founding cohort, currently forming.",
  // Not indexed while the Index has nothing published — an empty page that
  // borrows the register's vocabulary competes with /registry for the same
  // search intent and neither ends up authoritative.
  robots: { index: false, follow: true },
  openGraph: {
    title: "AI Governance Index | AIC",
    description:
      "AIC's public index of organisational AI accountability. The index opens with our founding cohort, currently forming.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
