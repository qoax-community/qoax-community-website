import { siteAsset } from "./site-path";

export type AchievementState = "unlocked" | "growing" | "locked";

export type Achievement = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  year: string;
  state: AchievementState;
  priority: 1 | 2 | 3 | 4 | 5;
  image?: string;
  portfolio?: boolean;
  signal?: string;
  href?: string;
  partner?: string;
  detail?: string;
  notice?: string;
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
    color: "#f5b82e",
    rgb: "245, 184, 46",
    achievements: [
      {
        id: "atanasoff48",
        title: "Atanasoff48",
        subtitle: "The first SPGE John Atanasoff hackathon",
        summary: "A free 48-hour school hackathon at the SPGE John Atanasoff STEM Centre, taking place 2–4 October 2026.",
        year: "2–4 Oct 2026",
        state: "growing",
        priority: 5,
        signal: "Upcoming",
        href: "https://atanasoff48.com/",
        partner: "SPGE John Atanasoff Student Council",
        detail: "Atanasoff48 is organized by the school’s Student Council. QO.AX is part of the team behind its digital presence and practical delivery support. The first edition welcomes up to 16 teams of four, with free participation and three days to create and present a project.",
      },
      {
        id: "internship-program-2026",
        title: "Internship Programme 2026",
        subtitle: "Thirty-plus students building in teams",
        summary: "A shared programme for more than 30 students from Bulgarian technology schools, held from 1–14 July 2026.",
        year: "1–14 Jul 2026",
        state: "unlocked",
        priority: 5,
        signal: "30+ students",
        partner: "Partner technology schools in Bulgaria",
        detail: "From 1 to 14 July 2026, more than 30 students worked in teams across a practical internship programme supported by QO.AX and partner schools. The programme connected technical mentorship, project ownership, peer work, and a real delivery rhythm.",
        notice: "The exact student projects, teams, and outcomes will be published here soon.",
      },
      {
        id: "venus-labyrinth",
        title: "Venus Labyrinth",
        subtitle: "Art, space, light, and human choice",
        summary: "Technical stewardship for a 28-room sensory theatre work where technology stays invisible and the experience comes first.",
        year: "2025",
        state: "unlocked",
        priority: 5,
        image: "/projects/venus-labyrinth.webp",
        portfolio: true,
        signal: "Art partnership",
        partner: "Sensory Theatre Sofia",
      },
      {
        id: "infocareercenter",
        title: "InfoCareerCenter",
        subtitle: "Technology for an NGO",
        summary: "A bilingual digital presence for a national student information and career-guidance organization.",
        year: "2025",
        state: "unlocked",
        priority: 4,
        image: "/projects/nsicc.png",
        portfolio: true,
        signal: "NGO",
        partner: "National Student Information and Career Center",
      },
      {
        id: "tues",
        title: "TUES",
        subtitle: "Technology-school partnership",
        summary: "A continuing relationship with one of Bulgaria’s strongest student technology communities.",
        year: "Active",
        state: "growing",
        priority: 4,
        image: "/events/tues.png",
        signal: "School partner",
        partner: "Technology School Electronic Systems",
      },
      {
        id: "john-atanasoff-school",
        title: "SPGE John Atanasoff",
        subtitle: "School partnership",
        summary: "A practical partnership spanning student initiatives, the 2026 internship programme, and Atanasoff48.",
        year: "Active",
        state: "growing",
        priority: 4,
        signal: "School partner",
        partner: "SPGE John Atanasoff",
      },
      {
        id: "popov-school",
        title: "Popov School",
        subtitle: "School partnership",
        summary: "A partner school contributing students and shared momentum to the 2026 internship programme.",
        year: "2026",
        state: "growing",
        priority: 3,
        signal: "School partner",
        partner: "Popov School",
      },
      {
        id: "telecommunications-schools-bulgaria",
        title: "Telecommunications Schools",
        subtitle: "Internship network across Bulgaria",
        summary: "Relationships with telecommunications-focused schools connecting students to real technical project work.",
        year: "2026",
        state: "growing",
        priority: 3,
        signal: "School network",
        partner: "Telecommunications schools in Bulgaria",
      },
    ],
  },
];

export const achievementBranches: AchievementBranch[] = achievementBranchDefinitions.map((branch) => ({
  ...branch,
  achievements: branch.achievements.map((achievement) => ({
    ...achievement,
    image: achievement.image ? siteAsset(achievement.image) : undefined,
  })),
}));

export const allAchievements = achievementBranches.flatMap((branch) =>
  branch.achievements.map((achievement) => ({ ...achievement, branch: branch.shortTitle })),
);

export const portfolioAchievementCount = allAchievements.filter((achievement) => achievement.portfolio).length;
export const unlockedAchievementCount = allAchievements.filter((achievement) => achievement.state !== "locked").length;
