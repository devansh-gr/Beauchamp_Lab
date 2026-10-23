import type { Person } from '../../content/types'
import Monogram from './Monogram'

export default function PersonCard({ person }: { person: Person }) {
  return (
    <figure>
      <div className="aspect-[4/5] overflow-hidden bg-paper-2">
        {person.photo ? (
          <img src={person.photo} alt={person.name} loading="lazy" style={{ objectPosition: person.photoPos }} className="h-full w-full object-cover" />
        ) : (
          <Monogram name={person.name} />
        )}
      </div>
      <figcaption className="mt-3">
        <p className="font-bold">{person.name}</p>
        <p className="text-sm text-body">{person.role}</p>
        {person.likes && <p className="mt-2 font-serif text-sm leading-snug text-body">{person.likes}</p>}
      </figcaption>
    </figure>
  )
}
