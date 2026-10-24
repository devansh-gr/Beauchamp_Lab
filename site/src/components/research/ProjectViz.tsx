import { Suspense, useState } from 'react'
import { NeuromodDial, PathwayStory, RecruitmentRaster } from '../viz'
import type { Project } from '../../content/types'
import { Link } from 'react-router'
import { linkCls } from '../ui/Reveal'

const STEPS = [
  {
    title: 'Brain',
    body: 'Movement starts as a command from the motor cortex. Brainstem systems add neuromodulatory drive, including norepinephrine from the locus coeruleus.',
    link: { to: '/research#arousal-and-attention', label: 'Arousal and attentional state' },
  },
  {
    title: 'Spinal cord',
    body: 'Descending commands converge on spinal motoneurons, the final common pathway for all motor intent. Each motoneuron combines its synaptic inputs with intrinsic properties that neuromodulators tune.',
    link: { to: '/research#injury-and-disease', label: 'Injury and disease' },
  },
  {
    title: 'Muscle',
    body: 'Motoneuron firing drives the muscle. A high-density surface EMG grid on the biceps estimates that firing noninvasively, and we invert it to recover the inputs the motoneuron received.',
    link: { to: '/research#latent-inputs', label: 'Estimating latent inputs' },
  },
] as const

/** 3D anatomy figure with the pathway stages listed beside it. */
export function PathwayFigure() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const go = (i: number) => setStep(Math.max(0, Math.min(2, i)) as 0 | 1 | 2)
  return (
    <figure>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="bg-ink">
          <Suspense fallback={<div className="h-[480px]" />}>
            <PathwayStory step={step} className="h-[480px] w-full" />
          </Suspense>
        </div>
        <div className="flex flex-col">
          <ol aria-label="Pathway stages" className="divide-y divide-steel border-y border-steel">
            {STEPS.map((s, i) => {
              const active = step === i
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => go(i)}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                  >
                    <span className={`text-sm font-bold ${active ? 'text-red' : 'text-iron'}`}>0{i + 1}</span>
                    <span className={`font-serif text-xl font-semibold ${active ? 'text-red' : 'text-ink-2 hover:text-red'}`}>
                      {s.title}
                    </span>
                  </button>
                  {active && (
                    <div className="pb-5 pl-9">
                      <p className="font-serif leading-relaxed text-body">{s.body}</p>
                      <Link to={s.link.to} className={`mt-2 inline-block font-serif ${linkCls}`}>
                        {s.link.label}
                      </Link>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
          <button
            type="button"
            onClick={() => go(step === 2 ? 0 : step + 1)}
            className="mt-5 self-start font-serif text-red hover:underline"
          >
            {step === 2 ? 'Start over' : `Next: ${STEPS[step + 1].title}`} &rarr;
          </button>
        </div>
      </div>
      <figcaption className="mt-3 max-w-3xl font-serif text-sm leading-relaxed text-body">
        The motor pathway: brain, brainstem and spinal cord, and the biceps brachii with an 8 x 8 high-density surface EMG
        grid.
      </figcaption>
    </figure>
  )
}

export function ProjectViz({ viz }: { viz: Project['viz'] }) {
  if (!viz) return null
  const cls = 'h-[460px] w-full'
  return (
    <Suspense fallback={<div className={cls} aria-hidden />}>
      <div className="border border-steel p-4 sm:p-6">
        {viz === 'RecruitmentRaster' && (
          <>
            <RecruitmentRaster className={cls} />
            <p className="mt-4 font-serif text-sm leading-relaxed text-body">
              Simulated motor unit activity during a force ramp. Top, force as a percent of maximum voluntary contraction.
              Middle, firing times of 15 motor units ordered by recruitment threshold. Bottom, smoothed firing rates.
            </p>
          </>
        )}
        {viz === 'NeuromodDial' && <NeuromodDial className={cls} />}
      </div>
    </Suspense>
  )
}
