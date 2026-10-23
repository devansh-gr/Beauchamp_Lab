# (C) Stack, hosting, brand (2026-10-23)

## Hosting (verified with gh API + DNS)
- GitHub Pages, legacy build from `main` branch root of public repo `JABeauchamp/BeauchampLab`
  (last push 2026-10-19). Repo holds `index.html`, `assets/`, `CNAME`, `sitemap.xml`.
- Apex A records 185.199.108-111.153, `www` CNAME `jabeauchamp.github.io`.
- Devansh is not a collaborator. Ship path: fork, PR with built output (or a PR that adds an
  Actions workflow building Astro). Switching Pages source to Actions is the PI's call.

## Stack decision: Astro 7.4.2 (Node >= 22.23.4), static, content collections
- Static HTML, zero JS by default. Replaces the 2.3 MB bundle.
- Real routes: `/`, `/research`, `/people`, `/publications`, `/join`, `/news`, `/contact`.
  `@astrojs/sitemap` 3.7.4 generates the full sitemap.
- Content in YAML/Markdown collections with zod schemas. PI edits in GitHub web UI; bad field fails build.
- Interactive science viz as islands (`client:visible`), vanilla canvas, no React needed.
- Free, same host, same CNAME. Keep GoatCounter `jabeauchamp` + Formspree `mjgnvdzg`.

## CMU brand (brand.cmu.edu)
- Core: Carnegie Red #C41230 (dominant), Black #000000, Iron Gray #6D6E71, Steel Gray #E0E0E0, White.
- Accents only (Tartan): Scots Rose #EF3A47, Gold Thread #FDB515, Teal Thread #008F91,
  Highlands Sky Blue #007BC0, Blue Thread #043673. Never overshadow core.
- Type: Open Sans + Source Serif (free). Self-host woff2.
- CMU logo: official files only, min 150 px, never merged with the lab mark. Lab mark stays separate.
- Open: unitmark rules for labs not retrieved; ask marketing-info@andrew.cmu.edu if we use one.

## Current-site defects caused by architecture
- JS-only render: crawlers and link previews see "Unpacking...".
- No per-page URLs, sitemap has 1 entry, no per-page meta.
- 2.3 MB inline base64 payload, nothing cacheable across visits.

Sources: dns.google resolve, github.com/JABeauchamp/BeauchampLab, registry.npmjs.org/astro,
registry.npmjs.org/@astrojs/sitemap, brand.cmu.edu/visual-identity/colors,
brand.cmu.edu/visual-identity/typefaces, brand.cmu.edu/visual-identity/carnegie-mellon-trademarks/university-logo
