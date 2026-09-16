import assert from "node:assert/strict";
import test from "node:test";

let sequence = 0;
async function browser(t, { stored, storageBlocked = false } = {}) {
  const analytics = await import(`../app/analytics.ts?case=${sequence++}`);
  const entries = new Map(stored ? [[analytics.CONSENT_KEY, JSON.stringify(stored)]] : []);
  const scripts = [];
  const cookieWrites = [];
  const listeners = new Map();
  let reloads = 0;
  let interval;
  globalThis.window = {
    localStorage: {
      getItem: (key) => { if (storageBlocked) throw new Error("blocked"); return entries.get(key) ?? null; },
      setItem: (key, value) => { if (storageBlocked) throw new Error("blocked"); entries.set(key, value); },
    },
    location: { hostname: "qo.ax", reload: () => reloads++ },
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
    dispatchEvent: (event) => listeners.get(event.type)?.(event),
    setInterval: (fn) => { interval = fn; return 1; },
    clearInterval: () => { interval = undefined; },
  };
  globalThis.document = {
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
    set cookie(value) { cookieWrites.push(value); },
  };
  t.after(() => { delete globalThis.window; delete globalThis.document; });
  return { analytics, scripts, entries, cookieWrites, listeners, tick: () => interval?.(), reloads: () => reloads };
}

test("first visit and rejected consent never insert Google scripts or queue events", async (t) => {
  const { analytics: a, scripts } = await browser(t);
  assert.equal(a.getConsent(), null);
  a.startAnalytics();
  assert.equal(scripts.length, 0);
  a.chooseConsent("rejected");
  a.startAnalytics();
  assert.equal(a.getConsent(), "rejected");
  assert.equal(scripts.length, 0);
  assert.equal(window.dataLayer, undefined);
});

test("accepting loads one tag with ordered consent and advertising disabled", async (t) => {
  const { analytics: a, scripts } = await browser(t);
  a.chooseConsent("accepted");
  a.startAnalytics();
  a.startAnalytics();
  assert.equal(scripts.length, 1, "rerenders must not duplicate the tag or initial page view");
  assert.equal(scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-P7F0DM83L3");
  const commands = window.dataLayer.map((args) => Array.from(args));
  assert.deepEqual(commands[0], ["consent", "default", {
    analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  }]);
  assert.deepEqual(commands[1], ["consent", "update", { analytics_storage: "granted" }]);
  assert.equal(commands[2][0], "js");
  assert.equal(commands[3][0], "config");
  assert.equal(commands[3][1], a.MEASUREMENT_ID);
  assert.equal(commands[3][2].allow_google_signals, false);
  assert.equal(commands[3][2].allow_ad_personalization_signals, false);
  assert.equal(commands[3][2].cookie_domain, "none");
  assert.equal(commands[3][2].cookie_expires, 180 * 86400);
  assert.equal(commands[3][2].cookie_update, false);
});

test("withdrawal disables existing analytics before reload and expires both cookies", async (t) => {
  const { analytics: a, cookieWrites, reloads } = await browser(t);
  a.chooseConsent("accepted");
  a.startAnalytics();
  const queued = window.dataLayer.length;
  a.chooseConsent("rejected");
  assert.equal(window["ga-disable-G-P7F0DM83L3"], true);
  assert.equal(a.getConsent(), "rejected");
  assert.equal(window.dataLayer.length, queued, "withdrawal must not enqueue cookieless pings");
  assert.equal(reloads(), 1);
  assert.ok(cookieWrites.includes("_ga=;Max-Age=0;Path=/;SameSite=Lax"));
  assert.ok(cookieWrites.includes("_ga_P7F0DM83L3=;Max-Age=0;Path=/;Domain=qo.ax;SameSite=Lax"));
});

test("valid remembered acceptance works; malformed, future and expired records fail closed", async (t) => {
  const { analytics: a, scripts } = await browser(t, { stored: { version: 1, choice: "accepted", expiresAt: Date.now() + 10_000 } });
  a.startAnalytics();
  assert.equal(scripts.length, 1);
  for (const invalid of [null, "bad json", "{}", JSON.stringify({ version: 2, choice: "accepted", expiresAt: Date.now() + 1000 }),
    JSON.stringify({ version: 1, choice: "accepted", expiresAt: Date.now() - 1 }),
    JSON.stringify({ version: 1, choice: "accepted", expiresAt: Date.now() + 181 * 86400_000 }),
    JSON.stringify({ version: 1, choice: "yes", expiresAt: Date.now() + 1000 })]) {
    assert.equal(a.parseConsent(invalid), null);
  }
});

test("blocked storage supports an in-memory choice and safe withdrawal without reload", async (t) => {
  const { analytics: a, scripts, reloads } = await browser(t, { storageBlocked: true });
  assert.equal(a.getConsent(), null);
  a.chooseConsent("accepted");
  a.startAnalytics();
  assert.equal(scripts.length, 1);
  a.chooseConsent("rejected");
  assert.equal(a.getConsent(), "rejected");
  assert.equal(window["ga-disable-G-P7F0DM83L3"], true);
  assert.equal(reloads(), 0, "reload would discard the unsaved rejection");
});

test("revoking consent in another tab stops analytics and unloads its listeners", async (t) => {
  const { analytics: a, entries, listeners, reloads } = await browser(t);
  const unsubscribe = a.subscribeConsent(() => {});
  a.chooseConsent("accepted");
  a.startAnalytics();
  entries.delete(a.CONSENT_KEY);
  listeners.get("storage")({ key: a.CONSENT_KEY });
  assert.equal(window["ga-disable-G-P7F0DM83L3"], true);
  assert.equal(reloads(), 1);
  unsubscribe();
  assert.equal(listeners.size, 0);
});

test("consent expiring in an open tab stops analytics without a navigation", async (t) => {
  const { analytics: a, entries, tick, reloads } = await browser(t);
  a.subscribeConsent(() => {});
  a.chooseConsent("accepted");
  a.startAnalytics();
  entries.set(a.CONSENT_KEY, JSON.stringify({ version: 1, choice: "accepted", expiresAt: Date.now() - 1 }));
  tick();
  assert.equal(window["ga-disable-G-P7F0DM83L3"], true);
  assert.equal(reloads(), 1);
});
