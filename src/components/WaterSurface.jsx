import { useEffect, useRef } from 'react'

/*
  Golden Water Surface
  Aesthetic goal: calm, deep, stable water with gentle golden light
  drifting across the floor, like a lit pool at golden hour.

  Two-layer approach:
  1. Smooth interference: 4 very-low-frequency sine waves produce wide,
     slowly shifting bands of warm gold. No spikes, no flicker.
  2. Physics ripples: a light height-field layer adds subtle displacement
     only when the user disturbs the surface.

  Everything moves at roughly 1/15th the old speed. Colors stay amber/gold
  and never saturate to white.
*/

const RES = 6
const DAMP = 0.9945

export default function WaterSurface() {
  const cvs = useRef(null)

  useEffect(() => {
    const canvas = cvs.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let cols, rows, cur, prv, idata, simCvs, simCtx
    let rafId = null

    const smoothstep = v => v * v * (3 - 2 * v)
    const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v

    function init() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      cols = Math.ceil(canvas.width / RES)
      rows = Math.ceil(canvas.height / RES)

      const n = cols * rows
      cur = new Float32Array(n)
      prv = new Float32Array(n)
      idata = new ImageData(cols, rows)

      simCvs = document.createElement('canvas')
      simCvs.width = cols
      simCvs.height = rows
      simCtx = simCvs.getContext('2d')
    }

    function disturb(px, py, strength, radius) {
      const cx = Math.floor(px / RES)
      const cy = Math.floor(py / RES)
      const r = Math.ceil(radius)

      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const sx = cx + dx
          const sy = cy + dy
          if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) continue

          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > radius) continue
          cur[sy * cols + sx] += strength * (1 - d / radius)
        }
      }
    }

    function step() {
      const next = prv

      for (let sy = 1; sy < rows - 1; sy++) {
        for (let sx = 1; sx < cols - 1; sx++) {
          const i = sy * cols + sx
          next[i] = (cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) / 2 - next[i]
          next[i] *= DAMP
        }
      }

      prv = cur
      cur = next
    }

    function render(t) {
      const ts = t * 0.00035
      const data = idata.data

      for (let sy = 0; sy < rows; sy++) {
        for (let sx = 0; sx < cols; sx++) {
          const i = sy * cols + sx
          const h = cur[i]
          const xn = sx / cols
          const yn = sy / rows

          const w1 = Math.sin(xn * 2.2 + yn * 1.4 + ts * 1.00)
          const w2 = Math.sin(xn * 1.5 - yn * 2.0 + ts * 0.72)
          const w3 = Math.cos(xn * 3.0 + yn * 0.8 + ts * 0.88)
          const w4 = Math.cos(xn * 0.9 + yn * 2.6 + ts * 0.60)

          const raw = w1 + w2 + w3 + w4
          const norm = clamp((raw + 4) / 8, 0, 1)
          const band = smoothstep(norm)
          const phys = clamp(h * 0.012, -0.08, 0.08)
          const bright = clamp(band * 0.42 + phys, 0, 1)
          const p = i * 4

          data[p] = Math.round(bright * 172)
          data[p + 1] = Math.round(bright * 125)
          data[p + 2] = Math.round(bright * 18)
          data[p + 3] = 255
        }
      }

      simCtx.putImageData(idata, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(simCvs, 0, 0, canvas.width, canvas.height)
    }

    function tick(t) {
      step()
      render(t)
      rafId = requestAnimationFrame(tick)
    }

    let lastMove = 0

    function onMouseMove(e) {
      const now = performance.now()
      if (now - lastMove < 60) return

      lastMove = now
      disturb(e.clientX, e.clientY, 3, 1.5)
    }

    function onClick(e) {
      disturb(e.clientX, e.clientY, 55, 4)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('click', onClick, { passive: true })
    window.addEventListener('resize', init, { passive: true })

    init()
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={cvs}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: 0.55,
      }}
    />
  )
}
