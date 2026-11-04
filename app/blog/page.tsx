import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL } from "../components";
import { categoryAnchor, featuredPost, groupPostsByCategory, postCategories, postPreviewImage, sortedPosts } from "../blog-data";
import { Btn, Byline, PageHead, PostRow, Shell } from "../editorial";
import ed from "../editorial.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Journal · Notes from the work",
    description: "The Qoax Community journal: short, honest write-ups by the people who did the work about hackathons, the internship programme, and the software we build for NGOs and artists in Bulgaria.",
    path: "/blog/",
  }),
  alternates: { canonical: "./", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default function JournalPage() {
  const rest = sortedPosts.filter((post) => post.slug !== featuredPost?.slug);
  const featuredImage = featuredPost ? postPreviewImage(featuredPost) : undefined;
  const categories = postCategories.filter((category) => sortedPosts.some((post) => post.category === category));

  return (
    <Shell>
      <PageHead
        label={sortedPosts.length > 0 ? `Journal · ${sortedPosts.length} posts` : "Journal · First posts coming soon"}
        title="Journal"
        copy="Short, honest write-ups by the people who did the work: what was planned, what happened, what we would change. Written in English, with Bulgarian where it matters."
      />

      {sortedPosts.length === 0 && (
        <section className={ed.secTight} aria-labelledby="empty-title">
          <div className={ed.wrap}>
            <div className={ed.empty}>
              <h2 className={ed.h2} id="empty-title">First posts coming soon</h2>
              <p className={ed.emptyCopy}>
                The first posts are being written by the people behind the 2026 internship programme and Atanasoff48.
                Until they land, the record pages under <Link href="/events">Events</Link> and{" "}
                <Link href="/work">Our work</Link> carry the facts.
              </p>
            </div>
          </div>
        </section>
      )}

      {featuredPost && (
      <section className={ed.secTight} aria-labelledby="featured-title">
        <div className={ed.wrap}>
          <article className={featuredImage ? ed.feat : `${ed.feat} ${ed.featSingle}`}>
            <div>
              <p className={ed.mono}>{featuredPost.category}</p>
              <h2 id="featured-title"><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              <p className={ed.featExcerpt}>{featuredPost.excerpt}</p>
              <div style={{ marginTop: 18 }}><Byline post={featuredPost} /></div>
              <div style={{ marginTop: 22 }}><Btn href={`/blog/${featuredPost.slug}`} small>Read the post</Btn></div>
            </div>
            {featuredImage && (
              <Link aria-hidden="true" className={ed.featMedia} href={`/blog/${featuredPost.slug}`} tabIndex={-1}>
                <Image alt="" height={630} src={featuredImage} width={1200} />
              </Link>
            )}
          </article>
        </div>
      </section>
      )}

      {rest.length > 0 && (
      <section className={ed.secTight} aria-labelledby="all-posts-title">
        <div className={ed.wrap}>
          {groupPostsByCategory && (
            <nav className={ed.filters} aria-label="Journal categories">
              <span aria-current="true">All</span>
              {categories.map((category) => (
                <a href={`#${categoryAnchor(category)}`} key={category}>{category}</a>
              ))}
            </nav>
          )}
          <h2 className={ed.h2} id="all-posts-title" style={{ marginTop: groupPostsByCategory ? 28 : 0, marginBottom: 12 }}>
            {groupPostsByCategory ? "Latest" : "Earlier posts"}
          </h2>
          <div className={ed.rows}>{rest.map((post) => <PostRow post={post} key={post.slug} />)}</div>
        </div>
      </section>
      )}

      {groupPostsByCategory && categories.map((category) => {
        const inCategory = sortedPosts.filter((post) => post.category === category);
        const id = categoryAnchor(category);
        return (
          <section className={ed.secTight} aria-labelledby={`${id}-title`} id={id} key={category}>
            <div className={ed.wrap}>
              <h2 className={ed.h2} id={`${id}-title`} style={{ marginBottom: 12 }}>{`${category} · ${inCategory.length}`}</h2>
              <div className={ed.rows}>{inCategory.map((post) => <PostRow post={post} key={post.slug} />)}</div>
            </div>
          </section>
        );
      })}

      <section className={ed.secTight} aria-labelledby="follow-title">
        <div className={ed.wrap}>
          <div className={ed.news}>
            <div>
                            <h2 id="follow-title">New posts land here first.</h2>
              <p>
                Subscribe with any feed reader, or write to us if you want to be told when we publish something
                about your school or organisation. No newsletter, no tracking.
              </p>
            </div>
            <div className={ed.newsActions}>
              <Btn href="/blog/feed.xml" variant="light">RSS feed</Btn>
              <Btn href={`mailto:${CONTACT_EMAIL}`} variant="amber">Write to us</Btn>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
