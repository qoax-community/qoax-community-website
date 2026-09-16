import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import Image from "next/image";
import Link from "next/link";
import { nonprofitEntries } from "../archive-data";
import { ACADEMY_URL } from "../components";
import { Btn, Cta, PageHead, RecordRow, SecHead, Shell } from "../editorial";
import { schoolPartners } from "../schools-data";
import { siteAsset } from "../site-path";
import ed from "../editorial.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Schools we work with",
    description: "Qoax Community partners with technology schools in Bulgaria: TUES, SPGE John Atanasoff, PGVT A. S. Popov, the Professional High School of Telecommunications, and Private School St. Sofia. Internships, hackathons, and student-council events.",
    path: "/schools/",
  }),
};

const ways = [
  {
    number: "01",
    title: "Internship programme",
    copy: "Two weeks each July. Students from partner schools work in mixed teams with Qoax mentors on real projects. More than 30 students took part in 2026.",
    href: "/projects/internship-program-2026",
    action: "The 2026 programme",
  },
  {
    number: "02",
    title: "Student-run events",
    copy: "We back school councils that want to run their own hackathon: format, mentors, website, and the practical side. Atanasoff48 is the first.",
    href: "/projects/atanasoff48",
    action: "Atanasoff48",
  },
];

export default function SchoolsPage() {
  const schoolRecords = nonprofitEntries.filter((entry) => entry.kind === "school");
  return (
    <Shell>
      <PageHead
        label={`School network · ${schoolPartners.length} schools`}
        title={<>Schools we <em>work with.</em></>}
        copy="Technology schools whose students took part in the 2026 internship programme or whose student councils run events with us. The list is short on purpose. We would rather work well with a few schools than lightly with many."
      />

      <section className={ed.sec} aria-label="Partner schools">
        <div className={ed.wrap}>
          <ul className={ed.schools}>
            {schoolPartners.map((school) => {
              const inner = (
                <>
                  <div className={ed.schoolLogo}>
                    <Image
                      alt={`${school.name} logo`}
                      height={56}
                      sizes="(max-width: 720px) 40vw, 180px"
                      src={siteAsset(school.logo)}
                      width={"wide" in school && school.wide ? 180 : 120}
                    />
                  </div>
                  <span className={ed.schoolName}>{school.name}</span>
                  <span className={ed.schoolNote}>{school.note}</span>
                </>
              );
              return (
                <li key={school.name}>
                  {"href" in school && school.href ? (
                    <Link className={ed.school} href={school.href}>{inner}</Link>
                  ) : (
                    <div className={ed.school}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className={ed.schoolsNote}>
            Some of these schools also host Qoax Academy. Which ones, and what that means for their students, is on{" "}
            <a href={`${ACADEMY_URL}schools/`} rel="noreferrer" target="_blank">qoax.academy/schools ↗</a>.
          </p>
        </div>
      </section>

      <section className={ed.sec} aria-labelledby="ways-title">
        <div className={ed.wrap}>
          <SecHead
            number="01"
            label="How a partnership works"
            id="ways-title"
            title={<>Two ways schools <em>work with us.</em></>}
          />
          <div className={ed.cols2}>
            {ways.map((way) => (
              <article className={ed.cell} key={way.number}>
                <span className={ed.mono}>{way.number}</span>
                <h3>{way.title}</h3>
                <p>{way.copy}</p>
                <p style={{ marginTop: 16 }}>
                  <Btn href={way.href} variant="ghost" small>{way.action}</Btn>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={ed.sec} aria-labelledby="records-title">
        <div className={ed.wrap}>
          <SecHead
            number="02"
            label="School records"
            id="records-title"
            title={<>Each partnership, <em>documented.</em></>}
            copy="What we did together, when, and what came of it."
          />
          <div className={ed.rows}>{schoolRecords.map((entry) => <RecordRow entry={entry} key={entry.slug} />)}</div>
        </div>
      </section>

      <Cta
        title="Teaching at a school that should be on this list?"
        copy="Write to us about your students and what they want to build. We start small: one class, one event, one summer."
      />
    </Shell>
  );
}
