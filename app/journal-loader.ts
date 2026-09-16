import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parseJournalMarkdown, type Frontmatter, type Section } from "./journal-markdown";

/**
 * Reads every `content/journal/*.md` file at build time.
 * Files whose name starts with an underscore (for example `_TEMPLATE.md`) are ignored.
 */

export type RawJournalPost = {
  slug: string;
  file: string;
  frontmatter: Frontmatter;
  sections: Section[];
};

export const journalDirectory = join(process.cwd(), "content", "journal");

export function loadJournalFiles(directory = journalDirectory): RawJournalPost[] {
  let names: string[] = [];
  try {
    names = readdirSync(directory);
  } catch {
    return [];
  }
  return names
    .filter((name) => name.endsWith(".md") && !name.startsWith("_") && name.toLowerCase() !== "readme.md")
    .sort()
    .map((name) => {
      const file = join(directory, name);
      const source = readFileSync(file, "utf8");
      const { frontmatter, sections } = parseJournalMarkdown(source);
      return { slug: basename(name, ".md"), file, frontmatter, sections };
    });
}
