import { Container, Reveal } from '../ui/Reveal'
import type { Project } from '../../content/types'
import { ProjectViz } from './ProjectViz'
import { RelatedPubs } from './RelatedPubs'

export function ProjectSection({ project, dark }: { project: Project; dark: boolean }) {
  const { num, slug, title, body, subs, viz } = project
  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-h`}
      className={`scroll-mt-0 py-24 sm:py-32 ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink-2'}`}
    >
      <Container>
        <Reveal>
          <p
            aria-hidden
            className={`text-[clamp(5rem,16vw,14rem)] font-bold leading-none tracking-tighter ${
              dark ? 'text-red-bright' : 'text-red'
            }`}
          >
            {num}
          </p>
          <h2 id={`${slug}-h`} className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed opacity-80 sm:text-xl">{body}</p>
        </Reveal>

        {subs.length > 0 && (
          <div className="mt-12 space-y-4 sm:ml-12">
            {subs.map((s) => (
              <Reveal key={s.num}>
                <article className={`border p-6 ${dark ? 'border-paper/20' : 'border-ink/20'}`}>
                  <p className={`font-semibold text-xs tracking-[0.18em] ${dark ? 'text-red-bright' : 'text-red'}`}>{s.num}</p>
                  <h3 className="mt-2 text-xl font-medium tracking-tight">{s.title}</h3>
                  <p className="mt-3 font-serif leading-relaxed opacity-80">{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {viz && viz !== 'EmgHero' && (
          <div className="mt-16">
            <ProjectViz viz={viz} />
          </div>
        )}

        <RelatedPubs slug={slug} dark={dark} />
      </Container>
    </section>
  )
}
