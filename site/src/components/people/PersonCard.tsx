import type { Person } from '../../content/types'
import Monogram from './Monogram'

const hoverOnly = '[@media(hover:hover)]'

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
            className={`h-full w-full object-cover transition duration-700 ease-out-expo ${hoverOnly}:grayscale ${hoverOnly}:group-hover:scale-105 ${hoverOnly}:group-hover:grayscale-0 ${hoverOnly}:group-focus-visible:scale-105 ${hoverOnly}:group-focus-visible:grayscale-0`}
          />
        ) : (
          <Monogram name={person.name} />
        )}
      </div>
      <figcaption className="mt-4">
        <p className="text-lg font-medium tracking-tight">{person.name}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-iron">{person.role}</p>
        {person.likes && (
          <p className={`mt-3 font-serif text-sm leading-snug text-iron transition duration-500 ${hoverOnly}:opacity-0 ${hoverOnly}:group-hover:opacity-100 ${hoverOnly}:group-focus-visible:opacity-100`}>
            {person.likes}
          </p>
        )}
      </figcaption>
    </figure>
  )
}
