import Image from "next/image";
import Link from "next/link";
import { ArchiveFooter, ArchiveHeader, ArrowIcon, PageHeading } from "../archive-components";
import { nonprofitEntries } from "../archive-data";
import styles from "../archive.module.css";

export const metadata = {
  title: "Fieldwork · Qoax Community",
  description: "Qoax partnerships with schools, students, art, culture, and public-interest organizations.",
};

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main id="main-content">
        <PageHeading
          index="01"
          eyebrow="Fieldwork / all records"
          title={<>Technology in service<br />of <em>shared causes.</em></>}
          copy="This is the complete non-profit index: school partnerships, student programmes, art, culture, and work for public-interest organizations."
        />

        <section className={styles.ledger} aria-label="Non-profit projects and partnerships">
          <div className={styles.ledgerHeader}>
            <span>{nonprofitEntries.length.toString().padStart(2, "0")} records</span>
            <span>Newest / most active first</span>
            <span>Every item opens</span>
          </div>
          {nonprofitEntries.map((entry, index) => (
            <Link className={styles.ledgerRow} href={`/projects/${entry.slug}`} key={entry.slug}>
              <span className={styles.ledgerNumber}>{(index + 1).toString().padStart(2, "0")}</span>
              <div className={styles.ledgerMedia}>
                {entry.image ? (
                  <Image src={entry.image} alt="" fill priority={index < 2} sizes="(max-width: 680px) 90px, 180px" />
                ) : (
                  <span>{entry.title.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className={styles.ledgerMeta}>{entry.signal ?? entry.state}<br />{entry.year}</div>
              <div className={styles.ledgerCopy}>
                <h2>{entry.title}</h2>
                <p>{entry.summary}</p>
              </div>
              <ArrowIcon diagonal />
            </Link>
          ))}
        </section>
      </main>
      <ArchiveFooter />
    </div>
  );
}
