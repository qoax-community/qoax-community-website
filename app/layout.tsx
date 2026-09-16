import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Literata } from "next/font/google";
import "./globals.css";
import { GITHUB_URL } from "./components";
import { defaultOgImage } from "./seo";
import { googleSiteVerification, socialLinks } from "./social-links";
import { brandAlternateNames } from "./brand-names";
import { legalEntity } from "./legal-data";
import { siteAsset } from "./site-path";
import { AnalyticsConsent } from "./analytics-consent";

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-literata",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qoax Community · Technology, taught and built with people",
    template: "%s · Qoax Community",
  },
  description:
    "Qoax Community is an independent non-profit in Sofia, Bulgaria. We build useful software, teach project-led programming, and support schools, students, artists, and civic organizations.",
  keywords: [
    "Qoax",
    "QOAX Community",
    "КОАКС КОМЮНИТИ",
    "Коакс",
    "Коакс Комюнити",
    "Куакс",
    "Kuaks",
    "Koaks",
    "Quax",
    "qo.ax",
    "community",
    "non-profit",
    "technology",
    "education",
    "Sofia",
    "Bulgaria",
    "hackathon",
    "internship",
  ],
  alternates: { canonical: "./", types: { "application/rss+xml": "/blog/feed.xml" } },
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [
      { url: siteAsset("/brand/qoax-favicon-community.svg"), type: "image/svg+xml" },
      { url: siteAsset("/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    shortcut: siteAsset("/brand/qoax-favicon-community.svg"),
    apple: siteAsset("/apple-touch-icon.png"),
  },
  openGraph: {
    title: "Qoax Community · Technology, taught and built with people",
    description: "Schools, student programmes, art, and NGOs strengthened through practical technology. Public work first.",
    type: "website",
    locale: "en_US",
    siteName: "Qoax Community",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qoax Community",
    description: "Schools, students, art, and public-interest organizations. Public work first.",
    images: [defaultOgImage.url],
  },
};

/**
 * Organization schema for qo.ax. The Bulgarian legal name and UIC (ЕИК) are
 * included so Google for Nonprofits and Search can tie the domain to the
 * registered association "Сдружение КОАКС КОМЮНИТИ".
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["NGO", "Organization"],
  "@id": `${siteUrl}/#organization`,
  name: "Qoax Community",
  legalName: legalEntity.nameBg,
  alternateName: [legalEntity.nameEn, ...brandAlternateNames],
  url: `${siteUrl}/`,
  logo: `${siteUrl}${siteAsset("/icon-512.png")}`,
  image: `${siteUrl}${siteAsset("/og.png")}`,
  email: legalEntity.contactEmail,
  foundingDate: "2026-07-24",
  nonprofitStatus: "NonprofitType",
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ЕИК / UIC (Bulgarian Registry Agency)",
    value: legalEntity.uic,
  },
  taxID: legalEntity.uic,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ж.к. Хаджи Димитър, бл. 133, вх. А, ет. 4, ап. 18",
    addressLocality: "Sofia",
    addressRegion: "Sofia",
    addressCountry: "BG",
  },
  areaServed: { "@type": "Country", name: "Bulgaria" },
  sameAs: [GITHUB_URL, ...socialLinks.map((link) => link.url)],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Qoax Community",
  alternateName: ["qo.ax", "QOAX Community", "Коакс Комюнити", "Kuaks"],
  url: `${siteUrl}/`,
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${literata.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <AnalyticsConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </body>
    </html>
  );
}
