import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'

// Asset Imports
import servHero from '../assets/serv.png'
import hairStylingImg from '../assets/servise3.jpg'
import hairColourImg from '../assets/haircolur.jpg'
import beautyImg from '../assets/servise4.jpg'
import makeupImg from '../assets/servise5.jpg'
import nailsImg from '../assets/servise6.jpg'

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'hair-styling',
    label: 'Hair Styling',
    icon: '✦',
    accent: '#C9A96E',
    image: hairStylingImg,
    intro: 'Precision architecture designed to move with you.',
    services: [
      { id: 'h1', name: 'The Glamore Cut', time: '90 min', price: '$120', desc: 'A bespoke consultation and precision cut tailored to your face shape, texture, and lifestyle.' },
      { id: 'h2', name: 'Red Carpet Blowout', time: '60 min', price: '$85', desc: 'High-volume, bouncy finish using premium heat-protectant silk proteins.' },
      { id: 'h3', name: 'Keratin Smoothing', time: '3 hours', price: '$320', desc: 'Advanced smoothing treatment that eliminates frizz for up to 12 weeks.' },
      { id: 'h4', name: 'Deep Sea Ritual', time: '45 min', price: '$95', desc: 'Mineral-rich hydration mask and intense scalp micro-massage.' },
      { id: 'h5', name: 'Red Carpet Updo', time: '90 min', price: '$150', desc: 'Sculpted formal styling for galas, premieres, and high-profile events.' },
      { id: 'h6', name: 'Silk Press Ritual', time: '2 hours', price: '$135', desc: 'Non-chemical straightening ritual using thermal heat and organic serums for maximum shine.' },
      { id: 'h7', name: 'Atelier Extensions', time: '5 hours', price: '$800', desc: 'Premium hand-tied weft application for seamless volume and length.' }
    ]
  },
  {
    id: 'hair-colour',
    label: 'Hair Colour',
    icon: '◈',
    accent: '#8B7FD4',
    image: hairColourImg,
    intro: 'Bespoke tones mixed like fine art.',
    services: [
      { id: 'c1', name: 'Signature Balayage', time: '4 hours', price: '$295', desc: 'Hand-painted highlights for a sun-kissed, dimensional glow.' },
      { id: 'c2', name: 'Luxe Full Colour', time: '2 hours', price: '$165', desc: 'Rich, uniform pigment application using ammonia-free formulas.' },
      { id: 'c3', name: 'Platinum Restoration', time: '6 hours', price: '$450', desc: 'Ultimate blonde transformation with dual-stage lifting.' },
      { id: 'c4', name: 'Gloss Refresh', time: '45 min', price: '$75', desc: 'Semi-permanent toner to neutralise brassiness and seal shine.' },
      { id: 'c5', name: 'Colour Correction', time: '5 hours', price: '$500', desc: 'Advanced pigment removal and structural re-toning for complex transitions.' }
    ]
  },
  {
    id: 'nails',
    label: 'Nail Artistry',
    icon: '❋',
    accent: '#7EC8A4',
    image: nailsImg,
    intro: 'Wearable jewellery through avant-garde design.',
    services: [
      { id: 'n1', name: 'Sculpted Extensions', time: '2 hours', price: '$130', desc: 'Extraordinarily durable extensions sculpted by hand with premium hard gel.' },
      { id: 'n2', name: 'Apothecary Mani', time: '75 min', price: '$85', desc: 'Organic herb soak, sea salt exfoliation, and targeted hydration treatment.' },
      { id: 'n3', name: 'Fine Line Artistry', time: '3 hours', price: '$180', desc: 'Intricate hand-painted patterns, gold leaf detailing, and 3D elements.' },
      { id: 'n4', name: 'The Gel Overlay', time: '60 min', price: '$75', desc: 'Reinforced strength for natural nails with a high-gloss finish.' },
      { id: 'n5', name: 'Silk Wrap Ritual', time: '90 min', price: '$110', desc: 'Traditional silk wrapping for natural strengthening and repair of delicate nails.' },
      { id: 'n6', name: 'Crystal Adornment', time: '4 hours', price: '$240', desc: 'Premium Swarovski crystal placement and precision jewelry embedding for high-end occasions.' }
    ]
  },
  {
    id: 'beauty',
    label: 'Skin & Lashes',
    icon: '⬡',
    accent: '#E8A0A0',
    image: beautyImg,
    intro: 'Surgical precision meets holistic wellness.',
    services: [
      { id: 'b1', name: 'Cryo-Glow Facial', time: '90 min', price: '$195', desc: 'Sculpting cold therapy combined with high-potency Vitamin C.' },
      { id: 'b2', name: 'Silk Lash Set', time: '2.5 hours', price: '$210', desc: 'Individual silk extensions applied strand-by-strand for dramatic volume.' },
      { id: 'b3', name: 'Brow Architecture', time: '45 min', price: '$85', desc: 'Custom mapping, bespoke tinting, and precision shaping.' },
      { id: 'b4', name: 'Lash Lift & Tint', time: '60 min', price: '$115', desc: 'A chemical lift that curls your natural lashes from the root.' },
      { id: 'b5', name: 'Oxygen Recovery', time: '75 min', price: '$180', desc: 'Hyperbaric oxygen infusion to plump skin and reverse environmental fatigue.' }
    ]
  }
]

function ServiceDetailModal({ service, accent, onClose }) {
  const navigate = useNavigate();

  const handleDelayedNav = (e, path) => {
    e.preventDefault();
    onClose();
    setTimeout(() => navigate(path), 700);
  };

  return (
    <motion.div
      className="srv-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="srv-modal-perspective">
        <motion.div
          className="srv-physical-card"
          initial={{ rotateY: -180, rotateX: 30, scale: 0.4, y: 300, opacity: 0 }}
          animate={{ rotateY: 0, rotateX: 0, scale: 1, y: 0, opacity: 1 }}
          exit={{ rotateY: 180, rotateX: -30, scale: 0.4, y: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, mass: 1.5 }}
          onClick={e => e.stopPropagation()}
          style={{ '--accent': accent }}
        >
          <div className="card-face">
            <button className="card-close-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="card-content-layout">
              <div className="card-side-header">
                <div className="card-id">Ritual No. {service.id.toUpperCase()}</div>
                <h2 className="card-title t-display">{service.name}</h2>
                <div className="card-price-display">
                  <span className="curr">$</span>
                  <span className="amt">{service.price.replace('$', '')}</span>
                </div>
              </div>

              <div className="card-main-body">
                <p className="card-description">{service.desc}</p>
                <div className="card-specs-row">
                  <div className="spec-item">
                    <label>Duration</label>
                    <span>{service.time}</span>
                  </div>
                  <div className="spec-item">
                    <label>Tier</label>
                    <span>Elite Ritual</span>
                  </div>
                </div>
                <div className="card-actions-area">
                  <button onClick={(e) => handleDelayedNav(e, '/booking')} className="btn btn-gold card-btn">Proceed to Booking</button>
                  <button onClick={(e) => handleDelayedNav(e, '/contact')} className="btn btn-outline card-btn" style={{ marginTop: '12px' }}>Inquiry</button>
                </div>
              </div>
            </div>
            <div className="card-shimmer-light"></div>
            <div className="card-bottom-glow" style={{ background: `radial-gradient(circle at center, ${accent}33, transparent 70%)` }}></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ServiceListItem({ service, accent, onClick }) {
  return (
    <motion.div
      className="srv-list-item"
      whileHover={{ y: -5, borderColor: accent, scale: 1.01 }}
      onClick={() => onClick(service)}
      style={{ '--accent': accent }}
    >
      <div className="sli-top">
        <span className="sli-id">{service.id}</span>
        <div className="sli-dot"></div>
      </div>
      <h4 className="sli-name">{service.name}</h4>
      <div className="sli-bottom">
        <span className="sli-price">{service.price}</span>
        <span className="sli-more">Discover →</span>
      </div>
      <div className="sli-hover-bg"></div>
    </motion.div>
  )
}

export default function Services() {
  const [activeCat, setActiveCat] = useState(categories[0].id)
  const [selectedService, setSelectedService] = useState(null)
  const [isNavMinimized, setIsNavMinimized] = useState(true)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pageRef = useRef(null)
  const horizontalRef = useRef(null)
  const heroBgRef = useRef(null)

  const navItemsRef = useRef([])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1100)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useGSAP(() => {
    if (isMobile) return;
    // 1. Hero Reveal Parallax (Scroll Driven)
    gsap.to(heroBgRef.current, {
      yPercent: 30,
      scale: 1.2,
      rotateX: 10,
      scrollTrigger: {
        trigger: '.srv-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.srv-hero-content', {
      yPercent: -50,
      opacity: 0,
      scrollTrigger: {
        trigger: '.srv-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // MatchMedia for horizontal scroll
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1101px)", () => {
      // 2. Horizontal Scroll Section - Fully Dynamic for N categories
      const sections = gsap.utils.toArray('.srv-cat-section');
      if (sections.length > 0) {
        const scrollTween = gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 1,
            snap: sections.length > 1 ? 1 / (sections.length - 1) : 0,
            end: () => `+=${sections.length * window.innerWidth}`,
            onUpdate: (self) => {
              const index = Math.round(self.progress * (sections.length - 1));
              if (categories[index]) setActiveCat(categories[index].id);
            }
          }
        });

        // 3. Deep Parallax for backgrounds and content
        sections.forEach((section, i) => {
          const img = section.querySelector('.srv-cat-img');
          const info = section.querySelector('.srv-cat-info');
          const listPanel = section.querySelector('.srv-cat-list-panel');

          gsap.fromTo(img,
            { scale: 1.8, rotateY: -15, z: -200, opacity: 0.1 },
            {
              scale: 1, rotateY: 15, z: 0, opacity: 0.5,
              scrollTrigger: {
                trigger: section,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true
              }
            }
          );

          gsap.from(info, {
            opacity: 0, x: -30, rotateY: -15,
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: 'left 80%',
              end: 'left 20%',
              scrub: 0.5
            }
          });

          gsap.from(listPanel, {
            opacity: 0, y: 100, rotateX: -20,
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: 'left 80%',
              end: 'left 20%',
              scrub: 0.5
            }
          });
        });
      }
    });

    // 4. Mobile vertical scroll triggers to sync active tab
    mm.add("(max-width: 1100px)", () => {
      categories.forEach((cat) => {
        ScrollTrigger.create({
          trigger: `#${cat.id}`,
          start: "top 180px",
          end: "bottom 180px",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveCat(cat.id);
            }
          }
        });
      });
    });

    // 5. Smooth Section Skew during scroll
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".srv-cat-layout", "skewX", "deg"),
        clamp = gsap.utils.clamp(-5, 5);

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
        }
      }
    });

    return () => mm.revert();
  }, { scope: pageRef, dependencies: [isMobile] });

  const scrollToCategory = (id) => {
    const index = categories.findIndex(c => c.id === id);
    const scrollST = ScrollTrigger.getAll().find(st => st.vars.trigger === horizontalRef.current);
    if (scrollST) {
      const target = scrollST.start + (scrollST.end - scrollST.start) * (index / (categories.length - 1));
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }

  const handleMobileTabClick = (id) => {
    setActiveCat(id);
    const el = document.querySelector('.srv-mobile-nav-wrap');
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 82; // Header offset
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  }

  const isFullyExpanded = !isNavMinimized || isNavHovered;

  return (
    <motion.div ref={pageRef} className={`premium-services-page${!isFullyExpanded ? ' nav-minimized' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* 0. 3D Parallax Hero */}
      <section className="srv-hero" style={{ perspective: '2000px' }}>
        <div
          ref={heroBgRef}
          className="srv-hero-bg"
          style={{
            backgroundImage: `url('${servHero}')`,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        ></div>
        <div className="srv-hero-overlay"></div>
        <div className="container srv-hero-content">
          <span className="t-label t-gold-em" style={{ fontSize: '13px', letterSpacing: '0.6em', marginBottom: 'clamp(10px, 2vh, 20px)', display: 'block' }}>Architectural Beauty</span>
          <h1 className="t-display" style={{ fontSize: 'clamp(44px, min(10vw, 13vh), 130px)', lineHeight: 0.8 }}>Services <span className="t-gold-em">&</span> Rituals</h1>
          <p className="t-body-lg" style={{ marginTop: 'clamp(15px, 4vh, 40px)', maxWidth: '650px', margin: 'clamp(15px, 4vh, 40px) auto 0', opacity: 0.7 }}>A curated journey of self-preservation. Move through our chapters of excellence.</p>

          <div className="srv-hero-scroll-cue">
            <div className="scroll-line"></div>
            <span>Scroll Rituals</span>
          </div>
        </div>
      </section>

      {/* 1. Atelier Luxury Sidebar Nav (With Minimize Toggle & Hover Expand) */}
      <nav
        className={`srv-atelier-nav${!isFullyExpanded ? ' minimized' : ''}`}
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        <button
          className="nav-minimize-toggle"
          onClick={() => {
            setIsNavMinimized(!isNavMinimized);
            setIsNavHovered(false); // Reset hover on click to prevent state stickiness
          }}
          aria-label={isNavMinimized ? "Expand Menu" : "Minimize Menu"}
        >
          <motion.div
            animate={{ rotate: isNavMinimized ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </button>

        <div className="nav-indicator-track">
          <motion.div
            className="nav-active-blob"
            animate={{
              y: categories.findIndex(c => c.id === activeCat) * 72, // Responsive button height
              backgroundColor: categories.find(c => c.id === activeCat)?.accent
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        {categories.map((c, index) => (
          <button
            key={c.id}
            className={`san-btn ${activeCat === c.id ? 'active' : ''}`}
            onClick={() => scrollToCategory(c.id)}
            style={{ '--accent': c.accent }}
          >
            <div className="san-icon-box">
              <span className="san-icon">{c.icon}</span>
            </div>
            <div className="san-label-box" style={{
              opacity: isFullyExpanded ? 1 : 0,
              transform: isFullyExpanded ? 'translateX(0)' : 'translateX(-10px)',
              pointerEvents: isFullyExpanded ? 'auto' : 'none'
            }}>
              <span className="san-label">{c.label}</span>
              <div className="san-progress-bar">
                <motion.div
                  className="san-progress-fill"
                  animate={{ scaleX: activeCat === c.id ? 1 : 0 }}
                  style={{ background: c.accent }}
                />
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* ── LUXURY FLOATING GLASS TAB BAR (mobile only) ── */}
      {isMobile && (
        <div className="srv-mob-tabbar-wrap">
          <div className="srv-mob-tabbar">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`smtb-btn ${activeCat === c.id ? 'active' : ''}`}
                onClick={() => handleMobileTabClick(c.id)}
                style={{ '--accent': c.accent }}
              >
                {activeCat === c.id && (
                  <motion.span
                    layoutId="atelier-tab-glow"
                    className="smtb-pill"
                    style={{ background: `linear-gradient(135deg, ${c.accent}22, ${c.accent}08)`, borderColor: `${c.accent}55` }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="smtb-icon">{c.icon}</span>
                <span className="smtb-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN VIEW: Luxury Atelier Mobile vs Desktop 3D Gallery ── */}
      {isMobile ? (
        <div className="srv-atelier-mobile">
          <AnimatePresence mode="wait">
            {categories.filter(c => c.id === activeCat).map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="srv-atelier-view"
              >
                {/* ── CINEMATIC HERO BANNER ── */}
                <div className="sam-hero" style={{ '--accent': cat.accent }}>
                  <img src={cat.image} alt={cat.label} className="sam-hero-img" />
                  <div className="sam-hero-overlay" />
                  <div className="sam-hero-content">
                    <motion.span
                      className="sam-eyebrow"
                      style={{ color: cat.accent }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      {cat.icon}&ensp;Atelier Selection
                    </motion.span>
                    <motion.h2
                      className="sam-hero-title"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.55 }}
                    >
                      {cat.label}
                    </motion.h2>
                    <motion.p
                      className="sam-hero-intro"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.26, duration: 0.5 }}
                    >
                      {cat.intro}
                    </motion.p>
                    <motion.div
                      className="sam-hero-rule"
                      style={{ background: `linear-gradient(to right, ${cat.accent}, transparent)` }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* ── STAGGERED SERVICE ROWS ── */}
                <div className="sam-list">
                  {cat.services.map((s, i) => (
                    <motion.div
                      key={s.id}
                      className="sam-row"
                      style={{ '--accent': cat.accent }}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Left: number + accent line */}
                      <div className="sam-row-num">
                        <span className="sam-num-text">{String(i + 1).padStart(2, '0')}</span>
                        <span className="sam-num-line" style={{ background: cat.accent }} />
                      </div>

                      {/* Centre: name + description */}
                      <div className="sam-row-body">
                        <h3 className="sam-row-name">{s.name}</h3>
                        <p className="sam-row-desc">{s.desc}</p>
                      </div>

                      {/* Right: price + time + CTA */}
                      <div className="sam-row-meta">
                        <span className="sam-row-price" style={{ color: cat.accent }}>{s.price}</span>
                        <span className="sam-row-time">{s.time}</span>
                        <Link to="/booking" className="sam-row-cta">Book →</Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div ref={horizontalRef} className="srv-horizontal-wrap">
          {/* Left Arrow - Positioned to not overlap sidebar */}
          <button
            className="srv-nav-arrow srv-nav-prev"
            onClick={() => {
              const index = categories.findIndex(c => c.id === activeCat);
              if (index > 0) scrollToCategory(categories[index - 1].id);
            }}
            disabled={activeCat === categories[0].id}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            className="srv-nav-arrow srv-nav-next"
            onClick={() => {
              const index = categories.findIndex(c => c.id === activeCat);
              if (index < categories.length - 1) scrollToCategory(categories[index + 1].id);
            }}
            disabled={activeCat === categories[categories.length - 1].id}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="srv-track">
            {categories.map((cat) => (
              <section key={cat.id} id={cat.id} className="srv-cat-section" style={{ perspective: '2500px' }}>
                <div className="srv-cat-layout" style={{ transformStyle: 'preserve-3d' }}>
                  {/* 3D Visual Block */}
                  <div className="srv-cat-visual" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="srv-cat-img-wrap" style={{ transformStyle: 'preserve-3d' }}>
                      <img src={cat.image} alt={cat.label} className="srv-cat-img" />
                      <div className="srv-cat-img-overlay"></div>
                      <div className="srv-cat-ambient-light" style={{ background: `radial-gradient(circle at 30% 30%, ${cat.accent}22, transparent 60%)` }}></div>
                    </div>
                    <div className="srv-cat-info" style={{ transformStyle: 'preserve-3d' }}>
                      <span className="t-label" style={{ color: cat.accent, marginBottom: '24px', display: 'block', fontSize: '11px', letterSpacing: '0.3em' }}>Atelier Selection</span>
                      <h2 className="t-hero" style={{ fontSize: 'clamp(32px, 4.2vw, 80px)', lineHeight: 0.9 }}>{cat.label.split(' ')[0]} <br/> <span className="t-gold-em">Curation</span></h2>
                    </div>
                  </div>

                  {/* Vertical Scroll List of Services */}
                  <div className="srv-cat-list-panel">
                    <div className="srv-list-scrollable">
                      <div className="srv-items-flex">
                        {cat.services.map(s => (
                          <ServiceListItem
                            key={s.id}
                            service={s}
                            accent={cat.accent}
                            onClick={(srv) => setSelectedService({ ...srv, accent: cat.accent })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            accent={selectedService.accent}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .premium-services-page { background: #000; }

        /* Hero Section */
        .srv-hero { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
        .srv-hero-bg { position: absolute; inset: -20%; background-size: cover; background-position: center; filter: brightness(0.4) saturate(1.2); }
        .srv-hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, #000 100%); z-index: 1; }
        .srv-hero-content { position: relative; z-index: 2; transform-style: preserve-3d; }
        .srv-hero-scroll-cue { position: absolute; bottom: clamp(20px, 5vh, 50px); left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 1.5vh, 15px); opacity: 0.4; }
        .scroll-line { width: 1px; height: clamp(30px, 6vh, 60px); background: linear-gradient(to bottom, var(--gold), transparent); animation: scroll-line-anim 2s infinite; }
        @keyframes scroll-line-anim { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 50.1% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
        .srv-hero-scroll-cue span { font-size: 9px; text-transform: uppercase; letter-spacing: 0.3em; color: #fff; }

        /* Atelier Sidebar Nav */
        .srv-atelier-nav {
          position: fixed; top: 50%; left: 30px; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 12px; z-index: 150;
          padding: 24px; border-radius: 30px;
          background: rgba(0,0,0,0.3); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.05);
          width: 260px;
          transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.6s ease;
        }

        .srv-atelier-nav.minimized {
          width: 88px;
          padding: 24px 20px;
          background: rgba(0,0,0,0.6);
        }

        .nav-minimize-toggle {
          position: absolute; top: -15px; right: -15px; width: 34px; height: 34px;
          background: var(--gold); color: #000; border: none; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; box-shadow: 0 5px 15px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }
        .nav-minimize-toggle:hover { transform: scale(1.1); }

        .nav-indicator-track { position: absolute; left: 18px; top: 34px; bottom: 34px; width: 1px; background: rgba(255,255,255,0.05); transition: opacity 0.4s ease; }
        .srv-atelier-nav.minimized .nav-indicator-track { opacity: 0; }
        .nav-active-blob {
          position: absolute; left: -10px; top: 0; width: 44px; height: 44px;
          border-radius: 50%; filter: blur(20px); opacity: 0.4; z-index: 0;
        }

        .san-btn {
          background: none; border: none; display: flex; align-items: center;
          gap: 20px; cursor: pointer; padding: 12px 0; width: 100%;
          position: relative; z-index: 1; transition: all 0.4s ease;
        }
        .san-icon-box {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.4); transition: all 0.4s ease;
          flex-shrink: 0;
        }
        .san-icon { font-size: 16px; }

        .san-label-box {
          display: flex; flex-direction: column; gap: 6px; text-align: left;
          transition: opacity 0.4s ease, transform 0.4s ease;
          white-space: nowrap;
        }

        .san-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4); font-weight: 700; transition: all 0.4s ease;
        }
        .san-progress-bar { width: 120px; height: 1px; background: rgba(255,255,255,0.05); position: relative; }
        .san-progress-fill { position: absolute; inset: 0; transform-origin: left; }

        .san-btn:hover .san-icon-box { border-color: rgba(255,255,255,0.2); color: #fff; }
        .san-btn:hover .san-label { color: #fff; }

        .san-btn.active .san-icon-box {
          background: var(--accent); border-color: var(--accent); color: #000;
          box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 40%, transparent);
          transform: scale(1.1);
        }
        .san-btn.active .san-label { color: #fff; letter-spacing: 0.25em; }

        /* Navigation Arrows (Cleared from Sidebar) */
        .srv-nav-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 101;
          width: 60px; height: 60px; border-radius: 50%; background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s ease, left 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          backdrop-filter: blur(15px);
        }
        .srv-nav-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: var(--gold); color: var(--gold); transform: translateY(-50%) scale(1.1); }
        .srv-nav-arrow:disabled { opacity: 0; pointer-events: none; }
        .srv-nav-prev { left: 320px; }
        .premium-services-page.nav-minimized .srv-nav-prev { left: 140px; }
        .srv-nav-next { right: 40px; }

        /* Gallery Sections */
        .srv-horizontal-wrap { height: 100vh; width: 100%; position: relative; }
        .srv-track { display: flex; height: 100vh; }
        .srv-cat-section { width: 100vw; height: 100vh; flex-shrink: 0; overflow: hidden; }
        .srv-cat-layout { display: grid; grid-template-columns: minmax(420px, 0.85fr) 1.15fr; height: 100vh; will-change: transform; }
        .srv-cat-visual {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 10% 8% 10% 300px;
          transform-style: preserve-3d;
          transition: padding-left 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .premium-services-page.nav-minimized .srv-cat-visual {
          padding-left: 130px;
        }
        .srv-cat-img-wrap { position: absolute; inset: 0; z-index: 0; overflow: hidden; transform: translateZ(-200px); }
        .srv-cat-img { width: 120%; height: 120%; object-fit: cover; opacity: 0.45; position: absolute; top: -10%; left: -10%; will-change: transform; }
        .srv-cat-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #000 0%, transparent 60%), linear-gradient(to right, transparent 50%, #000 100%); }
        .srv-cat-ambient-light { position: absolute; inset: 0; z-index: 1; opacity: 0.5; pointer-events: none; }
        .srv-cat-info { position: relative; z-index: 2; transform: translateZ(40px); will-change: transform, opacity; }

        .srv-cat-list-panel {
          background: #000;
          height: 100vh;
          padding: clamp(3rem, 8vh, 6rem) 6% clamp(2rem, 6vh, 4rem) 4%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transform-style: preserve-3d;
          will-change: transform, opacity;
          box-sizing: border-box;
        }
        .srv-list-scrollable {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 1.5rem 1.5rem 1.5rem 0;
          scrollbar-width: none;
          width: 100%;
        }
        .srv-list-scrollable::-webkit-scrollbar { display: none; }
        .srv-items-flex {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(10px, 2vh, 20px);
          width: 100%;
        }
        @media (max-width: 1360px) and (min-width: 1101px) {
          .srv-cat-layout {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .srv-items-flex {
            grid-template-columns: 1fr;
          }
        }
        .srv-list-item {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.6rem;
          padding: clamp(0.8rem, 1.8vh, 1.2rem);
          cursor: pointer;
          border-left: 0.2rem solid var(--accent);
          transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          box-shadow: 0 0.8rem 2rem rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: clamp(110px, 15vh, 160px);
        }
        .srv-list-item:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 20px color-mix(in srgb, var(--accent) 20%, transparent);
        }
        .sli-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: clamp(4px, 1vh, 8px); }
        .sli-id { font-size: 8px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.3); font-weight: 800; }
        .sli-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px var(--accent); }
        .sli-name { font-family: var(--font-display); font-size: clamp(16px, 2.2vh, 22px); color: #fff; line-height: 1.2; margin-bottom: clamp(6px, 1.2vh, 12px); }
        .sli-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .sli-price { font-family: var(--font-display); font-size: clamp(15px, 2vh, 20px); color: var(--accent); font-style: italic; }
        .sli-more { font-size: 8px; text-transform: uppercase; color: rgba(255,255,255,0.2); letter-spacing: 0.15em; }
        .sli-hover-bg { position: absolute; inset: 0; background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent); opacity: 0; transition: opacity 0.5s; }
        .srv-list-item:hover .sli-hover-bg { opacity: 1; }

        /* Modal Card */
        .srv-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(20px, 4vh, 40px) clamp(20px, 4vw, 40px);
        }
        .srv-modal-perspective {
          width: 100%;
          max-width: 960px;
          perspective: 2500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .srv-physical-card {
          width: 100%;
          min-height: clamp(400px, 62vh, 600px);
          max-height: calc(100vh - clamp(40px, 8vh, 80px));
          background: rgba(12, 12, 12, 0.4);
          backdrop-filter: blur(50px) saturate(200%);
          -webkit-backdrop-filter: blur(50px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.15);
          position: relative;
          border-radius: 12px;
          transform-style: preserve-3d;
          box-shadow: 0 50px 150px rgba(0,0,0,0.8), inset 0 0 60px rgba(255,255,255,0.02);
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .card-face {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          height: auto;
          min-height: 100%;
          padding: clamp(40px, 6vh, 80px) clamp(30px, 8vw, 100px);
          backface-visibility: hidden;
          z-index: 10;
        }
        .card-close-btn {
          position: absolute;
          top: clamp(20px, 4vh, 40px);
          right: clamp(20px, 4vw, 40px);
          background: none;
          border: none;
          color: #fff;
          opacity: 0.4;
          cursor: pointer;
          transition: 0.3s;
          z-index: 20;
        }
        .card-close-btn:hover { opacity: 1; transform: scale(1.1) rotate(90deg); }

        .card-content-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: clamp(30px, 5vw, 60px);
          align-items: center;
        }
        .card-id {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.6em;
          color: var(--accent);
          font-weight: 800;
          margin-bottom: clamp(10px, 2vh, 15px);
        }
        .card-title {
          font-size: clamp(28px, 4.5vh, 72px);
          line-height: 0.95;
          margin: 0;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .card-price-display {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          margin-top: clamp(20px, 4vh, 40px);
        }
        .card-price-display .curr {
          font-size: clamp(16px, 2.5vh, 22px);
          color: var(--accent);
          margin-top: clamp(6px, 1.2vh, 12px);
          font-weight: 600;
        }
        .card-price-display .amt {
          font-family: var(--font-display);
          font-size: clamp(54px, 10vh, 96px);
          line-height: 0.85;
          font-style: italic;
          color: #fff;
        }

        .card-description {
          font-size: clamp(15px, 2vh, 19px);
          color: rgba(255,255,255,0.65);
          line-height: 1.65;
          margin-bottom: clamp(20px, 4vh, 40px);
        }
        .card-specs-row {
          display: flex;
          gap: clamp(30px, 5vw, 60px);
          padding-top: clamp(20px, 4vh, 40px);
          border-top: 1px solid rgba(255,255,255,0.08);
          margin-bottom: clamp(20px, 4vh, 40px);
        }
        .spec-item label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.4);
          margin-bottom: clamp(6px, 1.2vh, 12px);
          font-weight: 800;
        }
        .spec-item span {
          font-family: var(--font-display);
          font-size: clamp(20px, 3vh, 28px);
          color: #fff;
        }
        .card-actions-area { display: flex; flex-direction: column; gap: 14px; }
        .card-btn {
          width: 100%;
          padding: clamp(14px, 2vh, 22px) 0;
          font-size: 13px;
          letter-spacing: 0.2em;
          font-weight: 700;
          border-radius: 4px;
        }

        .card-shimmer-light { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%); pointer-events: none; border-radius: inherit; }
        .card-bottom-glow { position: absolute; bottom: -80px; left: 0; right: 0; height: 160px; filter: blur(60px); pointer-events: none; opacity: 0.5; }

        @media (max-width: 1100px) {
          .srv-atelier-nav { display: none; }
          .srv-nav-arrow { display: none; }
          .srv-cat-layout { grid-template-columns: 1fr; }
          .srv-cat-visual { height: 40vh; padding: 40px 24px; }
          .srv-cat-list-panel { height: auto; padding: 40px 24px 100px; }
          .srv-track { flex-direction: column; height: auto; width: 100% !important; }
          .srv-horizontal-wrap { height: auto; }
        }

        /* ══ LUXURY FLOATING GLASS TAB BAR ══ */
        .srv-mob-tabbar-wrap {
          display: none;
          position: sticky;
          top: var(--nav-h, 82px);
          z-index: 120;
          padding: 10px 16px;
          background: transparent;
          pointer-events: none;
        }
        @media (max-width: 1100px) {
          .srv-mob-tabbar-wrap { display: block; }
        }

        .srv-mob-tabbar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 8px 12px;
          background: rgba(8, 8, 8, 0.82);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 99px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05);
          pointer-events: auto;
        }
        .srv-mob-tabbar::-webkit-scrollbar { display: none; }

        .smtb-btn {
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border: none;
          background: transparent;
          border-radius: 99px;
          cursor: pointer;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .smtb-pill {
          position: absolute;
          inset: 0;
          border-radius: 99px;
          border: 1px solid;
          z-index: 0;
        }

        .smtb-icon {
          font-size: 13px;
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,0.5);
          transition: color 0.3s ease;
        }
        .smtb-btn.active .smtb-icon { color: var(--accent); }

        .smtb-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.4);
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        .smtb-btn.active .smtb-label { color: #fff; }

        /* ══ ATELIER MOBILE LAYOUT ══ */
        .srv-atelier-mobile {
          background: #000;
          min-height: 80vh;
          padding-bottom: 100px;
        }

        .srv-atelier-view {
          display: flex;
          flex-direction: column;
        }

        /* Cinematic Hero Banner */
        .sam-hero {
          position: relative;
          height: clamp(240px, 36vh, 380px);
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .sam-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.28) saturate(1.3);
          transform: scale(1.05);
          transition: transform 8s ease;
        }

        .sam-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%),
            linear-gradient(to right, rgba(0,0,0,0.3), transparent 60%);
        }

        .sam-hero-content {
          position: relative;
          z-index: 2;
          padding: 0 20px 24px;
          width: 100%;
        }

        .sam-eyebrow {
          display: block;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .sam-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 9vw, 58px);
          color: #fff;
          margin: 0 0 8px;
          line-height: 0.92;
          letter-spacing: -0.02em;
          font-style: italic;
        }

        .sam-hero-intro {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin: 0 0 16px;
          line-height: 1.5;
          max-width: 340px;
        }

        .sam-hero-rule {
          height: 1px;
          width: 80px;
          transform-origin: left;
          opacity: 0.7;
        }

        /* Staggered Service Rows */
        .sam-list {
          display: flex;
          flex-direction: column;
          padding: 0 0 20px;
        }

        .sam-row {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 0 14px;
          align-items: start;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.045);
          position: relative;
          transition: background 0.3s ease;
        }
        .sam-row:first-child { border-top: 1px solid rgba(255,255,255,0.045); }
        .sam-row:active { background: rgba(255,255,255,0.025); }

        /* Left column — number + accent tick */
        .sam-row-num {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 3px;
          gap: 6px;
        }

        .sam-num-text {
          font-family: var(--font-display);
          font-size: 11px;
          font-style: italic;
          color: rgba(255,255,255,0.2);
          line-height: 1;
        }

        .sam-num-line {
          width: 1px;
          height: 32px;
          opacity: 0.5;
          flex-shrink: 0;
        }

        /* Centre column */
        .sam-row-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sam-row-name {
          font-family: var(--font-display);
          font-size: clamp(16px, 4vw, 20px);
          color: #fff;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .sam-row-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin: 0;
          line-height: 1.55;
        }

        /* Right column — price + time + CTA */
        .sam-row-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          padding-top: 2px;
        }

        .sam-row-price {
          font-family: var(--font-display);
          font-size: 17px;
          font-style: italic;
          font-weight: 600;
          line-height: 1;
        }

        .sam-row-time {
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sam-row-cta {
          margin-top: 6px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent, #C9A96E);
          text-decoration: none;
          padding: 5px 10px;
          border: 1px solid color-mix(in srgb, var(--accent, #C9A96E) 35%, transparent);
          border-radius: 3px;
          transition: background 0.25s ease, color 0.25s ease;
          white-space: nowrap;
        }
        .sam-row-cta:active {
          background: var(--accent, #C9A96E);
          color: #000;
        }

        @media (max-width: 900px), (max-height: 720px) {
          .card-content-layout {
            grid-template-columns: 1fr;
            gap: clamp(20px, 3.5vh, 32px);
          }
          .card-price-display {
            margin-top: 16px;
          }
          .card-description {
            margin-bottom: 24px;
          }
          .card-specs-row {
            padding-top: 20px;
            margin-bottom: 24px;
            gap: 40px;
          }
          .srv-physical-card {
            min-height: auto;
          }
          .card-face {
            padding: clamp(30px, 4vh, 50px) clamp(20px, 4vw, 40px);
          }
        }
      `}</style>
    </motion.div>
  )
}
