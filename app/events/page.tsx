import Image from "next/image";
import Link from "next/link";
import { ArchiveFooter, ArchiveHeader, ArrowIcon, PageHeading } from "../archive-components";
import { nonprofitEntries } from "../archive-data";
import styles from "../archive.module.css";

export const metadata = {
  title: "Non-profit · QO.AX Community",
  description: "QO.AX partnerships with schools, students, art, culture, and public-interest organizations.",
};

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main id="main-content">
        <PageHeading
          index="01"
          eyebrow="Non-profit / first"
          title={<>Technology in service<br />of <em>shared causes.</em></>}
          copy="This side of QO.AX belongs to schools, students, art, culture, and NGOs. Its outcomes are access, confidence, participation, and stronger local networks."
        />

        <section className={styles.collection} aria-label="Non-profit projects and partnerships">
          <div className={styles.eventManifesto}>
            <span>Community commitment</span>
            <blockquote>Non-profit work is the first branch—not a footnote to the portfolio.</blockquote>
          </div>
          <div className={styles.collectionHeader}>
            <span>{nonprofitEntries.length.toString().padStart(2, "0")} initiatives</span>
            <span>Schools · students · art · NGOs</span>
            <span>Every item opens</span>
          </div>
          {nonprofitEntries.map((entry, index) => (
            <Link className={styles.workRow} href={`/projects/${entry.slug}`} key={entry.slug}>
              <div className={styles.workRowMedia}>
                {entry.image ? (
                  <Image src={entry.image} alt="" fill priority={index < 2} sizes="(max-width: 680px) 105px, 300px" />
                ) : (
                  <div className={styles.workRowMediaFallback}>{entry.title.slice(0, 2).toUpperCase()}</div>
                )}
              </div>
              <div className={styles.workRowMeta}>{entry.signal ?? entry.state}<br />{entry.year}<br />{entry.partner ?? "QO.AX Community"}</div>
              <div className={styles.workRowCopy}><h2>{entry.title}</h2><p>{entry.summary}</p></div>
              <ArrowIcon diagonal />
            </Link>
          ))}
        </section>
      </main>
      <ArchiveFooter />
    </div>
  );
}
