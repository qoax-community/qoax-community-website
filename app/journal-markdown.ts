/**
 * A small, dependency-free Markdown dialect for journal posts.
 *
 * Only erasable TypeScript syntax is used here so the module can also be
 * imported directly by Node (`node --test`) without a build step.
 *
 * Supported:
 *   - YAML-ish frontmatter between `---` fences (key: value, `tags: [a, b]`)
 *   - `## Heading {#optional-id}` starts a section (the H1 is the title)
 *   - paragraphs, `- ` bullet lists, `> ` block quotes
 *   - `::: bg` … `:::` container for Bulgarian paragraphs (rendered lang="bg")
 *   - inline `[text](url)`, `**strong**`, `*emphasis*`, `` `code` ``
 */

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "em"; text: string }
  | { kind: "code"; text: string }
  | { kind: "link"; text: string; href: string };

export type Block =
  | { type: "paragraph"; inlines: Inline[]; lang?: "bg" }
  | { type: "list"; items: Inline[][] }
  | { type: "quote"; inlines: Inline[]; lang?: "bg" };

export type Section = {
  id: string;
  heading: string;
  blocks: Block[];
};

export type Frontmatter = Record<string, string | string[] | boolean>;

export type ParsedDocument = {
  frontmatter: Frontmatter;
  sections: Section[];
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9а-я]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatterValue(raw: string): string | string[] | boolean {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return value.replace(/^["']|["']$/g, "");
}

export function parseFrontmatter(source: string): { frontmatter: Frontmatter; body: string } {
  const normalized = source.replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) return { frontmatter: {}, body: normalized };
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return { frontmatter: {}, body: normalized };
  const block = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n+/, "");
  const frontmatter: Frontmatter = {};
  for (const line of block.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, raw] = match;
    if (raw.trim() === "") continue;
    frontmatter[key] = parseFrontmatterValue(raw);
  }
  return { frontmatter, body };
}

const inlinePattern = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;

export function parseInline(text: string): Inline[] {
  const inlines: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > last) inlines.push({ kind: "text", text: text.slice(last, index) });
    if (match[1]) inlines.push({ kind: "link", text: match[2], href: match[3] });
    else if (match[4]) inlines.push({ kind: "strong", text: match[5] });
    else if (match[6]) inlines.push({ kind: "em", text: match[7] });
    else if (match[8]) inlines.push({ kind: "code", text: match[9] });
    last = index + match[0].length;
  }
  if (last < text.length) inlines.push({ kind: "text", text: text.slice(last) });
  return inlines;
}

export function parseBlocks(lines: string[], lang?: "bg"): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let quote: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", inlines: parseInline(paragraph.join(" ")), ...(lang ? { lang } : {}) });
      paragraph = [];
    }
    if (list.length) {
      blocks.push({ type: "list", items: list.map(parseInline) });
      list = [];
    }
    if (quote.length) {
      blocks.push({ type: "quote", inlines: parseInline(quote.join(" ")), ...(lang ? { lang } : {}) });
      quote = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    const listMatch = /^[-*]\s+(.*)$/.exec(line);
    if (listMatch) {
      if (paragraph.length || quote.length) flush();
      list.push(listMatch[1]);
      continue;
    }
    const quoteMatch = /^>\s?(.*)$/.exec(line);
    if (quoteMatch) {
      if (paragraph.length || list.length) flush();
      quote.push(quoteMatch[1]);
      continue;
    }
    if (list.length || quote.length) flush();
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}

export function parseSections(body: string): Section[] {
  const sections: Section[] = [];
  let current: { id: string; heading: string; lines: string[]; blocks: Block[] } | null = null;
  let bgLines: string[] | null = null;
  const usedIds = new Set<string>();

  const closeSection = () => {
    if (!current) return;
    current.blocks.push(...parseBlocks(current.lines));
    sections.push({ id: current.id, heading: current.heading, blocks: current.blocks });
    current = null;
  };

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trimEnd();

    if (bgLines !== null) {
      if (line.trim() === ":::") {
        if (current) {
          current.blocks.push(...parseBlocks(current.lines));
          current.lines = [];
          current.blocks.push(...parseBlocks(bgLines, "bg"));
        }
        bgLines = null;
      } else {
        bgLines.push(line);
      }
      continue;
    }

    const headingMatch = /^##\s+(.+?)(?:\s+\{#([A-Za-z0-9_-]+)\})?\s*$/.exec(line);
    if (headingMatch) {
      closeSection();
      let id = headingMatch[2] ?? slugify(headingMatch[1]);
      if (!id) id = `section-${sections.length + 1}`;
      let unique = id;
      let counter = 2;
      while (usedIds.has(unique)) unique = `${id}-${counter++}`;
      usedIds.add(unique);
      current = { id: unique, heading: headingMatch[1].trim(), lines: [], blocks: [] };
      continue;
    }

    if (/^#\s/.test(line)) continue; // The H1 comes from frontmatter.

    if (/^:::\s*bg\s*$/.test(line)) {
      bgLines = [];
      continue;
    }

    if (!current) {
      if (!line.trim()) continue;
      current = { id: "introduction", heading: "Introduction", lines: [], blocks: [] };
      usedIds.add("introduction");
    }
    current.lines.push(line);
  }
  closeSection();
  return sections;
}

export function parseJournalMarkdown(source: string): ParsedDocument {
  const { frontmatter, body } = parseFrontmatter(source);
  return { frontmatter, sections: parseSections(body) };
}

export function inlineText(inlines: Inline[]) {
  return inlines.map((inline) => inline.text).join("");
}

export function blockText(block: Block) {
  if (block.type === "list") return block.items.map(inlineText).join(" ");
  return inlineText(block.inlines);
}

export function sectionsText(sections: Section[]) {
  return sections.map((section) => [section.heading, ...section.blocks.map(blockText)].join(" ")).join(" ");
}
