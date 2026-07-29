import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';
import SmoothScroll from './components/SmoothScroll';
import MagneticButton from './components/MagneticButton';
import Tilt3DCard from './components/Tilt3DCard';
import HeroScene from './components/webgl/HeroScene';
import ProjectFormModal from './components/ProjectFormModal';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const rootRef = useRef(null);

  // Loader
  useEffect(() => {
    let p = 0;
    const i = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(i);
        setTimeout(() => setLoaded(true), 350);
      }
      setProgress(Math.floor(p));
    }, 90);
    return () => clearInterval(i);
  }, []);

  // GSAP scroll-driven storytelling
  useEffect(() => {
    if (!loaded) return;
    gsap.registerPlugin(ScrollTrigger);

    // Sync ScrollTrigger with Lenis
    const lenis = window.__lenis;
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
    
    const tick = (time) => {
      if (lenis) lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero text reveal
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          yPercent: 110,
          duration: 1.2,
          ease: 'power4.out',
          delay: parseFloat(el.dataset.delay || 0)
        });
      });

      // Section headings
      gsap.utils.toArray('[data-fade]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          }
        });
      });

      // Horizontal work scroll
      const worksTrack = document.querySelector('#works-track');
      const worksSection = document.querySelector('#works');
      if (worksTrack && worksSection) {
        const distance = worksTrack.scrollWidth - window.innerWidth;
        gsap.to(worksTrack, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: worksSection,
            start: 'top top',
            end: () => `+=${distance}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }

      // Manifesto word-by-word
      const words = document.querySelectorAll('#manifesto .word');
      if (words.length) {
        gsap.fromTo(words, {
          opacity: 0.12
        }, {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: '#manifesto',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 1
          }
        });
      }
    }, rootRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
    };
  }, [loaded]);

  const works = [
    {
      n: '01',
      tag: 'BRAND / WEBGL',
      title: 'AURORA — Interactive Brand Universe',
      client: 'Aurora Labs',
      year: '2025',
      color: 'from-orange-400/70 to-rose-500/40'
    },
    {
      n: '02',
      tag: 'CINEMATIC / SHADERS',
      title: 'MERIDIAN — Real-time Concert Visuals',
      client: 'Meridian Studio',
      year: '2025',
      color: 'from-sky-400/70 to-indigo-500/40'
    },
    {
      n: '03',
      tag: 'PRODUCT / 3D',
      title: 'HELIX — Configurator & Storytelling',
      client: 'Helix Motors',
      year: '2024',
      color: 'from-emerald-400/70 to-teal-500/40'
    },
    {
      n: '04',
      tag: 'ART / GENERATIVE',
      title: 'NOX — Generative Poster Machine',
      client: 'Nox Editions',
      year: '2024',
      color: 'from-violet-400/70 to-fuchsia-500/40'
    },
    {
      n: '05',
      tag: 'IMMERSIVE / XR',
      title: 'ORBIT — Spatial Retail Experience',
      client: 'Orbit Group',
      year: '2024',
      color: 'from-amber-300/70 to-orange-500/40'
    }
  ];

  const manifesto = 'We design cinematic digital worlds where light, motion and code collide. Every pixel is composed with intention — every frame, a moment worth remembering.';

  return (
    <div ref={rootRef} className="noise relative min-h-screen bg-[#050505] text-white">
      <SmoothScroll />
      
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="font-mono text-xs tracking-[0.4em] text-white/60 mb-6">INITIALIZING SCENE</div>
        <div className="font-serif-i text-6xl md:text-8xl text-gradient">
          {progress}<span className="text-white/40">%</span>
        </div>
        <div className="mt-8 h-px w-64 bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-white" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <HeroScene />

      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-6 md:px-10 py-6">
          <a href="#" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_18px_#ff8b4a]"></span>
            <span className="font-mono text-xs tracking-[0.35em] text-white/90">NOCTURNE / ⌬</span>
          </a>
          <nav className="hidden md:flex glass rounded-full px-2 py-2">
            {['Index', 'Work', 'Studio', 'Journal', 'Contact'].map((l, idx) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="relative px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <span className="font-mono text-[10px] mr-1 text-white/40">0{idx + 1}</span>
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex font-mono text-[10px] tracking-widest text-white/50">LDN · 51.50°N</div>
            <MagneticButton 
              onClick={() => setModalOpen(true)}
              className="bg-white text-black text-sm font-medium"
            >
              <span>Start a project</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex flex-col justify-end z-10 px-6 md:px-10 pb-20 pt-40">
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 vtext font-mono text-[10px] tracking-[0.4em] text-white/40">
          NOCTURNE STUDIO / SHOWREEL 2025 — SCROLL TO EXPLORE
        </div>
        <div className="max-w-[1500px] mx-auto w-full">
          <div className="reveal-mask">
            <div data-reveal className="font-mono text-xs tracking-[0.4em] text-white/60">
              ◆ INDEPENDENT IMMERSIVE STUDIO — EST. 2019
            </div>
          </div>
          <h1 className="mt-8 md:mt-12 tracking-tightest leading-[0.86] font-medium">
            <span className="block text-[16vw] md:text-[13vw] reveal-mask">
              <span data-reveal data-delay="0.2" className="reveal-line">Worlds</span>
            </span>
            <span className="block text-[16vw] md:text-[13vw] reveal-mask">
              <span data-reveal data-delay="0.35" className="reveal-line">
                <span className="font-serif-i text-gradient">between</span> light
              </span>
            </span>
            <span className="block text-[16vw] md:text-[13vw] reveal-mask">
              <span data-reveal data-delay="0.5" className="reveal-line">&amp; code.</span>
            </span>
          </h1>
          <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-6 md:gap-10 items-end">
            <div className="reveal-mask md:col-span-2">
              <p data-reveal data-delay="0.7" className="reveal-line text-lg md:text-xl text-white/70 max-w-2xl">
                Nocturne is an award-winning immersive studio designing cinematic WebGL experiences, generative brand universes and future-facing digital products for the world's most ambitious teams.
              </p>
            </div>
            <div className="flex md:justify-end gap-3">
              <MagneticButton className="glass-strong text-white text-sm">
                <Play className="w-4 h-4" />
                <span>Watch showreel</span>
              </MagneticButton>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 md:left-10 md:right-10 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-white/40">
          <span>[ 001 / INDEX ]</span>
          <span className="animate-pulse">↓ SCROLL</span>
          <span>60 FPS · WEBGL 2.0</span>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-black/50 backdrop-blur-xl py-6 overflow-hidden">
        <div className="marquee-track flex gap-16 whitespace-nowrap font-serif-i text-4xl md:text-6xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-16">
              {[
                'Cinematic Interaction', '★',
                'Generative Brand Systems', '✦',
                'Realtime 3D', '✧',
                'Shader-driven Storytelling', '⌬',
                'Immersive Product', '★'
              ].map((s, idx) => (
                <span key={idx} className={idx % 2 === 1 ? 'text-orange-400' : 'text-white/85'}>
                  {s}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="manifesto" className="relative z-10 py-40 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div data-fade className="font-mono text-xs tracking-[0.4em] text-white/50 mb-10">
            ◇ MANIFESTO / 002
          </div>
          <p className="text-3xl md:text-6xl leading-[1.15] font-medium tracking-tight">
            {manifesto.split(' ').map((w, idx) => (
              <span key={idx} className="word inline-block mr-3">{w}</span>
            ))}
          </p>
          <div className="mt-16 grid md:grid-cols-4 gap-6">
            {[
              { k: '48', l: 'Awards & recognitions' },
              { k: '120+', l: 'Shipped experiences' },
              { k: '9', l: 'Time zones covered' },
              { k: '∞', l: 'Curiosity index' }
            ].map((s) => (
              <div key={s.l} data-fade className="glass rounded-2xl p-6">
                <div className="font-serif-i text-6xl text-gradient">{s.k}</div>
                <div className="mt-2 text-sm text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-32 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1500px] mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div data-fade className="font-mono text-xs tracking-[0.4em] text-white/50 mb-6">
              ◇ CAPABILITIES / 002.5
            </div>
            <h2 data-fade className="text-5xl md:text-7xl font-medium tracking-tightest leading-[0.95]">
              A stack forged<br />for the <span className="font-serif-i text-gradient">impossible</span>.
            </h2>
            <p data-fade className="mt-6 text-white/60 max-w-lg">
              Real-time 3D, custom shaders, generative motion, spatial UI. We weld cinematic craft to production-grade engineering — no plug-ins, no shortcuts.
            </p>
            <div data-fade className="mt-8 flex flex-wrap gap-2">
              {[
                'WebGL / GLSL', 'React Three Fiber', 'Shaders', 'Generative AI',
                'Spatial UI', 'Realtime FX', 'Motion Design', 'AR / XR'
              ].map((t) => (
                <span key={t} className="glass rounded-full px-3 py-1 text-xs tracking-wider text-white/80">
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          <div data-fade className="relative h-[520px] flex items-center justify-center">
            <div className="relative w-[520px] h-[520px]" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 border border-white/10 rounded-full" style={{ transform: 'rotateX(70deg)' }}></div>
              <div className="absolute inset-8 border border-white/10 rounded-full" style={{ transform: 'rotateX(70deg) rotateZ(30deg)' }}></div>
              <div className="absolute inset-16 border border-orange-400/30 rounded-full" style={{ transform: 'rotateX(70deg) rotateZ(-15deg)' }}></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 shadow-[0_0_80px_#ff8b4a] float-y"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-orange-400/40 animate-ping opacity-30"></div>
              
              <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbitA 18s linear infinite' }}>
                <div className="glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/90 whitespace-nowrap">◆ SHADERS</div>
              </div>
              <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbitB 12s linear infinite', animationDelay: '-3s' }}>
                <div className="glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/90 whitespace-nowrap">◇ MOTION</div>
              </div>
              <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbitC 26s linear infinite', animationDelay: '-6s' }}>
                <div className="glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/90 whitespace-nowrap">✦ WEBGL</div>
              </div>
              <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbitA 22s linear infinite reverse', animationDelay: '-10s' }}>
                <div className="glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/90 whitespace-nowrap">★ GEN AI</div>
              </div>
              <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbitB 16s linear infinite reverse', animationDelay: '-8s' }}>
                <div className="glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/90 whitespace-nowrap">⊛ REALTIME</div>
              </div>
              <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbitC 30s linear infinite reverse', animationDelay: '-4s' }}>
                <div className="glass-strong rounded-full px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/90 whitespace-nowrap">✧ XR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="works" className="relative z-10 h-screen overflow-hidden bg-black">
        <div className="absolute top-10 left-6 md:left-10 z-10 font-mono text-xs tracking-[0.4em] text-white/50">◇ SELECTED WORK / 003</div>
        <div id="works-track" className="flex items-center h-screen pl-6 md:pl-10 pr-[10vw] gap-8 will-change-transform">
          <div className="shrink-0 w-[60vw] md:w-[40vw]">
            <h2 className="text-6xl md:text-8xl font-medium tracking-tightest leading-[0.9]">
              Selected<br /><span className="font-serif-i text-gradient">worlds.</span>
            </h2>
            <p className="mt-6 text-white/60 max-w-md">
              A small excerpt of recent flights — brand systems, product launches, and cultural experiments shipped with obsessive care.
            </p>
          </div>
          {works.map((w, idx) => (
            <Tilt3DCard key={w.n} item={w} index={idx} />
          ))}
          <div className="shrink-0 w-[40vw] flex items-center justify-center">
            <MagneticButton className="bg-white text-black text-sm font-medium">
              <span>Full archive</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      <section id="studio" className="relative z-10 py-40 px-6 md:px-10">
        <div className="max-w-[1500px] mx-auto">
          <div data-fade className="flex items-end justify-between mb-16">
            <div>
              <div className="font-mono text-xs tracking-[0.4em] text-white/50 mb-4">◇ APPROACH / 004</div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tightest">
                Craft, <span className="font-serif-i text-gradient">obsessively</span>.
              </h2>
            </div>
            <div className="hidden md:block text-sm text-white/60 max-w-sm">
              A senior team of designers, engineers and directors — small enough to move fast, sharp enough to ship the impossible.
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                n: 'I',
                t: 'Direction',
                d: 'Positioning, concept, art direction, story spine. We start where strategy meets emotion.',
                shape: 'cube'
              },
              {
                n: 'II',
                t: 'Design',
                d: 'Interface, motion, 3D. A single unified system across every surface, from hero to handheld.',
                shape: 'pyramid'
              },
              {
                n: 'III',
                t: 'Engineering',
                d: 'WebGL, shaders, real-time. Optimised for 60fps on the devices your audience actually uses.',
                shape: 'octa'
              }
            ].map((s, idx) => (
              <div
                key={s.n}
                data-fade
                className="glass rounded-3xl p-8 relative overflow-hidden group hover:border-orange-400/40 border border-white/10 transition-colors"
              >
                <div className="absolute -right-6 -top-10 font-serif-i text-[10rem] text-white/5 group-hover:text-orange-400/10 transition-colors">
                  {s.n}
                </div>
                <div
                  className="absolute right-6 top-6 w-24 h-24 opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ transformStyle: 'preserve-3d', perspective: '600px' }}
                >
                  <div
                    className="relative w-full h-full float-y"
                    style={{
                      transformStyle: 'preserve-3d',
                      animation: `spin${idx % 3} 12s linear infinite`
                    }}
                  >
                    {s.shape === 'cube' && (
                      <>
                        <div className="absolute inset-0 border border-orange-400/60 bg-orange-400/10" style={{ transform: 'translateZ(30px)' }}></div>
                        <div className="absolute inset-0 border border-orange-400/60 bg-orange-400/10" style={{ transform: 'translateZ(-30px) rotateY(180deg)' }}></div>
                        <div className="absolute inset-0 border border-orange-400/60 bg-orange-400/5" style={{ transform: 'rotateY(90deg) translateZ(30px)' }}></div>
                        <div className="absolute inset-0 border border-orange-400/60 bg-orange-400/5" style={{ transform: 'rotateY(-90deg) translateZ(30px)' }}></div>
                        <div className="absolute inset-0 border border-orange-400/60 bg-orange-400/5" style={{ transform: 'rotateX(90deg) translateZ(30px)' }}></div>
                        <div className="absolute inset-0 border border-orange-400/60 bg-orange-400/5" style={{ transform: 'rotateX(-90deg) translateZ(30px)' }}></div>
                      </>
                    )}
                    {s.shape === 'pyramid' && (
                      <>
                        <div className="absolute inset-0" style={{ transform: 'rotateX(60deg) rotateZ(0deg)' }}>
                          <div className="w-0 h-0 mx-auto border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-sky-400/60"></div>
                        </div>
                        <div className="absolute inset-0" style={{ transform: 'rotateX(60deg) rotateZ(120deg)' }}>
                          <div className="w-0 h-0 mx-auto border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-sky-400/40"></div>
                        </div>
                        <div className="absolute inset-0" style={{ transform: 'rotateX(60deg) rotateZ(240deg)' }}>
                          <div className="w-0 h-0 mx-auto border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-sky-400/50"></div>
                        </div>
                      </>
                    )}
                    {s.shape === 'octa' && (
                      <>
                        <div className="absolute inset-0 border-2 border-white/70 rotate-45" style={{ transform: 'rotateY(45deg)' }}></div>
                        <div className="absolute inset-0 border-2 border-white/50 rotate-45" style={{ transform: 'rotateY(-45deg)' }}></div>
                        <div className="absolute inset-4 border border-orange-400/70 rotate-45"></div>
                        <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_0_20px_#fff]"></div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="relative mt-24">
                  <div className="font-mono text-[10px] tracking-[0.4em] text-white/40">CHAPTER {s.n}</div>
                  <h3 className="mt-4 text-3xl font-medium">{s.t}</h3>
                  <p className="mt-4 text-white/60 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-10 py-40">
        <div className="max-w-5xl mx-auto text-center">
          <div data-fade className="font-mono text-xs tracking-[0.4em] text-white/50 mb-6 inline-flex items-center gap-2 justify-center">
            <Sparkles className="w-3 h-3" />
            BOOKING Q3 · Q4 2025
          </div>
          <h2 data-fade className="text-6xl md:text-[9vw] font-medium tracking-tightest leading-[0.9]">
            Let's build<br /><span className="font-serif-i text-gradient">something rare.</span>
          </h2>
          <p data-fade className="mt-8 text-lg text-white/60 max-w-2xl mx-auto">
            Have a project worth losing sleep over? Send a brief, a whisper, or a wild idea. We reply within 24 hours.
          </p>
          <div data-fade className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton 
              onClick={() => setModalOpen(true)}
              className="bg-orange-400 text-black text-base font-medium px-10 py-5"
            >
              <span>hello@nocturne.studio</span>
              <ArrowUpRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton 
              onClick={() => setModalOpen(true)}
              className="glass-strong text-white text-base"
            >
              <span>Book an intro call</span>
            </MagneticButton>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-12 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_18px_#ff8b4a]"></span>
              <span className="font-mono text-xs tracking-[0.35em]">NOCTURNE / ⌬</span>
            </div>
            <p className="mt-4 text-sm text-white/50 max-w-xs">
              An independent immersive studio between London and Tokyo. Working globally, remotely, obsessively.
            </p>
          </div>
          
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-3">SITEMAP</div>
            {['Index', 'Work', 'Studio', 'Journal', 'Contact'].map((l) => (
              <a key={l} href="#" className="block text-sm text-white/80 hover:text-orange-400 py-1">
                {l}
              </a>
            ))}
          </div>
          
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-3">ELSEWHERE</div>
            {['Instagram', 'Are.na', 'Vimeo', 'Read.cv', 'GitHub'].map((l) => (
              <a key={l} href="#" className="block text-sm text-white/80 hover:text-orange-400 py-1">
                {l}
              </a>
            ))}
          </div>
          
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-3">NEWSLETTER</div>
            <p className="text-sm text-white/60 mb-3">Signals from the studio. Once a month, no filler.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-orange-400"
              />
              <button type="submit" className="bg-white text-black rounded-full px-4 text-sm">→</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 py-6 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-2 font-mono text-[10px] tracking-[0.3em] text-white/40">
          <span>© 2025 NOCTURNE STUDIO — ALL RIGHTS RESERVED</span>
          <span>DESIGN & CODE, IN-HOUSE</span>
          <span>V1.0.0 · WEBGL 2.0</span>
        </div>
      </footer>
      <ProjectFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
