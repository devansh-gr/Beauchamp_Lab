import type { Person } from '../../content/types'
import { Container } from '../ui/Reveal'
import PersonCard from './PersonCard'

export default function PeopleGrid({ title, people }: { title: string; people: Person[] }) {
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-h`
  return (
    <section className="border-t border-steel py-12" aria-labelledby={headingId}>
      <Container>
        <h2 id={headingId} className="text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {people.map((p) => (
            <li key={p.slug}>
              <PersonCard person={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
