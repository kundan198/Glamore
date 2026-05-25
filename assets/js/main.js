/* ============================================================
   GLAMORE — Main JavaScript
   UX Laws applied: Hick's, Fitts's, Law of Continuity
   ============================================================ */

'use strict';

/* ── Page Loader ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

/* ── Navigation ──────────────────────────────────────────── */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Scroll Reveal ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
  .forEach(el => revealObserver.observe(el));

/* ── Hero Particles ──────────────────────────────────────── */
const heroParticles = document.querySelector('.hero-particles');
if (heroParticles) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${Math.random() * 6 + 6}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    heroParticles.appendChild(p);
  }
}

/* ── Counter Animation ───────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Testimonials Slider ─────────────────────────────────── */
const track = document.querySelector('.testimonials-track');
if (track) {
  const slides = track.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const btnPrev = document.querySelector('.slider-btn.prev');
  const btnNext = document.querySelector('.slider-btn.next');

  let current = 0;
  let slidesPerView = window.innerWidth < 900 ? 1 : 2;
  let maxIndex = Math.max(0, slides.length - slidesPerView);
  let autoTimer;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = maxIndex + 1;
    for (let i = 0; i <= maxIndex; i++) {
      const d = document.createElement('button');
      d.className = 'slider-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const slideWidth = track.parentElement.offsetWidth / slidesPerView;
    track.style.transform = `translateX(-${current * slideWidth}px)`;
    dotsContainer?.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current < maxIndex ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : maxIndex); }

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  btnNext?.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
  btnPrev?.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });

  buildDots();
  startAuto();

  window.addEventListener('resize', () => {
    slidesPerView = window.innerWidth < 900 ? 1 : 2;
    maxIndex = Math.max(0, slides.length - slidesPerView);
    buildDots();
    goTo(Math.min(current, maxIndex));
  });

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });
}

/* ── Gallery Filters ─────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

if (filterBtns.length && galleryItems.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = show ? '1' : '0.25';
        item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        item.style.pointerEvents = show ? 'auto' : 'none';
      });
    });
  });
}

/* ── Booking Form ────────────────────────────────────────── */
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  // Date picker — disable past dates
  const dateInput = bookingForm.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Service → Duration & Price hint
  const serviceSelect = bookingForm.querySelector('#service');
  const durationEl   = bookingForm.querySelector('#service-duration');

  const serviceInfo = {
    'hair-styling':  { duration: '1–2 hours',   price: 'From $80' },
    'hair-color':    { duration: '2–4 hours',   price: 'From $150' },
    'nail-services': { duration: '45–90 mins',  price: 'From $45' },
    'beauty-glam':   { duration: '1–1.5 hours', price: 'From $95' },
    'makeup':        { duration: '1–2 hours',   price: 'From $120' },
    'bridal':        { duration: '3–5 hours',   price: 'From $350' },
  };

  serviceSelect?.addEventListener('change', () => {
    const info = serviceInfo[serviceSelect.value];
    if (info && durationEl) {
      durationEl.textContent = `${info.duration} · ${info.price}`;
      durationEl.style.display = 'block';
    }
  });

  // Form submit
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Your appointment request has been sent! We\'ll confirm within 24 hours. ✨', 'success');
    bookingForm.reset();
    if (durationEl) durationEl.style.display = 'none';
  });
}

/* ── Contact Form ────────────────────────────────────────── */
const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon. 💌', 'success');
  contactForm.reset();
});

/* ── Toast Notification ──────────────────────────────────── */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: ${type === 'success' ? '#2D6A4F' : '#3D1A3A'};
    color: white;
    padding: 16px 28px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
    z-index: 10000;
    max-width: 420px;
    text-align: center;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
    opacity: 0;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ── Scroll-to-Top ───────────────────────────────────────── */
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Smooth hover on cards (Law of Continuity) ───────────── */
document.querySelectorAll('.service-card, .team-card, .pricing-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.willChange = 'transform, box-shadow';
  });
  card.addEventListener('mouseleave', function() {
    this.style.willChange = 'auto';
  });
});
