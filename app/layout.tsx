import type { Metadata } from "next";
import "./globals.css";
import { siteAsset } from "./site-path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "QOAX Community · Public work first",
  description:
    "QOAX non-profit work with schools, students, artists, and public-interest organizations.",
  keywords: ["QOAX", "community", "technology", "education", "Sofia", "open source"],
  icons: {
    icon: siteAsset("/brand/qoax-q.svg"),
    shortcut: siteAsset("/brand/qoax-q.svg"),
  },
  openGraph: {
    title: "QOAX Community · Public work first",
    description: "Schools, student programmes, art, and NGOs strengthened through practical technology.",
    type: "website",
    locale: "en_US",
    siteName: "QOAX Community",
  },
  twitter: {
    card: "summary",
    title: "QOAX Community · Public work first",
    description: "Schools, students, art, and public-interest organizations.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
