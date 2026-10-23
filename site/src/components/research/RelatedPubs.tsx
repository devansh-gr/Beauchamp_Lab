import { PUBLICATIONS } from '../../content/publications'
import { Citation } from '../publications/Citation'

const KEYWORDS: Record<string, string[]> = {
  'latent-inputs': ['reverse engineering', 'synaptic inputs'],
  'injury-and-disease': ['stroke', 'multiple sclerosis'],
  'arousal-and-attention': ['neuromodulatory', 'persistent inward'],
  'internal-state': ['neuromodulatory', 'inhibitory', 'intrinsic properties'],
}

export function RelatedPubs({ slug }: { slug: string }) {
  const words = KEYWORDS[slug] ?? []
  const pubs = PUBLICATIONS.filter((p) => words.some((w) => p.title.toLowerCase().includes(w))).slice(0, 2)
  if (!pubs.length) return null
  return (
    <aside className="mt-10 max-w-3xl" aria-label="Related publications">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-iron">Related publications</p>
      <ul className="mt-3 space-y-3">
        {pubs.map((p) => (
          <li key={p.title}>
            <Citation pub={p} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
