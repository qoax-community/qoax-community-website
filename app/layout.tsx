import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteAsset } from "./site-path";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
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
  keywords: ["Qoax", "community", "non-profit", "technology", "education", "Sofia", "Bulgaria", "hackathon", "internship"],
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
    images: [{ url: siteAsset("/og.png"), width: 1200, height: 630, alt: "Qoax Community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qoax Community",
    description: "Schools, students, art, and public-interest organizations. Public work first.",
    images: [siteAsset("/og.png")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
