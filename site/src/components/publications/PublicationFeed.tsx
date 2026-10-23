import { useMemo, useState } from 'react'
import { PUBLICATIONS } from '../../content/publications'
import { PI } from '../../content/lab'
import { Container, linkCls } from '../ui/Reveal'
import { Citation } from './Citation'
import type { Publication } from '../../content/types'

type Filter = 'all' | Publication['type']
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'journal', label: 'Journal articles' },
  { key: 'preprint', label: 'Preprints' },
  { key: 'conference', label: 'Conference' },
]

export function PublicationFeed() {
  const [filter, setFilter] = useState<Filter>('all')

  const groups = useMemo(() => {
    const byYear = new Map<number, Publication[]>()
    for (const p of PUBLICATIONS) if (filter === 'all' || p.type === filter) byYear.set(p.year, [...(byYear.get(p.year) ?? []), p])
    return [...byYear.entries()].sort((a, b) => b[0] - a[0])
  }, [filter])

  const scholar = PI.links?.find((l) => l.label === 'Google Scholar')

  return (
    <Container className="py-10">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`border px-4 py-2 text-sm font-semibold ${filter === f.key ? 'border-red bg-red text-white' : 'border-steel text-ink-2 hover:border-iron'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {groups.map(([year, items]) => (
        <section key={year} aria-labelledby={`y${year}`} className="mt-10">
          <h2 id={`y${year}`} className="border-b border-steel pb-2 text-xl font-semibold">
            {year}
          </h2>
          <ol className="mt-4 space-y-4">
            {items.map((p) => (
              <li key={p.title}>
                <Citation pub={p} />
              </li>
            ))}
          </ol>
        </section>
      ))}

      {scholar && (
        <p className="mt-12 font-serif">
          <a href={scholar.href} target="_blank" rel="noreferrer" className={linkCls}>
            Complete list on Google Scholar
          </a>
        </p>
      )}
    </Container>
  )
}
