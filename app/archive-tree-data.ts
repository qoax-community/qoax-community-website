import { siteAsset } from "./site-path";

export type AchievementState = "unlocked" | "growing" | "locked";

export type AchievementKind = "event" | "programme" | "culture" | "ngo" | "school";

export const kindLabels: Record<AchievementKind, string> = {
  event: "Event",
  programme: "Programme",
  culture: "Culture",
  ngo: "Non-profit",
  school: "Partner school",
};

export type StorySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  timeline?: Array<[string, string]>;
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Achievement = {
  id: string;
  /** When true, the record is hidden from the site (no page, no listing, not counted). */
  draft?: boolean;
  title: string;
  subtitle: string;
  summary: string;
  /** Human-readable date label, e.g. "14–15 Nov 2026" */
  year: string;
  /** ISO start date for sorting and countdowns (only when the date is confirmed). */
  startsAt?: string;
  /** Short calendar label for the events rail, e.g. ["14–15", "Nov"] */
  calendar?: [string, string];
  state: AchievementState;
  kind: AchievementKind;
  priority: 1 | 2 | 3 | 4 | 5;
  image?: string;
  imageCredit?: string;
  logo?: string;
  mark?: string;
  portfolio?: boolean;
  signal?: string;
  href?: string;
  partner?: string;
  location?: string;
  detail?: string;
  notice?: string;
  facts?: Array<[string, string]>;
  story?: StorySection[];
  gallery?: GalleryImage[];
  links?: Array<[string, string]>;
  /** Direct link to this event's livestream or its recording. Falls back to the Qoax channel. */
  stream?: string;
};

/** Qoax's YouTube channel, where events are streamed live and recordings are kept. */
export const QOAX_STREAM_CHANNEL = "https://www.youtube.com/@QoaxCommunity";

/** Every event links to a stream: its own recording when known, otherwise the Qoax channel. */
export function streamFor(achievement: Pick<Achievement, "kind" | "stream">) {
  if (achievement.kind !== "event") return undefined;
  return achievement.stream
    ? { url: achievement.stream, direct: true }
    : { url: QOAX_STREAM_CHANNEL, direct: false };
}

export type AchievementBranch = {
  slug: "nonprofit";
  index: string;
  title: string;
  shortTitle: string;
  thesis: string;
  color: string;
  rgb: string;
  achievements: Achievement[];
};

const achievementBranchDefinitions: AchievementBranch[] = [
  {
    slug: "nonprofit",
    index: "01",
    title: "Non-profit & community",
    shortTitle: "Non-profit",
    thesis: "Schools, student programmes, art, and public-interest organizations strengthened through practical technology.",
    color: "#a78bfa",
    rgb: "167, 139, 250",
    achievements: [
      {
        id: "atanasoff48",
        title: "Atanasoff48",
        subtitle: "The first SPGE John Atanasoff hackathon",
        summary: "The first edition of the school’s 48-hour hackathon: 62 participants in 16 teams at the SPGE John Atanasoff STEM Centre, 2–4 October 2026.",
        year: "2–4 Oct 2026",
        startsAt: "2026-10-02T09:00:00+03:00",
        calendar: ["2–4", "Oct"],
        state: "unlocked",
        kind: "event",
        priority: 5,
        signal: "Completed",
        mark: "48",
        portfolio: true,
        href: "https://atanasoff48.com/",
        image: "/events/atanasoff48-2026/atanasoff48-199.jpg",
        imageCredit: "Photo: SPGE John Atanasoff",
        partner: "SPGE John Atanasoff Student Council",
        location: "SPGE John Atanasoff STEM Centre, Sofia",
        facts: [["Participants", "62"], ["Teams", "16"], ["Duration", "48 hours"]],
        detail: "Atanasoff48 is organized by the school’s Student Council. Qoax is part of the team behind its digital presence and practical delivery support. The first edition ran from 2 to 4 October 2026: 62 participants in 16 teams had 48 hours to build a project and present it, followed by the awards.",
        story: [
          {
            title: "What comes next",
            paragraphs: [
              "A second edition is planned for October–November 2027, prepared with its own team, budget, and partner programme. Dates will be published here once they are confirmed.",
            ],
          },
        ],
        gallery: [
          { src: "/events/atanasoff48-2026/atanasoff48-199.jpg", alt: "A full room of participants seated with laptops in the STEM Centre", caption: "A full room at the STEM Centre. Photo: SPGE John Atanasoff." },
          { src: "/events/atanasoff48-2026/atanasoff48-205.jpg", alt: "A mentor leans in to help a team working at their laptops", caption: "Mentors worked with the teams at their tables. Photo: SPGE John Atanasoff." },
          { src: "/events/atanasoff48-2026/atanasoff48-200.jpg", alt: "A participant pitches in front of a screen titled “In the next 7 minutes you will learn”", caption: "Seven minutes to pitch the project. Photo: SPGE John Atanasoff." },
          { src: "/events/atanasoff48-2026/atanasoff48-203.jpg", alt: "A team stands by a screen presenting their project to the room", caption: "Final presentations. Photo: SPGE John Atanasoff." },
          { src: "/events/atanasoff48-2026/atanasoff48-196.jpg", alt: "Five members of team The Grunders hold the first-place cheque", caption: "First place: The Grunders. Photo: SPGE John Atanasoff." },
          { src: "/events/atanasoff48-2026/atanasoff48-195.jpg", alt: "The three winning teams pose with mentors and their award cheques", caption: "The three winning teams: The Grunders, BDN and Волтова дъга. Photo: SPGE John Atanasoff." },
        ],
        links: [["Official site", "https://atanasoff48.com/"]],
      },
      {
        id: "sofia-game-jam-2026",
        title: "Sofia Game Jam",
        subtitle: "Arcade with a Mission",
        summary: "A game jam in Sofia on 20–22 November 2026. This year’s theme is “Arcade with a Mission”: games for arcade machines that take bottles and cans.",
        year: "20–22 Nov 2026",
        startsAt: "2026-11-20T00:00:00+02:00",
        calendar: ["20–22", "Nov"],
        state: "growing",
        kind: "event",
        priority: 5,
        signal: "Upcoming",
        mark: "SG",
        location: "Sofia, Bulgaria",
        facts: [["Theme", "Arcade with a Mission"], ["Format", "Game jam"], ["Qoax", "Livestream, sponsors"]],
        detail: "Sofia Game Jam runs from 20 to 22 November 2026. The theme, “Arcade with a Mission”, asks teams to make games for arcade machines that accept bottles and cans. Qoax runs the livestream and helps bring in sponsors.",
        notice: "Venue, schedule, and registration details will be published here.",
      },
      {
        id: "tues-game-jam-2026",
        title: "TUES Game Jam",
        subtitle: "“It’s not supposed to do that!”",
        summary: "A game jam at TUES at the end of November 2026. Theme: “It’s not supposed to do that!” Unexpected behaviour becomes part of the game.",
        year: "End of Nov 2026",
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Planned",
        mark: "GJ",
        partner: "Technology School Electronic Systems",
        location: "TUES, Sofia",
        facts: [["Theme", "It’s not supposed to do that!"], ["Teams", "3–6 people"], ["Rule", "An 8th-grader in every team"]],
        detail: "The TUES Game Jam takes place at the end of November 2026. Its theme, “It’s not supposed to do that!”, turns unexpected behaviour into part of the game. Teams have three to six people, and every team includes at least one 8th-grader.",
        notice: "The exact dates will be published here once they are confirmed.",
      },
      {
        id: "nasa-space-apps-2026",
        draft: true,
        title: "NASA Space Apps Challenge · Sofia",
        subtitle: "The world’s largest hackathon lands in Sofia",
        summary: "Two days, 14–15 November 2026, where teams use open NASA and partner-agency data to solve real challenges on Earth and in space. Free, open to everyone, and part of a global event with 450+ locations.",
        year: "14–15 Nov 2026",
        startsAt: "2026-11-14T09:00:00+02:00",
        calendar: ["14–15", "Nov"],
        state: "growing",
        kind: "event",
        priority: 5,
        signal: "Upcoming",
        mark: "SA",
        image: "/events/nasa-iss072e340644.jpg",
        imageCredit: "Photo: NASA",
        href: "https://www.spaceappschallenge.org/",
        partner: "NASA Space Apps Challenge · Sofia local event",
        location: "Sofia, Bulgaria",
        facts: [["Theme", "The Next Frontier"], ["Teams", "1–6 people"], ["Entry", "Free"]],
        detail: "NASA Space Apps is a 48-hour global hackathon run every year by NASA with 17 space-agency partners. On 14–15 November 2026, Qoax Community is bringing a local event to Sofia, so students, developers, designers, scientists, and storytellers can work on the same challenges as teams in hundreds of cities around the world, with mentors in the room and NASA data on the table.",
        notice: "Global registration is open now on spaceappschallenge.org. Venue and Sofia-specific schedule will be published here; write to contact@qo.ax if your school or team wants to join.",
        story: [
          {
            title: "What Space Apps is",
            paragraphs: [
              "The NASA International Space Apps Challenge is the largest annual hackathon in the world. Over one weekend, participants at local events on every continent respond to challenges written by NASA and partner space agencies, using open data to build software, hardware, visualizations, games, and stories.",
              "All ages, skill levels, and professional backgrounds are welcome. You do not need to be an engineer: challenges span agriculture, climate, astrophysics, education, art, and storytelling. As NASA puts it, there is always space for one more.",
            ],
          },
          {
            title: "2026 theme: The Next Frontier",
            paragraphs: [
              "This year’s theme invites teams to look at what comes next: the next mission, the next dataset, the next question about our planet and the universe. Challenge statements are released in two waves before the hackathon, so teams can prepare, read the data, and arrive with an idea.",
            ],
            timeline: [
              ["17 Sep 2026", "Challenges revealed"],
              ["28 Oct 2026", "Full challenge statements and NASA / partner datasets released"],
              ["14–15 Nov 2026", "Hackathon weekend, Sofia and 450+ locations worldwide"],
              ["After the event", "Local judging, then global judging of nominated projects"],
            ],
          },
          {
            title: "Why Sofia",
            paragraphs: [
              "Sofia has taken part in Space Apps since 2013, when a Sofia team, ChickBook, became a global winner in the People’s Choice category. Local editions have gathered dozens of participants and up to 17 teams in a single weekend, hosted over the years by schools, universities, and the software community.",
              "Qoax Community picks up that thread. Our partner schools already run hackathons and internship programmes with us, and Space Apps is the natural next step: the same practical rhythm, real data, and a global stage.",
            ],
          },
          {
            title: "How to take part",
            bullets: [
              "Register for free on spaceappschallenge.org and choose the Sofia local event.",
              "Form a team of up to six, or come alone and join one on the day. Mixed teams of coders, designers, and domain experts tend to do best.",
              "Read the challenge statements when they drop on 28 October and pick one or two that excite you.",
              "Bring a laptop, a charger, and curiosity. Mentors from Qoax and partner schools will be in the room all weekend.",
              "Submit your project by the global deadline on Sunday. Every team presents locally.",
            ],
          },
        ],
        gallery: [
          { src: "/events/nasa-iss073e0761799.jpg", alt: "Aurora over Earth’s horizon seen from the International Space Station", caption: "Aurora over Earth’s horizon, seen from the ISS. Photo: NASA." },
          { src: "/events/nasa-black-marble.jpg", alt: "Composite satellite image of Earth at night showing city lights", caption: "Earth at night, NASA’s Black Marble composite. Photo: NASA." },
        ],
        links: [
          ["Register on spaceappschallenge.org", "https://www.spaceappschallenge.org/"],
          ["Space Apps Bulgaria on Facebook", "https://www.facebook.com/SpaceAppsChallengeBulgaria/"],
        ],
      },
      {
        id: "john-atanasoff-game-jam-2026",
        title: "Atanasoff Jam",
        subtitle: "The SPGE John Atanasoff game jam",
        summary: "A game jam at SPGE John Atanasoff in January–February 2027: teams make a game together, with mentors, and present the finished projects.",
        year: "Jan–Feb 2027",
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Planned",
        mark: "AJ",
        partner: "SPGE John Atanasoff",
        location: "SPGE John Atanasoff, Sofia",
        facts: [["Format", "Game jam"], ["Period", "Jan–Feb 2027"], ["Dates", "Under discussion"]],
        detail: "Atanasoff Jam is the game jam of SPGE John Atanasoff. Teams make a game together with support from mentors, then present the finished projects. Qoax handles logistics, design, sponsors, and social media.",
        notice: "31 January – 2 February 2027 is under discussion. Confirmed dates will be published here.",
      },
      {
        id: "john-atanasoff-open-day-2027",
        title: "Open day at John Atanasoff",
        subtitle: "Student projects meet future students",
        summary: "On 4 March 2027, SPGE John Atanasoff opens its doors. Visitors can try games and prototypes made by students and talk to students, mentors, and parents.",
        year: "4 Mar 2027",
        startsAt: "2027-03-04T00:00:00+02:00",
        calendar: ["4", "Mar"],
        state: "growing",
        kind: "event",
        priority: 3,
        signal: "Planned",
        mark: "OD",
        partner: "SPGE John Atanasoff",
        location: "SPGE John Atanasoff, Sofia",
        facts: [["Date", "4 March 2027"], ["Format", "Open day"], ["Demos", "Games and prototypes"]],
        detail: "The open day at SPGE John Atanasoff puts student projects in front of future students. Visitors can try games and prototypes made at the school, and join short activities and conversations with students, mentors, and parents.",
      },
      {
        id: "fmi-esports-tournament-2027",
        title: "Qoax × SUGAMING Gaming Tournament",
        subtitle: "Counter-Strike 2 and League of Legends",
        summary: "Two student tournaments with SUGAMING and FMI, Sofia University: online qualifiers at the end of February 2027 and finals with an audience on 6–7 March, one day per game.",
        year: "6–7 Mar 2027",
        startsAt: "2027-03-06T00:00:00+02:00",
        calendar: ["6–7", "Mar"],
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Announced",
        mark: "GG",
        image: "/events/fmi-tournament.svg",
        partner: "SUGAMING",
        location: "FMI, Sofia University, Sofia",
        facts: [["Games", "CS2 · LoL"], ["Qualifiers", "27–28 Feb, online"], ["Finals", "6–7 Mar, live"]],
        detail: "Together with SUGAMING and the Faculty of Mathematics and Informatics, Qoax Community is organizing two tournaments, in Counter-Strike 2 and League of Legends. The proposed schedule is online qualifiers for both games on 27–28 February 2027 and finals with an audience on 6–7 March, one day for each game.",
        notice: "These are working dates. Registration, rules, and the final schedule will be published here.",
        story: [
          {
            title: "Proposed schedule",
            timeline: [
              ["27–28 Feb 2027", "Online qualifiers, both games"],
              ["6–7 Mar 2027", "Finals with an audience, one day per game"],
            ],
          },
        ],
        links: [["Faculty of Mathematics and Informatics", "https://www.fmi.uni-sofia.bg/en"]],
      },
      {
        id: "telecommunications-hackathon-2027",
        title: "Telecommunications Hackathon",
        subtitle: "Technology for healthcare",
        summary: "A hackathon at the Professional High School of Telecommunications in Sofia on 26–28 March 2027. The theme is technology for healthcare.",
        year: "26–28 Mar 2027",
        startsAt: "2027-03-26T00:00:00+02:00",
        calendar: ["26–28", "Mar"],
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Planned",
        mark: "TC",
        partner: "Professional High School of Telecommunications",
        location: "Professional High School of Telecommunications, Sofia",
        facts: [["Theme", "Healthcare technology"], ["Format", "Hackathon"], ["Ends with", "A final demo"]],
        detail: "The Telecommunications Hackathon runs from 26 to 28 March 2027 at the Professional High School of Telecommunications in Sofia. Teams develop their projects with mentors and finish with a demo.",
        story: [
          {
            title: "Two tracks",
            bullets: [
              "Diagnostics and monitoring: remote diagnosis and symptom tracking.",
              "Accessibility and wellbeing: solutions for people with disabilities and support for mental health.",
            ],
          },
        ],
        notice: "Registration and the programme will be published here.",
      },
      {
        id: "fmi-game-jam",
        title: "SUGAMING Jam",
        subtitle: "A game jam at FMI, Sofia University",
        summary: "Three days of making games in teams at the Faculty of Mathematics and Informatics, 16–18 October 2026. Seven games were published.",
        year: "16–18 Oct 2026",
        startsAt: "2026-10-16T00:00:00+03:00",
        calendar: ["16–18", "Oct"],
        state: "unlocked",
        kind: "event",
        priority: 4,
        signal: "Completed",
        mark: "GJ",
        portfolio: true,
        image: "/journal/sugaming-jam-2026-presentation.jpg",
        partner: "SUGAMING",
        location: "FMI, Sofia University, Sofia",
        facts: [["Dates", "16–18 Oct 2026"], ["Games published", "7"], ["Host", "FMI, Sofia University"]],
        detail: "SUGAMING Jam ran from 16 to 18 October 2026 at the Faculty of Mathematics and Informatics, Sofia University. Teams discussed ideas, built their games, and presented them at the end. Seven games were published.",
        story: [
          {
            title: "How a game jam works",
            bullets: [
              "A theme is announced at the opening, and teams form on the spot.",
              "Teams design, build, and playtest across the weekend.",
              "At the end, every team shows what they made.",
              "Any engine or framework goes: Unity, Godot, Unreal, web, or your own.",
            ],
          },
        ],
        gallery: [
          { src: "/events/sugaming-jam-2026/gamejam-594.jpg", alt: "A participant in headphones works on a game at a laptop with a second laptop beside it", caption: "Building and testing on two screens." },
          { src: "/journal/sugaming-jam-2026-board.jpg", alt: "A participant writes a team to-do list on a whiteboard during the jam", caption: "Planning on the whiteboard." },
          { src: "/events/sugaming-jam-2026/gamejam-684.jpg", alt: "Trays of food laid out for participants", caption: "Fuel for the weekend." },
          { src: "/events/sugaming-jam-2026/gamejam-34.jpg", alt: "A participant in sunglasses throws rock-on hand signs", caption: "The mood by the end." },
          { src: "/events/sugaming-jam-2026/gamejam-864.jpg", alt: "Four team members smile and hold Best Game trophies", caption: "The Best Game team with their trophies." },
        ],
        links: [["Faculty of Mathematics and Informatics", "https://www.fmi.uni-sofia.bg/en"]],
      },
      {
        id: "internship-program-2026",
        title: "Internship Programme 2026",
        subtitle: "Thirty-plus students building in teams",
        summary: "A shared programme for more than 30 students from Bulgarian technology schools, held from 1–14 July 2026.",
        year: "1–14 Jul 2026",
        state: "unlocked",
        kind: "programme",
        priority: 5,
        signal: "30+ students",
        mark: "30+",
        partner: "Partner technology schools in Bulgaria",
        location: "Sofia, Bulgaria",
        detail: "From 1 to 14 July 2026, more than 30 students worked in teams across a practical internship programme supported by Qoax and partner schools. The programme connected technical mentorship, project ownership, peer work, and a real delivery rhythm.",
        notice: "The exact student projects, teams, and outcomes will be published here soon.",
      },
      {
        id: "venus-labyrinth",
        title: "Venus Labyrinth",
        subtitle: "Art, space, light, and human choice",
        summary: "Technical stewardship for a 28-room sensory theatre work where technology stays invisible and the experience comes first.",
        year: "2025",
        state: "unlocked",
        kind: "culture",
        priority: 5,
        image: "/projects/venus-labyrinth.webp",
        portfolio: true,
        signal: "Art partnership",
        partner: "Sensory Theatre Sofia",
        location: "Sofia, Bulgaria",
      },
      {
        id: "infocareercenter",
        title: "InfoCareerCenter",
        subtitle: "Technology for an NGO",
        summary: "A bilingual digital presence for a national student information and career-guidance organization.",
        year: "2025",
        state: "unlocked",
        kind: "ngo",
        priority: 4,
        image: "/projects/nsicc.png",
        portfolio: true,
        signal: "NGO",
        partner: "National Student Information and Career Center",
        location: "Bulgaria",
      },
      {
        id: "tues",
        title: "TUES",
        subtitle: "Technology-school partnership",
        summary: "A continuing relationship with one of Bulgaria’s strongest student technology communities.",
        year: "Active",
        state: "growing",
        kind: "school",
        priority: 4,
        logo: "/partners/tues.png",
        signal: "School partner",
        partner: "Technology School Electronic Systems",
        location: "Sofia, Bulgaria",
      },
      {
        id: "john-atanasoff-school",
        title: "SPGE John Atanasoff",
        subtitle: "School partnership",
        summary: "A practical partnership spanning student initiatives, the 2026 internship programme, and Atanasoff48.",
        year: "Active",
        state: "growing",
        kind: "school",
        priority: 4,
        logo: "/partners/john-atanasoff.webp",
        signal: "School partner",
        partner: "SPGE John Atanasoff",
        location: "Sofia, Bulgaria",
      },
      {
        id: "popov-school",
        title: "Popov School",
        subtitle: "School partnership",
        summary: "A partner school contributing students and shared momentum to the 2026 internship programme.",
        year: "2026",
        state: "growing",
        kind: "school",
        priority: 3,
        logo: "/partners/popov.png",
        signal: "School partner",
        partner: "PGVT A. S. Popov",
        location: "Bulgaria",
      },
      {
        id: "telecommunications-schools-bulgaria",
        title: "Telecommunications Schools",
        subtitle: "Internship network across Bulgaria",
        summary: "Relationships with telecommunications-focused schools connecting students to real technical project work.",
        year: "2026",
        state: "growing",
        kind: "school",
        priority: 3,
        logo: "/partners/telecommunications-school.png",
        signal: "School network",
        partner: "Telecommunications schools in Bulgaria",
        location: "Bulgaria",
      },
    ],
  },
];

export const achievementBranches: AchievementBranch[] = achievementBranchDefinitions.map((branch) => ({
  ...branch,
  achievements: branch.achievements
    .filter((achievement) => !achievement.draft)
    .map((achievement) => ({
    ...achievement,
    image: achievement.image ? siteAsset(achievement.image) : undefined,
    logo: achievement.logo ? siteAsset(achievement.logo) : undefined,
    gallery: achievement.gallery?.map((item) => ({ ...item, src: siteAsset(item.src) })),
  })),
}));

export const allAchievements = achievementBranches.flatMap((branch) =>
  branch.achievements.map((achievement) => ({ ...achievement, branch: branch.shortTitle })),
);

/** Events with a date in the future first (soonest first), then announced events without a confirmed date. */
export function upcomingEvents(now = new Date()) {
  const events = allAchievements.filter((a) => a.kind === "event" && a.state !== "unlocked");
  const dated = events
    .filter((a) => a.startsAt && new Date(a.startsAt).getTime() > now.getTime() - 3 * 24 * 3600 * 1000)
    .sort((a, b) => new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime());
  const undated = events.filter((a) => !a.startsAt);
  return [...dated, ...undated];
}

export function isUpcoming(achievement: Pick<Achievement, "kind" | "startsAt">, now = new Date()) {
  return achievement.kind === "event" && !!achievement.startsAt && new Date(achievement.startsAt).getTime() > now.getTime();
}

export const portfolioAchievementCount = allAchievements.filter((achievement) => achievement.portfolio).length;
export const unlockedAchievementCount = allAchievements.filter((achievement) => achievement.state !== "locked").length;
