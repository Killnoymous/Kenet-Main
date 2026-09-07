import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloatButton({ onClick }) {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Auto hide tooltip after 8 seconds if not interacted
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 flex-col sm:flex-row">
      {/* Tooltip Bubble */}
      {showTooltip && (
        <div className="relative group bg-[#0d0d11]/95 border border-emerald-500/30 text-white rounded-2xl px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-3 animate-fade-in max-w-xs cursor-pointer"
          onClick={onClick}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              Kenet Support Online
            </span>
            <span className="text-xs text-white/90 mt-0.5">Need a quick quote? Chat on WhatsApp</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Chat on WhatsApp"
        className="relative group p-4 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-[0_4px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_4px_45px_rgba(37,211,102,0.7)] transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        {/* Pulsing Outer Rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping group-hover:opacity-60"></span>

        {/* WhatsApp Icon */}
        <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Unread badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#050505] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
          1
        </span>
      </button>
    </div>
  );
}
