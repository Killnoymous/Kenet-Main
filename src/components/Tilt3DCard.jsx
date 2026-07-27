import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Tilt3DCard({ item, index = 0 }) {
  const ref = useRef(null);
  const inner = useRef(null);
  const glow = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !inner.current) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const rx = -y * 12;
    const ry = x * 14;
    inner.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (glow.current) {
      glow.current.style.background = `radial-gradient(500px 320px at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,138,74,0.35), transparent 60%)`;
    }
    // parallax layers
    el.querySelectorAll('[data-depth]').forEach((n) => {
      const d = parseFloat(n.dataset.depth || 0);
      n.style.transform = `translate3d(${x * d * 30}px, ${y * d * 30}px, ${d * 40}px)`;
    });
  };

  const onLeave = () => {
    if (inner.current) inner.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    if (glow.current) glow.current.style.background = 'transparent';
    ref.current?.querySelectorAll('[data-depth]').forEach((n) => {
      n.style.transform = 'translate3d(0,0,0)';
    });
  };

  return (
    <a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      href="#"
      data-cursor="hover"
      className="group shrink-0 w-[78vw] md:w-[46vw] h-[70vh] relative rounded-3xl overflow-hidden"
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        ref={inner}
        className="absolute inset-0 rounded-3xl overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-75 group-hover:opacity-95 transition-opacity duration-700`} />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-40"
          style={{
            background: 'radial-gradient(1200px 400px at 20% 10%, rgba(255,255,255,0.4), transparent 60%)'
          }}
        />
        <div
          data-depth="0.9"
          className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/20 blur-3xl transition-transform duration-300 ease-out"
        />
        <div
          data-depth="1.2"
          className="absolute bottom-10 left-6 w-40 h-40 rounded-full bg-orange-300/40 blur-2xl transition-transform duration-300 ease-out"
        />
        <div
          data-depth="1.6"
          className="absolute top-1/2 right-8 -translate-y-1/2 transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          <div
            className="relative w-40 h-40"
            style={{
              transformStyle: 'preserve-3d',
              animation: `spin${index % 3} 14s linear infinite`
            }}
          >
            <div
              className="absolute inset-0 border border-white/50 rounded-3xl"
              style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}
            />
            <div
              className="absolute inset-2 border border-white/40 rounded-2xl"
              style={{ transform: 'rotateX(60deg) rotateZ(20deg)' }}
            />
            <div
              className="absolute inset-6 border border-white/30 rounded-xl"
              style={{ transform: 'rotateX(60deg) rotateZ(-15deg)' }}
            />
            <div
              className="absolute inset-10 border border-white/70 rounded-lg"
              style={{ transform: 'rotateX(60deg) rotateZ(70deg)' }}
            />
            <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_30px_#fff]" />
          </div>
        </div>
        <div
          data-depth="0.3"
          className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-between text-white transition-transform duration-300 ease-out"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em]">
            <span>{item.n} / {item.tag}</span>
            <span>{item.year}</span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/70">{item.client}</div>
            <div className="mt-3 text-3xl md:text-5xl font-medium tracking-tightest leading-[0.95] max-w-[80%]">
              {item.title}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/90 group-hover:gap-4 transition-all">
              View case study <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div ref={glow} className="absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
      </div>
    </a>
  );
}
