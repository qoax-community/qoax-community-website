# Qoax Community website

The static, non-profit-only archive for Qoax Community.

It documents:

- Atanasoff48 at SPGE John Atanasoff, 2–4 October 2026
- the 1–14 July 2026 internship programme for 30+ students
- partnerships with TUES, SPGE John Atanasoff, Popov School, and telecommunications schools in Bulgaria
- Venus Labyrinth and InfoCareerCenter

There is no database, API, server application, Academy catalogue, or commercial portfolio in this repository.

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
