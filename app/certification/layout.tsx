import type { Metadata } from "next";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/certification",
  title: "AI certification: Divisions and assessment",
  description: "How AIC certification works: the five Divisions of human oversight, what an assessment covers, and what a certificate does and does not claim.",
  cardTitle: "How AI accountability certification works",
  cardKicker: "Certification",
});

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI accountability certification",
  serviceType: "Certification of AI accountability and human oversight",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "ZA",
  url: `${SITE_URL}/certification`,
  description: "An evidence-based assessment against 44 published requirements, certifying that a named person stays accountable for an organisation's automated decisions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      {children}
    </>
  );
}
