import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
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
  // Plain design: no newspaper conceit, system sans font stack, clear primary actions.
  assert.doesNotMatch(home, /Community paper/);
  assert.doesNotMatch(home, /Fieldwork ledger/);
  assert.match(home, /Get in touch/);
  // NASA Space Apps Sofia is official and listed; unannounced jam themes stay private.
  assert.match(home, /NASA Space Apps Challenge/);
  assert.doesNotMatch(home, /supposed to do that/);
  assert.match(home, /apple-touch-icon\.png/);
  assert.match(home, /og-2026-11-10\.png/);
  assert.doesNotMatch(home, /taught and built with people|Public work first/);
  assert.doesNotMatch(home, /\.woff2/);
  assert.doesNotMatch(home, /fonts\.googleapis\.com/);
  assert.match(home, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(await readFile(new URL("../public/brand/qoax-logo.svg", import.meta.url), "utf8"), /fill-rule="evenodd"/);
  assert.doesNotMatch(home, /qoax-mark\.svg/);
  assert.match(index, /<h1>Our work<\/h1>/);
  assert.match(events, /Atanasoff48/);
  assert.match(about, /contact@qo\.ax/);
  // Plain redesign: one H1 per page, plain section titles without numbered eyebrows.
  for (const html of [home, index, about, events]) {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  }
  assert.doesNotMatch(home, /\d{2} — [A-Z]/);
  assert.match(home, /Upcoming events/);
  assert.match(home, /<h2[^>]*>Journal<\/h2>/);
  assert.doesNotMatch(home, /Also written/);
  assert.match(home, /Коакс Комюнити/);
  assert.match(home, /aria-current="page"/);
});

test("exports the journal with its first Markdown posts", async () => {
  const [home, journal, feed, schools] = await Promise.all([
    render("/"),
    render("/blog/"),
    readFile(new URL("../out/blog/feed.xml", import.meta.url), "utf8"),
    render("/schools/"),
  ]);

  assert.match(journal, /<title>Qoax Community journal<\/title>/);
  const titles = [
    "Atanasoff48: the first 48-hour hackathon at SPGE John Atanasoff",
    "The 2026/27 season: seven events, one calendar",
    "SUGAMING Game Jam 2026: three days, seven games",
  ];
  for (const title of titles) {
    assert.ok(journal.includes(title), `journal lists ${title}`);
  }
  assert.doesNotMatch(journal, /First posts coming soon/);
  // Team introductions are held back until the first journal post about the people is published.
  assert.doesNotMatch(journal, /Emil Momchev|Angel Penchev|Ema Komitova/);
  assert.equal((journal.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.ok(titles.some((title) => home.includes(title)), "home links a journal post");
  assert.match(home, /href="(https:\/\/qo\.ax)?\/blog\/feed\.xml"/);

  assert.match(feed, /<rss version="2\.0"/);
  assert.match(feed, /<link>https:\/\/qo\.ax\/blog\/<\/link>/);
  assert.equal((feed.match(/<item>/g) ?? []).length, 3);

  // Posts are articles with one H1; the placeholder route is gone and the 404 stays out of search.
  const post = await render("/blog/sugaming-jam-2026/");
  assert.match(post, /"@type":"BlogPosting"/);
  assert.match(post, /<meta property="og:type" content="article"/);
  assert.equal((post.match(/<h1[\s>]/g) ?? []).length, 1);
  await assert.rejects(render("/blog/coming-soon/"));
  const notFound = await readFile(new URL("../out/404.html", import.meta.url), "utf8");
  assert.match(notFound, /name="robots" content="noindex, follow"/);

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
  // The site is English-only until full EN/BG localisation exists: no partial Bulgarian blocks.
  assert.ok(!blocks.some((block) => block.type === "bg"), "the template has no partial Bulgarian block");
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
  assert.match(faq, /id="koaks-komyuniti"/);
  assert.match(faq, /<link rel="canonical" href="https:\/\/qo\.ax\/faq\/"\/?>/);
  assert.equal((faq.match(/<h1[\s>]/g) ?? []).length, 1);

  assert.match(about, /"@type":"AboutPage"/);
  assert.doesNotMatch(about, /"@type":"Person"/);
  assert.doesNotMatch(about, /Emil Momchev|Angel Penchev|Ema Komitova/);
  assert.match(about, /On this page/);
  assert.match(about, /id="what-is-qoax"/);
  assert.doesNotMatch(about, /id="people"/);
  assert.match(about, /id="organisation"/);
  // The FAQ lives on one page; About links to it instead of repeating questions.
  assert.doesNotMatch(about, /id="questions"|which-events/);
  assert.match(about, /href="\/faq\/"/);
  assert.doesNotMatch(about, /lang="bg">Коакс Комюнити е|founding note/);
  // The timeline reads names and dates from the archive records.
  assert.match(about, /href="\/projects\/fmi-game-jam\/">SUGAMING Game Jam</);
  assert.doesNotMatch(about, />FMI Game Jam<|SU Jam/);
  assert.doesNotMatch(about, /Learning programme/);
  assert.match(about, /26 Oct 2026/);
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
    // Search aliases stay in metadata and never appear in visible page copy.
    assert.match(html, /<meta name="keywords" content="[^"]*Куакс[^"]*Kuaks/);
    const body = html.split("<body")[1]
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, "");
    assert.doesNotMatch(body, /Also written|Pronounced|Куакс|Kuaks|Koaks|Quax/);
    assert.match(html, /<script type="application\/ld\+json">/);
  }

  assert.match(home, /<link rel="canonical" href="https:\/\/qo\.ax\/"\/?>/);
  assert.match(about, /<link rel="canonical" href="https:\/\/qo\.ax\/about\/"\/?>/);
  assert.match(home, /"@type":\["NGO","Organization"\]/);
  assert.match(home, /"legalName":"Сдружение КОАКС КОМЮНИТИ"/);
  assert.match(home, /"value":"208896893"/);
  assert.match(home, /"alternateName":\[[^\]]*"Куакс"[^\]]*\]/);
  assert.match(home, /<meta name="robots" content="index, follow"/);
  assert.doesNotMatch(about, /Also written as/);

  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/qo\.ax\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/about\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/projects\/atanasoff48\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/blog\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/faq\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/blog\/sugaming-jam-2026\/<\/loc>/);
  assert.doesNotMatch(sitemap, /\/blog\/coming-soon\//);
  assert.doesNotMatch(sitemap, /\/academy\//);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/work\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/schools\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/qo\.ax\/projects\/nasa-space-apps-2026\/<\/loc>/);
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
  assert.match(privacy, /Gmail sending permissions are requested separately/);
  assert.match(terms, /Terms of Use/);
  assert.match(terms, /OAuth permissions/);
  assert.match(gdpr, /GDPR and Browser Storage Notice/);
  assert.match(gdpr, /Email and link tracking/);
  for (const html of [privacy, gdpr]) {
    assert.match(html, /Google Analytics/);
    assert.match(html, /22 September 2026/);
    assert.match(html, /3 години \(1095 дни\)/);
    assert.match(html, /2026-09-22-v3/);
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
    // Each record carries its own text, never a shared filler paragraph.
    assert.doesNotMatch(html, /Why it belongs here/);
  }

  const [gameJam, tournament] = pages.slice(-2);
  assert.match(gameJam, /Faculty of Mathematics and Informatics/);
  assert.match(tournament, /Counter-Strike 2/);
  assert.match(tournament, /League of Legends/);
  assert.match(tournament, /Mar 2027/);
  assert.match(gameJam, /Completed/);
  assert.match(gameJam, /Seven games were submitted/);
  assert.match(gameJam, /About the event/);
  assert.match(gameJam, /In pictures/);
  assert.doesNotMatch(gameJam, /Dates to be announced|Bring your team|Join as a school or partner|role="timer"/);
  assert.match(tournament, /Qoax × SUGAMING Gaming Tournament/);
  assert.doesNotMatch(tournament, /Qoax × FMI Gaming Tournament/);
  const events = await render("/events/");
  const pastEvents = events.match(/<section[^>]*aria-labelledby="past-title"[\s\S]*?<\/section>/)?.[0];
  assert.ok(pastEvents, "Past events section is rendered");
  assert.match(pastEvents, /SUGAMING Game Jam/);
  assert.doesNotMatch(pastEvents, /Qoax × SUGAMING Gaming Tournament/);
  assert.doesNotMatch(events, /FMI Game Jam/);
  assert.doesNotMatch(await render("/"), /FMI Game Jam/);

  assert.match(pages[0], /2-4 Oct 2026/);
  assert.match(pages[0], /atanasoff48\.com/);
  assert.match(pages[1], /30\+ students/);
  assert.match(pages[1], /exact student projects/);
  assert.match(pages[2], /Sensory Theatre Sofia/);
  assert.match(pages[3], /Non-profit/);
});

test("does not export profit or hidden routes", async () => {
  await assert.rejects(render("/portfolio/"));
  const nasa = await render("/projects/nasa-space-apps-2026/");
  assert.match(nasa, /Incubator building, Sofia Tech Park/);
  assert.doesNotMatch(await render("/projects/tues-game-jam-2026/"), /supposed to do that/);
});

test("gives every page a complete link preview and keeps social channels behind env vars", async () => {
  const pages = ["/", "/about/", "/faq/", "/schools/", "/work/", "/events/", "/blog/", "/terms/", "/privacy/", "/gdpr/", "/projects/nsicc/", "/projects/fmi-game-jam/", "/projects/atanasoff48/"];
  const rendered = Object.fromEntries(await Promise.all(pages.map(async (p) => [p, await render(p)])));
  for (const [pathname, html] of Object.entries(rendered)) {
    assert.match(html, /<meta property="og:title" content="[^"]+"/, `${pathname} has og:title`);
    assert.match(html, /<meta property="og:site_name" content="Qoax Community"/, `${pathname} names the site`);
    assert.match(html, /<meta property="og:description" content="[^"]+"/, `${pathname} has og:description`);
    assert.match(html, /<meta property="og:image" content="https:\/\/qo\.ax\/[^"]+"/, `${pathname} has an absolute og:image`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `${pathname} has a large twitter card`);
    assert.match(html, /<meta name="twitter:title" content="[^"]+"/, `${pathname} has twitter:title`);
    // Social channels are configured through NEXT_PUBLIC_SOCIAL_* and are empty for now.
    // Event pages link to the Qoax YouTube channel for their stream; that is not a footer social link.
    const withoutStream = html.replaceAll("https://www.youtube.com/@QoaxCommunity", "");
    assert.doesNotMatch(withoutStream, /facebook\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com/, `${pathname} shows no social links while env is empty`);
    assert.doesNotMatch(html, /google-site-verification/, `${pathname} has no verification tag while env is empty`);
  }
  assert.match(rendered["/about/"], /<meta property="og:title" content="About Qoax Community, a non-profit in Sofia"/);
  assert.match(rendered["/about/"], /<meta property="og:url" content="https:\/\/qo\.ax\/about\/"/);
  // Records with a raster image preview with their own picture; SVG-only records use the site card.
  assert.match(rendered["/projects/nsicc/"], /<meta property="og:image" content="https:\/\/qo\.ax\/projects\/nsicc\.png"/);
  assert.match(rendered["/projects/fmi-game-jam/"], /<meta property="og:image" content="https:\/\/qo\.ax\/journal\/sugaming-jam-2026-presentation\.jpg"/);
  assert.match(rendered["/projects/atanasoff48/"], /<meta property="og:image" content="https:\/\/qo\.ax\/events\/atanasoff48-2026\/atanasoff48-199\.jpg"/);
  assert.equal((rendered["/projects/atanasoff48/"].match(/\/events\/atanasoff48-2026\/atanasoff48-\d+\.jpg/g) ?? []).length >= 6, true, "Atanasoff48 shows its photo gallery");
  assert.equal((rendered["/projects/fmi-game-jam/"].match(/\/events\/sugaming-jam-2026\/gamejam-\d+\.jpg/g) ?? []).length >= 5, true, "SUGAMING Game Jam shows its photo gallery");
  assert.match(rendered["/projects/fmi-game-jam/"], /<meta property="og:title" content="SUGAMING Game Jam at FMI, Sofia University"/);
  assert.match(rendered["/projects/nsicc/"], /<meta name="twitter:image" content="https:\/\/qo\.ax\/projects\/nsicc\.png"/);
  // Root pages use the default card at 1200x630.
  assert.match(rendered["/"], /<meta property="og:image" content="https:\/\/qo\.ax\/og-2026-11-10\.png"/);
  assert.match(rendered["/"], /<meta property="og:image:width" content="1200"/);
  assert.match(rendered["/"], /<meta property="og:url" content="https:\/\/qo\.ax\/"/);
  // Every preview image a page points at is actually exported, so link previews never show a missing picture.
  for (const [page, html] of Object.entries(rendered)) {
    for (const [, file] of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="https:\/\/qo\.ax\/([^"]+)"/g)) {
      await assert.doesNotReject(stat(new URL(`../out/${decodeURIComponent(file)}`, import.meta.url)), `${page}: preview image ${file} is exported`);
    }
  }
  // schema.org sameAs keeps GitHub even with no social channels configured.
  assert.match(rendered["/"], /"sameAs":\["https:\/\/github\.com\/qoax-community"\]/);
});

test("links upcoming events to the stream and never fakes a recording for past ones", async () => {
  const upcoming = ["/projects/sofia-game-jam-2026/", "/projects/tues-game-jam-2026/"];
  for (const pathname of upcoming) {
    const html = await render(pathname);
    assert.match(html, /<a[^>]*href="https:\/\/www\.youtube\.com\/@QoaxCommunity"[^>]*data-stream-link=""/, `${pathname} has a stream link`);
    assert.match(html, /<h3>Stream<\/h3>/, `${pathname} has a stream card`);
  }
  assert.match(await render("/projects/sofia-game-jam-2026/"), />Watch live on YouTube</);
  // Completed events without a known recording URL get no stream link at all.
  for (const pathname of ["/projects/fmi-game-jam/", "/projects/atanasoff48/"]) {
    assert.doesNotMatch(await render(pathname), /data-stream-link/, `${pathname} has no invented recording link`);
  }
  // Non-event work has no stream.
  assert.doesNotMatch(await render("/projects/nsicc/"), /data-stream-link/);
  // The review asked for no decorative photo in the home hero.
  const home = await render("/");
  assert.doesNotMatch(home, /heroPhoto|heroMedia/);
});

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : [new URL(e.name, dir)])));
  return files.flat();
}

test("keeps the primary button text white on hover and tap in the built CSS", async () => {
  // The global a:hover colour (specificity 0,1,1) outranked .buttonPrimary (0,1,0), which made the
  // NASA "Register" link dark on dark after a tap on phones. A class plus :hover (0,2,0) wins.
  // tests/browser.test.mjs checks the same thing in a real browser when Chromium is installed.
  const sheets = (await walk(new URL("../out/_next/static/", import.meta.url))).filter((url) => url.pathname.endsWith(".css"));
  const css = (await Promise.all(sheets.map((url) => readFile(url, "utf8")))).join("\n");
  assert.match(css, /(^|[}\s,])a:hover\{[^}]*color:/, "the global link hover colour this guards against is still there");
  const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(([, selector]) => /buttonPrimary[\w-]*:hover/.test(selector));
  assert.ok(rules.length > 0, "a primary button hover rule exists");
  for (const [, selector, body] of rules) {
    // Every .buttonPrimary:hover rule is class + pseudo-class, so it outranks a:hover regardless of order.
    for (const part of selector.split(",").filter((p) => p.includes("buttonPrimary"))) {
      assert.match(part.trim(), /^\.[\w-]+:hover$/, `${part.trim()} is a single class plus :hover`);
    }
    if (/color:/.test(body.replace(/background(-color)?:/g, ""))) assert.match(body, /(^|;)color:(#fff|#ffffff|white)(;|$)/, `${selector} keeps white text`);
  }
  assert.ok(rules.some(([, , body]) => /(^|;)color:(#fff|#ffffff|white)(;|$)/.test(body)), "a primary hover rule sets white text");
});

test("uses no decorative middle-dot separators anywhere in the exported site", async () => {
  // Emil asked for plain single items instead of "X · Y" everywhere, including titles, feeds and images.
  // Framework bundles under _next/ are excluded; they are not copy.
  const exported = (await walk(new URL("../out/", import.meta.url))).filter((url) => /\.(html|xml|json|txt|md|svg|webmanifest)$/.test(url.pathname) && !url.pathname.includes("/_next/"));
  assert.ok(exported.length > 20, "found the exported pages");
  for (const url of exported) {
    const text = await readFile(url, "utf8");
    assert.doesNotMatch(text, /\u00b7|&middot;|&#183;|&#xb7;/i, `${url.pathname} has no middle dot`);
  }
});

test("renders the season post's project list as links, not raw Markdown", async () => {
  const html = await render("/blog/season-2026-27/");
  const article = html.slice(html.indexOf("<article"), html.indexOf("</article>"));
  assert.doesNotMatch(article, /\]\(\/|\*\*/, "no raw Markdown link or bold markers");
  for (const slug of ["nasa-space-apps-2026", "sofia-game-jam-2026", "telecommunications-hackathon-2027"]) {
    assert.match(article, new RegExp(`<strong><a[^>]*href="/projects/${slug}/"`), `links ${slug}`);
  }
});

// Browsers show "&vert;" or "&#124;" as "|", so entities are decoded before the separator check.
const namedEntities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", vert: "|", verbar: "|", VerticalLine: "|", bull: "•", bullet: "•", ndash: "–", mdash: "—", sol: "/", middot: "·", centerdot: "·", CenterDot: "·", commat: "@" };
const decodeEntities = (value) =>
  value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
    if (name[0] === "#") return String.fromCodePoint(name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1)));
    return namedEntities[name] ?? entity;
  });
// A pipe, bullet, or spaced dash or slash between items is the same "X · Y" pattern in another glyph.
// Pipes and bullets never belong in the copy, so they count even without spaces ("Sofia|2027", "CS2 •LoL").
const separator = /(^|\s)[–—\/@](\s|$)|[•|·]/;
const usesSeparator = (value) => separator.test(decodeEntities(value));

test("the separator check sees through HTML entities", () => {
  for (const value of ["Left | Right", "Left &vert; Right", "Left &verbar; Right", "Left &#124; Right", "Left &#x7C; Right", "Left&nbsp;&bull;&nbsp;Right", "Left &mdash; Right", "Left &#8211; Right", "Sofia|2027", "CS2 •LoL", "Left&bull;Right", "A&#124;B"]) {
    assert.ok(usesSeparator(value), `"${value}" is a separator`);
  }
  for (const value of ["C++ and JS", "Q&amp;A", "48-hour jam", "UIC (ЕИК)", "spaceappschallenge.org", "end of Nov"]) {
    assert.ok(!usesSeparator(value), `"${value}" is plain text`);
  }
});

test("uses no substitute separators in visible text, attributes, or structured data", async () => {
  // The breadcrumb "/" spans are aria-hidden visual dividers and stay allowed.
  const exported = (await walk(new URL("../out/", import.meta.url))).filter((url) => /\.(html|xml|svg|md)$/.test(url.pathname) && !url.pathname.includes("/_next/"));
  for (const url of exported) {
    const raw = await readFile(url, "utf8");
    if (url.pathname.endsWith(".md")) {
      // Exported Markdown is read as plain text, one line at a time.
      for (const line of raw.split("\n")) assert.ok(!usesSeparator(line), `${url.pathname}: "${line.trim().slice(0, 80)}" uses a separator glyph`);
      continue;
    }
    const jsonLd = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(([, json]) => {
      const strings = [];
      JSON.parse(json, (key, value) => (typeof value === "string" && !/^https?:|^\//.test(value) && strings.push(value), value));
      return strings;
    });
    const html = raw
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<span aria-hidden="true">\/<\/span>/g, "");
    const text = [...html.matchAll(/>([^<]+)</g)].map(([, node]) => node);
    const attributes = [...html.matchAll(/\s(?:content|alt|title|aria-label)="([^"]*)"/g)].map(([, value]) => value).filter((value) => !/^https?:|^\//.test(value));
    for (const value of [...text, ...attributes, ...jsonLd]) {
      assert.ok(!usesSeparator(value), `${url.pathname}: "${value.trim().slice(0, 80)}" uses a separator glyph`);
    }
  }
});

test("gives every exported page a unique, complete title that matches its link preview", async () => {
  const pages = (await walk(new URL("../out/", import.meta.url))).filter((url) => url.pathname.endsWith(".html") && !url.pathname.includes("/_next/"));
  assert.ok(pages.length > 20, "found the exported pages");
  // 404.html, 404/index.html and _not-found/index.html are the same not-found page.
  const notFound = /\/(404(\/index)?|_not-found\/index)\.html$/;
  const seen = new Map();
  for (const url of pages) {
    const html = await readFile(url, "utf8");
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    const og = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1];
    const twitter = html.match(/<meta name="twitter:title" content="([^"]*)"/)?.[1];
    assert.ok(title, `${url.pathname} has a <title>`);
    assert.ok(title.length <= 65, `${url.pathname} title is ${title.length} characters: ${title}`);
    assert.equal(og, title, `${url.pathname} og:title matches <title>`);
    assert.equal(twitter, title, `${url.pathname} twitter:title matches <title>`);
    if (notFound.test(url.pathname)) {
      assert.equal(title, "Page not found on Qoax Community", `${url.pathname} is the not-found page`);
      assert.match(html, /<meta name="robots" content="noindex, follow"/, `${url.pathname} is not indexed`);
      continue;
    }
    assert.ok(!seen.has(title), `${url.pathname} repeats the title of ${seen.get(title)}: ${title}`);
    seen.set(title, url.pathname);
  }
});

test("never gives two links on one page the same text but different destinations", async () => {
  // The NASA page once had "Register on spaceappschallenge.org" twice: the Sofia event and the global site.
  const pages = (await walk(new URL("../out/", import.meta.url))).filter((url) => url.pathname.endsWith(".html") && !url.pathname.includes("/_next/"));
  for (const url of pages) {
    const html = (await readFile(url, "utf8")).replace(/<script[\s\S]*?<\/script>/g, "");
    const byName = new Map();
    for (const [, href, inner] of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const name = inner.replace(/<span aria-hidden="true">[^<]*<\/span>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (!name) continue;
      // A mailto subject line is a prefill, not a different destination.
      const target = href.replace(/#.*$/, "").replace(/^(mailto:[^?]*)\?.*$/, "$1").replace(/\/$/, "");
      const previous = byName.get(name);
      assert.ok(previous === undefined || previous === target, `${url.pathname}: "${name}" links to both ${previous} and ${target}`);
      byName.set(name, target);
    }
  }
});

test("lists the About timeline in date order", async () => {
  const html = await render("/about/");
  const section = html.slice(html.indexOf('id="timeline"'));
  const dates = [...section.slice(0, section.indexOf("</dl>")).matchAll(/<dt>([^<]+)<\/dt>/g)].map((m) => m[1]);
  assert.ok(dates.length >= 5, "the timeline has its rows");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Each label sorts by year, its first month, then its first day. "End of Nov" counts as late in the month;
  // a label with no day ("Jan-Feb 2027") sorts at the start of its month, and a bare year before its months.
  const key = (label) => {
    const year = Number(label.match(/\b(\d{4})\b/)?.[1]);
    const month = months.findIndex((name) => new RegExp(`\\b${name}\\b`).test(label));
    const day = /^End of\b/.test(label) ? 31 : Number(label.match(/^(\d{1,2})\b/)?.[1] ?? 0);
    assert.ok(year, `"${label}" has a year`);
    return year * 10000 + (month + 1) * 100 + day;
  };
  for (let i = 1; i < dates.length; i += 1) {
    assert.ok(key(dates[i - 1]) <= key(dates[i]), `"${dates[i - 1]}" comes before "${dates[i]}"`);
  }
});
