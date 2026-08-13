import { projects, type Project } from "./data";
import {
  achievementBranches,
  type Achievement,
  type AchievementBranch,
} from "./archive-tree-data";

const projectAliases: Record<string, string> = {
  infocareercenter: "nsicc",
};

export type ArchiveEntry = Achievement & {
  slug: string;
  branch: AchievementBranch;
  project?: Project;
};

export const archiveEntries: ArchiveEntry[] = achievementBranches.flatMap((branch) =>
  branch.achievements.map((achievement) => {
    const projectSlug = projectAliases[achievement.id] ?? achievement.id;
    const project = projects.find((candidate) => candidate.slug === projectSlug);

    return {
      ...achievement,
      slug: project?.slug ?? achievement.id,
      branch,
      project,
    };
  }),
);

export function getArchiveEntry(slug: string) {
  return archiveEntries.find((entry) => entry.slug === slug || entry.id === slug);
}

export function entriesForBranch(branchSlug: AchievementBranch["slug"]) {
  return archiveEntries
    .filter((entry) => entry.branch.slug === branchSlug)
    .sort((left, right) => {
      if (left.state === "locked" && right.state !== "locked") return 1;
      if (right.state === "locked" && left.state !== "locked") return -1;
      return right.priority - left.priority;
    });
}

export const archiveBranches = achievementBranches.map((branch) => ({
  ...branch,
  entries: entriesForBranch(branch.slug),
}));

export const nonprofitEntries = entriesForBranch("nonprofit");
