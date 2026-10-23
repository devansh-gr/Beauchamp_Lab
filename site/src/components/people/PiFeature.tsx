import { PI } from '../../content/lab'
import { Container, Eyebrow, Reveal } from '../ui/Reveal'

export default function PiFeature() {
  return (
    <section className="bg-paper py-24 sm:py-32" aria-labelledby="pi-name">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="aspect-[4/5] overflow-hidden bg-ink">
            {PI.photo && <img src={PI.photo} alt={PI.name} style={{ objectPosition: PI.photoPos }} className="h-full w-full object-cover" />}
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <Eyebrow>{PI.role}</Eyebrow>
            <h2 id="pi-name" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{PI.name}</h2>
            <p className="mt-4 font-semibold text-sm uppercase tracking-[0.12em] text-red">{PI.title}</p>
            <p className="mt-1 font-semibold text-sm uppercase tracking-[0.12em] text-iron">{PI.dept}</p>
            {PI.likes && <p className="mt-6 font-serif text-lg italic text-iron">{PI.likes}</p>}
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 space-y-4 border-t border-ink/15 pt-8 font-serif text-lg leading-relaxed">
              {PI.bio.map((b) => (
                <li key={b} className="flex gap-4">
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          {PI.links && (
            <Reveal delay={0.3}>
              <ul className="mt-10 flex flex-wrap gap-3">
                {PI.links.map((l) => {
                  const external = /^https?:/.test(l.href)
                  return (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-block rounded-full border border-ink/25 px-4 py-2 font-semibold text-xs uppercase tracking-[0.12em] transition hover:border-red hover:bg-red hover:text-paper"
                      >
                        {l.label}
                        {external && <span aria-hidden="true"> &rarr;</span>}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
