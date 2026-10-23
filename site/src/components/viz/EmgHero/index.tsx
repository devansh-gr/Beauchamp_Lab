import { useEffect, useRef } from 'react'
import type { EmgHeroProps } from '../types'
import { token, useCanvasLoop, type FrameInfo } from '../../../lib/useCanvasLoop'
import { FS, P, lastSpike, simulate, type Sim } from './sim'

const WIN = 0.25 // s of signal shown per channel
const FLOW = 0.35 // s for a spike to travel from grid to raster
const DMIN = 0.15

const smooth = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return u * u * (3 - 2 * u)
}

// Decomposition level over the loop: raw only, units resolve, hold, relax.
const decomp = (t: number) => {
  const l = ((t % P) + P) % P
  return DMIN + (1 - DMIN) * (smooth(1, 2.5, l) - smooth(5.2, 6, l))
}

export default function EmgHero({ className }: EmgHeroProps) {
  const sims = useRef<Record<number, Sim>>({})
  const st = useRef({ px: -1e4, py: -1e4, hx: 0, hy: 0, hv: 0, col: null as null | Record<string, string> })
  const canvas = useCanvasLoop(draw)

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = canvas.current?.getBoundingClientRect()
      if (!r) return
      st.current.px = e.clientX - r.left
      st.current.py = e.clientY - r.top
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [canvas])

  function draw({ ctx, width: W, height: H, t: now, dt, reducedMotion }: FrameInfo) {
    ctx.clearRect(0, 0, W, H)
    if (W < 10 || H < 10) return
    const s0 = st.current
    const col = (s0.col ??= {
      paper: token('--color-paper'),
      red: token('--color-red-bright'),
      iron: token('--color-iron'),
      mono: token('--font-mono') || 'monospace',
    })
    const mobile = W < 640
    const n = mobile ? 6 : 8
    const sim = (sims.current[n] ??= simulate(n, mobile ? 8 : 12))
    const N = sim.units
    const C = n * n
    const t = reducedMotion ? 3.6 : now + 0.6
    const tl = t % P
    const dNow = reducedMotion ? 1 : decomp(t)

    // Layout: grid with raster to its right; lower-left kept for the page's text.
    let s: number, gx: number, gy: number, rx0: number, rx1: number
    if (mobile) {
      s = Math.min(W * 0.5, H * 0.32)
      gx = 16
      gy = Math.max(104, H * 0.14)
      rx0 = gx + s + 18
      rx1 = W - 16
    } else {
      s = Math.min(H * 0.56, W * 0.28)
      gx = W * 0.4
      gy = H * 0.47 - s * 0.55
      rx0 = gx + s + W * 0.04
      rx1 = W - W * 0.04
    }
    const cw = s / n
    const rowH = s / N
    const span = mobile ? 1.5 : 3 // s of raster visible
    const speed = (rx1 - rx0) / span
    const quiet = (x: number, y: number) =>
      1 - 0.7 * smooth(W * 0.58, W * 0.3, x) * smooth(H * 0.42, H * 0.65, y)

    // Hover: eased position and strength over the grid.
    const inGrid = s0.px > gx - cw && s0.px < gx + s + cw && s0.py > gy - cw && s0.py < gy + s + cw
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 8)
    s0.hv += ((inGrid ? 1 : 0) - s0.hv) * k
    if (inGrid) {
      s0.hx += ((s0.px - gx) / cw - 0.5 - s0.hx) * k
      s0.hy += ((s0.py - gy) / cw - 0.5 - s0.hy) * k
    }

    const fs = mobile ? 9 : 10
    ctx.font = `${fs}px ${col.mono}`
    ctx.textBaseline = 'alphabetic'

    // Footprints of units that just fired.
    for (let u = 0; u < N; u++) {
      const age = tl - lastSpike(sim, u, tl)
      const e = Math.exp(-age / 0.045)
      if (e < 0.03) continue
      ctx.fillStyle = u === sim.featured ? col.red : col.paper
      const a0 = dNow * e * sim.alpha[u] * (u === sim.featured ? 0.24 : 0.08)
      for (let c = 0; c < C; c++) {
        const w = sim.weight[u * C + c]
        if (w < 0.15) continue
        const x = gx + (c % n) * cw
        const y = gy + ((c / n) | 0) * cw
        ctx.globalAlpha = a0 * w * quiet(x, y)
        ctx.fillRect(x + 1, y + 1, cw - 2, cw - 2)
      }
    }

    // Featured unit territory.
    const fx = gx + (sim.cx[sim.featured] + 0.5) * cw
    const fy = gy + (sim.cy[sim.featured] + 0.5) * cw
    ctx.strokeStyle = col.red
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.55 * dNow * quiet(fx, fy)
    ctx.beginPath()
    ctx.arc(fx, fy, sim.sig[sim.featured] * cw * 1.25, 0, Math.PI * 2)
    ctx.stroke()

    // Electrode dots and composite traces.
    const samples = WIN * FS
    const pad = cw * 0.1
    const tw = cw - 2 * pad
    const bin = Math.max(1, Math.floor(samples / tw))
    const nb = Math.floor(samples / bin)
    const S = P * FS
    const sNow = Math.floor(tl * FS)
    const b0 = (Math.floor(sNow / bin) - nb) * bin
    const amp = cw * 0.32
    ctx.strokeStyle = col.paper
    for (let c = 0; c < C; c++) {
      const ci = c % n
      const ri = (c / n) | 0
      const x = gx + ci * cw + pad
      const y = gy + ri * cw + cw * 0.5
      const hb = s0.hv * Math.exp(-((ci - s0.hx) ** 2 + (ri - s0.hy) ** 2) / 3)
      const q = quiet(x, y)
      ctx.globalAlpha = 0.5 * q
      ctx.fillStyle = col.iron
      ctx.fillRect(x - pad + 1, y - cw * 0.5 + 1, 1, 1)
      ctx.globalAlpha = Math.min(1, (0.34 * (1 - 0.3 * dNow) + 0.4 * hb) * q)
      ctx.beginPath()
      const base = c * S
      for (let b = 0; b < nb; b++) {
        let v = 0
        const i0 = b0 + b * bin
        for (let j = 0; j < bin; j++) {
          const x2 = sim.trace[base + ((i0 + j + 2 * S) % S)]
          if (Math.abs(x2) > Math.abs(v)) v = x2
        }
        v = Math.max(-1, Math.min(1, v))
        const px = x + (b * tw) / (nb - 1)
        if (b) ctx.lineTo(px, y - v * amp)
        else ctx.moveTo(px, y - v * amp)
      }
      ctx.stroke()
    }

    // Spikes: flow from footprint to raster row, then scroll right.
    for (let u = 0; u < N; u++) {
      const ry = gy + (N - 1 - u) * rowH + rowH * 0.5
      const ux = gx + (sim.cx[u] + 0.5) * cw
      const uy = gy + (sim.cy[u] + 0.5) * cw
      const mx = gx + s + (rx0 - gx - s) * 0.5
      ctx.fillStyle = u === sim.featured ? col.red : col.paper
      ctx.globalAlpha = 0.07 * quiet(rx0, ry)
      ctx.fillRect(rx0, ry, rx1 - rx0, 1)
      const ua = sim.alpha[u]
      const th = Math.min(14, rowH * 0.5)
      for (let m = 0; m < 2; m++) {
        for (let i = sim.start[u]; i < sim.start[u + 1]; i++) {
          const ts = sim.spikes[i] - m * P
          const age = tl - ts
          if (age < 0 || age > FLOW + span) continue
          const ds = reducedMotion ? 1 : decomp(ts)
          if (age < FLOW) {
            if (reducedMotion) continue
            const p = age / FLOW
            const a = 1 - p
            const bx = a * a * ux + 2 * a * p * mx + p * p * rx0
            const by = a * a * uy + 2 * a * p * ry + p * p * ry
            ctx.globalAlpha = ds * ds * ua * 0.8 * quiet(bx, by)
            ctx.fillRect(bx - 1, by - 1, 2, 2)
          } else {
            const x = rx0 + (age - FLOW) * speed
            ctx.globalAlpha = 0.85 * ds * ua * smooth(rx1, rx1 - 40, x) * quiet(x, ry)
            ctx.fillRect(x, ry - th * 0.5, 1, th)
          }
        }
      }
    }

    // Labels.
    ctx.globalAlpha = 0.55
    ctx.fillStyle = col.paper
    ctx.textAlign = 'left'
    ctx.fillText(`HD-sEMG, ${C} ch`, gx, gy - 12)
    ctx.fillText('Decomposed motor units', rx0, gy - 12)
    ctx.globalAlpha = 0.4
    ctx.fillRect(rx0, gy + s + 12, speed, 1)
    ctx.fillText('1 s', rx0 + speed + 6, gy + s + 12 + fs * 0.35)
    const tag = 'Simulated'
    const tw2 = ctx.measureText(tag).width + 10
    let tx = rx1 - tw2
    let ty = gy + s + 4
    if (rx1 - rx0 < 280) {
      tx = gx
      ty = gy + s + 4
    }
    ctx.strokeStyle = col.iron
    ctx.globalAlpha = 0.8
    ctx.strokeRect(Math.round(tx) + 0.5, Math.round(ty) + 0.5, Math.round(tw2), fs + 8)
    ctx.fillStyle = col.paper
    ctx.globalAlpha = 0.6
    ctx.fillText(tag, tx + 5, ty + fs + 3)
    ctx.globalAlpha = 1
  }

  return (
    <div
      role="img"
      aria-label="Simulated high-density surface EMG: an electrode grid of live muscle signals decomposes into individual motor units, whose spike trains scroll out as a raster, recruited in size order and firing at 8 to 25 Hz."
      className={`relative overflow-hidden ${className ?? ''}`}
    >
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  )
}
