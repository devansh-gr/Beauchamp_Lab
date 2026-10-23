import type { Publication } from '../../content/types'

const doiHref = (doi: string) => (doi.startsWith('http') ? doi : `https://doi.org/${doi}`)

/** Authors (year). Title. Venue. DOI, with the PI's name in bold. */
export function Citation({ pub }: { pub: Publication }) {
  const authors = pub.authors.split(/(Beauchamp)/)
  return (
    <p className="font-serif leading-relaxed text-body">
      {authors.map((a, i) => (a === 'Beauchamp' ? <strong key={i} className="font-semibold text-ink-2">{a}</strong> : a))} ({pub.year}).{' '}
      <span className="text-ink-2">{pub.title}</span>. <em>{pub.venue}</em>.
      {pub.doi && (
        <>
          {' '}
          <a href={doiHref(pub.doi)} target="_blank" rel="noreferrer" className="text-red underline decoration-red/40 underline-offset-4 hover:decoration-red">
            doi
          </a>
        </>
      )}
    </p>
  )
}
