import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Sparkles, Send, ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function ProjectFormModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'WebGL / Interactive',
    budget: '$15k - $30k',
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
        { y: 50, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: onClose
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
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
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6"
      onClick={handleClose}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-black border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div>
              <div className="flex items-center gap-2 text-orange-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start your project</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight">
                Let’s create something <span className="font-serif-i text-gradient">unforgettable</span>.
              </h3>
              <p className="mt-2 text-white/50 text-sm">
                Fill in the details below, and our creative team will get back to you within 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono tracking-widest text-white/40 uppercase">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-400/80 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all placeholder:text-white/20"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono tracking-widest text-white/40 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-400/80 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Type Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono tracking-widest text-white/40 uppercase">What are we building?</label>
                <select 
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-white/10 focus:border-orange-400/80 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all appearance-none cursor-pointer text-white"
                >
                  <option value="WebGL / Interactive">WebGL / Interactive Experience</option>
                  <option value="3D Product Configurator">3D Product Configurator</option>
                  <option value="Brand Identity & Motion">Brand Identity & Motion</option>
                  <option value="Generative Art / AI Systems">Generative Art / AI Systems</option>
                  <option value="Immersive Web/App Design">Immersive Web/App Design</option>
                </select>
              </div>

              {/* Budget Range Selector */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono tracking-widest text-white/40 uppercase">Budget Range</label>
                <select 
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-white/10 focus:border-orange-400/80 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all appearance-none cursor-pointer text-white"
                >
                  <option value="$15k - $30k">$15,000 – $30,000</option>
                  <option value="$30k - $60k">$30,000 – $60,000</option>
                  <option value="$60k - $100k">$60,000 – $100,000</option>
                  <option value="$100k+">$100,000+</option>
                </select>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono tracking-widest text-white/40 uppercase">Tell us about the project</label>
              <textarea 
                required
                rows="4"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Give us a brief description of what you have in mind..."
                className="w-full bg-white/5 border border-white/10 focus:border-orange-400/80 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all placeholder:text-white/20 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <button 
                type="button"
                onClick={handleClose}
                className="px-6 py-3.5 text-sm font-mono text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-white text-black hover:bg-orange-400 transition-colors duration-300 font-medium px-8 py-3.5 rounded-full text-sm disabled:opacity-55"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <span>Send Proposal</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="success-el w-16 h-16 bg-gradient-to-tr from-orange-400 to-rose-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,139,74,0.4)]">
              <Send className="w-6 h-6 text-black" />
            </div>
            
            <div className="space-y-2 max-w-md">
              <h4 className="success-el text-2xl font-medium">Proposal Compiled Successfully!</h4>
              <p className="success-el text-white/60 text-sm">
                Thank you for reaching out, <span className="text-white font-medium">{formData.name}</span>. We've received your project details and will connect with you shortly.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="success-el flex items-center gap-2 border border-white/10 hover:border-white/30 text-sm font-mono px-6 py-3.5 rounded-full text-white/80 hover:text-white transition-all mt-4"
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
