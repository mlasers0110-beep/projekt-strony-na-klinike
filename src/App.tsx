import React, { useState } from 'react';
import { 
  DEPARTMENTS, 
  PRODUCTS 
} from './data/clinicData';
import { 
  Department, 
  Product, 
  CartItem, 
  TimeOfDay 
} from './types';
import { Navbar } from './components/Navbar';
import { ParallaxWindowView } from './components/ParallaxWindowView';
import { DepartmentModal } from './components/DepartmentModal';
import { ShopDrawer } from './components/ShopDrawer';
import { BookingModal } from './components/BookingModal';
import { HandshakePlatformModal } from './components/HandshakePlatformModal';
import { PatientTestimonials } from './components/PatientTestimonials';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Zap, 
  ShoppingBag, 
  Award, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse
} from 'lucide-react';

export default function App() {
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<TimeOfDay>('noon');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHandshakeOpen, setIsHandshakeOpen] = useState(false);
  const [bookingDeptId, setBookingDeptId] = useState<string | undefined>(undefined);
  const [bookingTreatmentId, setBookingTreatmentId] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lang, setLang] = useState<'pl' | 'en'>('pl');

  // Active department modal data
  const selectedDepartment = DEPARTMENTS.find((d) => d.id === selectedDeptId) || null;

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenDepartment = (id: string) => {
    if (id === 'shop') {
      setIsShopOpen(true);
    } else {
      setSelectedDeptId(id);
    }
  };

  const handleOpenBookingForDept = (departmentId: string, treatmentId?: string) => {
    setBookingDeptId(departmentId);
    setBookingTreatmentId(treatmentId);
    setIsBookingOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-sky-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTimeOfDay={activeTimeOfDay}
        onSelectTimeOfDay={setActiveTimeOfDay}
        cartCount={totalCartCount}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenBooking={() => {
          setBookingDeptId(undefined);
          setBookingTreatmentId(undefined);
          setIsBookingOpen(true);
        }}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'pl' ? 'en' : 'pl')}
        onSelectDepartment={handleOpenDepartment}
        onOpenHandshake={() => setIsHandshakeOpen(true)}
      />

      {/* Hero Parallax Architectural Window Gallery Section */}
      <main className="relative">
        <ParallaxWindowView
          departments={DEPARTMENTS}
          activeTimeOfDay={activeTimeOfDay}
          selectedDeptId={selectedDeptId}
          onSelectDepartment={handleOpenDepartment}
          lang={lang}
        />

        {/* ========================================================= */}
        {/* CLINICAL EXCELLENCE & FEATURE HIGHLIGHTS SECTION           */}
        {/* ========================================================= */}
        <section className="py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700 px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
                {lang === 'pl' ? 'Standardy Kliniczne ISO Class 5' : 'ISO Class 5 Clinical Excellence'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {lang === 'pl' ? 'Dlaczego Next Generation Clinic?' : 'Why Choose Next Generation Clinic?'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'pl' 
                  ? 'Łączymy precyzję lasera diodowego 1470nm z bezbolesnymi protokołami zabiegowymi, dając Ci gwarancję bezpieczeństwa i najwyższego komfortu.'
                  : 'Uniting 1470nm diode laser precision with pain-free treatment protocols to guarantee maximum safety and rapid recovery.'}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'pl' ? 'MCPL — Proktologia Laserowa' : 'MCPL — Laser Proctology'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'pl' 
                    ? 'Mazowieckie Centrum Proktologii Laserowej: protokół LHP® bez cięcia tkanki w znieczuleniu miejscowym z powrotem do domu tego samego dnia.'
                    : 'Mazowieckie Centrum Proktologii Laserowej: LHP® protocol without tissue cutting under local anesthesia with same-day discharge.'}
                </p>
                <button
                  onClick={() => handleOpenDepartment('proctology')}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 pt-2"
                >
                  <span>{lang === 'pl' ? 'Sprawdź cennik proktologii' : 'Check Proctology Pricing'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'pl' ? 'Chirurgia 3D Laparoskopowa' : '3D Laparoscopic Surgery'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'pl' 
                    ? 'Salę operacyjną z nawiewem laminarnym wspiera wizualizacja 4K 3D i mikrosiatki biologiczne wzmacniające powłoki.'
                    : 'Laminar flow operating suite backed by 4K 3D visualization and biological tissue reinforcing meshes.'}
                </p>
                <button
                  onClick={() => handleOpenDepartment('surgery')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-2"
                >
                  <span>{lang === 'pl' ? 'Sprawdź procedury chirurgiczne' : 'Explore Surgical Procedures'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'pl' ? 'Flebologia & USG Doppler' : 'Phlebology & Doppler USG'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'pl' 
                    ? 'Mapowanie przewlekłej niewydolności żylnej i małoinwazyjne zamykanie żylaków laserem EVLT® 1470nm.'
                    : 'Mapping of venous insufficiency and minimally invasive EVLT® 1470nm radial laser ablation.'}
                </p>
                <button
                  onClick={() => handleOpenDepartment('phlebology')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 pt-2"
                >
                  <span>{lang === 'pl' ? 'Sprawdź zabiegi flebologii' : 'Explore Phlebology'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* THE HANDSHAKE — B2C PATIENT APP <-> B2B PANEL PRO         */}
        {/* ========================================================= */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span>{lang === 'pl' ? 'Ekosystem B2C ↔ B2B' : 'B2C ↔ B2B Ecosystem'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'pl' ? 'Dynamiczny QR 30s + PIN' : 'Dynamic 30s QR + Backup PIN'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'pl' ? 'Model Pre-Paid Unlock' : 'Pre-Paid Unlock Model'}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                  {lang === 'pl'
                    ? 'The Handshake: Błyskawiczne przekazanie protokołu do Panelu PRO'
                    : 'The Handshake: Instant Protocol Transfer to Clinic Panel PRO'}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  {lang === 'pl'
                    ? 'Przetestuj pełny przepływ gabinetowy: od wygenerowania 30-sekundowego kodu QR i awaryjnego PIN-u w aplikacji pacjentki, przez zaporę finansową (-1 kredyt z ochroną 12-godzinnej sesji i dyskretnym doładowaniem przy zerowym saldzie), aż po kalibrację sprzętu w Kreatorze Protokołu.'
                    : 'Test the complete in-clinic workflow: from a 30-second rotating QR token and backup PIN on the patient phone, through the credit confirmation gate (with 12-hour free re-scan protection and discreet top-up), straight into Expert Override device calibration.'}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsHandshakeOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                  >
                    <span>
                      {lang === 'pl'
                        ? 'Uruchom Symulator B2C ↔ Panel PRO'
                        : 'Launch B2C ↔ Panel PRO Simulator'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100">
                  {lang === 'pl' ? 'Architektura PRO-PANEL (Ekrany 1–5 + Krok 0 B2C)' : 'PRO-PANEL Architecture (Screens 1–5 + Step 0 B2C)'}
                </h3>
                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start justify-between gap-4">
                    <span>01. {lang === 'pl' ? 'Radar Pieniędzy (10 km) i Kalkulator ROI' : 'ROI Radar (10 km) & Pipeline Counter'}</span>
                    <span className="text-xs font-mono text-slate-400 shrink-0">ROI</span>
                  </li>
                  <li className="flex items-start justify-between gap-4">
                    <span>02. {lang === 'pl' ? 'Most QR (30s) + PIN, zapora -1 kredyt i zasada 12h' : '30s QR + PIN, -1 Credit Gate & 12h Rule'}</span>
                    <span className="text-xs font-mono text-slate-400 shrink-0">QR/PIN</span>
                  </li>
                  <li className="flex items-start justify-between gap-4">
                    <span>03. {lang === 'pl' ? 'Kreator Protokołu (Expert Override) i stempel specjalisty' : 'Protocol Creator (Expert Override) & Stamp'}</span>
                    <span className="text-xs font-mono text-slate-400 shrink-0">PRO</span>
                  </li>
                  <li className="flex items-start justify-between gap-4">
                    <span>04. {lang === 'pl' ? 'Wirtualny Garaż (Park Maszynowy + Smart Mapping)' : 'Virtual Garage (Fleet + Smart Mapping)'}</span>
                    <span className="text-xs font-mono text-slate-400 shrink-0">FLEET</span>
                  </li>
                  <li className="flex items-start justify-between gap-4">
                    <span>05. {lang === 'pl' ? 'Synergia Upsellingowa (LED/Egzosomy) i Paszport Skóry' : 'Upsell Synergy & Skin Passport (PDF)'}</span>
                    <span className="text-xs font-mono text-slate-400 shrink-0">PDF</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CLINIC SHOP ENTRANCE BANNER                                */}
        {/* ========================================================= */}
        <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'pl' ? 'Oficjalny Sklep Medyczny Kliniki' : 'Official Clinic Apothecary Shop'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {lang === 'pl' ? 'Dedykowane Wyroby Medyczne & Kompresjoterapia' : 'Certified Medical Products & Compression Garments'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'pl'
                  ? 'Kup bezpośrednio pończochy uciskowe CCL1/CCL2, opatrunki hydrokoloidowe na blizny oraz preparaty na bazie diosminy zmikronizowanej z dostawą do domu.'
                  : 'Order CCL1/CCL2 compression wear, hydrocolloid scar dressings, and micronized diosmin supplements directly for home delivery.'}
              </p>
            </div>

            <button
              onClick={() => setIsShopOpen(true)}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all shrink-0 flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{lang === 'pl' ? 'Wejdź do Sklepu' : 'Enter Store'}</span>
            </button>

          </div>
        </section>

        {/* ========================================================= */}
        {/* DOCTORS TEAM CAROUSEL                                     */}
        {/* ========================================================= */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                {lang === 'pl' ? 'Nasi Eksperci' : 'Our Senior Specialists'}
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'pl' ? 'Doświadczony Zespół Lekarski' : 'Expert Medical Faculty'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {DEPARTMENTS.flatMap(d => d.doctors).slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-100 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-sky-700 font-bold">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.specialty}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{doc.experienceYears} {lang === 'pl' ? 'lat w chirurgii' : 'years in surgery'}</span>
                    <button
                      onClick={() => {
                        setBookingDeptId('proctology');
                        setIsBookingOpen(true);
                      }}
                      className="text-sky-600 font-bold hover:underline"
                    >
                      {lang === 'pl' ? 'Umów' : 'Book'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Patient Post-Treatment Testimonials Section */}
        <PatientTestimonials
          lang={lang}
          onSelectDepartment={handleOpenDepartment}
          onOpenBooking={(deptId) => {
            setBookingDeptId(deptId);
            setBookingTreatmentId(undefined);
            setIsBookingOpen(true);
          }}
        />

        {/* FAQ Accordion Section (directly above Footer) */}
        <FaqAccordion
          lang={lang}
          onOpenBooking={() => {
            setBookingDeptId(undefined);
            setBookingTreatmentId(undefined);
            setIsBookingOpen(true);
          }}
        />

      </main>

      {/* Footer Component */}
      <Footer
        lang={lang}
        onSelectDepartment={handleOpenDepartment}
        onOpenBooking={() => {
          setBookingDeptId(undefined);
          setBookingTreatmentId(undefined);
          setIsBookingOpen(true);
        }}
      />

      {/* Department Detail Modal */}
      <DepartmentModal
        department={selectedDepartment}
        onClose={() => setSelectedDeptId(null)}
        onBookTreatment={handleOpenBookingForDept}
        lang={lang}
      />

      {/* Clinic Shop Drawer */}
      <ShopDrawer
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        products={PRODUCTS}
        cart={cart}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        lang={lang}
      />

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        departments={DEPARTMENTS}
        initialDeptId={bookingDeptId}
        initialTreatmentId={bookingTreatmentId}
        lang={lang}
      />

      {/* Interactive B2C <-> B2B Handshake & Panel PRO Workspace */}
      <HandshakePlatformModal
        isOpen={isHandshakeOpen}
        onClose={() => setIsHandshakeOpen(false)}
        lang={lang}
      />

    </div>
  );
}
