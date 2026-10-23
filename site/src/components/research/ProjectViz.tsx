import { Suspense, useState } from 'react'
import { NeuromodDial, PathwayStory, RecruitmentRaster } from '../viz'
import type { Project } from '../../content/types'

const STEPS = ['Brain', 'Spinal cord', 'Muscle'] as const

/** 3D anatomy figure with a plain step selector and caption. */
export function PathwayFigure() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  return (
    <figure>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Pathway step">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={step === i}
            onClick={() => setStep(i as 0 | 1 | 2)}
            className={`border px-4 py-2 text-sm font-semibold ${
              step === i ? 'border-red bg-red text-white' : 'border-steel text-ink-2 hover:border-iron'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 bg-ink">
        <Suspense fallback={<div className="h-[480px]" />}>
          <PathwayStory step={step} className="h-[480px] w-full" />
        </Suspense>
      </div>
      <figcaption className="mt-3 max-w-3xl font-serif text-sm leading-relaxed text-body">
        The motor pathway: brain, brainstem and spinal cord, and the biceps brachii with an 8 x 8 high-density surface EMG
        grid. Anatomy from BodyParts3D, The Database Center for Life Science (CC BY-SA 2.1 JP). Spinal cord path, motor
        axon and electrode grid are schematic.
      </figcaption>
    </figure>
  )
}

export function ProjectViz({ viz }: { viz: Project['viz'] }) {
  if (!viz) return null
  const cls = 'h-[460px] w-full'
  if (viz === 'PathwayStory') return <PathwayFigure />
  return (
    <Suspense fallback={<div className={cls} aria-hidden />}>
      <div className="border border-steel p-4 sm:p-6">
        {viz === 'RecruitmentRaster' && <RecruitmentRaster className={cls} />}
        {viz === 'NeuromodDial' && <NeuromodDial className={cls} />}
      </div>
    </Suspense>
  )
}
