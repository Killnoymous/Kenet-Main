import React, { useRef } from 'react';

export default function MagneticButton({ children, className = '', onClick, strength = 0.35 }) {
  const ref = useRef(null);
  const inner = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (inner.current) {
      inner.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    }
  };

  const onLeave = () => {
    if (inner.current) {
      inner.current.style.transform = 'translate3d(0,0,0)';
    }
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`magnet-btn relative inline-flex items-center justify-center px-8 py-4 rounded-full transition-colors ${className}`}
    >
      <span
        ref={inner}
        className="relative z-10 inline-flex items-center gap-3 transition-transform duration-300 ease-out will-change-transform"
      >
        {children}
      </span>
    </button>
  );
}
