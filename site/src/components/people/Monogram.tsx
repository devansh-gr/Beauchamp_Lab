function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function initials(name: string) {
  const parts = name.replace(/,.*$/, '').split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/** Deterministic spike train: baseline with spikes at name-seeded positions. */
function spikePath(name: string) {
  const r = rng(hash(name))
  const W = 200
  const base = 150
  let d = `M0 ${base}`
  let x = 0
  while (x < W) {
    x += 8 + r() * 18
    if (x >= W - 4) break
    const h = 14 + r() * 40
    d += ` L${(x - 1.5).toFixed(1)} ${base} L${x.toFixed(1)} ${(base - h).toFixed(1)} L${(x + 1.5).toFixed(1)} ${base}`
  }
  return d + ` L${W} ${base}`
}

export default function Monogram({ name }: { name: string }) {
  return (
    <div role="img" aria-label={`${name}, no photo`} className="relative flex h-full w-full items-center justify-center overflow-hidden bg-ink">
      <svg viewBox="0 0 200 250" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={spikePath(name)} fill="none" stroke="var(--color-red)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative mb-24 font-sans text-6xl font-medium tracking-tighter text-paper">{initials(name)}</span>
    </div>
  )
}
