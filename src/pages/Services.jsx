import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  {
    id: 'hair-styling',
    label: 'Hair Styling & Care',
    icon: '✦',
    gradient: 'linear-gradient(135deg, #1a0a14 0%, #2d1428 100%)',
    accent: '#C9A96E',
    intro: 'From precision cuts to transformative blowouts, our stylists craft looks that move beautifully through your day.',
    services: [
      { name: 'The Glamore Cut', time: '60–90 min', price: 'From $120', desc: 'A full consultation and precision cut tailored to your face shape, texture, and lifestyle.' },
      { name: 'Blowout & Style', time: '45 min', price: 'From $75', desc: 'Volume, bounce, or sleek — our blowouts last. Includes deep conditioning spray.' },
      { name: 'Deep Conditioning Treatment', time: '30 min', price: 'From $55', desc: "Protein or moisture treatments customised to your hair's current needs." },
      { name: 'Keratin Smoothing', time: '2–3 hours', price: 'From $280', desc: 'Up to 12 weeks of frizz control and mirror shine. Safe for colour-treated hair.' },
      { name: 'Scalp Ritual', time: '45 min', price: 'From $85', desc: 'Exfoliation, massage, and targeted treatment for scalp health and hair growth.' },
      { name: 'Extension Consultation', time: '30 min', price: 'Complimentary', desc: 'Full strand-by-strand assessment before any extension service.' },
    ]
  },
  {
    id: 'hair-colour',
    label: 'Hair Colouring',
    icon: '◈',
    gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1530 100%)',
    accent: '#8B7FD4',
    intro: 'Colour is light. Our colourists are painters, mixing bespoke tones that evolve beautifully as they grow out.',
    services: [
      { name: 'Signature Balayage', time: '3–4 hours', price: 'From $295', desc: 'Our most popular service. Hand-painted highlights for a naturally sun-kissed result.' },
      { name: 'Full Colour', time: '90 min', price: 'From $145', desc: 'Rich, even all-over colour with precision application for zero root lines.' },
      { name: 'Foilayage', time: '3.5 hours', price: 'From $320', desc: 'The precision of foil highlights with the softness of balayage.' },
      { name: 'Toning & Glossing', time: '45 min', price: 'From $65', desc: 'Refresh and seal your colour with a custom-blended gloss treatment.' },
      { name: 'Colour Correction', time: '4–8 hours', price: 'Consultation', desc: 'Complex colour corrections handled with care and a clear timeline.' },
      { name: 'Grey Blending', time: '2 hours', price: 'From $175', desc: 'Seamlessly blend or celebrate your greys with artful colour placement.' },
    ]
  },
  {
    id: 'nails',
    label: 'Nail Services & Art',
    icon: '❋',
    gradient: 'linear-gradient(135deg, #0a1408 0%, #162412 100%)',
    accent: '#7EC8A4',
    intro: 'Nail artistry elevated to fine jewellery. Our nail technicians are designers first.',
    services: [
      { name: 'Classic Manicure', time: '45 min', price: 'From $45', desc: 'Shape, cuticle care, massage, and your choice of polish.' },
      { name: 'Gel Manicure', time: '60 min', price: 'From $65', desc: 'Up to 3 weeks of chip-free wear with a high-shine finish.' },
      { name: 'Sculpted Acrylics', time: '90 min', price: 'From $95', desc: 'Custom length and shape with a natural-looking finish.' },
      { name: 'Nail Art Studio', time: '90–180 min', price: 'From $120', desc: 'Bespoke nail art: press-ons, 3D elements, fine-line details, foil.' },
      { name: 'Pedicure Ritual', time: '75 min', price: 'From $80', desc: 'A full foot treatment with exfoliation, mask, massage, and colour.' },
      { name: 'Bridal Nail Package', time: '3 hours', price: 'From $250', desc: 'Hands and feet, custom design, trail run, and wedding-day appointment.' },
    ]
  },
  {
    id: 'beauty',
    label: 'Beauty Treatments',
    icon: '⬡',
    gradient: 'linear-gradient(135deg, #1a0808 0%, #2d1010 100%)',
    accent: '#E8A0A0',
    intro: 'Skin, lashes, brows — the fine details that complete the picture. Our aestheticians work with surgical precision.',
    services: [
      { name: 'Signature Facial', time: '75 min', price: 'From $135', desc: 'Cleanse, exfoliate, custom masque, and targeted serums for your skin type.' },
      { name: 'Lash Lift & Tint', time: '60 min', price: 'From $90', desc: '6–8 weeks of lifted, darkened lashes without extensions.' },
      { name: 'Lash Extensions', time: '90–120 min', price: 'From $185', desc: 'Classic, hybrid, or volume sets tailored to your eye shape.' },
      { name: 'Brow Architecture', time: '45 min', price: 'From $75', desc: 'Design, tint, and shape. A structured brow that frames the face.' },
      { name: 'Microblading', time: '2.5 hours', price: 'From $550', desc: 'Semi-permanent hair-stroke brows. Includes a 6-week touch-up.' },
      { name: 'Waxing & Threading', time: '15–45 min', price: 'From $25', desc: 'Precision hair removal for face and body. Quick and immaculate.' },
    ]
  },
  {
    id: 'makeup',
    label: 'Makeup & Bridal',
    icon: '✧',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #14142e 100%)',
    accent: '#A0A8E8',
    intro: 'Makeup that photographs like art and wears like a second skin. Bridal is our passion.',
    services: [
      { name: 'Event Makeup', time: '60 min', price: 'From $95', desc: 'Red carpet-ready looks for galas, parties, and special occasions.' },
      { name: 'Bridal Trial', time: '2 hours', price: 'From $180', desc: 'A full trial run with photos to lock in your wedding day look.' },
      { name: 'Bridal Makeup', time: '90 min', price: 'From $350', desc: 'On-the-day application with a dedicated artist and touch-up kit.' },
      { name: 'Bridal Party Package', time: 'Full day', price: 'From $1,200', desc: 'Bride + up to 5 attendants. Includes champagne service and coordination.' },
      { name: 'Airbrush Makeup', time: '75 min', price: 'From $145', desc: 'Featherweight, camera-ready finish. Lasts all day, transfers nothing.' },
      { name: 'Makeup Lesson', time: '90 min', price: 'From $165', desc: 'One-on-one technique session with a personalised product guide.' },
    ]
  },
  {
    id: 'packages',
    label: 'Studio Packages',
    icon: '◎',
    gradient: 'linear-gradient(135deg, #0d0808 0%, #1a1210 100%)',
    accent: '#C9A96E',
    intro: 'Full-day experiences curated for total transformation. Arrive as yourself; leave as your best self.',
    services: [
      { name: 'The Essentials', time: '3 hours', price: '$295', desc: 'Cut + Blowout + Brow Architecture. The perfect monthly reset.' },
      { name: 'The Refresh', time: '4 hours', price: '$420', desc: 'Colour Gloss + Blowout + Manicure. Bright, polished, and ready.' },
      { name: 'The Signature Day', time: '6 hours', price: '$680', desc: 'Balayage + Cut + Facial + Manicure. Our most popular full experience.' },
      { name: 'The Bridal Journey', time: 'Full day', price: 'From $1,400', desc: 'Hair colour, cut, blowout, full makeup, nails, and lash treatment.' },
      { name: 'The Luxe Retreat', time: '8 hours', price: '$1,200', desc: 'Everything. A completely bespoke day designed around you.' },
      { name: 'Corporate Group', time: 'Half day', price: 'On request', desc: 'For teams, launches, and events. Minimum 6 guests. Full planning included.' },
    ]
  },
]

function ServiceCard({ service, accent }) {
  return (
    <div className="srv-card">
      <div className="srv-card-header">
        <span className="srv-card-name">{service.name}</span>
        <span className="srv-card-price" style={{ color: accent }}>{service.price}</span>
      </div>
      <p className="srv-card-desc">{service.desc}</p>
      <div className="srv-card-footer">
        <span className="srv-card-time">⏱ {service.time}</span>
        <Link to="/booking" className="srv-book-link" style={{ color: accent }}>Book →</Link>
      </div>
    </div>
  )
}

export default function Services() {
  const [active, setActive] = useState('hair-styling')
  const cat = categories.find(c => c.id === active)
  const tabsRef = useRef(null)
  const tabsWrapRef = useRef(null)
  const contentRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo('.srv-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
    gsap.fromTo('.srv-hero-sub',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 }
    )
  }, [])

  const scrollToServices = () => {
    if (!contentRef.current) return
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72
    const tabsH = tabsWrapRef.current?.offsetHeight || 0
    const target = contentRef.current.getBoundingClientRect().top + window.scrollY - navH - tabsH + 1

    window.scrollTo({
      top: Math.max(target, 0),
      behavior: 'smooth',
    })
  }

  const handleTabChange = (id) => {
    if (id === active) {
      scrollToServices()
      return
    }

    gsap.to(contentRef.current, {
      opacity: 0, y: 18, duration: 0.24, ease: 'power2.inOut',
      onComplete: () => {
        setActive(id)
        requestAnimationFrame(scrollToServices)
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.46, ease: 'power3.out' }
        )
      }
    })
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <section className="page-hero" style={{ background: 'linear-gradient(180deg, #0a0010 0%, #000 60%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="t-label t-gold-em srv-hero-title" style={{ marginBottom: 20, display: 'block' }}>What We Do</span>
          <h1 className="t-hero srv-hero-title">Every Service,<br />A Masterpiece.</h1>
          <p className="t-body-lg srv-hero-sub" style={{ maxWidth: 520, margin: '28px auto 0', color: 'var(--text-2)' }}>
            Six categories of premium beauty services. Each one designed to make you feel extraordinary.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <div ref={tabsWrapRef} className="srv-tabs-wrap" style={{ background: 'var(--near-black)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div ref={tabsRef} className="srv-tabs">
            {categories.map(c => (
              <button
                key={c.id}
                data-srv-tab={c.id}
                className={`srv-tab${active === c.id ? ' active' : ''}`}
                onClick={() => handleTabChange(c.id)}
                style={{ '--tab-accent': c.accent }}
              >
                <span className="srv-tab-icon">{c.icon}</span>
                <span className="srv-tab-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <section ref={contentRef} className="srv-content" style={{ background: cat.gradient, minHeight: '60vh', padding: '80px 0 120px' }}>
        <div className="container">
          <div className="srv-intro">
            <span className="t-label" style={{ color: cat.accent, marginBottom: 12, display: 'block' }}>{cat.label}</span>
            <p className="t-body-lg" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 600 }}>{cat.intro}</p>
          </div>
          <div className="srv-cards-grid">
            {cat.services.map(s => (
              <ServiceCard key={s.name} service={s} accent={cat.accent} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link to="/pricing" className="btn btn-outline" style={{ marginRight: 16 }}>See Full Pricing</Link>
            <Link to="/booking" className="btn btn-gold">Book This Service</Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ background: 'var(--black)', padding: '120px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="t-label t-gold-em" style={{ marginBottom: 16, display: 'block' }}>How It Works</span>
            <h2 className="t-display">The Glamore Process</h2>
          </div>
          <div className="process-steps">
            {[
              { step: '01', title: 'Consultation', body: 'Every visit begins with a conversation — your goals, lifestyle, and inspiration images.' },
              { step: '02', title: 'Personalisation', body: 'We build a custom plan around you. No formulas, no shortcuts.' },
              { step: '03', title: 'Artistry', body: 'Our team executes with precision, care, and creativity. You\'re in expert hands.' },
              { step: '04', title: 'Aftercare', body: 'Product recommendations, maintenance schedule, and open communication between visits.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="process-step">
                <div className="process-step-num t-gold-em">{step}</div>
                <h3 className="t-title" style={{ margin: '16px 0 10px' }}>{title}</h3>
                <p style={{ color: 'var(--text-3)', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}
