import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { Department } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  initialDeptId?: string;
  initialTreatmentId?: string;
  lang: 'pl' | 'en';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  departments,
  initialDeptId,
  initialTreatmentId,
  lang
}) => {
  if (!isOpen) return null;

  const [deptId, setDeptId] = useState(initialDeptId || 'proctology');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('2026-08-10');
  const [time, setTime] = useState('10:00');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const activeDept = departments.find((d) => d.id === deptId) || departments[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-sky-700 via-indigo-700 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-sky-200" />
            <h3 className="text-xl font-bold tracking-tight">
              {lang === 'pl' ? 'Rezerwacja Wizyty Medycznej' : 'Medical Visit Booking'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900">
              {lang === 'pl' ? 'Wizyta Zarezerwowana!' : 'Appointment Booked!'}
            </h4>
            <p className="text-xs text-slate-600">
              {lang === 'pl' 
                ? 'Potwierdzenie wraz ze wskazówkami przygotowawczymi zostało wysłane na podany adres e-mail oraz SMS.' 
                : 'Confirmation with preparation guide has been sent to your email and phone.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Department Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'pl' ? 'Wybierz Dziedzinę' : 'Select Division'}
              </label>
              <select
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
              >
                {departments.filter(d => d.id !== 'shop').map((d) => (
                  <option key={d.id} value={d.id}>
                    {lang === 'pl' ? d.namePl : d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            {activeDept.doctors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'pl' ? 'Lekarz Specjalista' : 'Specialist Doctor'}
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">{lang === 'pl' ? 'Najbliższy wolny termin (Dowolny)' : 'First available'}</option>
                  {activeDept.doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.title})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'pl' ? 'Data Wizyty' : 'Visit Date'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'pl' ? 'Godzina' : 'Time'}
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  {['08:30', '09:15', '10:00', '11:30', '13:00', '15:15', '16:45', '18:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Info */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'pl' ? 'Imię i Nazwisko Pacjenta' : 'Full Patient Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jan Kowalski"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'pl' ? 'Telefon' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+48 600 000 000"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pacjent@med.pl"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-xs font-bold shadow-md hover:from-sky-500 hover:to-indigo-500 transition-all"
            >
              {lang === 'pl' ? 'Potwierdzam Rezerwację' : 'Confirm Visit Booking'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
