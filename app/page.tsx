import Image from "next/image";
import Link from "next/link";
import { ArchiveFooter, ArchiveHeader, ArrowIcon, StatePill } from "./archive-components";
import { nonprofitEntries } from "./archive-data";
import { siteAsset } from "./site-path";
import styles from "./archive.module.css";

const schoolPartners = [
  { name: "Private School St. Sofia", logo: "/partners/st-sofia.webp" },
  { name: "Technology School Electronic Systems", logo: "/partners/tues.png", href: "/projects/tues" },
  { name: "SPGE John Atanasoff", logo: "/partners/john-atanasoff.webp", href: "/projects/john-atanasoff-school" },
  { name: "Professional High School of Telecommunications", logo: "/partners/telecommunications-school.png", href: "/projects/telecommunications-schools-bulgaria" },
  { name: "PGVT A. S. Popov", logo: "/partners/popov.png", href: "/projects/popov-school", wide: true },
];

const schoolRecordIds = new Set([
  "tues",
  "john-atanasoff-school",
  "popov-school",
  "telecommunications-schools-bulgaria",
]);

export default function Home() {
  const upcoming = nonprofitEntries.find((entry) => entry.id === "atanasoff48");
  const fieldworkEntries = nonprofitEntries.filter((entry) => !schoolRecordIds.has(entry.id));

  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main id="main-content">
        <section className={styles.bulletinHero}>
          <p className={styles.heroLabel}><span>Community paper · Issue 01</span><span>Sofia · August 2026</span></p>
          <div className={styles.heroTitle}>
            <p>Our front-page principle</p>
            <h1>Public work,<br /><em>made with people.</em></h1>
            <small>Useful technology should leave knowledge, confidence, and local capacity behind.</small>
          </div>
          <aside className={styles.heroBrief}>
            <span>Inside this issue</span>
            <p>QOAX Community brings useful technology, mentorship, and practical support to schools, students, artists, and civic organizations.</p>
            <dl>
              <div><dt>Open records</dt><dd>{nonprofitEntries.length.toString().padStart(2, "0")}</dd></div>
              <div><dt>Students / 2026</dt><dd>30+</dd></div>
            </dl>
          </aside>
        </section>

        {upcoming && (
          <Link className={styles.currentNotice} href={`/projects/${upcoming.slug}`}>
            <span className={styles.noticeTag}>Next in the field</span>
            <strong>Atanasoff48</strong>
            <span>{upcoming.year} · SPGE John Atanasoff STEM Centre</span>
            <span className={styles.noticeArrow}><ArrowIcon diagonal /></span>
          </Link>
        )}

        <section className={styles.schoolsSection} aria-labelledby="schools-heading">
          <div className={styles.schoolsHeading}>
            <div>
              <p className={styles.kicker}><span>01</span>School network</p>
              <h2 id="schools-heading">Schools we work with</h2>
            </div>
            <p>Long-term relationships, student programmes, and practical work shared with educators.</p>
          </div>
          <ul className={styles.schoolLogoRow} aria-label="QOAX Community school partners">
            {schoolPartners.map((school) => (
              <li className={school.wide ? styles.schoolLogoWide : undefined} key={school.name}>
                {school.href ? (
                  <Link href={school.href} aria-label={`Read about our work with ${school.name}`}>
                    <Image src={siteAsset(school.logo)} alt={`${school.name} logo`} fill sizes="(max-width: 720px) 45vw, 20vw" />
                  </Link>
                ) : (
                  <Image src={siteAsset(school.logo)} alt={`${school.name} logo`} fill sizes="(max-width: 720px) 45vw, 20vw" />
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.academyFeature} aria-labelledby="academy-heading">
          <header className={styles.academyHeader}>
            <p className={styles.kicker}><span>02</span>QOAX Academy</p>
            <span>Starting October 2026</span>
          </header>
          <div className={styles.academyLead}>
            <div>
              <p>Two learning paths</p>
              <h2 id="academy-heading">One strong foundation.<br />Two directions to grow.</h2>
            </div>
            <p>Students begin by making things move and respond. From age 10, they can focus on algorithms or game development.</p>
          </div>
          <div className={styles.academyPaths}>
            <article>
              <span>Path 01</span>
              <h3>Algorithms and tournaments</h3>
              <p>Solve precise problems, learn C++ and prepare for programming competitions.</p>
              <small>C++ · Algorithms · Tournaments</small>
            </article>
            <article>
              <span>Path 02</span>
              <h3>Game development</h3>
              <p>Create games with visual blocks and JavaScript, then progress to Unity, 3D and real applications.</p>
              <small>Blocks · JavaScript · Unity · 3D</small>
            </article>
          </div>
          <footer className={styles.academyFooter}>
            <p>Project-led classes run inside QOAX Studio, where every student builds work that runs, moves, and responds.</p>
            <a href="https://qoax.academy/">Explore QOAX Academy <ArrowIcon diagonal /></a>
          </footer>
        </section>

        <section className={styles.fieldworkSection} aria-labelledby="fieldwork-heading">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}><span>03</span>Public work first</p>
              <h2 id="fieldwork-heading">Fieldwork ledger</h2>
            </div>
            <p>Every record opens. New and current work is placed first; completed work stays visible as shared memory.</p>
          </div>

          <div className={styles.fieldGrid}>
            {fieldworkEntries.map((entry, index) => (
              <Link
                className={styles.fieldCard}
                href={`/projects/${entry.slug}`}
                key={entry.slug}
              >
                <div className={styles.cardTopline}>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                  <StatePill state={entry.state} label={entry.signal ?? entry.state} />
                </div>
                {entry.image && (
                  <div className={styles.cardImage}>
                    <Image src={entry.image} alt="" fill priority={index < 2} sizes="(max-width: 760px) 100vw, 50vw" />
                  </div>
                )}
                <div className={styles.cardCopy}>
                  <p>{entry.subtitle}</p>
                  <h3>{entry.title}</h3>
                  <span>{entry.year} · {entry.partner}</span>
                </div>
                <span className={styles.cardArrow}><ArrowIcon diagonal /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.communityStatement}>
          <p>Our measure of progress</p>
          <blockquote>Leave people with more skill, more confidence, and something useful that did not exist before.</blockquote>
          <Link href="/about">Read why we do it <ArrowIcon /></Link>
        </section>
      </main>
      <ArchiveFooter />
    </div>
  );
}
