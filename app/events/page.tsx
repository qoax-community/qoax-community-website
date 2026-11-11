import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import { archiveEntries, nonprofitEntries } from "../archive-data";
import { upcomingEvents } from "../archive-tree-data";
import { Cta, PageHead, RecordRow, SecHead, Shell } from "../editorial";
import ed from "../editorial.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Qoax Community events: hackathons, game jams and tournaments",
    description: "Hackathons, game jams, and gaming tournaments that Qoax Community runs with schools and universities in Sofia, with confirmed dates and past results.",
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
        title="Events"
      />

      <section className={ed.sec} aria-labelledby="dated-title">
        <div className={ed.wrap}>
          <SecHead id="dated-title" title="Confirmed dates" />
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
            <SecHead id="past-title" title="Past events" />
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
