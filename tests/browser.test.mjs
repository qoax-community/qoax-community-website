import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { chromium } from "playwright-core";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".json": "application/json" };

// Serves the static export the same way GitHub Pages does: "/x/" resolves to "/x/index.html".
async function serve() {
  const server = createServer(async (req, res) => {
    let file = normalize(join(root, decodeURIComponent(new URL(req.url, "http://x").pathname)));
    if (!file.startsWith(root)) return res.writeHead(403).end();
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

function rgb(value) {
  const [r, g, b, a = 1] = value.match(/[\d.]+/g).map(Number);
  return { r, g, b, a };
}

function contrast(fg, bg) {
  const lum = ({ r, g, b }) => {
    const [R, G, B] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Only a missing browser download skips the test locally; any other launch failure, or any failure in CI, is a real failure.
const isMissingBrowser = (error) => error instanceof Error && error.message.includes("Executable doesn't exist");

async function launch(t) {
  try {
    return await chromium.launch();
  } catch (error) {
    // CI installs Chromium first, so a missing browser there means the guard silently stopped running.
    if (!isMissingBrowser(error) || process.env.CI) throw error;
    t.skip(`Chromium is not installed for playwright-core (run "npx playwright-core install chromium-headless-shell"): ${error.message.split("\n")[0]}`);
    return undefined;
  }
}

test("skips only when the browser is missing, not when it fails to start", () => {
  assert.equal(isMissingBrowser(new Error("browserType.launch: Executable doesn't exist at /x/chrome-headless-shell")), true);
  assert.equal(isMissingBrowser(new Error("browserType.launch: Target page, context or browser has been closed")), false);
  assert.equal(isMissingBrowser(new Error("spawn EACCES")), false);
});

// Buttons animate colour changes over 140ms; without this the test would read the colour before the change ends.
async function open(page, url) {
  await page.goto(url);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
}

// The colour a reader actually sees behind an element: see-through backgrounds (alpha below 1) are blended with
// whatever is painted under them, down to the first opaque one or the white page. Text alpha is blended the same way.
// Pass "parent" to measure what surrounds the element, e.g. for a focus ring drawn outside it.
const painted = (locator, start = "self") =>
  locator.evaluate((el, start) => {
    const parse = (value) => {
      const [r = 0, g = 0, b = 0, a = 1] = (value.match(/[\d.]+/g) ?? []).map(Number);
      return value === "transparent" ? { r: 0, g: 0, b: 0, a: 0 } : { r, g, b, a };
    };
    const over = (top, below) => ({ r: top.a * top.r + (1 - top.a) * below.r, g: top.a * top.g + (1 - top.a) * below.g, b: top.a * top.b + (1 - top.a) * below.b, a: 1 });
    const layers = [];
    for (let node = start === "parent" ? el.parentElement : el; node; node = node.parentElement) {
      const layer = parse(getComputedStyle(node).backgroundColor);
      if (layer.a > 0) layers.push(layer);
      if (layer.a >= 1) break;
    }
    const background = layers.reverse().reduce((below, layer) => over(layer, below), { r: 255, g: 255, b: 255, a: 1 });
    const color = over(parse(getComputedStyle(el).color), background);
    const css = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    return { color: css(color), background: css(background) };
  }, start);

test("blends see-through backgrounds instead of treating them as solid", async (t) => {
  const browser = await launch(t);
  if (!browser) return;
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent('<div style="background: rgb(0, 0, 0)"><a style="color: rgb(255, 255, 255); background: rgba(255, 255, 255, 0.5)">x</a></div>');
  // Half-white over black is mid grey, which a solid-white reading would hide.
  assert.deepEqual(await painted(page.locator("a")), { color: "rgb(255, 255, 255)", background: "rgb(128, 128, 128)" });
  assert.deepEqual(await painted(page.locator("a"), "parent"), { color: "rgb(255, 255, 255)", background: "rgb(0, 0, 0)" });
});

const look = (locator) =>
  locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, background: s.backgroundColor, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor };
  });

test("the NASA register button stays readable on hover, after a tap, and on keyboard focus", async (t) => {
  const browser = await launch(t);
  if (!browser) return;
  const { server, origin } = await serve();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  for (const viewport of [{ width: 390, height: 844, touch: true }, { width: 1440, height: 900, touch: false }]) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.touch, isMobile: viewport.touch });
    const page = await context.newPage();
    await open(page, `${origin}/projects/nasa-space-apps-2026/`);
    const primary = page.getByRole("link", { name: "Register on spaceappschallenge.org", exact: true });
    // A tap must not leave the page; the test only cares about the state the tap leaves behind.
    await primary.evaluate((el) => el.addEventListener("click", (event) => event.preventDefault()));

    const rest = await look(primary);
    assert.equal(rest.color, "rgb(255, 255, 255)", `${viewport.width}px: white text at rest`);

    if (viewport.touch) await primary.tap();
    else await primary.hover();
    const pressed = await look(primary);
    // iOS and Android keep :hover after a tap, which is where the dark-on-dark text showed up.
    assert.equal(pressed.color, "rgb(255, 255, 255)", `${viewport.width}px: white text on hover or after a tap`);
    const seen = await painted(primary);
    assert.ok(contrast(rgb(seen.color), rgb(seen.background)) >= 4.5, `${viewport.width}px: hover contrast is at least 4.5:1 against ${seen.background}`);

    // The main action comes first, so it never wraps onto a row of its own.
    const first = await primary.evaluate((el) => el === el.parentElement.firstElementChild);
    assert.ok(first, `${viewport.width}px: the register button leads the action row`);

    // Keyboard users get a visible focus ring.
    await page.mouse.move(0, 0);
    await page.locator("body").evaluate(() => document.activeElement?.blur());
    let focused = false;
    for (let i = 0; i < 80 && !focused; i += 1) {
      await page.keyboard.press("Tab");
      focused = await primary.evaluate((el) => el === document.activeElement);
    }
    assert.ok(focused, `${viewport.width}px: the register button is reachable with Tab`);
    const ring = await look(primary);
    assert.notEqual(ring.outlineStyle, "none", `${viewport.width}px: focus outline is drawn`);
    assert.ok(parseFloat(ring.outlineWidth) >= 2, `${viewport.width}px: focus outline is at least 2px`);
    // A transparent or faint ring passes the style and width checks, so measure it against the page behind the button.
    const { background: surface } = await painted(primary, "parent");
    const outline = rgb(ring.outlineColor);
    assert.ok(outline.a === 1, `${viewport.width}px: focus outline is opaque (${ring.outlineColor})`);
    assert.ok(contrast(outline, rgb(surface)) >= 3, `${viewport.width}px: focus outline has at least 3:1 contrast against ${surface}`);
    assert.equal(ring.color, "rgb(255, 255, 255)", `${viewport.width}px: white text on focus`);

    // The secondary buttons next to it stay readable on hover too. They can be see-through, so measure what is painted behind them.
    for (const name of [/^Watch live on YouTube/, /^Join as a school or partner/]) {
      const secondary = page.getByRole("link", { name });
      await secondary.hover();
      const { color, background } = await painted(secondary);
      assert.ok(contrast(rgb(color), rgb(background)) >= 4.5, `${viewport.width}px: ${name} hover contrast against ${background}`);
    }
    await context.close();
  }
});

test("primary and secondary buttons on other pages stay readable on hover and after a tap", async (t) => {
  const browser = await launch(t);
  if (!browser) return;
  const { server, origin } = await serve();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const buttons = [
    { path: "/", selector: 'a[class*="__btn"]' },
    { path: "/blog/", selector: 'a[class*="__btn"]' },
    { path: "/schools/", selector: 'a[class*="__btn"]' },
  ];
  for (const viewport of [{ width: 390, height: 844, touch: true }, { width: 1440, height: 900, touch: false }]) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.touch, isMobile: viewport.touch });
    const page = await context.newPage();
    for (const { path, selector } of buttons) {
      await open(page, `${origin}${path}`);
      const links = page.locator(selector);
      const count = await links.count();
      assert.ok(count > 0, `${path}: has at least one button to check`);
      for (let i = 0; i < count; i += 1) {
        const link = links.nth(i);
        if (!(await link.isVisible())) continue;
        await link.evaluate((el) => el.addEventListener("click", (event) => event.preventDefault()));
        if (viewport.touch) await link.tap();
        else await link.hover();
        // Ghost buttons are see-through, so measure what is painted behind them.
        const s = await painted(link);
        const name = (await link.innerText()).trim();
        assert.ok(contrast(rgb(s.color), rgb(s.background)) >= 4.5, `${viewport.width}px ${path}: "${name}" keeps 4.5:1 on hover or after a tap`);
      }
    }
    await context.close();
  }
});

// Every exported page, as a phone shows it.
async function pages(dir = root, prefix = "/") {
  const { readdir } = await import("node:fs/promises");
  const found = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (item.name.startsWith("_next")) continue;
    if (item.isDirectory()) found.push(...(await pages(join(dir, item.name), `${prefix}${item.name}/`)));
    else if (item.name === "index.html") found.push(prefix);
  }
  return found;
}

test("every page fits a 390px phone without widening or scrolling sideways", async (t) => {
  const browser = await launch(t);
  if (!browser) return;
  const { server, origin } = await serve();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const routes = await pages();
  assert.ok(routes.includes("/projects/nasa-space-apps-2026/"), "the NASA page is among the checked pages");
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  for (const route of routes) {
    await open(page, `${origin}${route}`);
    // A phone browser lays out wider than the screen and zooms out when content cannot shrink, so innerWidth grows too.
    const { inner, scroll } = await page.evaluate(() => ({ inner: innerWidth, scroll: document.documentElement.scrollWidth }));
    assert.equal(inner, 390, `${route}: lays out at the phone width, not ${inner}px`);
    assert.ok(scroll <= 390, `${route}: no sideways scroll (${scroll}px wide)`);
    // The registration notice reads as one paragraph, with the address inline.
    for (const notice of await page.locator('[class*="__notice"]').all()) {
      const lines = await notice.evaluate((el) => [...el.childNodes].length > 1 && getComputedStyle(el).display);
      assert.notEqual(lines, "flex", `${route}: the notice is a paragraph, not a row of columns`);
    }
  }
  await context.close();
});
