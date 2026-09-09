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
};

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
        summary: "A free 48-hour school hackathon at the SPGE John Atanasoff STEM Centre, taking place 2–4 October 2026.",
        year: "2–4 Oct 2026",
        startsAt: "2026-10-02T09:00:00+03:00",
        calendar: ["2–4", "Oct"],
        state: "growing",
        kind: "event",
        priority: 5,
        signal: "Upcoming",
        mark: "48",
        href: "https://atanasoff48.com/",
        partner: "SPGE John Atanasoff Student Council",
        location: "SPGE John Atanasoff STEM Centre, Sofia",
        facts: [["Where", "STEM Centre, Sofia"], ["Teams", "Up to 16 × 4"], ["Entry", "Free"]],
        detail: "Atanasoff48 is organized by the school’s Student Council. Qoax is part of the team behind its digital presence and practical delivery support. The first edition welcomes up to 16 teams of four, with free participation and three days to create and present a project.",
        links: [["Official site", "https://atanasoff48.com/"]],
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
        id: "fmi-game-jam",
        title: "FMI Game Jam",
        subtitle: "A game jam at Sofia University",
        summary: "A game jam at the Faculty of Mathematics and Informatics, Sofia University: a theme on Friday, a team over the weekend, and a playable game by the end.",
        year: "Dates to be announced",
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Announced",
        mark: "GJ",
        image: "/events/fmi-game-jam.svg",
        partner: "Faculty of Mathematics and Informatics, Sofia University",
        location: "FMI, Sofia University, Sofia",
        facts: [["Format", "Game jam"], ["Host", "FMI, Sofia University"], ["Dates", "To be announced"]],
        detail: "A game jam is the fastest way to see how games actually get made: pick a scope, build, cut, and ship in one weekend. The Faculty of Mathematics and Informatics at Sofia University is planning a jam for students, with a theme announced at the start and teams free to build in any engine.",
        notice: "Dates, venue, and how to take part will be confirmed and published here once they are set.",
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
          {
            title: "Who it is for",
            paragraphs: [
              "Students who want to try making a game from scratch, whatever their experience. Game jams are a common first step for people who have never shipped anything before.",
            ],
          },
        ],
        links: [["Faculty of Mathematics and Informatics", "https://www.fmi.uni-sofia.bg/en"]],
      },
      {
        id: "fmi-esports-tournament-2027",
        title: "Qoax × FMI Gaming Tournament",
        subtitle: "Counter-Strike 2 and League of Legends",
        summary: "A student esports tournament with Sofia University’s FMI in early March 2027: 5v5 brackets in Counter-Strike 2 and League of Legends, casted finals, and a weekend for teams to meet in person.",
        year: "Early March 2027",
        startsAt: "2027-03-01T00:00:00+02:00",
        calendar: ["Mar", "2027"],
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Announced",
        mark: "GG",
        image: "/events/fmi-tournament.svg",
        partner: "Sofia University, Faculty of Mathematics and Informatics (FMI)",
        location: "FMI, Sofia University, Sofia",
        facts: [["Games", "CS2 · LoL"], ["Format", "5v5 brackets"], ["Entry", "Free"]],
        detail: "Esports is where a lot of students first learn teamwork, communication under pressure, and the discipline of practice. Together with the Faculty of Mathematics and Informatics at Sofia University, Qoax Community is organizing a student tournament in Counter-Strike 2 and League of Legends at the start of March 2027, with online qualifiers and in-person finals at FMI.",
        notice: "Registration opens in early 2027. Team sign-ups, rules, and the exact dates will be published here.",
        story: [
          {
            title: "Format",
            bullets: [
              "Counter-Strike 2: 5v5, open online qualifiers, best-of-one groups, best-of-three playoffs.",
              "League of Legends: 5v5 Summoner’s Rift, tournament draft, single-elimination bracket with best-of-three semis and finals.",
              "In-person finals at FMI with live casting, a crowd, and prizes from partners.",
            ],
          },
          {
            title: "Who can play",
            paragraphs: [
              "Teams of current students from Sofia University and other Bulgarian universities, plus high-school teams from Qoax partner schools in a separate bracket if there are enough sign-ups. Substitutes are allowed; fair play and anti-cheat rules apply to everyone.",
            ],
          },
          {
            title: "More than matches",
            paragraphs: [
              "The finals weekend doubles as a meetup: short talks from people working in games and esports, a corner for casters and streamers to try the desk, and space for teams to find their next players.",
            ],
          },
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
