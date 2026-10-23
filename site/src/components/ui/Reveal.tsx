import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Short fade on first scroll into view. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Mono uppercase label above section titles, e.g. "01 / Research". */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-semibold text-xs uppercase tracking-[0.18em] text-iron ${className}`}>{children}</p>
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-8 ${className}`}>{children}</div>
}

/** Page header used by every non-home page. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="bg-ink pt-40 pb-20 text-paper">
      <Container>
        <Eyebrow className="text-red-bright">{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-5xl text-display font-bold">{title}</h1>
        {intro && <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-paper/70">{intro}</p>}
      </Container>
    </header>
  )
}
