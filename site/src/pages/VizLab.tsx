import { Suspense, useState } from 'react'
import { Container, PageHeader } from '../components/ui/Reveal'
import { NeuromodDial, PathwayStory, RecruitmentRaster } from '../components/viz'

// Isolated preview of every visualization. Not linked from the nav.
export default function VizLab() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  return (
    <>
      <PageHeader eyebrow="Internal" title="Viz lab" />
      <Suspense fallback={null}>
        <Container className="grid gap-16 py-16">
          <RecruitmentRaster className="h-[480px] w-full" />
          <NeuromodDial className="h-[480px] w-full" />
        </Container>
        <div className="bg-ink py-16">
          <Container>
            <div className="mb-4 flex gap-2">
              {([0, 1, 2] as const).map((s) => (
                <button key={s} onClick={() => setStep(s)} className={`px-3 py-1 font-mono text-xs ${s === step ? 'bg-red text-white' : 'text-paper/60'}`}>
                  step {s}
                </button>
              ))}
            </div>
            <PathwayStory step={step} className="h-[70vh] w-full" />
          </Container>
        </div>
      </Suspense>
    </>
  )
}
