import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import { PageHeader } from '../components/ui/Reveal'
import { ProjectSection } from '../components/research/ProjectSection'
import { LAB, PROJECTS } from '../content/lab'

export default function Research() {
  const { slug } = useParams()
  const { hash } = useLocation()
  const target = slug ?? hash.replace('#', '')

  useEffect(() => {
    if (!target) return
    const id = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
    return () => cancelAnimationFrame(id)
  }, [target])

  return (
    <>
      <PageHeader title="Research" intro={LAB.overview} />
      {PROJECTS.map((p) => (
        <ProjectSection key={p.slug} project={p} />
      ))}
    </>
  )
}
