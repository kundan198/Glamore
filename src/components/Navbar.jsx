import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const links = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/pricing',  label: 'Pricing' },
  { to: '/team',     label: 'Team' },
  { to: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => setMenuOpen(false), [location])

  useGSAP(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
    )
  }, { scope: navRef })

  return (
    <>
      <nav ref={navRef} className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            Glamore
            <span>Premium Beauty Studio</span>
          </Link>

          <ul className="nav-links">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link${location.pathname === to ? ' active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/booking" className="btn btn-gold" style={{ padding: '11px 24px', fontSize: 12, minHeight: 42 }}>
              Book Now
            </Link>
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop — closes menu on outside tap */}
      {menuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        className={`mobile-nav${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-nav-list">
          {links.map(({ to, label }) => (
            <li key={to} className="mobile-nav-item">
              <Link
                to={to}
                className={`mobile-nav-link${location.pathname === to ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span>{label}</span>
                <span className="mobile-nav-arrow">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-nav-cta">
          <Link
            to="/booking"
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </>
  )
}
