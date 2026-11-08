import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import { archiveEntries, nonprofitEntries } from "../archive-data";
import { upcomingEvents } from "../archive-tree-data";
import { Cta, PageHead, RecordRow, SecHead, Shell } from "../editorial";
import ed from "../editorial.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Events · Hackathons, game jams, and tournaments",
    description: "Qoax Community events in Sofia: the John Atanasoff Game Jam planned for December 2026, the Telecommunications School Hackathon planned for March to April 2027, and more.",
    path: "/events/",
  }),
};

export default function EventsPage() {
  const upcoming = upcomingEvents()
    .map((event) => archiveEntries.find((entry) => entry.id === event.id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const dated = upcoming.filter((entry) => entry.startsAt);
  const undated = upcoming.filter((entry) => !entry.startsAt);
  const upcomingIds = new Set(upcoming.map((entry) => entry.id));
  const past = nonprofitEntries.filter((entry) => entry.kind === "event" && !upcomingIds.has(entry.id));
  const programmes = nonprofitEntries.filter((entry) => entry.kind === "programme");

  return (
    <Shell>
      <PageHead
        label={`Events · ${upcoming.length} upcoming`}
        title="Events"
      />

      <section className={ed.sec} aria-labelledby="dated-title">
        <div className={ed.wrap}>
          <SecHead number="01" label="Confirmed dates" id="dated-title" title="Confirmed dates" />
          {dated.length > 0 ? (
            <div className={ed.rows}>{dated.map((entry) => <RecordRow entry={entry} key={entry.slug} />)}</div>
          ) : (
            <p className={ed.empty}>No dated events right now. New dates are announced here first.</p>
          )}
        </div>
      </section>

      {undated.length > 0 && (
        <section className={ed.sec} aria-labelledby="undated-title">
          <div className={ed.wrap}>
            <SecHead
              number="02"
              label="Dates to be announced"
              id="undated-title"
              title="In preparation"
              copy="Events in preparation, with exact dates still being arranged. Each record page shows the planned period where available and the details announced so far."
            />
            <div className={ed.rows}>{undated.map((entry) => <RecordRow entry={entry} key={entry.slug} />)}</div>
          </div>
        </section>
      )}

      <section className={ed.sec} aria-labelledby="programmes-title">
        <div className={ed.wrap}>
          <SecHead
            number="03"
            label="Programmes"
            id="programmes-title"
            title="Programmes"
            copy="Multi-week programmes run with partner schools, such as the summer internship programme."
          />
          <div className={ed.rows}>{programmes.map((entry) => <RecordRow entry={entry} key={entry.slug} />)}</div>
        </div>
      </section>

      {past.length > 0 && (
        <section className={ed.sec} aria-labelledby="past-title">
          <div className={ed.wrap}>
            <SecHead number="04" label="Past events" id="past-title" title="Past events" />
            <div className={ed.rows}>{past.map((entry) => <RecordRow entry={entry} key={entry.slug} />)}</div>
          </div>
        </section>
      )}

      <Cta
        title="Running a student event and want a partner who has done it before?"
        copy="We help school councils and university clubs with format, mentoring, websites, and the practical side of a 48-hour event."
      />
    </Shell>
  );
}
