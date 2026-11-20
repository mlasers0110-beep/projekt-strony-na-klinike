import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  Sparkles
} from 'lucide-react';

interface FooterProps {
  lang: 'pl' | 'en';
  onSelectDepartment: (id: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onSelectDepartment,
  onOpenBooking
}) => {
  const footerRef = useRef<HTMLElement | null>(null);
  const [parallax, setParallax] = useState({ scrollOffset: 0, mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    let rafId: number | null = null;
    let latestMouseX = 0;
    let latestMouseY = 0;

    const updateParallax = () => {
      rafId = null;
      const el = footerRef.current;
      let scrollOffset = 0;
      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight || 1;
        // Normalized progress as footer enters viewport [-1, 1]
        const progress = Math.max(-1, Math.min(1, (viewportH - rect.top) / (viewportH + rect.height) * 2 - 1));
        scrollOffset = progress * 24;
      }
      setParallax({
        scrollOffset,
        mouseX: latestMouseX,
        mouseY: latestMouseY,
      });
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      latestMouseX = (e.clientX / innerWidth - 0.5) * 18;
      latestMouseY = (e.clientY / innerHeight - 0.5) * 14;
      scheduleUpdate();
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const beamX = parallax.mouseX * 0.7;
  const beamY = parallax.scrollOffset * 0.9 + parallax.mouseY * 0.5;
  const trussX = parallax.mouseX * -0.35;
  const trussY = parallax.scrollOffset * -0.45 + parallax.mouseY * -0.25;
  const windowX = parallax.mouseX * 0.45;
  const windowY = parallax.scrollOffset * 0.55;

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12"
    >
      {/* Subtle Background Parallax Layers (echoing Hero skylight, windows & light refraction) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Layer 1: Architectural Skylight Truss Ribs */}
        <div
          className="absolute -inset-x-10 -top-12 h-80 flex justify-around opacity-15 will-change-transform"
          style={{ transform: `translate3d(${trussX}px, ${trussY}px, 0)` }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-full w-px bg-gradient-to-b from-sky-200/70 via-slate-400/30 to-transparent"
              style={{ transform: `rotate(${(i - 3.5) * 7}deg)` }}
            />
          ))}
        </div>

        {/* Layer 2: Spaced Architectural Window Aperture Outlines */}
        <div
          className="absolute inset-x-0 -top-6 bottom-0 max-w-7xl mx-auto px-8 grid grid-cols-3 gap-12 opacity-20 will-change-transform"
          style={{ transform: `translate3d(${windowX}px, ${windowY}px, 0)` }}
        >
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-500/30 bg-gradient-to-b from-sky-400/[0.04] via-transparent to-transparent"
            />
          ))}
        </div>

        {/* Layer 3: Soft Overhead Prism Light Beams */}
        <div
          className="absolute -top-28 left-[16%] w-80 h-[440px] bg-gradient-to-b from-sky-400/12 via-cyan-300/[0.04] to-transparent blur-3xl -rotate-12 will-change-transform"
          style={{ transform: `translate3d(${beamX}px, ${beamY}px, 0) rotate(-12deg)` }}
        />
        <div
          className="absolute -top-24 right-[18%] w-80 h-[440px] bg-gradient-to-b from-indigo-400/12 via-teal-300/[0.04] to-transparent blur-3xl rotate-12 will-change-transform"
          style={{ transform: `translate3d(${-beamX * 0.8}px, ${beamY * 0.8}px, 0) rotate(12deg)` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase">
                  Next Generation <span className="text-sky-400">Clinic</span>
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Medycyna Przyszłości
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'pl'
                ? 'Nowoczesna klinika medyczna łącząca zaawansowaną diagnostykę z mało-inwazyjną chirurgią laserową i flebologią.'
                : 'State-of-the-art medical clinic uniting advanced diagnostics with minimally invasive laser surgery and phlebology.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'pl' ? 'Certyfikat ISO 9001:2015 Medical' : 'ISO 9001:2015 Medical Certified'}</span>
            </div>
          </div>

          {/* Column 2: Divisions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'pl' ? 'Specjalizacje' : 'Specializations'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectDepartment('proctology')} className="hover:text-sky-400 transition-colors">
                  {lang === 'pl' ? 'Proktologia Laserowa' : 'Laser Proctology'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDepartment('surgery')} className="hover:text-sky-400 transition-colors">
                  {lang === 'pl' ? 'Chirurgia Ogólna i Estetyczna' : 'General & Aesthetic Surgery'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDepartment('phlebology')} className="hover:text-sky-400 transition-colors">
                  {lang === 'pl' ? 'Flebologia i USG Doppler' : 'Phlebology & Doppler USG'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectDepartment('shop')} className="hover:text-amber-400 transition-colors">
                  {lang === 'pl' ? 'Sklep Medyczny (Apothecary)' : 'Clinic Apothecary Store'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'pl' ? 'Kontakt & Godziny' : 'Contact & Hours'}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Al. Jerozolimskie 180, 02-486 Warszawa</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+48 22 123 45 67 / +48 600 100 200</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>rejestracja@nextgenclinic.pl</span>
              </p>
              <p className="flex items-center gap-2 pt-1 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pon - Pt: 08:00 - 20:00, Sob: 09:00 - 15:00</span>
              </p>
            </div>
          </div>

          {/* Column 4: Quick Action Box */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{lang === 'pl' ? 'E-Rejestracja 24/7' : '24/7 E-Registration'}</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {lang === 'pl' ? 'Szybka rezerwacja terminów bez oczekiwania na linii.' : 'Instant visit booking without holding on the line.'}
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              {lang === 'pl' ? 'Umów Wizytę Teraz' : 'Book Appointment'}
            </button>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Next Generation Clinic Sp. z o.o. Wszystkie prawa zastrzeżone.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Polityka Prywatności</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Regulamin Usług</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Standardy RODO</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
