import type { Person } from '../../content/types'
import Monogram from './Monogram'


export default function PersonCard({ person }: { person: Person }) {
  return (
    <figure tabIndex={0} className="group outline-offset-4 transition-transform duration-500 ease-out-expo hover:-translate-y-1 focus-visible:-translate-y-1">
      <div className="aspect-[4/5] overflow-hidden bg-ink">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            style={{ objectPosition: person.photoPos }}
            className="h-full w-full object-cover"
          />
        ) : (
          <Monogram name={person.name} />
        )}
      </div>
      <figcaption className="mt-4">
        <p className="text-lg font-medium tracking-tight">{person.name}</p>
        <p className="mt-1 font-semibold text-xs uppercase tracking-[0.12em] text-iron">{person.role}</p>
        {person.likes && (
          <p className="mt-3 font-serif text-sm leading-snug text-iron">
            {person.likes}
          </p>
        )}
      </figcaption>
    </figure>
  )
}
