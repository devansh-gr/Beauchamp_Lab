// Contracts between pages and visualizations. Pages depend only on these props.
export interface VizProps {
  className?: string
}

/** 3D anatomy over an upper body skeleton, camera moves per step: 0 brain, 1 brainstem/spinal cord, 2 muscle + HD-sEMG. Dark background. */
export interface PathwayStoryProps extends VizProps {
  step: 0 | 1 | 2
}
