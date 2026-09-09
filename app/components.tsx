import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArchiveEntry } from "./archive-data";
import { kindLabels } from "./archive-tree-data";
import { legalEntity } from "./legal-data";
import { siteAsset } from "./site-path";
import styles from "./site.module.css";

export const CONTACT_EMAIL = "contact@qo.ax";
export const ACADEMY_URL = "https://qoax.academy/";
export const GITHUB_URL = "https://github.com/qoax-community";

export const primaryNavigation = [
  ["Events", "/#upcoming"],
  ["Our work", "/events"],
  ["Schools", "/#schools"],
  ["About", "/about"],
] as const;

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

export function RecordCard({ entry, priority = false }: { entry: ArchiveEntry; priority?: boolean }) {
  return (
    <Link className={styles.card} href={`/projects/${entry.slug}`}>
      <div className={styles.cardMedia}>
        <EntryVisual entry={entry} priority={priority} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTags}>
          <Tag tone={toneForEntry(entry)}>{entry.signal ?? kindLabels[entry.kind]}</Tag>
          <span className={styles.cardYear}>{entry.year}</span>
        </div>
        <h3 className={styles.cardTitle}>{entry.title}</h3>
        <p className={styles.cardCopy}>{entry.summary}</p>
        <span className={styles.cardFooter}>
          <span>{entry.partner}</span>
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

export function EventCard({ entry }: { entry: ArchiveEntry }) {
  const [day, month] = entry.calendar ?? ["TBA", ""];
  return (
    <Link className={styles.eventCard} href={`/projects/${entry.slug}`}>
      <div className={styles.cardTags}>
        <Tag tone={toneForEntry(entry)}>{entry.signal ?? kindLabels[entry.kind]}</Tag>
        <span className={styles.cardYear}>{kindLabels[entry.kind]}</span>
      </div>
      <div className={styles.eventDate}>
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.summary}</p>
      <span className={styles.eventFooter}>
        <span>{entry.location ?? entry.partner}</span>
        <ArrowRight />
      </span>
    </Link>
  );
}

/* ---------- Header / Footer ---------- */

function NavLinks({ onDark = false }: { onDark?: boolean }) {
  return (
    <>
      {primaryNavigation.map(([label, href]) => (
        <Link className={onDark ? undefined : styles.navLink} href={href} key={href}>{label}</Link>
      ))}
      <a className={onDark ? undefined : styles.navLink} href={ACADEMY_URL} rel="noreferrer" target="_blank">
        Academy <ArrowUpRight size={14} />
      </a>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="Qoax Community home">
          <Image src={siteAsset("/brand/qoax-logo.svg")} alt="Qoax" width={294} height={97} priority />
          <span className={styles.brandTag}>Community</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          <NavLinks />
        </nav>

        <div className={styles.headerActions}>
          <Button href={`mailto:${CONTACT_EMAIL}`} variant="primary" small>
            Get in touch
          </Button>
          <details className={styles.menu}>
            <summary className={styles.menuButton} aria-label="Open menu">
              <MenuIcon size={22} className={styles.menuOpenIcon} />
              <CloseIcon size={22} className={styles.menuCloseIcon} />
            </summary>
            <nav className={styles.menuPanel} aria-label="Mobile navigation">
              <NavLinks onDark />
              <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
              <div className={styles.menuLegal}>
                {legalNavigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Link href="/" aria-label="Qoax Community home" className={styles.footerLogo}>
            <Image src={siteAsset("/brand/qoax-logo.svg")} alt="Qoax" width={294} height={97} />
            <span>Community</span>
          </Link>
          <p>
            An independent non-profit in Sofia, Bulgaria. Hackathons, game jams, tournaments, and school programmes,
            plus useful technology for artists and civic organizations. Built with people, shared openly.
          </p>
          <a className={styles.footerMail} href={`mailto:${CONTACT_EMAIL}`}>
            <MailIcon size={16} /> {CONTACT_EMAIL}
          </a>
        </div>

        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <h3>Explore</h3>
            <nav aria-label="Footer navigation">
              {primaryNavigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
              <a href={ACADEMY_URL} rel="noreferrer" target="_blank">Qoax Academy <ArrowUpRight size={13} /></a>
            </nav>
          </div>
          <div className={styles.footerCol}>
            <h3>Community</h3>
            <nav aria-label="Community links">
              <Link href="/projects/atanasoff48">Atanasoff48</Link>
              <Link href="/projects/fmi-game-jam">FMI Game Jam</Link>
              <Link href="/projects/fmi-esports-tournament-2027">Gaming Tournament</Link>
              <a href={GITHUB_URL} rel="noreferrer" target="_blank">GitHub <ArrowUpRight size={13} /></a>
            </nav>
          </div>
          <div className={styles.footerCol}>
            <h3>Legal</h3>
            <nav aria-label="Legal navigation">
              {legalNavigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </nav>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Qoax Community. {legalEntity.nameEn}, UIC {legalEntity.uic}.</span>
        <span>Sofia, Bulgaria</span>
      </div>
    </footer>
  );
}

/* ---------- Page hero (inner pages) ---------- */

export function PageHero({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  children?: ReactNode;
}) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={styles.container}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.pageTitle}>{title}</h1>
        {copy && <p className={styles.pageLead}>{copy}</p>}
        {children}
      </div>
    </section>
  );
}
