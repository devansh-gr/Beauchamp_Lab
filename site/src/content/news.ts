// Derived from the 6 most recent publications (Crossref dates). Real lab news to be added by the lab.
import { PUBLICATIONS } from './publications'
import type { NewsItem } from './types'

export const NEWS: NewsItem[] = PUBLICATIONS.filter((p) => p.date && p.type !== 'conference')
  .slice(0, 6)
  .map((p) => ({
    date: p.date!,
    type: p.type === 'preprint' ? 'preprint' : 'paper',
    title: p.title,
    body: p.venue,
    href: p.doi ? `https://doi.org/${p.doi}` : undefined,
  }))
