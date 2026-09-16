"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { chooseConsent, getConsent, SETTINGS_EVENT, startAnalytics, stopAnalytics, subscribeConsent } from "./analytics";
import styles from "./analytics-consent.module.css";

export function CookieSettingsButton() {
  return <button className={styles.settings} type="button" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>Cookie settings</button>;
}

export function AnalyticsConsent() {
  const choice = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Read browser storage here: the first hydration snapshot is deliberately
    // null and must not erase a returning visitor's accepted Analytics cookies.
    if (getConsent() === "accepted") startAnalytics();
    else stopAnalytics();
  }, [choice]);

  useEffect(() => {
    const open = () => {
      returnFocus.current = document.activeElement as HTMLElement;
      setSettingsOpen(true);
    };
    window.addEventListener(SETTINGS_EVENT, open);
    return () => window.removeEventListener(SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (settingsOpen) heading.current?.focus();
  }, [settingsOpen]);

  const close = () => {
    setSettingsOpen(false);
    returnFocus.current?.focus();
  };

  if (choice !== null && !settingsOpen) return null;

  return (
    <section className={styles.banner} aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description"
      onKeyDown={(event) => { if (event.key === "Escape" && choice !== null) close(); }}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Your privacy</p>
        <h2 id="analytics-consent-title" ref={heading} tabIndex={-1}>Optional analytics</h2>
        <p id="analytics-consent-description">
          With your permission, we use Google Analytics cookies to understand visits and improve this site.
          Google receives information about your browsing. No advertising. You can reject analytics and use the whole site.
        </p>
        <p className={styles.details}>
          Change your choice anytime in Cookie settings. <Link href="/privacy/">Privacy policy</Link>{" · "}<Link href="/gdpr/">Cookie details</Link>
        </p>
        {settingsOpen && <p className={styles.details}>Current choice: {choice === "accepted" ? "analytics allowed" : choice === "rejected" ? "analytics rejected" : "not yet chosen"}.</p>}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.choice} onClick={() => { chooseConsent("rejected"); close(); }}>Reject analytics</button>
        <button type="button" className={styles.choice} onClick={() => { chooseConsent("accepted"); close(); }}>Accept analytics</button>
        {settingsOpen && choice !== null && <button type="button" className={styles.close} onClick={close}>Keep current choice</button>}
      </div>
    </section>
  );
}
