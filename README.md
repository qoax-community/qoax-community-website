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

`npm install` also points git at `.githooks`, so every commit message is checked against [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) before the commit is created. The same check runs in CI on every pull request, over both the commits and the pull request title.

- rejected messages are reported in full, one entry per broken rule, each with a fix
- `git commit --no-verify` skips the local check — CI still runs it
- the hook needs bash 4+ (`brew install bash` on macOS); without it the hook warns instead of blocking

## Static publishing

- `npm run build` exports the complete site into `out/`.
- `npm test` builds and verifies every public route.
- every push to `main` rebuilds and force-replaces `gh-pages` with only the generated static files.

## Contact

[contact@qo.ax](mailto:contact@qo.ax)
