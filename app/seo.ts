import type { Metadata } from "next";
import { siteAsset } from "./site-path";

export const SITE_NAME = "Qoax Community";

export const defaultOgImage = {
  url: siteAsset("/og.png"),
  width: 1200,
  height: 630,
  alt: "Qoax Community · qo.ax",
};

type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path with trailing slash, e.g. "/about/". Used for og:url. */
  path?: string;
  /** Optional page-specific image (PNG/JPG/WebP), already passed through siteAsset(). SVGs fall back to the default card. */
  image?: string | null;
  keywords?: string[];
};

/**
 * Builds page metadata with complete Open Graph and Twitter cards. Next.js does not
 * merge nested `openGraph`/`twitter` objects with the root layout, so every page
 * that sets its own title must also carry the full card, otherwise link previews in
 * Discord, Viber, Slack, or LinkedIn fall back to a title-less preview.
 */
export function pageMetadata({ title, description, path, image, keywords }: PageMetadataInput): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  const usableImage = image && !image.endsWith(".svg") ? image : null;
  const ogImages = usableImage ? [{ url: usableImage, alt: title }, defaultOgImage] : [defaultOgImage];
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      ...(path ? { url: path } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [usableImage ?? defaultOgImage.url],
    },
  };
}
