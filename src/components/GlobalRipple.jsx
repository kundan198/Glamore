import { useEffect } from 'react'

/* Water-drop ripple cursor trail. */
export default function GlobalRipple() {
  useEffect(() => {
    let lastMove = 0
    let lastClick = 0

    function spawn(x, y, count, baseDelay, sizeMulti, strength) {
      for (let i = 0; i < count; i++) {
        const ring = document.createElement('span')
        ring.className = 'water-drop-ring'
        ring.style.left = `${x}px`
        ring.style.top = `${y}px`
        ring.style.setProperty('--ring-delay', `${i * baseDelay}ms`)
        ring.style.setProperty('--ring-scale', `${sizeMulti + i * 2.4}`)
        ring.style.setProperty('--ring-strength', strength)
        ring.style.setProperty('--ring-index', i)
        document.body.appendChild(ring)
        setTimeout(() => ring.remove(), 1000 + i * baseDelay + 200)
      }
    }

    const onMove = e => {
      const now = performance.now()
      if (now - lastMove < 140) return
      lastMove = now
      spawn(e.clientX, e.clientY, 2, 90, 2.6, 0.4)
    }

    const onClick = e => {
      const now = performance.now()
      if (now - lastClick < 120) return
      lastClick = now
      spawn(e.clientX, e.clientY, 3, 70, 3.2, 0.8)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('click', onClick, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
