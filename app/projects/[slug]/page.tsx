import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveFooter, ArchiveHeader, ArrowIcon, StatePill } from "../../archive-components";
import { archiveEntries, getArchiveEntry } from "../../archive-data";
import styles from "../../archive.module.css";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return archiveEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) return {};
  return { title: `${entry.title} · QOAX Community`, description: entry.summary };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) notFound();

  const recordNumber = archiveEntries.findIndex((candidate) => candidate.slug === entry.slug) + 1;
  const related = archiveEntries.filter((candidate) => candidate.slug !== entry.slug).slice(0, 3);

  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main id="main-content">
        <nav className={styles.projectBreadcrumb} aria-label="Breadcrumb">
          <Link href="/">Community</Link><span>/</span>
          <Link href="/events">Fieldwork</Link><span>/</span>
          <span>{recordNumber.toString().padStart(2, "0")}</span>
        </nav>

        <article className={styles.caseSheet}>
          <header className={styles.caseHeader}>
            <div className={styles.caseIndex}>
              <span>Field record</span>
              <strong>{recordNumber.toString().padStart(2, "0")}</strong>
            </div>
            <div className={`${styles.caseTitle} ${entry.title.length > 20 ? styles.caseTitleLong : ""}`}>
              <p>{entry.subtitle}</p>
              <h1>{entry.title}</h1>
              <div className={styles.caseTitleBottom}>
                <p>{entry.summary}</p>
                <StatePill state={entry.state} label={entry.signal ?? entry.state} />
              </div>
            </div>
          </header>

          <div className={styles.caseFacts} aria-label="Project facts">
            <div><span>Date / horizon</span><strong>{entry.year}</strong></div>
            <div><span>Type</span><strong>{entry.project?.category ?? entry.subtitle}</strong></div>
            <div><span>With</span><strong>{entry.partner ?? entry.project?.client ?? "QOAX Community"}</strong></div>
            <div><span>Priority</span><strong>{entry.priority} / 5</strong></div>
          </div>

          <div className={styles.caseContent}>
            <section className={styles.caseNarrative}>
              <p className={styles.kicker}><span>A</span>Why it belongs here</p>
              <h2>{entry.branch.thesis}</h2>
              <p>
                {entry.detail
                  ? entry.detail
                  : entry.project
                    ? `${entry.title} is documented here as part of QOAX Community’s non-profit work. The project keeps its own identity while staying connected to the wider network of schools, students, art, and public-interest organizations.`
                    : "This field record documents a relationship, programme, or shared effort that helped the community network grow."}
              </p>
              {entry.notice && <p className={styles.caseNotice}>{entry.notice}</p>}
              {(entry.href ?? entry.project?.href) && (
                <a className={styles.caseAction} href={entry.href ?? entry.project?.href} target="_blank" rel="noreferrer">
                  Visit live project <ArrowIcon diagonal />
                </a>
              )}
            </section>

            <aside className={styles.caseVisual}>
              {entry.image ? (
                <Image src={entry.image} alt="" fill priority sizes="(max-width: 800px) 100vw, 42vw" />
              ) : (
                <div className={styles.casePoster} aria-hidden="true">
                  <span>QOAX / COMMUNITY</span>
                  <strong>{entry.title.slice(0, 2).toUpperCase()}</strong>
                  <small>Sofia · Field record {recordNumber.toString().padStart(2, "0")}</small>
                </div>
              )}
            </aside>
          </div>
        </article>

        <section className={styles.relatedSection}>
          <div className={styles.relatedHeader}><span>Next records</span><Link href="/events">View all {archiveEntries.length} ↗</Link></div>
          <div className={styles.relatedGrid}>
            {related.map((candidate) => (
              <Link className={styles.relatedCard} href={`/projects/${candidate.slug}`} key={candidate.slug}>
                <span>{candidate.signal ?? candidate.year}</span>
                <strong>{candidate.title}</strong>
                <ArrowIcon diagonal />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <ArchiveFooter />
    </div>
  );
}
