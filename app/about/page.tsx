import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Button, CONTACT_EMAIL, GITHUB_URL, PageHero, SectionHead, SiteFooter, SiteHeader } from "../components";
import { legalEntity } from "../legal-data";
import styles from "../site.module.css";

export const metadata: Metadata = {
  title: "Why we do it",
  description: "Qoax Community is an independent non-profit technology community based in Sofia, Bulgaria.",
};

const principles = [
  ["Build", "Useful software shaped around the people who have to live with it after launch."],
  ["Teach", "Project-led learning that leaves students with transferable skill and visible work."],
  ["Support", "Practical time, tools, and technical care for student, cultural, and civic initiatives."],
  ["Publish", "Honest notes that keep the constraints, mistakes, recoveries, and decisions visible."],
] as const;

const timeline = [
  {
    date: "1–14 July 2026",
    title: "Internship Programme 2026",
    copy: "More than 30 students from partner technology schools work in teams with Qoax mentors.",
    href: "/projects/internship-program-2026",
  },
  {
    date: "24 July 2026",
    title: "Association registered",
    copy: `${legalEntity.nameEn} is registered in Sofia as an independent non-profit.`,
  },
  {
    date: "2–4 October 2026",
    title: "Atanasoff48",
    copy: "The first SPGE John Atanasoff hackathon comes to the school’s STEM Centre.",
    href: "/projects/atanasoff48",
  },
  {
    date: "October 2026",
    title: "Qoax Academy opens",
    copy: "Two learning paths for young programmers: algorithms and game development.",
  },
  {
    date: "Dates to be announced",
    title: "FMI Game Jam",
    copy: "A 48-hour game jam with the Faculty of Mathematics and Informatics at Sofia University.",
    href: "/projects/fmi-game-jam",
  },
  {
    date: "Early March 2027",
    title: "Qoax × FMI Gaming Tournament",
    copy: "Counter-Strike 2 and League of Legends brackets with in-person finals at FMI.",
    href: "/projects/fmi-esports-tournament-2027",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content">
        <PageHero
          eyebrow="Why we do it"
          title={<>A community with a <em>bias toward making.</em></>}
          copy="Qoax Community connects technology, education, culture, and civic initiative. We learn by building, and we grow by sharing what we know."
        />

        <section className={styles.sectionTight} aria-label="Our approach">
          <div className={`${styles.container} ${styles.aboutIntro}`}>
            <div>
              <p>
                We are engineers, teachers, and students in Sofia who believe that good technology should be
                measured by what it leaves behind: knowledge, confidence, and local capacity. That is why we work
                in the open, with schools and organizations that will keep the results long after we step back.
              </p>
              <p>
                Most of our work is practical and unglamorous: mentoring an internship cohort, keeping a theatre
                installation running, building a website an NGO can maintain on its own, or helping a student
                council put on its first hackathon. We document each of these as a public record.
              </p>
            </div>
            <blockquote className={styles.quote}>
              <p>The point is not to look innovative. The point is to leave people with more skill, more confidence, and something useful that did not exist before.</p>
              <footer>Qoax Community, founding note</footer>
            </blockquote>
          </div>
        </section>

        <section className={`${styles.section} ${styles.band}`} aria-labelledby="principles-heading">
          <div className={styles.container}>
            <SectionHead eyebrow="How we work" id="principles-heading" title="Four commitments" />
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

        <section className={styles.section} aria-labelledby="timeline-heading">
          <div className={styles.container}>
            <SectionHead eyebrow="2026 – 2027" id="timeline-heading" title="The year ahead" copy="Key moments for the community, in order." />
            <ol className={styles.timeline}>
              {timeline.map((item) => (
                <li className={styles.timelineItem} key={item.title}>
                  <time>{item.date}</time>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                    {item.href && (
                      <Link className={styles.textLink} href={item.href}>Read the record <ArrowRight size={15} /></Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.sectionTight} aria-labelledby="entity-heading">
          <div className={styles.container}>
            <div className={styles.entityCard}>
              <div>
                <p className={styles.eyebrow}>The organization</p>
                <h2 id="entity-heading">A registered non-profit association</h2>
                <p>
                  Qoax Community operates as a Bulgarian non-profit association. There is no commercial portfolio,
                  no paid catalogue, and no advertising on this site: everything here is public work.
                </p>
                <p style={{ marginTop: 18 }}>
                  <a className={styles.textLink} href={GITHUB_URL} rel="noreferrer" target="_blank">Open source on GitHub <ArrowRight size={15} /></a>
                </p>
              </div>
              <dl className={styles.entityGrid}>
                <div><dt>Registered name</dt><dd>{legalEntity.nameBg}</dd></div>
                <div><dt>English name</dt><dd>{legalEntity.nameEn}</dd></div>
                <div><dt>UIC / ЕИК</dt><dd>{legalEntity.uic}</dd></div>
                <div><dt>Registered</dt><dd>{legalEntity.registrationDate}</dd></div>
                <div><dt>Address</dt><dd>{legalEntity.addressEn}</dd></div>
                <div><dt>Contact</dt><dd><a href={`mailto:${legalEntity.contactEmail}`}>{legalEntity.contactEmail}</a></dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className={styles.sectionTight} aria-labelledby="contact-heading">
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <div>
                <p className={styles.eyebrow}>Contact</p>
                <h2 id="contact-heading">Have a public-interest project that needs practical technology support?</h2>
                <p>Write to us with what you are trying to do. We reply to every message.</p>
              </div>
              <div className={styles.ctaActions}>
                <Button href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
