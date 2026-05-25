import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'

const milestones = [
  { year: '2012', title: 'The Beginning', body: 'Founded in a small Beverly Hills suite with three chairs and a dream. Our founder Isabelle Voss believed luxury beauty should feel intimate, not intimidating.' },
  { year: '2015', title: 'Studio Expansion', body: 'Moved to our current 4,000 sq ft flagship. The new space introduced dedicated rooms for bridal consultations, colour suites, and nail artistry.' },
  { year: '2018', title: 'Award Recognition', body: 'Named "Best Luxury Salon" by LA Magazine for three consecutive years. Our bespoke colour technique earned national press coverage.' },
  { year: '2021', title: 'The Glamore Method', body: 'Launched our signature consultation process - a holistic approach combining lifestyle, mood board, and technical analysis for every client.' },
  { year: '2024', title: 'Bridal Atelier', body: 'Opened our dedicated bridal atelier floor, offering full-day experiences for brides and their parties with personalised champagne service.' },
]

const values = [
  { icon: '*', title: 'Artistry', body: 'Every service is treated as a creative act. We stay at the bleeding edge of technique so your look is never ordinary.' },
  { icon: '◆', title: 'Integrity', body: 'Honest consultations, transparent pricing, and real results. We only promise what we can deliver - and then exceed it.' },
  { icon: '✣', title: 'Warmth', body: 'Luxury without snobbery. Every client is welcomed with genuine warmth and made to feel extraordinary.' },
  { icon: '↓', title: 'Sustainability', body: 'We source ethically, use cruelty-free products, and are committed to reducing our environmental footprint.' },
]

function TimelineItem({ year, title, body, index }) {
  const itemRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(itemRef.current,
      { opacity: 0, x: index % 2 === 0 ? -60 : 60 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: itemRef.current, start: 'top 82%' }
      }
    )
  }, { scope: itemRef })

  return (
    <div ref={itemRef} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
      <div className="timeline-year">{year}</div>
      <div className="timeline-content">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      <div className="timeline-dot" />
    </div>
  )
}

export default function About() {
  const pageRef = useRef(null)
  const statsRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo('.about-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
    gsap.fromTo('.about-hero-sub',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 }
    )
    gsap.fromTo('.about-hero-img',
      { scale: 1.08, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out', delay: 0.1 }
    )

    gsap.utils.toArray('.stat-num').forEach((el) => {
      const target = parseInt(el.dataset.val)
      gsap.fromTo({ val: 0 }, { val: target },
        {
          duration: 2, ease: 'power2.out',
          snap: { val: 1 },
          onUpdate() { el.textContent = Math.round(this.targets()[0].val) + (el.dataset.suffix || '') },
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%', once: true }
        }
      )
    })

    gsap.utils.toArray('.value-card').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      )
    })

    gsap.to('.about-dust-field', {
      yPercent: -18,
      xPercent: 4,
      ease: 'none',
      scrollTrigger: {
        trigger: pageRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    })

    gsap.utils.toArray('.about-dust-scene').forEach((scene) => {
      const content = scene.querySelector('.container')
      if (!content) return

      gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top 92%',
          end: 'bottom 8%',
          scrub: 1.15,
        },
      })
        .fromTo(content,
          { y: 34, autoAlpha: 0.62 },
          { y: 0, autoAlpha: 1, duration: 0.38, ease: 'power2.out' }
        )
        .to(content,
          { y: -22, autoAlpha: 0.76, duration: 0.28, ease: 'power2.in' },
          0.72
        )
    })
  }, { scope: pageRef })

  return (
    <motion.main
      ref={pageRef}
      className="about-dust-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="about-dust-field" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => <span key={i} />)}
      </div>

      {/* Hero */}
      <section className="about-hero about-dust-scene">
        <div className="about-hero-bg about-hero-img" />
        <div className="about-hero-overlay" />
        <div className="container about-hero-inner">
          <span className="t-label t-gold-em" style={{ marginBottom: 24, display: 'block' }}>Our Story</span>
          <h1 className="t-hero about-hero-title">Beauty Is Not <br />An Accident.</h1>
          <p className="t-body-lg about-hero-sub" style={{ maxWidth: 540, marginTop: 24, color: 'var(--text-2)' }}>
            For over a decade, Glamore has been transforming how people experience luxury beauty - one story, one face, one brushstroke at a time.
          </p>
        </div>
      </section>
      <div className="about-dust-transition" aria-hidden="true" />

      {/* Stats */}
      <section ref={statsRef} className="stats-strip about-dust-scene">
        <div className="container stats-grid">
          {[
            { val: 12, suffix: '+', label: 'Years of Excellence' },
            { val: 15000, suffix: '+', label: 'Clients Served' },
            { val: 98, suffix: '%', label: 'Client Satisfaction' },
            { val: 47, suffix: '', label: 'Industry Awards' },
          ].map(({ val, suffix, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-num t-display" data-val={val} data-suffix={suffix}>0{suffix}</div>
              <div className="stat-label t-label">{label}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="about-dust-transition" aria-hidden="true" />

      {/* Mission */}
      <section className="about-mission about-dust-scene">
        <div className="container about-mission-inner">
          <div className="about-mission-text">
            <span className="t-label t-gold-em" style={{ marginBottom: 20, display: 'block' }}>Our Mission</span>
            <h2 className="t-display">We believe beauty is deeply personal.</h2>
            <p className="t-body-lg" style={{ color: 'var(--text-2)', marginTop: 24 }}>
              Glamore was built on a simple conviction: every person deserves to feel extraordinary. Not through trends or formulas, but through deeply personalised artistry that sees, celebrates, and elevates who you truly are.
            </p>
            <p style={{ color: 'var(--text-3)', marginTop: 16, lineHeight: 1.8 }}>
              Our studio is a sanctuary - a place where time slows, expertise meets intuition, and the result is always, unmistakably, you - only more.
            </p>
            <Link to="/booking" className="btn btn-gold" style={{ marginTop: 40 }}>Book Your Experience</Link>
          </div>
          <div className="about-mission-visual">
            <div className="mission-img-frame">
              <div className="mission-img-placeholder" />
              <div className="mission-img-accent" />
            </div>
          </div>
        </div>
      </section>
      <div className="about-dust-transition" aria-hidden="true" />

      {/* Values */}
      <section className="values-section about-dust-scene" style={{ background: 'var(--near-black)', padding: '120px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="t-label t-gold-em" style={{ marginBottom: 16, display: 'block' }}>What Drives Us</span>
            <h2 className="t-display">Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map(({ icon, title, body }) => (
              <div key={title} className="value-card">
                <div className="value-icon">{icon}</div>
                <h3 className="t-title" style={{ marginBottom: 14 }}>{title}</h3>
                <p style={{ color: 'var(--text-3)', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="about-dust-transition" aria-hidden="true" />

      {/* Timeline */}
      <section className="about-dust-scene" style={{ background: 'var(--black)', padding: '120px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span className="t-label t-gold-em" style={{ marginBottom: 16, display: 'block' }}>Our Journey</span>
            <h2 className="t-display">A Decade of Artistry</h2>
          </div>
          <div className="timeline">
            <div className="timeline-line" />
            {milestones.map((m, i) => (
              <TimelineItem key={m.year} {...m} index={i} />
            ))}
          </div>
        </div>
      </section>
      <div className="about-dust-transition" aria-hidden="true" />

      {/* Founder */}
      <section className="about-dust-scene" style={{ background: 'var(--near-black)', padding: '120px 0' }}>
        <div className="container founder-section">
          <div className="founder-portrait">
            <div className="founder-portrait-inner" />
            <div className="founder-portrait-frame" />
          </div>
          <div className="founder-text">
            <span className="t-label t-gold-em" style={{ marginBottom: 20, display: 'block' }}>A Letter From Our Founder</span>
            <blockquote className="founder-quote">
              "I started Glamore because I wanted to create something rare - a space where every person who walked through our doors left feeling genuinely seen and luminously themselves."
            </blockquote>
            <p style={{ color: 'var(--text-3)', marginTop: 24, lineHeight: 1.9 }}>
              After fifteen years studying under master colourists in Paris and New York, I came home to Los Angeles with one vision: build a studio that married European craft with California warmth. Every detail of Glamore - from the bespoke consultation process to the ambient lighting in our colour suites - is designed with intentionality and love.
            </p>
            <div className="founder-sig">
              <span className="t-gold-em" style={{ fontSize: 28, fontFamily: 'var(--font-display)' }}>Isabelle Voss</span>
              <span className="t-label" style={{ marginLeft: 16 }}>Founder & Creative Director</span>
            </div>
          </div>
        </div>
      </section>
      <div className="about-dust-transition" aria-hidden="true" />

      {/* CTA */}
      <section className="cta-strip about-dust-scene">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="t-display" style={{ marginBottom: 24 }}>Ready to Begin Your Story?</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: 40 }}>Join thousands of clients who have made Glamore their beauty home.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-gold">Book Appointment</Link>
            <Link to="/services" className="btn btn-outline">Explore Services</Link>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
