import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ClientLayout } from "./components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiccertified.cloud"),
  title: {
    default: "AI Integrity Certification | Certifying Responsible AI Leaders",
    template: "%s | AIC",
  },
  description:
    "Certifying the human behind the algorithm. AIC is the world's premier accreditation body for AI governance and ethics. Join thousands of Chief AI Officers, ethics leaders, and organizations building accountable, transparent, and trustworthy AI systems that put humanity first.",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://aiccertified.cloud",
    siteName: "AI Integrity Certification",
    title: "AI Integrity Certification | Certifying Responsible AI Leaders",
    description:
      "Certifying the human behind the algorithm. AIC is the world's premier accreditation body for AI governance and ethics. Join thousands of leaders building accountable, transparent, and trustworthy AI systems.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI Integrity Certification — AIC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integrity Certification | Certifying Responsible AI Leaders",
    description:
      "Certifying the human behind the algorithm. AIC is the world's premier accreditation body for AI governance and ethics.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://aiccertified.cloud",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/icon", type: "image/png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AI Integrity Certification (Pty) Ltd",
  alternateName: "AIC",
  url: "https://aiccertified.cloud",
  logo: "https://aiccertified.cloud/icon",
  description:
    "South Africa's first algorithmic accountability certification body, built on the five Algorithmic Rights.",
  foundingDate: "2026",
  foundingLocation: "Johannesburg, South Africa",
  areaServed: "ZA",
  contactPoint: {
    "@type": "ContactPoint",
    email: "zander@ztoaholdings.com",
    contactType: "General Enquiries",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-G7QB1VX27Q";

  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
