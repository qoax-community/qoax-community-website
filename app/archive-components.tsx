import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AchievementState } from "./archive-tree-data";
import { siteAsset } from "./site-path";
import styles from "./archive.module.css";

const navigation = [
  ["Community work", "/events"],
  ["About", "/about"],
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

export function ArchiveHeader({ inverse = true }: { inverse?: boolean }) {
  return (
    <header className={`${styles.header} ${inverse ? styles.headerInverse : ""}`}>
      <Link className={styles.brand} href="/" aria-label="QO.AX home">
        <Image src={siteAsset("/brand/qoax-logo.svg")} alt="QO.AX" width={294} height={97} priority />
        <span>Community archive</span>
      </Link>
      <nav className={styles.navigation} aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <a className={styles.githubLink} href="https://github.com/QOAX-COMMUNITY" target="_blank" rel="noreferrer">
        GitHub <ArrowIcon diagonal />
      </a>
      <details className={styles.mobileMenu}>
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <a href="https://github.com/QOAX-COMMUNITY" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </details>
    </header>
  );
}

export function ArchiveFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLead}>
        <p>QO.AX / Sofia</p>
        <h2>More branches<br />are still growing.</h2>
      </div>
      <div className={styles.footerGrid}>
        <p>Non-profit technology work with schools, students, artists, and public-interest organizations.</p>
        <nav aria-label="Footer navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div>
          <a href="mailto:contact@qo.ax">contact@qo.ax ↗</a>
          <a href="https://atanasoff48.com/" target="_blank" rel="noreferrer">Atanasoff48 ↗</a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} QOAX COMMUNITY</span>
        <span>Built in the open</span>
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

export function BranchVariables({ color, rgb }: { color: string; rgb: string }) {
  return { "--branch": color, "--branch-rgb": rgb } as CSSProperties;
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
