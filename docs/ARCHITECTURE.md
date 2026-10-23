# (C) Redesign architecture: agents, phases, ownership

Design brief: `docs/DESIGN.md`. Research: `research/00-04`.

## Stack
Vite 8 + React 19 + TypeScript + react-router 8 (BrowserRouter, `dist/404.html` SPA fallback for
GitHub Pages) + Tailwind 4 (`@theme` tokens) + motion 14. Canvas 2D / SVG for science viz.
"Backend" = build-time data pipeline: `site/scripts/fetch-publications.mjs` pulls ORCID +
Crossref into `site/src/content/publications.json`. Contact form posts to Formspree. No runtime
server: the target host (GitHub Pages) is static.

## Code layout (ownership)
| Path | Owner |
|---|---|
| `site/src/App.tsx`, `layouts/`, `components/ui/`, `lib/`, `index.css`, `package.json`, `viz/types.ts`, `viz/index.ts` | lead (main thread) |
| `site/src/content/**`, `site/scripts/**`, `site/public/people/**` | content-steward |
| `site/src/components/viz/<Name>/**` | viz-builder (one per viz) |
| `site/src/pages/<Page>.tsx` + `site/src/components/<page>/**` | page-builder (one per page) |

Contracts that let everything run in parallel:
- `viz/types.ts`: props per viz. Pages code against it while viz are still stubs.
- `content/types.ts`: data shapes. Pages render any length, optional fields omitted.
- Tokens in `index.css`. Nobody adds colors or fonts.

## Agent topology (orchestrator-worker)
Lead = main thread. Workers defined in `.claude/agents/`; global `reviewer`, `verifier`,
`researcher` reused.

| Agent | Model | Count | Isolation |
|---|---|---|---|
| researcher | sonnet | 5 (done) | none |
| viz-builder | opus | 4: EmgHero, RecruitmentRaster, NeuromodDial, PathwayStory | git worktree per branch |
| page-builder | sonnet | 7: Home, Research, People, Publications, News, Join, Contact | git worktree per branch |
| content-steward | sonnet | 1: publications pipeline | git worktree |
| reviewer | opus | per merged batch | read-only |
| site-auditor | sonnet | after merge | read-only |

Worktrees live in `../BLR-wt/<branch>`, created by the lead with deps installed. Workers commit
to their branch, never push. Lead merges in order: content -> viz -> pages, runs build after
each, then deletes the worktree.

## Phases
| # | Phase | Parallel | Verify |
|---|---|---|---|
| 0 | Research (5 researchers + Chrome pass) | yes | research/00-04 |
| 1 | Foundation: shell, tokens, content, contracts, stubs | lead only | build green |
| 2 | 12 workers: 4 viz + 7 pages + 1 content | yes | each branch builds |
| 3 | Merge + integrate | lead | build green, visual pass in Chrome |
| 4 | Review + audit | reviewer, site-auditor | no open findings, Lighthouse >= 90 |
| 5 | Demo to Prof Beauchamp | lead | preview link, then PR to JABeauchamp/BeauchampLab on his OK |
