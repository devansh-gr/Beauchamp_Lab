import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PUBLICATIONS } from '../../content/publications'
import { PI } from '../../content/lab'
import { Container } from '../ui/Reveal'
import { PublicationEntry, TYPE_LABEL } from './PublicationEntry'
import type { Publication } from '../../content/types'

type Filter = 'all' | Publication['type']
const FILTERS: Filter[] = ['all', 'journal', 'preprint', 'conference']

export function PublicationFeed() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: PUBLICATIONS.length, journal: 0, preprint: 0, conference: 0 }
    for (const p of PUBLICATIONS) c[p.type]++
    return c
  }, [])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const shown = PUBLICATIONS.filter(
      (p) =>
        (filter === 'all' || p.type === filter) &&
        (!q || p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q)),
    )
    const byYear = new Map<number, Publication[]>()
    for (const p of shown) byYear.set(p.year, [...(byYear.get(p.year) ?? []), p])
    return [...byYear.entries()].sort((a, b) => b[0] - a[0])
  }, [filter, query])

  const scholar = PI.links?.find((l) => l.label === 'Google Scholar')

  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  filter === f ? 'border-ink bg-ink text-paper' : 'border-ink/25 text-ink hover:border-ink'
                }`}
              >
                {f === 'all' ? 'All' : TYPE_LABEL[f]} <span className={filter === f ? 'text-red-bright' : 'text-iron'}>{counts[f]}</span>
              </button>
            ))}
          </div>
          <label className="block md:w-80">
            <span className="sr-only">Search title or authors</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or authors"
              className="w-full rounded-none border-b border-ink/30 bg-transparent py-2 font-mono text-sm text-ink placeholder:text-iron focus:border-red focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.map(([year, items]) => (
              <motion.section
                key={year}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-label={`${year} publications`}
                className="md:grid md:grid-cols-[8rem_1fr] md:gap-8"
              >
                <h2 className="pt-8 font-mono text-2xl text-red md:sticky md:top-24 md:self-start">{year}</h2>
                <ul>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((p) => (
                      <PublicationEntry key={p.title} pub={p} />
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            ))}
          </AnimatePresence>
          {groups.length === 0 && (
            <p className="border-t border-ink/15 pt-8 font-mono text-sm text-iron" role="status">
              No matching publications.
            </p>
          )}
        </div>

        {scholar && (
          <div className="mt-16 border-t border-ink/15 pt-8">
            <a href={scholar.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.14em] text-red hover:underline">
              Full list on Google Scholar
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        )}
      </Container>
    </section>
  )
}
