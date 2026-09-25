import type { Metadata } from "next";
import { pageMetadata } from "../seo";
import Link from "next/link";
import { ACADEMY_URL, CONTACT_EMAIL, GITHUB_URL } from "../components";
import { aboutFaqIds, faqItems } from "../faq-data";
import { Btn, Cta, Inlines, PageHead, SecHead, Shell } from "../editorial";
import { legalEntity } from "../legal-data";
import ed from "../editorial.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qo.ax";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "About Qoax Community · Non-profit in Sofia",
    description: "What Qoax Community is: an independent non-profit technology association in Sofia, Bulgaria (Сдружение КОАКС КОМЮНИТИ, ЕИК 208896893). Who is behind it, how we work, and what happens in 2026–2027.",
    path: "/about/",
    keywords: ["About Qoax", "Qoax Community", "Коакс Комюнити", "Куакс", "Kuaks", "non-profit Sofia", "technology community Bulgaria"],
  }),
};

const principles = [
  ["Build", "Useful software shaped around the people who have to live with it after launch."],
  ["Teach", "Project-led learning that leaves students with transferable skill and visible work."],
  ["Support", "Practical time, tools, and technical care for student, cultural, and civic initiatives."],
  ["Publish", "Honest notes that keep the constraints, mistakes, recoveries, and decisions visible."],
] as const;

const timeline = [
  {
    date: "1–14 July 2026",
    title: "Internship Programme 2026",
    copy: "More than 30 students from partner technology schools work in teams with Qoax mentors.",
    href: "/projects/internship-program-2026",
  },
  {
    date: "24 July 2026",
    title: "Association registered",
    copy: `${legalEntity.nameEn} is registered in Sofia as an independent non-profit.`,
  },
  {
    date: "2–4 October 2026",
    title: "Atanasoff48",
    copy: "The first SPGE John Atanasoff hackathon comes to the school’s STEM Centre.",
    href: "/projects/atanasoff48",
  },
  {
    date: "26 October 2026",
    title: "Qoax Academy opens",
    copy: "Everything about the Academy is on qoax.academy.",
    href: ACADEMY_URL,
    external: true,
  },
  {
    date: "Dates to be announced",
    title: "FMI Game Jam",
    copy: "A game jam with the Faculty of Mathematics and Informatics at Sofia University.",
    href: "/projects/fmi-game-jam",
  },
  {
    date: "Early March 2027",
    title: "Qoax × SUGAMING Gaming Tournament",
    copy: "Counter-Strike 2 and League of Legends brackets with in-person finals at FMI.",
    href: "/projects/fmi-esports-tournament-2027",
  },
];

const jumpLinks = [
  ["what-is-qoax", "What is Qoax?"],
  ["how-we-work", "How we work"],
  ["timeline", "2026 – 2027"],
  ["organisation", "The organisation"],
  ["questions", "Questions"],
] as const;

export default function AboutPage() {
  const teaser = aboutFaqIds.map((id) => faqItems.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const url = `${siteUrl}/about/`;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#about`,
    url,
    name: "About Qoax Community",
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    mainEntity: { "@id": `${siteUrl}/#organization` },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "About", item: url },
    ],
  };

  return (
    <Shell>
      <PageHead
        crumbs={
          <nav className={ed.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <span aria-current="page">About</span>
          </nav>
        }
        label="About"
        title={<>A community with a <em>bias toward making.</em></>}
        copy="Qoax Community connects technology, education, culture, and civic initiative in Sofia, Bulgaria. We learn by building, and we grow by sharing what we know."
      />

      <section className={ed.secTight} aria-label="Qoax Community at a glance">
        <div className={ed.wrap}>
          <dl className={ed.glance}>
            <div><dt>What</dt><dd>Independent non-profit technology community</dd></div>
            <div><dt>Where</dt><dd>Sofia, Bulgaria</dd></div>
            <div><dt>Registered</dt><dd>{`${legalEntity.registrationDate} · UIC ${legalEntity.uic}`}</dd></div>
            <div><dt>Contact</dt><dd><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></dd></div>
          </dl>
        </div>
      </section>

      <nav className={ed.jump} aria-label="On this page">
        <div className={`${ed.wrap} ${ed.jumpInner}`}>
          <h2>On this page</h2>
          <ol>
            {jumpLinks.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
          </ol>
        </div>
      </nav>

      <section className={ed.sec} aria-labelledby="what-is-qoax-title" id="what-is-qoax">
        <div className={`${ed.wrap} ${ed.split}`}>
          <div className={ed.splitAside}>
            <p className={ed.mono}>01 — Who we are</p>
            <h2 id="what-is-qoax-title">What is <em>Qoax Community?</em></h2>
          </div>
          <div className={ed.prose}>
            <p>
              <strong>Qoax Community</strong> is an independent non-profit technology community based in Sofia,
              Bulgaria. We are engineers, teachers, and students who believe that good technology should be measured
              by what it leaves behind: knowledge, confidence, and local capacity. That is why we work in the open,
              with schools and organisations that will keep the results long after we step back.
            </p>
            <p>
              Most of our work is practical and unglamorous: mentoring an internship cohort, keeping a theatre
              installation running, building a website an NGO can maintain on its own, or helping a student council
              put on its first hackathon. We document each of these as a public record under{" "}
              <Link href="/events">Events</Link> and <Link href="/work">Our work</Link>.
            </p>
            <p lang="bg">
              Коакс Комюнити е независимо сдружение с нестопанска цел в София. Организираме хакатони, гейм
              джамове и турнири с училища и университети и разработваме софтуер за граждански и културни
              организации.
            </p>
            <blockquote className={ed.pull}>
              <p>The point is not to look innovative. The point is to leave people with more skill, more confidence, and something useful that did not exist before.</p>
              <footer>Qoax Community, founding note</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className={ed.sec} aria-labelledby="how-we-work-title" id="how-we-work">
        <div className={ed.wrap}>
          <SecHead number="02" label="How we work" id="how-we-work-title" title={<>Four <em>commitments.</em></>} />
          <ul className={ed.cols4}>
            {principles.map(([title, copy], index) => (
              <li className={ed.cell} key={title}>
                <span className={ed.mono}>{(index + 1).toString().padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={ed.sec} aria-labelledby="timeline-title" id="timeline">
        <div className={`${ed.wrap} ${ed.split}`}>
          <div className={ed.splitAside}>
            <p className={ed.mono}>03 — 2026 to 2027</p>
            <h2 id="timeline-title">The year <em>ahead.</em></h2>
          </div>
          <dl className={ed.timeline}>
            {timeline.map((item) => (
              <div className={ed.timelineRow} key={item.title}>
                <dt>{item.date}</dt>
                <dd>
                  <strong>
                    {"external" in item && item.external ? (
                      <a href={item.href} rel="noreferrer" target="_blank">{item.title} ↗</a>
                    ) : item.href ? (
                      <Link href={item.href}>{item.title}</Link>
                    ) : (
                      item.title
                    )}
                  </strong>
                  <p>{item.copy}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={ed.sec} aria-labelledby="organisation-title" id="organisation">
        <div className={`${ed.wrap} ${ed.split}`}>
          <div className={ed.splitAside}>
            <p className={ed.mono}>04 — The organisation</p>
            <h2 id="organisation-title">A registered <em>non-profit association.</em></h2>
            <p style={{ marginTop: 16, color: "var(--ink-2)" }}>
              Qoax Community operates as a Bulgarian non-profit association. There is no commercial portfolio, no
              paid catalogue, and no advertising on this site: everything here is public work.
            </p>
            <p style={{ marginTop: 16 }}>
              <Btn href={GITHUB_URL} variant="ghost" small>Open source on GitHub</Btn>
            </p>
          </div>
          <dl className={ed.kv}>
            <div className={ed.kvRow}><dt>Registered name</dt><dd lang="bg">{legalEntity.nameBg}</dd></div>
            <div className={ed.kvRow}><dt>English name</dt><dd>{legalEntity.nameEn}</dd></div>
            <div className={ed.kvRow}><dt>UIC / ЕИК</dt><dd>{legalEntity.uic}</dd></div>
            <div className={ed.kvRow}><dt>Registered</dt><dd>{legalEntity.registrationDate}</dd></div>
            <div className={ed.kvRow}><dt>Address</dt><dd>{legalEntity.addressEn}</dd></div>
            <div className={ed.kvRow}><dt>Contact</dt><dd><a href={`mailto:${legalEntity.contactEmail}`}>{legalEntity.contactEmail}</a></dd></div>
          </dl>
        </div>
      </section>

      <section className={ed.sec} aria-labelledby="questions-title" id="questions">
        <div className={ed.wrap}>
          <SecHead
            number="05"
            label="Questions"
            id="questions-title"
            title={<>Asked <em>often.</em></>}
            copy="The short answers. The full list, with Bulgarian summaries, is on the FAQ page."
            action={<Btn href="/faq" variant="ghost" small>All questions</Btn>}
          />
          <div className={ed.qList}>
            {teaser.map((item, index) => (
              <article className={ed.q} key={item.id}>
                <span className={ed.qNum} aria-hidden="true">{(index + 1).toString().padStart(2, "0")}</span>
                <div>
                  <h3><Link href={`/faq/#${item.id}`}>{item.question}</Link></h3>
                  <div className={ed.qBody}><p><Inlines source={item.answer[0]} /></p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="Have a public-interest project that needs practical technology support?"
        copy="Write to us with what you are trying to do. We reply to every message."
        secondary={<Btn href="/work" variant="ghost">See our work</Btn>}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </Shell>
  );
}
