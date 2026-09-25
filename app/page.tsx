import Image from "next/image";
import Link from "next/link";
import { Countdown } from "./countdown";
import { archiveEntries, nonprofitEntries } from "./archive-data";
import { upcomingEvents } from "./archive-tree-data";
import { sortedPosts } from "./blog-data";
import { Btn, Cta, PostCard, RecordRow, SecHead, Shell } from "./editorial";
import { schoolPartners } from "./schools-data";
import { siteAsset } from "./site-path";
import ed from "./editorial.module.css";

export default function Home() {
  const upcoming = upcomingEvents()
    .map((event) => archiveEntries.find((entry) => entry.id === event.id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const next = upcoming[0];
  const eventCount = nonprofitEntries.filter((entry) => entry.kind === "event").length;
  const recentPosts = sortedPosts.slice(0, 3);

  return (
    <Shell>
      {/* Hero */}
      <section className={ed.hero}>
        <div className={`${ed.wrap} ${ed.heroGrid}`}>
          <div>
            <p className={`${ed.mono} ${ed.heroKicker}`}>Independent non-profit · Sofia, Bulgaria · Registered 24 July 2026</p>
            <h1>
              Technology that leaves people <em>more capable</em> than it found them.
            </h1>
            <p className={ed.heroLede}>
              We run hackathons, game jams, and tournaments with schools and universities, mentor students through
              the internship programme, and build software for civic and cultural organisations. Public work
              first, written up honestly.
            </p>
            <div className={ed.heroActions}>
              <Btn href="/events">Upcoming events</Btn>
              <Btn href="/blog" variant="ghost">Read the journal</Btn>
            </div>
            <ul className={ed.heroMeta}>
              <li><strong>30+</strong><span className={ed.mono}>students mentored in 2026</span></li>
              <li><strong>{schoolPartners.length}</strong><span className={ed.mono}>partner schools</span></li>
              <li><strong>{eventCount}</strong><span className={ed.mono}>events on the calendar</span></li>
            </ul>
          </div>

          {next && (
            <aside className={ed.next} aria-labelledby="next-up-title">
              <div className={ed.nextTop}>
                <span className={`${ed.mono} ${ed.live}`}>Next up</span>
                <span className={ed.mono}>{next.year}</span>
              </div>
              <h2 className={ed.nextTitle} id="next-up-title">{next.title}</h2>
              <p className={ed.nextSub}>{next.subtitle}</p>
              {next.startsAt && <Countdown editorial target={next.startsAt} label={`Time until ${next.title}`} />}
              <dl className={ed.nextFacts}>
                {(next.facts ?? [["Where", next.location ?? ""]]).slice(0, 3).map(([term, value]) => (
                  <div key={term}><dt>{term}</dt><dd>{value}</dd></div>
                ))}
                {next.partner && <div><dt>Organiser</dt><dd>{next.partner}</dd></div>}
              </dl>
              <div className={ed.nextFooter}>
                <Btn href={`/projects/${next.slug}`} small>Event details</Btn>
                {next.href && (
                  <a className={ed.textLink} href={next.href} rel="noreferrer" target="_blank">Official site ↗</a>
                )}
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* 01 Upcoming */}
      <section className={ed.sec} aria-labelledby="upcoming-title" id="upcoming">
        <div className={ed.wrap}>
          <SecHead
            number="01"
            label="Upcoming"
            id="upcoming-title"
            title={<>Hackathons, jams, and <em>tournaments.</em></>}
            copy="Every event has a record page with dates, partners, and what we are responsible for. When it is over, we add what happened."
            action={<Btn href="/events" variant="ghost" small>All events</Btn>}
          />
          <div className={ed.rows}>
            {upcoming.slice(0, 4).map((entry) => <RecordRow entry={entry} key={entry.slug} />)}
          </div>
        </div>
      </section>

      {/* 02 Journal */}
      <section className={ed.sec} aria-labelledby="journal-title">
        <div className={ed.wrap}>
          <SecHead
            number="02"
            label="Journal"
            id="journal-title"
            title={<>Notes from <em>the work.</em></>}
            copy="Short, honest write-ups by the people who did the work: what was planned, what happened, what we would change."
            action={<Btn href="/blog" variant="ghost" small>Read the journal</Btn>}
          />
          {recentPosts.length > 0 ? (
            <div className={ed.posts}>
              {recentPosts.map((post) => <PostCard post={post} key={post.slug} />)}
            </div>
          ) : (
            <div className={ed.empty}>
              <p className={ed.mono}>First posts coming soon</p>
              <p className={ed.emptyCopy}>
                The journal opens with notes from the 2026 internship programme and Atanasoff48. Subscribe to the <Link href="/blog/feed.xml">RSS feed</Link> or read the{" "}
                <Link href="/events">event records</Link> in the meantime.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 03 Schools */}
      <section className={ed.sec} aria-labelledby="schools-title" id="schools">
        <div className={ed.wrap}>
          <SecHead
            number="03"
            label="School network"
            id="schools-title"
            title={<>Schools we work with</>}
            copy="Technology schools whose students took part in the 2026 internship programme or whose councils run events with us."
            action={<Btn href="/schools" variant="ghost" small>About the network</Btn>}
          />
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
        </div>
      </section>

      <Cta />
    </Shell>
  );
}
