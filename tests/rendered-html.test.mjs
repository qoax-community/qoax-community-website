import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const relativePath = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}index.html`;
  return readFile(new URL(`../out/${relativePath}`, import.meta.url), "utf8");
}

test("exports the Qoax Community home and index", async () => {
  const [home, index, about] = await Promise.all([
    render("/"),
    render("/events/"),
    render("/about/"),
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
  assert.match(home, /Algorithms and tournaments/);
  assert.match(home, /Game development/);
  assert.match(home, /Starting October 2026/);
  assert.doesNotMatch(home, /\d{2}\.\d+° [NE]/);
  assert.doesNotMatch(home, /42\.6977° N/);
  assert.doesNotMatch(home, /23\.3219° E/);
  assert.match(home, /qoax-q\.svg/);
  assert.match(await readFile(new URL("../public/brand/qoax-logo.svg", import.meta.url), "utf8"), /fill-rule="evenodd"/);
  assert.doesNotMatch(home, /qoax-mark\.svg/);
  assert.match(index, /Technology in service/);
  assert.match(about, /contact@qo\.ax/);
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
  ];

  const pages = await Promise.all(projectSlugs.map((slug) => render(`/projects/${slug}/`)));
  for (const html of pages) {
    assert.match(html, /Why it belongs here/);
  }

  assert.match(pages[0], /2–4 Oct 2026/);
  assert.match(pages[0], /atanasoff48\.com/);
  assert.match(pages[1], /30\+ students/);
  assert.match(pages[1], /exact student projects/);
  assert.match(pages[2], /Sensory Theatre Sofia/);
  assert.match(pages[3], /Non-profit/);
});

test("does not export separate Academy, profit, or journal routes", async () => {
  await assert.rejects(render("/academy/"));
  await assert.rejects(render("/portfolio/"));
  await assert.rejects(render("/blog/"));
});
