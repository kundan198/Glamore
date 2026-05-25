import { Link } from 'react-router-dom'

const serviceLinks = [
  ['Hair Styling & Care', '/services'],
  ['Hair Colouring', '/services'],
  ['Nail Services & Art', '/services'],
  ['Beauty Treatments', '/services'],
  ['Makeup & Bridal', '/services'],
  ['Studio Packages', '/pricing'],
]

const quickLinks = [
  ['About Us', '/about'],
  ['Services', '/services'],
  ['Gallery', '/gallery'],
  ['Pricing', '/pricing'],
  ['Our Team', '/team'],
  ['Book Now', '/booking'],
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.04em' }}>
              Glamore
            </Link>
            <p>Where beauty becomes art. A premium studio dedicated to helping you look and feel extraordinary.</p>
            <div className="footer-socials">
              <a href="#" className="footer-social" aria-label="Instagram">📷</a>
              <a href="#" className="footer-social" aria-label="Facebook">📘</a>
              <a href="#" className="footer-social" aria-label="Pinterest">📌</a>
              <a href="#" className="footer-social" aria-label="TikTok">🎵</a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              {quickLinks.map(([label, to]) => (
                <li key={to + label}><Link to={to}>→ {label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h5>Services</h5>
            <ul className="footer-links">
              {serviceLinks.map(([label, to]) => (
                <li key={label}><Link to={to}>→ {label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h5>Visit Us</h5>
            <div className="footer-contact">
              <div className="footer-ci">
                <span className="footer-ci-icon">📍</span>
                <div><strong>Studio Location</strong><p>142 Glamour Lane, Suite 301<br />Beverly Hills, CA 90210</p></div>
              </div>
              <div className="footer-ci">
                <span className="footer-ci-icon">📞</span>
                <div><strong>Call Us</strong><p>+1 (310) 555-GLAM</p></div>
              </div>
              <div className="footer-ci">
                <span className="footer-ci-icon">✉️</span>
                <div><strong>Email</strong><p>hello@glamorestudio.com</p></div>
              </div>
              <div className="footer-ci">
                <span className="footer-ci-icon">🕐</span>
                <div><strong>Studio Hours</strong><p>Mon–Sat: 9am–8pm<br />Sunday: 10am–6pm</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Glamore Studio. All rights reserved.</p>
          <p>Made with ♥ for beauty &nbsp;·&nbsp; <a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms</a></p>
        </div>
      </div>
    </footer>
  )
}
