import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Insurers and Underwriters",
  description:
    "How underwriters recognise and verify AIC certification, what the mark verifies, and the boundary AIC keeps between certifying governance and pricing risk.",
  openGraph: {
    title: "For Insurers and Underwriters | AIC",
    description:
      "How underwriters recognise and verify AIC certification, what the mark verifies, and the boundary AIC keeps between certifying governance and pricing risk.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
