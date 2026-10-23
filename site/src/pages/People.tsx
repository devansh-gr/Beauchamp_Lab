import { COLLABORATORS, MEMBERS } from '../content/lab'
import PeopleGrid from '../components/people/PeopleGrid'
import PiFeature from '../components/people/PiFeature'
import { PageHeader } from '../components/ui/Reveal'

export default function People() {
  return (
    <>
      <PageHeader eyebrow="People" title="People" />
      <PiFeature />
      <PeopleGrid eyebrow="01 / Team" title="Members" people={MEMBERS} tone="paper-2" />
      {COLLABORATORS.length > 0 && <PeopleGrid eyebrow="02 / Network" title="Collaborators" people={COLLABORATORS} tone="paper" />}
    </>
  )
}
