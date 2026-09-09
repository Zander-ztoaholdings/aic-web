import type { Metadata } from "next";
import CountrySilhouetteLayer from "@/app/components/CountrySilhouetteLayer";

export const metadata: Metadata = {
  title: "Regulatory Map",
  description:
    "An interactive map of AI regulation by jurisdiction, with draft compliance-measure summaries. Coverage is deliberately partial — we map what we can verify.",
  openGraph: {
    title: "Regulatory Map | AIC",
    description:
      "An interactive map of AI regulation by jurisdiction, with draft compliance-measure summaries. Coverage is deliberately partial — we map what we can verify.",
  },
};

/**
 * This layout wraps both the map and every jurisdiction page, which is the
 * whole reason CountrySilhouetteLayer lives here: a shared layout is not
 * unmounted when you navigate between its children, so the country silhouette
 * is literally the same element before and after the route commit. Move it
 * into either page and the animation dies at the boundary.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CountrySilhouetteLayer />
    </>
  );
}
