import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const relativePath = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}index.html`;
  return readFile(new URL(`../out/${relativePath}`, import.meta.url), "utf8");
}

test("exports the QO.AX Community home and index", async () => {
  const [home, index, about] = await Promise.all([
    render("/"),
    render("/events/"),
    render("/about/"),
  ]);

  assert.match(home, /QO\.AX Community/);
  assert.match(home, /public work first/i);
  assert.match(home, /30\+/);
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

test("does not export Academy, profit, or journal sections", async () => {
  await assert.rejects(render("/academy/"));
  await assert.rejects(render("/portfolio/"));
  await assert.rejects(render("/blog/"));
});
