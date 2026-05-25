import { useEffect } from 'react'
import gsap from 'gsap'

const WaterPhysics = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.btn, .service-card, .hero-stat-item, .ns-item, .testimonial-card, .pricing-card, .why-card, .gallery-item, .premium-portrait-card, .premium-title-word, .intro-word, .manifesto-char'
    )

    const cleanups = []

    elements.forEach((el, i) => {
      // a. Floating animation — subtle, like objects resting on still water
      gsap.to(el, {
        y: -(1 + Math.random() * 2.5),
        rotationZ: (Math.random() - 0.5) * 0.22,
        duration: 2.6 + Math.random() * 2.0,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: (i * 0.23) % 3.2,
      })

      // b. 3D tilt on mousemove — gentle water-surface tilt
      const onMove = e => {
        const rect = el.getBoundingClientRect()
        const tx = ((e.clientX - rect.left) / rect.width  - 0.5) * 7
        const ty = ((e.clientY - rect.top)  / rect.height - 0.5) * -7
        gsap.to(el, { rotateY: tx, rotateX: ty, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
      }

      // c. Spring back on mouseleave
      const onLeave = () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
      }

      // d. Water press on click — touch surface, gentle ripple
      const onClick = () => {
        const tl = gsap.timeline({ overwrite: 'auto' })
        tl.to(el, { y: '+=4',  scale: 0.97, duration: 0.12, ease: 'power2.in'  })
          .to(el, { y: '-=5',  scale: 1.02, duration: 0.18, ease: 'power2.out' })
          .to(el, { y: '+=1',  scale: 1.00, duration: 0.45, ease: 'elastic.out(1, 0.5)' })
      }

      // e. Set transform properties
      el.style.transformStyle = 'preserve-3d'
      el.style.willChange = 'transform'

      // f. Attach event listeners
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      el.addEventListener('click', onClick)

      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
        el.removeEventListener('click', onClick)
      })
    })

    // 4. Letter physics — extra wobble for .premium-title-word and .hero-stat-num
    const letterElements = document.querySelectorAll('.premium-title-word, .hero-stat-num')

    letterElements.forEach(el => {
      gsap.to(el, {
        skewX: (Math.random() - 0.5) * 0.6,
        duration: 2.4 + Math.random() * 1.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2,
      })
    })

    // 5. Cleanup
    return () => {
      elements.forEach(el => gsap.killTweensOf(el))
      letterElements.forEach(el => gsap.killTweensOf(el))
      cleanups.forEach(fn => fn())
    }
  }, [])

  // 6. Render nothing
  return null
}

export default WaterPhysics
