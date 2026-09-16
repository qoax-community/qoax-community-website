import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArchiveEntry } from "../../archive-data";
import { authors, formatDate, getPost, postPreviewImage, posts, readingTime, relatedPosts, shortDate, wordCount } from "../../blog-data";
import { pageMetadata } from "../../seo";
import { Ava, Btn, ContentBlock, PostCard, Shell } from "../../editorial";
import ed from "../../editorial.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

// Static export needs at least one path here. Before the first post is published we emit a
// single placeholder that renders the not-found page, so the journal can ship empty.
const placeholderSlug = "coming-soon";

export function generateStaticParams() {
  if (posts.length === 0) return [{ slug: placeholderSlug }];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const author = authors[post.authorSlug];
  const base = pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    image: postPreviewImage(post),
    keywords: [...post.tags, post.category, "Qoax", "Коакс", "Куакс"],
  });
  return {
    ...base,
    authors: [{ name: author.name, url: `${siteUrl}/about/` }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [author.name],
      section: post.category,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = authors[post.authorSlug];
  const record = post.record ? getArchiveEntry(post.record) : undefined;
  const more = relatedPosts(post, 3);
  const url = `${siteUrl}/blog/${post.slug}/`;

  const person =
    author.slug === "qoax-community"
      ? { "@id": `${siteUrl}/#organization` }
      : {
          "@type": "Person",
          "@id": `${siteUrl}/about/#${author.slug}`,
          name: author.name,
          affiliation: { "@id": `${siteUrl}/#organization` },
          url: `${siteUrl}/about/`,
          ...(author.github ? { sameAs: [author.github] } : {}),
        };

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "en",
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    wordCount: wordCount(post),
    author: person,
    publisher: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@type": "Blog", "@id": `${siteUrl}/blog/#blog`, name: "Qoax Community Journal", url: `${siteUrl}/blog/` },
    ...(record ? { about: { "@type": "Event", name: record.title, url: `${siteUrl}/projects/${record.slug}/` } } : {}),
  };

  return (
    <Shell>
      <article>
        <header className={ed.wrap}>
          <nav className={ed.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/blog">Journal</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{post.category}</span>
          </nav>
          <div className={ed.postHead}>
            <div>
              <p className={ed.mono}>{`${post.category} · ${readingTime(post)} min read`}</p>
              <h1>{post.title}</h1>
              <p className={ed.lede}>{post.lede}</p>
            </div>
            <aside className={ed.postByline} aria-label="Author and publication details">
              <div className={ed.postWho}>
                <Ava authorSlug={post.authorSlug} large />
                <div>
                  <strong>{author.name}</strong>
                  <span>{author.affiliation}</span>
                </div>
              </div>
              <dl className={`${ed.kv} ${ed.postKv}`}>
                <div className={ed.kvRow}><dt>Published</dt><dd><time dateTime={post.published}>{formatDate(post.published)}</time></dd></div>
                {post.updated && (
                  <div className={ed.kvRow}><dt>Updated</dt><dd><time dateTime={post.updated}>{formatDate(post.updated)}</time></dd></div>
                )}
                <div className={ed.kvRow}><dt>Category</dt><dd><Link href={`/blog/#${post.category.toLowerCase().replace(/\s+/g, "-")}`}>{post.category}</Link></dd></div>
                {record && (
                  <div className={ed.kvRow}><dt>Record</dt><dd><Link href={`/projects/${record.slug}`}>{record.title}</Link></dd></div>
                )}
              </dl>
            </aside>
          </div>
        </header>

        <div className={`${ed.wrap} ${ed.body}`}>
          <nav className={ed.toc} aria-label="On this page">
            <h2>On this page</h2>
            <ol>
              {post.sections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>
              ))}
            </ol>
          </nav>

          <div className={ed.article}>
            {post.sections.map((section, index) => (
              <section aria-labelledby={`${section.id}-heading`} key={section.id}>
                <h2 id={section.id}><span id={`${section.id}-heading`}>{section.heading}</span></h2>
                {section.blocks.map((block, blockIndex) => <ContentBlock block={block} key={`${section.id}-${blockIndex}`} />)}
                {index === 0 && post.pull && (
                  <blockquote className={ed.pull}>
                    <p>{post.pull.text}</p>
                    {post.pull.source && <footer>{post.pull.source}</footer>}
                  </blockquote>
                )}
              </section>
            ))}
            <p className={ed.mono} style={{ marginTop: 40 }}>
              {`Written by ${author.name} · ${author.affiliation} · ${shortDate(post.published)}`}
            </p>
          </div>

          <aside className={ed.side}>
            <div>
              <h2>Tags</h2>
              <div className={ed.sideTags}>{post.tags.map((tag) => <span className={ed.tag} key={tag}>{tag}</span>)}</div>
            </div>
            {record && (
              <div>
                <h2>Related record</h2>
                <Link className={ed.related} href={`/projects/${record.slug}`}>
                  <span>{record.year}</span>
                  <strong>{record.title}</strong>
                  <span>{record.subtitle}</span>
                </Link>
              </div>
            )}
            {post.externalUrl && (
              <div>
                <h2>Elsewhere</h2>
                <ul><li><a href={post.externalUrl} rel="noreferrer" target="_blank">{post.externalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗</a></li></ul>
              </div>
            )}
            <div>
              <h2>Share</h2>
              <ul>
                <li><a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`}>Send by email</a></li>
                <li><Link href="/blog/feed.xml">RSS feed</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section className={ed.more} aria-labelledby="more-title">
          <div className={ed.wrap}>
            <div className={ed.secHead}>
              <div>
                <p className={ed.mono}>More from the journal</p>
                <h2 id="more-title">Keep <em>reading.</em></h2>
              </div>
              <div className={ed.secHeadAction}><Btn href="/blog" variant="ghost" small>All posts</Btn></div>
            </div>
            <div className={ed.posts}>{more.map((candidate) => <PostCard post={candidate} key={candidate.slug} />)}</div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Shell>
  );
}
