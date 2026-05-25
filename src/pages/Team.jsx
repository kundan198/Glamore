import { useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'

const team = [
  {
    name: 'Isabelle Voss',
    role: 'Founder & Creative Director',
    speciality: 'Colour & Transformation',
    bio: 'Trained in Paris and New York, Isabelle has spent 15 years perfecting the art of colour. She founded Glamore to bring European craft to Los Angeles with a warmth the industry rarely achieves.',
    accolades: ['Best Colourist – LA Magazine 2023', 'NAHA Finalist 2022', 'ELLE Beauty Award 2021'],
    palette: ['#1a0a14', '#2d1428'],
    initials: 'IV',
  },
  {
    name: 'Marcus Chen',
    role: 'Lead Hairstylist',
    speciality: 'Precision Cuts & Texture',
    bio: 'Marcus brings architectural precision to every haircut. His understanding of texture, movement, and face structure produces cuts that are as beautiful on day 30 as day one.',
    accolades: ['BEHINDTHECHAIR Top 10 Stylist', 'Vidal Sassoon Alumni'],
    palette: ['#0a0d1a', '#141e30'],
    initials: 'MC',
  },
  {
    name: 'Sofia Reyes',
    role: 'Senior Colourist',
    speciality: 'Balayage & Blonding',
    bio: 'Sofia\'s balayage work has been featured in three major publications. Her light-handed approach produces colour that photographs like sunlight and grows out gracefully.',
    accolades: ['Matrix Colour Ambassador', 'Goldwell Master Colourist Certified'],
    palette: ['#1a1408', '#2d2210'],
    initials: 'SR',
  },
  {
    name: 'Priya Nair',
    role: 'Head Nail Artist',
    speciality: 'Nail Art & Bridal Nails',
    bio: 'Priya\'s nail art has been called "miniature paintings" by LA Times. She specialises in bespoke bridal nails and 3D embellishments that make your hands the most photographed part of any occasion.',
    accolades: ['CND Educator', 'INIARTCUP International Finalist'],
    palette: ['#0a1408', '#152210'],
    initials: 'PN',
  },
  {
    name: 'Zara Mitchell',
    role: 'Lead Makeup Artist',
    speciality: 'Bridal & Editorial Makeup',
    bio: 'Zara splits her time between our studio and editorial shoots. She brings set-level professionalism to every bridal booking — flawless under any light, lasting through every emotion.',
    accolades: ['IMATS Faculty', 'MAC Pro Team Member'],
    palette: ['#0d0820', '#1a1030'],
    initials: 'ZM',
  },
  {
    name: 'Leo Park',
    role: 'Aesthetician',
    speciality: 'Skincare & Lash Artistry',
    bio: 'Leo\'s facials have a cult following. His clients say it\'s less like a treatment and more like a reset. His lash work completes looks without anyone being able to identify a single lash extension.',
    accolades: ['CIDESCO International Certificate', 'Yumi Lashes Educator'],
    palette: ['#180a08', '#2a1410'],
    initials: 'LP',
  },
]

/* ── Per-member blemish patterns (deterministic positions) ── */
const BLEMISHES = [
  // IV – 4 blemishes
  'radial-gradient(circle 3.5px at 62% 33%,rgba(90,35,10,.65) 0%,transparent 100%),radial-gradient(circle 2.5px at 41% 56%,rgba(80,28,8,.55) 0%,transparent 100%),radial-gradient(circle 3px at 74% 61%,rgba(85,32,12,.6) 0%,transparent 100%),radial-gradient(circle 2px at 52% 44%,rgba(75,25,8,.5) 0%,transparent 100%)',
  // MC – 3 blemishes
  'radial-gradient(circle 3px at 48% 38%,rgba(80,30,10,.6) 0%,transparent 100%),radial-gradient(circle 2.5px at 67% 53%,rgba(90,33,11,.55) 0%,transparent 100%),radial-gradient(circle 3.5px at 36% 67%,rgba(85,30,10,.65) 0%,transparent 100%)',
  // SR – 4 blemishes
  'radial-gradient(circle 2px at 58% 40%,rgba(85,32,10,.55) 0%,transparent 100%),radial-gradient(circle 3px at 39% 62%,rgba(80,28,8,.6) 0%,transparent 100%),radial-gradient(circle 2.5px at 71% 44%,rgba(90,35,12,.5) 0%,transparent 100%),radial-gradient(circle 2px at 50% 70%,rgba(78,26,8,.5) 0%,transparent 100%)',
  // PN – 3 blemishes
  'radial-gradient(circle 3.5px at 55% 36%,rgba(88,34,11,.65) 0%,transparent 100%),radial-gradient(circle 2px at 44% 60%,rgba(80,30,10,.55) 0%,transparent 100%),radial-gradient(circle 3px at 69% 55%,rgba(85,32,10,.6) 0%,transparent 100%)',
  // ZM – 4 blemishes
  'radial-gradient(circle 2.5px at 60% 42%,rgba(82,30,9,.6) 0%,transparent 100%),radial-gradient(circle 3px at 38% 58%,rgba(88,33,10,.65) 0%,transparent 100%),radial-gradient(circle 2px at 73% 35%,rgba(79,27,8,.5) 0%,transparent 100%),radial-gradient(circle 3.5px at 51% 67%,rgba(86,32,11,.55) 0%,transparent 100%)',
  // LP – 3 blemishes
  'radial-gradient(circle 3px at 46% 41%,rgba(83,31,10,.6) 0%,transparent 100%),radial-gradient(circle 2.5px at 65% 56%,rgba(89,34,11,.55) 0%,transparent 100%),radial-gradient(circle 2px at 57% 65%,rgba(80,28,9,.5) 0%,transparent 100%)',
]

/* Sparkle emitter on clean reveal */
function Sparkles({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:4 }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i / 9) * 360
            const dist  = 28 + (i % 3) * 18
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
                animate={{
                  opacity: [0, 1, 0],
                  scale:   [0, 1.2, 0],
                  x: `calc(50% + ${Math.cos(angle * Math.PI / 180) * dist}%)`,
                  y: `calc(50% + ${Math.sin(angle * Math.PI / 180) * dist}%)`,
                }}
                transition={{ duration: 0.65, delay: i * 0.04, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 4, height: 4,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  boxShadow: '0 0 6px 2px rgba(201,169,110,0.8)',
                  left: 0, top: 0,
                  transform: 'translate(-50%,-50%)',
                }}
              />
            )
          })}
        </div>
      )}
    </AnimatePresence>
  )
}

function TeamCard({ member, index }) {
  const cardRef  = useRef(null)
  const pal      = member.palette
  const [clean,  setClean]  = useState(false)
  const [sparks, setSparks] = useState(false)

  const onEnter = useCallback(() => {
    setClean(true)
    setSparks(true)
    setTimeout(() => setSparks(false), 900)
  }, [])
  const onLeave = useCallback(() => setClean(false), [])

  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { y: 80, opacity: 0, rotateX: -14, scale: 0.94, transformOrigin: 'center 85%' },
      {
        y: 0, opacity: 1, rotateX: 0, scale: 1,
        duration: 1.15, ease: 'expo.out',
        delay: (index % 3) * 0.14,
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%' },
      }
    )
  }, { scope: cardRef })

  return (
    <div ref={cardRef} className="team-card">
      {/* ── Portrait with dirty→clean effect ── */}
      <div
        className={`team-card-portrait tcp${clean ? ' tcp--clean' : ''}`}
        style={{ background: `linear-gradient(160deg, ${pal[0]}, ${pal[1]})` }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {/* Tan / dirt overlay */}
        <div className="tcp-tan" />

        {/* Pimples / blemishes */}
        <div
          className="tcp-blemishes"
          style={{ backgroundImage: BLEMISHES[index] }}
        />

        {/* Oily-skin noise */}
        <div className="tcp-noise" />

        {/* Clean reveal sweep */}
        <div className="tcp-sweep" />

        {/* Post-clean glow */}
        <div className="tcp-glow" />

        {/* Clean badge */}
        <div className="tcp-badge">✦ Glowing</div>

        {/* Hover hint */}
        {!clean && (
          <div className="tcp-hint">Hover to reveal</div>
        )}

        <Sparkles active={sparks} />

        <div className={`team-card-initials${clean ? ' tci--clean' : ''}`}>{member.initials}</div>
        <div className="team-card-shimmer" />
      </div>

      <div className="team-card-body">
        <h3 className="team-card-name">{member.name}</h3>
        <span className="team-card-role t-label t-gold-em">{member.role}</span>
        <span className="team-card-spec">{member.speciality}</span>
        <p className="team-card-bio">{member.bio}</p>
        <div className="team-card-accolades">
          {member.accolades.map(a => (
            <span key={a} className="team-accolade">{a}</span>
          ))}
        </div>
        <Link to="/booking" className="btn btn-outline" style={{ marginTop: 20, padding: '10px 20px', fontSize: 12 }}>
          Book with {member.name.split(' ')[0]}
        </Link>
      </div>
    </div>
  )
}

export default function Team() {
  useGSAP(() => {
    gsap.fromTo('.team-hero-title',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    )
    gsap.fromTo('.team-hero-sub',
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
      <section className="page-hero" style={{ background: 'linear-gradient(180deg, #0a0014 0%, #000 60%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="t-label t-gold-em team-hero-title" style={{ marginBottom: 20, display: 'block' }}>The Artists</span>
          <h1 className="t-hero team-hero-title">Talent That<br />Speaks for Itself.</h1>
          <p className="t-body-lg team-hero-sub" style={{ maxWidth: 500, margin: '28px auto 0', color: 'var(--text-2)' }}>
            Six specialists at the peak of their craft. Collectively trained across four continents and ten disciplines.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section style={{ background: 'var(--black)', padding: '100px 0 120px' }}>
        <div className="container">
          <div className="team-grid">
            {team.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
          </div>
        </div>
      </section>

      {/* Join the team */}
      <section style={{ background: 'var(--near-black)', padding: '100px 0' }}>
        <div className="container" style={{ maxWidth: 720, textAlign: 'center' }}>
          <span className="t-label t-gold-em" style={{ marginBottom: 20, display: 'block' }}>Careers</span>
          <h2 className="t-display" style={{ marginBottom: 24 }}>Join Our Studio</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.9, marginBottom: 40 }}>
            We are always looking for exceptional talent — artists who are obsessed with craft, deeply empathetic with clients, and eager to grow in a collaborative, high-standard environment.
          </p>
          <a href="mailto:careers@glamorestudio.com" className="btn btn-gold">Send Your Portfolio →</a>
        </div>
      </section>
    </motion.main>
  )
}
