import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgressBar() {
  const barRef = useRef(null)

  useEffect(() => {
    const tween = gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    return () => tween.scrollTrigger?.kill()
  }, [])

  return <div ref={barRef} className="scroll-bar" />
}
