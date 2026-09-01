import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Registry",
  description:
    "The public register of AIC-certified organisations. Search by name, or check a status band. The register opens with our founding cohort, currently forming.",
  openGraph: {
    title: "Public Registry | AIC",
    description:
      "The public register of AIC-certified organisations. Search by name, or check a status band. The register opens with our founding cohort, currently forming.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
