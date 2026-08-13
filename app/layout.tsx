import type { Metadata } from "next";
import "./globals.css";
import { siteAsset } from "./site-path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qoax-community.github.io/qoax-community-website";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "QO.AX Community · Public work first",
  description:
    "QO.AX non-profit work with schools, students, artists, and public-interest organizations.",
  keywords: ["QOAX", "community", "technology", "education", "Sofia", "open source"],
  icons: {
    icon: siteAsset("/brand/qoax-mark.svg"),
    shortcut: siteAsset("/brand/qoax-mark.svg"),
  },
  openGraph: {
    title: "QO.AX Community · Public work first",
    description: "Schools, student programmes, art, and NGOs strengthened through practical technology.",
    type: "website",
    locale: "en_US",
    siteName: "QO.AX Community",
    images: [
      {
        url: siteAsset("/og.png"),
        width: 1731,
        height: 909,
        alt: "QO.AX Community — Build things. Move people.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QO.AX Community · Public work first",
    description: "Schools, students, art, and public-interest organizations.",
    images: [siteAsset("/og.png")],
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
