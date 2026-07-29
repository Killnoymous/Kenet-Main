import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Sparkles, Send, ArrowRight } from 'lucide-react';

export default function ProjectFormModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'WebGL / Interactive',
    budget: '₹1.5 Lakhs - ₹3 Lakhs',
    details: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      document.body.style.overflow = 'hidden';
      
      // Animations
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      
      gsap.fromTo(modalRef.current, 
        { y: 60, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.05, ease: 'power4.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.96,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: onClose
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate premium submission experience
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Success message transition
      gsap.fromTo('.success-el', 
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl px-4 py-8 md:py-16"
      onClick={handleClose}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl bg-[#080808]/90 border border-white/10 rounded-[32px] p-8 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[92vh] group/modal"
        onClick={(e) => e.stopPropagation()}
        style={{ backdropFilter: 'blur(30px)' }}
      >
        {/* Premium Ambient Corner Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-500/10 blur-[130px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-500/5 blur-[130px] pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 p-3 rounded-full border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white transition-all duration-300 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-orange-400 font-mono text-[10px] tracking-[0.45em] uppercase mb-4">
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>Start a project</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-medium tracking-tightest leading-tight">
                Let’s create something <span className="font-serif-i text-gradient">unforgettable</span>.
              </h3>
              <p className="mt-4 text-white/50 text-base max-w-2xl leading-relaxed">
                Have an idea that moves the needle? Fill in the details below, and our engineering team will get back to you within 24 hours.
              </p>
            </div>

             <div className="grid md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }}
                  className="w-full border border-white/10 hover:border-white/20 focus:border-orange-400/80 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none transition-all duration-300"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }}
                  className="w-full border border-white/10 hover:border-white/20 focus:border-orange-400/80 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Project Type Select */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">What are we building?</label>
                <select 
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }}
                  className="w-full border border-white/10 focus:border-orange-400/80 rounded-2xl px-6 py-4 text-white outline-none transition-all duration-300 cursor-pointer"
                >
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="WebGL / Interactive">WebGL / Interactive Experience</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="3D Product Configurator">3D Product Configurator</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="Brand Identity & Motion">Brand Identity & Motion</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="Generative Art / AI Systems">Generative Art / AI Systems</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="Immersive Web/App Design">Immersive Web/App Design</option>
                </select>
              </div>

               {/* Budget Range Selector */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">Budget Range</label>
                <select 
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }}
                  className="w-full border border-white/10 focus:border-orange-400/80 rounded-2xl px-6 py-4 text-white outline-none transition-all duration-300 cursor-pointer"
                >
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="₹1.5 Lakhs - ₹3 Lakhs">₹1,50,000 – ₹3,00,000 (1.5L - 3L)</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="₹3 Lakhs - ₹6 Lakhs">₹3,00,000 – ₹6,00,000 (3L - 6L)</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="₹6 Lakhs - ₹10 Lakhs">₹6,00,000 – ₹10,00,000 (6L - 10L)</option>
                  <option style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }} value="₹10 Lakhs+">₹10,00,000+ (10L+)</option>
                </select>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">Tell us about the project</label>
              <textarea 
                required
                rows="5"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Give us a brief description of what you have in mind, objectives, and parameters..."
                style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }}
                className="w-full border border-white/10 hover:border-white/20 focus:border-orange-400/80 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none transition-all duration-300 resize-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-6 pt-4 border-t border-white/5">
              <button 
                type="button"
                onClick={handleClose}
                className="px-6 py-4 text-xs font-mono tracking-widest text-white/50 hover:text-white transition-colors uppercase"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-3 bg-white text-black hover:bg-orange-400 hover:text-black transition-all duration-500 font-mono tracking-widest uppercase px-10 py-4.5 rounded-full text-xs font-bold disabled:opacity-55 shadow-[0_4px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_30px_rgba(255,139,74,0.3)] min-w-[200px]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <span>Send Brief</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-8 relative z-10">
            <div className="success-el w-20 h-20 bg-gradient-to-tr from-orange-400 to-rose-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,139,74,0.45)]">
              <Send className="w-8 h-8 text-black" />
            </div>
            
            <div className="space-y-3 max-w-lg">
              <h4 className="success-el text-3xl font-medium tracking-tight">Proposal Compiled Successfully!</h4>
              <p className="success-el text-white/60 text-base leading-relaxed">
                Thank you for reaching out, <span className="text-white font-medium">{formData.name}</span>. We've received your project parameters and our engineering team will connect with you shortly.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="success-el flex items-center gap-2 border border-white/10 hover:border-white/30 text-xs font-mono tracking-widest uppercase px-8 py-4.5 rounded-full text-white/80 hover:text-white transition-all mt-6 bg-white/[0.02]"
            >
              <span>Back to site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
