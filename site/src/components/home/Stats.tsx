import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Container, Reveal } from '../ui/Reveal'
import { MEMBERS, PHD, PROJECTS } from '../../content/lab'
import { PUBLICATIONS } from '../../content/publications'

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? to : 0)
  useEffect(() => {
    if (!inView) return
    if (reduced) return setN(to)
    const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduced, to])
  return <span ref={ref}>{n}</span>
}

const STATS = [
  { n: PROJECTS.length, label: 'Research projects' },
  { n: MEMBERS.length + 1, label: 'Lab members' },
  { n: PHD.programs.length, label: 'PhD programs recruiting' },
  { n: PUBLICATIONS.length, label: 'Publications' },
  { n: 64, label: 'Channels per HD-sEMG grid (method)' },
]

export default function Stats() {
  return (
    <section className="bg-ink py-20 text-paper sm:py-28" aria-label="Lab in numbers">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="border-t border-paper/20 pt-4">
                <dd className="font-mono text-5xl font-medium tracking-tight text-red-bright sm:text-6xl">
                  <Count to={s.n} />
                </dd>
                <dt className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-paper/60">{s.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
