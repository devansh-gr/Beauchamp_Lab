import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container, Eyebrow, Reveal } from '../ui/Reveal'
import { LAB, MASTERS, MENTORSHIP, PHD, POSITIONS } from '../../content/lab'

const arrow = 'inline-block transition-transform duration-300 group-hover:translate-x-1'

export function RolesRow() {
  const roles = [
    { label: 'PhD', href: '#phd' },
    { label: 'MS', href: '#ms' },
    { label: 'Postdoc', href: '#postdoc' },
  ]
  return (
    <section className="border-b border-steel bg-paper" aria-label="Open roles">
      <Container className="grid grid-cols-1 sm:grid-cols-3">
        {roles.map((r, i) => (
          <a
            key={r.label}
            href={r.href}
            className="group flex items-center justify-between border-steel py-6 font-mono text-sm uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-red max-sm:border-b sm:px-6 sm:[&:not(:first-child)]:border-l"
          >
            <span>
              <span className="mr-3 text-iron">0{i + 1}</span>
              {r.label}
            </span>
            <span aria-hidden className={arrow}>→</span>
          </a>
        ))}
      </Container>
    </section>
  )
}

export function Mentorship() {
  return (
    <section className="bg-paper py-24 md:py-40">
      <Container>
        <Reveal>
          <Eyebrow>{MENTORSHIP.title}</Eyebrow>
          <div className="mt-10 max-w-4xl border-l-4 border-red pl-6 sm:pl-10">
            <blockquote className="font-serif text-2xl leading-snug text-ink sm:text-3xl md:text-4xl">
              {MENTORSHIP.desc}
            </blockquote>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function MastersTracks() {
  return (
    <section id="ms" className="scroll-mt-24 bg-paper-2 py-24 md:py-40">
      <Container>
        <Reveal>
          <Eyebrow>{MASTERS.title}</Eyebrow>
          <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed text-ink-2">{MASTERS.intro}</p>
        </Reveal>
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {MASTERS.areas.map((a, i) => (
            <li key={a.num}>
              <Reveal delay={i * 0.1} className="h-full">
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full flex-col border border-steel bg-paper p-8 transition-shadow hover:shadow-xl"
                >
                  <span className="font-mono text-4xl text-red">{a.num}</span>
                  <h3 className="mt-6 text-2xl font-medium tracking-tight text-ink">{a.title}</h3>
                  <p className="mt-4 font-serif leading-relaxed text-ink-2">{a.body}</p>
                </motion.article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function PhdPrograms() {
  return (
    <section id="phd" className="scroll-mt-24 bg-paper py-24 md:py-40">
      <Container>
        <Reveal>
          <Eyebrow>{PHD.title}</Eyebrow>
          <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed text-ink-2">{PHD.desc}</p>
        </Reveal>
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {PHD.programs.map((p, i) => (
            <li key={p.href}>
              <Reveal delay={i * 0.1} className="h-full">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full min-h-40 flex-col justify-between border border-steel bg-paper-2 p-8 transition duration-300 hover:-translate-y-1 hover:border-red"
                >
                  <span className="text-xl font-medium tracking-tight text-ink">{p.label}</span>
                  <span className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-red">
                    Program page <span aria-hidden className={arrow}>↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function Postdoc() {
  const p = POSITIONS[0]
  return (
    <section id="postdoc" className="scroll-mt-24 bg-paper pb-24 md:pb-40">
      <Container>
        <Reveal>
          <div className="bg-ink p-8 text-paper sm:p-14">
            <Eyebrow className="text-red-bright">Postdoc</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">{p.title}</h2>
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-paper/70">{p.desc}</p>
            <a
              href={`mailto:${LAB.email}`}
              className="group mt-10 inline-block font-mono text-sm uppercase tracking-[0.18em] text-red-bright"
            >
              {LAB.email} <span aria-hidden className={arrow}>→</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function CtaBand() {
  return (
    <section className="bg-red py-20 text-white md:py-28">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Reveal>
          <h2 className="max-w-xl text-4xl font-medium tracking-tight sm:text-5xl">Get in touch.</h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/contact"
            className="group bg-ink px-8 py-4 text-center font-mono text-sm uppercase tracking-[0.18em] text-paper transition-transform hover:-translate-y-0.5"
          >
            Contact form <span aria-hidden className={arrow}>→</span>
          </Link>
          <a
            href={`mailto:${LAB.email}`}
            className="border border-white px-8 py-4 text-center font-mono text-sm tracking-[0.04em] transition-colors hover:bg-white hover:text-red"
          >
            {LAB.email}
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
