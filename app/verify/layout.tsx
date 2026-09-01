import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Check an AIC certificate ID directly with the certification body. No login, no waiting — status, scope and expiry, confirmed at source rather than taken on trust.",
  openGraph: {
    title: "Verify a Certificate | AIC",
    description:
      "Check an AIC certificate ID directly with the certification body. No login, no waiting — status, scope and expiry, confirmed at source rather than taken on trust.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
