import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Button, CONTACT_EMAIL, EntryVisual, PageHero, SiteFooter, SiteHeader, Tag, toneForEntry } from "../components";
import { nonprofitEntries, type ArchiveEntry } from "../archive-data";
import { kindLabels, type AchievementKind } from "../archive-tree-data";
import styles from "../site.module.css";

export const metadata: Metadata = {
  title: "Our work",
  description: "Qoax Community partnerships with schools, students, art, culture, and public-interest organizations.",
};

const groups: Array<{ title: string; copy: string; kinds: AchievementKind[] }> = [
  { title: "Programmes and events", copy: "Hackathons and internship programmes run with students and their schools.", kinds: ["event", "programme"] },
  { title: "Culture and civic organizations", copy: "Technical stewardship for artists and non-profits where the experience comes first.", kinds: ["culture", "ngo"] },
  { title: "Partner schools", copy: "Long-term relationships with technology schools across Bulgaria.", kinds: ["school"] },
];

function Row({ entry, priority }: { entry: ArchiveEntry; priority: boolean }) {
  return (
    <Link className={styles.listRow} href={`/projects/${entry.slug}`}>
      <div className={styles.listMedia}>
        <EntryVisual entry={entry} priority={priority} sizes="(max-width: 680px) 100vw, 150px" />
      </div>
      <div className={styles.listBody}>
        <h3>{entry.title}</h3>
        <p>{entry.summary}</p>
        <div className={styles.listMeta}>
          <Tag tone={toneForEntry(entry)}>{entry.signal ?? kindLabels[entry.kind]}</Tag>
          <span>{entry.year}</span>
          <span aria-hidden="true">·</span>
          <span>{entry.partner}</span>
        </div>
      </div>
      <span className={styles.listArrow} aria-hidden="true"><ArrowRight /></span>
    </Link>
  );
}

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content">
        <PageHero
          eyebrow={`Our work · ${nonprofitEntries.length} records`}
          title={<>Technology in service of <em>shared causes.</em></>}
          copy="The complete index of our non-profit work: school partnerships, student programmes, art, culture, and projects for public-interest organizations. Newest and most active first."
        />

        <div className={`${styles.container} ${styles.sectionTight}`}>
          {groups.map((group) => {
            const entries = nonprofitEntries.filter((entry) => group.kinds.includes(entry.kind));
            if (entries.length === 0) return null;
            return (
              <section className={styles.group} key={group.title} aria-label={group.title}>
                <div className={styles.groupHead}>
                  <div>
                    <h2>{group.title}</h2>
                    <p className={styles.lead} style={{ marginTop: 6, fontSize: 15.5 }}>{group.copy}</p>
                  </div>
                  <span>{entries.length} {entries.length === 1 ? "record" : "records"}</span>
                </div>
                <div className={styles.list}>
                  {entries.map((entry, index) => (
                    <Row entry={entry} key={entry.slug} priority={index === 0} />
                  ))}
                </div>
              </section>
            );
          })}

          <div className={styles.ctaCard} style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
            <div>
              <p className={styles.eyebrow}>Add a record</p>
              <h2>Working on something the community should know about?</h2>
              <p>Partner schools, student teams, and organizations we support can ask for their work to be documented here.</p>
            </div>
            <div className={styles.ctaActions}>
              <Button href={`mailto:${CONTACT_EMAIL}`}>Write to us</Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
