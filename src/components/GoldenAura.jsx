import { useEffect, useRef } from 'react'

/* Animated golden aura orbs — gentle breathe + drift + pulse */
export default function GoldenAura() {
  const cvs = useRef(null)

  useEffect(() => {
    const canvas = cvs.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    /* Each orb has:
       x/y   — base position (0-1 of viewport)
       r     — base radius as fraction of min(W,H)
       dx/dy — drift amplitude (how far it wanders)
       ds    — drift speed multiplier
       ps    — pulse speed multiplier
       phase — time offset so orbs are out of sync
       hue/sat/lit/alpha — colour                        */
    const orbs = [
      { x:0.12, y:0.18, r:0.55, dx:0.10, dy:0.08, ds:0.00045, ps:0.00062, phase:0.00, hue:40, sat:85, lit:62, alpha:0.22 },
      { x:0.85, y:0.12, r:0.62, dx:0.09, dy:0.10, ds:0.00038, ps:0.00055, phase:1.60, hue:44, sat:80, lit:58, alpha:0.18 },
      { x:0.70, y:0.78, r:0.48, dx:0.11, dy:0.09, ds:0.00052, ps:0.00070, phase:2.80, hue:36, sat:90, lit:55, alpha:0.20 },
      { x:0.28, y:0.72, r:0.42, dx:0.08, dy:0.11, ds:0.00042, ps:0.00048, phase:4.20, hue:46, sat:78, lit:60, alpha:0.16 },
      { x:0.92, y:0.52, r:0.44, dx:0.10, dy:0.08, ds:0.00048, ps:0.00058, phase:0.90, hue:38, sat:88, lit:57, alpha:0.15 },
      { x:0.50, y:0.30, r:0.38, dx:0.07, dy:0.07, ds:0.00035, ps:0.00065, phase:3.50, hue:42, sat:82, lit:64, alpha:0.14 },
    ]

    let animId
    const draw = (ts) => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      orbs.forEach(o => {
        /* Lissajous-style drift: x and y move at different speeds */
        const driftX = Math.sin(ts * o.ds        + o.phase) * o.dx
        const driftY = Math.cos(ts * o.ds * 0.73 + o.phase + 1.1) * o.dy

        /* Breathe: radius gently expands and contracts */
        const breathe = 1 + Math.sin(ts * o.ps + o.phase * 0.5) * 0.18

        /* Shimmer: alpha pulses slightly */
        const shimmer = 1 + Math.sin(ts * o.ps * 1.3 + o.phase) * 0.25

        const cx     = (o.x + driftX) * W
        const cy     = (o.y + driftY) * H
        const radius = o.r * Math.min(W, H) * 0.5 * breathe
        const alpha  = o.alpha * shimmer

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grd.addColorStop(0,    `hsla(${o.hue},${o.sat}%,${o.lit}%,${(alpha * 0.90).toFixed(3)})`)
        grd.addColorStop(0.30, `hsla(${o.hue},${o.sat}%,${o.lit}%,${(alpha * 0.65).toFixed(3)})`)
        grd.addColorStop(0.58, `hsla(${o.hue},${o.sat}%,${o.lit}%,${(alpha * 0.28).toFixed(3)})`)
        grd.addColorStop(0.82, `hsla(${o.hue},${o.sat}%,${o.lit}%,${(alpha * 0.07).toFixed(3)})`)
        grd.addColorStop(1,    `hsla(${o.hue},${o.sat}%,${o.lit}%,0)`)

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={cvs}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
      }}
    />
  )
}
