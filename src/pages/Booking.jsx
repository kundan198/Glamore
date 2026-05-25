import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  "Women's Cut & Style", "Men's Cut", 'Blowout & Style',
  'Balayage', 'Full Colour', 'Toning & Gloss',
  'Classic Manicure', 'Gel Manicure', 'Nail Art',
  'Signature Facial', 'Lash Extensions', 'Brow Architecture',
  'Event Makeup', 'Bridal Makeup', 'Bridal Trial',
  'Studio Package — Signature Day', 'Studio Package — Luxe Retreat',
]

const artists = [
  { name: 'No Preference', role: '' },
  { name: 'Isabelle Voss', role: 'Colour & Transformation' },
  { name: 'Marcus Chen', role: 'Precision Cuts & Texture' },
  { name: 'Sofia Reyes', role: 'Balayage & Blonding' },
  { name: 'Priya Nair', role: 'Nail Art & Bridal' },
  { name: 'Zara Mitchell', role: 'Bridal & Editorial Makeup' },
  { name: 'Leo Park', role: 'Skincare & Lash Artistry' },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '2:00 PM', '2:30 PM', '3:00 PM',
  '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
]

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Confirm']

export default function Booking() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    service: '',
    artist: 'No Preference',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const contentRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo('.booking-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
  }, [])

  const advance = () => {
    gsap.to(contentRef.current, {
      opacity: 0, x: -30, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setStep(s => s + 1)
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }
        )
      }
    })
  }

  const back = () => {
    gsap.to(contentRef.current, {
      opacity: 0, x: 30, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setStep(s => s - 1)
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }
        )
      }
    })
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="page-hero" style={{ background: 'linear-gradient(180deg, #060010 0%, #000 60%)', paddingBottom: 60 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="t-label t-gold-em booking-hero-title" style={{ marginBottom: 20, display: 'block' }}>Reserve Your Seat</span>
          <h1 className="t-hero booking-hero-title">Book Your<br />Appointment.</h1>
        </div>
      </section>

      <section style={{ background: 'var(--black)', padding: '60px 0 120px' }}>
        <div className="container booking-container">
          {submitted ? (
            <motion.div
              className="booking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="booking-success-icon">✦</div>
              <h2 className="t-display" style={{ marginBottom: 20 }}>You're Booked.</h2>
              <p style={{ color: 'var(--text-2)', marginBottom: 8 }}>
                A confirmation has been sent to <strong>{form.email}</strong>.
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.8 }}>
                {form.service} · {form.date} · {form.time}<br />
                Artist: {form.artist}
              </p>
              <p style={{ color: 'var(--text-3)', marginTop: 24, fontSize: 13 }}>
                We require 48 hours notice for cancellations. See you soon!
              </p>
            </motion.div>
          ) : (
            <>
              {/* Progress */}
              <div className="booking-steps">
                {STEPS.map((s, i) => (
                  <div key={s} className={`booking-step${i <= step ? ' active' : ''}${i < step ? ' done' : ''}`}>
                    <div className="booking-step-dot">{i < step ? '✓' : i + 1}</div>
                    <span className="booking-step-label">{s}</span>
                    {i < STEPS.length - 1 && <div className="booking-step-line" />}
                  </div>
                ))}
              </div>

              <div ref={contentRef} className="booking-panel">
                {/* Step 0: Service */}
                {step === 0 && (
                  <div className="booking-step-content">
                    <h2 className="booking-step-title">Choose a Service</h2>
                    <div className="service-select-grid">
                      {services.map(s => (
                        <button
                          key={s}
                          className={`service-option${form.service === s ? ' selected' : ''}`}
                          onClick={() => set('service', s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 40 }}>
                      <p style={{ color: 'var(--text-3)', marginBottom: 16, fontSize: 14 }}>Preferred Artist</p>
                      <div className="artist-select">
                        {artists.map(a => (
                          <button
                            key={a.name}
                            className={`artist-option${form.artist === a.name ? ' selected' : ''}`}
                            onClick={() => set('artist', a.name)}
                          >
                            <strong>{a.name}</strong>
                            {a.role && <span>{a.role}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="booking-nav">
                      <button
                        className="btn btn-gold"
                        disabled={!form.service}
                        onClick={advance}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Date & Time */}
                {step === 1 && (
                  <div className="booking-step-content">
                    <h2 className="booking-step-title">Pick a Date & Time</h2>
                    <div className="date-time-layout">
                      <div>
                        <p style={{ color: 'var(--text-3)', marginBottom: 12, fontSize: 14 }}>Date</p>
                        <input
                          type="date"
                          className="booking-input"
                          value={form.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => set('date', e.target.value)}
                        />
                      </div>
                      {form.date && (
                        <div>
                          <p style={{ color: 'var(--text-3)', marginBottom: 12, fontSize: 14 }}>Available Times</p>
                          <div className="time-grid">
                            {timeSlots.map(t => (
                              <button
                                key={t}
                                className={`time-slot${form.time === t ? ' selected' : ''}`}
                                onClick={() => set('time', t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="booking-nav">
                      <button className="btn btn-outline" onClick={back}>← Back</button>
                      <button
                        className="btn btn-gold"
                        disabled={!form.date || !form.time}
                        onClick={advance}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <div className="booking-step-content">
                    <h2 className="booking-step-title">Your Details</h2>
                    <form onSubmit={e => { e.preventDefault(); advance() }}>
                      <div className="booking-form-grid">
                        <div className="booking-field">
                          <label>First Name</label>
                          <input
                            className="booking-input"
                            value={form.firstName}
                            onChange={e => set('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="booking-field">
                          <label>Last Name</label>
                          <input
                            className="booking-input"
                            value={form.lastName}
                            onChange={e => set('lastName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="booking-field">
                          <label>Email Address</label>
                          <input
                            type="email"
                            className="booking-input"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="booking-field">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            className="booking-input"
                            value={form.phone}
                            onChange={e => set('phone', e.target.value)}
                            required
                          />
                        </div>
                        <div className="booking-field booking-field--full">
                          <label>Notes or Special Requests</label>
                          <textarea
                            className="booking-input booking-textarea"
                            value={form.notes}
                            onChange={e => set('notes', e.target.value)}
                            placeholder="Allergies, reference images, or anything we should know..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <div className="booking-nav">
                        <button type="button" className="btn btn-outline" onClick={back}>← Back</button>
                        <button
                          type="submit"
                          className="btn btn-gold"
                          disabled={!form.firstName || !form.lastName || !form.email || !form.phone}
                        >
                          Review →
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                  <div className="booking-step-content">
                    <h2 className="booking-step-title">Confirm Your Booking</h2>
                    <div className="booking-summary">
                      <div className="booking-summary-row"><span>Service</span><strong>{form.service}</strong></div>
                      <div className="booking-summary-row"><span>Artist</span><strong>{form.artist}</strong></div>
                      <div className="booking-summary-row"><span>Date</span><strong>{form.date}</strong></div>
                      <div className="booking-summary-row"><span>Time</span><strong>{form.time}</strong></div>
                      <div className="booking-summary-row"><span>Name</span><strong>{form.firstName} {form.lastName}</strong></div>
                      <div className="booking-summary-row"><span>Email</span><strong>{form.email}</strong></div>
                      <div className="booking-summary-row"><span>Phone</span><strong>{form.phone}</strong></div>
                      {form.notes && <div className="booking-summary-row"><span>Notes</span><strong>{form.notes}</strong></div>}
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '20px 0' }}>
                      By confirming, you agree to our 48-hour cancellation policy. A 20% deposit may be charged for services over $100.
                    </p>
                    <div className="booking-nav">
                      <button className="btn btn-outline" onClick={back}>← Back</button>
                      <button className="btn btn-gold" onClick={handleSubmit}>Confirm Booking ✦</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </motion.main>
  )
}
