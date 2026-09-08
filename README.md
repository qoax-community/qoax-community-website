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

`npm install` also points git at `.githooks`, so every commit message is checked against [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) before the commit is created. The same check runs in CI on every pull request, over the pull request title and every non-merge commit it carries.

- rejected messages are reported in full, one entry per broken rule, each with a fix
- if you already set `core.hooksPath` yourself, the installer leaves it alone and warns instead — your own hooks keep working, and this check does not run locally
- `git commit --no-verify` skips the local check — CI still runs it
- `git commit --cleanup=<mode>` on the command line is invisible to a hook, which sees only `commit.cleanup`. Under a mode the hook cannot know about, a `#` line may be judged as a comment and then stored as text; set `commit.cleanup` in your config if you use a non-default mode
- the hook needs bash 4+ (`brew install bash` on macOS); without it the hook warns instead of blocking

## Static publishing

- `npm run build` exports the complete site into `out/`.
- `npm test` builds and verifies every public route.
- every push to `main` rebuilds and force-replaces `gh-pages` with only the generated static files.

## Contact

[contact@qo.ax](mailto:contact@qo.ax)
