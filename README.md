# Qoax Community website

The static, non-profit-only public site for Qoax Community at [qo.ax](https://qo.ax).

It documents:

- Atanasoff48 at SPGE John Atanasoff, 2–4 October 2026
- the FMI Game Jam at Sofia University (dates to be announced)
- the Qoax × SUGAMING Gaming Tournament (Counter-Strike 2 and League of Legends), early March 2027
- the 1–14 July 2026 internship programme for 30+ students
- partnerships with TUES, SPGE John Atanasoff, Popov School, and telecommunications schools in Bulgaria
- Venus Labyrinth and InfoCareerCenter
- the public legal documents (Privacy, Terms, GDPR) for the qo.ax domain

There is no database, API, server application, Academy catalogue, or commercial portfolio in this repository.

## Stack

- Next.js (App Router) with `output: "export"`; every route is prerendered to `out/`.
- Plain CSS: design tokens in `app/globals.css`, all component styles in `app/site.module.css`.
- Fonts are downloaded at build time by `next/font` and self-hosted. Google Analytics is the optional runtime third-party integration and loads only after consent.
- Content lives in `app/archive-tree-data.ts` (records, including events with dates, stories, and galleries), `app/data.ts` (project details), and `app/legal-data.ts` (legal documents).
- Event pages get a live countdown from `app/countdown.tsx`; `upcomingEvents()` drives the home page hero and the events rail.
- FMI posters in `public/events/` are original SVGs.
- Shared UI (header, footer, buttons, tags, cards, icons) lives in `app/components.tsx`.

## Local development

```bash
npm install
npm run dev
```

`npm install` checks out the [qoax-githooks](https://github.com/qoax-community/qoax-githooks)
submodule under `.githooks/shared` and points git at `.githooks`, so every
commit message is checked against [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
before the commit is created. The same hook runs in CI over the pull request
title and every non-merge commit it carries.

- rejected messages are reported in full, one entry per broken rule, each with a fix
- if you already set `core.hooksPath` yourself, the installer leaves it alone and warns instead — your own hooks keep working, and this check does not run locally
- `git commit --no-verify` skips the local check — CI still runs it
- `git commit --cleanup=<mode>` on the command line is invisible to a hook, which sees only `commit.cleanup`. Under a mode the hook cannot know about, a `#` line may be judged as a comment and then stored as text; set `commit.cleanup` in your config if you use a non-default mode
- the hook needs bash 4+ (`brew install bash` on macOS); without it the hook warns instead of blocking
- Dependabot moves the submodule pin forward as the hook changes; `git config --global submodule.recurse true` makes `git pull` follow it, otherwise you keep running the hook version you first cloned
- `.githooks/shared/scripts/check-messages.sh main..HEAD` checks a branch before you push it. The hook's own test suite lives in qoax-githooks and runs there

## Static publishing

- `npm run build` exports the complete site into `out/`.
- `npm test` builds and verifies every public route.
- every push to `main` rebuilds and force-replaces `gh-pages` with only the generated static files.

## Optional analytics

GA4 stream `G-P7F0DM83L3` is managed by `app/analytics.ts` and the consent banner
in `app/analytics-consent.tsx`. Do not add a second Google tag to the layout or
enable an independently injected tag: that would bypass the consent gate.

- Basic consent mode: no Google script, measurement requests or consent pings before acceptance.
- Both choices are available with equal prominence; the footer's Cookie settings button reopens them.
- Choices expire after 180 days. Invalid or expired storage fails closed; blocked storage falls back to the current page only.
- Google signals and ad personalisation are disabled; all advertising consent remains denied.
- Host-only Analytics cookies expire after 180 days, without sliding renewal. Withdrawal disables measurement immediately, deletes the two Analytics cookies, and reloads when the denial is saved to unload Google's listeners.
- Browser history measurement is handled by GA4's enhanced measurement setting, not a second manual page-view emitter. In GA4 Admin, keep page views on browser-history changes enabled for Next.js navigation.

Account-level settings are not controlled by the tag. In Google Analytics Admin,
review the data-processing terms, keep advertising/Google signals and unnecessary
data sharing disabled, and set user/event retention to **2 months**, with
**Reset on new activity off**. Verify the actual settings in the account; this
repository does not claim to have changed them. The privacy notice distinguishes
browser expiry from Google-side retention and links to Google's terms.

For a smoke test, clear `qoax.analytics-consent.v1` and check the browser Network
panel: no `googletagmanager.com` or `google-analytics.com` requests before consent
or after rejecting; accepting loads one tag; Cookie settings → Reject analytics
removes `_ga` / `_ga_P7F0DM83L3`, and the reloaded page makes no Analytics requests.

## Contact

[contact@qo.ax](mailto:contact@qo.ax)
