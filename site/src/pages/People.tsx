import { COLLABORATORS, MEMBERS } from '../content/lab'
import PeopleGrid from '../components/people/PeopleGrid'
import PiFeature from '../components/people/PiFeature'
import { PageHeader } from '../components/ui/Reveal'

export default function People() {
  return (
    <>
      <PageHeader title="People" />
      <PiFeature />
      <PeopleGrid title="Lab Members" people={MEMBERS} />
      {COLLABORATORS.length > 0 && <PeopleGrid title="Collaborators" people={COLLABORATORS} />}
    </>
  )
}
