/**
 * Social channels, loaded from NEXT_PUBLIC_* environment variables at build time.
 * Leave a variable empty and the channel is not rendered anywhere (footer, schema.org
 * sameAs). Fill it in `.github/workflows/deploy-pages.yml` (production) or `.env.local`
 * (local builds) and rebuild to make the link appear. Values must be full URLs.
 */
const clean = (value: string | undefined) => (value ?? "").trim();

const channels = [
  { id: "facebook", label: "Facebook", url: clean(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK) },
  { id: "instagram", label: "Instagram", url: clean(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM) },
  { id: "linkedin", label: "LinkedIn", url: clean(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) },
  { id: "youtube", label: "YouTube", url: clean(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE) },
  { id: "tiktok", label: "TikTok", url: clean(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK) },
  { id: "discord", label: "Discord", url: clean(process.env.NEXT_PUBLIC_SOCIAL_DISCORD) },
  { id: "viber", label: "Viber", url: clean(process.env.NEXT_PUBLIC_SOCIAL_VIBER) },
] as const;

export type SocialLink = { id: string; label: string; url: string };

/** Only channels with a non-empty URL. Empty today by design. */
export const socialLinks: SocialLink[] = channels.filter((channel) => channel.url.length > 0);

/** Google Search Console HTML-tag verification token (the `content` value only). */
export const googleSiteVerification = clean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
