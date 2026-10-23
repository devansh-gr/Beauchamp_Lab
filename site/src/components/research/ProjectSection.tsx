import { Container } from '../ui/Reveal'
import type { Project } from '../../content/types'
import { ProjectViz } from './ProjectViz'
import { RelatedPubs } from './RelatedPubs'

export function ProjectSection({ project }: { project: Project }) {
  const { num, slug, title, body, subs, viz } = project
  return (
    <section id={slug} aria-labelledby={`${slug}-h`} className="scroll-mt-16 border-t border-steel py-14 first:border-t-0 sm:py-16">
      <Container>
        <p className="text-sm font-bold text-red">{num}</p>
        <h2 id={`${slug}-h`} className="mt-2 max-w-4xl text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-body">{body}</p>

        {subs.map((s) => (
          <div key={s.num} className="mt-6 max-w-3xl">
            <h3 className="font-bold">
              {s.num} {s.title}
            </h3>
            <p className="mt-2 font-serif leading-relaxed text-body">{s.body}</p>
          </div>
        ))}

        {viz && (
          <div className="mt-10 max-w-4xl">
            <ProjectViz viz={viz} />
          </div>
        )}

        <RelatedPubs slug={slug} />
      </Container>
    </section>
  )
}
