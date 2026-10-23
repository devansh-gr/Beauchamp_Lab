import { PUBLICATIONS } from '../../content/publications'

const KEYWORDS: Record<string, string[]> = {
  'latent-inputs': ['reverse engineering', 'synaptic inputs'],
  'injury-and-disease': ['stroke', 'multiple sclerosis'],
  'arousal-and-attention': ['neuromodulatory', 'persistent inward'],
  'internal-state': ['neuromodulatory', 'inhibitory', 'intrinsic properties'],
}

export function RelatedPubs({ slug, dark }: { slug: string; dark: boolean }) {
  const words = KEYWORDS[slug] ?? []
  const pubs = PUBLICATIONS.filter((p) => words.some((w) => p.title.toLowerCase().includes(w))).slice(0, 2)
  if (!pubs.length) return null
  return (
    <aside className="mt-16" aria-label="Related publications">
      <p className={`font-mono text-xs uppercase tracking-[0.18em] ${dark ? 'text-red-bright' : 'text-red'}`}>
        Related publications
      </p>
      <ul className={`mt-4 divide-y border-y ${dark ? 'divide-paper/15 border-paper/15' : 'divide-ink/15 border-ink/15'}`}>
        {pubs.map((p) => {
          const inner = (
            <>
              <span className="font-mono text-xs text-iron">
                {p.year} / {p.venue}
              </span>
              <span className="mt-1 block font-sans text-lg font-medium tracking-tight">{p.title}</span>
              <span className="mt-1 block font-serif text-sm opacity-70">{p.authors}</span>
            </>
          )
          return (
            <li key={p.title}>
              {p.doi ? (
                <a
                  href={p.doi.startsWith('http') ? p.doi : `https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block py-4 transition-transform hover:translate-x-1"
                >
                  {inner}
                </a>
              ) : (
                <div className="py-4">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
