# (C) Science, PI, publications, viz concepts (2026-10-23)

Status key: [V] verified against Crossref or CMU page this session, [U] unverified.

## PI (cmu.edu/bme/People/Faculty/profile/jbeaucha.html, cmu.edu/ni/people/faculty/drew-beauchamp)
- Assistant Professor BME, joint appointment Neuroscience Institute. [V]
- PhD BME (Neural Engineering), Northwestern, mentors Julius Dewald and CJ Heckman. PhD topic:
  brainstem neuromodulatory inputs to spinal motoneurons and motor deficits in humans.
- BSE + MS BME, Arizona State. Postdoc with Doug Weber (CMU MechE), neuromodulatory stimulation for pain.
- Trainee funding: NIH NINDS F31 NS120500 (PMC9885522).
- Not found anywhere public: CMU start date, awards, Chuck Noll Foundation grant (only the live
  site states it). Ask the PI before repeating it beyond the existing sentence.

## Anchor publications (Crossref-verified, JAB = Beauchamp)
- 2025 J Physiol 603(8):2443. Intrinsic properties of spinal motoneurons degrade ankle torque control in humans. JAB 1st. 10.1113/JP287446 [V]
- 2025 J Neurophysiol. Human motor unit discharge patterns reveal differences in neuromodulatory and inhibitory drive across contraction levels. Skarabot, JAB, Pearcey. 10.1152/jn.00249.2025 [V]
- 2024 eLife 12:RP90624. Supercomputer framework for reverse engineering firing patterns of neuron populations. Chardon ... Heckman. 10.7554/eLife.90624 [V]
- 2023 J Neural Eng. A geometric approach to quantifying neuromodulatory effects of PICs on motor unit discharge. JAB 1st. 10.1088/1741-2552/acb1d7 [V]
- 2022 J Neural Eng. Continuous estimates of motor unit discharge rates and population visualization. JAB 1st. 10.1088/1741-2552/ac4594 [V]
- 2026 medRxiv. Reverse engineering of motor unit discharge in multiple sclerosis. McPherson ... 10.64898/2026.06.15.26355613 [V]

## Remaining publications (from ORCID + Scholar page 1, DOIs not yet checked) [U]
- 2026 bioRxiv, elbow flexor/extensor MU firing after cervical SCI, 10.64898/2026.06.03.729825
- 2026 J Appl Physiol 140(2):540, motoneuron discharge in resistance vs endurance trained, 10.1152/japplphysiol.00835.2025
- 2026 bioRxiv, MU discharge and menstrual cycle hormones (Jenz ... JAB), no DOI
- 2026 Neuromodulation 29(7) abstracts: SCS models across species; DRG stimulation electrode optimization
- 2025 medRxiv, voluntary motor commands in MS, 10.1101/2025.08.12.25333527
- 2025 bioRxiv, training-induced motoneuron discharge alterations, 10.1101/2025.06.02.657380
- 2025 Mult Scler Relat Disord 99:106497, heterogeneity of voluntary motor command in MS
- 2025 IEEE EMBC, descending nociceptive vs MU neuromodulation protocol (Bengtsson ... JAB)
- 2024 J Physiol 602(17):4237, co-contraction reduces PIC estimates, 10.1113/JP286539
- 2024 conf chapter, brainstem neuromodulatory inputs and chronic stroke impairment, JAB 1st
- 2024 IEEE EMBC, relationships among MU discharge parameters (McPherson, Reece, JAB, Lohse)
- 2023 medRxiv, MU rate modulation impaired in flexion synergy, chronic stroke, JAB 1st, 10.1101/2023.11.22.23298905
- 2023 J Neurophysiol 129(6):1322, PIC estimates larger in females (Jenz, JAB ...)
- 2022 bioRxiv x2: sex and PICs 10.1101/2022.10.09.511486; tendon vibration 10.1101/2022.08.02.502526
- 2019 IEEE EMBC, tonic vibration reflex in chronic stroke, 10.1109/embc.2019.8857014
- Gap: Scholar page 2 not pulled. Build the final list from Crossref/ORCID by script, not by hand.

## Viz concepts (ranked by payoff for the site)
1. **HD-sEMG grid to spike trains** (home hero). Grid of channels flickering, resolves into
   MUAP templates, then a raster. Encodes the lab's core method. Simulated, labelled. Method ref:
   DEMUSE example zenodo 10.5281/zenodo.10936952 (CC0, synthetic).
2. **Recruitment raster + smoothed rates**. Force ramp up/down, units recruit in size order,
   smoothed rate traces overlay. Source 10.1088/1741-2552/ac4594.
3. **Neuromodulation dial (delta-F / PIC hysteresis)**. Slider for serotonin/NE drive; same input
   gives steeper, more hysteretic rate curve; delta-F gap shown live. Source acb1d7, JP287446.
4. **Brace-height geometry**. Rate vs torque, drag to see deviation from linear. Source acb1d7.
5. **Reverse engineering** (spike train in, estimated excitatory/inhibitory/neuromodulatory
   inputs out). Source eLife.90624. Research page, project 1.
6. Pathology compare (healthy vs stroke vs MS). Sources 2023.11.22 + 2025.08.12 preprints.

## Open data
- DEMUSE biceps HD-sEMG, synthetic, CC0, zenodo 10936952. Safe to bundle a small slice.
- PhysioNet Hyser HD-sEMG, ODC-By 1.0, 10.13026/ym7v-bh53. Raw only, 142 GB. Not needed.
- Lab data: on request only. Ask the PI for one real anonymised spike-train file for viz 2; real
  data beats simulation for credibility.
