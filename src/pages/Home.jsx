import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Assets - preserving existing imports
import heroDirtyPortrait from '../assets/hero-dirty.png'
import heroPrettyPortrait from '../assets/hero-preity.png'
import hairColourPhoto from '../assets/haircolur.jpg'
import hairStylingPhoto from '../assets/servise1.jpg'
import beautyTreatPhoto from '../assets/servise3.jpg'
import nailArtPhoto from '../assets/servise4.jpg'
import makeupBridalPhoto from '../assets/servise5.jpg'
import studioExpPhoto from '../assets/servise6.jpg'
import storyPortrait from '../assets/ya.jpg'

gsap.registerPlugin(ScrollTrigger)

/* ── CONSTANTS & VARIANTS ── */

const services = [
  { img: hairStylingPhoto, title: 'Master Styling', sub: 'Cuts - Blowouts - Finishing', price: '$85' },
  { img: hairColourPhoto, title: 'Hair Colouring', sub: 'Balayage - Glossing - Toning', price: '$145' },
  { img: makeupBridalPhoto, title: 'Makeup & Bridal', sub: 'Soft Glam - Bridal - Editorial', price: '$120' },
  { img: nailArtPhoto, title: 'Nail Art', sub: 'Manicures - Extensions - Design', price: '$75' },
  { img: beautyTreatPhoto, title: 'Skin Rituals', sub: 'Lashes - Brows - Facials', price: '$95' },
  { img: studioExpPhoto, title: 'Studio Experience', sub: 'Full Day - Occasion - Shoots', price: '$249' },
]

const stats = [
  { val: 500, suffix: '+', label: 'Happy Clients' },
  { val: 8, suffix: '', label: 'Years of Art' },
  { val: 50, suffix: '+', label: 'Awards Won' },
  { val: 6, suffix: '', label: 'Specialists' },
]

const testimonials = [
  { text: 'The studio feels calm, elegant, and precise. I left with exactly the look I had imagined.', author: 'Seraphina J.', img: hairStylingPhoto },
  { text: 'Every detail felt intentional, from the consultation to the final styling. A beautiful experience.', author: 'Elena M.', img: makeupBridalPhoto },
  { text: 'Glamore gave me polished hair and makeup that lasted through the entire event.', author: 'Julian V.', img: hairColourPhoto },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
}

/* ── COMPONENT: CINEMATIC SPLASH ── */

function SplashIntro({ onComplete }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let particles = []
    let animationFrame
    const text = 'GLAMORE'

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    document.fonts.ready.then(() => {
      if (!textRef.current) return
      const style = window.getComputedStyle(textRef.current)
      const fontSize = parseFloat(style.fontSize)
      const letterSpacing = parseFloat(style.letterSpacing) || (fontSize * 0.25)
      const fontWeight = style.fontWeight
      const fontFamily = style.fontFamily

      ctx.fillStyle = 'white'
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'left'

      let totalWidth = 0
      const charWidths = []
      for (let i = 0; i < text.length; i++) {
        const w = ctx.measureText(text[i]).width
        charWidths.push(w)
        totalWidth += w
        if (i < text.length - 1) totalWidth += letterSpacing
      }

      let currentX = (canvas.width - totalWidth) / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], currentX, centerY)
        currentX += charWidths[i] + letterSpacing
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const step = 4
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          if (imageData[(y * canvas.width + x) * 4 + 3] > 128) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              targetX: x,
              targetY: y,
              size: Math.random() * 2 + 1,
              color: `rgba(201, 169, 110, ${Math.random() * 0.7 + 0.3})`,
              vx: 0, vy: 0,
              friction: 0.88,
              ease: 0.04 + Math.random() * 0.04
            })
          }
        }
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        particles.forEach(p => {
          const dx = p.targetX - p.x
          const dy = p.targetY - p.y
          p.vx += dx * p.ease
          p.vy += dy * p.ease
          p.vx *= p.friction
          p.vy *= p.friction
          p.x += p.vx
          p.y += p.vy

          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
        animationFrame = requestAnimationFrame(animate)
      }
      animate()
    })

    const tl = gsap.timeline({
      onComplete: () => {
        cancelAnimationFrame(animationFrame)
        onComplete()
      }
    })

    tl.to(textRef.current, { opacity: 1, duration: 1.2, ease: 'power2.inOut', delay: 0.3 })
      .to(containerRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 0.2
      })

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="glamore-splash">
      <div className="splash-aura" />
      <div className="splash-grain" />
      <canvas ref={canvasRef} className="glamore-splash-canvas" />
      <h1 ref={textRef} className="glamore-logo-metallic" style={{
        opacity: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
        padding: 0,
        zIndex: 10,
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}>GLAMORE</h1>
      <div className="glamore-splash-overlay" />
    </div>
  )
}

/* ── COMPONENT: INTERACTIVE BEAUTY PORTRAIT ── */

function BrushRevealPortrait() {
  const canvasRef = useRef(null)
  const revealMaskRef = useRef(null)
  const tempCanvasRef = useRef(null) // Persistent buffer
  const dirtyImgRef = useRef(null)
  const prettyImgRef = useRef(null)
  const isHoveringRef = useRef(false)
  const lastPaintRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const rafRef = useRef(null)
  const particlesRef = useRef([])
  const [isBrushing, setIsBrushing] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    let count = 0
    const check = () => {
      const d = dirtyImgRef.current
      const p = prettyImgRef.current
      if (d?.complete && d.naturalWidth && p?.complete && p.naturalWidth) {
        setImagesLoaded(true)
      } else if (count < 60) {
        count++
        setTimeout(check, 100)
      }
    }
    check()
  }, [])

  useEffect(() => {
    const pCanvas = canvasRef.current
    if (!pCanvas || !imagesLoaded) return

    const mask = document.createElement('canvas')
    revealMaskRef.current = mask

    const tempCanvas = document.createElement('canvas')
    tempCanvasRef.current = tempCanvas

    const pCtx = pCanvas.getContext('2d', { alpha: true })
    const mCtx = mask.getContext('2d')

    let dirtyCache = null
    let prettyCache = null
    let fadeMask = null

    const buildFadeMask = (W, H) => {
      const fm = document.createElement('canvas')
      fm.width = W; fm.height = H
      const fc = fm.getContext('2d')
      fc.fillStyle = 'white'
      fc.fillRect(0, 0, W, H)
      fc.globalCompositeOperation = 'destination-out'
      const addFade = (x0, y0, x1, y1, rx, ry, rw, rh) => {
        const g = fc.createLinearGradient(x0, y0, x1, y1)
        g.addColorStop(0, 'rgba(0,0,0,1)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        fc.fillStyle = g
        fc.fillRect(rx, ry, rw, rh)
      }
      addFade(0, 0, 0, H * 0.12, 0, 0, W, H * 0.12)
      addFade(0, H, 0, H * 0.88, 0, H * 0.88, W, H * 0.12)
      addFade(0, 0, W * 0.1, 0, 0, 0, W * 0.1, H)
      addFade(W, 0, W * 0.9, 0, W * 0.9, 0, W * 0.1, H)
      return fm
    }

    const drawCover = (ctx, img, W, H) => {
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
      const dW = img.naturalWidth * scale, dH = img.naturalHeight * scale
      const dx = (W - dW) / 2, dy = (H - dH) / 2
      ctx.drawImage(img, dx, dy, dW, dH)
    }

    const createLayerBuffer = (img, W, H) => {
      if (!img?.naturalWidth) return null
      const cvs = document.createElement('canvas')
      cvs.width = W; cvs.height = H
      drawCover(cvs.getContext('2d'), img, W, H)
      return cvs
    }

    const resize = () => {
      const rect = pCanvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const W = Math.floor(rect.width * dpr)
      const H = Math.floor(rect.height * dpr)
      if (W === 0 || H === 0) return

      pCanvas.width = W
      pCanvas.height = H
      mask.width = W
      mask.height = H
      tempCanvas.width = W
      tempCanvas.height = H

      mCtx.lineCap = 'round'
      mCtx.lineJoin = 'round'
      fadeMask = buildFadeMask(W, H)

      dirtyCache = createLayerBuffer(dirtyImgRef.current, W, H)
      prettyCache = createLayerBuffer(prettyImgRef.current, W, H)
    }

    const tick = () => {
      const PW = pCanvas.width, PH = pCanvas.height
      if (PW === 0 || PH === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const now = Date.now()
      if (!isHoveringRef.current && now - lastActivityRef.current > 3000) {
        mCtx.globalCompositeOperation = 'destination-in'
        mCtx.fillStyle = 'rgba(0,0,0,0.995)'
        mCtx.fillRect(0, 0, PW, PH)
        mCtx.globalCompositeOperation = 'source-over'
      }

      pCtx.clearRect(0, 0, PW, PH)
      if (dirtyCache) pCtx.drawImage(dirtyCache, 0, 0)

      if (prettyCache && tempCanvasRef.current) {
        const tCanvas = tempCanvasRef.current
        const tCtx = tCanvas.getContext('2d')

        tCtx.clearRect(0, 0, PW, PH)
        tCtx.globalCompositeOperation = 'source-over'
        tCtx.drawImage(mask, 0, 0)
        tCtx.globalCompositeOperation = 'source-in'
        tCtx.drawImage(prettyCache, 0, 0)

        pCtx.save()
        if (isHoveringRef.current) {
          pCtx.shadowBlur = 40
          pCtx.shadowColor = 'rgba(201, 169, 110, 0.5)'
        }
        pCtx.drawImage(tCanvas, 0, 0)
        pCtx.restore()
      }

      if (fadeMask) {
        pCtx.globalCompositeOperation = 'destination-in'
        pCtx.drawImage(fadeMask, 0, 0)
        pCtx.globalCompositeOperation = 'source-over'
      }

      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy
        p.life -= 0.015; p.vx *= 0.98; p.vy *= 0.98
      })
      particlesRef.current = particlesRef.current.filter(p => p.life > 0)
      particlesRef.current.forEach(p => {
        pCtx.fillStyle = `rgba(201, 169, 110, ${p.life * 0.8})`
        pCtx.beginPath(); pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); pCtx.fill()
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(pCanvas)
    resize()
    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [imagesLoaded])

  const paintReveal = useCallback((cx_pct, cy_pct) => {
    const mask = revealMaskRef.current
    if (!mask) return
    const mCtx = mask.getContext('2d')
    const x = (cx_pct / 100) * mask.width
    const y = (cy_pct / 100) * mask.height
    const r = Math.min(mask.width, mask.height) * 0.22

    const grad = mCtx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.7)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')

    mCtx.save()
    mCtx.fillStyle = grad
    mCtx.globalCompositeOperation = 'source-over'
    mCtx.beginPath(); mCtx.arc(x, y, r, 0, Math.PI * 2); mCtx.fill()
    mCtx.restore()

    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 2 + 0.5,
        life: 1
      })
    }
    lastActivityRef.current = Date.now()
  }, [])

  const handlePointer = useCallback((e) => {
    if (!isHoveringRef.current && e.type !== 'pointerdown') return
    const rect = canvasRef.current.getBoundingClientRect()
    const cx = ((e.clientX - rect.left) / rect.width) * 100
    const cy = ((e.clientY - rect.top) / rect.height) * 100
    const last = lastPaintRef.current
    const dx = last ? cx - last.x : 0
    const dy = last ? cy - last.y : 0
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 1.5))
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      paintReveal(last ? last.x + dx * t : cx, last ? last.y + dy * t : cy)
    }
    lastPaintRef.current = { x: cx, y: cy }
    e.currentTarget.style.setProperty('--brush-x', `${cx}%`)
    e.currentTarget.style.setProperty('--brush-y', `${cy}%`)
  }, [paintReveal])

  const reset = () => {
    const mask = revealMaskRef.current
    if (!mask) return
    mask.getContext('2d').clearRect(0, 0, mask.width, mask.height)
    paintReveal(54, 42)
  }

  useEffect(() => {
    const timer = setTimeout(() => paintReveal(54, 42), 1000)
    return () => clearTimeout(timer)
  }, [paintReveal])

  return (
    <motion.div
      className={`home-brush-card${isBrushing ? ' is-painting' : ''}`}
      onPointerDown={(e) => {
        if (e.target.closest('.home-brush-reset')) return
        isHoveringRef.current = true
        setIsBrushing(true)
        handlePointer(e)
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={handlePointer}
      onPointerUp={() => {
        isHoveringRef.current = false
        setIsBrushing(false)
        lastPaintRef.current = null
      }}
    >
      <div className="home-brush-aura" />
      <div className="home-brush-frame">
        <div className="home-brush-texture" />
        <canvas ref={canvasRef} className="home-brush-canvas" />
        <img ref={dirtyImgRef} src={heroDirtyPortrait} alt="" style={{ display: 'none' }} />
        <img ref={prettyImgRef} src={heroPrettyPortrait} alt="" style={{ display: 'none' }} />
        <div className="home-magic-reveal"><span /><span /><span /><span /><span /></div>
        <div className="home-brush-hint">Brush to Reveal Glow</div>
        <div className="portrait-float-tag pft-glow"><i className="pft-dot" /><span>Signature Glow</span></div>
      </div>
      <div className="home-brush-badge">
        <span>Est. 2016</span>
        <strong>Ritual of Artistry</strong>
      </div>
      <button className="home-brush-reset" onClick={reset}>Reset</button>
    </motion.div>
  )
}

/* ── COMPONENT: STATS COUNTER ── */

function StatCounter({ target, suffix, label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            setCount(Math.floor(this.targets()[0].val))
          }
        })
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="stat-item">
      <strong className="stat-num">{count}{suffix}</strong>
      <span className="stat-label">{label}</span>
    </div>
  )
}

/* ── COMPONENT: FLOATING 3D ELEMENTS ── */

function FloatingHeroElements() {
  const elements = [
    { size: 40, x: '10%', y: '20%', delay: 0 },
    { size: 60, x: '85%', y: '15%', delay: 1 },
    { size: 30, x: '75%', y: '80%', delay: 2 },
    { size: 50, x: '5%', y: '70%', delay: 0.5 },
  ]

  return (
    <div className="floating-hero-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: 1,
            y: [0, -40, 0],
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            width: el.size,
            height: el.size,
            border: '1px solid rgba(201, 169, 110, 0.3)',
            background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.1), transparent)',
            borderRadius: i % 2 === 0 ? '50%' : '4px',
            backdropFilter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  )
}

/* ── MAIN HOME COMPONENT ── */

export default function Home() {
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const heroCopyRef = useRef(null)
  const heroMediaRef = useRef(null)
  const serviceSectionRef = useRef(null)
  const serviceTrackRef = useRef(null)
  const testimonialsSectionRef = useRef(null)
  const testimonialsTrackRef = useRef(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false)

  useEffect(() => {
    if (loading || isTestimonialHovered) return
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [loading, isTestimonialHovered])

  // Preload hero assets while splash is showing
  useEffect(() => {
    const assets = [heroDirtyPortrait, heroPrettyPortrait, storyPortrait]
    assets.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    if (loading) {
      document.body.classList.add('glamore-splash-lock')
    } else {
      document.body.classList.remove('glamore-splash-lock')
    }
    return () => document.body.classList.remove('glamore-splash-lock')
  }, [loading])

  useEffect(() => {
    if (loading) return
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const xPos = (clientX / innerWidth) - 0.5
      const yPos = (clientY / innerHeight) - 0.5
      gsap.to(heroCopyRef.current, {
        rotateY: xPos * 10, rotateX: -yPos * 10, x: xPos * 20, y: yPos * 20,
        duration: 1.2, ease: 'power2.out'
      })
      gsap.to(heroMediaRef.current, {
        rotateY: xPos * 15, rotateX: -yPos * 15, x: -xPos * 30, y: -yPos * 30,
        duration: 1.5, ease: 'power2.out'
      })
      gsap.to('.home-hero-bg', {
        x: -xPos * 50, y: -yPos * 50, duration: 2, ease: 'power2.out'
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [loading])

  const [activeIndex, setActiveIndex] = useState(1)

  const handleTrackScroll = useCallback((e) => {
    if (window.innerWidth >= 1025) return // handled by GSAP
    const track = e.currentTarget
    const cards = track.querySelectorAll('.home-horizontal-card')
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
    let closestIndex = 0
    let minDiff = Infinity
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const diff = Math.abs(cardCenter - trackCenter)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = idx
      }
    })
    cards.forEach((card, idx) => {
      if (idx === closestIndex) {
        card.classList.add('is-active')
      } else {
        card.classList.remove('is-active')
      }
    })
    setActiveIndex(closestIndex + 1)

    // Update progress bar
    const maxScroll = track.scrollWidth - track.clientWidth
    if (maxScroll > 0) {
      const progress = track.scrollLeft / maxScroll
      const rail = document.querySelector('.home-service-rail i')
      if (rail) {
        rail.style.transform = `scaleX(${progress})`
      }
    }
  }, [])

  useEffect(() => {
    if (loading) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1025px)', () => {
      const track = serviceTrackRef.current
      const section = serviceSectionRef.current
      if (!track || !section) return
      const cards = gsap.utils.toArray('.home-horizontal-card')
      
      const firstCard = cards[0]
      const lastCard = cards[cards.length - 1]

      const getXStart = () => window.innerWidth / 2 - (firstCard.offsetLeft + firstCard.offsetWidth / 2)
      const getXEnd = () => window.innerWidth / 2 - (lastCard.offsetLeft + lastCard.offsetWidth / 2)
      const getDistance = () => getXStart() - getXEnd()

      // Set initial state for progress rail i
      gsap.set('.home-service-rail i', { scaleX: 0, transformOrigin: 'left' })

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 2, // Heavy weighted smooth momentum
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      })
      
      mainTimeline.fromTo(track, { x: () => getXStart() }, { x: () => getXEnd(), ease: 'none' })
      
      cards.forEach((card, i) => {
        const inner = card.querySelector('img')
        const copy = card.querySelector('.home-horizontal-card-copy')
        gsap.set(card, { transformPerspective: 1000 }) // Lower value creates a much more pronounced 3D effect
        
        // Visual distortion/scaling as card scrolls through screen
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: mainTimeline,
          start: 'left right',
          end: 'right left',
          scrub: true,
          onUpdate: (self) => {
            let dist = self.progress - 0.5
            if (i === cards.length - 1 && mainTimeline.scrollTrigger.progress > 0.98) dist = 0
            if (i === 0 && mainTimeline.scrollTrigger.progress < 0.02) dist = 0
            const absDist = Math.abs(dist)
            gsap.set(card, {
              rotateY: dist * -80, // Stronger 3D rotation
              z: -absDist * 750,   // Deeper translation along the Z-axis for a high-end 3D tunnel focus
              scale: 1 - absDist * 0.25, // Softened scaling down to keep cards prominent
              opacity: 1 - absDist * 0.7,
              filter: `blur(${absDist * 3.5}px) brightness(${1 - absDist * 0.35})`, // Clean, premium depth-of-field blur
              transformOrigin: dist > 0 ? 'left center' : 'right center'
            })
            if (inner) gsap.set(inner, { x: dist * 160, scale: 1.15 + absDist * 0.15, rotateY: dist * 15 })
            if (copy) gsap.set(copy, { z: 150, x: dist * -60, rotateY: dist * 10, opacity: 1 - absDist * 2.2 })
          }
        })

        // Active state and index indicator tracking
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: mainTimeline,
          start: 'left center',
          end: 'right center',
          onToggle: (self) => {
            if (self.isActive) {
              card.classList.add('is-active')
              setActiveIndex(i + 1)
            } else {
              card.classList.remove('is-active')
            }
          }
        })
      })

      gsap.to('.home-service-rail i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1.2
        }
      })
    })
    return () => mm.revert()
  }, [loading])

  useEffect(() => {
    if (loading) return
    gsap.to('.home-story-image img', {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: '.home-story', start: 'top bottom', end: 'bottom top', scrub: true }
    })
  }, [loading])

  useEffect(() => {
    if (loading) return
    
    // Entrance animation for testimonials section
    gsap.fromTo('.testimonials-section .home-section-head, .testimonials-section .home-testimonial-stack',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
        }
      }
    )
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <SplashIntro key="splash" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <motion.main
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="home-premium"
        style={{
          visibility: loading ? 'hidden' : 'visible',
          opacity: loading ? 0 : 1
        }}
      >
          {/* 1. HERO SECTION */}
          <section ref={heroRef} className="home-hero premium-home-hero" style={{ perspective: '2000px' }}>
            <div className="home-hero-bg" />
            <FloatingHeroElements />
            <div className="home-hero-filigree" />
            <div className="home-hero-side-rule" />
            <div className="container home-hero-grid" style={{ transformStyle: 'preserve-3d' }}>
              <motion.div
                ref={heroCopyRef}
                className="home-hero-copy"
                initial="hidden"
                animate="show"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.4
                    }
                  }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.p className="home-eyebrow" variants={fadeUp}>✦ Los Angeles Â· Premium Studio</motion.p>
                <motion.h1
                  className="home-title"
                  variants={fadeUp}
                  style={{ transform: 'translateZ(50px)' }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span>Reveal</span>
                  <em>Your</em>
                  <span>Glow.</span>
                </motion.h1>
                <motion.p className="home-lede" variants={fadeUp} style={{ transform: 'translateZ(30px)' }}>
                  A cinematic beauty ritual where skincare, makeup, and confidence converge &mdash; crafted by artists who see beauty as a language.
                </motion.p>
                <motion.div className="home-hero-actions" variants={fadeUp} style={{ transform: 'translateZ(20px)' }}>
                  <Link to="/booking" className="btn btn-gold">Book the Ritual</Link>
                  <Link to="/services" className="btn btn-outline">Our Services</Link>
                </motion.div>
              </motion.div>

              <motion.div
                ref={heroMediaRef}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  y: [0, 15, 0]
                }}
                transition={{
                  opacity: { duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
                  scale: { duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
                  filter: { duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div style={{ transform: 'translateZ(100px)' }}>
                  <BrushRevealPortrait />
                </div>
              </motion.div>

              <div className="home-hero-tags" style={{ transform: 'translateZ(150px)' }}>
                <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}><i>✦</i> Signature Care</motion.span>
                <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}><i>✦</i> Artistry</motion.span>
                <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}><i>✦</i> Confidence</motion.span>
              </div>
            </div>
            <div className="scroll-cue">
              <span className="cue-line" />
              <span>Scroll</span>
            </div>
          </section>

          {/* 2. LUXURY MARQUEE */}
          <section className="luxury-marquee">
            <div className="luxury-marquee-track">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="marquee-group">
                  <span className="luxury-marquee-item">Bridal Glam</span>
                  <span className="luxury-marquee-item">Â·</span>
                  <span className="luxury-marquee-item">Hair Artistry</span>
                  <span className="luxury-marquee-item">Â·</span>
                  <span className="luxury-marquee-item">Skin Rituals</span>
                  <span className="luxury-marquee-item">Â·</span>
                  <span className="luxury-marquee-item">Nail Design</span>
                  <span className="luxury-marquee-item">Â·</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. SERVICES HORIZONTAL SCROLL */}
          <section ref={serviceSectionRef} className="home-horizontal-services">
            <div className="home-horizontal-bg" />
            <div className="home-horizontal-head">
              <div className="home-horizontal-titles">
                <p className="home-eyebrow">Our Mastery</p>
                <h2>Signature <em>Services</em></h2>
                <span className="home-index-start">{String(activeIndex).padStart(2, '0')}</span>
              </div>
              <div className="home-service-progress">
                <div className="home-service-rail"><i /></div>
                <span>{String(services.length).padStart(2, '0')}</span>
              </div>
            </div>
            <div ref={serviceTrackRef} className="home-horizontal-track" onScroll={handleTrackScroll}>
              {services.map((s, i) => (
                <div key={s.title} className="home-horizontal-card">
                  <img src={s.img} alt={s.title} />
                  <div className="home-horizontal-card-shade" />
                  <div className="home-horizontal-card-copy">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <h3>{s.title}</h3>
                    <p>{s.sub}</p>
                  </div>
                  <div className="home-horizontal-card-footer">
                    <strong>{s.price}</strong>
                    <Link to="/booking">Reserve</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. STORY SECTION */}
          <section className="section home-story" style={{ overflow: 'hidden' }}>
            <div className="container home-story-grid">
              <motion.div
                className="home-story-image"
                initial={{ opacity: 0, x: -100, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={storyPortrait} alt="Founder" style={{ filter: 'brightness(1.1) contrast(1.05)' }} />
                <div className="story-image-overlay" />
              </motion.div>

              <motion.div
                className="home-story-copy"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
              >
                <motion.p className="home-eyebrow" variants={fadeUp}>The Atelier</motion.p>
                <motion.h2
                  variants={fadeUp}
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '2rem' }}
                >
                  Where beauty becomes a <em>cinematic</em> journey.
                </motion.h2>
                <motion.p variants={fadeUp} style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '540px' }}>
                  Glamore was founded on the belief that beauty isn't just about the final look&mdash;it's about the feeling of being seen, heard, and transformed through artistry that respects your individuality.
                </motion.p>
                <motion.div variants={fadeUp} style={{ marginTop: '2.5rem' }}>
                  <Link to="/about" className="btn btn-outline">Our Story</Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 6. STATS SECTION */}
          <section className="numbers-strip">
            {stats.map(s => (
              <StatCounter key={s.label} {...s} target={s.val} />
            ))}
          </section>

          <section ref={testimonialsSectionRef} className="section testimonials-section" style={{ position: 'relative', overflow: 'hidden', padding: '100px 0 110px', display: 'flex', alignItems: 'center' }}>
            <div className="testimonials-bg-aura" />
            <div className="container" style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="home-section-head center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="home-eyebrow"
                >
                  Client Voices
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  The <em>Experience</em>
                </motion.h2>
              </div>
              <div 
                className="home-testimonial-stack" 
                onMouseEnter={() => setIsTestimonialHovered(true)}
                onMouseLeave={() => setIsTestimonialHovered(false)}
                style={{ 
                  position: 'relative', 
                  height: '380px', 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  perspective: '2000px', 
                  transformStyle: 'preserve-3d',
                  marginTop: '50px'
                }}
              >
                {testimonials.map((t, i) => {
                  const diff = (i - activeTestimonial + testimonials.length) % testimonials.length;
                  const isActive = diff === 0;
                  const isBehind = diff === 1;
                  const isFarBehind = diff === 2;
                  
                  const zIndex = testimonials.length - diff;
                  
                  let transform = '';
                  let opacity = 1;
                  let filter = 'blur(0px)';
                  let pointerEvents = 'auto';
                  
                  if (isActive) {
                    transform = 'translate3d(0, 0, 0) scale(1) rotateX(0deg)';
                    opacity = 1;
                    filter = 'blur(0px)';
                    pointerEvents = 'auto';
                  } else if (isBehind) {
                    transform = 'translate3d(0, -32px, -150px) scale(0.94) rotateX(-4deg)';
                    opacity = 0.65;
                    filter = 'blur(2.5px)';
                    pointerEvents = 'auto';
                  } else if (isFarBehind) {
                    transform = 'translate3d(0, -64px, -300px) scale(0.88) rotateX(-8deg)';
                    opacity = 0.35;
                    filter = 'blur(5px)';
                    pointerEvents = 'auto';
                  } else {
                    transform = 'translate3d(0, -90px, -450px) scale(0.82) rotateX(-12deg)';
                    opacity = 0;
                    filter = 'blur(8px)';
                    pointerEvents = 'none';
                  }

                  return (
                    <motion.div
                      key={t.author}
                      className={`home-testimonial premium-testimonial-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => setActiveTestimonial(i)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
                      }}
                      style={{
                        position: 'absolute',
                        width: 'min(100% - 32px, 700px)',
                        top: 0,
                        transformStyle: 'preserve-3d',
                        transform,
                        opacity,
                        filter,
                        zIndex,
                        pointerEvents,
                        cursor: isActive ? 'default' : 'pointer',
                        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease, filter 0.8s ease',
                      }}
                    >
                      <div className="card-edge-highlight" />
                      <div className="value-card-inner">
                        <div className="testimonial-quote-icon">“</div>
                        <p>"{t.text}"</p>
                        <div className="testimonial-footer">
                          <div className="testimonial-author-line" />
                          <strong>{t.author}</strong>
                        </div>
                      </div>
                      <div className="testimonial-card-glow" />
                    </motion.div>
                  )
                })}
              </div>

              {/* Testimonial Indicators */}
              <div className="testimonial-indicators" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '40px' }}>
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    style={{
                      width: activeTestimonial === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: activeTestimonial === idx ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                      outline: 'none'
                    }}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 8. CTA SECTION */}
          <section className="home-cta">
            <div className="container home-cta-inner">
              <div className="cta-text">
                <p className="home-eyebrow">Ready for the transformation?</p>
                <h2>Your next ritual awaits.</h2>
              </div>
              <Link to="/booking" className="btn btn-gold">Reserve Your Session</Link>
            </div>
          </section>

          {/* 9. FOOTER */}
          <footer className="footer-mini">
            <div className="container center">
              <div className="footer-logo">GLAMORE</div>
              <p className="t-dim">Â© 2024 GLAMORE ATELIER. ALL RIGHTS RESERVED.</p>
              <div className="footer-socials" style={{ justifyContent: 'center', marginTop: '30px' }}>
                <a href="#" className="footer-social">IG</a>
                <a href="#" className="footer-social">FB</a>
                <a href="#" className="footer-social">TW</a>
              </div>
            </div>
          </footer>
        </motion.main>
    </>
  )
}
