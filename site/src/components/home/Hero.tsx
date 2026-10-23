import { Link } from 'react-router'
import { Container } from '../ui/Reveal'
import { LAB } from '../../content/lab'

const pill =
  'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200'

export default function Hero() {
  const sub = LAB.hero.split(/(?<=\.)\s/)[0]
  return (
    <section className="flex min-h-[85svh] items-end bg-ink text-paper">
      <Container className="pb-24 pt-32 sm:pb-28">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-bright">
          {LAB.pi} / {LAB.university}
        </p>
        <h1 className="mt-6 max-w-4xl text-display font-bold">Reading the nervous system from its output.</h1>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-paper/75 sm:text-xl">{sub}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/research" className={`${pill} bg-red text-white hover:bg-red-bright`}>
            View research <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link to="/people" className={`${pill} border border-paper/40 text-paper hover:border-paper hover:bg-paper/10`}>
            Meet the team
          </Link>
        </div>
      </Container>
    </section>
  )
}
