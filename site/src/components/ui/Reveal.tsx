import type { ReactNode } from 'react'

/** Plain wrapper: the formal layout uses no entrance motion. */
export function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={className}>{children}</div>
}

/** Small uppercase label, e.g. "Email" or "Affiliations". */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.12em] text-iron ${className}`}>{children}</p>
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-8 ${className}`}>{children}</div>
}

/** Page header used by every non-home page. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <header className="border-b border-steel pt-28 pb-10">
      <Container>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-2 text-4xl font-semibold text-ink-2 sm:text-5xl">{title}</h1>
        {intro && <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-body">{intro}</p>}
      </Container>
    </header>
  )
}

/** Red underlined text link, the convention on CMU lab pages. */
export const linkCls = 'text-red underline decoration-red/40 underline-offset-4 hover:decoration-red'
