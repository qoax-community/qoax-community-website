import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArchiveEntry } from "./archive-data";
import { legalEntity } from "./legal-data";
import { siteAsset } from "./site-path";
import styles from "./site.module.css";
import ed from "./editorial.module.css";
import { socialLinks } from "./social-links";
import { NavLinks } from "./nav-links";
import { CookieSettingsButton } from "./analytics-consent";

export const CONTACT_EMAIL = "contact@qo.ax";
export const ACADEMY_URL = "https://qoax.academy/";
export const GITHUB_URL = "https://github.com/qoax-community";

export { primaryNavigation } from "./nav-links";

export const legalNavigation = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["GDPR", "/gdpr"],
] as const;

/* ---------- Icons ---------- */

type IconProps = { size?: number; className?: string };

function iconAttributes({ size = 18, className }: IconProps) {
  return {
    "aria-hidden": true as const,
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

function MenuIcon(props: IconProps) {
  return <svg {...iconAttributes(props)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

function MailIcon(props: IconProps) {
  return (
    <svg {...iconAttributes(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/* ---------- Primitives ---------- */

type ButtonVariant = "primary" | "secondary" | "light" | "ghost";

export function Button({
  href,
  children,
  variant = "primary",
  small = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  small?: boolean;
  external?: boolean;
}) {
  const className = [
    styles.button,
    variant === "primary" && styles.buttonPrimary,
    variant === "secondary" && styles.buttonSecondary,
    variant === "light" && styles.buttonLight,
    variant === "ghost" && styles.buttonGhost,
    small && styles.buttonSmall,
  ]
    .filter(Boolean)
    .join(" ");

  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    const rel = href.startsWith("http") ? "noreferrer" : undefined;
    const target = href.startsWith("http") ? "_blank" : undefined;
    return <a className={className} href={href} rel={rel} target={target}>{children}</a>;
  }
  return <Link className={className} href={href}>{children}</Link>;
}

export function EntryVisual({ entry, priority = false, sizes }: { entry: ArchiveEntry; priority?: boolean; sizes: string }) {
  if (entry.image) {
    return <Image src={entry.image} alt="" fill priority={priority} sizes={sizes} />;
  }
  if (entry.logo) {
    return (
      <div className={styles.visualLogo}>
        <Image src={entry.logo} alt="" fill priority={priority} sizes={sizes} />
      </div>
    );
  }
  return (
    <div className={styles.visualPlaceholder} aria-hidden="true">
      <span>{entry.mark ?? entry.title.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

/* ---------- Header / Footer ---------- */

const footerCommunity = [
  ["Events", "/events"],
  ["Our work", "/work"],
  ["Schools", "/schools"],
  ["Journal", "/blog"],
] as const;

export function SiteHeader() {
  return (
    <header className={ed.top}>
      <div className={`${ed.wrap} ${ed.topInner}`}>
        <Link className={ed.brand} href="/" aria-label="Qoax home">
          <Image className={ed.brandLogo} src={siteAsset("/brand/qoax-logo.svg")} alt="Qoax" width={294} height={97} priority />
        </Link>

        <nav className={ed.nav} aria-label="Primary navigation">
          <NavLinks />
        </nav>

        <div className={ed.topRight}>
          <a className={`${ed.btnGhost} ${ed.btnSmall}`} href={`mailto:${CONTACT_EMAIL}`}>
            <MailIcon size={15} /> {CONTACT_EMAIL}
          </a>
          <details className={ed.menu}>
            <summary className={ed.menuButton} aria-label="Open menu">
              <MenuIcon size={18} /> Menu
            </summary>
            <nav className={ed.menuPanel} aria-label="Mobile navigation">
              <NavLinks plain />
              <div className={ed.menuDivider} />
              <a href={`mailto:${CONTACT_EMAIL}`}>Get in touch</a>
              {legalNavigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={ed.foot}>
      <div className={ed.wrap}>
        <div className={ed.footGrid}>
          <div className={ed.footBrand}>
            <Link className={ed.brand} href="/" aria-label="Qoax home">
              <Image className={ed.brandLogo} src={siteAsset("/brand/qoax-logo-light.svg")} alt="Qoax" width={294} height={97} />
            </Link>
            <p>
              An independent non-profit in Sofia, Bulgaria. Hackathons, game jams, tournaments, and school programmes,
              plus useful technology for artists and civic organisations.
            </p>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>

          <div className={ed.footCol}>
            <h3>Community</h3>
            <ul>
              {footerCommunity.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
            </ul>
          </div>
          <div className={ed.footCol}>
            <h3>Organisation</h3>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><a href={GITHUB_URL} rel="noreferrer" target="_blank">GitHub ↗</a></li>
              {socialLinks.map((link) => (
                <li key={link.id}><a href={link.url} rel="noreferrer" target="_blank">{link.label} ↗</a></li>
              ))}
              {legalNavigation.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
              <li><CookieSettingsButton /></li>
            </ul>
          </div>
        </div>

        <div className={ed.footLegal}>
          <span>
            {`© ${new Date().getFullYear()} Qoax Community. ${legalEntity.nameEn}, UIC ${legalEntity.uic}. `}
            <span lang="bg">{`${legalEntity.nameBg}, ЕИК ${legalEntity.uic}.`}</span>
            {" Sofia, Bulgaria."}
          </span>
        </div>
      </div>
    </footer>
  );
}
