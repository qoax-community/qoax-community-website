import Image from "next/image";
import Link from "next/link";
import { archiveEntries } from "./archive-data";
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
  const recentPosts = sortedPosts.slice(0, 3);

  return (
    <Shell>
      {/* Hero */}
      <section className={ed.hero}>
        <div className={`${ed.wrap} ${ed.heroGrid}`}>
          <div>
            <h1>Hackathons, game jams and mentoring for students in Sofia</h1>
            <p className={ed.heroLede}>
              Qoax is a non-profit registered in Sofia. We run hackathons, game jams and tournaments with schools
              and universities, mentor students through an internship programme, and build software for civic and
              cultural organisations.
            </p>
            <div className={ed.heroActions}>
              <Btn href="/events">See upcoming events</Btn>
              <Btn href="/about" variant="ghost">About Qoax</Btn>
            </div>
          </div>

          <figure className={ed.heroFigure}>
            <Image
              alt="A participant in headphones works on a game on two laptops during the SUGAMING Jam"
              height={630}
              priority
              sizes="(max-width: 960px) 100vw, 460px"
              src={siteAsset("/journal/sugaming-jam-2026.jpg")}
              width={1200}
            />
            <figcaption>
              <Link href="/projects/fmi-game-jam">SUGAMING Jam</Link>, Faculty of Mathematics and Informatics,{" "}
              <time dateTime="2026-10-16">16–18 October 2026</time>. Seven games were published.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 01 Upcoming */}
      <section className={ed.sec} aria-labelledby="upcoming-title" id="upcoming">
        <div className={ed.wrap}>
          <SecHead
            number="01"
            label="Upcoming"
            id="upcoming-title"
            title="Upcoming events"
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
            title="Journal"
            copy="Short, honest write-ups by the people who did the work: what was planned, what happened, what we would change."
            action={<Btn href="/blog" variant="ghost" small>Read the journal</Btn>}
          />
          {recentPosts.length > 0 ? (
            <div className={ed.posts}>
              {recentPosts.map((post) => <PostCard post={post} key={post.slug} />)}
            </div>
          ) : (
            <div className={ed.empty}>
              <p className={ed.emptyCopy}>
                No posts yet. Read the <Link href="/events">event records</Link> or follow the{" "}
                <Link href="/blog/feed.xml">RSS feed</Link>.
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
            title="Schools we work with"
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
