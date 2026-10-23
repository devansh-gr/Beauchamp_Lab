import { Link } from 'react-router'
import { Container, Eyebrow, PageHeader, linkCls } from '../components/ui/Reveal'
import { LAB, MASTERS, MENTORSHIP, PHD, POSITIONS } from '../content/lab'

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 border-t border-steel py-12 first:border-t-0">
      <h2 id={`${id}-h`} className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

const prose = 'mt-4 max-w-3xl font-serif text-lg leading-relaxed text-body'

export default function Join() {
  return (
    <>
      <PageHeader title="Join the Lab" intro={LAB.joinIntro} />
      <Container className="pb-12">
        <Block id="mentorship" title={MENTORSHIP.title}>
          <p className={prose}>{MENTORSHIP.desc}</p>
        </Block>

        <Block id="phd" title={PHD.title}>
          <p className={prose}>{PHD.desc}</p>
          <ul className="mt-4 space-y-2 font-serif text-lg">
            {PHD.programs.map((p) => (
              <li key={p.href}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="ms" title={MASTERS.title}>
          <p className={prose}>{MASTERS.intro}</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {MASTERS.areas.map((a) => (
              <div key={a.num}>
                <h3 className="font-bold">{a.title}</h3>
                <p className="mt-2 font-serif leading-relaxed text-body">{a.body}</p>
              </div>
            ))}
          </div>
        </Block>

        {POSITIONS.map((p) => (
          <Block key={p.title} id="postdoc" title={p.title}>
            <p className={prose}>{p.desc}</p>
          </Block>
        ))}

        <Block id="apply" title="Contact">
          <Eyebrow className="mt-4">Email</Eyebrow>
          <a href={`mailto:${LAB.email}`} className={`mt-1 inline-block font-serif text-lg ${linkCls}`}>
            {LAB.email}
          </a>
          <p className="mt-4 font-serif text-lg">
            <Link to="/contact" className={linkCls}>
              Contact form
            </Link>
          </p>
        </Block>
      </Container>
    </>
  )
}
