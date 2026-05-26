import { useState, useRef } from 'react'
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
  const [isNavMinimized, setIsNavMinimized] = useState(false)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const pageRef = useRef(null)
  const horizontalRef = useRef(null)
  const heroBgRef = useRef(null)

  const navItemsRef = useRef([])

  useGSAP(() => {
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
            opacity: 0, x: -100, rotateY: -45,
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

    // 4. Smooth Section Skew during scroll
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
  }, { scope: pageRef });

  const scrollToCategory = (id) => {
    const index = categories.findIndex(c => c.id === id);
    const scrollST = ScrollTrigger.getAll().find(st => st.vars.trigger === horizontalRef.current);
    if (scrollST) {
      const target = scrollST.start + (scrollST.end - scrollST.start) * (index / (categories.length - 1));
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }

  const isFullyExpanded = !isNavMinimized || isNavHovered;

  return (
    <motion.div ref={pageRef} className="premium-services-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

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
          <span className="t-label t-gold-em" style={{ fontSize: '13px', letterSpacing: '0.6em', marginBottom: '20px', display: 'block' }}>Architectural Beauty</span>
          <h1 className="t-display" style={{ fontSize: 'clamp(50px, 12vw, 150px)', lineHeight: 0.8 }}>Services <span className="t-gold-em">&</span> Rituals</h1>
          <p className="t-body-lg" style={{ marginTop: '40px', maxWidth: '650px', margin: '40px auto 0', opacity: 0.7 }}>A curated journey of self-preservation. Move through our chapters of excellence.</p>

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

      {/* 2. Main Horizontal Scroll Gallery */}
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
            <section key={cat.id} className="srv-cat-section" style={{ perspective: '2500px' }}>
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
                    <h2 className="t-hero" style={{ fontSize: 'clamp(40px, 8vw, 110px)', lineHeight: 0.85 }}>{cat.label.split(' ')[0]} <br/> <span className="t-gold-em">Curation</span></h2>
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
        .premium-services-page { background: #000; overflow-x: hidden; }

        /* Hero Section */
        .srv-hero { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
        .srv-hero-bg { position: absolute; inset: -20%; background-size: cover; background-position: center; filter: brightness(0.4) saturate(1.2); }
        .srv-hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, #000 100%); z-index: 1; }
        .srv-hero-content { position: relative; z-index: 2; transform-style: preserve-3d; }
        .srv-hero-scroll-cue { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 15px; opacity: 0.4; }
        .scroll-line { width: 1px; height: 60px; background: linear-gradient(to bottom, var(--gold), transparent); animation: scroll-line-anim 2s infinite; }
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
          display: flex; align-items: center; justify-content: center; transition: all 0.4s ease;
          backdrop-filter: blur(15px);
        }
        .srv-nav-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: var(--gold); color: var(--gold); transform: translateY(-50%) scale(1.1); }
        .srv-nav-arrow:disabled { opacity: 0; pointer-events: none; }
        .srv-nav-prev { left: 320px; } /* Clears the wide sidebar */
        .srv-nav-next { right: 40px; }

        /* Gallery Sections */
        .srv-horizontal-wrap { height: 100vh; width: 100%; position: relative; }
        .srv-track { display: flex; height: 100vh; }
        .srv-cat-section { width: 100vw; height: 100vh; flex-shrink: 0; overflow: hidden; }
        .srv-cat-layout { display: grid; grid-template-columns: 0.85fr 1.15fr; height: 100vh; will-change: transform; }
        .srv-cat-visual { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 10% 10% 10% 320px; transform-style: preserve-3d; }
        .srv-cat-img-wrap { position: absolute; inset: 0; z-index: 0; overflow: hidden; transform: translateZ(-200px); }
        .srv-cat-img { width: 120%; height: 120%; object-fit: cover; opacity: 0.45; position: absolute; top: -10%; left: -10%; will-change: transform; }
        .srv-cat-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #000 0%, transparent 60%), linear-gradient(to right, transparent 50%, #000 100%); }
        .srv-cat-ambient-light { position: absolute; inset: 0; z-index: 1; opacity: 0.5; pointer-events: none; }
        .srv-cat-info { position: relative; z-index: 2; transform: translateZ(100px); will-change: transform, opacity; }

        .srv-cat-list-panel {
          background: #000;
          height: 100vh;
          padding: 6rem 8% 4rem 4%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }
        .srv-list-scrollable { overflow-y: auto; padding: 1.5rem 1.5rem 1.5rem 0; scrollbar-width: none; width: 100%; }
        .srv-list-scrollable::-webkit-scrollbar { display: none; }
        .srv-items-flex {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
        }

        /* List Item Card - Premium Glass Grid */
        .srv-list-item {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.6rem;
          padding: 1.2rem;
          cursor: pointer;
          border-left: 0.2rem solid var(--accent);
          transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          box-shadow: 0 0.8rem 2rem rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 10rem;
        }
        .srv-list-item:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 20px color-mix(in srgb, var(--accent) 20%, transparent);
        }
        .sli-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .sli-id { font-size: 8px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.3); font-weight: 800; }
        .sli-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px var(--accent); }
        .sli-name { font-family: var(--font-display); font-size: 22px; color: #fff; line-height: 1.2; margin-bottom: 12px; }
        .sli-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .sli-price { font-family: var(--font-display); font-size: 20px; color: var(--accent); font-style: italic; }
        .sli-more { font-size: 8px; text-transform: uppercase; color: rgba(255,255,255,0.2); letter-spacing: 0.15em; }
        .sli-hover-bg { position: absolute; inset: 0; background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent); opacity: 0; transition: opacity 0.5s; }
        .srv-list-item:hover .sli-hover-bg { opacity: 1; }

        /* Modal Card */
        .srv-modal-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 40px; }
        .srv-modal-perspective { width: 100%; max-width: 960px; perspective: 2500px; }
        .srv-physical-card {
          width: 100%; min-height: 600px;
          background: rgba(12, 12, 12, 0.4);
          backdrop-filter: blur(50px) saturate(200%);
          -webkit-backdrop-filter: blur(50px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.15);
          position: relative; border-radius: 12px; transform-style: preserve-3d;
          box-shadow: 0 50px 150px rgba(0,0,0,0.8), inset 0 0 60px rgba(255,255,255,0.02);
        }
        .card-face { position: relative; width: 100%; height: 100%; padding: 80px 100px; backface-visibility: hidden; z-index: 10; border: 1px solid rgba(255,255,255,0.04); margin: 15px; border-radius: 8px; }
        .card-close-btn { position: absolute; top: 40px; right: 40px; background: none; border: none; color: #fff; opacity: 0.4; cursor: pointer; transition: 0.3s; }
        .card-close-btn:hover { opacity: 1; transform: scale(1.1) rotate(90deg); }

        .card-content-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; }
        .card-id { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6em; color: var(--accent); font-weight: 800; margin-bottom: 15px; }
        .card-title { font-size: clamp(34px, 6vw, 72px); line-height: 0.9; margin: 0; color: #fff; letter-spacing: -0.01em; }
        .card-price-display { display: flex; align-items: flex-start; gap: 6px; margin-top: 40px; }
        .card-price-display .curr { font-size: 22px; color: var(--accent); margin-top: 12px; font-weight: 600; }
        .card-price-display .amt { font-family: var(--font-display); font-size: 96px; line-height: 0.85; font-style: italic; color: #fff; }

        .card-description { font-size: 19px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 40px; }
        .card-specs-row { display: flex; gap: 60px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 40px; }
        .spec-item label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-bottom: 12px; font-weight: 800; }
        .spec-item span { font-family: var(--font-display); font-size: 28px; color: #fff; }
        .card-actions-area { display: flex; flex-direction: column; gap: 14px; }
        .card-btn { width: 100%; padding: 22px 0; font-size: 13px; letter-spacing: 0.2em; font-weight: 700; border-radius: 4px; }

        .card-shimmer-light { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%); pointer-events: none; border-radius: inherit; }
        .card-bottom-glow { position: absolute; bottom: -80px; left: 0; right: 0; height: 160px; filter: blur(60px); pointer-events: none; opacity: 0.5; }

        @media (max-width: 1100px) {
          .srv-atelier-nav { display: none; }
          .srv-nav-prev { left: 40px; }
          .srv-cat-layout { grid-template-columns: 1fr; }
          .srv-cat-visual { height: 40vh; padding-left: 10%; }
          .srv-cat-list-panel { height: auto; padding: 40px 24px 100px; }
          .srv-track { flex-direction: column; height: auto; width: 100% !important; }
        }
      `}</style>
    </motion.div>
  )
}
