import { siteAsset } from "./site-path";
import { STREAM_PLAYLIST_URL } from "./streams-data";

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
  /** Page title when the plain title would be vague on its own, e.g. a school name. */
  metaTitle?: string;
  subtitle: string;
  summary: string;
  /** Human-readable date label, e.g. "14-15 Nov 2026" */
  year: string;
  /** ISO start date for sorting and countdowns (only when the date is confirmed). */
  startsAt?: string;
  /** Short calendar label for the events rail, e.g. ["14-15", "Nov"] */
  calendar?: [string, string];
  state: AchievementState;
  kind: AchievementKind;
  priority: 1 | 2 | 3 | 4 | 5;
  image?: string;
  imageCredit?: string;
  /** Gallery caption when the hero credit does not cover every gallery photo */
  galleryCredit?: string;
  logo?: string;
  mark?: string;
  portfolio?: boolean;
  signal?: string;
  href?: string;
  /** Set to "register" when `href` is a sign-up page; the button then reads "Register on <host>" instead of "Visit <host>". */
  liveLabel?: "register";
  partner?: string;
  /** Label for the partner fact, e.g. "Organized by". Defaults to "With". */
  partnerLabel?: string;
  location?: string;
  detail?: string;
  notice?: string;
  facts?: Array<[string, string]>;
  story?: StorySection[];
  gallery?: GalleryImage[];
  links?: Array<[string, string]>;
  /** Direct link to this event's livestream or its recording. */
  stream?: string;
};

/**
 * Where to watch an event. A completed event only links to its own recording, never to the
 * generic playlist. An upcoming event without a direct link points to the stream playlist.
 */
export function streamFor(achievement: Pick<Achievement, "kind" | "stream" | "state">) {
  if (achievement.kind !== "event") return undefined;
  if (achievement.stream) return { url: achievement.stream, direct: true };
  if (achievement.state === "unlocked") return undefined;
  return { url: STREAM_PLAYLIST_URL, direct: false };
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
        metaTitle: "Atanasoff48 hackathon at SPGE John Atanasoff",
        subtitle: "The first SPGE John Atanasoff hackathon",
        summary: "The first edition of the school’s 48-hour hackathon: 62 participants in 16 teams at the SPGE John Atanasoff STEM Centre, 2 to 4 October 2026.",
        year: "2-4 Oct 2026",
        startsAt: "2026-10-02T09:00:00+03:00",
        calendar: ["2-4", "Oct"],
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
        partnerLabel: "Organized by",
        location: "SPGE John Atanasoff STEM Centre, Sofia",
        facts: [["Participants", "62"], ["Teams", "16"], ["Duration", "48 hours"]],
        detail: "Atanasoff48 is organized by the school’s Student Council. Qoax is part of the team behind its digital presence and practical delivery support. The first edition ran from 2 to 4 October 2026: 62 participants in 16 teams had 48 hours to build a project and present it, followed by the awards.",
        story: [
          {
            title: "What comes next",
            paragraphs: [
              "A second edition is planned for October to November 2027, prepared with its own team, budget, and partner programme. Dates will be published here once they are confirmed.",
            ],
          },
        ],
        gallery: [
          { src: "/events/atanasoff48-2026/atanasoff48-199.jpg", alt: "A full room of participants seated with laptops in the STEM Centre" },
          { src: "/events/atanasoff48-2026/atanasoff48-205.jpg", alt: "A mentor leans in to help a team working at their laptops" },
          { src: "/events/atanasoff48-2026/atanasoff48-200.jpg", alt: "A participant pitches in front of a screen titled “In the next 7 minutes you will learn”" },
          { src: "/events/atanasoff48-2026/atanasoff48-203.jpg", alt: "A team stands by a screen presenting their project to the room", caption: "Final presentations." },
          { src: "/events/atanasoff48-2026/atanasoff48-196.jpg", alt: "Five members of team The Grunders hold the first-place cheque", caption: "First place: The Grunders." },
          { src: "/events/atanasoff48-2026/atanasoff48-195.jpg", alt: "The three winning teams pose with mentors and their award cheques", caption: "The three winning teams: The Grunders, BDN and Волтова дъга." },
        ],
        links: [["Official site", "https://atanasoff48.com/"]],
      },
      {
        id: "sofia-game-jam-2026",
        title: "Sofia Game Jam",
        metaTitle: "Sofia Game Jam 2026",
        subtitle: "Arcade with a Mission",
        summary: "A game jam at Sofia Summit Center on 20 to 22 November 2026. The theme was “Arcade with a Mission”: games for arcade machines that take bottles and cans.",
        year: "20-22 Nov 2026",
        startsAt: "2026-11-20T00:00:00+02:00",
        calendar: ["20-22", "Nov"],
        state: "unlocked",
        kind: "event",
        priority: 5,
        signal: "Completed",
        mark: "SG",
        image: "/events/sofia-game-jam-2026/sgj-teams.jpg",
        stream: "https://www.youtube.com/watch?v=jpjpQi7ADZI",
        imageCredit: "Photo: Radislav Gachevski",
        location: "Sofia Summit Center, Sofia",
        facts: [["Theme", "Arcade with a Mission"], ["Format", "Game jam"], ["Qoax", "Livestream, sponsors"]],
        detail: "Sofia Game Jam ran from 20 to 22 November 2026 at Sofia Summit Center. The theme, “Arcade with a Mission”, asked teams to make games for arcade machines that accept bottles and cans. Qoax ran the livestream and helped bring in sponsors.",
        gallery: [
          { src: "/events/sofia-game-jam-2026/sgj-teams.jpg", alt: "Teams work at laptops around long tables in the hall" },
          { src: "/events/sofia-game-jam-2026/sgj-opening.jpg", alt: "A full hall of participants applauds during the opening", caption: "The opening." },
          { src: "/events/sofia-game-jam-2026/sgj-host.jpg", alt: "A host speaks into a microphone in front of the sponsor screen, with the Qoax logo beside him" },
          { src: "/events/sofia-game-jam-2026/sgj-team-creation.jpg", alt: "A host points at QR codes on a screen titled “Team creation”", caption: "Forming teams." },
          { src: "/events/sofia-game-jam-2026/sgj-playtest.jpg", alt: "A group gathers around a participant playing a game on arcade controls" },
          { src: "/events/sofia-game-jam-2026/sgj-arcade.jpg", alt: "A young visitor in a red hoodie plays on an arcade cabinet" },
          { src: "/events/sofia-game-jam-2026/sgj-devhubone-arcade.jpg", alt: "Two organizers smile beside the DevHubOne arcade machine showing a game menu" },
          { src: "/events/sofia-game-jam-2026/sgj-team.jpg", alt: "Four members of the organizing team pose at the venue, one with a thumbs-up", caption: "The team." },
        ],
      },
      {
        id: "nasa-space-apps-2026",
        title: "NASA Space Apps Challenge Sofia",
        subtitle: "The world’s largest hackathon came to Sofia",
        summary: "Two days, 14 to 15 November 2026, where teams used open NASA and partner-agency data to solve real challenges on Earth and in space. Part of a global event with 450+ locations.",
        year: "14-15 Nov 2026",
        startsAt: "2026-11-14T09:00:00+02:00",
        calendar: ["14-15", "Nov"],
        state: "unlocked",
        kind: "event",
        priority: 5,
        signal: "Completed",
        mark: "SA",
        image: "/events/nasa-space-apps-2026/nasa-team.jpg",
        stream: "https://www.youtube.com/watch?v=tKL2WClouPE",
        imageCredit: "Photo: Emilia Tomova",
        galleryCredit: "Day 2 photos by Emilia Tomova",
        href: "https://www.spaceappschallenge.org/2026/local-events/sofia/",
        liveLabel: "register",
        partner: "NASA International Space Apps Challenge",
        partnerLabel: "Part of",
        location: "Incubator building, Sofia Tech Park, Sofia",
        facts: [["Theme", "The Next Frontier"], ["Grand prize", "€750"], ["Qoax", "Organizer, livestream"]],
        detail: "NASA Space Apps is a 48-hour global hackathon run every year by NASA with 17 space-agency partners. On 14 to 15 November 2026, Qoax Community brought a local event to Sofia Tech Park, where students, developers, designers, and scientists worked on the same challenges as teams in hundreds of cities around the world, with mentors in the room. Qoax also ran the livestream. The winning team took home the €750 grand prize.",
        story: [
          {
            title: "What Space Apps is",
            paragraphs: [
              "The NASA International Space Apps Challenge is the largest annual hackathon in the world. Over one weekend, participants at local events on every continent respond to challenges written by NASA and partner space agencies, using open data to build software, hardware, visualizations, games, and stories.",
              "All ages, skill levels, and professional backgrounds are welcome. You do not need to be an engineer: challenges span agriculture, climate, astrophysics, education, art, and storytelling.",
            ],
          },
          {
            title: "2026 theme: The Next Frontier",
            paragraphs: [
              "The 2026 theme asked teams to look at what comes next: the next mission, the next dataset, the next question about our planet and the universe. Challenge statements came out in two waves before the hackathon, so teams could prepare, read the data, and arrive with an idea.",
            ],
            timeline: [
              ["17 Sep 2026", "Challenges revealed"],
              ["28 Oct 2026", "Full challenge statements released, with datasets from NASA and partner agencies"],
              ["14-15 Nov 2026", "Hackathon weekend, Sofia and 450+ locations worldwide"],
              ["After the event", "Local judging, then global judging of nominated projects"],
            ],
          },
          {
            title: "Why Sofia",
            paragraphs: [
              "Sofia has taken part in Space Apps since 2013, when a Sofia team, ChickBook, became a global winner in the People’s Choice category. Local editions have gathered dozens of participants and up to 17 teams in a single weekend, hosted over the years by schools, universities, and the software community.",
              "Qoax Community picked up that thread. Our partner schools already run hackathons and internship programmes with us, and Space Apps was the natural next step: the same practical rhythm, real data, and a global stage.",
            ],
          },
        ],
        gallery: [
          { src: "/events/nasa-space-apps-2026/nasa-team.jpg", alt: "The organizing team poses in front of the Space Apps Sofia screen, some kneeling in front", caption: "The team." },
          { src: "/events/nasa-space-apps-2026/nasa-winners.jpg", alt: "Five people stand under a screen showing the €750 grand prize, one holding an inflatable space shuttle", caption: "The €750 grand prize." },
          { src: "/events/nasa-space-apps-2026/nasa-livestream.jpg", alt: "A man with headphones works at the livestream desk with microphones and a camera", caption: "The Qoax livestream desk." },
          { src: "/events/nasa-space-apps-2026/nasa-welcome.jpg", alt: "A welcome screen for NASA Space Apps Challenge Sofia, 14 to 15 November 2026, at Sofia Tech Park" },
          { src: "/events/nasa-space-apps-2026/nasa-gong.jpg", alt: "Organizers smile next to a gong in front of a screen that reads “Match”", caption: "Team matching." },
          { src: "/events/nasa-space-apps-2026/nasa-whiteboard.jpg", alt: "A participant sketches on a whiteboard headed “RED Frontier”" },
          { src: "/events/nasa-space-apps-2026/nasa-selfie.jpg", alt: "A team takes a selfie at their desks" },
          { src: "/events/nasa-space-apps-2026/nasa-pitch.jpg", alt: "Three participants present beside a slide titled “Kids learn Mars by surviving it”", caption: "Pitching to the judges." },
        ],
        links: [
          ["NASA Space Apps Challenge website", "https://www.spaceappschallenge.org/"],
          ["Space Apps Bulgaria on Facebook", "https://www.facebook.com/SpaceAppsChallengeBulgaria/"],
        ],
      },
      {
        id: "john-atanasoff-game-jam-2026",
        title: "Atanasoff Jam",
        metaTitle: "Atanasoff Jam at SPGE John Atanasoff",
        subtitle: "The SPGE John Atanasoff game jam",
        summary: "A game jam at SPGE John Atanasoff in January to February 2027: teams make a game together, with mentors, and present the finished projects.",
        year: "Jan-Feb 2027",
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Planned",
        mark: "AJ",
        partner: "SPGE John Atanasoff",
        location: "SPGE John Atanasoff, Sofia",
        facts: [["Format", "Game jam"], ["Period", "Jan-Feb 2027"], ["Dates", "Under discussion"]],
        detail: "Atanasoff Jam is the game jam of SPGE John Atanasoff. Teams make a game together with support from mentors, then present the finished projects. Qoax handles logistics, design, sponsors, and social media.",
        notice: "31 January to 2 February 2027 is under discussion. Confirmed dates will be published here.",
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
        summary: "Two student tournaments with SUGAMING and FMI, Sofia University: online qualifiers at the end of February 2027 and finals with an audience on 6 to 7 March, one day per game.",
        year: "6-7 Mar 2027",
        startsAt: "2027-03-06T00:00:00+02:00",
        calendar: ["6-7", "Mar"],
        state: "growing",
        kind: "event",
        priority: 4,
        signal: "Announced",
        mark: "GG",
        image: "/events/fmi-tournament.svg",
        partner: "SUGAMING",
        location: "FMI, Sofia University, Sofia",
        facts: [["Games", "CS2 and LoL"], ["Qualifiers", "27-28 Feb, online"], ["Finals", "6-7 Mar, live"]],
        detail: "Together with SUGAMING and the Faculty of Mathematics and Informatics, Qoax Community is organizing two tournaments, in Counter-Strike 2 and League of Legends. The proposed schedule is online qualifiers for both games on 27 to 28 February 2027 and finals with an audience on 6 to 7 March, one day for each game.",
        notice: "These are working dates. Registration, rules, and the final schedule will be published here.",
        story: [
          {
            title: "Proposed schedule",
            timeline: [
              ["27-28 Feb 2027", "Online qualifiers, both games"],
              ["6-7 Mar 2027", "Finals with an audience, one day per game"],
            ],
          },
        ],
        links: [["Faculty of Mathematics and Informatics", "https://www.fmi.uni-sofia.bg/en"]],
      },
      {
        id: "telecommunications-hackathon-2027",
        title: "Telecommunications Hackathon",
        metaTitle: "Telecommunications Hackathon 2027 in Sofia",
        subtitle: "Technology for healthcare",
        summary: "A hackathon at the Professional High School of Telecommunications in Sofia on 26 to 28 March 2027. The theme is technology for healthcare.",
        year: "26-28 Mar 2027",
        startsAt: "2027-03-26T00:00:00+02:00",
        calendar: ["26-28", "Mar"],
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
        title: "SUGAMING Game Jam",
        metaTitle: "SUGAMING Game Jam at FMI, Sofia University",
        subtitle: "A game jam at FMI, Sofia University",
        summary: "A game jam organized by the SUGAMING club at the Faculty of Mathematics and Informatics, 16 to 18 October 2026. Seven games were submitted.",
        year: "16-18 Oct 2026",
        startsAt: "2026-10-16T00:00:00+03:00",
        calendar: ["16-18", "Oct"],
        state: "unlocked",
        kind: "event",
        priority: 4,
        signal: "Completed",
        mark: "GJ",
        portfolio: true,
        image: "/journal/sugaming-jam-2026-presentation.jpg",
        partner: "SUGAMING club",
        partnerLabel: "Organized by",
        location: "FMI, Sofia University, Sofia",
        facts: [["Dates", "16-18 Oct 2026"], ["Theme", "Chaotic Business"], ["Games submitted", "7"], ["Venue", "FMI, Sofia University"]],
        detail: "SUGAMING Game Jam was organized by the SUGAMING club and held from 16 to 18 October 2026 at the Faculty of Mathematics and Informatics, Sofia University. Teams built a game over the weekend and presented it at the end. Seven games were submitted.",
        story: [
          {
            title: "The weekend",
            bullets: [
              "The theme, Chaotic Business, was announced at the start. Submissions on itch.io ran from 16 to 18 October.",
              "Seven games were submitted. All of them are listed on the jam’s itch.io page.",
              "On the last day every team presented its game, and the Best Game award was given.",
            ],
          },
        ],
        gallery: [
          { src: "/events/sugaming-jam-2026/gamejam-594.jpg", alt: "A participant in headphones works on a game at a laptop with a second laptop beside it" },
          { src: "/journal/sugaming-jam-2026-board.jpg", alt: "A participant writes a team to-do list on a whiteboard during the jam" },
          { src: "/events/sugaming-jam-2026/gamejam-684.jpg", alt: "Trays of food laid out for participants" },
          { src: "/events/sugaming-jam-2026/gamejam-34.jpg", alt: "A participant in sunglasses throws rock-on hand signs" },
          { src: "/events/sugaming-jam-2026/gamejam-864.jpg", alt: "Four team members smile and hold Best Game trophies", caption: "Best Game award winners." },
        ],
        links: [
          ["Games on itch.io", "https://itch.io/jam/sugaming-jam-2026/entries"],
          ["Faculty of Mathematics and Informatics", "https://www.fmi.uni-sofia.bg/en"],
        ],
      },
      {
        id: "internship-program-2026",
        title: "Internship Programme 2026",
        metaTitle: "Internship Programme 2026 with partner schools",
        subtitle: "Thirty-plus students building in teams",
        summary: "A shared programme for more than 30 students from Bulgarian technology schools, held from 1 to 14 July 2026.",
        year: "1-14 Jul 2026",
        state: "unlocked",
        kind: "programme",
        priority: 5,
        signal: "30+ students",
        mark: "30+",
        partner: "Partner technology schools in Bulgaria",
        location: "Sofia, Bulgaria",
        detail: "From 1 to 14 July 2026, more than 30 students worked in teams across a practical internship programme supported by Qoax and partner schools. The programme connected technical mentorship, project ownership, peer work, and a real delivery rhythm.",
      },
      {
        id: "venus-labyrinth",
        title: "Venus Labyrinth",
        metaTitle: "Venus Labyrinth sensory theatre",
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
        metaTitle: "Qoax Community and InfoCareerCenter",
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
        metaTitle: "Qoax Community and TUES",
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
        metaTitle: "Qoax Community and SPGE John Atanasoff",
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
        metaTitle: "Qoax Community and Popov School",
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
        metaTitle: "Qoax Community and the telecommunications schools",
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
