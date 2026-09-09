import Link from "next/link";
import { legalNavigation, SiteFooter, SiteHeader } from "./components";
import { legalEntity, type LegalDocument } from "./legal-data";
import styles from "./site.module.css";

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.legalPage} id="main-content">
        <div className={`${styles.container} ${styles.legalLayout}`}>
          <aside className={styles.legalSide}>
            <p>Legal documents</p>
            <nav className={styles.legalTabs} aria-label="Legal documents">
              {legalNavigation.map(([label, href]) => (
                <Link
                  aria-current={href === `/${document.id}` ? "page" : undefined}
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </aside>

          <article className={styles.legalDoc}>
            <header>
              <p className={styles.eyebrow}>Qoax Community</p>
              <h1>{document.title}</h1>
              <p className={styles.lead}>{document.description}</p>
              <span className={styles.legalUpdated}>{document.updated}</span>
            </header>

            <section className={styles.legalEntity} aria-labelledby="legal-entity-title">
              <h2 id="legal-entity-title">Controller: {legalEntity.nameBg}</h2>
              <dl className={styles.entityGrid}>
                <div><dt>UIC / ЕИК</dt><dd>{legalEntity.uic}</dd></div>
                <div><dt>Contact</dt><dd><a href={`mailto:${legalEntity.contactEmail}`}>{legalEntity.contactEmail}</a></dd></div>
                <div><dt>Registered address</dt><dd>{legalEntity.addressEn}</dd></div>
                <div><dt>Адрес на управление</dt><dd>{legalEntity.addressBg}</dd></div>
              </dl>
            </section>

            <section className={styles.legalSummary} aria-labelledby="legal-summary-title">
              <h2 id="legal-summary-title">At a glance</h2>
              <ul>
                {document.summary.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

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
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
