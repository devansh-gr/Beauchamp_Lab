import { Suspense, useState } from 'react'
import { NeuromodDial, PathwayStory, RecruitmentRaster } from '../viz'
import type { Project } from '../../content/types'

const STEPS = ['Brain', 'Spinal cord', 'Motoneuron', 'Muscle'] as const

function Pathway() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Pathway step">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={step === i}
            onClick={() => setStep(i as 0 | 1 | 2 | 3)}
            className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
              step === i ? 'border-red-bright bg-red text-paper' : 'border-paper/30 text-paper/70 hover:border-paper'
            }`}
          >
            {i + 1} {label}
          </button>
        ))}
      </div>
      <PathwayStory step={step} className="h-[460px] w-full" />
    </div>
  )
}

export function ProjectViz({ viz }: { viz: Project['viz'] }) {
  if (!viz || viz === 'EmgHero') return null
  const cls = 'h-[460px] w-full'
  return (
    <Suspense fallback={<div className={`${cls} animate-pulse bg-current opacity-5`} aria-hidden />}>
      {viz === 'RecruitmentRaster' && <RecruitmentRaster className={cls} />}
      {viz === 'NeuromodDial' && (
        <div className="bg-paper p-4 text-ink-2 sm:p-6">
          <NeuromodDial className={cls} />
        </div>
      )}
      {viz === 'PathwayStory' && <Pathway />}
    </Suspense>
  )
}
