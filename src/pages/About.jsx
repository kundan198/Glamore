import { useRef, useEffect } from 'react'
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

const milestones = [
  { year: '2012', title: 'The Beginning', body: 'Believed luxury beauty should feel intimate, not intimidating.' },
  { year: '2015', title: 'Studio Expansion', body: 'Moved to our current 4,000 sq ft flagship. Introduced dedicated rooms for bridal consultations.' },
  { year: '2018', title: 'Award Recognition', body: 'Named "Best Luxury Salon" by LA Magazine for three consecutive years.' },
  { year: '2021', title: 'The Glamore Method', body: 'Launched our signature consultation process - a holistic approach combining lifestyle and technical analysis.' },
  { year: '2024', title: 'Bridal Atelier', body: 'Opened our dedicated bridal atelier floor, offering full-day experiences with personalised service.' },
]

/* ── COMPONENT: FLOATING AURA ── */
function AboutAtmosphere() {
  return (
    <div className="about-aurora-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <div className="about-aurora" />
      <div className="about-dust-field">
        {[...Array(10)].map((_, i) => <span key={i} />)}
      </div>
    </div>
  )
}

function TimelineItem({ year, title, body, index }) {
  const itemRef = useRef(null);
  const contentRef = useRef(null);
  const yearRef = useRef(null);

  useGSAP(() => {
    // Content box entrance
    gsap.fromTo(contentRef.current,
      {
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        rotateY: index % 2 === 0 ? 30 : -30,
        filter: 'blur(15px)'
      },
      {
        opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)',
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Giant background year parallax
    gsap.fromTo(yearRef.current,
      { y: 100, opacity: 0 },
      {
        y: -100, opacity: 0.1,
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  }, { scope: itemRef })

  return (
    <div ref={itemRef} className={`about-journey-item ${index % 2 === 0 ? 'left' : 'right'}`}>
      <div ref={yearRef} className="about-journey-year-bg">{year}</div>

      <div ref={contentRef} className="about-journey-card">
        <div className="card-edge-highlight" />
        <div className="about-journey-content">
          <div className="journey-node-tag">
             <span className="journey-node-dot" />
             <span className="journey-node-year">{year}</span>
          </div>
          <h3 className="t-headline">{title}</h3>
          <p className="t-body">{body}</p>
        </div>
        <div className="testimonial-card-glow" />
      </div>
    </div>
  )
}

export default function About() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const coreSectionRef = useRef(null);
  const journeyRef = useRef(null);

  useGSAP(() => {
    // 1. Hero Scroll Parallax
    gsap.to('.premium-hero-bg', {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 2. Journey Timeline Line Progress
    gsap.fromTo('.journey-progress-line',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-journey-stack',
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: true
        }
      }
    );

    gsap.to(heroContentRef.current, {
      y: -150,
      opacity: 0,
      scale: 0.9,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom 20%',
        scrub: true
      }
    });

    // 2. Vision Section Reveal
    gsap.to('.about-parallax-img', {
      y: -80,
      scrollTrigger: {
        trigger: '.about-parallax-img',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // 5. Founder Image Cinematic Reveal & Parallax
    gsap.fromTo('.founder-portrait',
      { filter: 'blur(30px)', opacity: 0, scale: 1.1 },
      {
        filter: 'blur(0px)', opacity: 1, scale: 1,
        duration: 1.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.home-story',
          start: 'top 75%',
        }
      }
    );

    gsap.to('.founder-image-container', {
      y: -80,
      scrollTrigger: {
        trigger: '.home-story',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    gsap.from('.founder-image-accent-frame', {
      opacity: 0,
      scale: 0.9,
      duration: 1.5,
      scrollTrigger: {
        trigger: '.home-story',
        start: 'top 70%',
      }
    });

  }, { scope: containerRef });

  return (
    <motion.main
      ref={containerRef}
      className="about-dust-page"
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <AboutAtmosphere />

      {/* 1. CINEMATIC HERO */}
      <section ref={heroRef} className="premium-hero" style={{ perspective: '2000px' }}>
        <div className="premium-hero-bg" style={{ backgroundImage: `url(${aboutHero})`, transformStyle: 'preserve-3d' }}></div>
        <div className="premium-hero-overlay"></div>
        <div ref={heroContentRef} className="premium-hero-content container" style={{ transformStyle: 'preserve-3d' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="home-eyebrow"
          >
            ✦ The Atelier Ritual
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="premium-title"
          >
            Beauty <br/> <em>Redefined.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="premium-subcopy"
          >
            Crafting confidence through European precision and California light.
          </motion.p>
        </div>
      </section>

      {/* 2. VISION SCRUB REVEAL */}
      <section className="section about-dust-scene">
        <div className="container">
           <div className="grid-2" style={{ alignItems: 'center', gap: 'clamp(40px, 8vw, 120px)' }}>
              <div className="about-reveal about-sentence-copy">
                <span className="home-eyebrow" style={{ display: 'block', marginBottom: '2rem' }}>The Vision</span>
                <h2 className="t-display">
                  <span>Every ritual is a</span> <br/>
                  <span>creative act of</span> <br/>
                  <span><em className="t-gold">Personalisation.</em></span>
                </h2>
                <p className="t-body-lg" style={{ marginTop: '40px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>We believe beauty isn't a destination, but a language of self-respect.</span> <span>Our artists don't just apply colour or style hair;</span> <span>they translate your individuality into a visual signature.</span>
                </p>
              </div>
              <div className="mission-visual">
                 <div className="img-reveal-frame">
                    <img src={atelierImg} alt="Atelier" className="about-parallax-img" />
                    <div className="story-image-overlay" style={{ transform: 'translate(-20px, -20px)' }} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. HORIZONTAL MILESTONE TRACK */}
      <section ref={journeyRef} className="about-journey-section section-lg">
        <div className="container">
          <div className="home-section-head center">
            <p className="home-eyebrow">The Journey</p>
            <h2>Legacy <em>in Motion</em></h2>
          </div>

          <div className="about-journey-stack">
            {/* The Central Path */}
            <div className="journey-track">
               <div className="journey-base-line" />
               <div className="journey-progress-line" />
            </div>

            {milestones.map((m, i) => (
              <TimelineItem key={i} index={i} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUNDER EDITORIAL */}
      <section className="section home-story" style={{ overflow: 'visible' }}>
        <div className="container home-story-grid">
          <div className="founder-sticky-col">
            <div className="founder-image-container">
               <img src={founderImg} alt="Founder" className="founder-portrait" />
               <div className="founder-image-accent-frame" />
               <div className="story-image-overlay" style={{ inset: '-15%', border: '1px solid rgba(201,169,110,0.2)' }} />
               <div className="founder-image-accent" />
            </div>
          </div>
          <div className="founder-text-block about-reveal">
            <p className="home-eyebrow"><span>The Founder</span></p>
            <h2 className="t-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              <span>"I wanted to create</span> <br/>
              <span>something <em>rare.</em>"</span>
            </h2>
            <p className="t-body-lg" style={{ margin: '30px 0', lineHeight: 1.8 }}>
              <span>After fifteen years studying under master colourists in Paris and New York, Isabelle Voss founded Glamore to marry European craft with California warmth.</span> <span>A space where every person leaves feeling genuinely seen.</span>
            </p>
            <div className="founder-signature" style={{ opacity: 0.8 }}>
              <span className="t-gold" style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontStyle: 'italic' }}>Isabelle Voss</span>
              <span className="t-label" style={{ display: 'block', opacity: 0.6, letterSpacing: '0.2em' }}>Founder & Creative Director</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-dust-transition" />

      {/* 6. CTA */}
      <section className="home-cta">
        <div className="container home-cta-inner">
          <div className="cta-text">
            <p className="home-eyebrow">Ready to begin your journey?</p>
            <h2>Your next ritual awaits.</h2>
          </div>
          <Link to="/booking" className="btn btn-gold">Reserve Your Session</Link>
        </div>
      </section>
    </motion.main>
  )
}
