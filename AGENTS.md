# Agents

The skills for this repository are in `.agents/skills`. Claude Code reads them
through `.claude/skills`. They come from
[qoax-agent-skills](https://github.com/qoax-community/qoax-agent-skills), and
`skills-lock.json` pins them. Do not edit them here. Change a skill in
qoax-agent-skills, then run
`DISABLE_TELEMETRY=1 npx skills@1.7.3 update -p -y` on a computer that has a
`~/.claude` directory.

Each `.claude/skills/<name>` is a symbolic link. On Windows, turn on Developer
Mode and clone with `git clone -c core.symlinks=true`. Without the links,
Claude Code loads none of the skills. The
[qoax-agent-skills README](https://github.com/qoax-community/qoax-agent-skills#symbolic-links)
shows how to repair a clone.

## Web guidance

The `modern-web-guidance` skill gives guidance for HTML, CSS and client-side
JavaScript. It runs the `modern-web-guidance` CLI with npx.

- The skill needs Node 22 or later and access to registry.npmjs.org.
- Use the CLI version that the skill names.
- Do not run these commands of the `modern-web-guidance` CLI: `install`,
  `update`, `uninstall`, `set-baseline`, `set-allow-origin-trials` and
  `set-allow-volatile-features`.
- Do not install a `modern-web-guidance` plugin from another marketplace
  for this repository.

**Browser Support:** Chrome 111, Edge 111, Firefox 111 and Safari 16.4 or
later. This is the default target of Next.js 16. The repository sets no
browserslist of its own.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
