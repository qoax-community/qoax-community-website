import Image from "next/image";
import Link from "next/link";
import {
  ArchiveFooter,
  ArchiveHeader,
  ArrowIcon,
  BranchVariables,
} from "./archive-components";
import { archiveBranches, nonprofitEntries } from "./archive-data";
import { siteAsset } from "./site-path";
import styles from "./archive.module.css";

export default function Home() {
  const branch = archiveBranches[0];
  const lead = branch.entries[0];

  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main id="main-content">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}><span>00</span>QO.AX Community · public work first</p>
            <h1>Technology should<br />leave more people <em>capable.</em></h1>
          </div>
          <aside className={styles.heroSide}>
            <p>
              We work with schools, students, artists, and public-interest organizations—building the practical systems that help shared causes move.
            </p>
            <dl>
              <div><dt>Community nodes</dt><dd>{nonprofitEntries.length}</dd></div>
              <div><dt>Interns in 2026</dt><dd>30+</dd></div>
            </dl>
          </aside>
        </section>

        <section className={styles.rootNode} aria-label="The QO.AX Community archive begins here">
          <div className={styles.rootMark}>
            <Image src={siteAsset("/brand/qoax-mark.svg")} alt="" width={300} height={300} />
          </div>
          <span className={styles.rootLabel}>Sofia, Bulgaria<br />non-profit branch</span>
        </section>

        <section
          className={styles.branchChapter}
          id={branch.slug}
          style={BranchVariables(branch)}
        >
          <div className={styles.branchMedia}>
            <div className={styles.branchMediaFallback}>
              <Image src={siteAsset("/brand/qoax-mark.svg")} alt="" fill sizes="40vw" />
            </div>
          </div>

          <div className={styles.branchLead}>
            <div className={styles.branchMeta}>
              <span>{branch.index}</span>
              <span>{branch.title}</span>
            </div>
            <div className={styles.branchLeadCopy}>
              <p>{lead.subtitle} · {lead.signal ?? lead.year}</p>
              <h2>{lead.title}</h2>
              <Link className={styles.branchLeadLink} href={`/projects/${lead.slug}`}>
                <span>{lead.summary}</span>
                <span className={styles.roundArrow}><ArrowIcon diagonal /></span>
              </Link>
            </div>
          </div>

          <div className={styles.branchIndex}>
            <div className={styles.branchIndexHeader}>
              <span>{branch.thesis}</span>
              <span>{branch.entries.length.toString().padStart(2, "0")}</span>
            </div>
            <div>
              {branch.entries.map((entry, index) => (
                <Link className={styles.achievementLink} href={`/projects/${entry.slug}`} key={entry.slug}>
                  <span className={styles.achievementNumber}>{(index + 1).toString().padStart(2, "0")}</span>
                  <span className={styles.achievementCopy}>
                    <strong>{entry.title}</strong>
                    <small>{entry.subtitle}</small>
                  </span>
                  <span className={styles.achievementSignal} data-state={entry.state}>
                    <i aria-hidden="true" />
                    {entry.signal ?? entry.state}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.communityBreak}>
          <div>
            <p className={styles.kicker}><span>2026</span>What comes next</p>
            <h2>Document the work.<br />Invite the next team.</h2>
          </div>
          <div className={styles.communityCopy}>
            <p>
              The projects and teams from the 1–14 July internship programme will be published soon. Atanasoff48 follows at SPGE John Atanasoff on 2–4 October 2026.
            </p>
            <Link className={styles.textLink} href="/events">Open the full community index <ArrowIcon /></Link>
          </div>
        </section>
      </main>
      <ArchiveFooter />
    </div>
  );
}
