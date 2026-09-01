import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impartiality Statement",
  description:
    "Why AIC never certifies an organisation it has advised, and the structural safeguards that keep certification independent of commercial relationships.",
  openGraph: {
    title: "Impartiality Statement | AIC",
    description:
      "Why AIC never certifies an organisation it has advised, and the structural safeguards that keep certification independent of commercial relationships.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
