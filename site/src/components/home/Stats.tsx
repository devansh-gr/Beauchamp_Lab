import { Container } from '../ui/Reveal'
import { MEMBERS, PHD, PROJECTS } from '../../content/lab'
import { PUBLICATIONS } from '../../content/publications'

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
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end border-t border-paper/20 pt-4">
              <dt className="mt-3 font-semibold text-xs uppercase tracking-[0.14em] text-paper/70">{s.label}</dt>
              <dd className="text-5xl font-bold tracking-tight text-red-bright sm:text-6xl">
                {s.n}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
