# (C) Engagement deep dive (2026-10-23)

Method: rendered screenshots + JS probes in Chrome (Neuralink, Arc, Precision, ONWARD) plus a
researcher pass over 12 sites and third-party design breakdowns. Motion libraries verified
only where the probe found them.

## Observed directly (Chrome)
- **neuralink.com**: full-bleed muted video hero, dark overlay, h1 48px lower-left "From neural
  signals to life-changing impact", one pill CTA. Next section: typewriter h1 cycling the last
  word ("restore vis_"). Then warm paper-texture section "Meet our pioneers" with patient
  video cards. One typeface (Untitled Sans). Lenis smooth scroll detected. 6 videos, 0 canvas.
- **arcinstitute.org**: serif headline (Tiempos) + IBM Plex Sans body, particle-dot DNA helix
  beside the intro. Research feed: mono date + journal, lab tag chips, figure thumbnail,
  title, abstract, "Read" arrow. Static, no animation library.
- **precisionneuro.io**: dot-matrix logo loader, then rounded inset hero card with giant
  background type "Layer 7" over product photo, frosted pill nav. Grotesk + mono pairing.
  7 videos.
- **onwd.com**: two-tone headline "Empowered by **Movement**" (accent color on last word),
  patient photo hero, 14 sections incl stats, journal-cover publication cards.

## Researcher findings (sources in agent report, summarized)
- Neurotech companies lead with a human, then tech: Synchron, Paradromics, ONWARD, Blackrock.
- 3 to 4 hard numbers in a stat row: Paradromics, ONWARD, Blackrock.
- Only Gallant Lab puts a live interactive science object on a lab homepage. Gap to own.
- Scrollytelling: sticky graphic + text steps via IntersectionObserver; scrolljacking is bad
  practice (pudding.cool/process/how-to-implement-scrollytelling).
- Reduced motion: remove or swap for fades (MDN prefers-reduced-motion). NN/g: motion must
  serve a goal, parallax hurts readability.

## Ranked techniques -> see docs/DESIGN.md "Engagement techniques we ship".

## Cheap tells to avoid
Scrolljacking, decorative parallax, stock neuron/3D brain art, vague count-ups, hover-only
content, text-only heroes (Janelia).

## Stack decision (researcher, versions from npm registry 2026-10-23)
Vite 8.3 + React 19.3 + TS + react-router 8.5 (BrowserRouter, 404.html fallback on GitHub
Pages) + Tailwind 4.3 + motion 14.6. No GSAP or Lenis: sticky CSS + motion useScroll covers
pinning without scroll hijack. Canvas 2D for EMG grid and raster, SVG for curves.
Fonts via @fontsource-variable: Inter, Source Serif 4, JetBrains Mono.
