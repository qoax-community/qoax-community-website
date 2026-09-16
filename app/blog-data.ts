import { existsSync } from "node:fs";
import { join } from "node:path";
import { getArchiveEntry } from "./archive-data";
import { loadJournalFiles, type RawJournalPost } from "./journal-loader";
import { sectionsText, type Section } from "./journal-markdown";
import { siteAsset } from "./site-path";

/**
 * Journal (blog) content for qo.ax.
 *
 * Posts are Markdown files in content/journal/ (see the README there). They
 * are written from the public records in archive-tree-data.ts and the legal
 * register; nothing should claim a fact that is not also visible on the
 * related record page. Author entries carry names only — no invented roles
 * or biographies.
 */

export type Author = {
  slug: string;
  name: string;
  initials: string;
  /** Only ever "Qoax Community" — we do not publish job titles here. */
  affiliation: "Qoax Community";
  github?: string;
};

export const authors: Record<string, Author> = {
  "emil-momchev": {
    slug: "emil-momchev",
    name: "Emil Momchev",
    initials: "EM",
    affiliation: "Qoax Community",
    github: "https://github.com/Mrgoblings",
  },
  "angel-penchev": {
    slug: "angel-penchev",
    name: "Angel Penchev",
    initials: "AP",
    affiliation: "Qoax Community",
    github: "https://github.com/angel-penchev",
  },
  "ema-komitova": {
    slug: "ema-komitova",
    name: "Ema Komitova",
    initials: "EK",
    affiliation: "Qoax Community",
  },
  "qoax-community": {
    slug: "qoax-community",
    name: "Qoax Community",
    initials: "Q",
    affiliation: "Qoax Community",
  },
};

export const postCategories = ["Events", "Programmes", "Building", "About the name"] as const;
export type PostCategory = (typeof postCategories)[number];

export type PostSection = Section;

export type Post = {
  slug: string;
  title: string;
  /** Short deck shown under the title and in lists. */
  excerpt: string;
  /** Serif italic lede at the top of the article. */
  lede: string;
  category: PostCategory;
  tags: string[];
  authorSlug: keyof typeof authors;
  /** ISO date, YYYY-MM-DD. */
  published: string;
  updated?: string;
  featured?: boolean;
  /** Slug of the related record under /projects/. */
  record?: string;
  /** External link shown in the sidebar. */
  externalUrl?: string;
  /** Cover image used for link previews (Open Graph). Path under /public, e.g. /journal/my-post.jpg. */
  image?: string;
  pull?: { text: string; source: string };
  sections: PostSection[];
};

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function requireString(raw: RawJournalPost, key: string) {
  const value = raw.frontmatter[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Journal post ${raw.file}: frontmatter field "${key}" is required.`);
  }
  return value.trim();
}

function optionalString(raw: RawJournalPost, key: string) {
  const value = raw.frontmatter[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function coverImage(raw: RawJournalPost) {
  const image = optionalString(raw, "image");
  if (!image) return undefined;
  if (!image.startsWith("/") || !/\.(png|jpe?g|webp)$/i.test(image)) {
    throw new Error(`Journal post ${raw.file}: "image" must be a path under /public ending in .png, .jpg, or .webp, for example /journal/${raw.slug}.jpg.`);
  }
  if (!existsSync(join(process.cwd(), "public", image))) {
    throw new Error(`Journal post ${raw.file}: "image" ${image} was not found under /public.`);
  }
  return siteAsset(image);
}

/** Cover for link previews: the post's own image, else the image of its related record. */
export function postPreviewImage(post: Post) {
  return post.image ?? (post.record ? getArchiveEntry(post.record)?.image : undefined);
}

function toPost(raw: RawJournalPost): Post {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug)) {
    throw new Error(`Journal post ${raw.file}: file name must use lower-case letters, digits, and dashes only.`);
  }
  const category = requireString(raw, "category");
  if (!(postCategories as readonly string[]).includes(category)) {
    throw new Error(`Journal post ${raw.file}: category "${category}" must be one of ${postCategories.join(", ")}.`);
  }
  const authorSlug = requireString(raw, "author");
  if (!(authorSlug in authors)) {
    throw new Error(`Journal post ${raw.file}: author "${authorSlug}" must be one of ${Object.keys(authors).join(", ")}.`);
  }
  const published = requireString(raw, "published");
  if (!isoDate.test(published)) {
    throw new Error(`Journal post ${raw.file}: "published" must be YYYY-MM-DD.`);
  }
  const updated = optionalString(raw, "updated");
  if (updated && !isoDate.test(updated)) {
    throw new Error(`Journal post ${raw.file}: "updated" must be YYYY-MM-DD.`);
  }
  const tagsValue = raw.frontmatter.tags;
  const tags = Array.isArray(tagsValue) ? tagsValue : typeof tagsValue === "string" ? tagsValue.split(",").map((t) => t.trim()).filter(Boolean) : [];
  if (tags.length === 0) {
    throw new Error(`Journal post ${raw.file}: "tags" needs at least one entry, for example tags: [Hackathon, Sofia].`);
  }
  if (raw.sections.length === 0) {
    throw new Error(`Journal post ${raw.file}: the body needs at least one "## Heading" section.`);
  }
  const pull = optionalString(raw, "pull");
  return {
    slug: raw.slug,
    title: requireString(raw, "title"),
    excerpt: requireString(raw, "excerpt"),
    lede: requireString(raw, "lede"),
    category: category as PostCategory,
    tags,
    authorSlug,
    published,
    updated,
    featured: raw.frontmatter.featured === true,
    record: optionalString(raw, "record"),
    externalUrl: optionalString(raw, "externalUrl"),
    image: coverImage(raw),
    pull: pull ? { text: pull, source: optionalString(raw, "pullSource") ?? "" } : undefined,
    sections: raw.sections,
  };
}

/** Posts are authored as Markdown in content/journal/. See content/journal/README.md. */
export const posts: Post[] = loadJournalFiles().map(toPost);

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getAuthor(slug: keyof typeof authors) {
  return authors[slug];
}

export const sortedPosts = [...posts].sort((a, b) => b.published.localeCompare(a.published));

export const featuredPost: Post | undefined = sortedPosts.find((post) => post.featured) ?? sortedPosts[0];

export const bylineAuthors = Object.values(authors).filter((author) => author.slug !== "qoax-community");

export function wordCount(post: Post) {
  return [post.lede, post.excerpt, sectionsText(post.sections)].join(" ").split(/\s+/).filter(Boolean).length;
}

export function readingTime(post: Post) {
  return Math.max(2, Math.round(wordCount(post) / 200));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relatedPosts(post: Post, count = 3) {
  return sortedPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => {
      const scoreA = (a.category === post.category ? 2 : 0) + a.tags.filter((tag) => post.tags.includes(tag)).length;
      const scoreB = (b.category === post.category ? 2 : 0) + b.tags.filter((tag) => post.tags.includes(tag)).length;
      return scoreB - scoreA;
    })
    .slice(0, count);
}
