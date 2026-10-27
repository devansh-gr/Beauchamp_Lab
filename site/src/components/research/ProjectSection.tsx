import { Suspense } from 'react'
import { Container } from '../ui/Reveal'
import { RecruitmentRaster } from '../viz'
import type { Project } from '../../content/types'
import { RelatedPubs } from './RelatedPubs'

export function ProjectSection({ project }: { project: Project }) {
  const { num, slug, title, body, subs, viz } = project
  return (
    <section id={slug} aria-labelledby={`${slug}-h`} className="scroll-mt-16 border-t border-steel py-14 first:border-t-0 sm:py-16">
      <Container>
        <p className="text-sm font-bold text-red">{num}</p>
        <h2 id={`${slug}-h`} className="mt-2 max-w-4xl text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-body">{body}</p>

        {subs.map((s) => (
          <div key={s.num} className="mt-6 max-w-3xl">
            <h3 className="font-semibold">
              {s.num} {s.title}
            </h3>
            <p className="mt-2 font-serif leading-relaxed text-body">{s.body}</p>
          </div>
        ))}

        {viz === 'RecruitmentRaster' && (
          <figure className="mt-10 max-w-4xl">
            <Suspense fallback={<div className="h-[420px]" />}>
              <RecruitmentRaster className="h-[420px] w-full" />
            </Suspense>
            <figcaption className="mt-3 font-serif text-sm leading-relaxed text-body">
              Simulated motor unit activity during a force ramp. Top, force as a percent of maximum voluntary contraction.
              Middle, firing times of 15 motor units ordered by recruitment threshold. Bottom, smoothed firing rates.
            </figcaption>
          </figure>
        )}

        <RelatedPubs slug={slug} />
      </Container>
    </section>
  )
}
