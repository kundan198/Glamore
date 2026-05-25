import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'

const tiers = [
  {
    name: 'Classic',
    tagline: 'The essentials, perfected.',
    price: 89,
    period: 'per visit',
    accent: '#888',
    features: [
      'Full consultation included',
      'Single service per visit',
      'Standard product range',
      'Online booking access',
      'Email aftercare guide',
    ],
    cta: 'Book Classic',
    featured: false,
  },
  {
    name: 'Signature',
    tagline: 'Our most popular experience.',
    price: 199,
    period: 'per visit',
    accent: '#C9A96E',
    features: [
      'Priority booking & cancellation',
      'Two services per visit',
      'Premium product range',
      'Dedicated stylist assigned',
      'Complimentary toning between visits',
      'Digital look-book & history',
      'Birthday reward (free service)',
    ],
    cta: 'Book Signature',
    featured: true,
  },
  {
    name: 'Premium',
    tagline: 'The complete Glamore luxury.',
    price: 449,
    period: 'per visit',
    accent: '#E0C8F8',
    features: [
      'Unlimited services per visit',
      'Same-day & emergency booking',
      'Exclusive product access',
      'Personal stylist concierge',
      'Quarterly wardrobe consult',
      'Priority waitlist for all artists',
      'Complimentary drinks & snacks',
      'Annual complimentary retreat day',
    ],
    cta: 'Book Premium',
    featured: false,
  },
]

const menuItems = [
  {
    category: 'Hair Styling & Care',
    items: [
      { name: "Women's Cut & Style", price: '$120+' },
      { name: "Men's Cut", price: '$75+' },
      { name: 'Blowout & Style', price: '$75+' },
      { name: 'Deep Conditioning', price: '$55+' },
      { name: 'Keratin Smoothing', price: '$280+' },
      { name: 'Scalp Ritual', price: '$85+' },
    ]
  },
  {
    category: 'Colour',
    items: [
      { name: 'Full Colour', price: '$145+' },
      { name: 'Balayage', price: '$295+' },
      { name: 'Foilayage', price: '$320+' },
      { name: 'Toning & Gloss', price: '$65+' },
      { name: 'Colour Correction', price: 'Consult' },
      { name: 'Grey Blending', price: '$175+' },
    ]
  },
  {
    category: 'Nail Services',
    items: [
      { name: 'Classic Manicure', price: '$45+' },
      { name: 'Gel Manicure', price: '$65+' },
      { name: 'Sculpted Acrylics', price: '$95+' },
      { name: 'Nail Art', price: '$120+' },
      { name: 'Pedicure Ritual', price: '$80+' },
      { name: 'Bridal Nails', price: '$250+' },
    ]
  },
  {
    category: 'Beauty & Skincare',
    items: [
      { name: 'Signature Facial', price: '$135+' },
      { name: 'Lash Lift & Tint', price: '$90+' },
      { name: 'Lash Extensions', price: '$185+' },
      { name: 'Brow Architecture', price: '$75+' },
      { name: 'Microblading', price: '$550+' },
      { name: 'Waxing & Threading', price: '$25+' },
    ]
  },
]

function PricingCard({ tier, index }) {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.fromTo(ref.current,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: index * 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 85%' }
      }
    )
  }, { scope: ref })

  return (
    <div ref={ref} className={`pricing-card${tier.featured ? ' pricing-card--featured' : ''}`}>
      {tier.featured && <div className="pricing-badge">Most Popular</div>}
      <div className="pricing-card-top">
        <h3 className="pricing-tier-name" style={{ color: tier.accent }}>{tier.name}</h3>
        <p className="pricing-tagline">{tier.tagline}</p>
        <div className="pricing-price">
          <span className="pricing-currency">$</span>
          <span className="pricing-amount">{tier.price}</span>
          <span className="pricing-period">/{tier.period.split(' ')[1] || tier.period}</span>
        </div>
      </div>
      <ul className="pricing-features">
        {tier.features.map(f => (
          <li key={f}><span className="pricing-check" style={{ color: tier.accent }}>✓</span> {f}</li>
        ))}
      </ul>
      <Link
        to="/booking"
        className={`btn ${tier.featured ? 'btn-gold' : 'btn-outline'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {tier.cta}
      </Link>
    </div>
  )
}

export default function Pricing() {
  const [openCat, setOpenCat] = useState(null)

  useGSAP(() => {
    gsap.fromTo('.pricing-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
    gsap.fromTo('.pricing-hero-sub',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 }
    )
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <section className="page-hero" style={{ background: 'linear-gradient(180deg, #080010 0%, #000 60%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="t-label t-gold-em pricing-hero-title" style={{ marginBottom: 20, display: 'block' }}>Transparent Pricing</span>
          <h1 className="t-hero pricing-hero-title">Beauty Without<br />Surprises.</h1>
          <p className="t-body-lg pricing-hero-sub" style={{ maxWidth: 500, margin: '28px auto 0', color: 'var(--text-2)' }}>
            Every price listed. Every service explained. We believe luxury should come with clarity.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <section style={{ background: 'var(--black)', padding: '100px 0 120px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="t-label t-gold-em" style={{ marginBottom: 16, display: 'block' }}>Membership Tiers</span>
            <h2 className="t-display">Choose Your Experience</h2>
          </div>
          <div className="pricing-tiers-grid">
            {tiers.map((t, i) => <PricingCard key={t.name} tier={t} index={i} />)}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-3)', marginTop: 40, fontSize: 13 }}>
            All prices are starting rates. Final cost confirmed at consultation. No hidden fees.
          </p>
        </div>
      </section>

      {/* A la carte */}
      <section style={{ background: 'var(--near-black)', padding: '100px 0 120px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="t-label t-gold-em" style={{ marginBottom: 16, display: 'block' }}>À La Carte</span>
            <h2 className="t-display">Individual Services</h2>
            <p style={{ color: 'var(--text-3)', marginTop: 20 }}>Click a category to expand pricing.</p>
          </div>
          <div className="menu-accordion">
            {menuItems.map(({ category, items }) => (
              <div key={category} className="menu-section">
                <button
                  className={`menu-section-header${openCat === category ? ' open' : ''}`}
                  onClick={() => setOpenCat(openCat === category ? null : category)}
                >
                  <span>{category}</span>
                  <span className="menu-section-arrow">{openCat === category ? '−' : '+'}</span>
                </button>
                {openCat === category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="menu-section-body"
                  >
                    {items.map(item => (
                      <div key={item.name} className="menu-item">
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-dots" />
                        <span className="menu-item-price">{item.price}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--black)', padding: '100px 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="t-display">Common Questions</h2>
          </div>
          {[
            { q: 'Do you charge a deposit?', a: 'Yes — a 20% deposit is collected at booking for services over $100. It is fully refundable with 48 hours\' notice.' },
            { q: 'What is your cancellation policy?', a: 'We require 48 hours\' notice. Cancellations inside 24 hours forfeit the deposit. We understand emergencies — please call us.' },
            { q: 'Can I get a price quote before booking?', a: 'Absolutely. Send us a message or call with your hair/service details and we\'ll give you an accurate estimate within 24 hours.' },
            { q: 'Are there student or loyalty discounts?', a: 'We offer a loyalty programme for clients who visit 4+ times per year. Ask about our Glamore Rewards card at reception.' },
          ].map(({ q, a }) => (
            <div key={q} className="faq-item">
              <h4 className="faq-q">{q}</h4>
              <p className="faq-a">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.main>
  )
}
