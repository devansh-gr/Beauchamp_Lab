import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { PageHeader } from '../components/ui/Reveal'
import { ProjectSection } from '../components/research/ProjectSection'
import { SideIndex } from '../components/research/SideIndex'
import { LAB, PROJECTS } from '../content/lab'

export default function Research() {
  const { slug } = useParams()
  const { hash } = useLocation()
  const [active, setActive] = useState(PROJECTS[0].slug)
  const target = slug ?? hash.replace('#', '')

  useEffect(() => {
    if (!target) return
    const id = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
    return () => cancelAnimationFrame(id)
  }, [target])

  useEffect(() => {
    const els = PROJECTS.map((p) => document.getElementById(p.slug)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <PageHeader eyebrow="01 / Research" title="Research" intro={LAB.overview} />
      <SideIndex active={active} />
      {PROJECTS.map((p, i) => (
        <ProjectSection key={p.slug} project={p} dark={i % 2 === 1} />
      ))}
    </>
  )
}
