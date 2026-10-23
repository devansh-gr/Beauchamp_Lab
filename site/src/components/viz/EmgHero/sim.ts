// Simulated HD-sEMG: motor unit spike trains (size-ordered recruitment, onion-skin rates)
// summed through spatial MUAP footprints into an n x n electrode grid, plus noise.

export const P = 6 // loop period, s
export const FS = 1000 // samples per s
const S = P * FS

export interface Sim {
  n: number
  units: number
  cx: Float32Array // footprint centre, grid coords
  cy: Float32Array
  sig: Float32Array // footprint spread, channels
  alpha: Float32Array // display opacity per unit
  featured: number
  spikes: Float32Array // spike times in [0, P), grouped by unit
  start: Int32Array // spikes of unit k: start[k]..start[k+1]
  weight: Float32Array // units * n * n, normalized footprint 0..1
  trace: Float32Array // (n * n) * S, normalized to about +-1
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Slow force envelope, fraction of max: 0.3 to 0.8 over one loop.
export const force = (t: number) => 0.55 - 0.25 * Math.cos((2 * Math.PI * t) / P)

export function simulate(n: number, units: number): Sim {
  const r = rng(7 + n)
  const gauss = () => r() + r() + r() - 1.5 // approx N(0, 0.5)
  const C = n * n
  const cx = new Float32Array(units)
  const cy = new Float32Array(units)
  const sig = new Float32Array(units)
  const alpha = new Float32Array(units)
  const th = new Float32Array(units)
  const rmax = new Float32Array(units)
  const scale = n / 8
  for (let k = 0; k < units; k++) {
    const q = k / (units - 1)
    th[k] = 0.02 + 0.68 * q ** 1.6 // Henneman: many small low-threshold units, few large ones
    rmax[k] = 25 - 9 * q // onion skin: earlier recruited units fire faster
    sig[k] = (0.9 + 1.1 * q) * scale // larger units, wider territory
    cx[k] = 0.8 * scale + r() * (n - 1 - 1.6 * scale)
    cy[k] = 0.8 * scale + r() * (n - 1 - 1.6 * scale)
    alpha[k] = 0.4 + 0.45 * r()
  }
  const featured = Math.floor(units / 3)
  alpha[featured] = 1

  // Spike trains: rate rises from 8 Hz at recruitment, capped at rmax; ISI CV about 0.1.
  const list: number[][] = []
  for (let k = 0; k < units; k++) {
    const out: number[] = []
    let ph = r()
    let thr = 1
    for (let i = -S; i < S; i++) {
      const t = i / FS
      const f = force(t)
      if (f < th[k]) {
        ph = 0
        continue
      }
      ph += Math.min(rmax[k], 8 + 40 * (f - th[k])) / FS
      if (ph >= thr) {
        ph -= thr
        thr = Math.max(0.85, 1 + 0.16 * gauss())
        if (i >= 0) out.push(t)
      }
    }
    list.push(out)
  }
  const start = new Int32Array(units + 1)
  for (let k = 0; k < units; k++) start[k + 1] = start[k] + list[k].length
  const spikes = new Float32Array(start[units])
  list.forEach((l, k) => spikes.set(l, start[k]))

  // Footprints and composite traces.
  const weight = new Float32Array(units * C)
  const trace = new Float32Array(C * S)
  for (let k = 0; k < units; k++) {
    const amp = 0.5 + (1.2 * k) / (units - 1)
    const w = 1.6 + (1.4 * k) / (units - 1) // MUAP phase width, ms
    for (let c = 0; c < C; c++) {
      const col = c % n
      const row = (c / n) | 0
      const d2 = (col - cx[k]) ** 2 + (row - cy[k]) ** 2
      const wt = Math.exp(-d2 / (2 * sig[k] * sig[k]))
      weight[k * C + c] = wt
      if (wt < 0.02) continue
      const delay = Math.abs(row - cy[k]) * 0.7 // propagation along fibres (columns), ms
      const base = c * S
      for (let s = start[k]; s < start[k + 1]; s++) {
        const i0 = Math.round(spikes[s] * FS)
        for (let j = -14; j <= 14; j++) {
          const tau = (j - delay) / w
          trace[base + ((i0 + j + S) % S)] += -amp * wt * tau * Math.exp(-0.5 * tau * tau)
        }
      }
    }
  }
  let peak = 0
  for (let i = 0; i < trace.length; i++) {
    trace[i] += 0.05 * gauss()
    peak = Math.max(peak, Math.abs(trace[i]))
  }
  const g = 1.6 / peak
  for (let i = 0; i < trace.length; i++) trace[i] *= g

  return { n, units, cx, cy, sig, alpha, featured, spikes, start, weight, trace }
}

// Most recent spike of unit k at or before loop time t (may come from the previous loop).
export function lastSpike(sim: Sim, k: number, t: number) {
  const a = sim.start[k]
  const b = sim.start[k + 1]
  if (a === b) return -1e9
  let lo = a
  let hi = b
  while (lo < hi) {
    const m = (lo + hi) >> 1
    if (sim.spikes[m] <= t) lo = m + 1
    else hi = m
  }
  return lo === a ? sim.spikes[b - 1] - P : sim.spikes[lo - 1]
}
