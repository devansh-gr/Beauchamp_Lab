import { Link } from 'react-router'
import { PageHeader } from '../components/ui/Reveal'

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="No spikes recorded here." />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <Link to="/" className="text-red underline">Back to the lab</Link>
      </div>
    </>
  )
}
