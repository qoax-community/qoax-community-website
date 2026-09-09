import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Button,
  CalendarIcon,
  CONTACT_EMAIL,
  EntryVisual,
  PinIcon,
  SiteFooter,
  SiteHeader,
  Tag,
  toneForEntry,
  UsersIcon,
} from "../../components";
import { Countdown } from "../../countdown";
import { archiveEntries, getArchiveEntry } from "../../archive-data";
import { isUpcoming, kindLabels } from "../../archive-tree-data";
import styles from "../../site.module.css";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return archiveEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    openGraph: entry.image && !entry.image.endsWith(".svg") ? { images: [{ url: entry.image }] } : undefined,
  };
}

const stateLabel = { unlocked: "Completed", growing: "Active", locked: "Planned" } as const;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) notFound();

  const liveUrl = entry.href ?? entry.project?.href;
  const isEvent = entry.kind === "event";
  const hasCountdown = isUpcoming(entry);
  const related = archiveEntries
    .filter((candidate) => candidate.slug !== entry.slug)
    .sort((a, b) => Number(b.kind === entry.kind) - Number(a.kind === entry.kind))
    .slice(0, 3);

  const narrative = entry.detail
    ? entry.detail
    : entry.project
      ? `${entry.title} is documented here as part of Qoax Community’s non-profit work. The project keeps its own identity while staying connected to the wider network of schools, students, art, and public-interest organizations.`
      : `${entry.title} is a relationship, programme, or shared effort that helps the community network grow. We document it here so that the people involved, and the schools and organizations around them, can see the work and build on it.`;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content">
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/events">Our work</Link><span aria-hidden="true">/</span>
            <span>{entry.title}</span>
          </nav>

          <article>
            <header className={styles.projectHero}>
              <div>
                <div className={styles.projectTags}>
                  <Tag tone={toneForEntry(entry)}>{entry.signal ?? kindLabels[entry.kind]}</Tag>
                  <Tag>{kindLabels[entry.kind]}</Tag>
                  {isEvent && <Tag>{entry.year}</Tag>}
                </div>
                <h1 className={styles.projectTitle}>{entry.title}</h1>
                <p className={styles.projectSubtitle}>{entry.subtitle}</p>
                <p className={styles.projectSummary}>{entry.summary}</p>
                <div className={styles.projectActions}>
                  {liveUrl && (
                    <Button href={liveUrl} external>
                      {isEvent ? "Register" : "Visit"} · {new URL(liveUrl).hostname.replace(/^www\./, "")} <ArrowUpRight size={16} />
                    </Button>
                  )}
                  <Button href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(entry.title)}`} variant={liveUrl ? "secondary" : "primary"}>
                    {isEvent ? "Join as a school or partner" : "Ask about this work"}
                  </Button>
                </div>
              </div>
              <div className={styles.projectVisual}>
                <EntryVisual entry={entry} priority sizes="(max-width: 960px) 100vw, 45vw" />
                {entry.imageCredit && <span className={styles.projectVisualCredit}>{entry.imageCredit}</span>}
              </div>
            </header>

            <dl className={styles.facts} aria-label="Key facts">
              <div className={styles.fact}><dt><span>{isEvent ? "When" : "Date"}</span></dt><dd><strong>{entry.year}</strong></dd></div>
              <div className={styles.fact}><dt><span>Type</span></dt><dd><strong>{entry.project?.category ?? kindLabels[entry.kind]}</strong></dd></div>
              <div className={styles.fact}><dt><span>With</span></dt><dd><strong>{entry.partner ?? entry.project?.client ?? "Qoax Community"}</strong></dd></div>
              <div className={styles.fact}><dt><span>{entry.location ? "Where" : "Status"}</span></dt><dd><strong>{entry.location ?? stateLabel[entry.state]}</strong></dd></div>
            </dl>

            <div className={styles.projectBody}>
              <section className={styles.prose} aria-labelledby="why-heading">
                <p className={styles.eyebrow}>{isEvent ? "About the event" : "Why it belongs here"}</p>
                <h2 id="why-heading">{isEvent ? entry.subtitle : entry.branch.thesis}</h2>
                <p>{narrative}</p>
                {entry.notice && <p className={styles.notice}>{entry.notice}</p>}

                {entry.story && (
                  <div className={styles.story}>
                    {entry.story.map((section) => (
                      <section className={styles.storySection} key={section.title}>
                        <h3>{section.title}</h3>
                        {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        {section.bullets && (
                          <ul>
                            {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                          </ul>
                        )}
                        {section.timeline && (
                          <ol className={styles.timelineList}>
                            {section.timeline.map(([when, what]) => (
                              <li key={when}><strong>{when}</strong><span>{what}</span></li>
                            ))}
                          </ol>
                        )}
                      </section>
                    ))}
                  </div>
                )}

                {entry.gallery && (
                  <section className={styles.storySection} style={{ marginTop: "clamp(28px, 3vw, 40px)" }} aria-label="Gallery">
                    <h3>In pictures</h3>
                    <div className={styles.gallery}>
                      {entry.gallery.map((image) => (
                        <figure key={image.src}>
                          <div><Image src={image.src} alt={image.alt} fill sizes="(max-width: 720px) 100vw, 400px" /></div>
                          {image.caption && <figcaption>{image.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  </section>
                )}

                {isEvent && (
                  <p style={{ marginTop: 28 }}>
                    <span className={styles.eyebrow} style={{ marginBottom: 0 }}>Why it belongs here</span>
                  </p>
                )}
                {isEvent && <p>{entry.branch.thesis}</p>}
              </section>

              <aside>
                <div className={styles.sideCard}>
                  <h3>At a glance</h3>
                  <ul className={styles.sideList}>
                    <li><CalendarIcon size={16} /><span>{entry.year}</span></li>
                    {entry.location && <li><PinIcon size={16} /><span>{entry.location}</span></li>}
                    <li><UsersIcon size={16} /><span>{entry.partner ?? entry.project?.client ?? "Qoax Community"}</span></li>
                  </ul>
                  {hasCountdown && entry.startsAt && (
                    <div className={styles.sideCountdown}>
                      <Countdown target={entry.startsAt} label={`Time until ${entry.title}`} />
                    </div>
                  )}
                  {entry.facts && (
                    <div className={styles.projectTags} style={{ marginTop: 16 }}>
                      {entry.facts.map(([label, value]) => <Tag key={label}>{label}: {value}</Tag>)}
                    </div>
                  )}
                  {entry.project?.tech && (
                    <div className={styles.projectTags} style={{ marginTop: 16 }}>
                      {entry.project.tech.map((item) => <Tag key={item}>{item}</Tag>)}
                    </div>
                  )}
                </div>

                {entry.links && (
                  <div className={styles.sideCard}>
                    <h3>Links</h3>
                    <div className={styles.sideLinks}>
                      {entry.links.map(([label, href]) => (
                        <a href={href} key={href} rel="noreferrer" target="_blank">
                          <span>{label}</span><ArrowUpRight size={16} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.sideCard}>
                  <h3>{isEvent ? "Bring your team" : "Get involved"}</h3>
                  <p>
                    {isEvent
                      ? "Schools, student clubs, and universities that want to send teams or help organize can reach us directly."
                      : "Students, teachers, and organizations connected to this work can reach the Qoax team directly."}
                  </p>
                  <Button href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(entry.title)}`} variant="secondary" small>{CONTACT_EMAIL}</Button>
                </div>
              </aside>
            </div>
          </article>
        </div>

        <section className={`${styles.sectionTight} ${styles.band}`} aria-labelledby="related-heading">
          <div className={styles.container}>
            <div className={styles.sectionHead} style={{ marginBottom: 24 }}>
              <h2 id="related-heading" style={{ fontSize: 26 }}>More from the community</h2>
              <Link className={styles.textLink} href="/events">All {archiveEntries.length} records <ArrowRight size={16} /></Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((candidate) => (
                <Link className={styles.relatedCard} href={`/projects/${candidate.slug}`} key={candidate.slug}>
                  <Tag tone={toneForEntry(candidate)}>{candidate.signal ?? kindLabels[candidate.kind]}</Tag>
                  <strong>{candidate.title}</strong>
                  <p>{candidate.subtitle}</p>
                  <ArrowUpRight />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
