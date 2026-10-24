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

/** 3D anatomy figure with a stepped pipeline panel beside it. */
export function PathwayFigure() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const go = (i: number) => setStep(Math.max(0, Math.min(2, i)) as 0 | 1 | 2)
  return (
    <figure>
      <div className="grid border border-steel lg:grid-cols-[1fr_22rem]">
        <div className="bg-ink">
          <Suspense fallback={<div className="h-[480px]" />}>
            <PathwayStory step={step} className="h-[480px] w-full" />
          </Suspense>
        </div>
        <div className="flex flex-col border-t border-steel bg-paper lg:border-l lg:border-t-0">
          <p className="px-6 pt-5 text-xs font-bold uppercase tracking-[0.12em] text-iron">
            Follow the signal, step {step + 1} of 3
          </p>
          <ol className="mt-3 flex-1" aria-label="Pathway stages">
            {STEPS.map((s, i) => {
              const active = step === i
              return (
                <li key={s.title} className={`border-l-2 ${active ? 'border-red bg-paper-2' : 'border-transparent'}`}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => go(i)}
                    className="group flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-paper-2"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        active ? 'border-red bg-red text-white' : 'border-iron text-iron group-hover:border-red group-hover:text-red'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`font-serif text-lg font-semibold ${active ? 'text-ink' : 'text-ink-2 group-hover:text-red'}`}>
                      {s.title}
                    </span>
                    {!active && <span aria-hidden className="ml-auto text-iron group-hover:text-red">&rsaquo;</span>}
                  </button>
                  {active && (
                    <div className="px-6 pb-4 pl-15">
                      <p className="font-serif text-[0.95rem] leading-relaxed text-body">{s.body}</p>
                      <Link to={s.link.to} className={`mt-2 inline-block font-serif text-sm ${linkCls}`}>
                        {s.link.label}
                      </Link>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
          <div className="flex items-center justify-between gap-3 border-t border-steel px-6 py-4">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="text-sm font-semibold text-ink-2 hover:text-red disabled:invisible"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => go(step === 2 ? 0 : step + 1)}
              className="border border-red px-4 py-2 text-sm font-semibold text-red transition-colors hover:bg-red hover:text-white"
            >
              {step === 2 ? 'Start over' : `Next: ${STEPS[step + 1].title}`} &rarr;
            </button>
          </div>
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
