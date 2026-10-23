import type { PathwayStoryProps } from '../types'

// STUB: replaced by viz-builder. Keep the default export and props contract.
export default function PathwayStory({ className, step }: PathwayStoryProps) {
  return (
    <div className={`grid place-items-center border border-dashed border-iron/40 font-mono text-xs text-iron ${className ?? ''}`}>
      PathwayStory step {step}
    </div>
  )
}
