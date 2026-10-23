import { Container, Eyebrow, Reveal } from '../components/ui/Reveal'
import { CtaBand, MastersTracks, Mentorship, PhdPrograms, Postdoc, RolesRow } from '../components/join/Sections'

export default function Join() {
  return (
    <>
      <header className="bg-ink pt-40 pb-24 text-paper">
        <Container>
          <Reveal>
            <Eyebrow className="text-red-bright">Join</Eyebrow>
            <h1 className="mt-6 max-w-5xl text-display font-medium">Build the window into the nervous system.</h1>
            <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-paper/70">
              The Output Layer Lab is always looking to connect with curious, motivated researchers across levels of experience.
            </p>
          </Reveal>
        </Container>
      </header>
      <RolesRow />
      <Mentorship />
      <MastersTracks />
      <PhdPrograms />
      <Postdoc />
      <CtaBand />
    </>
  )
}
