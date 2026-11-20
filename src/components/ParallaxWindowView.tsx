import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Zap, 
  ShoppingBag, 
  Sparkles, 
  Eye, 
  ArrowUpRight,
  Sun,
  Compass,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { Department, TimeOfDay } from '../types';

interface ParallaxWindowViewProps {
  departments: Department[];
  activeTimeOfDay: TimeOfDay;
  selectedDeptId: string | null;
  onSelectDepartment: (id: string) => void;
  lang: 'pl' | 'en';
}

export const ParallaxWindowView: React.FC<ParallaxWindowViewProps> = ({
  departments,
  activeTimeOfDay,
  selectedDeptId,
  onSelectDepartment,
  lang
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 20,
        y: (e.clientY / innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Time of Day Background Styling for the Outdoor Skyline visible behind windows
  const getTimeStyle = () => {
    switch (activeTimeOfDay) {
      case 'dawn':
        return {
          skyGradient: 'from-amber-100 via-sky-200 to-indigo-300',
          sunGlow: 'bg-amber-300/40',
          cityTint: 'brightness-105 contrast-95 sepia-[0.1]',
          ambientLight: 'from-amber-50/20 via-sky-50/10 to-transparent',
          prismOpacity: 'opacity-70'
        };
      case 'golden':
        return {
          skyGradient: 'from-orange-200 via-amber-300 to-indigo-400',
          sunGlow: 'bg-orange-400/50',
          cityTint: 'brightness-100 contrast-105 hue-rotate-[-10deg]',
          ambientLight: 'from-amber-100/30 via-orange-50/20 to-transparent',
          prismOpacity: 'opacity-90'
        };
      case 'twilight':
        return {
          skyGradient: 'from-slate-800 via-indigo-900 to-sky-950',
          sunGlow: 'bg-indigo-500/30',
          cityTint: 'brightness-75 contrast-125 saturate-125',
          ambientLight: 'from-indigo-900/20 via-slate-900/10 to-transparent',
          prismOpacity: 'opacity-60'
        };
      case 'noon':
      default:
        return {
          skyGradient: 'from-sky-100 via-blue-50 to-indigo-100',
          sunGlow: 'bg-white/60',
          cityTint: 'brightness-100 contrast-100',
          ambientLight: 'from-sky-50/30 via-white/20 to-transparent',
          prismOpacity: 'opacity-80'
        };
    }
  };

  const timeTheme = getTimeStyle();

  // Parallax Offsets
  // 1. Background outdoor skyline scrolls down slower inside window clips
  const backgroundParallaxY = scrollY * 0.35 + mousePos.y * 0.5;
  const backgroundParallaxX = mousePos.x * 0.8;

  // 2. Floating icons/refractions move at independent layer speeds
  const floatingIconsY1 = scrollY * -0.22 + mousePos.y * -0.8;
  const floatingIconsY2 = scrollY * -0.15 + mousePos.y * 0.6;
  const floatingIconsY3 = scrollY * -0.32 + mousePos.y * -1.2;

  return (
    <div className="relative min-h-[140vh] w-full overflow-hidden bg-slate-950 text-slate-800 select-none">
      
      {/* ========================================================= */}
      {/* 1. OPEN CEILING ARCHITECTURE LAYER ("Zdejmij sufit")      */}
      {/* High glass roof ribs, skylights, structural steel trusses */}
      {/* ========================================================= */}
      <div className="absolute top-0 left-0 right-0 h-64 z-20 pointer-events-none overflow-hidden">
        {/* Overhead Skylight Aperture */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sky-200/40 via-white/10 to-transparent backdrop-blur-[2px]" />
        
        {/* Architectural Roof Steel & Glass Trusses */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full flex justify-around opacity-30">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="h-full w-px bg-gradient-to-b from-slate-200 via-slate-400 to-transparent shadow-sm" 
              style={{ transform: `rotate(${(i - 3.5) * 8}deg)` }}
            />
          ))}
        </div>

        {/* Soft Overhead Sunlight Beams filtering into the open clinic hall */}
        <div 
          className="absolute -top-20 left-1/4 w-96 h-[600px] bg-gradient-to-b from-white/30 via-cyan-100/10 to-transparent blur-2xl transform -rotate-12 pointer-events-none transition-all duration-700"
          style={{ opacity: activeTimeOfDay === 'twilight' ? 0.15 : 0.6 }}
        />
        <div 
          className="absolute -top-20 right-1/4 w-96 h-[600px] bg-gradient-to-b from-white/30 via-sky-100/10 to-transparent blur-2xl transform rotate-12 pointer-events-none transition-all duration-700"
          style={{ opacity: activeTimeOfDay === 'twilight' ? 0.15 : 0.6 }}
        />
      </div>


      {/* ========================================================= */}
      {/* 2. SPACED WINDOWS WITH SCROLL PARALLAX CITY SKYLINE      */}
      {/* "Okna nie powinny się stykać, aby uzyskać większą przestrzeń" */}
      {/* "Obraz powinien przesuwać się tylko za oknami..."        */}
      {/* ========================================================= */}
      <div className="relative w-full h-[120vh] flex flex-col justify-between">
        
        {/* Main Architectural Window Gallery Container */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 h-full flex flex-col">
          
          {/* Header Typography over space */}
          <div className="text-center z-30 pt-4 pb-8 space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-sky-900 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{lang === 'pl' ? 'Innowacyjna Medycyna Jutra' : 'Tomorrow’s Precision Medical Care'}</span>
            </div>
            
            {/* Main Title as explicitly requested: "NEXT GENERATION CLINIC" */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 font-sans uppercase drop-shadow-xs">
              Next Generation <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">Clinic</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              {lang === 'pl' 
                ? 'Przestrzeń taktylna i otwarta. Poznaj nasze wyspecjalizowane pody: proktologia, chirurgia, flebologia oraz sklep medyczny.' 
                : 'A bright, tactile space. Explore our specialized pods: proctology, surgery, phlebology, and medical shop.'}
            </p>
          </div>

          {/* WINDOW FRAMES & PILLARS GRID */}
          <div className="relative flex-1 grid grid-cols-3 gap-6 sm:gap-12 md:gap-16 items-stretch my-4 z-20">
            
            {[1, 2, 3].map((windowIndex) => (
              <div 
                key={windowIndex}
                className="relative rounded-3xl border-4 border-white/80 shadow-2xl overflow-hidden bg-slate-900 flex flex-col justify-between group"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.4)'
                }}
              >
                {/* ---------------------------------------------------- */}
                {/* PARALLAX CITY SKYLINE INSIDE THIS WINDOW FRAME ONLY */}
                {/* ---------------------------------------------------- */}
                <div 
                  className="absolute inset-0 w-full h-[150%] -top-[25%] transition-transform duration-75 ease-out"
                  style={{
                    transform: `translate3d(${backgroundParallaxX}px, ${backgroundParallaxY}px, 0px)`
                  }}
                >
                  {/* Sky Base Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${timeTheme.skyGradient} transition-all duration-700`} />
                  
                  {/* Sun / Light Source disk inside window sky */}
                  <div 
                    className={`absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full ${timeTheme.sunGlow} blur-xl`} 
                  />

                  {/* Soft Drifting Clouds */}
                  <div className="absolute top-16 left-0 right-0 h-32 bg-white/20 blur-xl rounded-full transform -rotate-3 animate-pulse" />

                  {/* Realistic Panoramic City Silhouette Image Layer */}
                  <div className={`absolute bottom-0 left-0 right-0 h-2/3 bg-cover bg-bottom opacity-85 transition-all duration-700 ${timeTheme.cityTint}`}>
                    <img 
                      src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&auto=format&fit=crop&q=80" 
                      alt="Panorama miasta" 
                      className="w-full h-full object-cover object-bottom mix-blend-overlay opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Soft Prism Spectral Reflection Flares inside Window */}
                  <div className={`absolute inset-0 bg-gradient-to-tr from-cyan-300/10 via-indigo-300/10 to-pink-300/10 ${timeTheme.prismOpacity} mix-blend-soft-light`} />
                </div>

                {/* Window Architectural Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none z-10" />
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-white/10 backdrop-blur-[1px] transform skew-x-12 pointer-events-none z-10" />

                {/* Subtle Window Frame Label */}
                <div className="relative z-20 p-4 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-md text-slate-800 border border-white/80 shadow-xs">
                    {windowIndex === 1 ? (lang === 'pl' ? 'Widok Wschodni' : 'East View') : windowIndex === 2 ? (lang === 'pl' ? 'Główne Atrium' : 'Central Atrium') : (lang === 'pl' ? 'Widok Zachodni' : 'West View')}
                  </span>
                </div>

                {/* Subtle Glass Bottom Label */}
                <div className="relative z-20 p-4 text-center mt-auto">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-white/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/70">
                    <Sun className="w-3 h-3 text-sky-600" />
                    <span>{lang === 'pl' ? 'Światło naturalne 100%' : '100% Natural Light'}</span>
                  </div>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>


      {/* ========================================================= */}
      {/* 3. INDEPENDENT FLOATING ICONS & PRISM REFRACTIONS         */}
      {/* "Ikony również powinny przesuwać się niezależnie..."      */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none z-30">
        
        {/* Floating Prism Crystal 1 (Proctology Laser Symbol) */}
        <div 
          className="absolute top-1/3 left-[12%] transition-transform duration-100 ease-out flex items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-sky-200/80 shadow-lg text-sky-600"
          style={{ transform: `translate3d(0, ${floatingIconsY1}px, 0)` }}
        >
          <Activity className="w-6 h-6 animate-pulse" />
          <div className="absolute -inset-1 rounded-2xl bg-sky-400/20 blur-md -z-10" />
        </div>

        {/* Floating Prism Crystal 2 (Surgery Shield) */}
        <div 
          className="absolute top-1/4 left-[38%] transition-transform duration-100 ease-out flex items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-teal-200/80 shadow-lg text-teal-600"
          style={{ transform: `translate3d(0, ${floatingIconsY2}px, 0)` }}
        >
          <ShieldAlert className="w-6 h-6" />
          <div className="absolute -inset-1 rounded-2xl bg-teal-400/20 blur-md -z-10" />
        </div>

        {/* Floating Prism Crystal 3 (Phlebology Vascular Wave) */}
        <div 
          className="absolute top-1/3 right-[32%] transition-transform duration-100 ease-out flex items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-blue-200/80 shadow-lg text-blue-600"
          style={{ transform: `translate3d(0, ${floatingIconsY3}px, 0)` }}
        >
          <Zap className="w-6 h-6" />
          <div className="absolute -inset-1 rounded-2xl bg-blue-400/20 blur-md -z-10" />
        </div>

        {/* Floating Prism Crystal 4 (Clinic Shop Basket) */}
        <div 
          className="absolute top-1/4 right-[12%] transition-transform duration-100 ease-out flex items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-amber-200/80 shadow-lg text-amber-600"
          style={{ transform: `translate3d(0, ${floatingIconsY1 * 1.2}px, 0)` }}
        >
          <ShoppingBag className="w-6 h-6" />
          <div className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-md -z-10" />
        </div>

        {/* Scattered Soft Prism Rainbow Refraction Rays across the room */}
        <div className="absolute top-1/2 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-sky-300/10 via-teal-300/15 to-indigo-300/10 blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 right-10 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-200/15 via-rose-300/10 to-sky-300/10 blur-3xl pointer-events-none" />

      </div>


      {/* ========================================================= */}
      {/* 4. TACTILE FLOOR & INTERACTIVE PEDESTALS (TABLES) SECTION */}
      {/* Proctology, Surgery, Phlebology, and Shop Store Entrance  */}
      {/* ========================================================= */}
      <div className="relative z-40 bg-gradient-to-b from-transparent via-slate-100/90 to-slate-100 pb-20 pt-10 border-t border-slate-200/60 backdrop-blur-xs">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              {lang === 'pl' ? 'Podesty Specjalistyczne & Sklep' : 'Specialized Pedestals & Store'}
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              {lang === 'pl'
                ? 'Wybierz podest na sali, aby przejść do wybranej dziedziny medycznej lub wejść do sklepu clinic shop.'
                : 'Select a pedestal in the hall to enter your preferred medical field or visit the clinic shop.'}
            </p>
          </div>

          {/* 4 INTERACTIVE PEDESTALS (TABLES) GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              
              const renderIcon = () => {
                switch (dept.id) {
                  case 'proctology': return <Activity className="w-8 h-8 text-sky-600" />;
                  case 'surgery': return <ShieldAlert className="w-8 h-8 text-teal-600" />;
                  case 'phlebology': return <Zap className="w-8 h-8 text-blue-600" />;
                  case 'shop': return <ShoppingBag className="w-8 h-8 text-amber-600" />;
                  default: return <Sparkles className="w-8 h-8 text-indigo-600" />;
                }
              };

              return (
                <div
                  key={dept.id}
                  onClick={() => onSelectDepartment(dept.id)}
                  className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-white ring-4 ring-sky-500/30 shadow-2xl scale-[1.03] border-2 border-sky-400' 
                      : 'bg-white/90 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 border border-slate-200/80'
                  }`}
                >
                  
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {dept.badge}
                    </span>
                    <span className="p-2 rounded-xl bg-slate-50 group-hover:bg-sky-50 transition-colors text-slate-400 group-hover:text-sky-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* 3D Visual Pedestal / Table Illustration */}
                  <div className="relative py-8 flex flex-col items-center justify-center my-2">
                    
                    {/* Floating Holographic Icon on Pedestal */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-50 to-white shadow-lg border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {renderIcon()}
                      
                      {/* Prism Light Beam Emission from Pedestal */}
                      <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${dept.accentColor} opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-300 -z-10`} />
                    </div>

                    {/* PHYSICAL PEDESTAL / TABLE STAND */}
                    <div className="relative mt-3 w-28 h-8 rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400/80 shadow-md border-t border-white flex items-center justify-center">
                      <div className="w-20 h-2 rounded-full bg-white/60 blur-[1px]" />
                    </div>
                    {/* Pedestal Shadow on Floor */}
                    <div className="w-32 h-3 rounded-full bg-slate-900/10 blur-sm mt-1" />

                  </div>

                  {/* Department Content Info */}
                  <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {lang === 'pl' ? dept.namePl : dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {dept.shortDesc}
                    </p>
                  </div>

                  {/* Action CTA Tag */}
                  <div className="mt-5 pt-3 flex items-center justify-between text-xs font-semibold text-sky-700 group-hover:translate-x-1 transition-transform">
                    <span>{dept.id === 'shop' ? (lang === 'pl' ? 'Otwórz Sklep' : 'Open Store') : (lang === 'pl' ? 'Poznaj Szczegóły' : 'Explore Division')}</span>
                    <span className="text-base font-bold">→</span>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
};
