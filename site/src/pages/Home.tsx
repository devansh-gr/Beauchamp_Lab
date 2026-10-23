import { Link } from 'react-router'
import { Container, Eyebrow, linkCls } from '../components/ui/Reveal'
import { PathwayFigure } from '../components/research/ProjectViz'
import { Citation } from '../components/publications/Citation'
import { FOCUS_AREAS, LAB, PI, PROJECTS } from '../content/lab'
import { PUBLICATIONS } from '../content/publications'

const AFFILIATIONS = [
  { label: 'Biomedical Engineering', href: 'https://www.cmu.edu/bme/' },
  { label: 'Neuroscience Institute', href: 'https://www.cmu.edu/ni/' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-steel py-16 sm:py-20">
      <Container>
        <h2 id={`${id}-h`} className="text-3xl font-semibold">
          {title}
        </h2>
        {children}
      </Container>
    </section>
  )
}

export default function Home() {
  const recent = [...PUBLICATIONS].sort((a, b) => (b.date ?? `${b.year}`).localeCompare(a.date ?? `${a.year}`)).slice(0, 5)
  return (
    <>
      <section className="pt-28 pb-16 sm:pb-20">
        <Container className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="text-4xl font-semibold sm:text-5xl">{LAB.name}</h1>
            <p className="mt-3 text-lg font-semibold text-iron">{LAB.tagline}</p>
            <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-body">{LAB.overview}</p>
          </div>
          <aside className="space-y-8 lg:border-l lg:border-steel lg:pl-8">
            <div>
              <Eyebrow>Affiliations</Eyebrow>
              <ul className="mt-3 space-y-2 font-serif">
                {AFFILIATIONS.map((a) => (
                  <li key={a.href}>
                    <a href={a.href} className={linkCls}>
                      {a.label}
                    </a>
                  </li>
                ))}
                <li className="text-body">{LAB.university}</li>
              </ul>
            </div>
            <div>
              <Eyebrow>Research areas</Eyebrow>
              <ul className="mt-3 space-y-2 font-serif text-body">
                {FOCUS_AREAS.map((f) => (
                  <li key={f.title}>{f.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>Contact</Eyebrow>
              <a href={`mailto:${LAB.email}`} className={`mt-3 inline-block font-serif ${linkCls}`}>
                {LAB.email}
              </a>
            </div>
          </aside>
        </Container>
      </section>

      <Section id="figure" title="From brain to muscle">
        <div className="mt-8">
          <PathwayFigure />
        </div>
      </Section>

      <Section id="pi" title="Principal Investigator">
        <div className="mt-8 grid gap-8 md:grid-cols-[16rem_1fr]">
          {PI.photo && (
            <img src={PI.photo} alt={PI.name} width={256} height={320} style={{ objectPosition: PI.photoPos }} className="aspect-[4/5] w-64 object-cover" />
          )}
          <div>
            <h3 className="text-xl font-semibold">{PI.name}</h3>
            <p className="mt-1 text-sm font-semibold text-ink-2">
              {PI.title}, {PI.dept}
            </p>
            <ul className="mt-5 space-y-2 font-serif leading-relaxed text-body">
              {PI.bio.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="mt-5 font-serif">
              <Link to="/people" className={linkCls}>
                Full profile and lab members
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <Section id="research" title="Research">
        <ol className="mt-8 divide-y divide-steel">
          {PROJECTS.map((p) => (
            <li key={p.slug} className="grid gap-2 py-8 md:grid-cols-[3rem_1fr]">
              <span className="text-sm font-bold text-red">{p.num}</span>
              <div>
                <h3 className="text-xl font-semibold">
                  <Link to={`/research#${p.slug}`} className="hover:text-red">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-3xl font-serif leading-relaxed text-body">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="publications" title="Recent publications">
        <ol className="mt-8 space-y-5">
          {recent.map((p) => (
            <li key={p.title}>
              <Citation pub={p} />
            </li>
          ))}
        </ol>
        <p className="mt-8 font-serif">
          <Link to="/publications" className={linkCls}>
            All publications
          </Link>
        </p>
      </Section>

      <Section id="join" title="Prospective students and postdocs">
        <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-body">{LAB.joinIntro}</p>
        <p className="mt-5 font-serif">
          <Link to="/join" className={linkCls}>
            Open positions
          </Link>
          <span className="mx-3 text-steel">|</span>
          <Link to="/contact" className={linkCls}>
            Contact the lab
          </Link>
        </p>
      </Section>
    </>
  )
}
