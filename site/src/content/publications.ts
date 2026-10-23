// Seed list, Crossref-verified 2026-10-23. content-steward regenerates this from scripts/fetch-publications.
import type { Publication } from './types'

export const PUBLICATIONS: Publication[] = [
  { year: 2026, type: 'preprint', title: 'Reverse engineering of motor unit discharge in multiple sclerosis', authors: 'McPherson, Lohse, Simon, Free, Beauchamp, Negro, et al.', venue: 'medRxiv', doi: '10.64898/2026.06.15.26355613' },
  { year: 2025, type: 'journal', title: 'Human motor unit discharge patterns reveal differences in neuromodulatory and inhibitory drive across contraction levels', authors: 'Škarabot, Beauchamp, Pearcey', venue: 'Journal of Neurophysiology', doi: '10.1152/jn.00249.2025' },
  { year: 2025, type: 'journal', title: 'Intrinsic properties of spinal motoneurons degrade ankle torque control in humans', authors: 'Beauchamp, Pearcey, Khurram, Negro, Dewald, Heckman, et al.', venue: 'The Journal of Physiology', doi: '10.1113/JP287446', firstAuthor: true },
  { year: 2024, type: 'journal', title: 'Supercomputer framework for reverse engineering firing patterns of neuron populations to identify their synaptic inputs', authors: 'Chardon, Wang, Garcia, Besler, Beauchamp, D’Mello, et al.', venue: 'eLife', doi: '10.7554/eLife.90624' },
  { year: 2023, type: 'journal', title: 'A geometric approach to quantifying the neuromodulatory effects of persistent inward currents on individual motor unit discharge patterns', authors: 'Beauchamp, Pearcey, Khurram, Chardon, Wang, Powers, Dewald, Heckman', venue: 'Journal of Neural Engineering', doi: '10.1088/1741-2552/acb1d7', firstAuthor: true },
  { year: 2022, type: 'journal', title: 'A computational approach for generating continuous estimates of motor unit discharge rates and visualizing population discharge characteristics', authors: 'Beauchamp, Khurram, Dewald, Heckman, Pearcey', venue: 'Journal of Neural Engineering', doi: '10.1088/1741-2552/ac4594', firstAuthor: true },
]
