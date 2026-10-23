import { PageHeader } from '../components/ui/Reveal'
import { Timeline } from '../components/news/Timeline'
import { NEWS } from '../content/news'

export default function News() {
  return (
    <>
      <PageHeader eyebrow="Updates" title="Lab updates" />
      <Timeline items={NEWS} />
    </>
  )
}
