import type { Metadata } from "next";
import { pageMetadata } from "../../seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, CONTACT_EMAIL, EntryVisual, SiteFooter, SiteHeader } from "../../components";
import { archiveEntries, getArchiveEntry } from "../../archive-data";
import { kindLabels, streamFor } from "../../archive-tree-data";
import styles from "../../site.module.css";

type ProjectPageProps = { params: Promise<{ slug: string }> };

// Prose is hyphenated automatically, which can split a web address such as spaceappschallenge.org
// into a version a reader might copy with the hyphen. Keep addresses whole.
function keepAddresses(text: string) {
  return text.split(/(\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:org|com|ax|bg|net|io)\b)/i).map((part, index) =>
    index % 2 ? <span className={styles.address} key={index}>{part}</span> : part,
  );
}

export function generateStaticParams() {
  return archiveEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) return {};
  return pageMetadata({
    title: entry.metaTitle ?? entry.title,
    description: entry.summary,
    path: `/projects/${entry.slug}/`,
    image: entry.image,
  });
}

const stateLabel = { unlocked: "Completed", growing: "Active", locked: "Planned" } as const;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) notFound();

  const liveUrl = entry.href ?? entry.project?.href;
  const isEvent = entry.kind === "event";
  const isCompletedEvent = isEvent && entry.state === "unlocked";
  const stream = streamFor(entry);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";
  const pageUrl = `${siteUrl}/projects/${entry.slug}/`;
  const eventSchema =
    isEvent && entry.startsAt
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          "@id": `${pageUrl}#event`,
          name: entry.title,
          description: entry.summary,
          url: pageUrl,
          startDate: entry.startsAt.slice(0, 10),
          eventStatus: "https://schema.org/EventScheduled",
          organizer: { "@id": `${siteUrl}/#organization` },
          ...(entry.location ? { location: { "@type": "Place", name: entry.location, address: entry.location } } : {}),
          ...(entry.image ? { image: `${siteUrl}${entry.image}` } : {}),
        }
      : undefined;
  const related = archiveEntries
    .filter((candidate) => candidate.slug !== entry.slug)
    .sort((a, b) => Number(b.kind === entry.kind) - Number(a.kind === entry.kind))
    .slice(0, 3);

  // Only real, entry-specific copy. No generic filler when an entry has no write-up yet.
  const narrative = entry.detail;
  const galleryCredit = entry.imageCredit && entry.gallery && entry.gallery.length > 1
    ? entry.imageCredit.replace(/^Photo:/, "Photos:")
    : entry.imageCredit;

  // The main action comes first. The hero column is too narrow for three buttons on one row,
  // so a main action placed last would wrap onto a row of its own.
  const mailAction = {
    key: "mail",
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(entry.title)}`,
    label: isCompletedEvent ? "Ask about this event" : isEvent ? "Join as a school or partner" : "Ask about this work",
    external: false,
  };
  const liveAction = liveUrl
    ? {
        key: "live",
        href: liveUrl,
        // Name the destination so visitors know they are leaving qo.ax.
        label: `${entry.liveLabel === "register" && !isCompletedEvent ? "Register on" : "Visit"} ${new URL(liveUrl).hostname.replace(/^www\./, "")}`,
        external: true,
      }
    : undefined;
  const streamAction = stream
    ? {
        key: "stream",
        href: stream.url,
        label: isCompletedEvent ? "Watch the recording" : stream.direct ? "Watch the stream" : "Watch live on YouTube",
        external: true,
      }
    : undefined;
  const actions = (isCompletedEvent ? [streamAction, liveAction, mailAction] : [liveAction, streamAction, mailAction])
    .filter((action): action is NonNullable<typeof action> => Boolean(action));

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content">
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/work">Our work</Link><span aria-hidden="true">/</span>
            <span>{entry.title}</span>
          </nav>

          <article>
            <header className={styles.projectHero}>
              <div>
                <p className={styles.projectMeta}>
                  <span className={entry.state === "growing" && isEvent ? styles.projectMetaLive : undefined}>{entry.signal ?? stateLabel[entry.state]}</span>
                </p>
                <h1 className={styles.projectTitle}>{entry.title}</h1>
                <p className={styles.projectSubtitle}>{entry.subtitle}</p>
                <p className={styles.projectSummary}>{entry.summary}</p>
                <div className={styles.projectActions}>
                  {actions.map((action, index) => (
                    <Button
                      external={action.external}
                      href={action.href}
                      key={action.key}
                      variant={index === 0 ? "primary" : "secondary"}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
              {(entry.image || entry.logo) && (
                <figure className={styles.projectFigure}>
                  <div className={styles.projectVisual}>
                    <EntryVisual entry={entry} priority sizes="(max-width: 960px) 100vw, 45vw" />
                  </div>
                  {entry.imageCredit && <figcaption className={styles.photoCredit}>{entry.imageCredit}</figcaption>}
                </figure>
              )}
            </header>

            <dl className={styles.facts} aria-label="Key facts">
              <div className={styles.fact}><dt><span>{isEvent ? "When" : "Date"}</span></dt><dd><strong>{entry.year}</strong></dd></div>
              <div className={styles.fact}><dt><span>Type</span></dt><dd><strong>{entry.project?.category ?? kindLabels[entry.kind]}</strong></dd></div>
              <div className={styles.fact}><dt><span>{entry.partnerLabel ?? "With"}</span></dt><dd><strong>{entry.partner ?? entry.project?.client ?? "Qoax Community"}</strong></dd></div>
              <div className={styles.fact}><dt><span>{entry.location ? "Where" : "Status"}</span></dt><dd><strong>{entry.location ?? stateLabel[entry.state]}</strong></dd></div>
            </dl>

            <div className={styles.projectBody}>
              <section className={styles.prose} aria-labelledby="why-heading">
                {narrative && (
                  <>
                    <h2 id="why-heading">{isEvent ? "About the event" : "About this work"}</h2>
                    <p>{narrative}</p>
                  </>
                )}
                {entry.notice && <p className={styles.notice}>{keepAddresses(entry.notice)}</p>}

                {entry.story && (
                  <div className={styles.story}>
                    {entry.story.map((section) => (
                      <section className={styles.storySection} key={section.title}>
                        <h3>{section.title}</h3>
                        {section.paragraphs?.map((paragraph) => <p key={paragraph}>{keepAddresses(paragraph)}</p>)}
                        {section.bullets && (
                          <ul>
                            {section.bullets.map((bullet) => <li key={bullet}>{keepAddresses(bullet)}</li>)}
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
                    {galleryCredit && <p className={styles.photoCredit}>{galleryCredit}</p>}
                  </section>
                )}

              </section>

              <aside>
                {stream && (
                  <div className={styles.sideCard}>
                    <h3>Stream</h3>
                    <p>
                      {isCompletedEvent
                        ? "The event was streamed live. The recording is on YouTube."
                        : "We plan to stream this event live on the Qoax YouTube channel."}
                    </p>
                    <div className={styles.sideLinks}>
                      <a href={stream.url} rel="noreferrer" target="_blank" data-stream-link="">
                        <span>{stream.direct ? (isCompletedEvent ? "Watch the recording" : "Open the stream") : "Qoax on YouTube"}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                )}

                {(entry.facts || entry.project?.tech) && (
                  <div className={styles.sideCard}>
                    <h3>Details</h3>
                    <dl className={styles.sideKv}>
                      {entry.facts?.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                      {entry.project?.tech && <div><dt>Built with</dt><dd>{entry.project.tech.join(", ")}</dd></div>}
                    </dl>
                  </div>
                )}

                {entry.links && (
                  <div className={styles.sideCard}>
                    <h3>Links</h3>
                    <div className={styles.sideLinks}>
                      {entry.links.map(([label, href]) => (
                        <a href={href} key={href} rel="noreferrer" target="_blank">
                          <span>{label}</span><span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.sideCard}>
                  <h3>{isCompletedEvent ? "About this event" : isEvent ? "Bring your team" : "Get involved"}</h3>
                  <p>
                    {isCompletedEvent
                      ? "For questions about the completed event, contact the Qoax team directly."
                      : isEvent
                      ? "Schools, student clubs, and universities that want to send teams or help organize can reach us directly."
                      : "Students, teachers, and organizations connected to this work can reach the Qoax team directly."}
                  </p>
                  <div className={styles.sideCardAction}>
                    <Button href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(entry.title)}`} variant="secondary" small>{CONTACT_EMAIL}</Button>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </div>

        <section className={`${styles.sectionTight} ${styles.band}`} aria-labelledby="related-heading">
          <div className={styles.container}>
            <div className={styles.sectionHead} style={{ marginBottom: 24 }}>
              <h2 id="related-heading" style={{ fontSize: 26 }}>More from the community</h2>
              <Link className={styles.textLink} href="/work">All {archiveEntries.length} records</Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((candidate) => (
                <Link className={styles.relatedCard} href={`/projects/${candidate.slug}`} key={candidate.slug}>
                  <span className={styles.relatedKind}>{candidate.signal ?? kindLabels[candidate.kind]}</span>
                  <strong>{candidate.title}</strong>
                  <p>{candidate.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      {eventSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />}
    </div>
  );
}
