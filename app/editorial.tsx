import type { ReactNode } from "react";
import Link from "next/link";
import type { ArchiveEntry } from "./archive-data";
import { kindLabels } from "./archive-tree-data";
import { ArrowRight, ArrowUpRight, CONTACT_EMAIL, SiteFooter, SiteHeader } from "./components";
import { brandPronunciation } from "./brand-names";
import { authors, readingTime, shortDate, type Post } from "./blog-data";
import { parseInline, type Block, type Inline } from "./journal-markdown";
import ed from "./editorial.module.css";

/* ---------- Inline Markdown ---------- */

function renderInline(inline: Inline, key: number) {
  switch (inline.kind) {
    case "strong":
      return <strong key={key}>{inline.text}</strong>;
    case "em":
      return <em key={key}>{inline.text}</em>;
    case "code":
      return <code key={key}>{inline.text}</code>;
    case "link":
      return inline.href.startsWith("/") || inline.href.startsWith("#") || inline.href.startsWith("mailto:") ? (
        <Link href={inline.href} key={key}>{inline.text}</Link>
      ) : (
        <a href={inline.href} key={key} rel="noreferrer">{inline.text}</a>
      );
    default:
      return inline.text;
  }
}

/** Renders a parsed inline run, or a Markdown string with links, bold, italic, and code. */
export function Inlines({ source }: { source: string | Inline[] }) {
  const inlines = typeof source === "string" ? parseInline(source) : source;
  return <>{inlines.map(renderInline)}</>;
}

export function ContentBlock({ block }: { block: Block }) {
  if (block.type === "list") {
    return <ul>{block.items.map((item, index) => <li key={index}><Inlines source={item} /></li>)}</ul>;
  }
  if (block.type === "quote") {
    return <blockquote className={ed.quote} lang={block.lang}><Inlines source={block.inlines} /></blockquote>;
  }
  return <p lang={block.lang}><Inlines source={block.inlines} /></p>;
}

/* ---------- Page shell ---------- */

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={ed.page}>
      <SiteHeader />
      <main className={ed.main} id="main-content">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------- Buttons ---------- */

type BtnVariant = "solid" | "ghost" | "light" | "amber";

const btnClass: Record<BtnVariant, string> = {
  solid: ed.btn,
  ghost: ed.btnGhost,
  light: ed.btnLight,
  amber: ed.btnAmber,
};

export function Btn({
  href,
  children,
  variant = "solid",
  small = false,
}: {
  href: string;
  children: ReactNode;
  variant?: BtnVariant;
  small?: boolean;
}) {
  const className = `${btnClass[variant]}${small ? ` ${ed.btnSmall}` : ""}`;
  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return (
      <a className={className} href={href} rel={href.startsWith("http") ? "noreferrer" : undefined} target={href.startsWith("http") ? "_blank" : undefined}>
        {children}
        {href.startsWith("http") && <ArrowUpRight size={14} />}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

/* ---------- Section head: "01 — Upcoming" ---------- */

export function SecHead({
  number,
  label,
  title,
  copy,
  action,
  id,
}: {
  number?: string;
  label: string;
  title: ReactNode;
  copy?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className={ed.secHead}>
      <div>
        <p className={ed.mono}>{number ? `${number} — ${label}` : label}</p>
        <h2 id={id}>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action && <div className={ed.secHeadAction}>{action}</div>}
    </div>
  );
}

/* ---------- Alias strip ---------- */

const aliases = ["Коакс", "Куакс", "КОАКС Комюнити", "Kuaks", "Koaks", "Quax", "qo.ax"];

export function AliasStrip() {
  return (
    <section className={ed.alias} aria-label="Other spellings of Qoax">
      <ul className={`${ed.wrap} ${ed.aliasInner}`}>
        <li><span className={ed.aliasLabel}>Also written</span></li>
        {aliases.map((alias) => (
          <li key={alias} lang={/[А-Яа-я]/.test(alias) ? "bg" : undefined}>{alias}</li>
        ))}
        <li>{`Pronounced “${brandPronunciation}”`}</li>
      </ul>
    </section>
  );
}

/* ---------- Ruled rows for records ---------- */

export function RecordRow({ entry }: { entry: ArchiveEntry }) {
  const [day, month] = entry.calendar ?? [entry.year, ""];
  return (
    <Link className={ed.row} href={`/projects/${entry.slug}`}>
      <div className={ed.rowDate}>
        {entry.calendar ? `${day} ${month}` : entry.year}
        {entry.calendar && <small>{entry.year.match(/\d{4}/)?.[0] ?? entry.year}</small>}
      </div>
      <div>
        <h3 className={ed.rowTitle}>{entry.title}</h3>
        <p className={ed.rowExcerpt}>{entry.summary}</p>
        <div className={ed.rowTags}>
          <span className={entry.state === "growing" && entry.kind === "event" ? ed.tagAmber : ed.tag}>
            {entry.signal ?? kindLabels[entry.kind]}
          </span>
          {entry.partner && <span className={ed.tag}>{entry.partner}</span>}
        </div>
      </div>
      <div className={ed.rowMeta}>
        {kindLabels[entry.kind]}
        <small>{entry.location ?? entry.partner}</small>
      </div>
      <div className={ed.rowEnd}><ArrowRight size={18} /></div>
    </Link>
  );
}

/* ---------- Journal cards and bylines ---------- */

export function Ava({ authorSlug, large = false }: { authorSlug: keyof typeof authors; large?: boolean }) {
  const author = authors[authorSlug];
  const amber = authorSlug === "qoax-community";
  return (
    <span aria-hidden="true" className={`${amber ? ed.avaAmber : ed.ava}${large ? ` ${ed.avaLarge}` : ""}`}>
      {author.initials}
    </span>
  );
}

export function Byline({ post, withDate = true }: { post: Post; withDate?: boolean }) {
  const author = authors[post.authorSlug];
  return (
    <div className={ed.byline}>
      <Ava authorSlug={post.authorSlug} />
      <span>
        {author.name}
        {withDate && <small>{` · ${shortDate(post.published)} · ${readingTime(post)} min`}</small>}
      </span>
    </div>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link className={ed.post} href={`/blog/${post.slug}`}>
      <span className={ed.mono}>{post.category}</span>
      <h3 className={ed.postTitle}>{post.title}</h3>
      <p className={ed.postExcerpt}>{post.excerpt}</p>
      <Byline post={post} />
    </Link>
  );
}

export function PostRow({ post }: { post: Post }) {
  const author = authors[post.authorSlug];
  return (
    <Link className={`${ed.row} ${ed.jrow}`} href={`/blog/${post.slug}`}>
      <div className={ed.rowDate}>
        {shortDate(post.published)}
        <small>{`${readingTime(post)} min read`}</small>
      </div>
      <div>
        <h3 className={ed.rowTitle}>{post.title}</h3>
        <p className={ed.rowExcerpt}>{post.excerpt}</p>
        <div className={ed.rowTags}>
          {post.tags.slice(0, 4).map((tag) => <span className={ed.tag} key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className={ed.rowMeta}>{post.category}</div>
      <div className={ed.byline}>
        <Ava authorSlug={post.authorSlug} />
        <span>{author.name}</span>
      </div>
    </Link>
  );
}

/* ---------- Page header for interior pages ---------- */

export function PageHead({
  label,
  title,
  copy,
  aside,
  crumbs,
}: {
  label: string;
  title: ReactNode;
  copy?: string;
  aside?: ReactNode;
  crumbs?: ReactNode;
}) {
  return (
    <header className={ed.wrap}>
      {crumbs}
      <div className={ed.head}>
        <div>
          <p className={ed.mono}>{label}</p>
          <h1>{title}</h1>
        </div>
        <div className={ed.headAside}>
          {copy && <p className={ed.headCopy}>{copy}</p>}
          {aside}
        </div>
      </div>
    </header>
  );
}

/* ---------- Closing CTA ---------- */

export function Cta({
  title = "Want to host an event with us, or bring your school on board?",
  copy = "Write to us. We answer every message, and we publish what we do.",
  secondary,
}: {
  title?: ReactNode;
  copy?: string;
  secondary?: ReactNode;
}) {
  return (
    <section className={ed.cta}>
      <div className={`${ed.wrap} ${ed.ctaInner}`}>
        <div>
          <p className={ed.mono}>Get in touch</p>
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>
        <div className={ed.ctaActions}>
          <Btn href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Btn>
          {secondary ?? <Btn href="/about" variant="ghost">About Qoax</Btn>}
        </div>
      </div>
    </section>
  );
}
