# (C) Redesign architecture: agents, phases, ownership

## Design thesis
The lab reads the brain from its output: motoneuron spike trains. The site does the same.
Home hero = an HD-sEMG grid that decomposes into a live motor unit raster. Every page has one
science visual. Black #141414 + Carnegie Red #C41230 + white, Source Serif for prose, Open Sans
for UI, a mono for data labels. Research question as the h1, not the lab name.

## Sitemap (real URLs, Astro static)
`/` hero viz, thesis, 4 project cards, stats band, latest news, join CTA
`/research` + `/research/<slug>` 4 projects, each with its viz and its papers
`/people` PI, members, collaborators, alumni (photos, no blank fields)
`/publications` generated from DOI list via Crossref, filter by type/year, copy-cite
`/join` mentorship, MS tracks, PhD programs, postdoc
`/news` typed feed (paper, talk, grant, member); replaces "Coming soon"
`/contact` Formspree mjgnvdzg

## Agent topology (orchestrator-worker)
Lead = main thread. Workers = `.claude/agents/*` plus global `reviewer`, `verifier`, `researcher`.

| Agent | Model | Owns (only writes here) | Parallel? |
|---|---|---|---|
| lead (main) | inherit | `site/astro.config.*`, `site/src/layouts/`, `site/src/styles/`, shared `components/ui/`, merges | n/a |
| content-steward | sonnet | `site/src/content/**`, `site/public/people/**` | 1 at a time |
| page-builder | sonnet | one `site/src/pages/<page>` + `components/<page>/` | yes, 1 per page, worktree |
| viz-builder | opus | `site/src/components/viz/<Name>/` + `pages/lab/<name>.astro` | yes, 1 per viz, worktree |
| site-auditor | sonnet | read-only | after each merge |
| reviewer (global) | opus | read-only | per worker branch before merge |
| verifier (global) | sonnet | read-only | final content check before PI demo |

Conflict rule: ownership paths never overlap. A worker that needs a shared file stops and
reports; the lead makes that change on main and workers rebase.

## Phases
| # | Phase | Who | Runs in parallel | Verify |
|---|---|---|---|---|
| 0 | Research | 3x researcher | yes | `research/00-03` written, DOIs Crossref-checked |
| 1 | Foundation: Astro 7.4.2 scaffold, tokens, fonts, layout shell, content schemas | lead | no (blocks all) | `npm run build` green, schemas compile |
| 2 | Content migration + publications script | content-steward | with phase 3 | every field sourced, `astro check` clean |
| 3 | Viz: HD-sEMG hero, recruitment raster, neuromod dial, reverse-engineering | 4x viz-builder | yes, 4 worktrees | each `/lab/<viz>` renders, <40 KB, reduced-motion ok |
| 4 | Pages: home, research, people, publications, join, news, contact | 7x page-builder | yes, after 2 | per-page build green |
| 5 | Review + merge | reviewer per branch, lead merges | reviews parallel | no findings open |
| 6 | Audit | site-auditor | no | Lighthouse >=95 x4, 0 axe, 0 broken links, home <300 KB |
| 7 | PI demo | lead + verifier | no | preview URL, PI sign-off, then PR to JABeauchamp/BeauchampLab |

Critical path: 1 -> 2 -> 4 -> 5 -> 6 -> 7. Viz (3) runs beside 2 and must land before 4's home page.

## Open questions for Prof Beauchamp (batch into one message)
1. OK to redesign, and deploy via PR to JABeauchamp/BeauchampLab (Astro build via Actions)?
2. Chuck Noll Foundation funding: confirm wording; any other grants to list?
3. One anonymised real spike-train file for the raster viz? Real beats simulated.
4. Missing photos + "Likes" for Kate Mould and Anabelle Creveling; alumni list.
5. News items to seed the feed (papers, talks, new members since lab start).
