import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArchiveFooter,
  ArchiveHeader,
  ArrowIcon,
  BranchVariables,
  StatePill,
} from "../../archive-components";
import { archiveEntries, getArchiveEntry } from "../../archive-data";
import styles from "../../archive.module.css";
import { siteAsset } from "../../site-path";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return archiveEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);

  if (!entry) return {};

  return {
    title: `${entry.title} · QO.AX Living Archive`,
    description: entry.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);

  if (!entry) notFound();

  const related = archiveEntries
    .filter((candidate) => candidate.branch.slug === entry.branch.slug && candidate.slug !== entry.slug)
    .slice(0, 3);

  return (
    <div className={`${styles.page} ${styles.detailPage}`} style={BranchVariables(entry.branch)}>
      <ArchiveHeader />
      <main id="main-content">
        <section className={styles.detailHero}>
          <div className={styles.detailHeroMedia}>
            {entry.image ? (
              <Image src={entry.image} alt="" fill priority sizes="100vw" />
            ) : (
              <div className={styles.detailHeroMediaFallback}>
                <Image src={siteAsset("/brand/qoax-mark.svg")} alt="" fill sizes="40vw" />
              </div>
            )}
          </div>

          <nav className={styles.detailBreadcrumb} aria-label="Breadcrumb">
            <Link href="/">Archive</Link><span>/</span>
            <Link href={`/#${entry.branch.slug}`}>{entry.branch.shortTitle}</Link><span>/</span>
            <span>{entry.title}</span>
          </nav>

          <div className={styles.detailHeroCopy}>
            <p className={styles.kicker}><span>{entry.branch.index}</span>{entry.subtitle}</p>
            <h1>{entry.title}</h1>
            <div className={styles.detailHeroBottom}>
              <p>{entry.summary}</p>
              <div className={styles.detailActions}>
                <StatePill state={entry.state} label={entry.signal ?? entry.state} />
                {(entry.href ?? entry.project?.href) && (
                  <a className={styles.detailAction} href={entry.href ?? entry.project?.href} target="_blank" rel="noreferrer">
                    Visit live project <ArrowIcon diagonal />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.detailBody}>
          <section className={styles.detailFacts} aria-label="Project facts">
            <div className={styles.detailFact}><span>Archive branch</span><strong>{entry.branch.shortTitle}</strong></div>
            <div className={styles.detailFact}><span>Date / horizon</span><strong>{entry.year}</strong></div>
            <div className={styles.detailFact}><span>Type</span><strong>{entry.project?.category ?? entry.subtitle}</strong></div>
            <div className={styles.detailFact}><span>With</span><strong>{entry.partner ?? entry.project?.client ?? "QO.AX Community"}</strong></div>
          </section>

          <section className={styles.detailNarrative}>
            <div className={styles.detailNarrativeAside}>Why it belongs here</div>
            <div className={styles.detailNarrativeCopy}>
              <h2>{entry.branch.thesis}</h2>
              <p>
                {entry.detail
                  ? entry.detail
                  : entry.project
                  ? `${entry.title} is documented here as part of QO.AX Community’s non-profit work. The project keeps its own identity while staying connected to the wider network of schools, students, art, and public-interest organizations.`
                  : entry.state === "locked"
                    ? "This node is intentionally visible before it is public work. It marks a direction to unlock without making claims about a project that has not been announced."
                    : "This achievement is part of the community lineage: a relationship, programme, or shared effort that helped the branch grow."}
              </p>
              {entry.notice && <p className={styles.detailNotice}>{entry.notice}</p>}
              {entry.project?.tech && (
                <div className={styles.techList} aria-label="Technologies">
                  {entry.project.tech.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              )}
              <div className={styles.priorityLine} aria-label={`Archive priority ${entry.priority} of 5`}>
                {Array.from({ length: 5 }, (_, index) => <i data-active={index < entry.priority} key={index} />)}
              </div>
            </div>
          </section>

          {related.length > 0 && (
            <section className={styles.relatedSection}>
              <div className={styles.relatedHeader}><span>Continue this branch</span><span>{entry.branch.title}</span></div>
              <div className={styles.relatedGrid}>
                {related.map((candidate, index) => (
                  <Link className={styles.relatedCard} href={`/projects/${candidate.slug}`} key={candidate.slug}>
                    <span>{(index + 1).toString().padStart(2, "0")} · {candidate.signal ?? candidate.year}</span>
                    <strong>{candidate.title}</strong>
                    <ArrowIcon diagonal />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <ArchiveFooter />
    </div>
  );
}
