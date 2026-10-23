import { PageHeader } from '../components/ui/Reveal'
import { PublicationFeed } from '../components/publications/PublicationFeed'

export default function Publications() {
  return (
    <>
      <PageHeader eyebrow="Publications" title="Publications" />
      <PublicationFeed />
    </>
  )
}
