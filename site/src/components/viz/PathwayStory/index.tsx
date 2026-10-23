import { useEffect, useId, useState } from 'react'
import type { PathwayStoryProps } from '../types'

// Schematic of the descending motor pathway, cortex to muscle, and the lab's readout back up it.
// SVG + CSS animation only: no remount between steps, opacity transitions, reduced motion is static.

type G = { x: number; y: number; s: number }
interface Layout {
  vb: string
  fs: number
  brain: G
  inset: G
  muscle: G
  cordTop: number
  cordBot: number
  horn: number
  nerve: string
  leaders: [number, number][]
  cordLabel: [number, number]
  backLabel: [number, number]
}

const CX = 200 // cord midline, both layouts

const WIDE: Layout = {
  vb: '0 0 800 600',
  fs: 12,
  brain: { x: 40, y: 22, s: 1 },
  inset: { x: 330, y: 22, s: 1 },
  muscle: { x: 330, y: 372, s: 1 },
  cordTop: 204,
  cordBot: 585,
  horn: 430,
  nerve: 'M212,430 C280,430 320,338 400,338 L510,338 C532,338 540,370 540,424',
  leaders: [[330, 22], [330, 312]],
  cordLabel: [24, 300],
  backLabel: [224, 466],
}

const TALL: Layout = {
  vb: '0 0 400 800',
  fs: 14,
  brain: { x: 40, y: 22, s: 1 },
  inset: { x: 30, y: 345, s: 0.8 },
  muscle: { x: 13, y: 600, s: 0.85 },
  cordTop: 204,
  cordBot: 330,
  horn: 300,
  nerve: 'M212,300 C330,300 388,306 388,350 L388,566 C388,598 192,592 192,644',
  leaders: [[30, 345], [382, 345]],
  cordLabel: [16, 262],
  backLabel: [222, 328],
}

// Readout spike trains: integer spikes per 120 px period so the scroll loops seamlessly.
const PERIOD = 120
const TRAINS = [8, 6, 5, 4].map((n, r) => {
  let d = ''
  for (let k = 0; k < 2 * n; k++) {
    const x = (k * PERIOD) / n + 3 * Math.sin((k % n) * 2.3 + r)
    d += `M${x.toFixed(1)},${r * 26} v-12 `
  }
  return d
})

const FIBERS = [-3, -2, -1, 0, 1, 2, 3].map((k) => `M24,95 C90,${95 + k * 15} 210,${95 + k * 15} 276,95`)
const UNIT = new Set([-2, 0, 1, 3]) // fibers of the one highlighted motor unit

const CSS = `
.ps-l{fill:none;stroke:var(--color-paper);stroke-opacity:.5;stroke-width:1;vector-effect:non-scaling-stroke}
.ps-f{stroke-opacity:.22}
.ps-r{fill:none;stroke:var(--color-red-bright);stroke-width:1.5;stroke-linecap:round;vector-effect:non-scaling-stroke}
.ps-dot{fill:var(--color-red-bright)}
.ps-t{fill:var(--color-paper);fill-opacity:.55;font-family:var(--font-mono);letter-spacing:.06em}
.ps-h{fill-opacity:.85}
.ps-g{transition:opacity .8s var(--ease-out-expo),transform .8s var(--ease-out-expo)}
.ps-p{fill:none;stroke:var(--color-red-bright);stroke-width:2.5;stroke-linecap:round;stroke-dasharray:1 11;animation:ps-dash 1.4s linear infinite;transition:opacity .6s}
@keyframes ps-dash{to{stroke-dashoffset:-12}}
.ps-glow{animation:ps-breathe 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes ps-breathe{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.45;transform:scale(.88)}}
.ps-blink{animation:ps-blink .3s steps(1) infinite}
@keyframes ps-blink{0%{opacity:1}50%{opacity:.25}}
.ps-scroll{animation:ps-scroll 2.4s linear infinite}
@keyframes ps-scroll{to{transform:translateX(-${PERIOD}px)}}
@media (prefers-reduced-motion:reduce){.ps-p,.ps-glow,.ps-blink,.ps-scroll{animation:none}}
`

function useNarrow() {
  const q = '(max-width: 767px)'
  const [narrow, set] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => set(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return narrow
}

const tf = (g: G) => `translate(${g.x} ${g.y}) scale(${g.s})`

export default function PathwayStory({ className, step }: PathwayStoryProps) {
  const L = useNarrow() ? TALL : WIDE
  const id = useId().replace(/:/g, '')
  const fs = { fontSize: L.fs }
  // Region emphasis: active region full, others dimmed.
  const dim = (i: number) => ({ opacity: step === i ? 1 : 0.26 })
  // Pulses visible and running only while they belong to the story so far.
  const flow = (on: boolean, reverse = false) => ({
    opacity: on ? 1 : 0,
    animationPlayState: on ? 'running' : 'paused',
    animationDirection: reverse ? 'reverse' : 'normal',
  })
  const hot = (i: number) => (step === i ? 'ps-t ps-h' : 'ps-t')
  const cord = `M${CX},${L.cordTop} L${CX - 3},${L.horn - 12} Q${CX - 3},${L.horn} ${CX + 5},${L.horn}`
  const roots: string[] = []
  for (let y = L.cordTop + 22; y < L.cordBot - 30; y += 26) roots.push(`M188,${y} l-7,5 M212,${y} l7,5`)

  return (
    <div className={className}>
      <svg
        viewBox={L.vb}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label={`Schematic of the motor pathway from brain to muscle, step ${step + 1} of 4: ${
          ['motor cortex sends descending commands', 'commands travel down the brainstem and spinal cord, where brainstem nuclei release serotonin and norepinephrine', 'a spinal motoneuron integrates excitatory, inhibitory and neuromodulatory inputs and fires spikes', 'the muscle is recorded with a high density surface EMG grid, and the lab reads the spike trains back up the pathway'][step]
        }.`}
      >
        <style>{CSS}</style>
        <defs>
          <radialGradient id={`${id}g`}>
            <stop offset="0" style={{ stopColor: 'var(--color-red-bright)', stopOpacity: 0.45 }} />
            <stop offset="1" style={{ stopColor: 'var(--color-red-bright)', stopOpacity: 0 }} />
          </radialGradient>
          <clipPath id={`${id}c`}>
            <rect x="306" y="40" width="124" height="100" />
          </clipPath>
        </defs>

        {/* 01 cortex + 02 brainstem, drawn in brain-local coordinates */}
        <g transform={tf(L.brain)}>
          <g className="ps-g" style={dim(0)}>
            <text className={hot(0)} style={fs} x="0" y="-6">01 CORTEX</text>
            <path className="ps-l" d="M22,98 C8,62 40,16 102,9 C160,3 222,22 238,66 C246,92 236,116 212,122 C196,126 184,120 174,118 C160,121 150,124 140,124 C118,132 86,130 70,118 C52,126 28,118 22,98 Z" />
            <path className="ps-l ps-f" d="M132,7 C124,34 136,54 124,80 M72,114 C100,96 136,92 166,86 M206,26 C200,46 212,60 206,82 M50,50 C70,40 90,38 104,44 M176,120 C178,146 206,158 228,146 C240,138 238,122 226,116 M188,132 C200,140 214,140 226,132 M190,142 C204,149 216,148 226,142" />
            <path className={step === 0 ? 'ps-r' : 'ps-l'} d="M118,9 C112,34 122,54 111,79" />
          </g>
          <g className="ps-g" style={dim(1)}>
            <circle className="ps-glow" cx="162" cy="146" r="46" fill={`url(#${id}g)`} style={{ opacity: step === 1 ? 1 : 0 }} />
            <path className="ps-l" d="M142,122 C134,140 144,162 152,182 M174,118 C182,136 174,162 168,182" />
            <circle className="ps-dot" cx="158" cy="152" r="3" />
            <circle className="ps-dot" cx="167" cy="136" r="3" />
            <text className={hot(1)} style={fs} x="134" y="166" textAnchor="end">5-HT</text>
            <text className={hot(1)} style={fs} x="184" y="176">NE</text>
          </g>
          <path className="ps-p" pathLength={100} d="M114,44 C122,80 146,98 156,124 L160,182" style={flow(step < 3)} />
        </g>

        {/* 02 spinal cord */}
        <g className="ps-g" style={dim(1)}>
          <path className="ps-l" d={`M188,${L.cordTop} L188,${L.cordBot - 20} Q${CX},${L.cordBot + 8} 212,${L.cordBot - 20} L212,${L.cordTop}`} />
          <path className="ps-l ps-f" d={roots.join(' ')} />
          <text className={hot(1)} style={fs} x={L.cordLabel[0]} y={L.cordLabel[1]}>02 BRAINSTEM</text>
          <text className={hot(1)} style={fs} x={L.cordLabel[0]} y={L.cordLabel[1] + L.fs + 4}>+ SPINAL CORD</text>
        </g>
        <path className="ps-p" pathLength={100} d={cord} style={flow(step >= 1 && step < 3)} />
        <path className="ps-p" pathLength={100} d={cord} style={flow(step === 3, true)} />

        {/* leader from ventral horn to the motoneuron inset */}
        <g className="ps-g" style={dim(2)}>
          <circle className={step === 2 ? 'ps-dot' : 'ps-l'} cx={CX + 5} cy={L.horn} r="4" />
          {L.leaders.map(([x, y], i) => (
            <path key={i} className="ps-l ps-f" strokeDasharray="2 4" d={`M${CX + 5},${L.horn} L${x},${y}`} />
          ))}
        </g>

        {/* 03 motoneuron inset */}
        <g transform={tf(L.inset)}>
          <g className="ps-g" style={{ ...dim(2), transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${step === 2 ? 1 : 0.97})` }}>
            <rect className="ps-l ps-f" x="0" y="0" width="440" height="290" rx="4" />
            <text className={hot(2)} style={fs} x="14" y="24">03 SPINAL MOTONEURON</text>
            <circle className="ps-glow" cx="150" cy="150" r="80" fill={`url(#${id}g)`} />
            <path className="ps-l" d="M150,138 C120,110 100,90 70,70 M100,92 C106,72 112,60 118,46 M148,162 C115,180 95,200 60,215 M95,198 C85,225 80,240 78,255 M165,127 C160,95 168,70 180,50 M168,174 C165,205 175,230 185,255 M194,150 L420,150" />
            <circle className="ps-l" cx="170" cy="150" r="24" />
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} className="ps-l" x={222 + k * 40} y="146" width="30" height="8" rx="4" />
            ))}
            <path className="ps-l" d="M14,70 L62,70 M120,14 C150,22 172,36 178,46" />
            <circle className="ps-dot" cx="66" cy="70" r="4" />
            <circle className="ps-dot" cx="180" cy="50" r="4" />
            <path className="ps-l" d="M14,215 L54,215 M57,207 L57,223 M140,284 L178,260 M174,254 L184,266" />
            <path className="ps-l" strokeDasharray="1 4" d="M14,128 C60,128 90,138 124,146" />
            <text className="ps-t" style={fs} x="14" y="58">excitatory</text>
            <text className="ps-t" style={fs} x="14" y="118">5-HT / NE</text>
            <text className="ps-t" style={fs} x="14" y="274">inhibitory</text>
            <text className="ps-t" style={fs} x="240" y="182">spikes on the axon</text>
            <path className="ps-p" pathLength={100} d="M194,150 L420,150" style={{ ...flow(step >= 2), animationDuration: '.9s' }} />
          </g>
        </g>

        {/* peripheral nerve, forward then read backwards */}
        <path className="ps-l ps-f" d={L.nerve} />
        <path className="ps-p" pathLength={100} d={L.nerve} style={flow(step === 2)} />
        <path className="ps-p" pathLength={100} d={L.nerve} style={flow(step === 3, true)} />
        <text className="ps-t ps-h ps-g" style={{ ...fs, fill: 'var(--color-red-bright)', opacity: step === 3 ? 1 : 0 }} x={L.backLabel[0]} y={L.backLabel[1]}>
          read backwards
        </text>

        {/* 04 muscle + HD-sEMG grid + readout */}
        <g transform={tf(L.muscle)}>
          <g className="ps-g" style={dim(3)}>
            <text className={hot(3)} style={fs} x="0" y="14">04 MUSCLE + HD-sEMG</text>
            <path className="ps-l" d="M0,95 L24,95 C80,28 220,28 276,95 C220,162 80,162 24,95 M276,95 L300,95" />
            {FIBERS.map((d, i) => (
              <path
                key={i}
                d={d}
                className={step === 3 && UNIT.has(i - 3) ? 'ps-r ps-blink' : 'ps-l ps-f'}
                style={{ strokeWidth: 1, animationDuration: `${2.4 / 8}s` }}
              />
            ))}
            {Array.from({ length: 64 }, (_, i) => (
              <circle
                key={i}
                cx={115 + (i % 8) * 10}
                cy={60 + Math.floor(i / 8) * 10}
                r="1.6"
                className={step === 3 && (i * 37) % 9 === 0 ? 'ps-dot ps-blink' : 'ps-dot'}
                style={{ fillOpacity: step === 3 ? 1 : 0.5, fill: step === 3 ? undefined : 'var(--color-paper)', animationDelay: `${(i % 5) * 0.06}s` }}
              />
            ))}
            <text className="ps-t" style={{ fontSize: L.fs - 2 }} x="150" y="180" textAnchor="middle">8 x 8 grid on the skin</text>
            <text className="ps-t" style={{ fontSize: L.fs - 2 }} x="306" y="32">spike trains</text>
            <g clipPath={`url(#${id}c)`}>
              <g transform="translate(306 66)">
                <g className="ps-scroll" style={{ animationPlayState: step === 3 ? 'running' : 'paused' }}>
                  {TRAINS.map((d, r) => (
                    <path key={r} d={d} className={step === 3 ? 'ps-r' : 'ps-l'} style={{ strokeWidth: 1 }} />
                  ))}
                </g>
              </g>
            </g>
            <text className="ps-t" style={{ fontSize: L.fs - 3 }} x="306" y="160">schematic</text>
          </g>
        </g>
      </svg>
    </div>
  )
}
