# (C) Current site audit: beauchamplab.org (2026-10-23)

## What it is
- Single 2.3 MB HTML file. Custom "dc-runtime" bundler (Claude design export), React 18.3.1 UMD,
  all fonts and 3 images inlined as base64. Template in `raw/template.html`, logic and all
  content in `raw/dc_script.js`, CSS in `raw/styles.css`.
- Title: "Beauchamp Lab, The Output Layer Lab | CMU Neurotechnology & Neuromotor Systems".
- Pages are React state, not URLs: home, people, projects (Research), positions, updates, contact.
- Contact form posts to Formspree `mjgnvdzg`. Analytics: GoatCounter `jabeauchamp`.
- Member photos served separately at `/assets/<slug>.jpg` (andy-vo, vicky-yang, ben-kadison,
  prakarsh-yadav). Downloaded to `raw/assets/`.

## Content inventory (source: `raw/dc_script.js`)
- Tagline: "Neuromotor systems and technology". Hero: motoneurons as "the output layer".
- Focus areas (3): neuromotor control in health/disease/injury; assistive and rehab tech;
  noninvasive indexing of arousal and attentional state. Descriptions are empty strings.
- PI: James (Drew) Beauchamp, PhD, Assistant Professor, BME + Neuroscience Institute.
  Links: LinkedIn, Scholar `zmPty2AAAAAJ`, ORCID 0000-0003-2288-8672, NI, CMU BME, email.
- Members (5): Andy Vo (BME PhD), Kate Mould (BME MS), Anabelle Creveling (MINT MS),
  Vicky Yang (MINT MS), Ben Kadison (UG). Collaborator: Prakarsh Yadav (PhD student).
- Research projects (4): 1 latent inputs to motor output; 2 injury/disease (2.1 stroke + VNS,
  2.2 TBI + LC-NE, Chuck Noll Foundation); 3 arousal/attention indexing; 4 internal state.
- Positions: mentorship strategy, MS areas (3), PhD programs (BME, PSN, PNC), postdoc.
- Updates: "Coming soon" x2.

## Problems, ranked
1. Science is invisible. A lab whose whole thesis is a signal (motoneuron spike trains from
   HDsEMG) shows zero data, figures, or motion. Logo waveform is the only science visual.
2. No publications page. Biggest credibility gap for recruits and reviewers.
3. JS-only render, no per-page URLs, sitemap lists 1 URL. Crawlers and link previews see
   "Unpacking...". Cannot deep link to Research or Open Positions.
4. 2.3 MB first load before any text paints, all for a text site.
5. Empty states in public: Updates "Coming soon" x2, members with "Likes:" blank, 2 of 5
   members without photos, focus-area descriptions empty.
6. Content is hardcoded in JS. PI cannot edit without a dev.

## Assets
- `raw/assets/56d6...png` 870x870 app-icon logo (motoneuron + spike, red on black).
- `raw/assets/5af0...png` 2105x505 full wordmark "The Output Layer Lab, Neuromotor Systems & Technology".
- `raw/assets/f72b...jpg` 1947x2268 PI headshot.
