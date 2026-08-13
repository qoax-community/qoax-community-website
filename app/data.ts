import { siteAsset } from "./site-path";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  image?: string;
  tech: string[];
  category: string;
  status: "Live" | "Completed" | "In progress";
  client: string;
  year: string;
  href?: string;
};

const projectDefinitions: Project[] = [
  {
    slug: "venus-labyrinth",
    title: "Venus Labyrinth Oracle Board",
    summary: "An interactive lighting control system guiding audiences through a 28-room sensory theatre experience.",
    image: "/projects/venus-labyrinth.webp",
    tech: ["Custom hardware", "Lighting", "Interactive systems"],
    category: "Culture",
    status: "Completed",
    client: "Sensory Theatre Sofia",
    year: "2025",
  },
  {
    slug: "nsicc",
    title: "InfoCareerCenter",
    summary: "A bilingual digital presence for a national student information and career-guidance NGO.",
    image: "/projects/nsicc.png",
    tech: ["WordPress", "PHP", "Custom theme"],
    category: "Non-profit",
    status: "Completed",
    client: "National Student Information and Career Center",
    year: "2025",
    href: "https://infocareercenter.org",
  },
];

export const projects: Project[] = projectDefinitions.map((project) => ({
  ...project,
  image: project.image ? siteAsset(project.image) : undefined,
}));
