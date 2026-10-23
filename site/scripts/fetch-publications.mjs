// Run: node scripts/fetch-publications.mjs   (Node 18+, no npm install needed)
// Sources: ORCID 0000-0003-2288-8672 works list, DOIs in ../research/02-science-and-content.md,
// metadata from Crossref by DOI. Writes src/content/publications.json, newest first.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ORCID = '0000-0003-2288-8672'
const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const clean = (s) => String(s ?? '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
const TYPES = { 'journal-article': 'journal', 'posted-content': 'preprint', 'proceedings-article': 'conference' }

const get = async (url, accept = 'application/json') => {
  const r = await fetch(url, { headers: { Accept: accept, 'User-Agent': 'lab-site-build (mailto:d2gaur@uwaterloo.ca)' } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

const orcid = await get(`https://pub.orcid.org/v3.0/${ORCID}/works`)
const fromOrcid = new Set()
for (const g of orcid.group ?? [])
  for (const id of g['external-ids']?.['external-id'] ?? [])
    if (id['external-id-type'] === 'doi') fromOrcid.add(id['external-id-value'].toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, ''))

const notes = readFileSync(here('../../research/02-science-and-content.md'), 'utf8')
const fromNotes = new Set((notes.match(/10\.\d{4,9}\/[^\s)>\]"',;]*[^\s)>\]"',;.]/g) ?? []).map((d) => d.toLowerCase()))
const all = [...new Set([...fromOrcid, ...fromNotes])]
console.log(`ORCID DOIs: ${fromOrcid.size}, notes DOIs: ${fromNotes.size}, union: ${all.length}`)

const fmtAuthors = (list) => {
  const names = list.map((a) => clean(a.family || a.name)).filter(Boolean)
  return names.length > 8 ? names.slice(0, 8).join(', ') + ', et al.' : names.join(', ')
}

const pubs = []
const unresolved = []
for (const doi of all) {
  try {
    const m = (await get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)).message
    const type = TYPES[m.type]
    if (!type) { unresolved.push(`${doi} (unmapped type ${m.type})`); continue }
    const parts = (m.issued?.['date-parts']?.[0] ?? []).filter(Boolean)
    if (!parts.length) { unresolved.push(`${doi} (no date)`); continue }
    const [y, mo, d] = parts
    const date = [y, mo, d].filter(Boolean).map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-')
    const authors = m.author ?? []
    pubs.push({
      year: y,
      date,
      type,
      title: clean(m.title?.[0]),
      authors: fmtAuthors(authors),
      venue: clean(m['container-title']?.[0] || m.institution?.[0]?.name || m.publisher),
      doi: m.DOI,
      ...(clean(authors[0]?.family).toLowerCase() === 'beauchamp' ? { firstAuthor: true } : {}),
      source: fromOrcid.has(doi) ? 'orcid' : 'notes',
    })
  } catch (e) { unresolved.push(`${doi} (${e.message})`) }
}

const norm = (t) => t.toLowerCase()
const out = []
for (const p of pubs.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))) {
  const dup = out.find((q) => norm(q.title) === norm(p.title) && q.type !== p.type)
  if (dup) { if (dup.type === 'preprint' && p.type !== 'preprint') out[out.indexOf(dup)] = p; continue }
  out.push(p)
}
out.sort((a, b) => b.date.localeCompare(a.date))
writeFileSync(here('../src/content/publications.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`wrote ${out.length}; orcid ${out.filter((p) => p.source === 'orcid').length}, notes ${out.filter((p) => p.source === 'notes').length}`)
console.log('unresolved:', unresolved.length ? unresolved.join('\n  ') : 'none')
