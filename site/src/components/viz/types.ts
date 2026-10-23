// Contracts between pages and visualizations. Pages depend only on these props.
export interface VizProps {
  className?: string
}

/** Interactive force ramp: units recruit in size order, raster plus smoothed rates. Light background. */
export type RecruitmentRasterProps = VizProps

/** Slider for monoaminergic drive; input-output curve with PIC hysteresis and delta-F. Light background. */
export type NeuromodDialProps = VizProps

/** 3D anatomy, camera moves per step: 0 brain, 1 brainstem/spinal cord, 2 motoneuron, 3 muscle + HD-sEMG. Dark background. */
export interface PathwayStoryProps extends VizProps {
  step: 0 | 1 | 2 | 3
}
