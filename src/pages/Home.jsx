import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

const services = [
  { img: hairColourPhoto, title: 'Hair Colouring', sub: 'Balayage - Glossing - Toning', price: '$145' },
  { img: hairStylingPhoto, title: 'Master Styling', sub: 'Cuts - Blowouts - Finishing', price: '$85' },
  { img: beautyTreatPhoto, title: 'Beauty Treatments', sub: 'Lashes - Brows - Facials', price: '$95' },
  { img: nailArtPhoto, title: 'Nail Art', sub: 'Manicures - Extensions - Design', price: '$75' },
  { img: makeupBridalPhoto, title: 'Makeup & Bridal', sub: 'Soft Glam - Bridal - Editorial', price: '$120' },
  { img: studioExpPhoto, title: 'Studio Experience', sub: 'Full Day - Occasion - Shoots', price: '$249' },
]

const stats = [
  ['500+', 'Happy Clients'],
  ['8', 'Years of Art'],
  ['6', 'Specialists'],
  ['50+', 'Awards Won'],
]

const tags = ['Signature Glow', 'Premium Care', 'Artistry', 'Confidence']

const testimonials = [
  { text: 'The studio feels calm, elegant, and precise. I left with exactly the look I had imagined.', author: 'Seraphina J.' },
  { text: 'Every detail felt intentional, from the consultation to the final styling. A beautiful experience.', author: 'Elena M.' },
  { text: 'Glamore gave me polished hair and makeup that lasted through the entire event.', author: 'Julian V.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
}

function BrushRevealPortrait() {
  const canvasRef = useRef(null)
  const maskRef = useRef(null)
  const dirtyImgRef = useRef(null)
  const prettyImgRef = useRef(null)
  const rafRef = useRef(null)
  const lastPaintRef = useRef(null)
  const isPaintingRef = useRef(false)
  const [isPainting, setIsPainting] = useState(false)

  const paintReveal = useCallback((xPct, yPct) => {
    const mask = maskRef.current
    if (!mask?.width || !mask.height) return

    const ctx = mask.getContext('2d')
    const x = (xPct / 100) * mask.width
    const y = (yPct / 100) * mask.height
    const radius = Math.min(mask.width, mask.height) * 0.115

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.34, 'rgba(255,255,255,0.94)')
    gradient.addColorStop(0.68, 'rgba(255,255,255,0.44)')
    gradient.addColorStop(0.91, 'rgba(255,255,255,0.11)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const mask = document.createElement('canvas')
    maskRef.current = mask

    const canvasCtx = canvas.getContext('2d')
    const maskCtx = mask.getContext('2d')
    let dirtyLayer = null
    let prettyLayer = null
    let layerWidth = 0
    let layerHeight = 0

    const drawCover = (ctx, img, filter) => {
      if (!img?.complete || !img.naturalWidth) return
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
      const drawWidth = img.naturalWidth * scale
      const drawHeight = img.naturalHeight * scale
      const x = (width - drawWidth) / 2
      const y = (height - drawHeight) * 0.16

      if (filter) ctx.filter = filter
      ctx.drawImage(img, x, y, drawWidth, drawHeight)
      ctx.filter = 'none'
    }

    const createLayer = (img, removeDarkEdge = false) => {
      if (!img?.complete || !img.naturalWidth || !canvas.width || !canvas.height) return null

      const layer = document.createElement('canvas')
      layer.width = canvas.width
      layer.height = canvas.height
      const ctx = layer.getContext('2d', { willReadFrequently: removeDarkEdge })
      drawCover(ctx, img)

      if (!removeDarkEdge) return layer

      const image = ctx.getImageData(0, 0, layer.width, layer.height)
      const data = image.data
      const width = layer.width
      const height = layer.height
      const seen = new Uint8Array(width * height)
      const stack = []

      const isEdgeBg = (idx) => {
        const p = idx * 4
        return Math.max(data[p], data[p + 1], data[p + 2]) < 46
      }

      for (let x = 0; x < width; x += 1) {
        stack.push(x, (height - 1) * width + x)
      }
      for (let y = 0; y < height; y += 1) {
        stack.push(y * width, y * width + width - 1)
      }

      while (stack.length) {
        const idx = stack.pop()
        if (idx < 0 || idx >= seen.length || seen[idx] || !isEdgeBg(idx)) continue

        seen[idx] = 1
        const p = idx * 4
        const max = Math.max(data[p], data[p + 1], data[p + 2])
        data[p + 3] = max < 24 ? 0 : Math.round(data[p + 3] * Math.min(1, (max - 24) / 22))

        const x = idx % width
        if (x > 0) stack.push(idx - 1)
        if (x < width - 1) stack.push(idx + 1)
        stack.push(idx - width, idx + width)
      }

      ctx.putImageData(image, 0, 0)
      return layer
    }

    const rebuildLayers = () => {
      dirtyLayer = createLayer(dirtyImgRef.current)
      prettyLayer = createLayer(prettyImgRef.current)
      layerWidth = canvas.width
      layerHeight = canvas.height
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(2, Math.round(rect.width))
      const height = Math.max(2, Math.round(rect.height))

      canvas.width = width
      canvas.height = height
      mask.width = width
      mask.height = height
      rebuildLayers()
      paintReveal(54, 42)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const tick = () => {
      if (
        layerWidth !== canvas.width ||
        layerHeight !== canvas.height ||
        (!dirtyLayer && dirtyImgRef.current?.complete) ||
        (!prettyLayer && prettyImgRef.current?.complete)
      ) {
        rebuildLayers()
      }

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      if (prettyLayer) {
        canvasCtx.drawImage(mask, 0, 0)
        canvasCtx.globalCompositeOperation = 'source-in'
        canvasCtx.drawImage(prettyLayer, 0, 0)
        canvasCtx.globalCompositeOperation = 'source-over'
      }

      canvasCtx.globalCompositeOperation = 'destination-over'
      if (dirtyLayer) canvasCtx.drawImage(dirtyLayer, 0, 0)
      canvasCtx.globalCompositeOperation = 'source-over'

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onImageLoad = () => {
      rebuildLayers()
      paintReveal(54, 42)
    }
    dirtyImgRef.current?.addEventListener('load', onImageLoad)
    prettyImgRef.current?.addEventListener('load', onImageLoad)

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      dirtyImgRef.current?.removeEventListener('load', onImageLoad)
      prettyImgRef.current?.removeEventListener('load', onImageLoad)
      maskRef.current = null
    }
  }, [paintReveal])

  const addBrushPoint = useCallback((event, force = false) => {
    if (!force && !isPaintingRef.current && event.pointerType !== 'mouse') return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100))

    event.currentTarget.style.setProperty('--brush-x', `${x}%`)
    event.currentTarget.style.setProperty('--brush-y', `${y}%`)

    const last = lastPaintRef.current
    const dx = last ? x - last.x : 0
    const dy = last ? y - last.y : 0
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 3))

    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps
      paintReveal(last ? last.x + dx * t : x, last ? last.y + dy * t : y)
    }

    lastPaintRef.current = { x, y }
  }, [paintReveal])

  const beginBrush = (event) => {
    isPaintingRef.current = true
    setIsPainting(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    addBrushPoint(event, true)
  }

  const enterBrush = (event) => {
    if (event.pointerType !== 'mouse') return
    isPaintingRef.current = true
    setIsPainting(true)
    addBrushPoint(event, true)
  }

  const endBrush = () => {
    isPaintingRef.current = false
    lastPaintRef.current = null
    setIsPainting(false)
  }

  const resetBrush = () => {
    const mask = maskRef.current
    if (!mask) return
    const ctx = mask.getContext('2d')
    ctx.clearRect(0, 0, mask.width, mask.height)
    paintReveal(54, 42)
  }

  return (
    <motion.div
      className={`home-brush-card${isPainting ? ' is-painting' : ''}`}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.22 }}
    >
      <div className="home-brush-aura" aria-hidden="true" />
      <div className="home-brush-botanical" aria-hidden="true">
        <span className="brush-stem brush-stem-a" />
        <span className="brush-stem brush-stem-b" />
        <span className="brush-stem brush-stem-c" />
        <span className="brush-bloom brush-bloom-a" />
        <span className="brush-bloom brush-bloom-b" />
        <span className="brush-bloom brush-bloom-c" />
      </div>
      <div
        className="home-brush-frame"
        onPointerDown={beginBrush}
        onPointerEnter={enterBrush}
        onPointerMove={addBrushPoint}
        onPointerUp={endBrush}
        onPointerCancel={endBrush}
        onPointerLeave={endBrush}
      >
        <div className="home-brush-backplate" aria-hidden="true" />
        <canvas ref={canvasRef} className="home-brush-canvas" aria-label="Brush reveal beauty portrait" />
        <img ref={dirtyImgRef} className="home-brush-source" src={heroDirtyPortrait} alt="" aria-hidden="true" />
        <img ref={prettyImgRef} className="home-brush-source" src={heroPrettyPortrait} alt="" aria-hidden="true" />
        <div className="home-brush-orbit" aria-hidden="true" />
        <div className="home-magic-reveal" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="home-brush-hint">Move to transform</div>
      </div>
      <div className="home-brush-badge" aria-hidden="true">
        <span>Glamore</span>
        <strong>Signature Glow</strong>
      </div>
      <button className="home-brush-reset" type="button" onClick={resetBrush}>
        Reset Mask
      </button>
    </motion.div>
  )
}

function GoldenFlowers() {
  return (
    <div className="home-gold-flowers" aria-hidden="true">
      <span className="home-flower flower-a" />
      <span className="home-flower flower-b" />
      <span className="home-flower flower-c" />
      <span className="home-petal petal-a" />
      <span className="home-petal petal-b" />
      <span className="home-petal petal-c" />
    </div>
  )
}

export default function Home() {
  const serviceSectionRef = useRef(null)
  const serviceTrackRef = useRef(null)
  const [activeService, setActiveService] = useState(0)

  useEffect(() => {
    const section = serviceSectionRef.current
    const track = serviceTrackRef.current
    if (!section || !track) return undefined

    const mm = gsap.matchMedia()

    mm.add('(min-width: 821px)', () => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.16)

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.8}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.round(self.progress * (services.length - 1))
            setActiveService(Math.max(0, Math.min(services.length - 1, index)))
          },
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <main className="home-redesign home-premium">
      <section className="home-hero premium-home-hero">
        <div className="home-hero-bg" aria-hidden="true" />
        <GoldenFlowers />
        <div className="home-hero-filigree" aria-hidden="true" />
        <div className="home-hero-side-rule" aria-hidden="true" />
        <div className="container home-hero-grid">
          <motion.div
            className="home-hero-copy"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.14 } } }}
          >
            <motion.p className="home-eyebrow" variants={fadeUp}>
              &#10022; LOS ANGELES &bull; PREMIUM BEAUTY STUDIO
            </motion.p>
            <motion.h1 className="home-title" variants={fadeUp}>
              <span>Reveal</span>
              <em>Your</em>
              <span>Glow.</span>
            </motion.h1>
            <motion.p className="home-lede" variants={fadeUp}>
              A cinematic beauty ritual where skincare, makeup, and confidence
              converge &mdash; crafted by artists who see beauty as a language.
            </motion.p>

            <motion.div className="home-hero-stats" variants={fadeUp}>
              {stats.map(([num, label]) => (
                <div className="home-hero-stat" key={label}>
                  <strong>{num}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div className="home-hero-actions" variants={fadeUp}>
              <Link to="/booking" className="btn btn-gold">Book the Ritual</Link>
              <Link to="/services" className="btn btn-outline">Explore Services</Link>
            </motion.div>
          </motion.div>

          <BrushRevealPortrait />

          <div className="home-hero-tags" aria-label="Glamore highlights">
            {tags.map((tag) => (
              <span key={tag}>
                <i>&#10022;</i>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="home-marquee" aria-label="Glamore services">
        <div>
          <span>Hair Colour</span>
          <span>Bridal Glam</span>
          <span>Nail Artistry</span>
          <span>Skin Rituals</span>
          <span>Studio Packages</span>
        </div>
      </section>

      <section ref={serviceSectionRef} className="home-horizontal-services">
        <div className="home-horizontal-bg" aria-hidden="true" />
        <div className="home-horizontal-head">
          <div>
            <p className="home-eyebrow">What We Offer</p>
            <h2>Our Signature <em>Services</em></h2>
          </div>
          <div className="home-service-progress" aria-label={`Service ${activeService + 1} of ${services.length}`}>
            <span>{String(activeService + 1).padStart(2, '0')}</span>
            <i />
            <span>{String(services.length).padStart(2, '0')}</span>
          </div>
        </div>

        <div ref={serviceTrackRef} className="home-horizontal-track">
          {services.map((service, index) => (
            <article className={`home-horizontal-card${index === activeService ? ' is-active' : ''}`} key={service.title}>
              <img src={service.img} alt={service.title} />
              <div className="home-horizontal-card-shade" />
              <div className="home-horizontal-card-copy">
                <span>Service {String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.sub}</p>
              </div>
              <div className="home-horizontal-card-footer">
                <strong>From {service.price}</strong>
                <Link to="/booking">Book</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-story">
        <div className="container home-story-grid">
          <div className="home-story-image">
            <img src={storyPortrait} alt="Glamore studio styling session" />
          </div>
          <div className="home-story-copy">
            <p className="home-eyebrow">Our Story</p>
            <h2>Artistry in every detail, comfort in every visit.</h2>
            <p>
              We designed Glamore for clients who want beauty care that feels considered, modern, and personal. Every appointment begins with a clear consultation and ends with a look that still feels like you.
            </p>
            <Link to="/about" className="btn btn-outline">Meet the Studio</Link>
          </div>
        </div>
      </section>

      <section className="section home-testimonials">
        <div className="container">
          <div className="home-section-head center">
            <p className="home-eyebrow">Client Notes</p>
            <h2>Polished work, relaxed experience.</h2>
          </div>
          <div className="home-testimonial-grid">
            {testimonials.map((item) => (
              <article className="home-testimonial" key={item.author}>
                <p>"{item.text}"</p>
                <strong>{item.author}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container home-cta-inner">
          <div>
            <p className="home-eyebrow">Ready when you are</p>
            <h2>Plan your next beauty ritual.</h2>
          </div>
          <Link to="/booking" className="btn btn-gold">Book Your Appointment</Link>
        </div>
      </section>
    </main>
  )
}
