import { Link } from 'react-router'
import { LAB } from '../content/lab'
import { Container, Eyebrow, Reveal } from '../components/ui/Reveal'
import { ContactForm } from '../components/contact/ContactForm'

export default function Contact() {
  return (
    <div className="min-h-screen bg-ink pt-40 pb-24 text-paper">
      <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <Eyebrow className="text-red-bright">Contact</Eyebrow>
          <h1 className="mt-6 text-display font-bold">Get connected.</h1>
          <p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-paper/70">{LAB.contactIntro}</p>
          <a
            href={`mailto:${LAB.email}`}
            className="mt-10 inline-block break-all font-semibold text-sm text-paper underline decoration-red-bright underline-offset-4 hover:text-red-bright"
          >
            {LAB.email}
          </a>
          <p className="mt-6">
            <Link to="/join" className="font-semibold text-xs uppercase tracking-[0.18em] text-red-bright hover:text-paper">
              Join the lab &rarr;
            </Link>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </Container>
    </div>
  )
}
