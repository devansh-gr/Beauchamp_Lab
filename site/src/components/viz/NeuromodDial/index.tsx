import { useEffect, useId, useRef, useState } from 'react'
import type { NeuromodDialProps } from '../types'

// Phenomenological model, not a biophysical simulation. Input I(t) is a triangular ramp, peak at t = 0.5.
// Monoaminergic drive d (0..1) scales the PIC: faster acceleration after recruitment, then attenuation,
// and self-sustained firing down to a lower input (hysteresis). Delta F spans 2 to 7 pps, the range
// reported for human motor unit pairs (Beauchamp et al. 2023, J Neural Eng; 2025, J Physiol).
const N = 64
const RMAX = 25
const I_REP = 0.05 // reporter recruitment input
const I_REC = 0.5 // test unit recruitment input
const R_REC = 6 // test unit rate at recruitment, pps
const R_DER = 5 // test unit rate at derecruitment, pps
const M = { l: 34, r: 12, t: 14, b: 26 }

const deltaF = (d: number) => 2 + 5 * d
const repGain = (d: number) => 12 + 6 * d
const repRate = (I: number, d: number) => 6 + repGain(d) * (I - I_REP)
const testAsc = (I: number, d: number) => R_REC + 8 * (I - I_REC) + (2 + 7 * d) * (1 - Math.exp(-(I - I_REC) / 0.05))

function model(d: number, W: number, H: number) {
  const pw = W - M.l - M.r
  const ph = H - M.t - M.b
  const x = (t: number) => M.l + t * pw
  const y = (r: number) => M.t + (1 - r / RMAX) * ph
  const pt = (t: number, r: number) => `${x(t).toFixed(1)},${y(r).toFixed(1)}`

  const iDer = I_REC - deltaF(d) / repGain(d)
  const tRec = I_REC / 2
  const tDer = 1 - iDer / 2
  const rPeak = testAsc(1, d)

  const rep: string[] = []
  for (let k = 0; k <= N; k++) {
    const t = 0.025 + (0.95 * k) / N
    rep.push(pt(t, repRate(1 - Math.abs(2 * t - 1), d)))
  }

  // Ascending limb in pixels, for brace height geometry.
  const asc: [number, number][] = []
  for (let k = 0; k <= N; k++) {
    const t = tRec + ((0.5 - tRec) * k) / N
    asc.push([x(t), y(testAsc(2 * t, d))])
  }
  const desc: string[] = []
  for (let k = 0; k <= 16; k++) {
    const I = 1 - ((1 - iDer) * k) / 16
    desc.push(pt(1 - I / 2, rPeak + ((R_DER - rPeak) * k) / 16))
  }

  // Brace height: max perpendicular distance from the recruitment-to-peak chord to the rate profile.
  const [x0, y0] = asc[0]
  const [x1, y1] = asc[N]
  const len = Math.hypot(x1 - x0, y1 - y0)
  const nx = (y1 - y0) / len
  const ny = -(x1 - x0) / len
  let kMax = 0
  let dMax = 0
  for (let k = 0; k <= N; k++) {
    const dist = (asc[k][0] - x0) * nx + (asc[k][1] - y0) * ny
    if (dist > dMax) [dMax, kMax] = [dist, k]
  }
  const foot: [number, number] = [asc[kMax][0] - dMax * nx, asc[kMax][1] - dMax * ny]
  const P = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`

  return {
    x, y, pw, ph,
    tRec, tDer, iDer,
    repA: repRate(I_REC, d),
    repD: repRate(iDer, d),
    rep: rep.join(' '),
    test: asc.map(P).join(' ') + ' ' + desc.join(' '),
    chord: [P(asc[0]), P(asc[N])],
    accel: asc.slice(0, kMax + 1).map(P).join(' ') + ' ' + P(foot),
    atten: P(foot) + ' ' + asc.slice(kMax).map(P).join(' '),
    brace: [P(foot), P(asc[kMax])],
    input: `${pt(0, 0)} ${pt(0.5, 0.88 * RMAX)} ${pt(1, 0)}`,
  }
}

const level = (d: number) => (d < 0.34 ? 'low' : d < 0.67 ? 'moderate' : 'high')

export default function NeuromodDial({ className }: NeuromodDialProps) {
  const id = useId()
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [target, setTarget] = useState(50)
  const [shown, setShown] = useState(0.5)
  const shownRef = useRef(0.5)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const to = target / 100
    const from = shownRef.current
    const set = (v: number) => {
      shownRef.current = v
      setShown(v)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return set(to)
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min((now - start) / 450, 1)
      set(from + (to - from) * (1 - (1 - p) ** 3))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  const df = deltaF(shown)
  const m = size.w > 0 && size.h > 0 ? model(shown, size.w, size.h) : null

  return (
    <figure className={`flex flex-col gap-4 text-ink-2 ${className ?? ''}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="min-w-[220px] flex-1 sm:max-w-sm">
          <label htmlFor={id} className="block font-mono text-[11px] tracking-wider text-iron uppercase">
            Monoaminergic drive (5-HT / NE)
          </label>
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            value={target}
            onChange={(e) => setTarget(+e.target.value)}
            aria-valuetext={`${level(target / 100)} drive, ${target} percent`}
            className="mt-2 w-full accent-red"
          />
          <div className="flex justify-between font-mono text-[10px] text-iron uppercase">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        <div className="text-right" aria-live="polite">
          <div className="font-mono text-[11px] tracking-wider text-iron uppercase">ΔF estimate</div>
          <div className="font-mono text-5xl leading-none tabular-nums">
            {df.toFixed(1)}
            <span className="ml-1 text-base text-iron">pps</span>
          </div>
        </div>
      </div>

      <div ref={box} className="relative min-h-0 flex-1">
        {m && (
          <svg
            width={size.w}
            height={size.h}
            className="absolute inset-0 block"
            role="img"
            aria-label={`Simulated firing rate of a test motor unit and a lower threshold reporter unit over a triangular synaptic input ramp at ${level(shown)} monoaminergic drive. The test unit recruits on the rising input and keeps firing on the falling input below its recruitment level. Delta F is ${df.toFixed(1)} pulses per second.`}
          >
            <polygon points={m.input} className="fill-paper-2" />
            <text x={m.x(0.5)} y={m.y(0.88 * RMAX) - 4} textAnchor="middle" className="fill-iron font-mono text-[10px]">
              synaptic input
            </text>

            {[0, 10, 20].map((r) => (
              <g key={r}>
                <line x1={M.l} x2={M.l + m.pw} y1={m.y(r)} y2={m.y(r)} className="stroke-steel" strokeWidth={1} />
                <text x={M.l - 6} y={m.y(r) + 3} textAnchor="end" className="fill-iron font-mono text-[10px]">
                  {r}
                </text>
              </g>
            ))}
            <text x={M.l} y={M.t - 4} className="fill-iron font-mono text-[10px]">pps</text>
            <text x={M.l + m.pw / 2} y={M.t + m.ph + 18} textAnchor="middle" className="fill-iron font-mono text-[10px]">
              time: input rises, then falls
            </text>

            <polygon points={m.accel} className="fill-red/20" />
            <polygon points={m.atten} className="fill-iron/20" />
            <polyline points={m.chord.join(' ')} fill="none" className="stroke-iron" strokeWidth={1} strokeDasharray="3 3" />
            <polyline points={m.brace.join(' ')} fill="none" className="stroke-ink-2" strokeWidth={1.25} />

            {[m.tRec, m.tDer].map((t) => (
              <line key={t} x1={m.x(t)} x2={m.x(t)} y1={M.t} y2={M.t + m.ph} className="stroke-red/50" strokeWidth={1} strokeDasharray="2 3" />
            ))}
            <text x={m.x(m.tRec) - 4} y={M.t + 10} textAnchor="end" className="fill-red font-mono text-[10px]">recruit</text>
            <text x={m.x(m.tDer) + 4} y={M.t + 10} className="fill-red font-mono text-[10px]">derecruit</text>

            <polyline points={m.rep} fill="none" className="stroke-iron" strokeWidth={1.5} />
            <polyline points={m.test} fill="none" className="stroke-red" strokeWidth={2.5} strokeLinejoin="round" />

            {/* Delta F: reporter rate at test recruitment minus at test derecruitment. */}
            <line x1={m.x(m.tRec)} x2={m.x(m.tDer)} y1={m.y(m.repA)} y2={m.y(m.repA)} className="stroke-ink-2/40" strokeDasharray="1 3" />
            <line x1={m.x(m.tDer) + 6} x2={m.x(m.tDer) + 6} y1={m.y(m.repA)} y2={m.y(m.repD)} className="stroke-ink-2" strokeWidth={1.5} />
            <text x={m.x(m.tDer) + 10} y={(m.y(m.repA) + m.y(m.repD)) / 2 + 3} className="fill-ink-2 font-mono text-[11px]">ΔF</text>
            <circle cx={m.x(m.tRec)} cy={m.y(m.repA)} r={3.5} className="fill-ink-2" />
            <circle cx={m.x(m.tDer)} cy={m.y(m.repD)} r={3.5} className="fill-ink-2" />
          </svg>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-iron uppercase">
        <span><i className="mr-1.5 inline-block h-0.5 w-4 bg-red align-middle" />test unit</span>
        <span><i className="mr-1.5 inline-block h-0.5 w-4 bg-iron align-middle" />reporter unit</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-3 bg-red/20 align-middle" />acceleration</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-3 bg-iron/20 align-middle" />attenuation</span>
        <span><i className="mr-1.5 inline-block h-3 w-px bg-ink-2 align-middle" />brace height</span>
      </div>

      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-iron">
        <span className="border border-iron/40 px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">Simulated</span>
        <span>More serotonin and norepinephrine amplify persistent inward currents: the same input gives faster acceleration, longer self-sustained firing and a larger ΔF.</span>
      </figcaption>
    </figure>
  )
}
