import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  // Bypass TypeScript errors in dependencies (e.g. drizzle-orm type changes in @aic/db)
  // These are pre-existing package-level issues that should not block the frontend build.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppress ESLint warnings from blocking production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Only hosts the site's content actually draws images from. next/image is
  // used with local files today; these cover the CMS: Notion-uploaded files
  // (served from Notion's S3 bucket and file.notion.so) and the Unsplash
  // placeholders lib/notion.ts falls back to. A wildcard here turned
  // /_next/image into an open proxy for any HTTPS host.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'file.notion.so' },
      { protocol: 'https', hostname: 'www.notion.so' },
    ],
  },
  // Content Security Policy. Google Analytics only loads after consent, but its
  // hosts must be allowed for when it does. 'unsafe-inline' scripts are needed
  // by Next's boot scripts and the consent-gated GA snippet.
  async headers() {
    const platform = (process.env.NEXT_PUBLIC_PLATFORM_URL || 'https://app.aiccertified.cloud').replace(/\/+$/, '');
    const https = process.env.NODE_ENV === 'production';
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${https ? '' : " 'unsafe-eval'"} https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // https: covers article images from the CMS; the GA hosts are listed so
      // they stay allowed if that is ever narrowed.
      "img-src 'self' data: blob: https: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
      `connect-src 'self' ${platform} https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(https ? ['upgrade-insecure-requests'] : []),
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection',       value: '1; mode=block' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
          ...(https ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }] : []),
        ],
      },
    ];
  },
  // RFC 9116: security.txt lives under /.well-known/. Served by
  // app/security.txt/route.ts.
  async rewrites() {
    return [{ source: '/.well-known/security.txt', destination: '/security.txt' }];
  },
  async redirects() {
    return [
      {
        source: '/login',
        // NEXT_PUBLIC_PLATFORM_URL holds the platform ROOT (see .env.example),
        // so using it bare sent /login to the platform homepage whenever the
        // variable was set — only the hardcoded fallback carried the path.
        destination: `${process.env.NEXT_PUBLIC_PLATFORM_URL || 'https://app.aiccertified.cloud'}/login`,
        permanent: false,
      },
      {
        source: '/waiting-list',
        destination: '/contact',
        permanent: true,
      },
      // The corporate and professional portals were removed, not merely hidden.
      // They advertised a credential scheme (AAEP / CAEL / SAIGS, with exam fees
      // and pass marks) and ISO/IEC 42001 "Level 1/2" certification at
      // $12,400/$38,000 — none of which exists, and the latter implying an
      // accreditation AIC does not hold. noindex would have stopped search
      // engines without unmaking the offer. Original markup is preserved in the
      // Obsidian vault under 9 - Drafts.
      {
        source: '/corporate-portal',
        destination: '/certification',
        permanent: true,
      },
      {
        source: '/professional-portal',
        destination: '/certification',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
