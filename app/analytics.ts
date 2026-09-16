export const MEASUREMENT_ID = "G-P7F0DM83L3";
export const CONSENT_KEY = "qoax.analytics-consent.v1";
export const CONSENT_EVENT = "qoax:analytics-consent";
export const SETTINGS_EVENT = "qoax:cookie-settings";
export const CONSENT_DAYS = 180;
const MAX_AGE = CONSENT_DAYS * 24 * 60 * 60;
const SCRIPT_ID = "qoax-google-analytics";

export type ConsentChoice = "accepted" | "rejected";
type ConsentRecord = { choice: ConsentChoice; expiresAt: number; version: 1 };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  "ga-disable-G-P7F0DM83L3"?: boolean;
};

let memoryConsent: ConsentRecord | null = null;
let started = false;

export function parseConsent(value: string | null, now = Date.now()): ConsentRecord | null {
  try {
    const record = JSON.parse(value ?? "null");
    if (record?.version !== 1 || !["accepted", "rejected"].includes(record.choice)
      || !Number.isFinite(record.expiresAt) || record.expiresAt <= now
      || record.expiresAt > now + MAX_AGE * 1000) return null;
    return record;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  if (memoryConsent) return memoryConsent.expiresAt > Date.now() ? memoryConsent.choice : null;
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY))?.choice ?? null;
  } catch {
    return null;
  }
}

export function subscribeConsent(listener: () => void) {
  const refresh = () => {
    if (getConsent() !== "accepted") stopAnalytics();
    listener();
  };
  const refreshExternal = () => {
    const mustUnload = started && getConsent() !== "accepted";
    refresh();
    if (mustUnload) window.location.reload();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) refreshExternal();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONSENT_EVENT, refresh);
  window.addEventListener("focus", refreshExternal);
  // Also expire consent in a tab that stays open for a long time.
  const timer = window.setInterval(refreshExternal, 60_000);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONSENT_EVENT, refresh);
    window.removeEventListener("focus", refreshExternal);
    window.clearInterval(timer);
  };
}

export function chooseConsent(choice: ConsentChoice) {
  const record: ConsentRecord = { choice, expiresAt: Date.now() + MAX_AGE * 1000, version: 1 };
  memoryConsent = null;
  let saved = false;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    saved = true;
  } catch {
    // Browsers that block storage still get a working choice for this page.
    memoryConsent = record;
  }
  const wasStarted = started;
  if (choice === "rejected") stopAnalytics();
  window.dispatchEvent(new Event(CONSENT_EVENT));
  // Unload Google's timers and history listeners after withdrawal. If storage
  // is unavailable, keep the in-memory denial and the GA disable flag instead.
  if (choice === "rejected" && wasStarted && saved) window.location.reload();
}

export function startAnalytics() {
  if (getConsent() !== "accepted") return;
  const analytics = window as AnalyticsWindow;
  analytics["ga-disable-G-P7F0DM83L3"] = false;
  if (started) return;
  started = true;
  analytics.dataLayer = analytics.dataLayer || [];
  // gtag consumes arguments objects, as in Google's documented snippet.
  // eslint-disable-next-line prefer-rest-params
  analytics.gtag = function () { analytics.dataLayer!.push(arguments); };
  analytics.gtag("consent", "default", {
    analytics_storage: "denied", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  analytics.gtag("consent", "update", { analytics_storage: "granted" });
  analytics.gtag("js", new Date());
  analytics.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_domain: "none",
    cookie_path: "/",
    cookie_expires: MAX_AGE,
    cookie_update: false,
    cookie_flags: "SameSite=Lax;Secure",
  });
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function stopAnalytics() {
  const analytics = window as AnalyticsWindow;
  analytics["ga-disable-G-P7F0DM83L3"] = true;
  // No denied-consent ping: basic consent mode sends nothing without consent.
  // The loaded library stays disabled until reload or an explicit new grant.
  for (const name of ["_ga", "_ga_P7F0DM83L3"]) {
    for (const domain of ["", `;Domain=${window.location.hostname}`]) {
      document.cookie = `${name}=;Max-Age=0;Path=/${domain};SameSite=Lax`;
    }
  }
}
