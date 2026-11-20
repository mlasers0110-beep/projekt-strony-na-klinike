import React, { useState } from 'react';
import { ChevronDown, PhoneCall, Calendar } from 'lucide-react';

interface FaqAccordionProps {
  lang: 'pl' | 'en';
  onOpenBooking: () => void;
}

type FaqCategory = 'all' | 'laser' | 'booking';

interface FaqItem {
  id: string;
  category: 'laser' | 'booking';
  categoryLabelPl: string;
  categoryLabelEn: string;
  questionPl: string;
  questionEn: string;
  answerPl: string;
  answerEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'laser',
    categoryLabelPl: 'Zabiegi laserowe',
    categoryLabelEn: 'Laser Treatments',
    questionPl: 'Czy zabiegi laserowe LHP® i EVLT® 1470 nm są bolesne?',
    questionEn: 'Are LHP® and EVLT® 1470 nm laser procedures painful?',
    answerPl:
      'Zabiegi wykonywane są w nowoczesnym znieczuleniu miejscowym lub tumescencyjnym pod kontrolą USG, dzięki czemu pacjent nie odczuwa bólu w trakcie procedury. W przeciwieństwie do klasycznej chirurgii, energia lasera diodowego 1470 nm działa precyzyjnie wewnątrz tkanki bez rozległego cięcia, co znacząco ogranicza dyskomfort pozabiegowy.',
    answerEn:
      'Procedures are performed under modern local or ultrasound-guided tumescent anesthesia, ensuring the treatment itself is pain-free. Unlike conventional surgery, 1470 nm diode laser energy works precisely from within the tissue without wide incisions, keeping post-procedure discomfort minimal.',
  },
  {
    id: 'faq-2',
    category: 'laser',
    categoryLabelPl: 'Zabiegi laserowe',
    categoryLabelEn: 'Laser Treatments',
    questionPl: 'Jak szybko wrócę do domu i codziennych obowiązków po zabiegu laserowym?',
    questionEn: 'How soon can I go home and resume daily activities after a laser procedure?',
    answerPl:
      'Procedury laserowe w MCPL oraz oddziale flebologii realizujemy w trybie chirurgii jednego dnia. Większość pacjentów opuszcza klinikę o własnych siłach po 1–2 godzinach obserwacji. Powrót do pracy biurowej następuje zwykle po 1–3 dniach, a po zabiegu EVLT® zalecany jest krótki spacer jeszcze tego samego wieczoru.',
    answerEn:
      'Laser procedures in our MCPL proctology and phlebology units are performed on a same-day outpatient basis. Most patients leave the clinic independently after 1–2 hours of observation. Return to desk work typically takes 1–3 days, and after EVLT® vein ablation a short walk is recommended the same evening.',
  },
  {
    id: 'faq-3',
    category: 'laser',
    categoryLabelPl: 'Zabiegi laserowe',
    categoryLabelEn: 'Laser Treatments',
    questionPl: 'Jak przygotować się do konsultacji kwalifikacyjnej i zabiegu?',
    questionEn: 'How should I prepare for my qualification consultation and procedure?',
    answerPl:
      'Na pierwszą wizytę kwalifikacyjną wystarczy zabrać dotychczasową dokumentację medyczną i listę przyjmowanych leków (szczególnie przeciwkrzepliwych). Szczegółowe zalecenia przedzabiegowe — w tym ewentualny dobór pończochy uciskowej CCL2 przed EVLT® lub lekkostrawna dieta przed zabiegiem proktologicznym — pacjent otrzymuje w formie pisemnej bezpośrednio podczas kwalifikacji.',
    answerEn:
      'For your initial qualification visit, bring any prior medical records and a list of current medications (especially anticoagulants). Written pre-procedure instructions—such as CCL2 compression stocking fitting prior to EVLT® or light dietary guidance before proctology procedures—are provided directly at qualification.',
  },
  {
    id: 'faq-4',
    category: 'booking',
    categoryLabelPl: 'Rezerwacja i wizyty',
    categoryLabelEn: 'Bookings & Visits',
    questionPl: 'Czy mogę umówić zabieg od razu, czy wymagana jest wcześniejsza kwalifikacja?',
    questionEn: 'Can I book a procedure directly, or is a qualification consultation required first?',
    answerPl:
      'Każdy zabieg laserowy lub laparoskopowy poprzedza konsultacja kwalifikacyjna (z badaniem USG Doppler lub wideonoskopią HD). Pozwala to precyzyjnie ocenić anatomię, wykluczyć przeciwwskazania i ustalić wiążącą wycenę. W uzasadnionych przypadkach diagnostykę i drobne procedury ambulatoryjne można połączyć podczas jednej wizyty.',
    answerEn:
      'Every laser or laparoscopic procedure is preceded by a qualification consultation (including Doppler ultrasound or HD video anoscopy) to evaluate anatomy, rule out contraindications, and confirm exact pricing. For minor outpatient procedures, diagnostics and treatment can often be combined into a single visit.',
  },
  {
    id: 'faq-5',
    category: 'booking',
    categoryLabelPl: 'Rezerwacja i wizyty',
    categoryLabelEn: 'Bookings & Visits',
    questionPl: 'Jak zmienić lub odwołać zarezerwowany termin wizyty?',
    questionEn: 'How can I reschedule or cancel a booked appointment?',
    answerPl:
      'Termin konsultacji lub zabiegu można bezpłatnie przełożyć najpóźniej na 24 godziny przed planowaną godziną wizyty, dzwoniąc do rejestracji pod numer +48 22 123 45 67 lub odpowiadając na SMS z potwierdzeniem. W przypadku terminów zabiegowych prosimy o informację minimum 48 godzin wcześniej, abyśmy mogli przekazać miejsce innemu pacjentowi.',
    answerEn:
      'Consultations can be rescheduled free of charge up to 24 hours before your appointment by calling reception at +48 22 123 45 67 or replying to your SMS confirmation. For surgical or laser procedure slots, please notify us at least 48 hours in advance.',
  },
  {
    id: 'faq-6',
    category: 'booking',
    categoryLabelPl: 'Rezerwacja i wizyty',
    categoryLabelEn: 'Bookings & Visits',
    questionPl: 'Co obejmuje cena zabiegu i czy wizyta kontrolna jest wliczona?',
    questionEn: 'What does the procedure price include, and is the follow-up visit covered?',
    answerPl:
      'Podana cena procedury obejmuje znieczulenie miejscowe, jednorazowe włókno laserowe (np. radialne 1470 nm), opiekę pielęgniarską na sali obserwacyjnej oraz pierwszą wizytę kontrolną po zabiegu. Dedykowane wyroby medyczne do rekonwalescencji domowej (pończochy uciskowe, opatrunki hydrokoloidowe) można odebrać bezpośrednio w naszym Sklepie Medycznym przy recepcji.',
    answerEn:
      'Procedure pricing covers local anesthesia, single-use sterile laser fibers (such as 1470 nm radial fibers), recovery pod monitoring, and your first post-procedure follow-up visit. Dedicated home-recovery items (compression wear, hydrocolloid dressings) are available directly through our on-site Clinic Shop.',
  },
];

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ lang, onOpenBooking }) => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const filteredItems =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    const nextList =
      category === 'all' ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === category);
    if (nextList.length > 0 && !nextList.some((i) => i.id === openId)) {
      setOpenId(nextList[0].id);
    }
  };

  const categories: { id: FaqCategory; labelPl: string; labelEn: string }[] = [
    { id: 'all', labelPl: 'Wszystkie', labelEn: 'All Questions' },
    { id: 'laser', labelPl: 'Zabiegi laserowe', labelEn: 'Laser Treatments' },
    { id: 'booking', labelPl: 'Rezerwacja i wizyty', labelEn: 'Bookings & Visits' },
  ];

  return (
    <section
      id="faq"
      aria-label={lang === 'pl' ? 'Najczęściej zadawane pytania' : 'Frequently Asked Questions'}
      className="py-20 bg-slate-50 border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Editorial Intro & Direct Support CTA */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>{lang === 'pl' ? 'Baza Wiedzy Pacjenta' : 'Patient Guide'}</span>
                <span aria-hidden="true">·</span>
                <span>{lang === 'pl' ? 'Laser 1470 nm i rejestracja' : '1470 nm Laser & Bookings'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                {lang === 'pl' ? 'Najczęściej zadawane pytania' : 'Frequently asked questions'}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'pl'
                  ? 'Konkretne odpowiedzi dotyczące przebiegu zabiegów laserowych, rekonwalescencji oraz zasad umawiania i przekładania wizyt w naszej klinice.'
                  : 'Clear answers covering laser treatment comfort, recovery timelines, qualification exams, and appointment scheduling.'}
              </p>
            </div>

            {/* Category Filter Segmented Control */}
            <div
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-xl"
              role="group"
              aria-label={lang === 'pl' ? 'Filtruj pytania' : 'Filter questions'}
            >
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    aria-pressed={isSelected}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'pl' ? cat.labelPl : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Secondary Contact / Booking Support */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'pl'
                  ? 'Masz indywidualne pytanie medyczne przed kwalifikacją? Zespół rejestracji i lekarze odpowiedzą podczas konsultacji.'
                  : 'Have a specific clinical question before qualification? Our specialists will review your case during consultation.'}
              </p>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'pl' ? 'Umów konsultację' : 'Schedule Consultation'}</span>
                </button>

                <a
                  href="tel:+48221234567"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-700" />
                  <span className="font-mono tabular-nums">+48 22 123 45 67</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Hairline Accordion List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 px-6 sm:px-8 divide-y divide-slate-200">
            {filteredItems.map((item, idx) => {
              const isOpen = openId === item.id;
              const panelId = `${item.id}-panel`;
              const buttonId = `${item.id}-button`;

              return (
                <div key={item.id} className="py-5 sm:py-6">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => handleToggle(item.id)}
                      className="w-full text-left flex items-start justify-between gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg py-1"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono tabular-nums text-xs text-slate-400 pt-1 shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium text-slate-500">
                            {lang === 'pl' ? item.categoryLabelPl : item.categoryLabelEn}
                          </div>
                          <span className="block text-base sm:text-lg font-semibold text-slate-900 group-hover:text-sky-800 transition-colors leading-snug">
                            {lang === 'pl' ? item.questionPl : item.questionEn}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-600 group-hover:border-slate-300 group-hover:text-slate-900 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 bg-slate-900 text-white border-slate-900 group-hover:text-white' : 'bg-white'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pl-8 sm:pl-9 pr-4 text-sm text-slate-600 leading-relaxed">
                        {lang === 'pl' ? item.answerPl : item.answerEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
