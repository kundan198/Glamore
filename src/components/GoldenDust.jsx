import { useEffect, useRef } from 'react'

function makeTrailParticle(x, y) {
  const angle = Math.random() * Math.PI * 2
  const speed = 0.25 + Math.random() * 0.9

  return {
    x: x + (Math.random() - 0.5) * 18,
    y: y + (Math.random() - 0.5) * 18,
    vx: Math.cos(angle) * speed * 0.48,
    vy: Math.sin(angle) * speed * 0.48 - 0.28,
    r: 0.42 + Math.random() * 1.05,
    life: 0,
    max: 28 + Math.random() * 24,
    hue: 42 + Math.random() * 12,
    alpha: 0.72 + Math.random() * 0.28,
  }
}

export default function GoldenDust() {
  const cvs = useRef(null)

  useEffect(() => {
    const canvas = cvs.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []
    let W = 0
    let H = 0
    let raf = 0
    let lastEmit = 0

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const emit = (x, y, count = 3) => {
      for (let i = 0; i < count; i++) particles.push(makeTrailParticle(x, y))
      if (particles.length > 150) particles.splice(0, particles.length - 150)
    }

    const onPointerMove = e => {
      const now = performance.now()
      if (now - lastEmit < 20) return
      lastEmit = now
      emit(e.clientX, e.clientY, 4)
    }

    const onPointerDown = e => emit(e.clientX, e.clientY, 16)

    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += 1
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.985
        p.vy *= 0.985

        const progress = p.life / p.max
        const fade = Math.max(0, 1 - progress)
        const radius = p.r * (1 + progress * 0.75)

        ctx.globalAlpha = p.alpha * fade
        ctx.fillStyle = `hsl(${p.hue}, 96%, 72%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = p.alpha * fade * 0.62
        ctx.fillStyle = 'rgba(255, 250, 218, 0.95)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.18, radius * 0.42), 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = p.alpha * fade * 0.16
        ctx.fillStyle = `hsl(${p.hue}, 96%, 72%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 3.6, 0, Math.PI * 2)
        ctx.fill()

        if (p.life >= p.max) particles.splice(i, 1)
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  return (
    <canvas
      ref={cvs}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9996,
        pointerEvents: 'none',
      }}
    />
  )
}
