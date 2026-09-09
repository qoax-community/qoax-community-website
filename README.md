# Qoax Community website

The static, non-profit-only public site for Qoax Community at [qo.ax](https://qo.ax).

It documents:

- Atanasoff48 at SPGE John Atanasoff, 2–4 October 2026
- the FMI Game Jam at Sofia University (dates to be announced)
- the Qoax × FMI Gaming Tournament (Counter-Strike 2 and League of Legends), early March 2027
- the 1–14 July 2026 internship programme for 30+ students
- partnerships with TUES, SPGE John Atanasoff, Popov School, and telecommunications schools in Bulgaria
- Venus Labyrinth and InfoCareerCenter
- the public legal documents (Privacy, Terms, GDPR) for the qo.ax domain

There is no database, API, server application, Academy catalogue, or commercial portfolio in this repository.

## Stack

- Next.js (App Router) with `output: "export"`; every route is prerendered to `out/`.
- Plain CSS: design tokens in `app/globals.css`, all component styles in `app/site.module.css`.
- Fonts (Inter, Manrope) are downloaded at build time by `next/font` and self-hosted; no runtime third-party requests.
- Content lives in `app/archive-tree-data.ts` (records, including events with dates, stories, and galleries), `app/data.ts` (project details), and `app/legal-data.ts` (legal documents).
- Event pages get a live countdown from `app/countdown.tsx`; `upcomingEvents()` drives the home page hero and the events rail.
- FMI posters in `public/events/` are original SVGs.
- Shared UI (header, footer, buttons, tags, cards, icons) lives in `app/components.tsx`.

## Local development

```bash
npm install
npm run dev
```

## Static publishing

- `npm run build` exports the complete site into `out/`.
- `npm test` builds and verifies every public route.
- every push to `main` rebuilds and force-replaces `gh-pages` with only the generated static files.

## Contact

[contact@qo.ax](mailto:contact@qo.ax)
