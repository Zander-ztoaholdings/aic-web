import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance and Disclosures",
  description:
    "AIC's impartiality arrangements, methodology disclosures, appeals process and governance record — published rather than described.",
  openGraph: {
    title: "Governance and Disclosures | AIC",
    description:
      "AIC's impartiality arrangements, methodology disclosures, appeals process and governance record — published rather than described.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
