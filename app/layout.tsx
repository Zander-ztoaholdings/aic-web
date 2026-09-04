import "./globals.css";
import type { Metadata } from "next";
import CookieConsent from "@/app/components/CookieConsent";
import { ClientLayout } from "./components/ClientLayout";

const SITE_URL = "https://aiccertified.cloud";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Integrity Certification | Certifying the human behind the algorithm",
    template: "%s | AIC",
  },
  description:
    "AIC is a South African certification body for AI accountability. We certify that a named human remains accountable for the automated decisions that matter, and publish the result so anyone can check it.",
  keywords: [
    "AI certification",
    "AI accountability",
    "algorithmic accountability",
    "AI governance",
    "AI audit",
    "AI assurance",
    "responsible AI",
    "South Africa",
  ],
  authors: [{ name: "AI Integrity Certification (Pty) Ltd" }],
  creator: "AI Integrity Certification (Pty) Ltd",
  publisher: "AI Integrity Certification (Pty) Ltd",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: "AI Integrity Certification",
    title: "AI Integrity Certification | Certifying the human behind the algorithm",
    description:
      "A South African certification body for AI accountability. We certify that a named human remains accountable for the decisions that matter.",
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
    title: "AI Integrity Certification",
    description:
      "A South African certification body for AI accountability. Certifying the human behind the algorithm.",
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
      "max-video-preview": -1,
    },
  },
  // Relative canonical — resolves against metadataBase + the current route, so
  // every page declares itself canonical. (Previously hard-coded to the
  // homepage, which told search engines every page was a duplicate of "/".)
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/icon", type: "image/png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  category: "technology",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "AI Integrity Certification (Pty) Ltd",
  alternateName: "AIC",
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  description:
    "A South African certification body for AI accountability, built on the five Algorithmic Rights.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "15 Smit Street",
    addressLocality: "Johannesburg",
    addressRegion: "Gauteng",
    postalCode: "2000",
    addressCountry: "ZA",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "zander@ztoaholdings.com",
    contactType: "General Enquiries",
    areaServed: "ZA",
    availableLanguage: "English",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "AI Integrity Certification",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-ZA",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // No hardcoded fallback: the ID was defaulted to a literal, so unsetting
  // NEXT_PUBLIC_GA_ID did not disable analytics — the one control that should
  // have turned it off did nothing.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en-ZA">
      <head>
        {/* Fonts loaded via <link> rather than a CSS @import, so the browser can
            start fetching them in parallel with the stylesheet instead of only
            discovering them after globals.css has downloaded and parsed. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font --
            That rule targets the Pages Router's _document.js, where a font link
            would only apply to one page. This is the App Router root layout, so
            it applies site-wide. Worth revisiting with next/font/google to
            self-host, which would also remove the two external round trips —
            that change means replacing the ~47 inline
            style={{ fontFamily: "'Merriweather', serif" }} usages, since
            next/font generates a hashed family name. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />
        {/* Structured data as plain <script>, not next/script: this guarantees
            it lands in the server-rendered HTML where crawlers read it without
            having to execute JS. (Next's own docs recommend this for JSON-LD.) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <CookieConsent gaId={gaId} />
      </body>
    </html>
  );
}
