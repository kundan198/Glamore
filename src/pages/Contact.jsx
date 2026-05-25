import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'

const contactInfo = [
  {
    icon: '📍',
    label: 'Studio Location',
    primary: '142 Glamour Lane, Suite 301',
    secondary: 'Beverly Hills, CA 90210',
  },
  {
    icon: '📞',
    label: 'Phone',
    primary: '+1 (310) 555-GLAM',
    secondary: 'Mon–Sat 9am–8pm',
  },
  {
    icon: '✉️',
    label: 'Email',
    primary: 'hello@glamorestudio.com',
    secondary: 'We reply within 24 hours',
  },
  {
    icon: '🕐',
    label: 'Hours',
    primary: 'Monday – Saturday: 9am – 8pm',
    secondary: 'Sunday: 10am – 6pm',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  useGSAP(() => {
    gsap.fromTo('.contact-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
    gsap.fromTo('.contact-hero-sub',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 }
    )
    gsap.utils.toArray('.contact-info-item').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      )
    })
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <section className="page-hero" style={{ background: 'linear-gradient(180deg, #080814 0%, #000 60%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="t-label t-gold-em contact-hero-title" style={{ marginBottom: 20, display: 'block' }}>Say Hello</span>
          <h1 className="t-hero contact-hero-title">We'd Love<br />To Hear From You.</h1>
          <p className="t-body-lg contact-hero-sub" style={{ maxWidth: 480, margin: '28px auto 0', color: 'var(--text-2)' }}>
            Questions, custom requests, or just curious — our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: 'var(--black)', padding: '100px 0 120px' }}>
        <div className="container contact-layout">
          {/* Info column */}
          <div className="contact-info-col">
            <h2 className="t-display" style={{ marginBottom: 48, fontSize: 'clamp(28px, 3vw, 42px)' }}>
              Visit the Studio.
            </h2>
            {contactInfo.map(({ icon, label, primary, secondary }) => (
              <div key={label} className="contact-info-item">
                <div className="contact-info-icon">{icon}</div>
                <div className="contact-info-text">
                  <span className="contact-info-label t-label">{label}</span>
                  <strong className="contact-info-primary">{primary}</strong>
                  <span className="contact-info-secondary">{secondary}</span>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="contact-map">
              <div className="contact-map-inner">
                <div className="contact-map-pin">
                  <span>📍</span>
                  <p>142 Glamour Lane<br />Beverly Hills</p>
                </div>
                <div className="contact-map-grid" />
              </div>
            </div>

            <div className="contact-socials">
              <p className="t-label" style={{ marginBottom: 16 }}>Follow Our Work</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: '📷', label: 'Instagram', handle: '@glamorestudio' },
                  { icon: '📘', label: 'Facebook', handle: 'GlamoreStudio' },
                  { icon: '🎵', label: 'TikTok', handle: '@glamore' },
                ].map(({ icon, label, handle }) => (
                  <div key={label} className="contact-social-chip">
                    <span>{icon}</span>
                    <div>
                      <strong style={{ fontSize: 12 }}>{label}</strong>
                      <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block' }}>{handle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="contact-form-col">
            {sent ? (
              <motion.div
                className="contact-success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
                <h3 className="t-display" style={{ fontSize: 32, marginBottom: 16 }}>Message Received.</h3>
                <p style={{ color: 'var(--text-2)' }}>
                  Thank you, {form.name.split(' ')[0]}. We'll reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <Link to="/booking" className="btn btn-gold" style={{ marginTop: 32 }}>Book an Appointment</Link>
              </motion.div>
            ) : (
              <>
                <h2 className="t-display" style={{ marginBottom: 40, fontSize: 'clamp(28px, 3vw, 42px)' }}>
                  Send a Message.
                </h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <div className="form-field">
                      <label>Your Name</label>
                      <input
                        className="form-input"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="hello@yourmail.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Subject</label>
                    <select
                      className="form-input"
                      value={form.subject}
                      onChange={e => set('subject', e.target.value)}
                      required
                    >
                      <option value="">Select a subject…</option>
                      <option>General Enquiry</option>
                      <option>Booking Question</option>
                      <option>Bridal Consultation Request</option>
                      <option>Press & Collaboration</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Message</label>
                    <textarea
                      className="form-input form-textarea"
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      placeholder="Tell us how we can help…"
                      rows={6}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </motion.main>
  )
}
