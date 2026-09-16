import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import { nonprofitEntries } from "../archive-data";
import { type AchievementKind } from "../archive-tree-data";
import { Cta, PageHead, RecordRow, SecHead, Shell } from "../editorial";
import ed from "../editorial.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Our work",
    description: "The complete index of Qoax Community non-profit work: school partnerships, student programmes, hackathons, and technology built for cultural and civic organisations in Bulgaria.",
    path: "/work/",
  }),
};

const groups: Array<{ number: string; label: string; title: React.ReactNode; copy: string; kinds: AchievementKind[] }> = [
  {
    number: "01",
    label: "Programmes and events",
    title: <>Run with students <em>and their schools.</em></>,
    copy: "Hackathons, game jams, tournaments, and the summer internship programme.",
    kinds: ["event", "programme"],
  },
  {
    number: "02",
    label: "Culture and civic organisations",
    title: <>Technology where the <em>experience</em> comes first.</>,
    copy: "Technical stewardship for artists and non-profits: installations, websites, and the unglamorous work of keeping them running.",
    kinds: ["culture", "ngo"],
  },
  {
    number: "03",
    label: "Partner schools",
    title: <>Long-term <em>relationships.</em></>,
    copy: "Technology schools across Bulgaria whose students take part in our programmes.",
    kinds: ["school"],
  },
];

export default function WorkPage() {
  return (
    <Shell>
      <PageHead
        label={`Our work · ${nonprofitEntries.length} records`}
        title={<>Technology in service of <em>shared causes.</em></>}
        copy="The complete index of our non-profit work: school partnerships, student programmes, art, culture, and projects for public-interest organisations. Newest and most active first."
      />

      {groups.map((group) => {
        const entries = nonprofitEntries.filter((entry) => group.kinds.includes(entry.kind));
        if (entries.length === 0) return null;
        const id = `work-${group.number}`;
        return (
          <section className={ed.sec} aria-labelledby={id} key={group.number}>
            <div className={ed.wrap}>
              <SecHead number={group.number} label={group.label} id={id} title={group.title} copy={group.copy} />
              <div className={ed.rows}>{entries.map((entry) => <RecordRow entry={entry} key={entry.slug} />)}</div>
              <p className={`${ed.mono} ${ed.rowsFooter}`}>{`${entries.length} ${entries.length === 1 ? "record" : "records"}`}</p>
            </div>
          </section>
        );
      })}

      <Cta
        title="Working on something the community should know about?"
        copy="Partner schools, student teams, and organisations we support can ask for their work to be documented here."
      />
    </Shell>
  );
}
