import { Link } from 'react-router'
import Hero from '../components/home/Hero'
import Story from '../components/home/Story'
import Stats from '../components/home/Stats'
import Feed from '../components/home/Feed'
import { Container, Eyebrow, Reveal } from '../components/ui/Reveal'
import { FOCUS_AREAS, LAB, PROJECTS } from '../content/lab'

export default function Home() {
  return (
    <>
      <Hero />

      <section id="overview" className="bg-paper py-24 sm:py-40" aria-labelledby="overview-h">
        <Container>
          <Reveal>
            <Eyebrow>01 / Overview</Eyebrow>
            <h2 id="overview-h" className="mt-8 max-w-5xl font-serif text-3xl leading-snug sm:text-5xl sm:leading-tight">
              {LAB.overview.slice(0, LAB.overview.indexOf('. ') + 1)}
            </h2>
            <p className="mt-8 max-w-3xl font-serif text-xl leading-relaxed text-ink-2/60 sm:text-2xl">
              {LAB.overview.slice(LAB.overview.indexOf('. ') + 2)}
            </p>
          </Reveal>
          <ol className="mt-20 grid gap-12 border-t border-ink/15 pt-12 md:grid-cols-3">
            {FOCUS_AREAS.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={i * 0.1}>
                  <p className="font-mono text-sm text-red">{`0${i + 1}`}</p>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight">{f.title}</h3>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Story />

      <section className="bg-paper py-24 sm:py-32" aria-labelledby="projects-h">
        <Container>
          <Reveal>
            <Eyebrow>04 / Research</Eyebrow>
            <h2 id="projects-h" className="mt-6 text-4xl font-medium tracking-tight sm:text-6xl">
              Four lines of work
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-px bg-ink/15 sm:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <li key={p.slug} className="bg-paper">
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <Link
                    to={`/research#${p.slug}`}
                    className="group flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-10"
                  >
                    <span className="font-mono text-sm text-red">{p.num}</span>
                    <h3 className="mt-6 text-2xl font-medium leading-tight tracking-tight">{p.title}</h3>
                    <p className="mt-4 font-serif text-lg text-iron">{p.short}</p>
                    <span className="mt-8 font-mono text-sm text-red" aria-hidden="true">
                      <span className="inline-block transition-transform group-hover:translate-x-2">&rarr;</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Stats />
      <Feed />

      <section className="bg-red py-24 text-white sm:py-32" aria-labelledby="join-h">
        <Container className="flex flex-wrap items-end justify-between gap-10">
          <Reveal>
            <Eyebrow className="text-white/70">07 / Join</Eyebrow>
            <h2 id="join-h" className="mt-6 max-w-3xl text-4xl font-medium tracking-tight sm:text-6xl">
              Build the window into the nervous system.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Join the lab <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
