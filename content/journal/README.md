# Journal posts

Every `*.md` file in this folder becomes a page at `https://qo.ax/blog/<file-name>/`,
appears on the journal index, the home page, the RSS feed, and the sitemap.

1. Copy `_TEMPLATE.md` to `<slug>.md` (lower-case letters, digits, and dashes only).
2. Fill in the frontmatter. Required: `title`, `excerpt`, `lede`, `category`, `tags`, `author`, `published`.
3. Write the body with `##` headings. Each heading becomes a section in the "On this page" list.
4. Run `npm test`. The build fails with a clear message when a field is missing or wrong.
5. Commit and push `main`. GitHub Pages publishes the site.

| Field | Values |
| --- | --- |
| `category` | `Events`, `Programmes`, `Building`, `About the name` |
| `author` | `emil-momchev`, `angel-penchev`, `ema-komitova`, `qoax-community` (see `app/blog-data.ts`) |
| `published`, `updated` | `YYYY-MM-DD` |
| `record` | slug of a page under `/projects/`, for example `atanasoff48` |
| `featured` | `true` to pin the post at the top of the journal |
| `image` | cover shown when the link is shared (Discord, Viber, LinkedIn): a `.jpg`, `.png`, or `.webp` under `public/`, for example `/journal/atanasoff48-2026.jpg`. Ideal size 1200×630. Without it the post uses the image of its `record`, then the site card. |

Files starting with `_` and this README are ignored by the build.
