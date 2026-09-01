import Link from "next/link";
import { ArchiveFooter, ArchiveHeader } from "./archive-components";
import { legalDocuments, legalEntity, type LegalDocument } from "./legal-data";
import styles from "./archive.module.css";

const documentLinks = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["GDPR", "/gdpr"],
] as const;

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main className={styles.legalPage} id="main-content">
        <nav className={styles.legalTabs} aria-label="Legal documents">
          {documentLinks.map(([label, href]) => (
            <Link
              aria-current={legalDocuments[document.id].title.startsWith(label) ? "page" : undefined}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <section className={styles.legalHero}>
          <p className={styles.kicker}><span>Legal</span>Qoax Community</p>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <small>{document.updated}</small>
        </section>

        <section className={styles.legalIdentity} aria-labelledby="legal-entity-title">
          <div>
            <p className={styles.kicker}><span>01</span>Controller</p>
            <h2 id="legal-entity-title">{legalEntity.nameBg}</h2>
          </div>
          <dl>
            <div><dt>UIC / ЕИК</dt><dd>{legalEntity.uic}</dd></div>
            <div><dt>Registered address</dt><dd>{legalEntity.addressEn}</dd></div>
            <div><dt>Адрес на управление</dt><dd>{legalEntity.addressBg}</dd></div>
            <div><dt>Contact</dt><dd><a href={`mailto:${legalEntity.contactEmail}`}>{legalEntity.contactEmail}</a></dd></div>
          </dl>
        </section>

        <section className={styles.legalSummary} aria-labelledby="legal-summary-title">
          <h2 id="legal-summary-title">At a glance</h2>
          <ul>
            {document.summary.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <div className={styles.legalSections}>
          {document.sections.map((section) => (
            <section className={styles.legalSection} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <ArchiveFooter />
    </div>
  );
}
