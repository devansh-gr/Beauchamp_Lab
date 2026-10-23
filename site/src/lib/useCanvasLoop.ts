import { useEffect, useRef } from 'react'

export interface FrameInfo {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  t: number
  dt: number
  reducedMotion: boolean
}

/**
 * DPR-aware canvas loop. Pauses offscreen and when the tab is hidden.
 * With prefers-reduced-motion it draws one frame per resize instead of animating.
 */
export function useCanvasLoop(draw: (f: FrameInfo) => void) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    let last = performance.now()
    const start = last

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      drawRef.current({ ctx, width, height, t: (now - start) / 1000, dt, reducedMotion })
      if (!reducedMotion && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      width = r.width
      height = r.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      kick()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) kick()
    })
    io.observe(canvas)

    const onVis = () => !document.hidden && visible && kick()
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return ref
}

/** Read a design token (CSS custom property) for canvas drawing. */
export function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
