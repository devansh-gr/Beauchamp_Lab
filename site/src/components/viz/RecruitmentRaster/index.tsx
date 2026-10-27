import { useMemo, useRef } from 'react'
import type { FrameInfo } from '../../../lib/useCanvasLoop'
import { token, useCanvasLoop } from '../../../lib/useCanvasLoop'
import type { RecruitmentRasterProps } from '../types'

// Simulated after Beauchamp et al. 2022 J Neural Eng (10.1088/1741-2552/ac4594):
// continuous discharge rate estimates shown as a population.
// Model: threshold plus saturating rate gain per unit, size ordered thresholds (Henneman),
// derecruitment below recruitment threshold (persistent inward current hysteresis).

const N = 15
const BINS = 1000 // 10 s sweep
const DT = 0.01
const FMAX = 60
const PEAK = 50
const H = 20 // Hann half width in bins (400 ms window)
const GAP = 30
const TAU = 0.12

const RT = new Float32Array(N)
const DE = new Float32Array(N)
const RMAX = new Float32Array(N)
for (let i = 0; i < N; i++) {
  const u = i / (N - 1)
  RT[i] = 1 + (39 * (Math.exp(3 * u) - 1)) / (Math.exp(3) - 1)
  DE[i] = Math.max(0.3, RT[i] * 0.7 - 0.5)
  RMAX[i] = 32 - 12 * u // onion skin: early units fire faster
}
const R0 = 6
const GAIN = 1.2

const HANN = new Float32Array(2 * H + 1)
for (let k = 0; k <= 2 * H; k++) HANN[k] = 0.5 - 0.5 * Math.cos((2 * Math.PI * (k + 1)) / (2 * H + 2))

function unitRate(i: number, f: number) {
  const span = RMAX[i] - R0
  return R0 + span * (1 - Math.exp((-GAIN * (f - DE[i])) / span))
}

function ramp(tc: number) {
  if (tc < 1 || tc >= 9) return 0
  return tc < 5 ? (PEAK * (tc - 1)) / 4 : (PEAK * (9 - tc)) / 4
}

function gauss() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())
}

function makeSim() {
  return {
    head: 0,
    t: 0,
    f: 0,
    acc: 0,
    active: new Uint8Array(N),
    phase: new Float32Array(N),
    thr: new Float32Array(N).fill(1),
    last: new Float64Array(N).fill(-1),
    ir: new Float32Array(N),
    force: new Float32Array(BINS),
    spk: new Uint8Array(N * BINS),
    irBuf: new Float32Array(N * BINS),
    rate: new Float32Array(N * BINS),
  }
}
type Sim = ReturnType<typeof makeSim>

function step(s: Sim) {
  const b = s.head
  const goal = ramp(b * DT)
  s.f += (goal - s.f) * (DT / TAU)
  s.force[b] = s.f
  for (let i = 0; i < N; i++) {
    const o = i * BINS
    if (!s.active[i] && s.f >= RT[i]) {
      s.active[i] = 1
      s.phase[i] = s.thr[i]
    } else if (s.active[i] && s.f < DE[i]) {
      s.active[i] = 0
      s.ir[i] = 0
      s.last[i] = -1
    }
    s.spk[o + b] = 0
    if (s.active[i]) {
      s.phase[i] += unitRate(i, s.f) * DT
      if (s.phase[i] >= s.thr[i]) {
        s.spk[o + b] = 1
        if (s.last[i] >= 0) s.ir[i] = 1 / (s.t - s.last[i])
        s.last[i] = s.t
        s.phase[i] -= s.thr[i]
        s.thr[i] = Math.min(1.4, Math.max(0.7, 1 + 0.12 * gauss()))
      }
    }
    s.irBuf[o + b] = s.active[i] ? s.ir[i] : 0
    // Smoothed estimate centred H bins back, averaged only over bins with a valid rate.
    const c = (b - H + BINS) % BINS
    let num = 0
    let den = 0
    if (s.irBuf[o + c] > 0) {
      for (let k = 0; k <= 2 * H; k++) {
        const v = s.irBuf[o + ((c + k - H + BINS) % BINS)]
        if (v > 0) {
          num += HANN[k] * v
          den += HANN[k]
        }
      }
    }
    s.rate[o + c] = den > 0 ? num / den : 0
  }
  s.head = (b + 1) % BINS
  s.t += DT
}

const C = { ink: '', iron: '', red: '', paper2: '', steel: '', mono: '' }
const L = { l: 0, w: 0, fy: 0, fh: 0, ry: 0, rh: 0, qy: 0, qh: 0 }

export default function RecruitmentRaster({ className }: RecruitmentRasterProps) {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const sim = useMemo(() => {
    const s = makeSim()
    for (let k = 0; k < BINS; k++) step(s)
    return s
  }, [])
  const hover = useRef(-1)
  const lastFrame = useRef<FrameInfo | null>(null)

  const draw = (fi: FrameInfo) => {
    lastFrame.current = fi
    const { ctx, width: W, height: Ht, dt, reducedMotion } = fi
    if (!C.ink) {
      C.ink = token('--color-ink-2')
      C.iron = token('--color-iron')
      C.red = token('--color-red')
      C.paper2 = token('--color-paper-2')
      C.steel = token('--color-steel')
      C.mono = token('--font-mono')
    }
    const live = !reducedMotion
    if (live) {
      sim.acc += dt
      while (sim.acc >= DT) {
        step(sim)
        sim.acc -= DT
      }
    }

    const narrow = W < 480
    L.l = narrow ? 34 : 44
    L.w = W - L.l - 8
    const avail = Ht - 8 - 34 - 24
    L.fy = 8
    L.fh = avail * 0.24
    L.ry = L.fy + L.fh + 12
    L.rh = avail * 0.4
    L.qy = L.ry + L.rh + 12
    L.qh = avail * 0.36
    const xb = L.w / BINS
    const head = sim.head
    const hv = hover.current
    const gapF = (b: number) => live && (b - head + BINS) % BINS < GAP
    const gapR = (b: number) => live && ((b - head + BINS) % BINS < GAP || (head - b + BINS) % BINS <= H)

    ctx.clearRect(0, 0, W, Ht)
    ctx.font = `10px ${C.mono}`
    ctx.textBaseline = 'middle'

    // Panel frames and ticks
    ctx.strokeStyle = C.steel
    ctx.lineWidth = 1
    ctx.fillStyle = C.iron
    ctx.textAlign = 'right'
    ctx.beginPath()
    for (const v of [0, 30, 60]) {
      const y = L.fy + L.fh - (v / FMAX) * L.fh
      ctx.moveTo(L.l, y)
      ctx.lineTo(L.l + L.w, y)
      ctx.fillText(String(v), L.l - 6, y)
    }
    for (const v of [0, 20, 40]) {
      const y = L.qy + L.qh - (v / 40) * L.qh
      ctx.moveTo(L.l, y)
      ctx.lineTo(L.l + L.w, y)
      ctx.fillText(String(v), L.l - 6, y)
    }
    ctx.stroke()
    const rowH = L.rh / N
    ctx.fillText('1', L.l - 6, L.ry + L.rh - rowH / 2)
    ctx.fillText(String(N), L.l - 6, L.ry + rowH / 2)
    ctx.textAlign = 'center'
    const by = L.qy + L.qh + 12
    for (let s = 0; s <= 10; s += 2) ctx.fillText(String(s), L.l + (s / 10) * L.w, by)
    ctx.textAlign = 'left'
    ctx.fillStyle = C.ink
    ctx.fillText('force % MVC', L.l + 4, L.fy + 6)
    ctx.fillText('motor units, by threshold', L.l + 4, L.ry - 5)
    ctx.fillText('smoothed rate pps', L.l + 4, L.qy - 5)
    ctx.textAlign = 'right'
    ctx.fillStyle = C.iron
    ctx.fillText('time s', L.l + L.w, by + 11)

    // Hovered unit: row tint and its on / off thresholds on the force panel
    if (hv >= 0) {
      ctx.fillStyle = C.paper2
      ctx.fillRect(L.l, L.ry + (N - 1 - hv) * rowH, L.w, rowH)
      ctx.strokeStyle = C.red
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      for (const v of [RT[hv], DE[hv]]) {
        const y = L.fy + L.fh - (v / FMAX) * L.fh
        ctx.moveTo(L.l, y)
        ctx.lineTo(L.l + L.w, y)
      }
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = C.red
      ctx.fillText(
        `MU${hv + 1} on ${RT[hv].toFixed(1)} off ${DE[hv].toFixed(1)} % MVC`,
        L.l + L.w,
        L.ry - 5,
      )
    }

    // Force trace
    ctx.strokeStyle = C.ink
    ctx.lineWidth = 1.5
    ctx.beginPath()
    let pen = false
    for (let b = 0; b < BINS; b++) {
      if (gapF(b)) {
        pen = false
        continue
      }
      const x = L.l + b * xb
      const y = L.fy + L.fh - (Math.min(sim.force[b], FMAX) / FMAX) * L.fh
      if (pen) ctx.lineTo(x, y)
      else ctx.moveTo(x, y)
      pen = true
    }
    ctx.stroke()

    // Raster
    const tick = Math.max(2, rowH * 0.7)
    const sw = Math.max(1, Math.min(1.5, xb * 1.2))
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? C.red : C.ink
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        if ((i === hv) !== (pass === 1)) continue
        const o = i * BINS
        const y = L.ry + (N - 1 - i) * rowH + (rowH - tick) / 2
        for (let b = 0; b < BINS; b++) {
          if (sim.spk[o + b] && !gapF(b)) ctx.rect(L.l + b * xb, y, sw, tick)
        }
      }
      ctx.fill()
    }

    // Smoothed rate curves
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < N; i++) {
        if ((i === hv) !== (pass === 1)) continue
        ctx.strokeStyle = pass ? C.red : C.iron
        ctx.globalAlpha = pass ? 1 : hv >= 0 ? 0.35 : 0.7
        ctx.lineWidth = pass ? 2 : 1
        ctx.beginPath()
        const o = i * BINS
        pen = false
        for (let b = 0; b < BINS; b++) {
          const r = sim.rate[o + b]
          if (r <= 0 || gapR(b)) {
            pen = false
            continue
          }
          const x = L.l + b * xb
          const y = L.qy + L.qh - (Math.min(r, 40) / 40) * L.qh
          if (pen) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
          pen = true
        }
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1

    if (live) {
      const x = L.l + head * xb
      ctx.strokeStyle = C.red
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, L.fy)
      ctx.lineTo(x, L.qy + L.qh)
      ctx.stroke()
    }
  }

  const canvasRef = useCanvasLoop(draw)

  const local = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const setHover = (i: number) => {
    if (i === hover.current) return
    hover.current = i
    if (reduced && lastFrame.current) draw(lastFrame.current)
  }
  const rowAt = (y: number) =>
    y >= L.ry && y < L.ry + L.rh ? N - 1 - Math.floor(((y - L.ry) / L.rh) * N) : -1

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => setHover(rowAt(local(e).y))
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse') setHover(rowAt(local(e).y))
  }

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Simulated force ramp to ${PEAK} percent of maximum and back down. Top: force. Middle: spike raster of ${N} motor units recruited in order of size, lowest threshold at the bottom. Bottom: smoothed discharge rate of each unit. Each unit switches off at a lower force than it switched on.`}
        className="min-h-0 w-full flex-1 touch-pan-y"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(-1)}
      />
    </div>
  )
}
