import { Suspense, useEffect, useRef, useState } from 'react'
import { PathwayStory } from '../viz'
import { Container, Eyebrow, Reveal } from '../ui/Reveal'
import { LAB, PROJECTS } from '../../content/lab'

const sentences = (s: string) => s.split(/(?<=\.)\s+/)
const ov = sentences(LAB.overview)
const p1 = sentences(PROJECTS[0].body)

const STEPS = [
  { label: 'Brain', text: ov[0] },
  { label: 'Spinal cord', text: ov[1] },
  { label: 'Muscle', text: `${p1[0]} ${p1[1]}` },
]

export default function Story() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const io = new IntersectionObserver(([e]) => root.classList.toggle('story-snap', e.isIntersecting), {
      rootMargin: '-40% 0px -40% 0px',
    })
    io.observe(section.current!)
    return () => {
      io.disconnect()
      root.classList.remove('story-snap')
    }
  }, [])

  // Mouse wheel and trackpad: while the story fills the screen, one gesture moves to the next
  // step. Past the first or last step the page scrolls normally. Touch uses the CSS snap.
  useEffect(() => {
    let lastWheel = 0
    let stepping = false
    const onWheel = (e: WheelEvent) => {
      const now = performance.now()
      const sameGesture = now - lastWheel < 150
      lastWheel = now
      // Rest of a stepping gesture, including trackpad inertia.
      if (sameGesture) {
        if (stepping) e.preventDefault()
        return
      }
      stepping = false
      const r = section.current!.getBoundingClientRect()
      if (r.top > 1 || r.bottom < innerHeight - 1 || e.deltaY === 0) return
      const dir = Math.sign(e.deltaY)
      const mid = innerHeight / 2
      let target: HTMLLIElement | null = null
      let best = Infinity
      for (const el of refs.current) {
        if (!el) continue
        const b = el.getBoundingClientRect()
        const d = (b.top + b.height / 2 - mid) * dir
        if (d > 10 && d < best) [best, target] = [d, el]
      }
      if (!target) return
      stepping = true
      e.preventDefault()
      target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    addEventListener('wheel', onWheel, { passive: false })
    return () => removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.i) as 0 | 1 | 2)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={section} className="bg-ink text-paper" aria-labelledby="story-h">
      <Container className="snap-start pt-24 sm:pt-32">
        <Reveal>
          <Eyebrow className="text-red-bright">03 / From brain to muscle</Eyebrow>
          <h2 id="story-h" className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Every command ends at the motoneuron.
          </h2>
        </Reveal>
      </Container>
      <Container className="grid lg:grid-cols-2 lg:gap-16">
        <div className="sticky top-16 z-10 -mx-4 h-[42vh] bg-ink sm:-mx-8 lg:top-0 lg:mx-0 lg:h-svh">
          <div className="relative h-full w-full">
            <Suspense fallback={null}>
              <PathwayStory step={step} className="absolute inset-0 h-full w-full" />
            </Suspense>
            <p className="absolute bottom-3 left-4 font-semibold text-xs uppercase tracking-[0.18em] text-red-bright sm:left-8 lg:bottom-10 lg:left-0">
              {`0${step + 1}`} / {STEPS[step].label}
            </p>
          </div>
        </div>
        <ol className="pb-24 lg:pb-40">
          {STEPS.map((s, i) => (
            <li
              key={s.label}
              data-i={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              className={`flex min-h-[70vh] snap-end snap-always flex-col justify-end pb-[8vh] transition-opacity lg:snap-center duration-500 lg:min-h-svh lg:justify-center lg:pb-0 ${
                step === i ? 'opacity-100' : 'opacity-35'
              }`}
            >
              <p className="font-semibold text-sm text-red-bright">{`0${i + 1}`}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-paper/50">{s.label}</p>
              <p className="mt-4 font-serif text-xl leading-snug sm:text-3xl lg:mt-6">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
      <Container className="pb-12">
        <p className="max-w-3xl text-xs leading-relaxed text-paper/50">
          Anatomy from BodyParts3D, The Database Center for Life Science (CC BY-SA 2.1 JP). Spinal cord path, motor axon
          and electrode grid are schematic.
        </p>
      </Container>
      {/* Snap exit: lands with the story just scrolled off screen, which turns snapping off. */}
      <div className="snap-start" aria-hidden="true" />
    </section>
  )
}
