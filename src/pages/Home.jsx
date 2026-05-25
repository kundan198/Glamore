import { useRef, useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import heroDirtyPortrait  from '../assets/hero-dirty.png'
import heroPrettyPortrait from '../assets/hero-preity.png'
import hairColourPhoto    from '../assets/haircolur.jpg'
import hairStylingPhoto    from '../assets/servise1.jpg'
import beautyTreatPhoto   from '../assets/servise3.jpg'
import nailArtPhoto      from '../assets/servise4.jpg'
import makeupBridalPhoto  from '../assets/servise5.jpg'
import studioExpPhoto    from '../assets/servise6.jpg'
import storyPortrait     from '../assets/ya.jpg'

/* ──────────────────────────────────────────────────────────────
   PARTICLE SYSTEM  — deterministic positions for scrub compat
────────────────────────────────────────────────────────────── */
const P_COUNT = 180
const PARTICLES = Array.from({ length: P_COUNT }, (_, i) => {
  const turns = 3.8
  const angle  = (i / P_COUNT) * Math.PI * 2 * turns
  const radius = 55 + (i % 9) * 32           // 55 – 311 px
  const vr = 0.55 + (i % 5) * 0.12          // vertical compression
  return {
    sx:    Math.cos(angle) * radius,
    sy:    Math.sin(angle) * radius * vr,
    size:  1.0 + (i % 7) * 0.45,            // 1.0 – 3.7 px
    hue:   34  + (i % 24) * 1.5,            // gold 34-68°
    sat:   62  + (i % 28),
    lit:   52  + (i % 26),
    t0:    (i % 14) / 14 * 0.32,            // stagger start 0–0.32
  }
})

function eio(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

function drawParticles(ctx, W, H, mp, mi) {
  ctx.clearRect(0, 0, W, H)
  if (mi < 0 || mp <= 0 || mp >= 1) return
  const cx = W * 0.5
  const cy = H * 0.43
  ctx.globalCompositeOperation = 'lighter'
  PARTICLES.forEach(p => {
    const raw = (mp - p.t0) / (1 - p.t0)
    const t   = Math.max(0, Math.min(1, raw))
    if (t <= 0) return
    let x, y, alpha
    if (t < 0.5) {
      const e = eio(t * 2)
      x = cx + p.sx * e; y = cy + p.sy * e; alpha = e * 0.72
    } else {
      const e = eio((t - 0.5) * 2)
      x = cx + p.sx * (1 - e); y = cy + p.sy * (1 - e); alpha = (1 - e) * 0.72
    }
    ctx.globalAlpha = alpha
    ctx.fillStyle = `hsl(${p.hue},${p.sat}%,${p.lit}%)`
    ctx.beginPath(); ctx.arc(x, y, Math.max(0.4, p.size), 0, Math.PI * 2); ctx.fill()
    // small glow dot
    ctx.globalAlpha = alpha * 0.25
    ctx.beginPath(); ctx.arc(x, y, p.size * 2.4, 0, Math.PI * 2); ctx.fill()
  })
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
}

/* ──────────────────────────────────────────────────────────────
   PRODUCT META
────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:'perfume',    name:'Eau de Glamore',   cat:'Signature Fragrance', glow:'rgba(190,120,255,0.22)' },
  { id:'lipstick',   name:'Velvet Rouge',      cat:'Colour Collection',   glow:'rgba(255,80,100,0.18)' },
  { id:'palette',    name:'Sunset Palette',    cat:'Eye Artistry',        glow:'rgba(220,140,80,0.18)' },
  { id:'nailpolish', name:'Lacquer Supreme',   cat:'Nail Artistry',       glow:'rgba(160,90,220,0.18)' },
  { id:'compact',    name:'Luminous Compact',  cat:'Skin Perfection',     glow:'rgba(220,190,120,0.18)' },
]

const MORPH_PHASES = [
  { start: 0.28, end: 0.42 },
  { start: 0.46, end: 0.59 },
  { start: 0.63, end: 0.75 },
  { start: 0.79, end: 0.91 },
]

/* ──────────────────────────────────────────────────────────────
   3D CSS OBJECTS
────────────────────────────────────────────────────────────── */
function PerfumeBottle3D() {
  return (
    <div className="c3d-wrap">
      <div className="c3d-inner">
        {/* Sprayer */}
        <div style={{ position:'absolute', top:18, right:-36, display:'flex', alignItems:'center', zIndex:3 }}>
          <div style={{ width:8, height:18, background:'linear-gradient(180deg,#f0d880,#a07020)', borderRadius:'3px 3px 0 0', boxShadow:'1px 2px 6px rgba(0,0,0,0.6)' }} />
          <div style={{ width:32, height:5, background:'linear-gradient(90deg,#c8a030,#8a6010)', marginLeft:-1, boxShadow:'0 2px 4px rgba(0,0,0,0.4)' }} />
        </div>
        {/* Cap */}
        <div style={{
          width:88, height:38,
          background:'linear-gradient(145deg,#f4e090 0%,#c9a030 30%,#9e7a20 60%,#c9a030 85%,#eecc60 100%)',
          borderRadius:'5px 5px 2px 2px',
          boxShadow:'inset 0 2px 4px rgba(255,255,255,0.45),inset 2px 0 6px rgba(0,0,0,0.2),3px 3px 12px rgba(0,0,0,0.5)',
          position:'relative',
        }}>
          <div style={{ position:'absolute', top:5, left:8, width:18, height:'55%', background:'linear-gradient(180deg,rgba(255,255,255,0.55),transparent)', borderRadius:8 }} />
          {/* Cap right face */}
          <div style={{ position:'absolute', right:-7, top:2, width:7, height:34, background:'linear-gradient(90deg,#7a5010,#50320a)', clipPath:'polygon(0 0,100% 8%,100% 92%,0 100%)' }} />
        </div>
        {/* Neck */}
        <div style={{
          width:50, height:22,
          background:'linear-gradient(90deg,rgba(255,255,255,0.18) 0%,rgba(180,120,220,0.25) 40%,rgba(80,20,100,0.4) 100%)',
          border:'1px solid rgba(201,169,110,0.2)', borderTop:'none',
        }} />
        {/* Glass body */}
        <div style={{
          width:130, height:210, position:'relative',
          background:`
            linear-gradient(100deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.09) 7%, transparent 18%),
            linear-gradient(260deg, rgba(0,0,0,0.48) 0%, transparent 14%),
            linear-gradient(180deg, rgba(190,130,230,0.18) 0%, rgba(120,40,170,0.55) 45%, rgba(55,8,90,0.88) 100%)
          `,
          border:'1px solid rgba(255,255,255,0.11)', borderTop:'none',
          overflow:'hidden',
          boxShadow:'inset 4px 0 14px rgba(255,255,255,0.07),inset -4px 0 14px rgba(0,0,0,0.3),8px 0 0 rgba(60,15,90,0.7),14px 8px 0 rgba(30,5,50,0.55),0 30px 80px rgba(0,0,0,0.7),0 0 60px rgba(160,80,230,0.12)',
        }}>
          {/* Right depth face */}
          <div style={{ position:'absolute', right:-14, top:2, width:14, height:'97%', background:'linear-gradient(90deg,rgba(70,20,100,0.85),rgba(25,5,45,0.95))', clipPath:'polygon(0 0,100% 2%,100% 98%,0 100%)' }} />
          {/* Top face */}
          <div style={{ position:'absolute', top:-8, left:2, right:-12, height:8, background:'linear-gradient(180deg,rgba(210,170,250,0.35),rgba(130,60,180,0.55))', clipPath:'polygon(0 100%,100% 100%,88% 0%,0 0%)' }} />
          {/* Left shine */}
          <div style={{ position:'absolute', left:7, top:8, width:14, bottom:8, background:'linear-gradient(90deg,rgba(255,255,255,0.22),transparent)', borderRadius:7 }} />
          {/* Liquid fill */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'68%', background:'linear-gradient(180deg,rgba(210,100,190,0.12) 0%,rgba(160,40,160,0.28) 40%,rgba(100,10,120,0.55) 100%)' }} />
          {/* Shimmer stripe */}
          <div style={{ position:'absolute', top:'25%', left:0, right:0, height:1, background:'rgba(255,255,255,0.06)' }} />
          {/* Label */}
          <div style={{ position:'absolute', left:18, right:18, top:'50%', transform:'translateY(-50%)', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:50, color:'rgba(201,169,110,0.88)', lineHeight:1, textShadow:'0 0 24px rgba(201,169,110,0.5)' }}>G</div>
            <div style={{ fontSize:9, letterSpacing:'0.38em', color:'rgba(201,169,110,0.65)', marginTop:6 }}>GLAMORE</div>
            <div style={{ fontSize:7, letterSpacing:'0.18em', color:'rgba(255,255,255,0.28)', marginTop:3 }}>EAU DE PARFUM</div>
          </div>
        </div>
        {/* Base plinth */}
        <div style={{ width:144, height:9, background:'linear-gradient(90deg,transparent,rgba(80,20,110,0.7),rgba(35,5,55,0.85),rgba(80,20,110,0.7),transparent)', borderRadius:'0 0 3px 3px', boxShadow:'0 5px 10px rgba(0,0,0,0.5)' }} />
      </div>
      {/* Floor reflection */}
      <div className="c3d-refl" style={{ background:'linear-gradient(180deg,rgba(120,40,170,0.12),transparent)', height:40, width:130, filter:'blur(2px)', transform:'scaleY(-1)' }} />
      <div className="c3d-shadow" style={{ width:140, background:'radial-gradient(ellipse,rgba(160,80,230,0.35) 0%,transparent 70%)' }} />
    </div>
  )
}

function Lipstick3D() {
  return (
    <div className="c3d-wrap">
      <div className="c3d-inner">
        {/* Bullet */}
        <div style={{
          width:48, height:62, position:'relative',
          background:`
            radial-gradient(ellipse at 32% 22%, rgba(255,200,210,0.55), transparent 45%),
            linear-gradient(90deg,#6a001a 0%,#c01838 22%,#e83258 48%,#c01838 76%,#6a001a 100%)
          `,
          borderRadius:'50% 50% 30% 30% / 42% 42% 20% 20%',
          boxShadow:'inset 3px 0 10px rgba(255,255,255,0.18),inset -3px 0 10px rgba(0,0,0,0.45),5px 0 0 rgba(80,0,18,0.75),9px 6px 0 rgba(40,0,10,0.55),0 8px 20px rgba(200,0,40,0.25)',
        }}>
          {/* Tip */}
          <div style={{ position:'absolute', top:-3, left:'50%', transform:'translateX(-50%)', width:24, height:6, background:'linear-gradient(180deg,rgba(255,180,190,0.6),rgba(200,20,50,0.8))', borderRadius:'50% 50% 0 0', filter:'blur(1px)' }} />
          {/* Right depth */}
          <div style={{ position:'absolute', right:-5, top:4, width:5, height:54, background:'rgba(50,0,12,0.7)', clipPath:'polygon(0 0,100% 6%,100% 94%,0 100%)' }} />
        </div>
        {/* Upper sleeve */}
        <div style={{
          width:54, height:72, position:'relative',
          background:`
            linear-gradient(100deg,rgba(255,255,255,0.32) 0%,rgba(255,255,255,0.06) 7%,transparent 18%),
            linear-gradient(260deg,rgba(0,0,0,0.38) 0%,transparent 14%),
            linear-gradient(180deg,#e0a8b8 0%,#c88090 40%,#a05868 100%)
          `,
          borderRadius:'2px 2px 0 0',
          boxShadow:'inset 2px 0 8px rgba(255,255,255,0.12),6px 0 0 rgba(120,50,70,0.65),10px 6px 0 rgba(70,20,35,0.5)',
        }}>
          <div style={{ position:'absolute', right:-6, top:1, width:6, height:70, background:'linear-gradient(90deg,rgba(100,40,55,0.8),rgba(60,15,30,0.9))', clipPath:'polygon(0 0,100% 2%,100% 98%,0 100%)' }} />
          <div style={{ position:'absolute', left:6, top:6, width:10, bottom:6, background:'linear-gradient(90deg,rgba(255,255,255,0.18),transparent)', borderRadius:5 }} />
        </div>
        {/* Mechanism ring */}
        <div style={{ width:58, height:10, background:'linear-gradient(180deg,#f0d080,#b08020)', boxShadow:'0 2px 8px rgba(0,0,0,0.5)', position:'relative' }}>
          <div style={{ position:'absolute', right:-7, top:0, width:7, height:10, background:'rgba(80,50,0,0.7)' }} />
        </div>
        {/* Tube base */}
        <div style={{
          width:56, height:120, position:'relative',
          background:`
            linear-gradient(100deg,rgba(255,255,255,0.28) 0%,rgba(255,255,255,0.05) 7%,transparent 18%),
            linear-gradient(260deg,rgba(0,0,0,0.42) 0%,transparent 14%),
            linear-gradient(180deg,#d49090 0%,#b06878 40%,#804050 100%)
          `,
          boxShadow:'inset 2px 0 8px rgba(255,255,255,0.1),6px 0 0 rgba(110,40,55,0.65),10px 7px 0 rgba(60,15,30,0.5),0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ position:'absolute', right:-6, top:0, width:6, height:120, background:'linear-gradient(90deg,rgba(95,35,50,0.8),rgba(50,10,25,0.92))', clipPath:'polygon(0 0,100% 1%,100% 99%,0 100%)' }} />
          {/* Engraving */}
          <div style={{ position:'absolute', top:'45%', left:'50%', transform:'translate(-50%,-50%) rotate(-90deg)', fontSize:7, letterSpacing:'0.35em', color:'rgba(255,220,230,0.25)', whiteSpace:'nowrap' }}>GLAMORE</div>
          {/* Base cap */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:8, background:'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.3))' }} />
        </div>
      </div>
      <div className="c3d-refl" style={{ background:'linear-gradient(180deg,rgba(200,80,100,0.1),transparent)', height:36, width:56, filter:'blur(2px)', transform:'scaleY(-1)' }} />
      <div className="c3d-shadow" style={{ width:80, background:'radial-gradient(ellipse,rgba(220,60,90,0.3) 0%,transparent 70%)' }} />
    </div>
  )
}

function Palette3D() {
  const PANS = [
    ['#c8937a','#a06148','#7a3928'],
    ['#d4b07a','#b08848','#8a6028'],
    ['#e8c8a0','#c0a070','#907050'],
    ['#f0dcc0','#d4b890','#a08060'],
  ]
  const lighten = (hex, amt) => hex  // simplified - just use the base color for the pan
  return (
    <div className="c3d-wrap" style={{ transform:'perspective(600px) rotateX(12deg)' }}>
      <div className="c3d-inner" style={{ transform:'none', gap:0 }}>
        {/* Lid (angled open, showing mirror) */}
        <div style={{
          width:240, height:72, position:'relative',
          background:`
            linear-gradient(160deg,rgba(255,255,255,0.55) 0%,rgba(200,200,200,0.35) 20%,rgba(140,140,140,0.6) 50%,rgba(100,100,100,0.5) 80%,rgba(60,60,60,0.4) 100%)
          `,
          borderRadius:'4px 4px 0 0',
          boxShadow:'inset 0 1px 3px rgba(255,255,255,0.8),0 -3px 12px rgba(0,0,0,0.3)',
          transform:'perspective(300px) rotateX(-32deg)',
          transformOrigin:'bottom center',
          marginBottom:-2,
        }}>
          {/* Mirror glare */}
          <div style={{ position:'absolute', top:6, left:10, width:40, height:40, background:'radial-gradient(ellipse at 30% 30%,rgba(255,255,255,0.9),transparent 60%)', borderRadius:2 }} />
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#c9a030,#f0d080,#c9a030)', borderRadius:'4px 4px 0 0' }} />
          {/* Mirror text */}
          <div style={{ position:'absolute', bottom:8, right:12, fontSize:8, letterSpacing:'0.2em', color:'rgba(100,80,60,0.7)' }}>GLAMORE</div>
        </div>
        {/* Base with pans */}
        <div style={{
          width:240, height:88, position:'relative',
          background:'linear-gradient(180deg,#2a1a10 0%,#1a0e08 100%)',
          border:'2px solid transparent',
          borderRadius:'0 0 6px 6px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.7),0 0 40px rgba(180,120,60,0.15)',
          overflow:'hidden',
        }}>
          {/* Rose gold rim */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#c9a030,#f0d080,#c9a030)' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#c9a030,#f0d080,#c9a030)' }} />
          {/* Pan grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4, padding:'10px 10px 6px', height:'calc(100% - 6px)' }}>
            {PANS.map((row, ri) =>
              row.map((color, ci) => (
                <div key={`${ri}-${ci}`} style={{
                  borderRadius:3,
                  background:`radial-gradient(ellipse at 35% 30%,${color}dd,${color} 55%,${color}88 100%)`,
                  boxShadow:`inset 0 1px 2px rgba(255,255,255,0.2),inset 0 -1px 2px rgba(0,0,0,0.4)`,
                  position:'relative', overflow:'hidden',
                }}>
                  {/* Pan shine */}
                  <div style={{ position:'absolute', top:1, left:1, right:'50%', height:'30%', background:'rgba(255,255,255,0.18)', borderRadius:2 }} />
                </div>
              ))
            )}
          </div>
          {/* Right side depth */}
          <div style={{ position:'absolute', right:-10, top:3, bottom:3, width:10, background:'linear-gradient(90deg,rgba(80,40,10,0.8),rgba(40,15,5,0.9))', clipPath:'polygon(0 0,100% 4%,100% 96%,0 100%)' }} />
        </div>
      </div>
      <div className="c3d-shadow" style={{ width:260, background:'radial-gradient(ellipse,rgba(200,140,60,0.35) 0%,transparent 70%)', marginTop:8 }} />
    </div>
  )
}

function NailPolish3D() {
  return (
    <div className="c3d-wrap">
      <div className="c3d-inner">
        {/* Cap / brush */}
        <div style={{
          width:34, height:90, position:'relative',
          background:`
            linear-gradient(100deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.04) 7%,transparent 18%),
            linear-gradient(180deg,#1a1a1a 0%,#0d0d0d 60%,#1a1a1a 100%)
          `,
          borderRadius:'4px 4px 2px 2px',
          boxShadow:'inset 1px 0 5px rgba(255,255,255,0.08),3px 0 0 rgba(0,0,0,0.7),5px 4px 0 rgba(0,0,0,0.5),0 4px 16px rgba(0,0,0,0.6)',
        }}>
          <div style={{ position:'absolute', right:-3, top:2, width:3, height:86, background:'rgba(0,0,0,0.8)', clipPath:'polygon(0 0,100% 3%,100% 97%,0 100%)' }} />
          <div style={{ position:'absolute', left:5, top:8, width:6, bottom:8, background:'linear-gradient(90deg,rgba(255,255,255,0.14),transparent)', borderRadius:3 }} />
          {/* Cap ring */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:5, background:'linear-gradient(180deg,rgba(40,40,40,1),rgba(10,10,10,1))', borderTop:'1px solid rgba(80,80,80,0.4)' }} />
        </div>
        {/* Neck ring */}
        <div style={{ width:38, height:8, background:'linear-gradient(180deg,#444,#1a1a1a)', boxShadow:'0 2px 6px rgba(0,0,0,0.7)' }}>
          <div style={{ position:'absolute', right:-3, width:3, height:8, background:'rgba(0,0,0,0.8)' }} />
        </div>
        {/* Glass bottle body */}
        <div style={{
          width:68, height:120, position:'relative',
          background:`
            linear-gradient(100deg,rgba(255,255,255,0.35) 0%,rgba(255,255,255,0.08) 8%,transparent 20%),
            linear-gradient(260deg,rgba(0,0,0,0.45) 0%,transparent 14%),
            linear-gradient(180deg,rgba(180,80,200,0.25) 0%,rgba(120,20,160,0.5) 40%,rgba(60,0,90,0.85) 100%)
          `,
          borderRadius:'20px 20px 24px 24px',
          boxShadow:'inset 3px 0 10px rgba(255,255,255,0.1),inset -3px 0 10px rgba(0,0,0,0.35),7px 0 0 rgba(50,0,80,0.65),12px 7px 0 rgba(25,0,45,0.5),0 20px 60px rgba(0,0,0,0.7),0 0 40px rgba(150,60,220,0.15)',
          overflow:'hidden',
        }}>
          {/* Right depth */}
          <div style={{ position:'absolute', right:-7, top:4, width:7, height:112, background:'linear-gradient(90deg,rgba(55,0,85,0.8),rgba(20,0,40,0.92))', borderRadius:'0 8px 8px 0', clipPath:'polygon(0 0,100% 5%,100% 95%,0 100%)' }} />
          {/* Left shine */}
          <div style={{ position:'absolute', left:8, top:8, width:12, bottom:8, background:'linear-gradient(90deg,rgba(255,255,255,0.22),transparent)', borderRadius:6 }} />
          {/* Colored liquid */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'72%', background:'linear-gradient(180deg,rgba(200,80,255,0.15),rgba(160,20,220,0.45),rgba(90,0,130,0.8))', borderRadius:'0 0 22px 22px' }} />
          {/* Liquid shimmer */}
          <div style={{ position:'absolute', top:'30%', left:6, right:6, height:1, background:'rgba(255,255,255,0.07)' }} />
        </div>
        {/* Bottle base */}
        <div style={{ width:72, height:6, background:'linear-gradient(90deg,transparent,rgba(60,0,90,0.6),rgba(30,0,50,0.8),rgba(60,0,90,0.6),transparent)', borderRadius:'0 0 4px 4px' }} />
      </div>
      <div className="c3d-refl" style={{ background:'linear-gradient(180deg,rgba(160,40,220,0.1),transparent)', height:36, width:68, filter:'blur(2px)', transform:'scaleY(-1)' }} />
      <div className="c3d-shadow" style={{ width:90, background:'radial-gradient(ellipse,rgba(170,60,240,0.32) 0%,transparent 70%)' }} />
    </div>
  )
}

function Compact3D() {
  return (
    <div className="c3d-wrap" style={{ transform:'perspective(500px) rotateX(15deg)' }}>
      <div className="c3d-inner" style={{ transform:'none', gap:0 }}>
        {/* Top lid */}
        <div style={{
          width:200, height:22, position:'relative',
          background:'linear-gradient(160deg,rgba(255,255,255,0.65) 0%,rgba(200,200,200,0.45) 30%,rgba(140,140,140,0.6) 70%,rgba(80,80,80,0.5) 100%)',
          borderRadius:'50% 50% 0 0 / 40% 40% 0 0',
          boxShadow:'inset 0 2px 4px rgba(255,255,255,0.8),0 -2px 8px rgba(0,0,0,0.3)',
          transform:'perspective(200px) rotateX(-28deg)',
          transformOrigin:'bottom center',
          marginBottom:-1,
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#b89030,#e8c060,#b89030)' }} />
          <div style={{ position:'absolute', inset:4, background:'radial-gradient(ellipse at 35% 35%,rgba(255,255,255,0.8) 0%,transparent 55%)', borderRadius:'50%' }} />
        </div>
        {/* Compact body */}
        <div style={{
          width:200, height:40, borderRadius:'0 0 50% 50% / 0 0 40% 40%',
          background:'linear-gradient(180deg,#1a1208 0%,#0e0c06 100%)',
          border:'2px solid transparent',
          boxShadow:'0 20px 60px rgba(0,0,0,0.7),0 0 50px rgba(210,170,80,0.15)',
          position:'relative', overflow:'hidden',
        }}>
          {/* Gold rim top */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#9a7020,#e0c050,#c0a030,#e0c050,#9a7020)' }} />
          {/* Gold rim bottom */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#9a7020,#e0c050,#c0a030,#e0c050,#9a7020)', borderRadius:'0 0 50% 50% / 0 0 40% 40%' }} />
          {/* Powder surface */}
          <div style={{ position:'absolute', top:4, left:10, right:10, bottom:4,
            background:'radial-gradient(ellipse at 40% 35%,rgba(255,240,200,0.6) 0%,rgba(220,190,140,0.8) 35%,rgba(180,140,90,0.9) 70%,rgba(140,100,50,0.95) 100%)',
            borderRadius:'0 0 50% 50% / 0 0 40% 40%',
          }}>
            {/* Powder shine */}
            <div style={{ position:'absolute', top:3, left:8, width:24, height:'30%', background:'rgba(255,255,255,0.3)', borderRadius:'50%', filter:'blur(2px)' }} />
          </div>
          {/* Depth side */}
          <div style={{ position:'absolute', right:-10, top:0, bottom:0, width:10, background:'linear-gradient(90deg,rgba(80,60,10,0.75),rgba(40,25,5,0.9))', borderRadius:'0 0 50% 0 / 0 0 40% 0' }} />
        </div>
        {/* Engraving band */}
        <div style={{ width:200, height:16, marginTop:0, background:'linear-gradient(90deg,#9a7020,#e0c050,#c0a030,#e0c050,#9a7020)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:7, letterSpacing:'0.38em', color:'rgba(60,40,0,0.8)' }}>GLAMORE BEAUTÉ</span>
        </div>
      </div>
      <div className="c3d-shadow" style={{ width:220, background:'radial-gradient(ellipse,rgba(200,160,60,0.38) 0%,transparent 70%)', marginTop:8 }} />
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   PARTICLE CANVAS
────────────────────────────────────────────────────────────── */
function ParticleCanvas({ progressRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      const p = progressRef.current
      let mi = -1, mp = 0
      MORPH_PHASES.forEach((ph, i) => {
        if (p >= ph.start && p <= ph.end) {
          mi = i
          mp = (p - ph.start) / (ph.end - ph.start)
        }
      })
      drawParticles(ctx, canvas.width, canvas.height, mp, mi)
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', resize)
    }
  }, [progressRef])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'fixed', inset:0, zIndex:30, pointerEvents:'none' }}
    />
  )
}

/* ──────────────────────────────────────────────────────────────
   HERO SECTION  — 800vh pinned cinematic scroll
────────────────────────────────────────────────────────────── */
const TITLE_CHARS = 'GLAMORE'.split('')

function LegacyHeroSection() {
  const sectionRef  = useRef(null)
  const progressRef = useRef(0)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:  sectionRef.current,
          pin:      true,
          start:    'top top',
          end:      '+=800%',
          scrub:    1.6,
          onUpdate: (self) => { progressRef.current = self.progress },
        },
      })

      /* ── 0.00-0.12  Title chars drop in — each with unique rotateZ spin ── */
      tl.fromTo('.hc-char',
        {
          y:               (i) => 160 + i * 8,
          opacity:         0,
          filter:          'blur(28px)',
          rotateX:         -90,
          rotateZ:         (i) => (i % 2 === 0 ? -1 : 1) * (8 + i * 3),
          scale:           0.6,
          transformOrigin: '50% 0%',
        },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          rotateX: 0, rotateZ: 0, scale: 1,
          stagger: { each: 0.055, ease: 'power2.in' },
          duration: 0.65,
          ease: 'expo.out',
        },
        0
      )

      /* ── 0.10-0.27  Perfume: drops from far above with barrel-roll ── */
      tl.fromTo('#co-perfume',
        { y: -560, rotateZ: -45, rotateY: 90, rotateX: 30, scale: 0.38, opacity: 0, filter: 'blur(20px)' },
        { y: 0, rotateZ: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1, filter: 'blur(0px)',
          duration: 0.9, ease: 'elastic.out(1.05, 0.44)' },
        0.10
      )

      /* ── 0.20  Glow pulse ── */
      tl.fromTo('#hero-glow',
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' },
        0.20
      )

      /* ── 0.22  Tagline words cascade in ── */
      tl.fromTo('.hc-tagw',
        { opacity: 0, y: 70, rotateX: -40, filter: 'blur(10px)', transformOrigin: '50% 0%' },
        { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          stagger: { each: 0.08, ease: 'power2.in' }, duration: 0.42, ease: 'power3.out' },
        0.22
      )

      /* ── 0.25  Sub-label drift up ── */
      tl.fromTo('.hc-sublabel',
        { opacity: 0, y: 28, letterSpacing: '0.08em' },
        { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 0.28, ease: 'power2.out' },
        0.25
      )

      /* ── MORPH 1  perfume → lipstick  0.28-0.42 ── */
      tl.to('#co-perfume',
        { opacity: 0, scale: 1.3, filter: 'blur(22px)', rotateY: 50, rotateZ: 18, y: 40, duration: 0.24 }, 0.28)
      tl.to('#pl-0', { opacity: 0, y: -28, rotateX: 30, duration: 0.14 }, 0.29)
      tl.to('#pl-1', { opacity: 1, y:   0, rotateX:  0, duration: 0.14 }, 0.37)
      tl.fromTo('#co-lipstick',
        { opacity: 0, scale: 0.5, filter: 'blur(22px)', rotateY: -80, rotateZ: -25, y: -60 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', rotateY: 0, rotateZ: 0, y: 0,
          duration: 0.26, ease: 'back.out(1.3)' }, 0.38)

      /* ── MORPH 2  lipstick → palette  0.46-0.59 ── */
      tl.to('#co-lipstick',
        { opacity: 0, scale: 1.28, filter: 'blur(22px)', rotateY: 60, rotateZ: 22, duration: 0.24 }, 0.46)
      tl.to('#pl-1', { opacity: 0, y: -28, rotateX: 30, duration: 0.14 }, 0.47)
      tl.to('#pl-2', { opacity: 1, y:   0, rotateX:  0, duration: 0.14 }, 0.54)
      tl.fromTo('#co-palette',
        { opacity: 0, scale: 0.5, filter: 'blur(22px)', rotateX: 55, rotateZ: -18 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', rotateX: 0, rotateZ: 0,
          duration: 0.26, ease: 'back.out(1.2)' }, 0.54)

      /* ── MORPH 3  palette → nailpolish  0.63-0.75 ── */
      tl.to('#co-palette',
        { opacity: 0, scale: 1.3, filter: 'blur(22px)', rotateX: -40, rotateZ: 15, duration: 0.24 }, 0.63)
      tl.to('#pl-2', { opacity: 0, y: -28, rotateX: 30, duration: 0.14 }, 0.64)
      tl.to('#pl-3', { opacity: 1, y:   0, rotateX:  0, duration: 0.14 }, 0.70)
      tl.fromTo('#co-nailpolish',
        { opacity: 0, scale: 0.5, filter: 'blur(22px)', rotateY: -90, rotateZ: 28 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', rotateY: 0, rotateZ: 0,
          duration: 0.26, ease: 'elastic.out(1.0, 0.5)' }, 0.70)

      /* ── MORPH 4  nailpolish → compact  0.79-0.91 ── */
      tl.to('#co-nailpolish',
        { opacity: 0, scale: 1.3, filter: 'blur(22px)', rotateY: 55, rotateZ: -20, duration: 0.24 }, 0.79)
      tl.to('#pl-3', { opacity: 0, y: -28, rotateX: 30, duration: 0.14 }, 0.80)
      tl.to('#pl-4', { opacity: 1, y:   0, rotateX:  0, duration: 0.14 }, 0.86)
      tl.fromTo('#co-compact',
        { opacity: 0, scale: 0.5, filter: 'blur(22px)', rotateX: -60, rotateZ: 14 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', rotateX: 0, rotateZ: 0,
          duration: 0.26, ease: 'back.out(1.3)' }, 0.86)

      /* ── 0.06  Woman portrait entrance ── */
      tl.fromTo('#hero-woman',
        { opacity: 0, y: 120, x: -40, rotateZ: -8, scale: 0.7, filter: 'blur(20px)' },
        { opacity: 1, y: 0,   x: 0,   rotateZ: 0,  scale: 1,   filter: 'blur(0px)',
          duration: 0.85, ease: 'expo.out' },
        0.06
      )
      // Woman exit
      tl.to('#hero-woman',
        { opacity: 0, y: -60, x: -30, rotateZ: 5, filter: 'blur(12px)', duration: 0.25 },
        0.91
      )

      /* ── 0.91-1.00  Cinematic final fade — chars scatter away ── */
      tl.to('.hc-char', {
        opacity: 0,
        y:       (i) => -40 - i * 6,
        rotateZ: (i) => (i % 2 ? 1 : -1) * 12,
        filter:  'blur(10px)',
        scale:   0.85,
        stagger: 0.018,
        duration: 0.28,
      }, 0.91)
      tl.to(['.hc-tagw', '.hc-sublabel', '.hero-product-label', '#hero-glow'],
        { opacity: 0, y: -25, filter: 'blur(8px)', stagger: 0.02, duration: 0.25 }, 0.92)
      tl.to('#co-compact',
        { opacity: 0, scale: 0.82, rotateX: 20, filter: 'blur(12px)', duration: 0.26 }, 0.93)
      tl.fromTo('.hero-exit-reveal',
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.32, ease: 'expo.out', transformOrigin: 'left' }, 0.95)
    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <>
      <ParticleCanvas progressRef={progressRef} />

      <section
        ref={sectionRef}
        style={{
          height: '100vh',
          background: '#000',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Noise texture */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', opacity:0.018, pointerEvents:'none', zIndex:1 }} />

        {/* Central glow orb */}
        <div id="hero-glow" style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(140,60,200,0.12) 0%,rgba(80,20,120,0.06) 40%,transparent 70%)', pointerEvents:'none', zIndex:1, opacity:0 }} />

        {/* TITLE */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', gap: '0.04em',
            perspective: '600px',
            marginBottom: 60,
          }}
        >
          {TITLE_CHARS.map((ch, i) => (
            <span
              key={i}
              className="hc-char"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(64px, 11vw, 148px)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                opacity: 0,
                display: 'inline-block',
                willChange: 'transform, opacity, filter',
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* COSMETIC STAGE */}
        <div
          style={{
            position: 'relative',
            width: 320, height: 380,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* All objects stacked, GSAP controls their opacity */}
          {[
            { id: 'co-perfume',    Component: PerfumeBottle3D,  initial: { opacity: 0 } },
            { id: 'co-lipstick',   Component: Lipstick3D,        initial: { opacity: 0 } },
            { id: 'co-palette',    Component: Palette3D,         initial: { opacity: 0 } },
            { id: 'co-nailpolish', Component: NailPolish3D,      initial: { opacity: 0 } },
            { id: 'co-compact',    Component: Compact3D,         initial: { opacity: 0 } },
          ].map(({ id, Component, initial }) => (
            <div
              key={id}
              id={id}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                willChange: 'transform, opacity, filter',
              }}
            >
              <div className="cosm-float">
                <Component />
              </div>
            </div>
          ))}
        </div>

        {/* TAGLINE */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', gap: '0.3em',
            marginTop: 48,
            perspective: '400px',
          }}
        >
          {['Where', 'beauty', 'becomes', 'art.'].map((w, i) => (
            <span
              key={i}
              className="hc-tagw"
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 2.2vw, 28px)',
                color: 'rgba(255,255,255,0.72)',
                letterSpacing: '0.02em',
                opacity: 0,
              }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* PRODUCT LABELS (one per object, stacked) */}
        <div style={{ position: 'relative', zIndex: 10, height: 54, marginTop: 28 }}>
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              id={`pl-${i}`}
              className="hero-product-label"
              style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                textAlign: 'center', opacity: i === 0 ? 0 : 0,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', fontWeight: 600, color: '#fff', letterSpacing: '0.04em' }}>{p.name}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 5 }}>{p.cat}</div>
            </div>
          ))}
        </div>

        {/* Sub-label */}
        <div
          className="hc-sublabel"
          style={{
            position: 'relative', zIndex: 10,
            fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            marginTop: 40,
            opacity: 0,
          }}
        >
          Scroll to explore
        </div>

        {/* Progress dots */}
        <div style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 20 }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* Exit line reveal */}
        <div className="hero-exit-reveal" style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(201,169,110,0.5),transparent)', opacity:0 }} />

        {/* Woman portrait - positioned left side */}
        <div
          id="hero-woman"
          style={{
            position: 'absolute',
            left: '5%',
            bottom: 0,
            width: 'min(26vw, 300px)',
            zIndex: 12,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          <div style={{ width: '100%', aspectRatio: '300/480' }} />
          <div style={{
            textAlign: 'center', marginTop: 6,
            fontSize: 9, letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.28)',
            textTransform: 'uppercase',
          }}>Hover face to reveal</div>
        </div>
      </section>
    </>
  )
}

function HeroSection() {
  const sectionRef      = useRef(null)
  const rafRef            = useRef(null)
  const portraitCanvasRef = useRef(null)
  const revealMaskRef     = useRef(null)   // offscreen: accumulates brush strokes
  const prettyImgRef      = useRef(null)
  const dirtyImgRef       = useRef(null)
  const isHoveringRef     = useRef(false)
  const lastPaintRef      = useRef(null)

  /* ── Canvas RAF: persistent brush-trail reveal ───────────────────
     revealMask (offscreen) accumulates soft brush circles as the mouse
     paints over the portrait.  Each frame the mask gently fades so old
     strokes dissolve — exactly like the Unicorn Studio "mouse trail"
     effect from the tutorial.
     Composite pipeline each frame:
       1. Draw reveal mask → source-in → pretty portrait  (circle area)
       2. destination-over → dirty portrait behind          (everywhere else)
  ─────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const pCanvas = portraitCanvasRef.current
    if (!pCanvas) return

    /* Create offscreen reveal-mask canvas */
    const mask = document.createElement('canvas')
    revealMaskRef.current = mask

    let fadeMask = null

    const buildFadeMask = (W, H) => {
      if (!W || !H || W < 2 || H < 2) return null
      const fm = document.createElement('canvas')
      fm.width = W; fm.height = H
      const fc = fm.getContext('2d')
      if (!fc) return null
      fc.fillStyle = 'white'
      fc.fillRect(0, 0, W, H)
      fc.globalCompositeOperation = 'destination-out'
      const addFade = (x0, y0, x1, y1, rx, ry, rw, rh) => {
        const g = fc.createLinearGradient(x0, y0, x1, y1)
        g.addColorStop(0, 'rgba(0,0,0,1)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        fc.fillStyle = g
        fc.fillRect(rx, ry, rw, rh)
      }
      addFade(0, 0,      0, H*0.08,   0, 0,      W, H*0.08)   // top
      addFade(0, H,      0, H*0.92,   0, H*0.92, W, H*0.08)   // bottom
      addFade(0, 0,      W*0.06, 0,   0, 0,      W*0.06, H)   // left
      addFade(W, 0,      W*0.94, 0,   W*0.94, 0, W*0.06, H)   // right
      fc.globalCompositeOperation = 'source-over'
      return fm
    }

    const resize = () => {
      const rect = pCanvas.getBoundingClientRect()
      pCanvas.width = rect.width
      pCanvas.height = rect.height
      mask.width  = rect.width
      mask.height = rect.height
      if (rect.width > 1 && rect.height > 1)
        fadeMask = buildFadeMask(rect.width, rect.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(pCanvas)
    resize()

    const pCtx = pCanvas.getContext('2d')
    const mCtx = mask.getContext('2d')
    let dirtyCutout = null
    let prettyCutout = null
    let cutoutW = 0
    let cutoutH = 0

    /* Draw src image scaled to fill the portrait canvas */
    const zDraw = (ctx, src, filt) => {
      if (!src?.complete || !src.naturalWidth) return
      const W = ctx.canvas.width, H = ctx.canvas.height
      const cs = Math.max(W / src.naturalWidth, H / src.naturalHeight)
      const dW = src.naturalWidth * cs, dH = src.naturalHeight * cs
      const bx = (W - dW) / 2, by = (H - dH) * 0.18
      if (filt) ctx.filter = filt
      ctx.drawImage(src, bx, by, dW, dH)
      ctx.filter = 'none'
    }

    const createPortraitLayer = (src, removeEdgeBg = false) => {
      if (!src?.complete || !src.naturalWidth) return null

      const cvs = document.createElement('canvas')
      cvs.width = pCanvas.width
      cvs.height = pCanvas.height
      const ctx = cvs.getContext('2d', { willReadFrequently: true })
      zDraw(ctx, src, null)

      if (!removeEdgeBg) return cvs

      const image = ctx.getImageData(0, 0, cvs.width, cvs.height)
      const data = image.data
      const W = cvs.width
      const H = cvs.height
      const seen = new Uint8Array(W * H)
      const stack = []

      const isEdgeBg = (idx) => {
        const p = idx * 4
        return Math.max(data[p], data[p + 1], data[p + 2]) < 46
      }

      for (let x = 0; x < W; x++) {
        stack.push(x, (H - 1) * W + x)
      }
      for (let y = 0; y < H; y++) {
        stack.push(y * W, y * W + W - 1)
      }

      while (stack.length) {
        const idx = stack.pop()
        if (idx < 0 || idx >= seen.length || seen[idx] || !isEdgeBg(idx)) continue

        seen[idx] = 1
        const p = idx * 4
        const max = Math.max(data[p], data[p + 1], data[p + 2])
        data[p + 3] = max < 24 ? 0 : Math.round(data[p + 3] * Math.min(1, (max - 24) / 22))

        const x = idx % W
        if (x > 0) stack.push(idx - 1)
        if (x < W - 1) stack.push(idx + 1)
        stack.push(idx - W, idx + W)
      }

      ctx.putImageData(image, 0, 0)
      return cvs
    }

    const tick = () => {
      const PW = pCanvas.width, PH = pCanvas.height
      const prettyImg = prettyImgRef.current
      const dirtyImg  = dirtyImgRef.current

      if (cutoutW !== PW || cutoutH !== PH || (!dirtyCutout && dirtyImg?.complete) || (!prettyCutout && prettyImg?.complete)) {
        cutoutW = PW
        cutoutH = PH
        dirtyCutout = createPortraitLayer(dirtyImg)
        prettyCutout = createPortraitLayer(prettyImg, true)
      }

      /* ── Fade the reveal mask each frame (dissolving trail) ── */
      mCtx.globalCompositeOperation = 'destination-in'
      mCtx.fillStyle = 'rgba(0,0,0,0.992)'
      mCtx.fillRect(0, 0, PW, PH)
      mCtx.globalCompositeOperation = 'source-over'

      /* ── Composite: pretty through mask, then dirty behind ── */
      pCtx.clearRect(0, 0, PW, PH)

      if (prettyCutout) {
        /* Step 1: copy the accumulated mask as alpha channel */
        pCtx.drawImage(mask, 0, 0)
        /* Step 2: clip pretty to the mask shape */
        pCtx.globalCompositeOperation = 'source-in'
        pCtx.drawImage(prettyCutout, 0, 0)
        pCtx.globalCompositeOperation = 'source-over'
      }

      /* Step 3: dirty portrait fills everywhere behind the reveal */
      pCtx.globalCompositeOperation = 'destination-over'
      if (dirtyCutout) pCtx.drawImage(dirtyCutout, 0, 0)
      pCtx.globalCompositeOperation = 'source-over'

      /* Step 4: apply fade mask — opaque center, transparent edges */
      if (fadeMask) {
        pCtx.globalCompositeOperation = 'destination-in'
        pCtx.drawImage(fadeMask, 0, 0)
        pCtx.globalCompositeOperation = 'source-over'
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  /* ── GSAP: page-load cinematic + scroll exit ─────────────────── */
  useGSAP(() => {
    const ctx = gsap.context(() => {

      /* ── Page-load: dramatic 3D drop-in entrance ── */
      const load = gsap.timeline({ delay: 0.10 })

      load
        /* Background fades in first */
        .fromTo('.premium-hero-bg',
          { opacity: 0 },
          { opacity: 1, duration: 1.8, ease: 'power2.out' }, 0)

        /* Portrait swoops in from below-right with Y-axis spin */
        .fromTo('.premium-portrait-stage',
          {
            opacity: 0, y: 160, x: 48,
            rotateY: -28, rotateZ: -5,
            scale: 0.72, filter: 'blur(34px)',
          },
          {
            opacity: 1, y: 0, x: 0,
            rotateY: 0, rotateZ: 0,
            scale: 1, filter: 'blur(0px)',
            duration: 1.38, ease: 'expo.out',
          }, 0.12)

        /* Kicker drifts up */
        .fromTo('.premium-kicker',
          { opacity: 0, y: 22, filter: 'blur(10px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' }, 0.30)

        /* Title: 3D flip — each word drops from Z-depth, rotating into place */
        .fromTo('.premium-title-word',
          {
            opacity: 0, y: 110, rotateX: -82,
            filter: 'blur(28px)', transformOrigin: '50% 0%',
            z: -100,
          },
          {
            opacity: 1, y: 0, rotateX: 0,
            filter: 'blur(0px)', z: 0,
            stagger: 0.15, duration: 1.18, ease: 'expo.out',
          }, 0.24)

        /* Subcopy slides up */
        .fromTo('.premium-subcopy',
          { opacity: 0, y: 28, filter: 'blur(10px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' }, 0.85)

        /* Stats cascade */
        .fromTo('.hero-stat-item',
          { opacity: 0, y: 24, rotateX: -30, transformOrigin: '50% 0%' },
          { opacity: 1, y: 0,  rotateX: 0,
            stagger: 0.09, duration: 0.65, ease: 'power3.out' }, 1.00)

        /* Buttons */
        .fromTo('.premium-actions',
          { opacity: 0, y: 22, scale: 0.94 },
          { opacity: 1, y: 0,  scale: 1, duration: 0.65, ease: 'power3.out' }, 1.16)

        /* Aura glows on */
        .fromTo('.portrait-aura',
          { scale: 0.4, opacity: 0 },
          { scale: 1,   opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.52)

        .fromTo(['.portrait-designer-halo', '.portrait-silk-light', '.portrait-depth-shadow', '.portrait-glass-frame'],
          { opacity: 0, scale: 0.92, filter: 'blur(16px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', stagger: 0.08, duration: 1.05, ease: 'power3.out' }, 0.62)

      /* ── Scroll-exit: 3D depth parallax — portrait and copy separate in Z ── */
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin:     true,
          start:   'top top',
          end:     '+=300%',
          scrub:   1.2,
        },
      })

      /* Portrait lifts gently — pure Y only, no rotation or z so size never changes */
      scrollTl.to('.premium-portrait-stage', {
        y: -24,
        ease: 'none',
      }, 0)

      /* Copy drifts up slightly */
      scrollTl.to('.premium-copy', {
        y: -20,
        ease: 'none',
      }, 0)

      /* Final collapse: fade + blur + lift only — absolutely no scale/rotate/z */
      scrollTl.to('.premium-hero-shell', {
        y: -50, opacity: 0, filter: 'blur(14px)',
        ease: 'power2.in',
      }, 0.68)

    }, sectionRef)
    return () => ctx.revert()
  }, { scope: sectionRef })

  /* ── Portrait hover handlers — brush-trail reveal ───────────── */
  const paintReveal = useCallback((cx_pct, cy_pct) => {
    const mask = revealMaskRef.current
    if (!mask) return
    const mCtx = mask.getContext('2d')
    const W = mask.width, H = mask.height
    const x = (cx_pct / 100) * W
    const y = (cy_pct / 100) * H
    /* Brush radius: ~14% of shorter dimension — soft and generous */
    const r = Math.min(W, H) * 0.105

    const grd = mCtx.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0,    'rgba(255,255,255,1)')
    grd.addColorStop(0.34, 'rgba(255,255,255,0.92)')
    grd.addColorStop(0.68, 'rgba(255,255,255,0.42)')
    grd.addColorStop(0.91, 'rgba(255,255,255,0.10)')
    grd.addColorStop(1,    'rgba(255,255,255,0)')
    mCtx.fillStyle = grd
    mCtx.fillRect(x - r, y - r, r * 2, r * 2)
  }, [])

  const onPortraitMove = useCallback((e) => {
    if (!isHoveringRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = ((e.clientX - rect.left) / rect.width)  * 100
    const cy = ((e.clientY - rect.top)  / rect.height) * 100
    e.currentTarget.style.setProperty('--hover-x', `${cx}%`)
    e.currentTarget.style.setProperty('--hover-y', `${cy}%`)

    const last = lastPaintRef.current
    const dx = last ? cx - last.x : 0
    const dy = last ? cy - last.y : 0
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 3))

    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      paintReveal(last ? last.x + dx * t : cx, last ? last.y + dy * t : cy)
    }
    lastPaintRef.current = { x: cx, y: cy }
  }, [paintReveal])

  const onPortraitEnter = useCallback((e) => {
    isHoveringRef.current = true
    e.currentTarget.classList.add('is-brushing')
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = ((e.clientX - rect.left) / rect.width)  * 100
    const cy = ((e.clientY - rect.top)  / rect.height) * 100
    e.currentTarget.style.setProperty('--hover-x', `${cx}%`)
    e.currentTarget.style.setProperty('--hover-y', `${cy}%`)
    lastPaintRef.current = { x: cx, y: cy }
    paintReveal(cx, cy)
  }, [paintReveal])

  const onPortraitLeave = useCallback((e) => {
    isHoveringRef.current = false
    lastPaintRef.current = null
    e.currentTarget.classList.remove('is-brushing')
  }, [])

  const onHeroMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--hero-x', `${x}%`)
    e.currentTarget.style.setProperty('--hero-y', `${y}%`)
    e.currentTarget.style.setProperty('--hero-tilt-x', `${(50 - y) * 0.035}deg`)
    e.currentTarget.style.setProperty('--hero-tilt-y', `${(x - 50) * 0.035}deg`)
  }, [])

  const STATS = [
    ['500+', 'Happy Clients'],
    ['8',    'Years of Art'],
    ['6',    'Specialists'],
    ['50+',  'Awards Won'],
  ]

  return (
    <section ref={sectionRef} className="premium-hero" onMouseMove={onHeroMove}>
      <div className="premium-hero-bg" />
      <div className="hero-lux-field" aria-hidden="true" />
      <div className="hero-light-cursor" aria-hidden="true" />
      <div className="hero-cinema-vignette" aria-hidden="true" />

      {/* ── Luxury corner brackets ── */}
      <div className="hero-corner hc-tl" />
      <div className="hero-corner hc-tr" />
      <div className="hero-corner hc-bl" />
      <div className="hero-corner hc-br" />

      {/* ── Floating ambient gold particles ── */}
      <div className="hero-gold-particle hgp-1">✦</div>
      <div className="hero-gold-particle hgp-2">✦</div>
      <div className="hero-gold-particle hgp-3">·</div>
      <div className="hero-gold-particle hgp-4">✦</div>
      <div className="hero-gold-particle hgp-5">·</div>

      {/* ── Thin vertical rule on the right edge ── */}
      <div className="hero-side-rule" />

      <div className="premium-hero-shell">

        {/* ── TEXT COLUMN ── */}
        <div className="premium-copy">

          <div className="premium-kicker">✦ Los Angeles · Premium Beauty Studio</div>

          <h1 className="premium-title" aria-label="Reveal Your Glow">
            <span className="premium-title-word">Reveal</span>
            <span className="premium-title-word">Your</span>
            <span className="premium-title-word">Glow.</span>
          </h1>

          <p className="premium-subcopy">
            A cinematic beauty ritual where skincare, makeup, and confidence
            converge — crafted by artists who see beauty as a language.
          </p>

          <div className="hero-stats-grid">
            {STATS.map(([num, label]) => (
              <div key={label} className="hero-stat-item">
                <div className="hero-stat-num">{num}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>

          <div className="premium-actions">
            <Link to="/booking"  className="btn btn-gold">Book the ritual</Link>
            <Link to="/services" className="btn btn-outline">Explore services</Link>
          </div>
        </div>

        {/* ── PORTRAIT COLUMN ── */}
        <div className="premium-portrait-stage">

          {/* Soft radial aura behind portrait */}
          <div className="portrait-aura" />
          <div className="portrait-depth-shadow" aria-hidden="true" />

          {/* ── Floating label tags ── */}
          <div className="portrait-campaign-dust" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="portrait-cinematic-arc" aria-hidden="true">
            <span className="portrait-arc-light" />
            <span className="portrait-arc-dot pad-1" />
            <span className="portrait-arc-dot pad-2" />
            <span className="portrait-arc-dot pad-3" />
          </div>

          {/* ── Saturn rings — BEHIND portrait (z:6) ── */}
          <div className="portrait-campaign-base" aria-hidden="true" />

          {/* Glamore monogram badge */}
          <div className="portrait-botanical-blur" aria-hidden="true">
            <span className="botanical-stem bs-1" />
            <span className="botanical-stem bs-2" />
            <span className="botanical-stem bs-3" />
            <span className="botanical-bloom bb-1" />
            <span className="botanical-bloom bb-2" />
            <span className="botanical-bloom bb-3" />
            <span className="botanical-bloom bb-4" />
            <span className="botanical-bloom bb-5" />
          </div>

          {/* ── Portrait card — sits between ring layers (z:10) ── */}
          <div
            className="premium-portrait-card"
            onMouseMove={onPortraitMove}
            onMouseEnter={onPortraitEnter}
            onMouseLeave={onPortraitLeave}
          >
            <div className="portrait-glass-frame" aria-hidden="true" />
            <div className="real-model-portrait">
              <canvas ref={portraitCanvasRef} className="hero-portrait-cvs" />
              <img ref={dirtyImgRef}  src={heroDirtyPortrait}  alt="" aria-hidden="true" style={{ display:'none' }} />
              <img ref={prettyImgRef} src={heroPrettyPortrait} alt="" aria-hidden="true" style={{ display:'none' }} />
              <div className="real-model-shadow" />
            </div>
          </div>

          {/* ── Saturn rings — FRONT lower arc (z:14, clipped to bottom half) ── */}
          <div className="portrait-right-tags" aria-hidden="true">
            <div className="campaign-tag ctag-1">
              <span className="campaign-tag-icon">✦</span>
              <span>Signature Glow</span>
            </div>
            <div className="campaign-tag ctag-2">
              <span className="campaign-tag-icon">♧</span>
              <span>Premium Care</span>
            </div>
            <div className="campaign-tag ctag-3">
              <span className="campaign-tag-icon">⌁</span>
              <span>Artistry</span>
            </div>
            <div className="campaign-tag ctag-4">
              <span className="campaign-tag-icon">♡</span>
              <span>Confidence</span>
            </div>
          </div>

          {/* ── Sparkles ── */}
        </div>

      </div>

      <div className="premium-scroll-cue">
        <span className="scroll-cue-pip" />
        Scroll
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   INTRO — Our Philosophy cinematic reveal
═══════════════════════════════════════════════════════════ */
function IntroSection() {
  const ref = useRef(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const trig = { trigger: ref.current }

      /* ── Ornament lines + diamond fire the moment section enters */
      gsap.fromTo('.intro-orn-line-l',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'right center', duration: 1, ease: 'power3.out',
          scrollTrigger: { ...trig, start: 'top 88%', toggleActions: 'play none none reverse' } })
      gsap.fromTo('.intro-orn-line-r',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power3.out',
          scrollTrigger: { ...trig, start: 'top 88%', toggleActions: 'play none none reverse' } })
      gsap.fromTo('.intro-orn-diamond',
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)',
          scrollTrigger: { ...trig, start: 'top 86%', toggleActions: 'play none none reverse' } })

      /* ── Label */
      gsap.fromTo('.intro-label',
        { opacity: 0, y: 14, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
          scrollTrigger: { ...trig, start: 'top 84%', toggleActions: 'play none none reverse' } })

      /* ── Words: scrub-tied so each word lights up AS you scroll through the section */
      gsap.fromTo('.intro-word',
        { opacity: 0, y: 30, filter: 'blur(10px)', rotateX: -32, transformOrigin: 'top center' },
        { opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0,
          stagger: 0.06,
          scrollTrigger: {
            ...trig,
            start: 'top 75%',      /* starts revealing when section just enters */
            end:   'bottom 65%',   /* finishes well before section starts leaving */
            scrub: 1.2,
          }
        })

      /* ── Signature fades in after words are done */
      gsap.fromTo('.intro-signature',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { ...trig, start: 'center 55%', toggleActions: 'play none none reverse' } })
      gsap.fromTo('.intro-sig-rule',
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.12, duration: 1, ease: 'power3.out',
          scrollTrigger: { ...trig, start: 'center 52%', toggleActions: 'play none none reverse' } })

      /* ── Exit: only fires after section bottom has mostly left viewport */
      gsap.to(ref.current, {
        opacity: 0, y: -70, filter: 'blur(5px)', ease: 'none',
        scrollTrigger: { ...trig, start: 'bottom 28%', end: 'bottom -8%', scrub: 1.2 }
      })

      /* ── Background orbs drift slowly */
      gsap.to('.intro-orb-a', {
        y: -60, x: 30, ease: 'none',
        scrollTrigger: { ...trig, start: 'top bottom', end: 'bottom top', scrub: 2 }
      })
      gsap.to('.intro-orb-b', {
        y: 40, x: -20, ease: 'none',
        scrollTrigger: { ...trig, start: 'top bottom', end: 'bottom top', scrub: 2.5 }
      })
    }, ref)
    return () => ctx.revert()
  }, { scope: ref })

  const words = 'Beautifully crafted beauty experiences from a team of passionate specialists who believe that feeling extraordinary is your right — not a luxury.'.split(' ')

  return (
    <section ref={ref} className="intro-section">
      {/* Ambient background orbs */}
      <div className="intro-bg-orb intro-orb-a" />
      <div className="intro-bg-orb intro-orb-b" />
      {/* Decorative side lines */}
      <div className="intro-vline intro-vline-l" />
      <div className="intro-vline intro-vline-r" />

      <div className="container intro-container">
        {/* Top ornament */}
        <div className="intro-ornament">
          <span className="intro-orn-line intro-orn-line-l" />
          <span className="intro-orn-diamond">✦</span>
          <span className="intro-orn-line intro-orn-line-r" />
        </div>

        <div className="intro-label">Our Philosophy</div>

        <p className="intro-text">
          {words.map((w, i) => (
            <span key={i} className="intro-word">{w}&nbsp;</span>
          ))}
        </p>

        <div className="intro-signature">
          <span className="intro-sig-rule" />
          <span className="intro-byline">The Glamore Studio</span>
          <span className="intro-sig-rule" />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   NUMBERS STRIP — Brand credibility bar
═══════════════════════════════════════════════════════════ */
const STRIP_NUMS = [
  { num: '10K+',  label: 'Hours of Craft' },
  { num: '500+',  label: 'Transformations' },
  { num: '4.9★', label: 'Client Rating' },
  { num: '100%',  label: 'Natural Products' },
]

/* ════════════════════════════════════════════════════════════
   LUXURY MARQUEE — scrolling gold strip between sections
═══════════════════════════════════════════════════════════ */
const MARQUEE_ITEMS = ['Premium Beauty', '✦', 'Est. 2018', '✦', 'Los Angeles', '✦', 'Artistry', '✦', 'Luxury Studio', '✦', 'Elegance', '✦']

/* ════════════════════════════════════════════════════════════
   LUXURY CURSOR  — gold dot + lagging ring + ambient glow
═══════════════════════════════════════════════════════════ */
function LuxuryCursor() {
  useEffect(() => {
    if ('ontouchstart' in window) return // touch devices keep default cursor

    let lastSpark = 0
    const throwSparkles = (x, y, count = 1) => {
      for (let i = 0; i < count; i++) {
        const sp = document.createElement('span')
        sp.className = 'pointer-glitter'
        const angle = Math.random() * Math.PI * 2
        const dist = 10 + Math.random() * 28
        const size = 2 + Math.random() * 4
        sp.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;--rot:${Math.random()*180}deg`
        document.body.appendChild(sp)
        sp.addEventListener('animationend', () => sp.remove(), { once: true })
      }
    }

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastSpark < 42) return
      lastSpark = now
      throwSparkles(e.clientX, e.clientY, 1)
    }

    const onClick = (e) => {
      throwSparkles(e.clientX, e.clientY, 10)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return null
}

/* ════════════════════════════════════════════════════════════
   AMBIENT GOLD DUST  — fixed canvas of drifting motes
═══════════════════════════════════════════════════════════ */
function AmbientGoldDust() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = window.innerWidth
    let H = window.innerHeight
    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const COUNT = 50
    const motes = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     0.35 + Math.random() * 1.1,
      vx:    (Math.random() - 0.5) * 0.14,
      alpha: 0.10 + Math.random() * 0.22,
      life:  Math.random(),
      speed: 0.0012 + Math.random() * 0.0018,
      hue:   34  + Math.random() * 20,
      wave:  Math.random() * Math.PI * 2,
    }))

    let rafId = null
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      motes.forEach(m => {
        m.life += m.speed
        if (m.life > 1) {
          m.life = 0
          m.x = Math.random() * W
          m.y = H + 8
        }
        const fade = m.life < 0.12 ? m.life / 0.12 : m.life > 0.78 ? (1 - m.life) / 0.22 : 1
        const wx   = m.x + Math.sin(m.life * Math.PI * 3.5 + m.wave) * 8
        const wy   = m.y - m.life * H * 0.72
        ctx.globalAlpha  = m.alpha * fade
        ctx.fillStyle    = `hsl(${m.hue},62%,66%)`
        ctx.beginPath()
        ctx.arc(wx, wy, Math.max(0.3, m.r), 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-dust" aria-hidden="true" />
}

/* ════════════════════════════════════════════════════════════
   TEXT SCRAMBLE EFFECT  — scrambles all .t-label on reveal
═══════════════════════════════════════════════════════════ */
const SCRAMBLE_CHARS = '✦▸◆◇●○★■△▾GLAMORE'

function TextScrambleEffect() {
  useEffect(() => {
    const labels = [...document.querySelectorAll('.t-label')]

    const scramble = (el) => {
      const orig = el.dataset.orig || el.textContent
      el.dataset.orig = orig
      let frame = 0
      const total = 28
      const tick = () => {
        frame++
        const p = frame / total
        el.textContent = orig
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            return p >= (i / orig.length + 0.18) ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
        if (frame < total) requestAnimationFrame(tick)
        else el.textContent = orig
      }
      requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          scramble(e.target)
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.7 })

    labels.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return null
}

function CinematicSplash() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!visible) return undefined

    document.documentElement.classList.add('glamore-splash-lock')
    const timer = window.setTimeout(() => {
      setVisible(false)
      document.documentElement.classList.remove('glamore-splash-lock')
    }, 4750)

    return () => {
      window.clearTimeout(timer)
      document.documentElement.classList.remove('glamore-splash-lock')
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="glamore-splash" aria-hidden="true">
      <div className="glamore-splash-aura">
        <span />
        <span />
        <span />
      </div>
      <div className="glamore-splash-film" />
      <div className="glamore-splash-center">
        <div className="glamore-splash-mark">
          <span className="glamore-splash-star">✦</span>
          <span className="glamore-splash-logo">Glamore</span>
        </div>
        <div className="glamore-splash-line" />
        <p>Premium Beauty Studio</p>
      </div>
      <div className="glamore-splash-reveal" />
    </div>
  )
}

function LuxuryMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS] // double for seamless loop
  return (
    <div className="luxury-marquee">
      <div className="luxury-marquee-track">
        {items.map((item, i) => (
          <span key={i} className="luxury-marquee-item">{item}</span>
        ))}
      </div>
    </div>
  )
}

function NumbersStrip() {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.fromTo('.ns-item',
      { opacity: 0, y: 28, scale: 0.90 },
      {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.10,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 82%',
          end: 'top 40%',
          scrub: 1.1,
        }
      }
    )

    // Counter animation: numeric values count up on reveal
    const numEls = ref.current?.querySelectorAll('.ns-num')
    numEls?.forEach(el => {
      const raw = el.textContent.trim()
      // parse leading integer e.g. "10K+" → 10, "4.9★" → 4.9, "500+" → 500, "100%" → 100
      const match = raw.match(/^([\d.]+)/)
      if (!match) return
      const target = parseFloat(match[1])
      const suffix = raw.slice(match[0].length) // "+", "K+", "★", "%"

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              const v = obj.val
              el.textContent = (Number.isInteger(target) ? Math.round(v) : v.toFixed(1)) + suffix
            },
            onComplete: () => { el.textContent = raw },
          })
        },
      })
    })
  }, { scope: ref })

  return (
    <div ref={ref} className="numbers-strip">
      {STRIP_NUMS.map(({ num, label }) => (
        <div key={label} className="ns-item">
          <div className="ns-num">{num}</div>
          <div className="ns-label">{label}</div>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   SERVICES — Horizontal pinned scroll
═══════════════════════════════════════════════════════════ */
const legacyServices = [
  { icon:'💇‍♀️', title:'Hair Styling',        sub:'Cuts · Blowouts · Keratin',  from:'$80',  bg:'linear-gradient(135deg,#1a0d18,#3d1a3a)' },
  { icon:'🎨', title:'Hair Colouring',       sub:'Balayage · Ombré · Colour',  from:'$150', bg:'linear-gradient(135deg,#1a1000,#4a2c00)' },
  { icon:'💅', title:'Nail Art',             sub:'Gel · Acrylic · Design',     from:'$45',  bg:'linear-gradient(135deg,#1a0813,#4a1830)' },
  { icon:'✨', title:'Beauty Treatments',    sub:'Lashes · Brows · Facials',   from:'$95',  bg:'linear-gradient(135deg,#0d1520,#1a2a40)' },
  { icon:'💄', title:'Makeup & Bridal',      sub:'Events · Weddings · Shoots', from:'$120', bg:'linear-gradient(135deg,#1a0818,#3a1235)' },
  { icon:'👑', title:'Studio Experience',   sub:'Full-day luxury packages',   from:'$449', bg:'linear-gradient(135deg,#100a04,#2a1a08)' },
]

const services = [
  { kind:'shears',   title:'Hair Styling',      sub:'Cuts - Blowouts - Keratin',  from:'$80',  accent:'#C27B8C', bg:'linear-gradient(135deg,#160912,#3d1a3a)', img: hairStylingPhoto },
  { kind:'palette',  title:'Hair Colouring',    sub:'Balayage - Ombre - Colour',  from:'$150', accent:'#D8AC54', bg:'linear-gradient(135deg,#171006,#4a2c00)', img: hairColourPhoto },
  { kind:'polish',   title:'Nail Art',          sub:'Gel - Acrylic - Design',     from:'$45',  accent:'#D68DB1', bg:'linear-gradient(135deg,#170813,#4a1830)', img: nailArtPhoto },
  { kind:'serum',    title:'Beauty Treatments', sub:'Lashes - Brows - Facials',   from:'$95',  accent:'#8CB8D8', bg:'linear-gradient(135deg,#08101a,#1a2a40)', img: beautyTreatPhoto },
  { kind:'lipstick', title:'Makeup & Bridal',   sub:'Events - Weddings - Shoots', from:'$120', accent:'#D96B7D', bg:'linear-gradient(135deg,#170818,#3a1235)', img: makeupBridalPhoto },
  { kind:'crown',    title:'Studio Experience', sub:'Full-day luxury packages',   from:'$449', accent:'#E1C16B', bg:'linear-gradient(135deg,#120904,#2a1a08)', img: studioExpPhoto },
]

function ServiceObject({ kind }) {
  return (
    <div className={`svc-object svc-object--${kind}`} aria-hidden="true">
      <div className="svc-object-shadow" />
      <div className="svc-object-glow" />
      <div className="svc-object-core">
        {kind === 'shears' && (
          <>
            <span className="shear shear-a" />
            <span className="shear shear-b" />
            <span className="shear-ring ring-a" />
            <span className="shear-ring ring-b" />
          </>
        )}
        {kind === 'palette' && (
          <>
            <span className="palette-lid" />
            <span className="palette-pan pan-a" />
            <span className="palette-pan pan-b" />
            <span className="palette-pan pan-c" />
            <span className="palette-pan pan-d" />
          </>
        )}
        {kind === 'polish' && (
          <>
            <span className="polish-cap" />
            <span className="polish-body" />
            <span className="polish-shine" />
          </>
        )}
        {kind === 'serum' && (
          <>
            <span className="serum-dropper" />
            <span className="serum-bottle" />
            <span className="serum-liquid" />
          </>
        )}
        {kind === 'lipstick' && (
          <>
            <span className="lipstick-tip" />
            <span className="lipstick-band" />
            <span className="lipstick-base" />
          </>
        )}
        {kind === 'crown' && (
          <>
            <span className="crown-band" />
            <span className="crown-peak peak-a" />
            <span className="crown-peak peak-b" />
            <span className="crown-peak peak-c" />
          </>
        )}
      </div>
    </div>
  )
}

function ServicesSection() {
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useGSAP(() => {
    const cards = trackRef.current.querySelectorAll('.svc-card')
    const totalScroll = () => trackRef.current.scrollWidth - window.innerWidth

    const horizontal = gsap.to(trackRef.current, {
      x: () => -totalScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger: outerRef.current,
        pin: true,
        start: 'top top',
        end: () => `+=${totalScroll() * 1.18}`,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
        },
      }
    })

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { rotateY: i % 2 === 0 ? -18 : 18, z: -120 },
        {
          rotateY: i % 2 === 0 ? 10 : -10,
          z: 110,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontal,
            start: 'left 88%',
            end: 'right 12%',
            scrub: true,
          },
        }
      )

      gsap.to(card.querySelector('.svc-object-core'), {
        rotateY: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontal,
          start: 'left right',
          end: 'right left',
          scrub: 1.5,
        },
      })
    })

    /* Church-style entrance: each card rises majestically with rotation */
    gsap.fromTo(cards,
      {
        opacity:         0,
        y:               (i) => 120 + i * 15,
        rotateX:         -28,
        rotateZ:         (i) => (i % 2 === 0 ? -1 : 1) * 4,
        scale:           0.78,
        transformOrigin: 'center bottom',
        filter:          'blur(8px)',
      },
      {
        opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1, filter: 'blur(0px)',
        stagger: { each: 0.11, ease: 'power2.in' },
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top 80%',
          end: 'top 15%',
          scrub: 1.1,
        },
      }
    )
  }, { scope: outerRef })

  return (
    <section ref={outerRef} style={{ background:'var(--black)', overflow:'hidden' }}>
      <div className="container" style={{ paddingTop:100, paddingBottom:0 }}>
        <div className="sec-header">
          <div className="t-label" style={{ marginBottom:16 }}>What We Offer</div>
          <h2 className="t-title" style={{ color:'var(--white)', maxWidth:560 }}>
            Our Signature <span className="t-gold-em">Services</span>
          </h2>
          <div className="sec-divider" />
          <p className="t-body t-dim" style={{ maxWidth:480 }}>
            Scroll to explore our full range of premium beauty treatments.
          </p>
        </div>
      </div>
      <div style={{ paddingTop:40, paddingBottom:100, paddingLeft:48 }}>
        <div ref={trackRef} style={{ display:'flex', gap:24, width:'max-content', willChange:'transform' }}>
          {services.map((s, i) => (
            <div key={i} className="svc-card" style={{
              width:340, height:460,
              background:s.bg,
              borderRadius:24,
              border:'1px solid rgba(201,169,110,0.1)',
              padding:'48px 40px',
              display:'flex', flexDirection:'column', justifyContent:'flex-end',
              position:'relative', overflow:'hidden', flexShrink:0, cursor:'pointer',
              transition:'border-color 300ms, box-shadow 400ms, transform 400ms',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'
                e.currentTarget.style.boxShadow = '0 0 80px rgba(201,169,110,0.15), 0 30px 60px rgba(0,0,0,0.5)'
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.012)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.1)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {/* Church-light: divine rays from top */}
              <div className="svc-church-rays" />
              {/* Stained-glass shimmer border */}
              <div className="svc-glass-border" />
              {/* Ambient orb */}
              <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(201,169,110,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:-20, left:-20, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle,${s.bg.match(/#\w+/g)?.[1] || 'rgba(201,169,110,0.05)'} 0%,transparent 70%)`, pointerEvents:'none', opacity:0.4 }} />

              <div className="svc-icon-wrap">
                <div style={{ fontSize:'3.6rem', filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.5))' }}>{s.icon}</div>
              </div>
              <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:10, position:'relative', zIndex:2 }}>Service 0{i+1}</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--white)', marginBottom:8, position:'relative', zIndex:2 }}>{s.title}</h3>
              <p style={{ fontSize:14, color:'var(--text-2)', marginBottom:24, lineHeight:1.6, position:'relative', zIndex:2 }}>{s.sub}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:2 }}>
                <span style={{ fontSize:13, color:'var(--gold)', fontWeight:700 }}>From {s.from}</span>
                <Link to="/booking" className="btn btn-gold" style={{ padding:'10px 22px', fontSize:12, minHeight:38 }}>Book →</Link>
              </div>
            </div>
          ))}
          <div style={{ width:48, flexShrink:0 }} />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   ABOUT — Split parallax
═══════════════════════════════════════════════════════════ */
function SignatureServicesSection() {
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const headerRef = useRef(null)

  useGSAP(() => {
    const track = trackRef.current
    if (!track) return

    const cards = gsap.utils.toArray('.svc-cine-card')

    /* ── Precise centering: set horizontal padding so card 0 sits at
       the exact viewport center on every screen size.  Runs on init
       AND on every ScrollTrigger refresh (resize).                 ── */
    const setCenterPadding = () => {
      const viewport = outerRef.current?.querySelector('.svc-viewport')
      if (!viewport || !cards[0]) return
      const cardW  = cards[0].offsetWidth
      const halfVP = window.innerWidth / 2
      const pad    = Math.max(48, halfVP - cardW / 2)
      viewport.style.paddingLeft  = `${pad}px`
      viewport.style.paddingRight = `${pad}px`
    }
    setCenterPadding()

    const getTravel = () => {
      const lastCard = cards[cards.length - 1]
      if (!lastCard) return 0
      const viewportCenter = window.innerWidth / 2
      const lastCardCenter = track.offsetLeft + lastCard.offsetLeft + (lastCard.offsetWidth / 2)
      return Math.max(0, lastCardCenter - viewportCenter)
    }

    const stageCards = () => {
      const viewportCenter = window.innerWidth / 2
      let maxProx = -1, activeIdx = 0

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.left + rect.width / 2
        /* Normalize by full half-viewport so dist=1 when card is at the viewport edge */
        const dist = (cardCenter - viewportCenter) / viewportCenter
        const prox = Math.max(0, 1 - Math.abs(dist))

        if (prox > maxProx) { maxProx = prox; activeIdx = idx }

        /* Z-depth: active surges to +360, neighbors at ~-40, distant at -260 */
        const z = prox >= 0.5
          ? gsap.utils.mapRange(0.5, 1, 60, 360, prox)
          : gsap.utils.mapRange(0, 0.5, -260, 60, prox)

        /* Scale: 1.0 at center → 0.48 at far edge */
        const sc = prox >= 0.5
          ? gsap.utils.mapRange(0.5, 1, 0.70, 1.0, prox)
          : gsap.utils.mapRange(0, 0.5, 0.48, 0.70, prox)

        /* Opacity: smooth S-curve — 1.0 at center, 0.10 at far */
        const op = prox >= 0.5
          ? gsap.utils.mapRange(0.5, 1, 0.55, 1.0, prox)
          : gsap.utils.mapRange(0, 0.5, 0.10, 0.55, prox)

        /* rotateY spreads cards wide; clamp prevents extreme angles */
        const rotY = gsap.utils.clamp(-58, 58, dist * -48)
        const rotZ = gsap.utils.clamp(-2, 2, dist * 1.8)

        /* Blur: zero once past 0.78 threshold, up to 8px at far end */
        const blurAmt = prox > 0.78 ? 0 : gsap.utils.mapRange(0, 0.78, 8, 0, prox)
        const sat = (0.5 + prox * 0.62).toFixed(2)

        card.classList.toggle('is-active', prox > 0.75)
        gsap.set(card, {
          rotateY: rotY,
          rotateZ: rotZ,
          y: prox * -20,
          z,
          scale: sc,
          opacity: op,
          filter: `blur(${blurAmt.toFixed(1)}px) saturate(${sat})`,
          zIndex: Math.round(prox * 12) + 1,
        })
      })

      /* Move ambient spotlight to the most-centered card */
      const light = outerRef.current?.querySelector('.svc-scene-light')
      if (light && cards[activeIdx]) {
        const cr = cards[activeIdx].getBoundingClientRect()
        const sr = outerRef.current.getBoundingClientRect()
        gsap.to(light, {
          x: cr.left - sr.left + cr.width / 2,
          y: cr.top  - sr.top  + cr.height * 0.38,
          duration: 0.65,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    const horizontal = gsap.to(track, {
      x: () => -getTravel(),
      ease: 'none',
      scrollTrigger: {
        trigger: outerRef.current,
        pin: true,
        start: 'top top',
        /* pin range = full card-to-card travel so each snap step
           maps to exactly one card-width of horizontal movement     */
        end: () => `+=${getTravel() * 1.35}`,
        scrub: 0.9,
        /* ── SNAP: lock each card to viewport center ── */
        snap: {
          snapTo: 1 / (cards.length - 1),   // even steps: 0, 0.2, 0.4 …
          duration: { min: 0.35, max: 0.65 },
          ease: 'power2.inOut',
          inertia: false,
        },
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
          if (headerRef.current) {
            const fade = self.progress > 0.82 ? gsap.utils.mapRange(0.82, 1, 1, 0.38, self.progress) : 1
            headerRef.current.style.setProperty('--svc-header-opacity', fade)
          }
          requestAnimationFrame(stageCards)
        },
        onRefresh: () => { setCenterPadding(); stageCards() },
      },
    })

    gsap.fromTo(cards,
      { opacity: 0, z: -380, y: 80, rotateX: -38, rotateY: 12, scale: 0.70, filter: 'blur(24px)' },
      {
        opacity: 1,
        z: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        filter: 'blur(0px)',
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top 80%',
          end: 'top 5%',
          scrub: 1.2,
        },
      }
    )

    cards.forEach((card) => {
      gsap.to(card.querySelector('.svc-object-core'), {
        rotateY: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontal,
          start: 'left right',
          end: 'right left',
          scrub: 1.6,
        },
      })
    })

    stageCards()
  }, { scope: outerRef })

  return (
    <section ref={outerRef} className="svc-cinema-section">
      <div className="svc-cinema-bg" />
      <div className="svc-scene-light" />
      <div ref={headerRef} className="container svc-cinema-header">
        <div className="sec-header">
          <div className="t-label" style={{ marginBottom: 16 }}>What We Offer</div>
          <h2 className="t-title" style={{ color: 'var(--white)', maxWidth: 620 }}>
            Our Signature <span className="t-gold-em">Services</span>
          </h2>
          <div className="sec-divider" />
          <p className="t-body t-dim" style={{ maxWidth: 520 }}>
            Slide through a sculptural menu of beauty rituals, each crafted as its own little object of desire.
          </p>
        </div>
        <div className="svc-cinema-rail" aria-hidden="true">
          <span>01</span>
          <div><i ref={progressRef} /></div>
          <span>06</span>
        </div>
      </div>

      <div className="svc-viewport">
        <div ref={trackRef} className="svc-track">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="svc-cine-card"
              style={{ '--svc-bg': s.bg, '--svc-accent': s.accent }}
            >
              <div className="svc-church-rays" />
              <div className="svc-glass-border" />
              <div className="svc-card-depth" />
              <div className="svc-card-ghost-num">{String(i + 1).padStart(2, '0')}</div>
              {s.img ? (
                <div className="svc-photo-panel">
                  <img src={s.img} alt={s.title} className="svc-photo-img" />
                  <div className="svc-photo-fade" />
                  <div className="svc-photo-glow" />
                  <div className="svc-photo-leak" />
                  <div className="svc-photo-shimmer" />
                  <div className="svc-photo-grain" />
                </div>
              ) : (
                <div className="svc-object-stage">
                  <ServiceObject kind={s.kind} />
                </div>
              )}
              <div className="svc-copy">
                <div className="svc-index">Service {String(i + 1).padStart(2, '0')}</div>
                <h3>{s.title}</h3>
                <p>{s.sub}</p>
              </div>
              <div className="svc-card-footer">
                <span>From {s.from}</span>
                <Link to="/booking" className="btn btn-gold">Book</Link>
              </div>
            </div>
          ))}
          <div className="svc-track-spacer" />
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const ref    = useRef(null)
  const imgRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(imgRef.current,
      { y: 60 },
      { y:-60, ease:'none', scrollTrigger:{ trigger:ref.current, start:'top bottom', end:'bottom top', scrub:1.5 } }
    )
    gsap.fromTo('.about-line',
      { opacity:0, x:-30 },
      { opacity:1, x:0, stagger:0.12, duration:0.8, ease:'power3.out',
        scrollTrigger:{ trigger:ref.current, scrub:1.2, start:'top 82%', end:'top 18%' } }
    )
    // Parallax on the year badge
    gsap.to('.about-year-badge', {
      y: -60,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background:'var(--near-black)', overflow:'hidden' }}>
      <div className="container">
        <div className="story-layout" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          <div className="story-portrait-shell">
            <div ref={imgRef} className="story-portrait-parallax">
              <div style={{ width:'100%', aspectRatio:'3/4', background:'linear-gradient(160deg,#F0D5DB 0%,#A87AA8 50%,#3D1A3A 100%)', borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8rem', boxShadow:'0 40px 80px rgba(61,26,58,0.2)' }}>✨</div>
              <div className="story-portrait-card">
                <img src={storyPortrait} alt="Glamore studio story portrait" className="story-portrait-img" />
                <div className="story-portrait-vignette" />
                <div className="story-portrait-shine" />
                <div className="story-signature">
                  <span>Glamore</span>
                  <small>Atelier Story</small>
                </div>
              </div>
              <div className="story-orbit story-orbit-a" />
              <div className="story-orbit story-orbit-b" />
              <div className="story-chip story-chip-left">
                <span>Since</span>
                <strong>2018</strong>
              </div>
              <div className="story-chip story-chip-right">
                <span>Made</span>
                <strong>Personal</strong>
              </div>
              <div className="about-year-badge story-year-badge" style={{ position:'absolute', bottom:32, right:-16, background:'rgba(201,169,110,0.1)', border:'1px solid var(--border-gold)', borderRadius:16, padding:'20px 24px', textAlign:'center', boxShadow:'0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:40, fontWeight:700, color:'var(--gold)', lineHeight:1 }}>8</div>
                <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-3)', marginTop:4 }}>Years of<br/>Excellence</div>
              </div>
            </div>
          </div>
          <div>
            <div className="about-line t-label" style={{ marginBottom:20 }}>Our Story</div>
            <h2 className="about-line t-title" style={{ color:'var(--white)', marginBottom:24 }}>
              Beauty Is Our <em style={{ color:'var(--gold)' }}>Passion</em>
            </h2>
            <div className="about-line sec-divider" />
            <p className="about-line t-body" style={{ color:'var(--text-2)', marginBottom:20 }}>
              Founded in 2018, Glamore was born from a simple belief — every person deserves to feel extraordinary. We built a studio where luxury meets artistry and every appointment is an experience, not just a service.
            </p>
            <p className="about-line t-body" style={{ color:'var(--text-2)', marginBottom:40 }}>
              Our team of certified specialists combines technical mastery with genuine passion. From your first consultation to your final look, every detail reflects your unique beauty.
            </p>
            <div className="about-line" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:40 }}>
              {[
                { icon:'🏆', title:'Award-Winning', sub:'Stylists' },
                { icon:'🌿', title:'Premium Products', sub:'Cruelty-free' },
                { icon:'✅', title:'Certified', sub:'Specialists' },
                { icon:'💎', title:'Luxury', sub:'Experience' },
              ].map(({ icon, title, sub }) => (
                <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(201,169,110,0.1)', border:'1px solid rgba(201,169,110,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>{title}</div>
                    <div style={{ fontSize:12, color:'var(--text-3)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="about-line btn btn-dark" style={{ display:'inline-flex' }}>Learn Our Story</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   WHY US
═══════════════════════════════════════════════════════════ */
function WhySection() {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.fromTo('.why-card',
      { opacity:0, y:60, scale:0.92 },
      { opacity:1, y:0, scale:1, stagger:0.12, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger:ref.current, scrub:1.1, start:'top 82%', end:'top 22%' } }
    )
  }, { scope: ref })

  const items = [
    { icon:'👁️', title:'Personalised Approach', body:'Every look is tailored to your features, lifestyle, and vision.' },
    { icon:'⭐', title:'Premium Products',       body:'Internationally acclaimed luxury beauty brands only.' },
    { icon:'🎓', title:'Expert Team',            body:'Certified specialists with advanced training.' },
    { icon:'✨', title:'Luxury Environment',     body:'A serene studio where you feel pampered from the moment you arrive.' },
  ]

  return (
    <section ref={ref} className="section" style={{ background:'#050208', position:'relative', overflow:'hidden' }}>
      {[{ top:'-30%',left:'-10%',size:500,color:'rgba(201,169,110,0.04)' },{ top:'60%',right:'-5%',size:400,color:'rgba(194,123,140,0.05)' }].map((o,i)=>(
        <div key={i} style={{ position:'absolute',borderRadius:'50%',width:o.size,height:o.size,top:o.top,left:o.left,right:o.right,background:`radial-gradient(circle,${o.color} 0%,transparent 70%)`,pointerEvents:'none' }} />
      ))}
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div className="sec-header center">
          <div className="t-label" style={{ color:'rgba(201,169,110,0.7)', marginBottom:16 }}>Why Glamore</div>
          <h2 className="t-title" style={{ color:'var(--white)' }}>The <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Glamore</em> Difference</h2>
          <div className="sec-divider" style={{ background:'linear-gradient(90deg,var(--gold),transparent)', margin:'20px auto 0' }} />
        </div>
        <div className="grid-4 why-grid">
          {items.map(({ title, body }, i) => {
            const marks = ['profile', 'drop', 'crest', 'atelier']
            const mark = marks[i] || 'profile'
            return (
            <div key={title} className="why-card premium-why-card" style={{ '--why-i': i }}>
              <div className={`why-mark why-mark-${mark}`} aria-hidden="true">
                <span className="why-mark-core" />
                <span className="why-mark-line why-mark-line-a" />
                <span className="why-mark-line why-mark-line-b" />
              </div>
              <h4>{title}</h4>
              <p>{body}</p>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════ */
const galleryItems = [
  { label:'Bridal Glam', sub:'Makeup & Hair', bg:'linear-gradient(160deg,#F0D5DB,#C27B8C,#4A2040)', tall:true },
  { label:'Balayage',    sub:'Hair Colour',   bg:'linear-gradient(135deg,#EDD9AD,#C9A96E,#9E7A3F)' },
  { label:'Nail Art',    sub:'Nail Design',   bg:'linear-gradient(135deg,#E8D5F0,#A87AA8,#3D1A3A)' },
  { label:'Evening Glam',sub:'Makeup',        bg:'linear-gradient(135deg,#FBF3E2,#C9A96E)', wide:true },
  { label:'Lash Extensions',sub:'Beauty Treatment',bg:'linear-gradient(160deg,#D5C0E8,#6B3265)', tall:true },
  { label:'Precision Cut',sub:'Hair Styling', bg:'linear-gradient(135deg,#C27B8C,#6B3265)' },
  { label:'Luxury Mani', sub:'Nail Services', bg:'linear-gradient(135deg,#EDD9AD,#C27B8C)', wide:true },
  { label:'Studio Session',sub:'Premium Package',bg:'linear-gradient(135deg,#3D1A3A,#C9A96E)' },
]

function GallerySection() {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.fromTo('.gallery-card',
      { opacity:0, y:50, scale:0.94 },
      { opacity:1, y:0, scale:1, stagger:{ amount:0.6, from:'start' }, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger:ref.current, scrub:1.0, start:'top 82%', end:'top 15%' } }
    )
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background:'var(--near-black)' }}>
      <div className="container-wide">
        <div className="sec-header center" style={{ paddingLeft:0 }}>
          <div className="t-label" style={{ marginBottom:16 }}>Our Work</div>
          <h2 className="t-title" style={{ color:'var(--white)' }}>Beauty <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Portfolio</em></h2>
          <div className="sec-divider" style={{ margin:'20px auto 0' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gridAutoRows:240, gap:12 }}>
          {galleryItems.map(({ label, sub, bg, tall, wide }, i) => (
            <div key={i} className="gallery-card" style={{ gridRow:tall?'span 2':'span 1', gridColumn:wide?'span 2':'span 1', borderRadius:16, overflow:'hidden', position:'relative', cursor:'pointer' }}>
              <div style={{ width:'100%', height:'100%', background:bg, transition:'transform 600ms var(--ease-out)' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)', opacity:0, transition:'opacity 300ms', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:20 }}
                onMouseEnter={e=>e.currentTarget.style.opacity='1'}
                onMouseLeave={e=>e.currentTarget.style.opacity='0'}
              >
                <div style={{ fontSize:14, fontWeight:700, color:'var(--white)' }}>{label}</div>
                <div style={{ fontSize:12, color:'var(--gold-light)', marginTop:3 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:60 }}>
          <Link to="/gallery" className="btn btn-outline">View Full Gallery</Link>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════ */
const testimonials = [
  { text:'"Glamore completely transformed my look for my wedding day. Every guest complimented how radiant I looked. The team went above and beyond in every way."', name:'Sophia Williams', role:'Bride · June 2025' },
  { text:'"The nail art was absolutely stunning. I\'ve been to many salons but Glamore\'s attention to detail is unmatched. My forever salon!"', name:'Isabella Chen', role:'Regular Client' },
  { text:'"My balayage came out exactly as I envisioned — actually even better! The stylist really listened and delivered perfectly."', name:'Amara Johnson', role:'Hair Colour Client' },
  { text:'"The studio is gorgeous, the team is warm and professional. My lash extensions are everything. I feel like a new person every time."', name:'Priya Sharma', role:'Beauty Treatment Client' },
]

function TestimonialsSection() {
  const ref          = useRef(null)
  const track        = useRef(null)
  const timerRef     = useRef(null)
  const touchStartX  = useRef(null)
  const [current, setCurrent] = useState(0)

  // 4 testimonials shown 2-per-row → 3 meaningful positions (0,1,2)
  const maxIdx = testimonials.length - 2   // = 2

  const getSlideW = useCallback(() => {
    const s = track.current?.querySelector('.testimonial-slide')
    return s ? s.offsetWidth + 24 : 0
  }, [])

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, maxIdx))
    setCurrent(clamped)
    const w = getSlideW()
    if (w) gsap.to(track.current, { x: -clamped * w, duration: 0.9, ease: 'power3.inOut' })
  }, [maxIdx, getSlideW])

  const resetAutoplay = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = c >= maxIdx ? 0 : c + 1
        const w = getSlideW()
        if (w && track.current) gsap.to(track.current, { x: -next * w, duration: 0.9, ease: 'power3.inOut' })
        return next
      })
    }, 5000)
  }, [maxIdx, getSlideW])

  useEffect(() => {
    resetAutoplay()
    return () => clearInterval(timerRef.current)
  }, [resetAutoplay])

  const navigate = useCallback((dir) => {
    goTo(current + dir)
    resetAutoplay()
  }, [current, goTo, resetAutoplay])

  /* ── Touch / swipe handlers ── */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 48) navigate(delta > 0 ? 1 : -1)
    touchStartX.current = null
  }

  useGSAP(() => {
    gsap.fromTo('.testimonial-slide',
      { opacity:0, y:40 },
      { opacity:1, y:0, stagger:0.15, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger:ref.current, scrub:1.0, start:'top 82%', end:'top 35%' } }
    )
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background:'#080508', overflow:'hidden' }}>
      <div className="container">
        <div className="sec-header center">
          <div className="t-label" style={{ marginBottom:16 }}>Client Love</div>
          <h2 className="t-title" style={{ color:'var(--white)' }}>What Our <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Clients Say</em></h2>
          <div className="sec-divider" style={{ margin:'20px auto 0' }} />
        </div>

        {/* Swipe-enabled track */}
        <div
          style={{ overflow:'hidden', touchAction:'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div ref={track} style={{ display:'flex', gap:24, willChange:'transform' }}>
            {testimonials.map(({ text, name, role }, i) => (
              <div key={i} className="testimonial-slide" style={{ minWidth:'calc(50% - 12px)', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'44px 40px', flexShrink:0, position:'relative' }}>
                <div style={{ position:'absolute', top:24, right:32, fontFamily:'var(--font-display)', fontSize:'8rem', lineHeight:1, color:'rgba(201,169,110,0.08)', fontWeight:700, pointerEvents:'none' }}>"</div>
                <div style={{ color:'var(--gold)', fontSize:13, marginBottom:20, letterSpacing:2 }}>{'★★★★★'}</div>
                <p style={{ fontFamily:'var(--font-accent)', fontStyle:'italic', fontSize:'clamp(16px,1.5vw,20px)', color:'var(--text-1)', lineHeight:1.7, marginBottom:28 }}>{text}</p>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,var(--rose),var(--plum-mid))', border:'2px solid rgba(201,169,110,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>✨</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>{name}</div>
                    <div style={{ fontSize:12, color:'var(--text-3)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="testimonial-controls">
          <button
            className="testimonial-nav-btn"
            onClick={() => navigate(-1)}
            disabled={current === 0}
            aria-label="Previous"
          >←</button>

          <div className="testimonial-dots">
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${current === i ? ' active' : ''}`}
                onClick={() => { goTo(i); resetAutoplay() }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="testimonial-nav-btn"
            onClick={() => navigate(1)}
            disabled={current >= maxIdx}
            aria-label="Next"
          >→</button>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   PRICING
═══════════════════════════════════════════════════════════ */
const plans = [
  { tier:'Classic',   name:'The Essentials', price:89,  period:'/session', desc:'Perfect for everyday beauty',         features:['Style Consultation','One Service Treatment','Styling Tips','Welcome Beverage'], featured:false },
  { tier:'Signature', name:'The Glamore',    price:199, period:'/session', desc:'Our signature glam experience',        features:['Full Style Consultation','Two Premium Services','Hair or Nail Treatment','Luxury Refreshments','After-Care Kit'], featured:true },
  { tier:'Premium',   name:'The Luxe Day',   price:449, period:'/day',     desc:'The ultimate all-day experience',      features:['Private Studio Suite','All Services Included','Dedicated Team','Gourmet Dining','Luxury Gift Set','Photo Studio'], featured:false },
]

function PricingSection() {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.fromTo('.pricing-card-inner',
      { opacity:0, y:50 },
      { opacity:1, y:0, stagger:0.15, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger:ref.current, scrub:1.2, start:'top 82%', end:'top 22%' } }
    )
  }, { scope: ref })

  return (
    <section ref={ref} className="section" style={{ background:'var(--near-black)' }}>
      <div className="container">
        <div className="sec-header center">
          <div className="t-label" style={{ color:'var(--gold)', marginBottom:16 }}>Investment</div>
          <h2 className="t-title" style={{ color:'var(--white)' }}>Our <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Packages</em></h2>
          <div className="sec-divider" style={{ background:'linear-gradient(90deg,var(--gold),transparent)', margin:'20px auto 0' }} />
        </div>
        <div className="grid-3" style={{ alignItems:'stretch' }}>
          {plans.map(({ tier, name, price, period, desc, features, featured }) => (
            <div key={name} className="pricing-card-inner" style={{ background:featured?'linear-gradient(160deg,var(--plum) 0%,#5C2456 100%)':'rgba(14,8,6,0.85)', border:featured?'1px solid rgba(201,169,110,0.3)':'1px solid rgba(201,169,110,0.12)', borderRadius:24, padding:'44px 36px', transform:featured?'scale(1.04)':'scale(1)', boxShadow:featured?'0 40px 80px rgba(61,26,58,0.3)':'0 4px 20px rgba(0,0,0,0.06)', position:'relative' }}>
              {featured && <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(90deg,var(--gold),#9E7A3F)', color:'var(--black)', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'5px 18px', borderRadius:100, whiteSpace:'nowrap' }}>Most Popular</div>}
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>{tier}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:featured?'var(--white)':'var(--text-1)', marginBottom:6 }}>{name}</div>
              <div style={{ fontSize:13, color:featured?'rgba(255,255,255,0.5)':'var(--text-2)', marginBottom:28 }}>{desc}</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${featured?'rgba(255,255,255,0.08)':'rgba(201,169,110,0.1)'}` }}>
                <span style={{ fontSize:18, fontWeight:700, color:'var(--gold)', lineHeight:1.6 }}>$</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:52, fontWeight:700, color:'var(--white)', lineHeight:1 }}>{price}</span>
                <span style={{ fontSize:13, color:featured?'rgba(255,255,255,0.4)':'var(--text-2)', marginBottom:6 }}>{period}</span>
              </div>
              <ul style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
                {features.map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:featured?'rgba(255,255,255,0.75)':'var(--text-2)' }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:featured?'rgba(201,169,110,0.15)':'rgba(201,169,110,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'var(--gold)', flexShrink:0 }}>✓</div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/booking" className={`btn ${featured?'btn-gold':'btn-dark'}`} style={{ width:'100%', justifyContent:'center' }}>Book Now</Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', marginTop:36, fontSize:13, color:'var(--text-2)' }}>
          All packages include a complimentary consultation · <Link to="/pricing" style={{ color:'var(--gold)' }}>View full pricing →</Link>
        </p>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   CTA
═══════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.fromTo('.cta-el',
      { opacity:0, y:50 },
      { opacity:1, y:0, stagger:0.12, duration:1, ease:'power3.out',
        scrollTrigger:{ trigger:ref.current, scrub:1.5, start:'top 82%', end:'top 35%' } }
    )
  }, { scope: ref })

  return (
    <section ref={ref} className="section-lg" style={{ background:'var(--black)', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(61,26,58,0.6) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div className="cta-el t-label" style={{ marginBottom:20 }}>Limited Appointments Available</div>
        <h2 className="cta-el" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(40px,7vw,96px)', fontWeight:700, lineHeight:0.95, letterSpacing:'-0.03em', color:'var(--white)', marginBottom:28 }}>
          Ready to Be<br/><em style={{ color:'var(--gold)', fontStyle:'italic' }}>Transformed?</em>
        </h2>
        <p className="cta-el" style={{ fontSize:'clamp(16px,1.5vw,20px)', color:'var(--text-2)', marginBottom:48, maxWidth:500, marginLeft:'auto', marginRight:'auto' }}>
          Book your appointment today and experience the Glamore difference. Your most beautiful self is waiting.
        </p>
        <div className="cta-el" style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/booking" className="btn btn-gold" style={{ fontSize:14, padding:'16px 40px', minHeight:56 }}>Book Your Session</Link>
          <Link to="/contact" className="btn btn-outline" style={{ fontSize:14, padding:'16px 40px', minHeight:56 }}>Get In Touch</Link>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const homeRef = useRef(null)

  // ── Magnetic buttons + scroll-line diamond
  useEffect(() => {
    // Magnetic pull: every .btn subtly attracts toward the cursor
    const onMove = (e) => {
      const btns = document.querySelectorAll('.btn')
      btns.forEach(btn => {
        const r    = btn.getBoundingClientRect()
        const cx   = r.left + r.width  / 2
        const cy   = r.top  + r.height / 2
        const dx   = e.clientX - cx
        const dy   = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        const radius = Math.max(r.width, r.height) * 1.9
        if (dist < radius) {
          const pull = Math.pow(1 - dist / radius, 2) * 0.34
          gsap.to(btn, { x: dx * pull, y: dy * pull, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
        } else {
          gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
        }
      })
    }

    // Scroll diamond indicator
    const diamond = document.querySelector('.cinema-scroll-diamond')
    const onScroll = () => {
      if (!diamond) return
      const total = document.body.scrollHeight - window.innerHeight
      const pct   = total > 0 ? Math.min(window.scrollY / total, 1) : 0
      diamond.style.top = `${pct * 100}%`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll',    onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll',    onScroll)
    }
  }, [])

  useGSAP(() => {
    const root = homeRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const scenes = gsap.utils
        .toArray(':scope > section, :scope > .numbers-strip', root)
        .filter(scene => !scene.classList.contains('premium-hero') && !scene.querySelector('.svc-card, .svc-cine-card'))

      scenes.forEach((scene, index) => {
        scene.classList.add('home-cinema-scene')

        // Trigger gold top-divider line draw-in
        ScrollTrigger.create({
          trigger: scene,
          start: 'top 86%',
          onEnter:     () => scene.classList.add('in-view'),
          onLeaveBack: () => scene.classList.remove('in-view'),
        })

        gsap.fromTo(scene,
          {
            autoAlpha: 0.72,
            y: 72,
            scale: 0.985,
            filter: 'blur(10px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: scene,
              start: 'top 88%',
              end: 'top 42%',
              scrub: 1.15,
            },
          }
        )

        gsap.to(scene, {
          y: index % 2 === 0 ? -26 : -14,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'center center',
            end: 'bottom top',
            scrub: 1.6,
          },
        })

        const header = scene.querySelector('.sec-header, .intro-label, .manifesto-tag')
        if (header) {
          gsap.fromTo(header,
            { y: 42, opacity: 0, filter: 'blur(8px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              scrollTrigger: {
                trigger: scene,
                start: 'top 78%',
                end: 'top 46%',
                scrub: 1,
              },
            }
          )
        }
      })

      gsap.to('.home-cinema-atmosphere', {
        '--cinema-x': '72%',
        '--cinema-y': '34%',
        '--cinema-tilt': '18deg',
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4,
        },
      })

      gsap.fromTo('.cinema-scroll-line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )
    }, root)

    return () => ctx.revert()
  }, { scope: homeRef })

  return (
    <motion.main
      ref={homeRef}
      className="home-cinema"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CinematicSplash />
      <LuxuryCursor />
      <AmbientGoldDust />
      <TextScrambleEffect />
      <div className="home-cinema-atmosphere" aria-hidden="true" />
      <div className="cinema-scroll-line" aria-hidden="true">
        <div className="cinema-scroll-line-fill" />
        <div className="cinema-scroll-diamond" aria-hidden="true" />
      </div>
      <HeroSection />
      <LuxuryMarquee />
      <IntroSection />
      <SignatureServicesSection />
      <NumbersStrip />
      <AboutSection />
      <WhySection />
      <GallerySection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </motion.main>
  )
}
