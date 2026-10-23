import { PI } from '../../content/lab'
import { Container, Eyebrow, linkCls } from '../ui/Reveal'

export default function PiFeature() {
  return (
    <section className="py-12" aria-labelledby="pi-name">
      <Container>
        <h2 className="text-2xl font-bold tracking-tight">{PI.role}</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-[16rem_1fr_14rem]">
          {PI.photo && (
            <img src={PI.photo} alt={PI.name} width={256} height={320} style={{ objectPosition: PI.photoPos }} className="aspect-[4/5] w-64 object-cover" />
          )}
          <div>
            <h3 id="pi-name" className="text-xl font-bold">{PI.name}</h3>
            <p className="mt-1 text-sm font-semibold">
              {PI.title}, {PI.dept}
            </p>
            <ul className="mt-5 space-y-2 font-serif text-lg leading-relaxed text-body">
              {PI.bio.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {PI.likes && <p className="mt-5 font-serif text-body">{PI.likes}</p>}
          </div>
          {PI.links && (
            <div>
              <Eyebrow>Links</Eyebrow>
              <ul className="mt-3 space-y-2 font-serif">
                {PI.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={linkCls}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
