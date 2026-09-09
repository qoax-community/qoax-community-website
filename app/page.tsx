import Image from "next/image";
import Link from "next/link";
import {
  ACADEMY_URL,
  ArrowRight,
  ArrowUpRight,
  Button,
  CalendarIcon,
  CONTACT_EMAIL,
  EventCard,
  PinIcon,
  RecordCard,
  SectionHead,
  SiteFooter,
  SiteHeader,
  Tag,
  UsersIcon,
} from "./components";
import { Countdown } from "./countdown";
import { archiveEntries, nonprofitEntries } from "./archive-data";
import { upcomingEvents } from "./archive-tree-data";
import { siteAsset } from "./site-path";
import styles from "./site.module.css";

const schoolPartners = [
  { name: "Private School St. Sofia", logo: "/partners/st-sofia.webp" },
  { name: "Technology School Electronic Systems", logo: "/partners/tues.png", href: "/projects/tues" },
  { name: "SPGE John Atanasoff", logo: "/partners/john-atanasoff.webp", href: "/projects/john-atanasoff-school" },
  { name: "Professional High School of Telecommunications", logo: "/partners/telecommunications-school.png", href: "/projects/telecommunications-schools-bulgaria" },
  { name: "PGVT A. S. Popov", logo: "/partners/popov.png", href: "/projects/popov-school", wide: true },
];

const principles = [
  ["Build", "Useful software shaped around the people who have to live with it after launch."],
  ["Teach", "Project-led learning that leaves students with transferable skill and visible work."],
  ["Support", "Practical time, tools, and technical care for student, cultural, and civic initiatives."],
  ["Publish", "Honest notes that keep the constraints, mistakes, recoveries, and decisions visible."],
] as const;

export default function Home() {
  const upcoming = upcomingEvents().map((event) => archiveEntries.find((entry) => entry.id === event.id)!).filter(Boolean);
  const next = upcoming[0];
  const featured = nonprofitEntries.filter((entry) => entry.kind !== "school" && entry.kind !== "event").slice(0, 3);
  const featuredWithEvent = [nonprofitEntries.find((entry) => entry.id === "atanasoff48")!, ...featured].filter(Boolean);
  const eventCount = nonprofitEntries.filter((entry) => entry.kind === "event").length;

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content">
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.rise}>
                  <Tag tone="accent">Independent non-profit · Sofia, Bulgaria</Tag>
                </div>
                <h1 className={`${styles.heroTitle} ${styles.rise2}`}>
                  Technology that leaves people <em>more capable</em> than it found them.
                </h1>
                <p className={`${styles.heroLead} ${styles.rise3}`}>
                  Qoax Community runs hackathons, game jams, tournaments, and school programmes, and builds useful
                  software with students, artists, and civic organizations across Bulgaria. Public work first, shared openly.
                </p>
                <div className={`${styles.heroActions} ${styles.rise4}`}>
                  <Button href="/#upcoming">
                    Upcoming events <ArrowRight size={16} />
                  </Button>
                  <Button href="/events" variant="secondary">
                    See all our work
                  </Button>
                </div>
                <ul className={`${styles.heroMeta} ${styles.rise4}`}>
                  <li><UsersIcon size={16} /> 30+ students mentored in 2026</li>
                  <li><PinIcon size={16} /> 5 partner schools</li>
                  <li><CalendarIcon size={16} /> {eventCount} events on the calendar</li>
                </ul>
              </div>

              {next && (
                <aside className={`${styles.heroCard} ${styles.rise3}`} aria-labelledby="upcoming-title">
                  <div className={styles.heroCardTop}>
                    <Tag tone="live">Next up</Tag>
                    <time dateTime={next.startsAt}><CalendarIcon size={15} /> {next.year}</time>
                  </div>
                  <h2 className={styles.heroCardTitle} id="upcoming-title">{next.title}</h2>
                  <p>{next.summary}</p>
                  {next.startsAt && <Countdown target={next.startsAt} label={`Time until ${next.title}`} />}
                  {next.facts && (
                    <dl className={styles.heroCardFacts}>
                      {next.facts.map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                      ))}
                    </dl>
                  )}
                  <div className={styles.heroCardActions}>
                    <Button href={`/projects/${next.slug}`} variant="light" small>
                      Event details <ArrowRight size={15} />
                    </Button>
                    {next.href && (
                      <a className={styles.heroCardLink} href={next.href} rel="noreferrer" target="_blank">
                        {new URL(next.href).hostname} <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </aside>
              )}
            </div>

            <ul className={styles.stats} aria-label="Qoax Community in numbers">
              <li className={styles.stat}><strong>30+</strong><span>students in the 2026 internship programme</span></li>
              <li className={styles.stat}><strong>5</strong><span>partner schools across Bulgaria</span></li>
              <li className={styles.stat}><strong>{eventCount}</strong><span>hackathons, jams, and tournaments</span></li>
              <li className={styles.stat}><strong>{nonprofitEntries.length}</strong><span>open records of public work</span></li>
            </ul>
          </div>
        </section>

        {/* Upcoming events */}
        <section className={`${styles.sectionTight} ${styles.band}`} id="upcoming" aria-labelledby="upcoming-heading">
          <div className={styles.container}>
            <SectionHead
              eyebrow="Upcoming events"
              id="upcoming-heading"
              title="Hackathons, jams, and tournaments"
              copy="Free to enter, open to students, and run with our partner schools and universities. Pick one and bring a team."
              action={
                <Link className={styles.textLink} href="/events">
                  All records <ArrowRight size={16} />
                </Link>
              }
            />
            <div className={styles.eventRail}>
              {upcoming.map((entry) => <EventCard entry={entry} key={entry.slug} />)}
            </div>
          </div>
        </section>

        {/* Schools */}
        <section className={styles.section} id="schools" aria-labelledby="schools-heading">
          <div className={styles.container}>
            <SectionHead
              eyebrow="School network"
              id="schools-heading"
              title="Schools we work with"
              copy="Long-term relationships with technology schools: student programmes, hackathons, and practical work shared with educators."
            />
            <ul className={styles.logoGrid} aria-label="Qoax Community school partners">
              {schoolPartners.map((school) => {
                const image = (
                  <Image src={siteAsset(school.logo)} alt={`${school.name} logo`} fill sizes="(max-width: 560px) 45vw, (max-width: 900px) 30vw, 20vw" />
                );
                const className = `${styles.logoCard} ${school.wide ? styles.logoCardWide : ""}`;
                return (
                  <li key={school.name}>
                    {school.href ? (
                      <Link className={className} href={school.href} aria-label={`Read about our work with ${school.name}`}>
                        {image}
                        <span className={styles.logoCaption} aria-hidden="true">Read more →</span>
                      </Link>
                    ) : (
                      <div className={className}>{image}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Work */}
        <section className={`${styles.section} ${styles.band}`} aria-labelledby="work-heading">
          <div className={styles.container}>
            <SectionHead
              eyebrow="Public work first"
              id="work-heading"
              title="Programmes, events, and partnerships"
              copy="Every record opens. Current and upcoming work comes first; completed work stays visible as shared memory."
              action={
                <Link className={styles.textLink} href="/events">
                  View all {nonprofitEntries.length} records <ArrowRight size={16} />
                </Link>
              }
            />
            <div className={styles.cardGrid}>
              {featuredWithEvent.map((entry, index) => (
                <RecordCard entry={entry} key={entry.slug} priority={index < 2} />
              ))}
            </div>
          </div>
        </section>

        {/* Academy */}
        <section className={`${styles.section} ${styles.academy}`} aria-labelledby="academy-heading">
          <div className={styles.container}>
            <div className={styles.academyHead}>
              <div>
                <p className={styles.eyebrow}>Qoax Academy</p>
                <h2 id="academy-heading">One strong foundation. Two directions to grow.</h2>
              </div>
              <div>
                <span className={styles.academyBadge}><i aria-hidden="true" /> Starting October 2026</span>
                <p className={styles.lead}>
                  Students begin by making things move and respond. From age 10, they choose a path: algorithms or game development.
                </p>
              </div>
            </div>

            <div className={styles.academyPaths}>
              <article className={styles.pathCard}>
                <span>Path 01</span>
                <h3>Algorithms and tournaments</h3>
                <p>Solve precise problems, learn C++, and prepare for programming competitions with a structured, coach-led rhythm.</p>
                <div className={styles.pathTags}><span>C++</span><span>Algorithms</span><span>Tournaments</span></div>
              </article>
              <article className={styles.pathCard}>
                <span>Path 02</span>
                <h3>Game development</h3>
                <p>Create games with visual blocks and JavaScript, then progress to Unity, 3D, and real applications people can play.</p>
                <div className={styles.pathTags}><span>Blocks</span><span>JavaScript</span><span>Unity</span><span>3D</span></div>
              </article>
            </div>

            <footer className={styles.academyFooter}>
              <p>Project-led classes run inside Qoax Studio, where every student builds work that runs, moves, and responds.</p>
              <Button href={ACADEMY_URL} variant="light">
                Explore Qoax Academy <ArrowUpRight size={16} />
              </Button>
            </footer>
          </div>
        </section>

        {/* Principles */}
        <section className={styles.section} aria-labelledby="principles-heading">
          <div className={styles.container}>
            <SectionHead
              eyebrow="How we work"
              id="principles-heading"
              title="Four commitments behind every project"
              copy="The point is not to look innovative. The point is to leave people with more skill, more confidence, and something useful that did not exist before."
              action={
                <Link className={styles.textLink} href="/about">
                  Why we do it <ArrowRight size={16} />
                </Link>
              }
            />
            <ul className={styles.valueGrid}>
              {principles.map(([title, copy], index) => (
                <li className={styles.valueCard} key={title}>
                  <span className={styles.valueIndex}>{(index + 1).toString().padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.sectionTight} aria-labelledby="cta-heading">
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <div>
                <p className={styles.eyebrow}>Get involved</p>
                <h2 id="cta-heading">Want to host an event with us, or bring your school on board?</h2>
                <p>Schools, student councils, universities, NGOs, and cultural teams: tell us what you are trying to do. We answer every message.</p>
              </div>
              <div className={styles.ctaActions}>
                <Button href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </Button>
                <Button href="/about" variant="secondary">About Qoax</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
