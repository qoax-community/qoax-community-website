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

export function ArrowRight(props: IconProps) {
  return <svg {...iconAttributes(props)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function ArrowUpRight(props: IconProps) {
  return <svg {...iconAttributes(props)}><path d="M7 17 17 7M8 7h9v9" /></svg>;
}

export function MenuIcon(props: IconProps) {
  return <svg {...iconAttributes(props)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...iconAttributes(props)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...iconAttributes(props)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...iconAttributes(props)}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...iconAttributes(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...iconAttributes(props)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
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

export type TagTone = "neutral" | "accent" | "live";

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: TagTone }) {
  const className = [
    styles.tag,
    tone === "accent" && styles.tagAccent,
    tone === "live" && styles.tagLive,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={className}>{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  copy,
  action,
  id,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  copy?: string;
  action?: ReactNode;
  id?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={`${styles.sectionHead} ${align === "center" ? styles.sectionHeadCenter : ""}`}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
        {copy && <p className={styles.lead}>{copy}</p>}
      </div>
      {action && <div className={styles.sectionAction}>{action}</div>}
    </div>
  );
}

export function toneForEntry(entry: ArchiveEntry): TagTone {
  if (entry.signal === "Upcoming") return "live";
  if (entry.state === "growing") return "accent";
  return "neutral";
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
        <Link className={ed.brand} href="/" aria-label="Qoax Community home">
          <Image className={ed.brandBadge} src={siteAsset("/brand/qoax-favicon-community.svg")} alt="" width={96} height={96} priority />
          <Image className={ed.brandLogo} src={siteAsset("/brand/qoax-logo.svg")} alt="Qoax" width={294} height={97} priority />
          <span className={ed.brandName}>Community</span>
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
            <Link className={ed.brand} href="/" aria-label="Qoax Community home">
              <Image className={ed.brandBadge} src={siteAsset("/brand/qoax-favicon-community.svg")} alt="" width={96} height={96} />
            <Image className={ed.brandLogo} src={siteAsset("/brand/qoax-logo.svg")} alt="Qoax" width={294} height={97} />
              <span className={ed.brandName}>Community</span>
            </Link>
            <p>
              An independent non-profit in Sofia, Bulgaria. Hackathons, game jams, tournaments, and school programmes,
              plus useful technology for artists and civic organisations. Public work first.
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
