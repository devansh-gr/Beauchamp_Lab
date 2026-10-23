import type { Person } from '../../content/types'
import { Container, Eyebrow, Reveal } from '../ui/Reveal'
import PersonCard from './PersonCard'

export default function PeopleGrid({ eyebrow, title, people, tone }: { eyebrow: string; title: string; people: Person[]; tone: 'paper' | 'paper-2' }) {
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-h`
  return (
    <section className={`${tone === 'paper' ? 'bg-paper' : 'bg-paper-2'} py-24 sm:py-32`} aria-labelledby={headingId}>
      <Container>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={headingId} className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {people.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={Math.min(i, 5) * 0.08}>
                <PersonCard person={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
