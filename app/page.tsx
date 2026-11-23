import Image from "next/image";
import Link from "next/link";
import { archiveEntries, getArchiveEntry } from "./archive-data";
import { upcomingEvents } from "./archive-tree-data";
import { sortedPosts } from "./blog-data";
import { Btn, Cta, PostCard, RecordRow, SecHead, Shell } from "./editorial";
import { PhotoStagger, type StaggerPhoto } from "./photo-stagger";
import { schoolPartners } from "./schools-data";
import { siteAsset } from "./site-path";
import ed from "./editorial.module.css";

export default function Home() {
  const upcoming = upcomingEvents()
    .map((event) => archiveEntries.find((entry) => entry.id === event.id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const recentPosts = sortedPosts.slice(0, 3);
  const hackathon = getArchiveEntry("atanasoff48");
  const gameJam = getArchiveEntry("fmi-game-jam");
  const sofiaJam = getArchiveEntry("sofia-game-jam-2026");
  const spaceApps = getArchiveEntry("nasa-space-apps-2026");
  const photos = bandPhotos([
    [sofiaJam, "sgj-teams"],
    [spaceApps, "nasa-winners"],
    [hackathon, "atanasoff48-199"],
    [gameJam, "gamejam-594"],
    [sofiaJam, "sgj-playtest"],
    [spaceApps, "nasa-team"],
    [hackathon, "atanasoff48-203"],
    [sofiaJam, "sgj-arcade"],
    [gameJam, "gamejam-34"],
  ]);

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
              <Btn href="/about" variant="ghost">About Qoax</Btn>
              <Btn href="/events">See upcoming events</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* 01 Upcoming */}
      <section className={ed.sec} aria-labelledby="upcoming-title" id="upcoming">
        <div className={ed.wrap}>
          <SecHead
            id="upcoming-title"
            title="Upcoming events"
            action={<Btn href="/events" variant="ghost" small>All events</Btn>}
          />
          <div className={ed.rows}>
            {upcoming.slice(0, 4).map((entry) => <RecordRow entry={entry} key={entry.slug} />)}
          </div>
        </div>
      </section>

      {/* Photo band from the autumn 2026 events */}
      <PhotoStagger
        id="photos-title"
        words={["Build,", "play", "&", "present"]}
        photos={photos}
        credit={
          <>
            From <Link href={`/projects/${hackathon?.slug ?? "atanasoff48"}`}>Atanasoff48</Link> and the{" "}
            <Link href={`/projects/${gameJam?.slug ?? "fmi-game-jam"}`}>SUGAMING Game Jam</Link> in October, and{" "}
            <Link href={`/projects/${spaceApps?.slug ?? "nasa-space-apps-2026"}`}>NASA Space Apps Challenge Sofia</Link> and{" "}
            <Link href={`/projects/${sofiaJam?.slug ?? "sofia-game-jam-2026"}`}>Sofia Game Jam</Link> in November 2026.
            Photos of Atanasoff48 by SPGE John Atanasoff, of Space Apps by Emilia Tomova and of Sofia Game Jam by Radislav Gachevski.
          </>
        }
        action={<Btn href="/events" variant="light">All events</Btn>}
      />

      {/* 02 Journal */}
      <section className={ed.sec} aria-labelledby="journal-title">
        <div className={ed.wrap}>
          <SecHead
            id="journal-title"
            title="Journal"
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

type GalleryEntry = ReturnType<typeof getArchiveEntry>;

/** Picks named photos from event galleries, skipping any that are missing. */
function bandPhotos(picks: [GalleryEntry, string][]): StaggerPhoto[] {
  return picks.flatMap(([entry, name]) => {
    const image = entry?.gallery?.find((item) => item.src.endsWith(`/${name}.jpg`));
    if (!entry || !image) return [];
    return [{ src: image.src, alt: image.alt, event: entry.title, href: `/projects/${entry.slug}` }];
  });
}
