import type { MetadataRoute } from "next";
import { archiveEntries } from "./archive-data";
import { sortedPosts } from "./blog-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

export const dynamic = "force-static";

const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/faq/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/events/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/work/", priority: 0.8, changeFrequency: "weekly" },
  { path: "/schools/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/privacy/", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms/", priority: 0.3, changeFrequency: "yearly" },
  { path: "/gdpr/", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const projectRoutes: MetadataRoute.Sitemap = archiveEntries.map((entry) => ({
    url: `${siteUrl}/projects/${entry.slug}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const postRoutes: MetadataRoute.Sitemap = sortedPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}/`,
    lastModified: new Date(`${post.updated ?? post.published}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...projectRoutes,
    ...postRoutes,
  ];
}
