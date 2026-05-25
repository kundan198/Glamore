import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'

const filters = ['All', 'Hair', 'Colour', 'Nails', 'Makeup', 'Bridal']

const items = [
  { id: 1, cat: 'Hair', aspect: 'tall', label: 'Silk Press & Blowout', sub: 'Hair Styling' },
  { id: 2, cat: 'Colour', aspect: 'wide', label: 'Copper Balayage', sub: 'Colour' },
  { id: 3, cat: 'Bridal', aspect: 'tall', label: 'Bridal Updo', sub: 'Bridal' },
  { id: 4, cat: 'Nails', aspect: 'square', label: 'Gold Foil Art', sub: 'Nail Art' },
  { id: 5, cat: 'Makeup', aspect: 'tall', label: 'Editorial Glam', sub: 'Makeup' },
  { id: 6, cat: 'Hair', aspect: 'square', label: 'Textured Bob', sub: 'Hair Styling' },
  { id: 7, cat: 'Colour', aspect: 'tall', label: 'Platinum Blonde', sub: 'Colour' },
  { id: 8, cat: 'Nails', aspect: 'wide', label: '3D Floral Nails', sub: 'Nail Art' },
  { id: 9, cat: 'Bridal', aspect: 'wide', label: 'Soft Bridal Look', sub: 'Bridal' },
  { id: 10, cat: 'Makeup', aspect: 'square', label: 'Dewy Glow', sub: 'Makeup' },
  { id: 11, cat: 'Hair', aspect: 'wide', label: 'Long Layers', sub: 'Hair Styling' },
  { id: 12, cat: 'Colour', aspect: 'square', label: 'Ash Brown', sub: 'Colour' },
  { id: 13, cat: 'Nails', aspect: 'tall', label: 'Chrome Ombré', sub: 'Nail Art' },
  { id: 14, cat: 'Bridal', aspect: 'tall', label: 'Classic Chignon', sub: 'Bridal' },
  { id: 15, cat: 'Makeup', aspect: 'wide', label: 'Smoky Eye', sub: 'Makeup' },
  { id: 16, cat: 'Hair', aspect: 'tall', label: 'Curtain Bangs', sub: 'Hair Styling' },
  { id: 17, cat: 'Colour', aspect: 'square', label: 'Money Piece', sub: 'Colour' },
  { id: 18, cat: 'Nails', aspect: 'wide', label: 'Abstract Art', sub: 'Nail Art' },
]

const palettes = [
  ['#2a1420', '#1a0a14'],
  ['#0d1420', '#0a0d1a'],
  ['#141a0a', '#0d1408'],
  ['#1a1408', '#140e04'],
  ['#0a1418', '#081014'],
  ['#180a1a', '#120814'],
  ['#1a0808', '#140404'],
  ['#081418', '#041010'],
]

function GalleryCell({ item, onOpen }) {
  const cellRef = useRef(null)
  const pal = palettes[item.id % palettes.length]

  useGSAP(() => {
    gsap.fromTo(cellRef.current,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: cellRef.current, start: 'top 90%' }
      }
    )
  }, { scope: cellRef })

  return (
    <div
      ref={cellRef}
      className={`gallery-cell gallery-cell--${item.aspect}`}
      onClick={() => onOpen(item)}
      style={{ '--c1': pal[0], '--c2': pal[1] }}
    >
      <div className="gallery-cell-bg" />
      <div className="gallery-cell-overlay">
        <span className="gallery-cell-label">{item.label}</span>
        <span className="gallery-cell-sub">{item.sub}</span>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const gridRef = useRef(null)

  const filtered = active === 'All' ? items : items.filter(i => i.cat === active)

  const handleFilter = (f) => {
    if (f === active) return
    gsap.to(gridRef.current, {
      opacity: 0, y: 20, duration: 0.2,
      onComplete: () => {
        setActive(f)
        gsap.fromTo(gridRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        )
      }
    })
  }

  useGSAP(() => {
    gsap.fromTo('.gallery-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="page-hero" style={{ background: 'linear-gradient(180deg, #0d0008 0%, #000 60%)', paddingBottom: 80 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="t-label t-gold-em gallery-hero-title" style={{ marginBottom: 20, display: 'block' }}>Our Work</span>
          <h1 className="t-hero gallery-hero-title">A Portfolio<br />of Moments.</h1>
          <p className="t-body-lg gallery-hero-title" style={{ maxWidth: 480, margin: '28px auto 0', color: 'var(--text-2)' }}>
            Every image is a real client transformation. Browse our most recent work across all six service categories.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="gallery-filters-wrap">
        <div className="container">
          <div className="gallery-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`gallery-filter-btn${active === f ? ' active' : ''}`}
                onClick={() => handleFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section style={{ background: 'var(--black)', padding: '48px 0 120px' }}>
        <div className="container">
          <div ref={gridRef} className="gallery-masonry">
            {filtered.map(item => (
              <GalleryCell key={item.id} item={item} onOpen={setLightbox} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <div
              className="lightbox-img"
              style={{ background: `linear-gradient(135deg, ${palettes[lightbox.id % palettes.length].join(',')})` }}
            />
            <div className="lightbox-info">
              <span className="t-label t-gold-em">{lightbox.sub}</span>
              <h3 className="t-display" style={{ fontSize: 32, margin: '12px 0 16px' }}>{lightbox.label}</h3>
              <p style={{ color: 'var(--text-3)' }}>A Glamore original transformation. Book your consultation to discuss a similar look.</p>
            </div>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </motion.div>
      )}
    </motion.main>
  )
}
