import { authors, sortedPosts } from "../../blog-data";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

function escape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
  const items = sortedPosts
    .map((post) => {
      const author = authors[post.authorSlug];
      const url = `${siteUrl}/blog/${post.slug}/`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.published}T09:00:00Z`).toUTCString()}</pubDate>
      <dc:creator>${escape(author.name)}</dc:creator>
      <category>${escape(post.category)}</category>
      <description>${escape(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Qoax Community Journal</title>
    <link>${siteUrl}/blog/</link>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes from the work of Qoax Community (Коакс Комюнити): events, programmes, and the software we build for public-interest organisations in Bulgaria.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
