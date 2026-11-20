import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowUpRight, Quote } from 'lucide-react';

interface PatientTestimonialsProps {
  lang: 'pl' | 'en';
  onSelectDepartment: (deptId: string) => void;
  onOpenBooking: (deptId?: string) => void;
}

interface PatientTestimonial {
  id: string;
  departmentId: string;
  departmentPl: string;
  departmentEn: string;
  procedurePl: string;
  procedureEn: string;
  quotePl: string;
  quoteEn: string;
  patientName: string;
  patientContextPl: string;
  patientContextEn: string;
  doctorName: string;
  visitDatePl: string;
  visitDateEn: string;
  recoveryMetricValuePl: string;
  recoveryMetricValueEn: string;
  recoveryMetricLabelPl: string;
  recoveryMetricLabelEn: string;
  procedureDuration: string;
  outcomeSummaryPl: string;
  outcomeSummaryEn: string;
}

const TESTIMONIALS: PatientTestimonial[] = [
  {
    id: 'test-mcpl-1',
    departmentId: 'proctology',
    departmentPl: 'MCPL — Proktologia Laserowa',
    departmentEn: 'MCPL — Laser Proctology',
    procedurePl: 'Laserowa hemoroidoplastyka LHP®',
    procedureEn: 'LHP® Laser Hemorrhoidoplasty',
    quotePl:
      'Przez trzy lata odkładałem zabieg ze strachu przed bólem i pobytem w szpitalu. W MCPL cała procedura w znieczuleniu miejscowym trwała 45 minut, a dwie godziny później wróciłem samodzielnie do domu. Po dwóch dniach normalnie pracowałem przy biurku bez żadnych środków przeciwbólowych.',
    quoteEn:
      'I postponed treatment for three years out of fear of pain and a hospital stay. At MCPL the local-anesthesia laser procedure took 45 minutes and I walked home two hours later. Within two days I was back at my desk with zero pain medication.',
    patientName: 'Tomasz Kowalczyk',
    patientContextPl: 'Pacjent z Warszawy, 44 lata',
    patientContextEn: 'Patient from Warsaw, age 44',
    doctorName: 'dr hab. n. med. Marek Wiśniewski',
    visitDatePl: 'Kontrola po 4 tygodniach',
    visitDateEn: '4-week follow-up',
    recoveryMetricValuePl: '2 dni',
    recoveryMetricValueEn: '2 days',
    recoveryMetricLabelPl: 'Powrót do pracy biurowej',
    recoveryMetricLabelEn: 'Return to desk work',
    procedureDuration: '45 min',
    outcomeSummaryPl: 'Pełne wygojenie bez cięcia chirurgicznego i szwów',
    outcomeSummaryEn: 'Complete healing with zero surgical incisions or sutures',
  },
  {
    id: 'test-phlebology-2',
    departmentId: 'phlebology',
    departmentPl: 'Flebologia i USG Doppler',
    departmentEn: 'Phlebology & Doppler USG',
    procedurePl: 'Ablacja laserowa EVLT® 1470 nm',
    procedureEn: 'EVLT® 1470nm Radial Laser Ablation',
    quotePl:
      'Uczucie ciężkości nóg i wieczorne obrzęki towarzyszyły mi po każdym dyżurze. Po precyzyjnym mapowaniu USG Doppler dr Majewska zamknęła niewydolną żyłę laserem radialnym. Już pierwszego wieczoru chodziłam na spacer, a po miesiącu obrzęki i pajączki ustąpiły całkowicie.',
    quoteEn:
      'Heavy legs and evening swelling followed me after every shift. After precision Doppler mapping, Dr. Majewska closed the incompetent saphenous vein with a radial laser. I went for a walk that same evening, and within a month swelling was completely gone.',
    patientName: 'Katarzyna Brzezińska',
    patientContextPl: 'Pacjentka z Piaseczna, 39 lat',
    patientContextEn: 'Patient from Piaseczno, age 39',
    doctorName: 'dr n. med. Ewa Majewska',
    visitDatePl: 'Kontrola po 6 tygodniach',
    visitDateEn: '6-week follow-up',
    recoveryMetricValuePl: '0 dni',
    recoveryMetricValueEn: '0 days',
    recoveryMetricLabelPl: 'Wyłączenia z chodzenia',
    recoveryMetricLabelEn: 'Walking downtime',
    procedureDuration: '55 min',
    outcomeSummaryPl: 'Potwierdzone w USG pełne zamknięcie refluksu żylnego',
    outcomeSummaryEn: 'Doppler-confirmed full closure of venous reflux',
  },
  {
    id: 'test-surgery-3',
    departmentId: 'surgery',
    departmentPl: 'Chirurgia Laparoskopowa 3D',
    departmentEn: '3D Laparoscopic Surgery',
    procedurePl: 'Hernioplastyka laparoskopowa TAPP z siatką 3D',
    procedureEn: 'TAPP 3D Mesh Laparoscopic Hernioplasty',
    quotePl:
      'Zależało mi na szybkim powrocie do treningów biegowych i pracy w terenie. Operacja metodą laparoskopową z wizualizacją 4K 3D przebiegła bez powikłań, a blizny po mikronacięciach są dziś praktycznie niewidoczne. Po tygodniu wróciłem do normalnej aktywności.',
    quoteEn:
      'Returning quickly to running and field work was my top priority. The 4K 3D laparoscopic repair went smoothly without complications, and the micro-incision marks are barely visible today. After seven days I resumed full daily activity.',
    patientName: 'Michał Zieliński-Krawczyk',
    patientContextPl: 'Pacjent z Gdańska, 51 lat',
    patientContextEn: 'Patient from Gdańsk, age 51',
    doctorName: 'prof. dr hab. Piotr Zieliński',
    visitDatePl: 'Kontrola po 8 tygodniach',
    visitDateEn: '8-week follow-up',
    recoveryMetricValuePl: '7 dni',
    recoveryMetricValueEn: '7 days',
    recoveryMetricLabelPl: 'Powrót do pełnej sprawności',
    recoveryMetricLabelEn: 'Return to daily activity',
    procedureDuration: '75 min',
    outcomeSummaryPl: 'Stabilne wzmocnienie powłok bez nawrotu dolegliwości',
    outcomeSummaryEn: 'Stable abdominal wall reinforcement with zero recurrence',
  },
  {
    id: 'test-pro-4',
    departmentId: 'proctology',
    departmentPl: 'MCPL — Diagnostyka i Laser',
    departmentEn: 'MCPL — Diagnostics & Laser',
    procedurePl: 'Laserowa waporyzacja szczeliny',
    procedureEn: 'Diode Laser Fissure Vaporization',
    quotePl:
      'Najbardziej doceniam dyskrecję, spokój zespołu i to, że każdy etap wizyty został dokładnie wytłumaczony przed zabiegiem. Dostałam jasny plan regeneracji z preparatami pozabiegowymi ze sklepu kliniki. Dolegliwości, które męczyły mnie od roku, zniknęły w kilkanaście dni.',
    quoteEn:
      'What stood out most was the team’s discretion and clear step-by-step communication before the procedure. I received a tailored recovery plan with clinic post-care products, and symptoms that had persisted for a year resolved within two weeks.',
    patientName: 'Joanna Pawłowska',
    patientContextPl: 'Pacjentka z Krakowa, 34 lata',
    patientContextEn: 'Patient from Kraków, age 34',
    doctorName: 'dr n. med. Anna Kowalska-Kruk',
    visitDatePl: 'Kontrola po 3 tygodniach',
    visitDateEn: '3-week follow-up',
    recoveryMetricValuePl: '14 dni',
    recoveryMetricValueEn: '14 days',
    recoveryMetricLabelPl: 'Pełne ustąpienie objawów',
    recoveryMetricLabelEn: 'Full symptom resolution',
    procedureDuration: '40 min',
    outcomeSummaryPl: 'Prawidłowe nabłonkowanie potwierdzone w wideokontroli',
    outcomeSummaryEn: 'Complete epithelialization confirmed on follow-up exam',
  },
];

const ROTATION_MS = 7000;

export const PatientTestimonials: React.FC<PatientTestimonialsProps> = ({
  lang,
  onSelectDepartment,
  onOpenBooking,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isPaused || isHovered || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, isHovered]);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      aria-label={lang === 'pl' ? 'Opinie pacjentów po zabiegach' : 'Post-treatment patient testimonials'}
      className="py-20 bg-white border-t border-slate-200/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{lang === 'pl' ? 'Historie Pacjentów' : 'Patient Outcomes'}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'pl' ? 'Zweryfikowane kontrole pozabiegowe' : 'Verified post-procedure follow-ups'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              {lang === 'pl'
                ? 'Efekty leczenia oczami naszych pacjentów'
                : 'Post-treatment recovery in our patients’ words'}
            </h2>
          </div>

          {/* Playback & Slide Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono tabular-nums text-slate-500 mr-2">
              {String(activeIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={
                isPaused
                  ? lang === 'pl'
                    ? 'Wznów automatyczne przewijanie opinii'
                    : 'Resume automatic testimonial rotation'
                  : lang === 'pl'
                  ? 'Wstrzymaj automatyczne przewijanie opinii'
                  : 'Pause automatic testimonial rotation'
              }
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label={lang === 'pl' ? 'Poprzednia opinia' : 'Previous testimonial'}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label={lang === 'pl' ? 'Następna opinia' : 'Next testimonial'}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Active Testimonial Layout (Asymmetric 12-col Split) */}
        <div
          key={current.id}
          aria-live="polite"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
        >
          {/* Left 7 cols: Quote & Attribution */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                <span className="text-sky-700 font-semibold">
                  {lang === 'pl' ? current.departmentPl : current.departmentEn}
                </span>
                <span aria-hidden="true">·</span>
                <span>{lang === 'pl' ? current.procedurePl : current.procedureEn}</span>
                <span aria-hidden="true">·</span>
                <span>{lang === 'pl' ? current.visitDatePl : current.visitDateEn}</span>
              </div>

              <div className="relative">
                <Quote className="w-7 h-7 text-slate-200 mb-3" aria-hidden="true" />
                <blockquote className="text-xl sm:text-2xl font-medium text-slate-900 leading-relaxed tracking-tight">
                  „{lang === 'pl' ? current.quotePl : current.quoteEn}”
                </blockquote>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-base font-bold text-slate-900">{current.patientName}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {lang === 'pl' ? current.patientContextPl : current.patientContextEn}
                  <span aria-hidden="true"> · </span>
                  <span>
                    {lang === 'pl' ? 'Lekarz prowadzący: ' : 'Attending specialist: '}
                    {current.doctorName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectDepartment(current.departmentId)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
              >
                <span>{lang === 'pl' ? 'Zobacz szczegóły oddziału' : 'View department details'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right 5 cols: Quantified Post-Treatment Outcome Summary */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="text-xs font-semibold text-slate-500">
                {lang === 'pl' ? 'Podsumowanie rekonwalescencji' : 'Post-Treatment Recovery Summary'}
              </div>

              <div className="grid grid-cols-2 gap-6 pb-5 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                    {lang === 'pl' ? current.recoveryMetricValuePl : current.recoveryMetricValueEn}
                  </div>
                  <div className="text-xs text-slate-600">
                    {lang === 'pl' ? current.recoveryMetricLabelPl : current.recoveryMetricLabelEn}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                    {current.procedureDuration}
                  </div>
                  <div className="text-xs text-slate-600">
                    {lang === 'pl' ? 'Czas trwania zabiegu' : 'Procedure duration'}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs text-slate-500">
                  {lang === 'pl' ? 'Wynik badania kontrolnego' : 'Follow-up clinical outcome'}
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {lang === 'pl' ? current.outcomeSummaryPl : current.outcomeSummaryEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenBooking(current.departmentId)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {lang === 'pl' ? 'Umów konsultację w tym oddziale' : 'Schedule consultation in this division'}
            </button>
          </div>
        </div>

        {/* Bottom Selector Strip for Direct Story Navigation */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100"
          role="tablist"
          aria-label={lang === 'pl' ? 'Wybierz historię pacjenta' : 'Select patient story'}
        >
          {TESTIMONIALS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(idx)}
                className={`text-left p-3.5 rounded-xl border transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="truncate">{item.patientName}</span>
                  <span className={`font-mono tabular-nums text-[11px] shrink-0 ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>
                    0{idx + 1}
                  </span>
                </div>
                <div className={`text-xs truncate mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {lang === 'pl' ? item.procedurePl : item.procedureEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
