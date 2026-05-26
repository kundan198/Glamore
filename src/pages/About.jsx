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
          toggleActions: 'play none none reverse',
          onToggle: (self) => {
            if (self.isActive) {
              itemRef.current.classList.add('is-active')
            } else {
              itemRef.current.classList.remove('is-active')
            }
          }
        }
      }
    );

    // Giant background year parallax
    gsap.fromTo(yearRef.current,
      { y: 100, opacity: 0 },
      {
        y: -100, opacity: 0.04,
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
      <div className="journey-center-node" />
      <div className="about-journey-card-wrap">
        <div ref={contentRef} className="about-journey-card">
          <span className="journey-card-year">{year}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
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
    gsap.fromTo('.about-vision-eyebrow',
      { opacity: 0, x: -15 },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-sentence-copy',
          start: 'top 85%',
        }
      }
    );

    gsap.fromTo('.about-sentence-copy h2 .reveal-line-inner',
      { yPercent: 100, rotate: 3 },
      {
        yPercent: 0, rotate: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about-sentence-copy h2',
          start: 'top 85%',
        }
      }
    );

    gsap.fromTo('.about-sentence-copy p .reveal-para-span',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-sentence-copy p',
          start: 'top 85%',
        }
      }
    );

    gsap.timeline({
      scrollTrigger: {
        trigger: '.img-reveal-frame',
        start: 'top 80%',
      }
    })
    .to('.img-reveal-curtain', {
      scaleX: 0,
      duration: 1.5,
      ease: 'power4.inOut'
    })
    .fromTo('.about-parallax-img',
      { scale: 1.3 },
      {
        scale: 1.05,
        duration: 1.8,
        ease: 'power3.out'
      },
      0
    );

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
                <span className="home-eyebrow about-vision-eyebrow" style={{ display: 'block', marginBottom: '2rem' }}>The Vision</span>
                <h2 className="t-display">
                  <span className="reveal-line-wrap"><span className="reveal-line-inner">Every ritual is a</span></span> <br/>
                  <span className="reveal-line-wrap"><span className="reveal-line-inner">creative act of</span></span> <br/>
                  <span className="reveal-line-wrap"><span className="reveal-line-inner"><em className="t-gold">Personalisation.</em></span></span>
                </h2>
                <p className="t-body-lg" style={{ marginTop: '40px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                  <span className="reveal-para-span" style={{ display: 'block', marginBottom: '10px' }}>We believe beauty isn't a destination, but a language of self-respect.</span>
                  <span className="reveal-para-span" style={{ display: 'block', marginBottom: '10px' }}>Our artists don't just apply colour or style hair;</span>
                  <span className="reveal-para-span" style={{ display: 'block' }}>they translate your individuality into a visual signature.</span>
                </p>
              </div>
              <div className="mission-visual">
                 <div className="img-reveal-frame">
                    <div className="img-reveal-curtain" />
                    <img src={atelierImg} alt="Atelier" className="about-parallax-img" />
                    <div className="story-image-overlay" style={{ zIndex: 3 }} />
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

      <style>{`
        .about-journey-section {
          background: #050406;
          position: relative;
          z-index: 10;
          overflow: hidden;
        }
        
        /* Vision Section Reveal Styles */
        .reveal-line-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.1em;
          margin-bottom: -0.1em;
        }
        .reveal-line-inner {
          display: inline-block;
        }
        .reveal-para-span {
          opacity: 0;
        }
        .img-reveal-frame {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
          aspect-ratio: 4/5;
          width: 100%;
        }
        .img-reveal-curtain {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1c140f, #0d0806);
          z-index: 2;
          transform-origin: right;
        }
        .about-parallax-img {
          width: 100%;
          height: 120%;
          object-fit: cover;
          display: block;
        }
        
        .about-journey-stack {
          position: relative;
          max-width: 1200px;
          margin: 80px auto 0;
          padding: 60px 0;
        }
        .journey-track {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(-50%);
          z-index: 1;
        }
        .journey-progress-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, var(--gold-light), var(--gold), rgba(201, 169, 110, 0.05));
          transform-origin: top;
          transform: scaleY(0);
          box-shadow: 0 0 12px var(--gold);
        }
        .about-journey-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 120px;
          position: relative;
          margin-bottom: 140px;
          align-items: center;
          min-height: 280px;
          z-index: 2;
        }
        .about-journey-item:last-child {
          margin-bottom: 0;
        }
        .about-journey-card-wrap {
          width: 100%;
          display: flex;
          transform-style: preserve-3d;
        }
        .about-journey-item.left .about-journey-card-wrap {
          grid-column: 1;
          justify-content: flex-end;
        }
        .about-journey-item.right .about-journey-card-wrap {
          grid-column: 2;
          justify-content: flex-start;
        }
        .about-journey-card {
          position: relative;
          background: rgba(12, 10, 14, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 44px 48px;
          width: 100%;
          max-width: 520px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          transform-style: preserve-3d;
          transition: border-color 0.5s, box-shadow 0.5s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-journey-card:hover {
          border-color: rgba(201, 169, 110, 0.35);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7), 0 0 30px rgba(201, 169, 110, 0.08);
          transform: translateY(-8px) scale(1.01);
        }
        .journey-card-year {
          font-family: var(--font-accent);
          font-style: italic;
          font-size: 1.85rem;
          color: var(--gold);
          margin-bottom: 12px;
          display: block;
          font-weight: 500;
        }
        .about-journey-card h3 {
          font-family: var(--font-display);
          font-size: 2.1rem;
          color: #fff;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.01em;
        }
        .about-journey-card p {
          font-size: 0.96rem;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.75;
          margin: 0;
        }
        .journey-center-node {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(1);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #080709;
          border: 2px solid rgba(255, 255, 255, 0.2);
          z-index: 10;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 0 0px transparent;
        }
        .about-journey-item.is-active .journey-center-node {
          border-color: var(--gold-light);
          background: var(--gold);
          box-shadow: 0 0 25px var(--gold), 0 0 0 8px rgba(201, 169, 110, 0.22);
          transform: translate(-50%, -50%) scale(1.3);
        }
        .about-journey-year-bg {
          position: absolute;
          font-family: var(--font-display);
          font-size: clamp(12rem, 20vw, 24rem);
          font-weight: 700;
          color: rgba(255, 255, 255, 0.015);
          z-index: 0;
          pointer-events: none;
          line-height: 1;
        }
        .about-journey-item.left .about-journey-year-bg {
          right: 4%;
          top: 0;
        }
        .about-journey-item.right .about-journey-year-bg {
          left: 4%;
          top: 0;
        }

        /* Responsive timeline */
        @media (max-width: 1024px) {
          .journey-track {
            left: 32px;
            transform: none;
          }
          .about-journey-item {
            grid-template-columns: 1fr;
            gap: 0;
            padding-left: 80px;
            margin-bottom: 80px;
          }
          .about-journey-item.left .about-journey-card-wrap,
          .about-journey-item.right .about-journey-card-wrap {
            grid-column: 1;
            justify-content: flex-start;
          }
          .journey-center-node {
            left: 32px;
            top: 48px;
            transform: translate(-50%, -50%);
          }
          .about-journey-item.is-active .journey-center-node {
            transform: translate(-50%, -50%) scale(1.3);
          }
          .about-journey-year-bg {
            display: none;
          }
          .about-journey-card {
            max-width: 100%;
            padding: 36px;
          }
        }
      `}</style>
    </motion.main>
  )
}
