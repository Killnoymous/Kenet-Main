import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Sparkles, Send, MessageCircle, CheckCircle2, Zap, ArrowRight, PhoneCall } from 'lucide-react';

const WHATSAPP_NUMBER = '919906035405';
const DEFAULT_MESSAGE = 'Hey Kenet Technologies, can I get more info about this?';

const QUICK_OPTIONS = [
  { id: 'web', label: '🚀 Web / SaaS App', text: 'Hey Kenet Technologies, I want to build a modern Web / SaaS application. Can I get more info and pricing?' },
  { id: 'mobile', label: '📱 Mobile App (iOS/Android)', text: 'Hey Kenet Technologies, I am looking to develop a Mobile App. Can you share details and portfolio?' },
  { id: 'ai', label: '🤖 AI & Automation', text: 'Hey Kenet Technologies, I need custom AI solutions and automation for my business. Can we discuss?' },
  { id: 'ecommerce', label: '🛍️ E-commerce / WebGL', text: 'Hey Kenet Technologies, I need an interactive high-converting E-commerce / WebGL website. Let’s talk!' },
  { id: 'custom', label: '✨ General Consultation', text: 'Hey Kenet Technologies, can I get more info about your services and how we can work together?' },
];

export default function WhatsAppLeadModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(QUICK_OPTIONS[0].id);
  const [customMsg, setCustomMsg] = useState(DEFAULT_MESSAGE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      if (overlayRef.current && modalRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' }
        );

        gsap.fromTo(
          modalRef.current,
          { y: 50, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power4.out', delay: 0.05 }
        );
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (modalRef.current && overlayRef.current) {
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
    } else {
      onClose();
    }
  };

  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id);
    setCustomMsg(opt.text);
  };

  const getWhatsAppUrl = () => {
    const encodedText = encodeURIComponent(customMsg.trim() || DEFAULT_MESSAGE);
    return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodedText}&type=phone_number&app_absent=0`;
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    // Optional: close after brief delay or keep open
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl px-4 py-6 md:py-10"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#09090b]/95 border border-white/15 rounded-[28px] md:rounded-[36px] p-6 sm:p-8 md:p-10 shadow-[0_0_90px_rgba(0,0,0,0.9)] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ backdropFilter: 'blur(35px)' }}
      >
        {/* Glow Gradients */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-orange-500/15 blur-[100px] pointer-events-none" />

        {/* Top Header Row with Status & Close Button */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {/* Crisp WhatsApp Icon */}
                <svg className="w-6 h-6 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#09090b]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-wider text-white">KENET TECHNOLOGIES</span>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full">
                  VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Online now · Instant response</span>
              </div>
            </div>
          </div>

          {/* Close Button ('X') */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-2.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.1] text-white/60 hover:text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1 custom-scrollbar relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>Direct WhatsApp Channel</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight leading-snug">
              Let's talk about your <span className="font-serif-i text-gradient">next project</span>.
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Connect directly with our engineering & design team on WhatsApp for fast answers, live demos, and a custom quote.
            </p>
          </div>

          {/* Quick Topic Chips */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
              Select what you're looking for:
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_OPTIONS.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`text-xs font-mono px-3.5 py-2 rounded-xl transition-all duration-200 border text-left flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-400/80 text-orange-300 shadow-[0_0_15px_rgba(255,139,74,0.25)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
                WhatsApp Message Preview
              </label>
              <span className="text-[10px] font-mono text-white/40">Editable</span>
            </div>
            <div className="relative">
              <textarea
                rows="3"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message..."
                style={{ backgroundColor: '#111115', color: '#ffffff' }}
                className="w-full border border-white/15 focus:border-[#25D366]/80 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none transition-all resize-none leading-relaxed font-sans"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full pointer-events-none">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready to send</span>
              </div>
            </div>
          </div>

          {/* Perks Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-400/10 flex items-center justify-center text-orange-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono text-white/70 leading-tight">
                <span className="text-white font-medium block">2-Min Response</span>
                Quick estimate & quote
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono text-white/70 leading-tight">
                <span className="text-white font-medium block">Founder Direct</span>
                No sales bots
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <button
            type="button"
            onClick={handleClose}
            className="order-2 sm:order-1 text-xs font-mono tracking-widest text-white/50 hover:text-white py-2 px-4 transition-colors uppercase"
          >
            Explore Website First
          </button>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setTimeout(() => onClose(), 600);
            }}
            className="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-mono font-bold tracking-wider text-xs sm:text-sm uppercase px-7 py-3.5 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_45px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Open WhatsApp Chat</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
