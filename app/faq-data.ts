import { GITHUB_URL } from "./components";
import { legalEntity } from "./legal-data";

/**
 * Frequently asked questions. Answers use inline Markdown for links, bold,
 * and italics; `answer` paragraphs are also flattened to plain text for the
 * FAQPage structured data. Every fact here must be visible elsewhere on the
 * site or in the public register — no prices, no promises.
 */

export type FaqItem = {
  id: string;
  question: string;
  /** Paragraphs in inline Markdown. */
  answer: string[];
  /** Optional Bulgarian summary, rendered with lang="bg". */
  bulgarian?: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  intro?: string;
  items: FaqItem[];
};

export const faqGroups: FaqGroup[] = [
  {
    id: "name",
    title: "The name",
    intro: "Qoax is written in two alphabets and misspelled in several ways. All of them point here.",
    items: [
      {
        id: "spelling",
        question: "How do you spell and pronounce Qoax?",
        answer: [
          "Qoax is pronounced “ko-aks”. The registered Bulgarian spelling is КОАКС, and you will also see Коакс, Куакс, Kuaks, Koaks, and Quax. The web address is qo.ax, which is simply the name split by the dot.",
          "Whichever spelling you use, you are looking for the same community. We list every variant on the [About page](/about/#organisation) so searches in either alphabet find us.",
        ],
        bulgarian: "Коакс се произнася „ко-акс“ и се пише и като Куакс. Всички изписвания водят до едно и също сдружение.",
      },
      {
        id: "koaks-komyuniti",
        question: "Is Коакс Комюнити the same as Qoax Community?",
        answer: [
          `Yes. ${legalEntity.nameBg} is the registered Bulgarian name of the association, and ${legalEntity.nameEn} is its English name. Both are the organisation behind qo.ax, with UIC (ЕИК) ${legalEntity.uic}.`,
        ],
      },
    ],
  },
  {
    id: "community",
    title: "The community",
    items: [
      {
        id: "what-is-qoax",
        question: "What is Qoax Community?",
        answer: [
          "Qoax Community is an independent non-profit technology community based in Sofia, Bulgaria. We run hackathons, game jams, and tournaments with schools and universities, mentor students through the summer internship programme, and build software for civic and cultural organisations.",
          "Everything we do is public work: each event and project has a record page, and the journal explains what was planned, what happened, and what we would change.",
        ],
      },
      {
        id: "is-qoax-a-company",
        question: "Is Qoax a company?",
        answer: [
          `No. Qoax Community is a registered non-profit association, UIC (ЕИК) ${legalEntity.uic}, registered in Sofia on ${legalEntity.registrationDate}. There is no commercial catalogue and no advertising on this site.`,
          "The full registration details are on the [About page](/about/#organisation).",
        ],
      },
      {
        id: "who-is-behind-qoax",
        question: "Who is behind Qoax?",
        answer: [
          "Engineers, teachers, and students in Sofia. We will introduce the people behind the community in the [journal](/blog/) in the coming days; every post carries the name of the person who wrote it.",
        ],
      },
    ],
  },
  {
    id: "events",
    title: "Events and schools",
    items: [
      {
        id: "which-events",
        question: "What events does Qoax run?",
        answer: [
          "In the 2026–2027 season: Atanasoff48, a 48-hour hackathon at SPGE John Atanasoff on 2–4 October 2026; the FMI Game Jam with the Faculty of Mathematics and Informatics at Sofia University; the Qoax × FMI Gaming Tournament in early March 2027; and the summer Internship Programme for students from partner schools.",
          "Every event has a record page with dates, partners, and what we are responsible for. See [all events](/events/).",
        ],
      },
      {
        id: "run-an-event",
        question: "Can my school or student council run an event with Qoax?",
        answer: [
          "Yes. Write to [contact@qo.ax](mailto:contact@qo.ax) with what you have in mind: a hackathon, a game jam, a tournament, or a workshop. We plan it together with the school and publish a record page for it, as we did for Atanasoff48.",
        ],
      },
      {
        id: "which-schools",
        question: "Which schools work with Qoax?",
        answer: [
          "Technology schools in Sofia whose students took part in the 2026 internship programme or whose councils run events with us. The current list, with logos and notes, is on the [Schools page](/schools/).",
        ],
      },
    ],
  },
  {
    id: "working-with-us",
    title: "Working with us",
    items: [
      {
        id: "software-for-ngos",
        question: "Do you build software for NGOs and artists?",
        answer: [
          "Yes, for public-interest organisations: NGO websites, theatre installations, and civic tools. We build things the organisation can keep running after we step back, and we publish each as a record. See [our work](/work/).",
        ],
      },
      {
        id: "open-source",
        question: "Is your work open source?",
        answer: [
          `Our code is published under the [qoax-community organisation on GitHub](${GITHUB_URL}).`,
        ],
      },
      {
        id: "contact",
        question: "How do I contact Qoax?",
        answer: [
          "Write to [contact@qo.ax](mailto:contact@qo.ax). We reply to every message.",
        ],
      },
    ],
  },
];

export const faqItems = faqGroups.flatMap((group) => group.items);

/** Strips inline Markdown so the answer can be used in structured data. */
export function faqPlainText(item: FaqItem) {
  const text = [...item.answer, ...(item.bulgarian ? [item.bulgarian] : [])].join(" ");
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

/** Questions surfaced on the About page. */
export const aboutFaqIds = ["spelling", "is-qoax-a-company", "which-events", "software-for-ngos"];
