import { Link } from 'react-router'
import { Container, Eyebrow, Reveal } from '../ui/Reveal'
import { PUBLICATIONS } from '../../content/publications'

export default function Feed() {
  const latest = [...PUBLICATIONS].sort((a, b) => b.year - a.year).slice(0, 3)
  return (
    <section className="bg-paper py-24 sm:py-32" aria-labelledby="pubs-h">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>06 / Latest publications</Eyebrow>
            <h2 id="pubs-h" className="mt-6 text-4xl font-medium tracking-tight sm:text-6xl">
              In print
            </h2>
          </div>
          <Link to="/publications" className="group font-mono text-sm uppercase tracking-[0.14em] text-red">
            All publications <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </Reveal>
        <ul className="mt-14 divide-y divide-ink/15 border-y border-ink/15">
          {latest.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.08}>
                <article className="grid gap-4 py-8 md:grid-cols-[14rem_1fr_auto] md:gap-10">
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-iron">
                    <p>{p.year}</p>
                    <p className="mt-1">{p.venue}</p>
                    <span className="mt-3 inline-block rounded-full border border-red px-2.5 py-0.5 text-red">{p.type}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl leading-snug sm:text-2xl">{p.title}</h3>
                    <p className="mt-3 text-sm text-iron">{p.authors}</p>
                  </div>
                  {p.doi && (
                    <a
                      href={`https://doi.org/${p.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`DOI link for ${p.title}`}
                      className="group font-mono text-sm uppercase tracking-[0.14em] text-red md:self-start"
                    >
                      DOI <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                    </a>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
