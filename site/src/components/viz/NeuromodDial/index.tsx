import type { NeuromodDialProps } from '../types'

// STUB: replaced by viz-builder. Keep the default export and props contract.
export default function NeuromodDial({ className }: NeuromodDialProps) {
  return (
    <div className={`grid place-items-center border border-dashed border-iron/40 font-mono text-xs text-iron ${className ?? ''}`}>
      NeuromodDial
    </div>
  )
}
