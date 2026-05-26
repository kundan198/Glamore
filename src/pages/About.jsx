import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import aboutHero from '../assets/about backup.png'
import founderImg from '../assets/founder_about.png'
import atelierImg from '../assets/servise1.jpg'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const values = [
  { title: 'Artistry', body: 'Every service is treated as a creative act. We stay at the bleeding edge of technique so your look is never ordinary.' },
  { title: 'Integrity', body: 'Honest consultations, transparent pricing, and real results. We only promise what we can deliver - and then exceed it.' },
  { title: 'Warmth', body: 'Luxury without snobbery. Every client is welcomed with genuine warmth and made to feel extraordinary.' },
  { title: 'Sustainability', body: 'We source ethically, use cruelty-free products, and are committed to reducing our environmental footprint.' },
]

const milestones = [
  { year: '2012', title: 'The Beginning', body: 'Founded in a small Beverly Hills suite with three chairs and a dream. Our founder Isabelle Voss believed luxury beauty should feel intimate, not intimidating.' },
  { year: '2015', title: 'Studio Expansion', body: 'Moved to our current 4,000 sq ft flagship. The new space introduced dedicated rooms for bridal consultations, colour suites, and nail artistry.' },
  { year: '2018', title: 'Award Recognition', body: 'Named "Best Luxury Salon" by LA Magazine for three consecutive years. Our bespoke colour technique earned national press coverage.' },
  { year: '2021', title: 'The Glamore Method', body: 'Launched our signature consultation process - a holistic approach combining lifestyle, mood board, and technical analysis for every client.' },
  { year: '2024', title: 'Bridal Atelier', body: 'Opened our dedicated bridal atelier floor, offering full-day experiences for brides and their parties with personalised champagne service.' },
]

function TimelineItem({ year, title, body, index }) {
  const itemRef = useRef(null);
  const dotRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: index % 2 === 0 ? 20 : -20 },
      {
        opacity: 1, x: 0, rotateY: 0, duration: 1.5, ease: 'power4.out',
        scrollTrigger: { trigger: itemRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );

    gsap.fromTo(dotRef.current,
      { scale: 0, boxShadow: '0 0 0 rgba(201,169,110,0)' },
      {
        scale: 1, boxShadow: '0 0 30px rgba(201,169,110,1)', duration: 0.8, ease: 'back.out(2)',
        scrollTrigger: { trigger: itemRef.current, start: 'top 70%' }
      }
    );
  }, { scope: itemRef })

  return (
    <div ref={itemRef} className={`premium-timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
      <div className={`premium-timeline-year`}>{year}</div>
      <div ref={contentRef} className="premium-timeline-content" style={{ perspective: '1000px' }}>
        <h3 className="t-headline" style={{ marginBottom: 12, color: 'var(--white)' }}>{title}</h3>
        <p className="t-body t-dim" style={{ maxWidth: '420px', marginLeft: index % 2 !== 0 ? '0' : 'auto' }}>{body}</p>
      </div>
      <div ref={dotRef} className="premium-timeline-dot" />
    </div>
  )
}

export default function About() {
  const containerRef = useRef(null);
  const heroBgRef = useRef(null);

  useGSAP(() => {
    // 1. Hero 3D Interactive Parallax
    const handleHeroMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPos = (clientX / innerWidth - 0.5) * 60;
      const yPos = (clientY / innerHeight - 0.5) * 60;
      gsap.to(heroBgRef.current, { x: xPos, y: yPos, rotateX: (clientY / innerHeight - 0.5) * 10, rotateY: (clientX / innerWidth - 0.5) * -10, duration: 1.5, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', handleHeroMove);

    // 2. Scroll Zoom Effects for Image Assets
    gsap.to('.about-parallax-img', {
      scale: 1.2,
      scrollTrigger: {
        trigger: '.about-parallax-img',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // 3. Values Card 3D Tilt
    const valueCards = gsap.utils.toArray('.premium-value-card');
    valueCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
      });
    });

    // 4. Reveal Animations
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    return () => window.removeEventListener('mousemove', handleHeroMove);
  }, { scope: containerRef });

  return (
    <motion.main
      ref={containerRef}
      className="premium-about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* 3D Hero */}
      <section className="premium-hero" style={{ perspective: '1500px' }}>
        <div ref={heroBgRef} className="premium-hero-bg" style={{ backgroundImage: `url(${aboutHero})`, transformStyle: 'preserve-3d' }}></div>
        <div className="premium-hero-overlay"></div>
        <div className="premium-hero-content container" style={{ transformStyle: 'preserve-3d' }}>
          <span className="t-label t-gold-em reveal-up" style={{ letterSpacing: '0.5em', marginBottom: '20px', display: 'block' }}>Established 2012</span>
          <h1 className="t-hero reveal-up">Beauty. <br/> Elevated.</h1>
          <p className="t-body-lg reveal-up">Where European craft meets the soul of California.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="premium-mission section-lg" style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div className="container reveal-up">
           <div className="grid-2" style={{ alignItems: 'center', gap: '80px' }}>
              <div className="mission-text">
                <span className="t-label t-gold">Our Vision</span>
                <h2 className="t-display" style={{ marginTop: '20px', fontSize: 'clamp(36px, 6vw, 80px)' }}>The Art of <br/> <span className="t-gold-em">Personalisation</span></h2>
                <p className="t-body-lg" style={{ marginTop: '40px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                  Glamore was built on a simple conviction: every person deserves to feel extraordinary.
                  Not through trends or formulas, but through deeply personalised artistry that sees, celebrates, and elevates who you truly are.
                </p>
              </div>
              <div className="mission-visual" style={{ position: 'relative' }}>
                 <div className="img-reveal-frame" style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={atelierImg} alt="Atelier" className="about-parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 </div>
                 <div className="img-floating-tag"><span>The Studio</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* Philosophy/Values Section */}
      <section className="premium-values section-lg" style={{ background: '#050305' }}>
        <div className="container">
          <div className="sec-header center reveal-up">
            <span className="t-label t-gold">Our Philosophy</span>
            <h2 className="t-display" style={{ marginTop: 12 }}>The Core.</h2>
            <div className="sec-divider"></div>
          </div>
          <div className="premium-values-grid reveal-up">
            {values.map((v, i) => (
              <div key={i} className="premium-value-card" style={{ transformStyle: 'preserve-3d' }}>
                <span className="value-card-number">0{i + 1}</span>
                <div className="value-line"></div>
                <h3 className="t-headline">{v.title}</h3>
                <p className="t-body t-dim">{v.body}</p>
                <div className="card-ambient-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="premium-timeline-section section-lg" style={{ background: '#000' }}>
        <div className="container">
          <div className="sec-header center reveal-up">
            <span className="t-label t-gold">Our Journey</span>
            <h2 className="t-display" style={{ marginTop: 16 }}>Legacy in Motion</h2>
          </div>
          <div className="premium-timeline-layout">
            <div className="premium-timeline-line"></div>
            <div className="premium-timeline-line-glow"></div>
            {milestones.map((m, i) => (
              <TimelineItem key={i} index={i} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="premium-founder section-lg" style={{ background: '#050305' }}>
        <div className="container">
          <div className="founder-layout">
            <div className="founder-sticky-col reveal-up">
              <div className="founder-image-frame"></div>
              <div className="founder-image-tag"><span>Est. 2012</span></div>
              <div className="founder-image-placeholder" style={{ backgroundImage: `url(${founderImg})` }}></div>
            </div>
            <div className="founder-scroll-col reveal-up">
              <div className="founder-text-block">
                <span className="t-label t-gold">Letter from the Founder</span>
                <h2 className="t-headline" style={{ margin: '20px 0', lineHeight: 1.2 }}>
                  "I wanted to create something rare - a space where every person leaves feeling genuinely seen."
                </h2>
                <p className="t-body t-dim" style={{ marginBottom: 32, fontSize: '15px', lineHeight: 1.8 }}>
                  After fifteen years studying under master colourists in Paris and New York, I came home to Los Angeles with one vision: build a studio that married European craft with California warmth.
                </p>
                <div className="founder-signature">
                  <span className="t-gold" style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontStyle: 'italic', display: 'block' }}>Isabelle Voss</span>
                  <span className="t-label" style={{ display: 'block', marginTop: 4, opacity: 0.6, fontSize: '10px' }}>Founder & Creative Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="premium-cta section-lg" style={{ textAlign: 'center', background: '#000' }}>
        <div className="container reveal-up">
          <h2 className="t-display" style={{ marginBottom: 32 }}>Ready to Begin?</h2>
          <Link to="/booking" className="btn btn-gold" style={{ padding: '20px 48px' }}>Book Your Ritual</Link>
        </div>
      </section>

      <style>{`
        .premium-about-page { background: #000; overflow-x: hidden; }
        .premium-hero { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
        .premium-hero-bg { position: absolute; inset: -10%; background-size: cover; background-position: center; filter: brightness(0.4) saturate(1.2); transform: scale(1.05); }
        .premium-hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, #000 100%); }
        .premium-hero-content { position: relative; z-index: 2; }

        .img-reveal-frame { box-shadow: 0 50px 100px rgba(0,0,0,0.6); position: relative; }
        .img-floating-tag { position: absolute; bottom: 30px; right: -20px; background: var(--gold); color: #000; padding: 10px 24px; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.2em; z-index: 5; transform: rotate(-90deg); transform-origin: right bottom; }

        .premium-values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 80px; }
        .premium-value-card { padding: 48px 32px; background: #080006; border: 1px solid rgba(201,169,110,0.1); position: relative; overflow: hidden; transition: border-color 0.4s; }
        .premium-value-card:hover { border-color: var(--gold); }
        .value-card-number { font-family: var(--font-display); font-size: 14px; color: var(--gold); opacity: 0.5; margin-bottom: 24px; display: block; }
        .value-line { height: 1px; width: 30px; background: var(--gold); margin-bottom: 24px; transition: width 0.6s ease; }
        .premium-value-card:hover .value-line { width: 100%; }
        .card-ambient-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(201,169,110,0.1), transparent 70%); opacity: 0; transition: opacity 0.4s; }
        .premium-value-card:hover .card-ambient-glow { opacity: 1; }

        .premium-timeline-layout { position: relative; max-width: 1000px; margin: 0 auto; padding: 60px 0; }
        .premium-timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.1); transform: translateX(-50%); }
        .premium-timeline-line-glow { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--gold); transform: translateX(-50%); box-shadow: 0 0 15px var(--gold); transform-origin: top; z-index: 1; }
        .premium-timeline-item { position: relative; width: 50%; padding: 40px 60px; }
        .premium-timeline-item.left { left: 0; text-align: right; }
        .premium-timeline-item.right { left: 50%; text-align: left; }
        .premium-timeline-year { font-family: var(--font-display); font-size: 64px; color: rgba(201,169,110,0.1); position: absolute; top: 0; font-weight: 700; }
        .left .premium-timeline-year { right: 60px; }
        .right .premium-timeline-year { left: 60px; }
        .premium-timeline-dot { position: absolute; top: 52px; width: 14px; height: 14px; background: #000; border: 2px solid var(--gold); border-radius: 50%; z-index: 2; }
        .left .premium-timeline-dot { right: -7px; transform: translateX(50%); }
        .right .premium-timeline-dot { left: -7px; transform: translateX(-50%); }

        .founder-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: center; }
        .founder-sticky-col { position: relative; height: 600px; }
        .founder-image-placeholder { position: absolute; inset: 0; background-size: cover; background-position: center; border-radius: 2px; z-index: 2; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
        .founder-image-frame { position: absolute; inset: -30px; border: 1px solid var(--gold); opacity: 0.2; z-index: 1; transform: translate(60px, 60px); }
        .founder-image-tag { position: absolute; bottom: 40px; left: -40px; background: #000; border: 1px solid var(--gold); padding: 8px 24px; z-index: 4; transform: rotate(-90deg); transform-origin: left bottom; }
        .founder-image-tag span { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }

        @media (max-width: 1024px) {
          .premium-values-grid { grid-template-columns: repeat(2, 1fr); }
          .founder-layout { grid-template-columns: 1fr; }
          .founder-sticky-col { height: 500px; }
          .premium-timeline-line, .premium-timeline-line-glow { left: 20px; }
          .premium-timeline-item { width: 100%; left: 0 !important; text-align: left !important; padding: 40px 0 40px 60px; }
          .premium-timeline-dot { left: 14px !important; right: auto !important; transform: none !important; }
          .premium-timeline-year { left: 60px !important; right: auto !important; }
        }
      `}</style>
    </motion.main>
  )
}
