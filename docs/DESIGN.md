# (C) Design brief: Output Layer Lab demo

Every builder reads this first. Sources for each technique: `research/04-engagement.md`.

## Thesis
The lab reads the nervous system from its output: motoneuron spike trains. The site shows that
signal everywhere. Data is the decoration. No stock neurons, no spinning brains.

## System (tokens live in `site/src/index.css`, never hardcode colors)
- Rhythm: alternate `bg-ink` (dark, immersive, viz) and `bg-paper` (warm light, reading) sections.
  Neuralink alternation pattern.
- Red: `red` (#C41230) for fills, buttons, highlights on light. On dark use `red-bright`
  (#EF3A47) for text (contrast). Red = signal: spikes, active state, CTA. Never decoration.
- Type: `font-sans` Inter for display and UI, tight tracking (`text-display` for h1).
  `font-serif` Source Serif for long prose. `font-mono` JetBrains Mono for labels, dates, venues,
  numbers, axis ticks (Arc Institute pattern).
- Eyebrow labels: `<Eyebrow>` mono uppercase, numbered sections "01 / Research".
- Layout: `<Container>` max-w-7xl, 16px gutter on mobile. Generous vertical space (py-24 to py-40).
- Motion: `motion/react` only. `<Reveal>` for fade-rise on enter. Animate transform and opacity
  only. Sticky + `useScroll` for scroll stories, never scrolljacking. `MotionConfig
  reducedMotion="user"` is already global.
- Hover: cards lift 2-4px, image goes grayscale to color, arrow nudges right. Every hover state
  has a visible non-hover equivalent (touch).
- Shared pieces: `components/ui/Reveal.tsx` (Reveal, Eyebrow, Container, PageHeader),
  `lib/useCanvasLoop.ts` (canvas loop, DPR, offscreen pause, reduced motion, `token()`).

## Engagement techniques we ship (ranked)
1. Live HD-sEMG to spike-raster hero (EmgHero). Nobody in the field does this.
2. Outcome headline lower-left over dark field, one CTA, scroll cue. Rotating last word
   (typewriter: movement / stroke / arousal / attention), Neuralink "restore vis_" pattern.
3. Sticky scroll story "From brain to muscle" (PathwayStory), 4 text steps drive the step prop.
4. Interactive explorers on Research: drag force ramp (RecruitmentRaster), monoamine slider (NeuromodDial).
5. Stat band, count-up on enter, REAL numbers only (from content: projects, members, PhD programs,
   publications count, 64 channels per grid is method fact, label as such).
6. Publication feed, Arc pattern: mono date + venue, type chip, title, authors, DOI arrow link.
7. People cards: grayscale to color on hover, likes line revealed; no blank fields.
8. Dark/light alternation, red only as signal.

## Do not
- Scrolljack, parallax on text, custom cursors, autoplay sound, count-ups on vague numbers.
- Invent facts. All text comes from `site/src/content/*`. Missing data stays missing.
- Em or en dashes anywhere.

## Page specs
**Home** `/`: (1) full-viewport `bg-ink` hero, EmgHero fills background, h1 "Reading the nervous
system from its output." + rotating line "to understand [movement/stroke/arousal/attention]",
LAB.hero as subcopy (trim allowed to its first sentence), CTAs View research + Meet the team,
scroll cue. (2) paper section: overview statement in large serif, 3 focus areas as numbered
columns. (3) ink section: PathwayStory sticky left, 4 text steps right, step from scroll.
(4) paper: 4 project cards (num, title, short, arrow) linking `/research#slug`. (5) stat band.
(6) latest 3 publications feed, link to /publications. (7) red join CTA band.
**Research** `/research`: PageHeader with LAB.overview, then each project as a full section
(alternating ink/paper): big mono number, title, body in serif, subs as indented cards, and its
viz from `project.viz` (lazy). Anchor ids = slug. Sticky side index of 4 projects on desktop.
**People** `/people`: PI feature block (photo, title, dept, bio list, link pills), member grid,
collaborators. Monogram tile (initials on ink with a red spike line) when no photo.
**Publications** `/publications`: filter chips (All, Journal, Preprint, Conference) + year
groups, mono year rail, copy-citation button (clipboard), DOI link, first-author marker.
**News** `/news`: typed feed with chips, date rail, links out. Honest empty-state copy for
"more coming as the lab grows" is NOT allowed; just show what exists.
**Join** `/join`: hero "Build the window into the nervous system." Mentorship as a large serif
quote block, 3 MS tracks as cards, PhD programs as link cards, postdoc card, CTA to contact.
**Contact** `/contact`: split layout, left email + CMU address-free copy, right form posting
JSON to LAB.formspree (name, email, message), states: idle, sending, sent, error.
