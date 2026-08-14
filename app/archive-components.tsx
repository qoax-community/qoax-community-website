import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AchievementState } from "./archive-tree-data";
import { siteAsset } from "./site-path";
import styles from "./archive.module.css";

const navigation = [
  ["Fieldwork", "/events"],
  ["Why we do it", "/about"],
] as const;

export function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      {diagonal ? (
        <path d="M7 17 17 7M8 7h9v9" />
      ) : (
        <path d="M5 12h14m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}

export function ArchiveHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.wordmark} href="/" aria-label="QOAX Community home">
        <Image src={siteAsset("/brand/qoax-logo.svg")} alt="QOAX" width={294} height={97} priority />
        <span>Community</span>
      </Link>
      <nav className={styles.navigation} aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
        <a href="https://qoax.academy/">Academy ↗</a>
      </nav>
      <a className={styles.contactLink} href="mailto:contact@qo.ax">
        contact@qo.ax <ArrowIcon diagonal />
      </a>
      <details className={styles.mobileMenu}>
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <a href="https://qoax.academy/">Academy ↗</a>
          <a href="mailto:contact@qo.ax">Contact ↗</a>
        </nav>
      </details>
    </header>
  );
}

export function ArchiveFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerFlag}>
        <span>QOAX / COMMUNITY</span>
        <span>Sofia, Bulgaria</span>
      </div>
      <div className={styles.footerMain}>
        <h2>Useful work.<br />Shared openly.</h2>
        <div className={styles.footerLinks}>
          <nav aria-label="Footer navigation">
            {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <a href="https://qoax.academy/">Academy ↗</a>
          </nav>
          <div>
            <a href="mailto:contact@qo.ax">contact@qo.ax ↗</a>
            <a href="https://github.com/qoax-community" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} QOAX Community</span>
        <span>Independent non-profit practice</span>
      </div>
    </footer>
  );
}

export function StatePill({ state, label }: { state: AchievementState; label?: string }) {
  return (
    <span className={styles.statePill} data-state={state}>
      <i aria-hidden="true" />
      {label ?? state}
    </span>
  );
}

export function PageHeading({
  index,
  eyebrow,
  title,
  copy,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  copy: string;
  children?: ReactNode;
}) {
  return (
    <section className={styles.pageHeading}>
      <p className={styles.kicker}><span>{index}</span>{eyebrow}</p>
      <h1>{title}</h1>
      <div className={styles.pageHeadingBottom}>
        <p>{copy}</p>
        {children}
      </div>
    </section>
  );
}
