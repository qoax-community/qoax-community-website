import Image from "next/image";
import { ArchiveFooter, ArchiveHeader, PageHeading } from "../archive-components";
import styles from "../archive.module.css";
import { siteAsset } from "../site-path";

export const metadata = {
  title: "About · QO.AX Community",
  description: "QO.AX is an independent technology community based in Sofia, Bulgaria.",
};

const principles = [
  ["01", "Build", "Useful software shaped around the people who have to live with it after launch."],
  ["02", "Teach", "Project-led learning that leaves students with transferable skill and visible work."],
  ["03", "Support", "Practical time, tools, and technical care for student, cultural, and civic initiatives."],
  ["04", "Publish", "Honest notes that keep the constraints, mistakes, recoveries, and decisions visible."],
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <ArchiveHeader />
      <main id="main-content">
        <PageHeading
          index="04"
          eyebrow="About QO.AX"
          title={<>A community with a<br /><em>bias toward making.</em></>}
          copy="QO.AX connects technology, education, culture, and civic initiative. We learn by building, and we grow by sharing what we know."
        />

        <div className={styles.collection}>
          <section className={styles.aboutStatement}>
            <div className={styles.aboutMark}><Image src={siteAsset("/brand/qoax-mark.svg")} alt="" width={300} height={300} /></div>
            <blockquote>The point is not to look innovative. The point is to leave people with more skill, more confidence, and something useful that did not exist before.</blockquote>
          </section>

          <section className={styles.principleGrid} aria-label="QO.AX principles">
            {principles.map(([index, title, copy]) => (
              <article className={styles.principleCard} key={index}>
                <span>{index}</span><h2>{title}</h2><p>{copy}</p>
              </article>
            ))}
          </section>

          <section className={styles.timeline} aria-label="QO.AX lineage">
            <div className={styles.timelineRow}><span>1–14 Jul 2026</span><p>More than 30 students join the QO.AX internship programme through partner technology schools.</p></div>
            <div className={styles.timelineRow}><span>2–4 Oct 2026</span><p>Atanasoff48 brings the first SPGE John Atanasoff hackathon to the school’s STEM Centre.</p></div>
          </section>
        </div>
      </main>
      <ArchiveFooter />
    </div>
  );
}
