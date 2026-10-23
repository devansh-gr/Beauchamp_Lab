import { LAB } from '../content/lab'
import { Container, Eyebrow, PageHeader, linkCls } from '../components/ui/Reveal'
import { ContactForm } from '../components/contact/ContactForm'

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact" intro={LAB.contactIntro} />
      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <div>
            <Eyebrow>Email</Eyebrow>
            <a href={`mailto:${LAB.email}`} className={`mt-1 inline-block break-all font-serif text-lg ${linkCls}`}>
              {LAB.email}
            </a>
          </div>
          <div>
            <Eyebrow>Affiliation</Eyebrow>
            <p className="mt-1 font-serif text-lg text-body">
              Department of Biomedical Engineering and Neuroscience Institute, {LAB.university}
            </p>
          </div>
        </div>
        <ContactForm />
      </Container>
    </>
  )
}
