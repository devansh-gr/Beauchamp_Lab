import { useMemo, useState } from 'react'
import { Container, Reveal } from '../ui/Reveal'
import type { NewsItem, NewsType } from '../../content/types'

const LABEL: Record<string, string> = { paper: 'Paper', preprint: 'Preprint', lab: 'Lab' }

function railDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const m = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  return `${m} ${d.getFullYear()}`
}

export function Timeline({ items }: { items: NewsItem[] }) {
  const [filter, setFilter] = useState<NewsType | 'all'>('all')
  const sorted = useMemo(() => [...items].sort((a, b) => b.date.localeCompare(a.date)), [items])
  const types = useMemo(() => {
    const counts = new Map<NewsType, number>()
    for (const i of sorted) counts.set(i.type, (counts.get(i.type) ?? 0) + 1)
    return [...counts.entries()]
  }, [sorted])
  const shown = filter === 'all' ? sorted : sorted.filter((i) => i.type === filter)

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 font-semibold text-xs uppercase tracking-[0.14em] transition-colors ${
      active ? 'border-red bg-red text-paper' : 'border-steel text-iron hover:border-ink-2 hover:text-ink-2'
    }`

  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container>
        {types.length > 1 && (
          <div role="group" aria-label="Filter by type" className="mb-12 flex flex-wrap gap-2">
            <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')} className={chip(filter === 'all')}>
              All {sorted.length}
            </button>
            {types.map(([t, n]) => (
              <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)} className={chip(filter === t)}>
                {LABEL[t] ?? t} {n}
              </button>
            ))}
          </div>
        )}
        <ol className="relative">
          {shown.map((item, idx) => (
            <li key={`${filter}-${item.date}-${item.title}`} className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 sm:grid-cols-[8rem_1.5rem_1fr] sm:gap-x-6">
              <span className="col-span-2 col-start-1 row-start-1 mb-2 font-semibold text-xs uppercase tracking-[0.18em] text-iron sm:col-span-1 sm:mb-0 sm:pt-6 sm:text-right">
                <time dateTime={item.date}>{railDate(item.date)}</time>
              </span>
              <div className="relative row-start-2 sm:row-start-1" aria-hidden="true">
                <span className={`absolute left-1/2 w-px -translate-x-1/2 bg-steel ${idx === 0 ? 'top-7' : 'top-0'} ${idx === shown.length - 1 ? 'h-7' : 'bottom-0'}`} />
                <span className="absolute left-1/2 top-6 size-2.5 -translate-x-1/2 rounded-full bg-red-bright ring-4 ring-paper" />
              </div>
              <Reveal className="row-start-2 pb-8 sm:row-start-1">
                <article className="rounded-sm border border-steel bg-paper-2 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-semibold text-[0.7rem] uppercase tracking-[0.18em] text-red">{LABEL[item.type] ?? item.type}</span>
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open: ${item.title} (opens in new tab)`}
                        className="text-iron transition-colors hover:text-red"
                      >
                        <span aria-hidden="true">&#8599;</span>
                      </a>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-medium leading-snug text-ink-2 sm:text-2xl">{item.title}</h2>
                  {item.body && <p className="mt-3 font-serif text-base leading-relaxed text-ink-3/80">{item.body}</p>}
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
