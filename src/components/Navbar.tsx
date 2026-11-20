import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  Calendar, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { TimeOfDay } from '../types';

interface NavbarProps {
  activeTimeOfDay: TimeOfDay;
  onSelectTimeOfDay: (time: TimeOfDay) => void;
  cartCount: number;
  onOpenShop: () => void;
  onOpenBooking: () => void;
  lang: 'pl' | 'en';
  onToggleLang: () => void;
  onSelectDepartment: (id: string) => void;
  onOpenHandshake: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTimeOfDay,
  onSelectTimeOfDay,
  cartCount,
  onOpenShop,
  onOpenBooking,
  lang,
  onToggleLang,
  onSelectDepartment,
  onOpenHandshake
}) => {
  const times: { id: TimeOfDay; label: string; icon: React.ReactNode }[] = [
    { id: 'dawn', label: lang === 'pl' ? 'Świt' : 'Dawn', icon: <Sunrise className="w-3.5 h-3.5" /> },
    { id: 'noon', label: lang === 'pl' ? 'Dzień' : 'Noon', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'golden', label: lang === 'pl' ? 'Złota godzina' : 'Golden', icon: <Sunset className="w-3.5 h-3.5" /> },
    { id: 'twilight', label: lang === 'pl' ? 'Zmierzch' : 'Twilight', icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-400 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6" />
              {/* Prism refraction sparkle point */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-300 blur-[1px] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent uppercase font-sans">
                  Next Generation
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200/60 uppercase tracking-wider">
                  Clinic
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
                {lang === 'pl' ? 'Proktologia • Chirurgia • Flebologia' : 'Proctology • Surgery • Phlebology'}
              </p>
            </div>
          </div>

          {/* Quick Department Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => onSelectDepartment('proctology')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              {lang === 'pl' ? 'Proktologia (MCPL)' : 'Proctology (MCPL)'}
            </button>
            <button
              onClick={() => onSelectDepartment('surgery')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              {lang === 'pl' ? 'Chirurgia' : 'Surgery'}
            </button>
            <button
              onClick={() => onSelectDepartment('phlebology')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              {lang === 'pl' ? 'Flebologia' : 'Phlebology'}
            </button>
            <button
              onClick={onOpenHandshake}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-sky-800 hover:bg-white hover:shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              {lang === 'pl' ? 'Panel PRO (QR)' : 'Panel PRO (QR)'}
            </button>
            <button
              onClick={() => onSelectDepartment('shop')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50/80 border border-amber-200/60 hover:bg-amber-100 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              {lang === 'pl' ? 'Sklep Medyczny' : 'Clinic Shop'}
            </button>
          </nav>

          {/* Controls & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Time of Day Lighting Selector */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              {times.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTimeOfDay(t.id)}
                  title={`${t.label} Lighting`}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTimeOfDay === t.id
                      ? 'bg-white text-indigo-900 shadow-xs border border-indigo-100 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-xs font-bold text-slate-700 transition-colors"
            >
              {lang.toUpperCase()}
            </button>

            {/* Shop Cart Button */}
            <button
              onClick={onOpenShop}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 transition-all flex items-center justify-center"
              title="Open Medical Store"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-white bg-rose-500 rounded-full border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Phone Quick Call */}
            <a
              href="tel:+48221234567"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-xs font-semibold text-slate-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
              <span>+48 22 123 45 67</span>
            </a>

            {/* Book Appointment CTA Button */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'pl' ? 'Umów wizytę' : 'Book Visit'}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
