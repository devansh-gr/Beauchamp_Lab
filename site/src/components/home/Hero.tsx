import { Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import { EmgHero } from '../viz'
import { Container } from '../ui/Reveal'
import { LAB } from '../../content/lab'

const WORDS = ['movement', 'stroke', 'arousal', 'attention']

function useTypewriter(words: string[]) {
  const reduced = useReducedMotion()
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (reduced) return
    let w = 0
    let n = words[0].length
    let dir: 1 | -1 = -1
    let t: number
    const tick = () => {
      n += dir
      setText(words[w].slice(0, n))
      let wait = dir === 1 ? 90 : 45
      if (dir === 1 && n === words[w].length) {
        dir = -1
        wait = 1800
      } else if (dir === -1 && n === 0) {
        w = (w + 1) % words.length
        dir = 1
        wait = 250
      }
      t = window.setTimeout(tick, wait)
    }
    t = window.setTimeout(tick, 1800)
    return () => window.clearTimeout(t)
  }, [reduced, words])
  return { text, reduced }
}

const pill =
  'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200'

export default function Hero() {
  const { text, reduced } = useTypewriter(WORDS)
  const sub = LAB.hero.split(/(?<=\.)\s/)[0]
  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Suspense fallback={null}>
          <EmgHero className="absolute inset-0 h-full w-full" />
        </Suspense>
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-ink via-ink/70 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden="true" />
      <Container className="pb-24 pt-32 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs uppercase tracking-[0.18em] text-red-bright"
        >
          {LAB.pi} / {LAB.university}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-4xl text-display font-medium"
        >
          Reading the nervous system from its output.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 font-mono text-lg text-paper/80 sm:text-2xl"
          aria-label={`to understand ${WORDS.join(', ')}`}
        >
          <span aria-hidden="true">
            to understand <span className="text-red-bright">{text}</span>
            {!reduced && <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] animate-pulse bg-red-bright" />}
          </span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-paper/70"
        >
          {sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Link to="/research" className={`${pill} bg-red text-white hover:bg-red-bright`}>
            View research <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link to="/people" className={`${pill} border border-paper/40 text-paper hover:border-paper hover:bg-paper/10`}>
            Meet the team
          </Link>
        </motion.div>
      </Container>
      <a
        href="#overview"
        className="absolute bottom-6 right-4 hidden flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60 hover:text-paper sm:right-8 sm:flex"
      >
        Scroll
        <span className="relative block h-12 w-px overflow-hidden bg-paper/20" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 h-4 animate-bounce bg-red-bright" />
        </span>
      </a>
    </section>
  )
}
