import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { Department, Treatment } from '../types';

interface DepartmentModalProps {
  department: Department | null;
  onClose: () => void;
  onBookTreatment: (departmentId: string, treatmentId?: string) => void;
  lang: 'pl' | 'en';
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  department,
  onClose,
  onBookTreatment,
  lang
}) => {
  if (!department) return null;

  const [activeTab, setActiveTab] = useState<'treatments' | 'doctors' | 'tech'>('treatments');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">
        
        {/* Header Banner with Prism Accent */}
        <div className={`relative p-6 sm:p-8 bg-gradient-to-r ${department.accentColor} text-white`}>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{department.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans">
              {lang === 'pl' ? department.namePl : department.name}
            </h2>

            <p className="text-sm sm:text-base text-white/90 font-medium">
              {department.subtitle}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('treatments')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'treatments'
                ? 'bg-white text-sky-800 border-t-2 border-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'pl' ? 'Zabiegi i Cennik' : 'Treatments & Pricing'}
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'doctors'
                ? 'bg-white text-sky-800 border-t-2 border-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'pl' ? 'Zespół Lekarski' : 'Medical Team'}
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'tech'
                ? 'bg-white text-sky-800 border-t-2 border-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'pl' ? 'Technologia & Standardy' : 'Tech & Standards'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: TREATMENTS */}
          {activeTab === 'treatments' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                {department.fullDesc}
              </p>

              <div className="grid grid-cols-1 gap-4">
                {department.treatments.map((t: Treatment) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          {t.title}
                        </h4>
                        {t.isPopular && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                            {lang === 'pl' ? 'Popularne' : 'Popular'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.description}
                      </p>

                      <div className="flex items-center gap-4 pt-1 text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          {t.durationMinutes} min
                        </span>
                        <span>•</span>
                        <span>{t.category}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900">
                          {t.pricePln} PLN
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onBookTreatment(department.id, t.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{lang === 'pl' ? 'Rezerwuj' : 'Book Now'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DOCTORS */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {department.doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4"
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-sky-700 font-semibold">
                        {doc.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doc.specialty}
                      </p>
                      <div className="inline-flex items-center gap-1 pt-1 text-[11px] font-semibold text-slate-600">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{doc.experienceYears} {lang === 'pl' ? 'lat doświadczenia' : 'years exp.'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TECH & STANDARDS */}
          {activeTab === 'tech' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200/60 space-y-3">
                <h4 className="text-sm font-bold text-sky-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>{lang === 'pl' ? 'Kluczowe Innowacje' : 'Key Innovation Standards'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {department.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-sky-600" />
            <span>{lang === 'pl' ? 'Bezpieczne procedury ambulatoryjne z szybkim powrotem do zdrowia.' : 'Outpatient precision procedures with rapid recovery protocols.'}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookTreatment(department.id);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold hover:from-sky-500 hover:to-indigo-500 shadow-md transition-all flex items-center gap-2"
          >
            <span>{lang === 'pl' ? 'Umów Konsultację' : 'Schedule Consultation'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
