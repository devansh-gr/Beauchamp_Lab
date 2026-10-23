# Beauchamp Lab Redesign

Redesign of https://beauchamplab.org/ ("The Output Layer Lab", CMU BME + Neuroscience
Institute, PI Prof James (Drew) Beauchamp). Devansh works in the lab. Goal: a more
interesting site that shows the science, not just describes it.

## Hard rules
- Content truth: every fact on the site traces to the live site (`research/raw/dc_script.js`),
  a PI profile, or a cited paper. Never invent people, papers, funding or likes.
- Nothing ships to beauchamplab.org without Prof Beauchamp's sign-off. We build and preview;
  he owns the domain and deploy.
- Keep existing integrations: Formspree form `mjgnvdzg`, GoatCounter `jabeauchamp`.
- Brand: black `#141414`, Carnegie Red `#C41230`, existing OLL logo (`research/raw/assets/`).
- No em or en dashes in code, copy, or commits.
- Commit + push after every logical change. No Claude attribution lines.

## Layout
- `research/` source material: raw site dump, audit, benchmark, science, stack notes.
- `docs/ARCHITECTURE.md` agent architecture, phases, file ownership. Read before delegating.
- `.claude/agents/` project workers: content-steward, page-builder, viz-builder, site-auditor.
- `site/` the demo: Vite + React 19 + TS + Tailwind 4 + motion. `docs/DESIGN.md` is the design brief.

## Working mode
Main thread is the lead: owns design tokens, layout shell, integration, merges, commits.
Workers get one bounded task each and only touch the paths they own (see ARCHITECTURE.md).
