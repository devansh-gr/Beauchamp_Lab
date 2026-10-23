import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { Publication } from '../../content/types'

export const TYPE_LABEL: Record<Publication['type'], string> = {
  journal: 'Journal',
  preprint: 'Preprint',
  conference: 'Conference',
}

export function citation(p: Publication) {
  const base = `${p.authors} (${p.year}). ${p.title}. ${p.venue}.`
  return p.doi ? `${base} https://doi.org/${p.doi}` : base
}

function Authors({ text }: { text: string }) {
  const parts = text.split(/(Beauchamp)/g)
  return (
    <>
      {parts.map((s, i) =>
        s === 'Beauchamp' ? (
          <strong key={i} className="font-semibold text-ink">
            {s}
          </strong>
        ) : (
          <span key={i}>{s}</span>
        ),
      )}
    </>
  )
}

export function PublicationEntry({ pub }: { pub: Publication }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(citation(pub))
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const url = pub.doi ? `https://doi.org/${pub.doi}` : undefined

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-ink/15 py-8"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-iron">
        <span>{pub.venue}</span>
        <span className="rounded-full border border-ink/25 px-2.5 py-0.5 text-[11px]">{TYPE_LABEL[pub.type]}</span>
        {pub.firstAuthor && <span className="rounded-full bg-red px-2.5 py-0.5 text-[11px] text-white">First author</span>}
      </div>
      <h3 className="mt-3 max-w-3xl text-xl font-medium leading-snug tracking-tight text-ink sm:text-2xl">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="hover:text-red">
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </h3>
      <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-ink-3/80">
        <Authors text={pub.authors} />
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]">
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-red hover:underline">
            DOI
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        )}
        <button type="button" onClick={copy} className="cursor-pointer uppercase text-iron hover:text-ink">
          {copied ? 'Copied' : 'Copy citation'}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Citation copied' : ''}
        </span>
      </div>
    </motion.li>
  )
}
