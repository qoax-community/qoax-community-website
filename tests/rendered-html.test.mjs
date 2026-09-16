import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const relativePath = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}index.html`;
  return readFile(new URL(`../out/${relativePath}`, import.meta.url), "utf8");
}

test("exports the Qoax Community home and index", async () => {
  const [home, index, about, events] = await Promise.all([
    render("/"),
    render("/work/"),
    render("/about/"),
    render("/events/"),
  ]);

  assert.match(home, /Qoax Community/);
  assert.doesNotMatch(home, /QO\.AX Community/);
  assert.match(home, /public work first/i);
  assert.match(home, /30\+/);
  assert.match(home, /Schools we work with/);
  assert.match(home, /Private School St\. Sofia logo/);
  assert.match(home, /Technology School Electronic Systems logo/);
  assert.match(home, /SPGE John Atanasoff logo/);
  assert.match(home, /PGVT A\. S\. Popov logo/);
  assert.match(home, /Professional High School of Telecommunications logo/);
  assert.doesNotMatch(home, /\d{2}\.\d+° [NE]/);
  assert.doesNotMatch(home, /42\.6977° N/);
  assert.doesNotMatch(home, /23\.3219° E/);
  assert.match(home, /qoax-logo\.svg/);
  // New design: no newspaper conceit, self-hosted webfonts, clear primary actions.
  assert.doesNotMatch(home, /Community paper/);
  assert.doesNotMatch(home, /Fieldwork ledger/);
  assert.match(home, /Get in touch/);
  // NASA Space Apps is hidden until the local event is official.
  assert.doesNotMatch(home, /NASA Space Apps Challenge/);
  assert.match(home, /apple-touch-icon\.png/);
  assert.match(home, /og\.png/);
  assert.match(home, /\/_next\/static\/media\/[^"]+\.woff2/);
  assert.doesNotMatch(home, /fonts\.googleapis\.com/);
  assert.match(home, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(await readFile(new URL("../public/brand/qoax-logo.svg", import.meta.url), "utf8"), /fill-rule="evenodd"/);
  assert.doesNotMatch(home, /qoax-mark\.svg/);
  assert.match(index, /Technology in service/);
  assert.match(events, /Atanasoff48/);
  assert.match(about, /contact@qo\.ax/);
  // Editorial redesign: one H1 per page, self-hosted serif and mono, numbered sections.
  for (const html of [home, index, about, events]) {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  }
  assert.match(home, /01 — Upcoming/);
  assert.match(home, /02 — Journal/);
  assert.match(home, /Also written/);
  assert.match(home, /Коакс Комюнити/);
  assert.match(home, /aria-current="page"/);
});

test("exports an empty journal that is ready for the first Markdown posts", async () => {
  const [home, journal, feed, schools] = await Promise.all([
    render("/"),
    render("/blog/"),
    readFile(new URL("../out/blog/feed.xml", import.meta.url), "utf8"),
    render("/schools/"),
  ]);

  assert.match(journal, /Notes from/);
  assert.match(journal, /First posts coming soon/);
  // Team introductions are held back until the first journal post about the people is published.
  assert.doesNotMatch(journal, /Emil Momchev|Angel Penchev|Ema Komitova/);
  assert.equal((journal.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(home, /First posts coming soon/);
  assert.match(home, /href="\/blog\/feed\.xml"/);

  assert.match(feed, /<rss version="2\.0"/);
  assert.match(feed, /<link>https:\/\/qo\.ax\/blog\/<\/link>/);
  assert.doesNotMatch(feed, /<item>/);

  // The static export needs one journal path; the placeholder must stay out of search results.
  const placeholder = await render("/blog/coming-soon/");
  assert.match(placeholder, /name="robots" content="noindex"/);

  // Anything about the Academy lives on qoax.academy; qo.ax only carries the opening date.
  for (const html of [home, journal]) assert.doesNotMatch(html, /Academy|Академия/);
  assert.match(schools, /href="https:\/\/qoax\.academy\/schools\/"[^>]*>qoax\.academy\/schools(<!-- -->)? ↗<\/a>/);
  assert.doesNotMatch(
    schools.replaceAll("Some of these schools also host Qoax Academy", ""),
    /Academy|Академия/,
    "schools page mentions the Academy only in the pointer",
  );
  assert.doesNotMatch(home, /"subOrganization"/);
  assert.match(schools, /Schools we/);
  assert.match(schools, /SPGE John Atanasoff logo/);
});

test("parses the journal template so new posts can be written in Markdown", async () => {
  const { parseJournalMarkdown } = await import("../app/journal-markdown.ts");
  const source = await readFile(new URL("../content/journal/_TEMPLATE.md", import.meta.url), "utf8");
  const { frontmatter, sections } = parseJournalMarkdown(source);

  assert.equal(typeof frontmatter.title, "string");
  assert.equal(frontmatter.category, "Events");
  assert.ok(Array.isArray(frontmatter.tags));
  assert.equal(frontmatter.author, "qoax-community");
  assert.deepEqual(
    sections.map((section) => section.id),
    ["plan", "what-happened", "what-we-would-change"],
  );
  const blocks = sections.flatMap((section) => section.blocks);
  assert.ok(blocks.some((block) => block.type === "paragraph" && block.lang === "bg"), "expects a Bulgarian paragraph");
  assert.ok(blocks.some((block) => block.type === "list"), "expects a bullet list");
  assert.ok(blocks.some((block) => block.type === "quote"), "expects a quote");
});

test("publishes the FAQ and the About page with searchable structure", async () => {
  const [faq, about, home] = await Promise.all([render("/faq/"), render("/about/"), render("/")]);

  assert.match(faq, /"@type":"FAQPage"/);
  assert.match(faq, /"@type":"Question"/);
  assert.match(faq, /"@type":"BreadcrumbList"/);
  assert.match(faq, /Куакс/);
  assert.doesNotMatch(faq, /Academy|Академия/);
  assert.match(faq, /id="spelling"/);
  assert.match(faq, /<link rel="canonical" href="https:\/\/qo\.ax\/faq\/"\/?>/);
  assert.equal((faq.match(/<h1[\s>]/g) ?? []).length, 1);

  assert.match(about, /"@type":"AboutPage"/);
  assert.doesNotMatch(about, /"@type":"Person"/);
  assert.doesNotMatch(about, /Emil Momchev|Angel Penchev|Ema Komitova/);
  assert.match(about, /On this page/);
  assert.match(about, /id="what-is-qoax"/);
  assert.doesNotMatch(about, /id="people"/);
  assert.match(about, /id="organisation"/);
  assert.match(about, /id="questions"/);
  assert.match(about, /href="\/faq\/"/);
  assert.match(about, /id="questions"[\s\S]*which-events/);
  assert.doesNotMatch(about, /Learning programme/);
  assert.match(about, /26 October 2026/);
  assert.match(about, /href="https:\/\/qoax\.academy\/"[^>]*>Qoax Academy opens(<!-- -->)? ↗<\/a>/);
  assert.doesNotMatch(about, /Related initiative|Learning programme|Коакс Академия/);
  assert.match(about, /contact@qo\.ax/);
  assert.equal((about.match(/<h1[\s>]/g) ?? []).length, 1);

  // The Q badge sits next to the wordmark in the header and the FAQ is reachable from the footer.
  assert.match(home, /qoax-favicon-community\.svg/);
  assert.match(home, /href="\/faq\/"/);
});

test("publishes the legal name, brand spellings, and SEO signals on every page", async () => {
  const [home, about, events, robots, sitemap] = await Promise.all([
    render("/"),
    render("/about/"),
    render("/events/"),
    readFile(new URL("../out/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../out/sitemap.xml", import.meta.url), "utf8"),
  ]);

  // Google for Nonprofits: the registered Bulgarian name and UIC must be visible on the domain itself.
  for (const html of [home, about, events]) {
    assert.match(html, /Сдружение КОАКС КОМЮНИТИ, ЕИК 208896893/);
    assert.match(html, /QOAX COMMUNITY association, UIC 208896893/);
    // Latin and Cyrillic spellings and common misspellings of the name.
    assert.match(html, /Коакс, Куакс, КОАКС Комюнити, Kuaks, Koaks, Quax/);
    assert.match(html, /<script type="application\/ld\+json">/);
  }

  assert.match(home, /<link rel="canonical" href="https:\/\/qo\.ax\/"\/?>/);
  assert.match(about, /<link rel="canonical" href="https:\/\/qo\.ax\/about\/"\/?>/);
  assert.match(home, /"@type":\["NGO","Organization"\]/);
  assert.match(home, /"legalName":"Сдружение КОАКС КОМЮНИТИ"/);
  assert.match(home, /"value":"208896893"/);
  assert.match(home, /"alternateName":\[[^\]]*"Куакс"[^\]]*\]/);
  assert.match(home, /<meta name="robots" content="index, follow"/);
  assert.match(about, /Also written as/);

  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/qo\.ax\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/about\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/projects\/atanasoff48\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/blog\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/faq\/<\/loc>/);
  assert.doesNotMatch(sitemap, /\/blog\/[a-z0-9-]+\//);
  assert.doesNotMatch(sitemap, /\/academy\//);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/work\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/schools\/<\/loc>/);
  assert.doesNotMatch(sitemap, /nasa-space-apps-2026/);
});

test("exports public legal pages for Google OAuth app domain", async () => {
  const [privacy, terms, gdpr] = await Promise.all([
    render("/privacy/"),
    render("/terms/"),
    render("/gdpr/"),
  ]);

  for (const html of [privacy, terms, gdpr]) {
    assert.match(html, /Сдружение КОАКС КОМЮНИТИ/);
    assert.match(html, /208896893/);
    assert.match(html, /contact@qo\.ax/);
    assert.match(html, /<main class="[^"]*legalPage/);
  }

  assert.match(privacy, /Privacy Policy/);
  assert.match(privacy, /Google sign-in and Gmail sending permissions/);
  assert.match(terms, /Terms of Use/);
  assert.match(terms, /OAuth permissions/);
  assert.match(gdpr, /GDPR and Browser Storage Notice/);
  assert.match(gdpr, /Email and link tracking/);
  for (const html of [privacy, gdpr]) {
    assert.match(html, /Google Analytics/);
    assert.match(html, /16 September 2026/);
    assert.match(html, /180 days/);
    assert.match(html, /withdraw/i);
  }
  assert.doesNotMatch(gdpr, /If QOAX later adds non-essential analytics/);
  assert.doesNotMatch(privacy, /Google, only when Google sign-in/);
});

test("static HTML offers consent and settings without loading or preconnecting to Google", async () => {
  for (const route of ["/", "/privacy/", "/gdpr/", "/about/", "/blog/", "/schools/"]) {
    const html = await render(route);
    assert.match(html, /Cookie settings/);
    assert.match(html, /Accept analytics/);
    assert.match(html, /Reject analytics/);
    assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)="https?:\/\/[^" ]*(?:googletagmanager|google-analytics)\./);
  }
});

test("exports only the requested non-profit project pages", async () => {
  const projectSlugs = [
    "atanasoff48",
    "internship-program-2026",
    "venus-labyrinth",
    "nsicc",
    "tues",
    "john-atanasoff-school",
    "popov-school",
    "telecommunications-schools-bulgaria",
    "fmi-game-jam",
    "fmi-esports-tournament-2027",
  ];

  const pages = await Promise.all(projectSlugs.map((slug) => render(`/projects/${slug}/`)));
  for (const html of pages) {
    assert.match(html, /Why it belongs here/);
  }

  const [gameJam, tournament] = pages.slice(-2);
  assert.match(gameJam, /Faculty of Mathematics and Informatics/);
  assert.match(tournament, /Counter-Strike 2/);
  assert.match(tournament, /League of Legends/);
  assert.match(tournament, /March 2027/);

  assert.match(pages[0], /2–4 Oct 2026/);
  assert.match(pages[0], /atanasoff48\.com/);
  assert.match(pages[1], /30\+ students/);
  assert.match(pages[1], /exact student projects/);
  assert.match(pages[2], /Sensory Theatre Sofia/);
  assert.match(pages[3], /Non-profit/);
});

test("does not export profit or hidden routes", async () => {
  await assert.rejects(render("/portfolio/"));
  // NASA Space Apps stays hidden until the local event is official.
  await assert.rejects(render("/projects/nasa-space-apps-2026/"));
});

test("gives every page a complete link preview and keeps social channels behind env vars", async () => {
  const pages = ["/", "/about/", "/faq/", "/schools/", "/work/", "/events/", "/blog/", "/terms/", "/privacy/", "/gdpr/", "/projects/nsicc/", "/projects/fmi-game-jam/"];
  const rendered = Object.fromEntries(await Promise.all(pages.map(async (p) => [p, await render(p)])));
  for (const [pathname, html] of Object.entries(rendered)) {
    assert.match(html, /<meta property="og:title" content="[^"]*Qoax Community[^"]*"/, `${pathname} has og:title`);
    assert.match(html, /<meta property="og:description" content="[^"]+"/, `${pathname} has og:description`);
    assert.match(html, /<meta property="og:image" content="https:\/\/qo\.ax\/[^"]+"/, `${pathname} has an absolute og:image`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `${pathname} has a large twitter card`);
    assert.match(html, /<meta name="twitter:title" content="[^"]*Qoax Community[^"]*"/, `${pathname} has twitter:title`);
    // Social channels are configured through NEXT_PUBLIC_SOCIAL_* and are empty for now.
    assert.doesNotMatch(html, /facebook\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com/, `${pathname} shows no social links while env is empty`);
    assert.doesNotMatch(html, /google-site-verification/, `${pathname} has no verification tag while env is empty`);
  }
  assert.match(rendered["/about/"], /<meta property="og:title" content="About Qoax Community[^"]*· Qoax Community"/);
  assert.match(rendered["/about/"], /<meta property="og:url" content="https:\/\/qo\.ax\/about\/"/);
  // Records with a raster image preview with their own picture; SVG-only records use the site card.
  assert.match(rendered["/projects/nsicc/"], /<meta property="og:image" content="https:\/\/qo\.ax\/projects\/nsicc\.png"/);
  assert.match(rendered["/projects/fmi-game-jam/"], /<meta property="og:image" content="https:\/\/qo\.ax\/og\.png"/);
  assert.match(rendered["/projects/fmi-game-jam/"], /<meta property="og:title" content="FMI Game Jam[^"]*· Qoax Community"/);
  assert.match(rendered["/projects/nsicc/"], /<meta name="twitter:image" content="https:\/\/qo\.ax\/projects\/nsicc\.png"/);
  // Root pages use the default card at 1200x630.
  assert.match(rendered["/"], /<meta property="og:image" content="https:\/\/qo\.ax\/og\.png"/);
  assert.match(rendered["/"], /<meta property="og:image:width" content="1200"/);
  // schema.org sameAs keeps GitHub even with no social channels configured.
  assert.match(rendered["/"], /"sameAs":\["https:\/\/github\.com\/qoax-community"\]/);
});
