import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgressBar from './components/ScrollProgressBar'
import ScrollTopBtn from './components/ScrollTopBtn'
import OllamaChat   from './components/OllamaChat'
import GoldenAura   from './components/GoldenAura'
import GoldenDust   from './components/GoldenDust'

import Home       from './pages/Home'
import About      from './pages/About'
import Services   from './pages/Services'
import Gallery    from './pages/Gallery'
import Pricing    from './pages/Pricing'
import Team       from './pages/Team'
import Booking    from './pages/Booking'
import Contact    from './pages/Contact'

function AppInner() {
  const location = useLocation()
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.065,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  // On route change: scroll to top
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [location.pathname])

  const noFooterRoutes = []
  const showFooter = !noFooterRoutes.includes(location.pathname)

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/services"  element={<Services />} />
          <Route path="/gallery"   element={<Gallery />} />
          <Route path="/pricing"   element={<Pricing />} />
          <Route path="/team"      element={<Team />} />
          <Route path="/booking"   element={<Booking />} />
          <Route path="/contact"   element={<Contact />} />
        </Routes>
      </AnimatePresence>
      {showFooter && <Footer />}
      <ScrollTopBtn />
      <OllamaChat />
      <GoldenAura />
      <GoldenDust />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
