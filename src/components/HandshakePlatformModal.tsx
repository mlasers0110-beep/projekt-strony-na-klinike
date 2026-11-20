import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  Lock,
  Unlock,
  QrCode,
  Camera,
  Keyboard,
  ShieldCheck,
  Sun,
  CreditCard,
  RotateCcw,
  Sliders,
  Check,
  MapPin,
  Clock,
  AlertTriangle,
  Smartphone,
  Tablet,
  ArrowRight,
  Send,
  TrendingUp,
  Cpu,
  ShoppingBag,
  FileText,
  Edit3,
  Printer
} from 'lucide-react';

interface HandshakePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'pl' | 'en';
}

type B2CView = 'locked' | 'qr' | 'waiting_auth' | 'connected' | 'passport_ready' | 'waitlist';
type B2BTab = 'radar' | 'handshake' | 'protocol' | 'garage' | 'upsell';
type HandshakeSubStep = 'idle' | 'scanning' | 'manual_pin' | 'confirm_gate' | 'empty_balance';

interface ActiveToken {
  code: string;
  pin: string;
  expiresAt: number;
  seed: number;
}

interface ClinicMachine {
  id: string;
  name: string;
  modalityPl: string;
  modalityEn: string;
  owned: boolean;
  basePricePln: number;
  aiEnergy: number;
  aiDepth: number;
  aiPulse: number;
  handpieces: string;
}

interface SessionRecord {
  patientId: string;
  patientName: string;
  unlockedAt: number;
  expiresAt: number;
  creditsCharged: number;
  device: string;
  energy: number;
  depth: number;
  pulseMs: number;
  zone: string;
  expertVerifiedBy: string | null;
  packageTotalPln: number;
  savedToCrm: boolean;
}

const PIN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateToken(): ActiveToken {
  const randChar = () => PIN_CHARS[Math.floor(Math.random() * PIN_CHARS.length)];
  const pin = `${randChar()}${randChar()}-${randChar()}${randChar()}`;
  const seed = Math.floor(Math.random() * 100000);
  return {
    code: `NGC-${pin}-${seed}`,
    pin,
    expiresAt: Date.now() + 30_000,
    seed,
  };
}

function playMedicalBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1920, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.17);
  } catch {
    // Ignore audio restrictions
  }
}

const DeterministicQR: React.FC<{ seed: number; size?: number }> = ({ seed, size = 160 }) => {
  const grid = useMemo(() => {
    const cells: boolean[][] = [];
    const dim = 21;
    let state = seed || 1337;
    const nextRand = () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };

    const isFinder = (r: number, c: number) =>
      (r < 7 && c < 7) || (r < 7 && c >= dim - 7) || (r >= dim - 7 && c < 7);

    const finderValue = (r: number, c: number) => {
      const lr = r >= dim - 7 ? r - (dim - 7) : r;
      const lc = c >= dim - 7 ? c - (dim - 7) : c;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      return lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    };

    for (let r = 0; r < dim; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < dim; c++) {
        if (isFinder(r, c)) {
          row.push(finderValue(r, c));
        } else if ((r === 7 && (c < 8 || c >= dim - 8)) || (c === 7 && (r < 8 || r >= dim - 8))) {
          row.push(false);
        } else {
          row.push(nextRand() > 0.48);
        }
      }
      cells.push(row);
    }
    return cells;
  }, [seed]);

  const cellSize = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Dynamiczny kod QR pacjenta" className="block">
      <rect width={size} height={size} fill="#ffffff" />
      {grid.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.25}
              height={cellSize + 0.25}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
};

const ClinicalWireframeMap: React.FC<{ activeZone: string; overrideActive: boolean }> = ({
  activeZone,
  overrideActive,
}) => {
  return (
    <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
        <span>3D VECTOR MESH · SUB-EPIDERMAL</span>
        <span className={overrideActive ? 'text-emerald-400' : 'text-sky-400'}>
          {overrideActive ? 'EXPERT CALIBRATED' : 'AI BASELINE'}
        </span>
      </div>
      <svg viewBox="0 0 220 220" className="w-40 h-40">
        {/* Background subtle coordinate grid */}
        {[40, 80, 120, 160, 200].map((pos) => (
          <g key={pos} stroke="#1e293b" strokeWidth="0.75">
            <line x1={pos} y1="10" x2={pos} y2="210" />
            <line x1="10" y1={pos} x2="210" y2={pos} />
          </g>
        ))}

        {/* Stylized clinical facial contour wireframe */}
        <path
          d="M110 22 C 68 22, 46 58, 48 104 C 50 148, 72 192, 110 202 C 148 192, 170 148, 172 104 C 174 58, 152 22, 110 22 Z"
          fill="none"
          stroke="#475569"
          strokeWidth="1.25"
        />
        <path
          d="M110 22 L 110 202 M 48 104 Q 110 116 172 104 M 56 72 Q 110 82 164 72 M 64 146 Q 110 162 156 146"
          fill="none"
          stroke="#334155"
          strokeWidth="0.9"
          strokeDasharray="3 3"
        />

        {/* Periorbital zone */}
        <ellipse
          cx="82"
          cy="86"
          rx="16"
          ry="9"
          fill={activeZone === 'periorbital' ? 'rgba(56, 189, 248, 0.25)' : 'none'}
          stroke={activeZone === 'periorbital' ? '#38bdf8' : '#64748b'}
          strokeWidth={activeZone === 'periorbital' ? '1.8' : '1'}
        />
        <ellipse
          cx="138"
          cy="86"
          rx="16"
          ry="9"
          fill={activeZone === 'periorbital' ? 'rgba(56, 189, 248, 0.25)' : 'none'}
          stroke={activeZone === 'periorbital' ? '#38bdf8' : '#64748b'}
          strokeWidth={activeZone === 'periorbital' ? '1.8' : '1'}
        />

        {/* Cheeks / Mid-face */}
        <ellipse
          cx="74"
          cy="124"
          rx="18"
          ry="15"
          fill={activeZone === 'cheeks' ? 'rgba(56, 189, 248, 0.25)' : 'none'}
          stroke={activeZone === 'cheeks' ? '#38bdf8' : '#475569'}
          strokeWidth={activeZone === 'cheeks' ? '1.8' : '1'}
        />
        <ellipse
          cx="146"
          cy="124"
          rx="18"
          ry="15"
          fill={activeZone === 'cheeks' ? 'rgba(56, 189, 248, 0.25)' : 'none'}
          stroke={activeZone === 'cheeks' ? '#38bdf8' : '#475569'}
          strokeWidth={activeZone === 'cheeks' ? '1.8' : '1'}
        />

        {/* Jawline / Oval */}
        <path
          d="M54 136 C 64 176, 86 196, 110 202 C 134 196, 156 176, 166 136"
          fill="none"
          stroke={activeZone === 'oval' ? (overrideActive ? '#34d399' : '#38bdf8') : '#475569'}
          strokeWidth={activeZone === 'oval' ? '3' : '1.2'}
        />

        {/* Vascular overlay */}
        <path
          d="M72 118 Q 84 126 78 138 M 148 118 Q 136 126 142 138"
          fill="none"
          stroke={activeZone === 'vascular' ? '#f59e0b' : '#475569'}
          strokeWidth={activeZone === 'vascular' ? '2.2' : '0.9'}
        />
      </svg>
      <div className="w-full pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Fotouszkodzenia UV · Unaczynienie</span>
        <span className="font-mono tabular-nums text-slate-300">ISO-PRO</span>
      </div>
    </div>
  );
};

const INITIAL_MACHINES: ClinicMachine[] = [
  {
    id: 'rf-hi-tech',
    name: 'RF Mikroigłowa Hi-Tech',
    modalityPl: 'Stymulacja fibroblastów · Gęstość i owal',
    modalityEn: 'Fibroblast stimulation · Density & contour',
    owned: true,
    basePricePln: 1600,
    aiEnergy: 64,
    aiDepth: 1.8,
    aiPulse: 120,
    handpieces: 'Kartridż 25-pin izolowany / 49-pin',
  },
  {
    id: 'laser-1470',
    name: 'Laser Diodowy 1470 nm',
    modalityPl: 'Przebudowa termiczna i unaczynienie',
    modalityEn: 'Thermal remodeling & vascular',
    owned: true,
    basePricePln: 1900,
    aiEnergy: 48,
    aiDepth: 2.2,
    aiPulse: 85,
    handpieces: 'Światłowód radialny 400 µm / skaner frakcyjny',
  },
  {
    id: 'hifu-focus',
    name: 'HIFU Focus 4D',
    modalityPl: 'Głęboki lifting SMAS bez naruszenia naskórka',
    modalityEn: 'Deep SMAS lifting non-ablative',
    owned: false,
    basePricePln: 2400,
    aiEnergy: 72,
    aiDepth: 3.0,
    aiPulse: 150,
    handpieces: 'Przetworniki 1.5 mm / 3.0 mm / 4.5 mm',
  },
  {
    id: 'pico-laser',
    name: 'Laser Pikosekundowy',
    modalityPl: 'Przebarwienia i przebudowa tekstury',
    modalityEn: 'Pigmentation & texture remodeling',
    owned: true,
    basePricePln: 1450,
    aiEnergy: 42,
    aiDepth: 1.2,
    aiPulse: 55,
    handpieces: 'Soczewka dyfrakcyjna MLA 532/1064 nm',
  },
];

const TARGET_ZONES = [
  { id: 'oval', labelPl: 'Owal i linia żuchwy', labelEn: 'Jawline & Lower Contour' },
  { id: 'cheeks', labelPl: 'Strefa policzkowa', labelEn: 'Mid-Face & Cheeks' },
  { id: 'periorbital', labelPl: 'Okolica oczu', labelEn: 'Periorbital Zone' },
  { id: 'vascular', labelPl: 'Strefa naczyniowa (płytka)', labelEn: 'Shallow Vascular Zone' },
];

const UPSELL_ADDONS = [
  {
    id: 'led-exosomes',
    titlePl: 'Synergia Premium: Lampa LED + Maska z Egzosomami',
    titleEn: 'Premium Synergy: LED Therapy + Exosome Mask',
    benefitPl: 'Skraca czas gojenia z 4 dni do 1 dnia',
    benefitEn: 'Cuts recovery downtime from 4 days to 1 day',
    pricePln: 450,
  },
  {
    id: 'post-care-cream',
    titlePl: 'Krem barierowy Cicatrizel® + SPF 50 (półka gabinetowa)',
    titleEn: 'Cicatrizel® Barrier Cream + SPF 50 (clinic shelf)',
    benefitPl: 'Ochrona bariery hydrolipidowej przez 14 dni po zabiegu',
    benefitEn: '14-day post-procedure barrier protection',
    pricePln: 220,
  },
];

const NEARBY_LEADS = [
  { id: 'lead-1', name: 'Anna (28 lat)', distance: '1.2 km', goalPl: 'Utrata napięcia owalu', valuePln: 2050, ready: true },
  { id: 'lead-2', name: 'Karolina (36 lat)', distance: '3.4 km', goalPl: 'Fotouszkodzenia + gęstość', valuePln: 1900, ready: false },
  { id: 'lead-3', name: 'Magdalena (42 lata)', distance: '6.8 km', goalPl: 'Stymulacja fibroblastów', valuePln: 2450, ready: false },
];

export const HandshakePlatformModal: React.FC<HandshakePlatformModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  // B2C Patient App state
  const [b2cView, setB2cView] = useState<B2CView>('locked');
  const [token, setToken] = useState<ActiveToken>(() => generateToken());
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [waitlistCity, setWaitlistCity] = useState('Rzeszów');
  const [favoriteClinic, setFavoriteClinic] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // B2B Tablet PRO state
  const [activeTab, setActiveTab] = useState<B2BTab>('radar');
  const [handshakeStep, setHandshakeStep] = useState<HandshakeSubStep>('idle');
  const [credits, setCredits] = useState<number>(44);
  const [roiPipelinePln, setRoiPipelinePln] = useState<number>(14500);
  const [manualPinInput, setManualPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [protocolUnlocked, setProtocolUnlocked] = useState(false);

  // Ekran 4: Virtual Garage (Clinic Device Fleet)
  const [machines, setMachines] = useState<ClinicMachine[]>(INITIAL_MACHINES);
  const ownedMachines = useMemo(() => machines.filter((m) => m.owned), [machines]);

  // Ekran 3: Expert Override Protocol Creator
  const [specialistName, setSpecialistName] = useState('mgr Aleksandra Nowak');
  const [selectedMachineId, setSelectedMachineId] = useState<string>(INITIAL_MACHINES[0].id);
  const [selectedZone, setSelectedZone] = useState<string>(TARGET_ZONES[0].id);
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [expertVerified, setExpertVerified] = useState(false);
  const [energy, setEnergy] = useState<number>(INITIAL_MACHINES[0].aiEnergy);
  const [depth, setDepth] = useState<number>(INITIAL_MACHINES[0].aiDepth);
  const [pulseMs, setPulseMs] = useState<number>(INITIAL_MACHINES[0].aiPulse);
  const [palpationNote, setPalpationNote] = useState(
    'W badaniu palpacyjnym widoczne płytkie unaczynienie policzków — parametry złagodzone dla 100% bezpieczeństwa i szybkiego gojenia.'
  );

  // Ekran 5: Upselling & Skin Passport
  const [packageTier, setPackageTier] = useState<'standard' | 'premium'>('premium');
  const [includeShelfCream, setIncludeShelfCream] = useState(true);
  const [passportSent, setPassportSent] = useState(false);

  const patient = {
    id: 'pat-anna-28',
    name: 'Anna',
    age: 28,
  };

  // Keep selectedMachineId always synced to an owned machine via Smart Mapping
  useEffect(() => {
    if (ownedMachines.length > 0 && !ownedMachines.some((m) => m.id === selectedMachineId)) {
      const fallback = ownedMachines[0];
      setSelectedMachineId(fallback.id);
      setEnergy(fallback.aiEnergy);
      setDepth(fallback.aiDepth);
      setPulseMs(fallback.aiPulse);
      setIsOverrideMode(false);
      setExpertVerified(false);
    }
  }, [ownedMachines, selectedMachineId]);

  const currentMachine =
    ownedMachines.find((m) => m.id === selectedMachineId) || ownedMachines[0] || machines[0];

  const activeSession12h = useMemo(() => {
    const now = Date.now();
    return sessions.find((s) => s.patientId === patient.id && s.expiresAt > now) || null;
  }, [sessions, patient.id]);

  // Total package valuation for Ekran 5
  const basePrice = currentMachine ? currentMachine.basePricePln : 1600;
  const premiumSynergyCost = packageTier === 'premium' ? UPSELL_ADDONS[0].pricePln : 0;
  const shelfCreamCost = includeShelfCream ? UPSELL_ADDONS[1].pricePln : 0;
  const totalPackagePln = basePrice + premiumSynergyCost + shelfCreamCost;

  // 30-second dynamic QR timer
  useEffect(() => {
    if (!isOpen || b2cView !== 'qr') return;
    const interval = window.setInterval(() => {
      const remaining = Math.ceil((token.expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        setToken(generateToken());
        setSecondsLeft(30);
      } else {
        setSecondsLeft(remaining);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [isOpen, b2cView, token.expiresAt]);

  const handleGenerateKey = useCallback(() => {
    setToken(generateToken());
    setSecondsLeft(30);
    setB2cView('qr');
    setPinError(null);
  }, []);

  const proceedToGate = useCallback(() => {
    playMedicalBeep();
    if (credits <= 0 && !activeSession12h) {
      setB2cView('waiting_auth');
      setHandshakeStep('empty_balance');
    } else {
      setHandshakeStep('confirm_gate');
    }
  }, [credits, activeSession12h]);

  const handleStartQrScan = () => {
    setActiveTab('handshake');
    setPinError(null);
    if (b2cView !== 'qr') {
      handleGenerateKey();
    }
    setHandshakeStep('scanning');
    window.setTimeout(() => {
      proceedToGate();
    }, 800);
  };

  const handleManualPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = manualPinInput.trim().toUpperCase();
    if (b2cView !== 'qr') {
      setPinError(
        lang === 'pl'
          ? 'Pacjentka musi najpierw wygenerować klucz QR/PIN w swojej aplikacji.'
          : 'Patient must generate an active QR/PIN first.'
      );
      return;
    }
    if (normalized === token.pin) {
      setPinError(null);
      setManualPinInput('');
      proceedToGate();
    } else {
      setPinError(
        lang === 'pl'
          ? `Nieprawidłowy lub wygasły PIN. Aktywny kod: ${token.pin}`
          : `Invalid or expired PIN. Active code: ${token.pin}`
      );
    }
  };

  const handleEmergencyTopUp = () => {
    setCredits((prev) => prev + 10);
    setHandshakeStep('confirm_gate');
  };

  const handleUnlockProtocol = () => {
    const isFreeRescan = Boolean(activeSession12h);
    if (!isFreeRescan && credits <= 0) {
      setB2cView('waiting_auth');
      setHandshakeStep('empty_balance');
      return;
    }

    const charge = isFreeRescan ? 0 : 1;
    if (charge > 0) {
      setCredits((prev) => Math.max(0, prev - charge));
    }

    const now = Date.now();
    if (!isFreeRescan && currentMachine) {
      setSessions((prev) => [
        {
          patientId: patient.id,
          patientName: `${patient.name} (${patient.age} lat)`,
          unlockedAt: now,
          expiresAt: now + 12 * 60 * 60 * 1000,
          creditsCharged: charge,
          device: currentMachine.name,
          energy,
          depth,
          pulseMs,
          zone: selectedZone,
          expertVerifiedBy: null,
          packageTotalPln: totalPackagePln,
          savedToCrm: false,
        },
        ...prev,
      ]);
    }

    setProtocolUnlocked(true);
    setHandshakeStep('idle');
    setB2cView('connected');
    setActiveTab('protocol');
  };

  const handleSelectMachine = (machine: ClinicMachine) => {
    setSelectedMachineId(machine.id);
    setEnergy(machine.aiEnergy);
    setDepth(machine.aiDepth);
    setPulseMs(machine.aiPulse);
    setExpertVerified(false);
  };

  const handleToggleMachineOwned = (id: string) => {
    setMachines((prev) => {
      const target = prev.find((m) => m.id === id);
      const ownedCount = prev.filter((m) => m.owned).length;
      if (target?.owned && ownedCount <= 1) return prev; // Keep at least 1 clinic device active
      return prev.map((m) => (m.id === id ? { ...m, owned: !m.owned } : m));
    });
  };

  const handleConfirmExpertOverride = () => {
    setExpertVerified(true);
    setSessions((prev) =>
      prev.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              device: currentMachine.name,
              energy,
              depth,
              pulseMs,
              zone: selectedZone,
              expertVerifiedBy: specialistName,
            }
          : s
      )
    );
  };

  const handleSendSkinPassport = () => {
    setPassportSent(true);
    setB2cView('passport_ready');
    setRoiPipelinePln((prev) => prev + totalPackagePln);
    setSessions((prev) =>
      prev.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              packageTotalPln: totalPackagePln,
              expertVerifiedBy: specialistName,
              savedToCrm: true,
            }
          : s
      )
    );
  };

  const handleResetDemo = () => {
    setB2cView('locked');
    setActiveTab('radar');
    setHandshakeStep('idle');
    setCredits(44);
    setRoiPipelinePln(14500);
    setSessions([]);
    setProtocolUnlocked(false);
    setIsOverrideMode(false);
    setExpertVerified(false);
    setPassportSent(false);
    setWaitlistSubmitted(false);
    setManualPinInput('');
    setPinError(null);
  };

  if (!isOpen) return null;

  const progressPct = Math.max(0, Math.min(100, (secondsLeft / 30) * 100));

  const tabs: { id: B2BTab; label: string; icon: React.ReactNode; stepNum: string }[] = [
    { id: 'radar', stepNum: '1', label: lang === 'pl' ? 'Radar Pieniędzy' : 'ROI Radar', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'handshake', stepNum: '2', label: lang === 'pl' ? 'Most QR/PIN' : 'Handshake', icon: <QrCode className="w-3.5 h-3.5" /> },
    { id: 'protocol', stepNum: '3', label: lang === 'pl' ? 'Expert Override' : 'Protocol', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'garage', stepNum: '4', label: lang === 'pl' ? 'Wirtualny Garaż' : 'Device Park', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'upsell', stepNum: '5', label: lang === 'pl' ? 'Paszport Skóry' : 'Upsell & PDF', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="PRO-PANEL i Aplikacja Pacjenta B2C"
    >
      <div className="relative w-full max-w-7xl bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Workspace Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-white border-b border-slate-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Next Generation Clinic</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'pl' ? 'Aplikacja B2C + Tablet PRO-PANEL (Ekrany 1–5)' : 'B2C App + Tablet PRO-PANEL (Screens 1–5)'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {lang === 'pl'
                ? 'Architektura PRO-PANEL i The Handshake'
                : 'PRO-PANEL Architecture & The Handshake'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCredits(0);
                setSessions([]);
                setProtocolUnlocked(false);
                setActiveTab('handshake');
                setHandshakeStep('idle');
                handleGenerateKey();
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors whitespace-nowrap"
            >
              {lang === 'pl' ? 'Testuj: Saldo 0' : 'Test: 0 Credits'}
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={lang === 'pl' ? 'Zamknij panel' : 'Close panel'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual-Device Workspace Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ======================================================= */}
            {/* LEFT: B2C PATIENT MOBILE APP (KROK 0 + HANDSHAKE)       */}
            {/* ======================================================= */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <span>{lang === 'pl' ? 'Aplikacja B2C (Telefon)' : 'Patient App (B2C)'}</span>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setB2cView(b2cView === 'waitlist' ? 'locked' : b2cView)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      b2cView !== 'waitlist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'pl' ? 'Krok 0 / QR' : 'Step 0 / QR'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setB2cView('waitlist')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      b2cView === 'waitlist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Waitlist
                  </button>
                </div>
              </div>

              <div
                className={`flex-1 rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
                  b2cView === 'qr'
                    ? 'bg-white border-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.18)]'
                    : b2cView === 'connected'
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Phone Status Bar */}
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between text-xs ${
                    b2cView === 'connected' ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span className="font-semibold">Anna (28) · Skin Scanner</span>
                  {b2cView === 'qr' ? (
                    <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                      <Sun className="w-3.5 h-3.5" />
                      <span>100%</span>
                    </span>
                  ) : (
                    <span>MDR Safe</span>
                  )}
                </div>

                {/* Phone Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  {/* KROK 0: Blurred Protocol Behind Digital Padlock */}
                  {b2cView === 'locked' && (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="text-xs text-slate-500">
                            {lang === 'pl' ? 'Krok 0 · Wynik wstępny (zablokowany)' : 'Step 0 · Preliminary Scan (Locked)'}
                          </div>
                          <h3 className="text-base font-bold text-slate-900">
                            {lang === 'pl' ? 'Wykryto utratę napięcia strukturalnego' : 'Structural tension drop detected'}
                          </h3>
                        </div>

                        {/* Blurred Protocol Box with Big Digital Padlock */}
                        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 overflow-hidden">
                          {/* Blurred mock protocol underneath */}
                          <div className="space-y-2 blur-[5px] select-none pointer-events-none opacity-65">
                            <div className="text-xs font-bold text-slate-800">Rekomendacja: RF Mikroigłowa / 1470 nm</div>
                            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                              <div className="p-2 bg-white rounded border">64 J/cm²</div>
                              <div className="p-2 bg-white rounded border">1.8 mm</div>
                              <div className="p-2 bg-white rounded border">120 ms</div>
                            </div>
                            <div className="text-xs text-slate-600">Plan gojenia: 4 dni · 3 sesje co 28 dni</div>
                          </div>

                          {/* Digital Padlock Overlay */}
                          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center mb-2">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="text-xs font-bold text-slate-900">
                              {lang === 'pl' ? 'Protokół i parametry ukryte' : 'Protocol & Parameters Locked'}
                            </div>
                          </div>
                        </div>

                        {/* Protective Psychological Message Defending Expert Authority */}
                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          {lang === 'pl'
                            ? '„Procedury Hi-Tech to potężne technologie inwazyjne. Złe użycie grozi powikłaniami. Twój cyfrowy profil musi zostać zweryfikowany palpacyjnie pod kątem ukrytych przeciwwskazań zdrowotnych.”'
                            : '"Hi-Tech procedures are powerful technologies. Improper settings carry risks. Your digital profile must be palpation-verified for hidden contraindications by an authorized specialist."'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateKey}
                        className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Unlock className="w-4 h-4 shrink-0" />
                        <span>
                          {lang === 'pl' ? 'Wygeneruj Klucz dla Eksperta' : 'Generate Key for Expert'}
                        </span>
                      </button>
                    </>
                  )}

                  {/* KROK 1: Dynamic 30s QR + Backup PIN */}
                  {b2cView === 'qr' && (
                    <>
                      <div className="text-center space-y-3.5">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-900">
                            {lang === 'pl' ? 'Pokaż ekran Ekspertowi na fotelu' : 'Show Screen to Specialist'}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {lang === 'pl' ? 'Jasność ekranu 100% · Token ważny 30s' : '100% Brightness · 30s Rolling Token'}
                          </p>
                        </div>

                        <div className="inline-flex p-3.5 rounded-2xl bg-white border-2 border-slate-900">
                          <DeterministicQR seed={token.seed} size={156} />
                        </div>

                        <div className="max-w-[220px] mx-auto space-y-1">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>{lang === 'pl' ? 'Odświeżenie' : 'Refresh'}</span>
                            <span className="font-mono font-semibold tabular-nums text-slate-900">
                              00:{secondsLeft.toString().padStart(2, '0')}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-full bg-sky-600 transition-all duration-200" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[11px] text-slate-500">
                            {lang === 'pl' ? 'Awaryjny kod PIN (Plan B)' : 'Backup PIN (Plan B)'}
                          </div>
                          <div className="font-mono text-2xl font-bold tracking-[0.22em] text-slate-900 tabular-nums">
                            {token.pin}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setB2cView('locked')}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                      >
                        {lang === 'pl' ? 'Wróć do podglądu' : 'Back'}
                      </button>
                    </>
                  )}

                  {/* Edge Case 2: Discreet Waiting Screen (Zero error exposure) */}
                  {b2cView === 'waiting_auth' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-4">
                      <div className="w-11 h-11 rounded-full border-2 border-slate-200 border-t-sky-600 animate-spin" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900">
                          {lang === 'pl' ? 'Oczekiwanie na autoryzację Eksperta...' : 'Awaiting Expert Authorization...'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {lang === 'pl' ? 'Prosimy o chwilę cierpliwości.' : 'Please wait a moment.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* KROK 4: Sterile Deep Navy Handshake Lock Screen */}
                  {b2cView === 'connected' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">
                          {lang === 'pl' ? 'Dane przejęte przez Autoryzowanego Eksperta' : 'Profile Transferred to Authorized Expert'}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {lang === 'pl'
                            ? `Twój profil analizuje teraz ${specialistName} w Next Generation Clinic. Zablokuj ekran telefonu i skup się na konsultacji.`
                            : `Your profile is now reviewed by ${specialistName} at Next Generation Clinic. Lock your phone and focus on your consultation.`}
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800 w-full">
                        {lang === 'pl' ? 'Sesja gabinetowa aktywna (12h)' : 'In-clinic session active (12h)'}
                      </div>
                    </div>
                  )}

                  {/* EKRAN 5 OUTPUT: Skin Passport Delivered to Patient Phone */}
                  {b2cView === 'passport_ready' && (
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="w-4 h-4" />
                          <span>{lang === 'pl' ? 'Paszport Skóry · Gotowy (PDF)' : 'Skin Passport · Ready (PDF)'}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {lang === 'pl' ? 'Twój Zatwierdzony Plan Zabiegowy' : 'Your Approved Treatment Plan'}
                        </h3>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">{lang === 'pl' ? 'Technologia' : 'Device'}</span>
                            <span className="font-semibold text-slate-900">{currentMachine.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">{lang === 'pl' ? 'Pakiet' : 'Package'}</span>
                            <span className="font-semibold text-slate-900">
                              {packageTier === 'premium' ? 'Premium (LED + Egzosomy)' : 'Standard'}
                            </span>
                          </div>
                          {includeShelfCream && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">{lang === 'pl' ? 'Pielęgnacja domowa' : 'Home Care'}</span>
                              <span className="font-semibold text-slate-900">Cicatrizel® + SPF 50</span>
                            </div>
                          )}
                          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                            <span>{lang === 'pl' ? 'Wycena całkowita' : 'Total Quote'}</span>
                            <span className="font-mono tabular-nums">{totalPackagePln.toLocaleString('pl-PL')} PLN</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                          {lang === 'pl'
                            ? `Zweryfikowano i zoptymalizowano przez: ${specialistName}. Zgody zabiegowe i zalecenia pozabiegowe zapisane w Twojej aplikacji.`
                            : `Verified & optimized by: ${specialistName}. Medical consents and post-care instructions saved.`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold inline-flex items-center justify-center gap-2"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{lang === 'pl' ? 'Pobierz / Drukuj Paszport PDF' : 'Print / Save PDF Passport'}</span>
                      </button>
                    </div>
                  )}

                  {/* WAITLIST HACK (Demand Capture) */}
                  {b2cView === 'waitlist' && (
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Demand Capture · Waitlist Hack</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {lang === 'pl'
                            ? `Certyfikujemy pierwsze kliniki w: ${waitlistCity}`
                            : `Certifying first clinics in ${waitlistCity}`}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'pl'
                            ? 'Jesteś 145. osobą w kolejce. Podaj nazwę swojego ulubionego salonu, a wyślemy im priorytetowe zaproszenie do Panelu PRO.'
                            : 'You are #145 in queue. Nominate your preferred local salon for a priority Panel PRO invite.'}
                        </p>
                        {!waitlistSubmitted ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (favoriteClinic.trim()) setWaitlistSubmitted(true);
                            }}
                            className="space-y-2.5"
                          >
                            <input
                              type="text"
                              value={waitlistCity}
                              onChange={(e) => setWaitlistCity(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                              placeholder="Miasto"
                            />
                            <input
                              type="text"
                              required
                              value={favoriteClinic}
                              onChange={(e) => setFavoriteClinic(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                              placeholder={lang === 'pl' ? 'Nazwa ulubionego gabinetu...' : 'Clinic name...'}
                            />
                            <button
                              type="submit"
                              className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{lang === 'pl' ? 'Wyślij zaproszenie B2B' : 'Send B2B Invite'}</span>
                            </button>
                          </form>
                        ) : (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                            {lang === 'pl'
                              ? `Zapisano lead B2B: ${favoriteClinic} (${waitlistCity}) — 146 oczekujących pacjentek.`
                              : `Logged B2B lead: ${favoriteClinic} (${waitlistCity}) — 146 waiting patients.`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* RIGHT: B2B TABLET PRO-PANEL (EKRANY 1 - 5)              */}
            {/* ======================================================= */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Tablet className="w-4 h-4 text-slate-600" />
                  <span>{lang === 'pl' ? 'PRO-PANEL Eksperta (iPad B2B)' : 'Expert PRO-PANEL (B2B Tablet)'}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>
                    {lang === 'pl' ? 'Kredyty:' : 'Credits:'}{' '}
                    <strong className="font-mono tabular-nums text-slate-900">{credits}</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    ROI:{' '}
                    <strong className="font-mono tabular-nums text-emerald-700">
                      {roiPipelinePln.toLocaleString('pl-PL')} PLN
                    </strong>
                  </span>
                  {activeSession12h && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        12h (0 kr.)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Tablet Container */}
              <div className="flex-1 rounded-2xl bg-white border border-slate-200 flex flex-col overflow-hidden">
                {/* 5-Screen Tablet Navigation Bar */}
                <div className="px-3 py-2.5 bg-slate-900 text-white flex items-center gap-1 overflow-x-auto">
                  {tabs.map((t) => {
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-white text-slate-900 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-mono text-[10px] opacity-70">{t.stepNum}.</span>
                        {t.icon}
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tablet Screen Viewport */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                  {/* ------------------------------------------------- */}
                  {/* EKRAN 1: DASHBOARD "RADAR PIENIĘDZY"              */}
                  {/* ------------------------------------------------- */}
                  {activeTab === 'radar' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-xs text-slate-500">
                            {lang === 'pl' ? 'Kalkulator ROI (ten miesiąc)' : 'Monthly ROI Pipeline'}
                          </div>
                          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                            {roiPipelinePln.toLocaleString('pl-PL')} PLN
                          </div>
                          <div className="text-xs text-emerald-700 font-medium">
                            {lang === 'pl' ? 'Potencjalna wartość zabiegów z apki' : 'Estimated treatment revenue'}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-xs text-slate-500">
                            {lang === 'pl' ? 'Radar Gorących Szans (10 km)' : 'Hot Leads Radar (10 km)'}
                          </div>
                          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">45</div>
                          <div className="text-xs text-slate-600">
                            {lang === 'pl' ? 'Skanów dziś · 3 prośby o odblokowanie' : 'Scans today · 3 unlock requests'}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-xs text-slate-500">
                            {lang === 'pl' ? 'Aktywny Park Maszynowy' : 'Active Clinic Fleet'}
                          </div>
                          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                            {ownedMachines.length} / {machines.length}
                          </div>
                          <div className="text-xs text-sky-700 font-medium">
                            {lang === 'pl' ? 'Smart Mapping aktywny' : 'Smart Mapping enabled'}
                          </div>
                        </div>
                      </div>

                      {/* Hot Leads Queue */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-slate-900">
                            {lang === 'pl'
                              ? 'Prośby o odblokowanie profilu w promieniu 10 km'
                              : 'Nearby Profile Unlock Requests (10 km)'}
                          </h3>
                          <span className="text-xs text-slate-500">Warszawa · Centrum</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {NEARBY_LEADS.map((lead) => (
                            <div key={lead.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {lead.name} <span className="text-slate-400 font-normal">· {lead.distance}</span>
                                </div>
                                <div className="text-slate-500">{lead.goalPl}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-mono font-semibold tabular-nums text-slate-800">
                                  ~{lead.valuePln.toLocaleString('pl-PL')} PLN
                                </span>
                                {lead.ready ? (
                                  <button
                                    type="button"
                                    onClick={handleStartQrScan}
                                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors whitespace-nowrap"
                                  >
                                    {lang === 'pl' ? 'Na fotelu — Skanuj QR' : 'In Chair — Scan QR'}
                                  </button>
                                ) : (
                                  <span className="text-slate-400 font-medium">
                                    {lang === 'pl' ? 'W kolejce' : 'Queued'}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------- */}
                  {/* EKRAN 2: MOST TRANSFEROWY ("PRZEJĘCIE KONTROLI")  */}
                  {/* ------------------------------------------------- */}
                  {activeTab === 'handshake' && (
                    <div className="flex-1 flex flex-col justify-center">
                      {handshakeStep === 'idle' && (
                        <div className="max-w-md mx-auto text-center space-y-5 py-4">
                          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                            <QrCode className="w-7 h-7" />
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-slate-900">
                              {lang === 'pl' ? 'Skaner Autorytetu (The Handshake)' : 'Authority Scanner (The Handshake)'}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {lang === 'pl'
                                ? 'Przejmij zaszyfrowany profil z telefonu pacjentki przez dynamiczny kod QR lub awaryjny 4-znakowy kod PIN.'
                                : 'Capture the encrypted profile via dynamic 30s QR or 4-character backup PIN.'}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={handleStartQrScan}
                              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                            >
                              <Camera className="w-4 h-4" />
                              <span>{lang === 'pl' ? 'Skanuj Pacjenta' : 'Scan Patient'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPinError(null);
                                setHandshakeStep('manual_pin');
                              }}
                              className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                            >
                              <Keyboard className="w-4 h-4" />
                              <span>{lang === 'pl' ? 'Wpisz PIN (Plan B)' : 'Enter PIN (Plan B)'}</span>
                            </button>
                          </div>
                          {activeSession12h && (
                            <p className="text-xs text-emerald-700 font-medium">
                              {lang === 'pl'
                                ? 'Zasada 12 Godzin: ponowne zeskanowanie Anny otworzy panel bezpłatnie (0 kredytów).'
                                : '12-Hour Rule: re-scanning Anna opens the panel for 0 credits.'}
                            </p>
                          )}
                        </div>
                      )}

                      {handshakeStep === 'scanning' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <div className="relative w-48 h-48 rounded-2xl bg-slate-900 border-2 border-sky-500 flex items-center justify-center">
                            <div className="w-32 h-32 border-2 border-white/60 rounded-xl" />
                            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-sky-400" />
                          </div>
                          <p className="text-xs font-medium text-slate-700">
                            {lang === 'pl' ? 'Przejmowanie zaszyfrowanego profilu...' : 'Capturing encrypted profile...'}
                          </p>
                        </div>
                      )}

                      {handshakeStep === 'manual_pin' && (
                        <div className="max-w-sm mx-auto w-full space-y-4 py-4">
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">
                              {lang === 'pl' ? 'Plan B: Ręczne wpisanie kodu PIN' : 'Plan B: Manual PIN'}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {lang === 'pl'
                                ? 'Wpisz 4-znakowy kod PIN z ekranu pacjentki (np. X4-B9).'
                                : 'Enter the 4-character backup PIN from the patient phone.'}
                            </p>
                          </div>
                          <form onSubmit={handleManualPinSubmit} className="space-y-3">
                            <input
                              type="text"
                              value={manualPinInput}
                              onChange={(e) => setManualPinInput(e.target.value.toUpperCase())}
                              placeholder={b2cView === 'qr' ? token.pin : 'XX-XX'}
                              maxLength={5}
                              className="w-full px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.2em] uppercase rounded-xl border border-slate-300"
                            />
                            {pinError && <p className="text-xs text-rose-600 font-medium">{pinError}</p>}
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setHandshakeStep('idle')}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600"
                              >
                                {lang === 'pl' ? 'Wróć' : 'Back'}
                              </button>
                              <button
                                type="submit"
                                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                              >
                                {lang === 'pl' ? 'Weryfikuj PIN' : 'Verify PIN'}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {handshakeStep === 'confirm_gate' && (
                        <div className="max-w-md mx-auto w-full space-y-4 py-2">
                          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{lang === 'pl' ? 'Zapora Finansowa · Potwierdzenie' : 'Financial Confirmation Gate'}</span>
                              <span className="font-mono tabular-nums">{token.pin}</span>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">
                                {lang === 'pl' ? 'Zeskanowano profil wstępny:' : 'Scanned profile:'}
                              </div>
                              <div className="text-lg font-bold text-slate-900">
                                {patient.name} ({patient.age} {lang === 'pl' ? 'lat' : 'y/o'})
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-between text-sm">
                              <span className="text-slate-600">{lang === 'pl' ? 'Opłata' : 'Charge'}</span>
                              <span className="font-mono font-bold tabular-nums text-slate-900">
                                {activeSession12h ? '0 Kredytów (Sesja 12h)' : '-1 Kredyt (25 PLN)'}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>{lang === 'pl' ? 'Stan konta po operacji' : 'Balance after unlock'}</span>
                              <span className="font-mono font-semibold tabular-nums text-slate-800">
                                {activeSession12h ? credits : Math.max(0, credits - 1)} {lang === 'pl' ? 'kredytów' : 'credits'}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setHandshakeStep('idle')}
                              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-600"
                            >
                              {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={handleUnlockProtocol}
                              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
                            >
                              <Unlock className="w-4 h-4" />
                              <span>
                                {activeSession12h
                                  ? lang === 'pl'
                                    ? 'Otwórz Tryb Kliniczny (0 Kredytów)'
                                    : 'Open Clinical Mode (0 Credits)'
                                  : lang === 'pl'
                                  ? 'Odblokuj Protokół (-1 Kredyt)'
                                  : 'Unlock Protocol (-1 Credit)'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {handshakeStep === 'empty_balance' && (
                        <div className="max-w-md mx-auto w-full space-y-4 py-4">
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              <span>{lang === 'pl' ? 'Brak żetonów (komunikat dyskretny)' : 'Zero credits (discreet notice)'}</span>
                            </div>
                            <p className="text-xs text-amber-900/80 leading-relaxed">
                              {lang === 'pl'
                                ? 'Pacjentka widzi wyłącznie neutralny ekran oczekiwania. Doładuj pakiet ratunkowy (10 kredytów), aby natychmiast odblokować profil.'
                                : 'Patient sees a neutral waiting screen. Top up 10 emergency credits to continue.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleEmergencyTopUp}
                            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>
                              {lang === 'pl'
                                ? 'Doładuj pakiet ratunkowy (10 kredytów · Apple Pay / BLIK)'
                                : 'Emergency Top-Up (10 Credits · Apple Pay / BLIK)'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ------------------------------------------------- */}
                  {/* EKRAN 3: KREATOR PROTOKOŁU ("EXPERT OVERRIDE")    */}
                  {/* ------------------------------------------------- */}
                  {activeTab === 'protocol' && (
                    <div className="space-y-4">
                      {!protocolUnlocked && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
                          <span>
                            {lang === 'pl'
                              ? 'Profil pacjentki nie został jeszcze zeskanowany w Mostku Transferowym (Ekran 2).'
                              : 'Patient profile has not been unlocked via Handshake yet.'}
                          </span>
                          <button
                            type="button"
                            onClick={handleStartQrScan}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold"
                          >
                            {lang === 'pl' ? 'Skanuj QR teraz' : 'Scan QR Now'}
                          </button>
                        </div>
                      )}

                      {/* Top bar with Smart Mapped Device & BIG Expert Override button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <div className="text-xs text-slate-500">
                            {lang === 'pl'
                              ? 'Smart Mapping aktywny · pokazano wyłącznie sprzęt z Twojego Garażu'
                              : 'Smart Mapping active · filtered strictly to your clinic fleet'}
                          </div>
                          <h3 className="text-base font-bold text-slate-900">
                            {patient.name} ({patient.age}) — {currentMachine.name}
                          </h3>
                        </div>

                        {!isOverrideMode ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOverrideMode(true);
                              setExpertVerified(false);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide transition-colors whitespace-nowrap"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{lang === 'pl' ? 'MODYFIKUJ ZALECENIA AI' : 'OVERRIDE AI PROTOCOL'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleConfirmExpertOverride}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors whitespace-nowrap"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{lang === 'pl' ? 'Zatwierdź Kalibrację Eksperta' : 'Confirm Expert Calibration'}</span>
                          </button>
                        )}
                      </div>

                      {/* Smart Mapped Device Switcher (ONLY owned machines) */}
                      <div className="flex flex-wrap gap-2">
                        {ownedMachines.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectMachine(m)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              selectedMachineId === m.id
                                ? 'bg-sky-50 border-sky-400 text-sky-900'
                                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>

                      {/* Split: Clinical 3D God Mode Map + Sliders */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-5 space-y-2.5">
                          <ClinicalWireframeMap activeZone={selectedZone} overrideActive={expertVerified} />
                          <div className="grid grid-cols-2 gap-1.5">
                            {TARGET_ZONES.map((z) => (
                              <button
                                key={z.id}
                                type="button"
                                onClick={() => setSelectedZone(z.id)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium text-left transition-colors ${
                                  selectedZone === z.id
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {lang === 'pl' ? z.labelPl : z.labelEn}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-4">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800">
                                {isOverrideMode
                                  ? lang === 'pl'
                                    ? 'Tryb Ordynatora — Ręczna korekta parametrów'
                                    : 'Specialist Mode — Manual Parameter Override'
                                  : lang === 'pl'
                                  ? 'Szkic bazowy AI (kliknij Modyfikuj, aby skorygować)'
                                  : 'AI Baseline Draft (click Override to adjust)'}
                              </span>
                              <span className="font-mono text-[11px] text-slate-500">
                                AI: {currentMachine.aiEnergy}J / {currentMachine.aiDepth}mm
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">{lang === 'pl' ? 'Gęstość energii' : 'Energy Density'}</span>
                                <span className="font-mono font-bold tabular-nums text-slate-900">{energy} J/cm²</span>
                              </div>
                              <input
                                type="range"
                                min={20}
                                max={95}
                                disabled={!isOverrideMode}
                                value={energy}
                                onChange={(e) => {
                                  setEnergy(Number(e.target.value));
                                  setExpertVerified(false);
                                }}
                                className="w-full accent-sky-600 disabled:opacity-50"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">{lang === 'pl' ? 'Głębokość wkłucia / penetracji' : 'Depth'}</span>
                                <span className="font-mono font-bold tabular-nums text-slate-900">{depth.toFixed(1)} mm</span>
                              </div>
                              <input
                                type="range"
                                min={0.5}
                                max={4.5}
                                step={0.1}
                                disabled={!isOverrideMode}
                                value={depth}
                                onChange={(e) => {
                                  setDepth(Number(e.target.value));
                                  setExpertVerified(false);
                                }}
                                className="w-full accent-sky-600 disabled:opacity-50"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600">{lang === 'pl' ? 'Czas impulsu' : 'Pulse Duration'}</span>
                                <span className="font-mono font-bold tabular-nums text-slate-900">{pulseMs} ms</span>
                              </div>
                              <input
                                type="range"
                                min={40}
                                max={220}
                                step={5}
                                disabled={!isOverrideMode}
                                value={pulseMs}
                                onChange={(e) => {
                                  setPulseMs(Number(e.target.value));
                                  setExpertVerified(false);
                                }}
                                className="w-full accent-sky-600 disabled:opacity-50"
                              />
                            </div>

                            {isOverrideMode && (
                              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-700">
                                  {lang === 'pl' ? 'Notatka palpacyjna specjalisty' : 'Specialist Palpation Note'}
                                </label>
                                <textarea
                                  rows={2}
                                  value={palpationNote}
                                  onChange={(e) => setPalpationNote(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                                />
                              </div>
                            )}
                          </div>

                          {/* Official Green Verification Stamp */}
                          {expertVerified && (
                            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                                <div className="text-xs">
                                  <div className="font-bold text-emerald-950">
                                    {lang === 'pl'
                                      ? `Protokół zweryfikowany i zoptymalizowany przez: ${specialistName}`
                                      : `Protocol verified and optimized by: ${specialistName}`}
                                  </div>
                                  <div className="text-emerald-800">
                                    {lang === 'pl'
                                      ? 'Gotowe do wyceny i wygenerowania Paszportu Skóry.'
                                      : 'Ready for package quote and Skin Passport generation.'}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab('upsell')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                <span>{lang === 'pl' ? 'Przejdź do Ekranu 5' : 'Next: Upsell'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------- */}
                  {/* EKRAN 4: WIRTUALNY GARAŻ (PARK MASZYNOWY)         */}
                  {/* ------------------------------------------------- */}
                  {activeTab === 'garage' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">
                          {lang === 'pl' ? 'Menedżer Parku Maszynowego (Smart Mapping)' : 'Clinic Device Fleet (Smart Mapping)'}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'pl'
                            ? 'Zaznacz urządzenia posiadane w gabinecie. Kreator Protokołu (Ekran 3) nigdy nie zasugeruje pacjentce maszyny, której nie masz na stanie — automatycznie przetłumaczy cel zabiegowy na Twój sprzęt.'
                            : 'Toggle devices available in your clinic. Protocol Creator will strictly map treatments only to equipment you own.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {machines.map((m) => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-xl border transition-colors flex flex-col justify-between gap-3 ${
                              m.owned ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 opacity-75'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-bold text-slate-900">{m.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {lang === 'pl' ? m.modalityPl : m.modalityEn}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleMachineOwned(m.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                                  m.owned
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                {m.owned
                                  ? lang === 'pl'
                                    ? 'Na stanie'
                                    : 'Owned'
                                  : lang === 'pl'
                                  ? 'Brak w klinice'
                                  : 'Not Owned'}
                              </button>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span>{m.handpieces}</span>
                              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                                {m.basePricePln.toLocaleString('pl-PL')} PLN
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <div>
                          <label className="font-medium text-slate-700 mr-2">
                            {lang === 'pl' ? 'Podpis Specjalisty (Stempel):' : 'Specialist Signature:'}
                          </label>
                          <input
                            type="text"
                            value={specialistName}
                            onChange={(e) => setSpecialistName(e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('protocol')}
                          className="text-sky-700 font-semibold hover:underline"
                        >
                          {lang === 'pl' ? 'Sprawdź mapowanie w Ekranie 3 →' : 'Verify in Screen 3 →'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------- */}
                  {/* EKRAN 5: MASZYNKA DO UPSELLINGU & PASZPORT SKÓRY  */}
                  {/* ------------------------------------------------- */}
                  {activeTab === 'upsell' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">
                          {lang === 'pl' ? 'Synergia Zabiegowa i Paszport Skóry' : 'Treatment Synergy & Skin Passport'}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {lang === 'pl'
                            ? 'Pokaż ekran pacjentce: porównanie wariantu Standard i Premium (skracającego czas gojenia) domyka wycenę bez krępującej rozmowy przy recepcji.'
                            : 'Show screen to patient: side-by-side Standard vs Premium recovery comparison closes pricing smoothly.'}
                        </p>
                      </div>

                      {/* Standard vs Premium Synergy Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPackageTier('standard');
                            setPassportSent(false);
                          }}
                          className={`p-4 rounded-xl border text-left space-y-2 transition-colors ${
                            packageTier === 'standard'
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">Pakiet Standard</span>
                            <span className="font-mono text-sm font-bold tabular-nums text-slate-900">
                              {basePrice.toLocaleString('pl-PL')} PLN
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {currentMachine.name} · {lang === 'pl' ? 'czas gojenia ok. 4 dni' : 'approx. 4 days downtime'}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPackageTier('premium');
                            setPassportSent(false);
                          }}
                          className={`p-4 rounded-xl border text-left space-y-2 transition-colors ${
                            packageTier === 'premium'
                              ? 'border-sky-600 bg-sky-50/60 ring-1 ring-sky-600'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">Pakiet Premium (Synergia)</span>
                            <span className="font-mono text-sm font-bold tabular-nums text-sky-800">
                              {(basePrice + UPSELL_ADDONS[0].pricePln).toLocaleString('pl-PL')} PLN
                            </span>
                          </div>
                          <p className="text-xs text-slate-700">
                            {lang === 'pl'
                              ? 'Dodanie lampy LED + maski z egzosomami skraca czas gojenia z 4 dni do 1 dnia.'
                              : 'Adding LED therapy + exosome mask cuts downtime from 4 days to 1 day.'}
                          </p>
                        </button>
                      </div>

                      {/* Clinic Shelf Post-Care Upsell Checkbox */}
                      <label className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={includeShelfCream}
                            onChange={(e) => {
                              setIncludeShelfCream(e.target.checked);
                              setPassportSent(false);
                            }}
                            className="w-4 h-4 accent-sky-600 rounded"
                          />
                          <div className="text-xs">
                            <div className="font-semibold text-slate-900">
                              {lang === 'pl' ? UPSELL_ADDONS[1].titlePl : UPSELL_ADDONS[1].titleEn}
                            </div>
                            <div className="text-slate-500">
                              {lang === 'pl' ? UPSELL_ADDONS[1].benefitPl : UPSELL_ADDONS[1].benefitEn}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold tabular-nums text-slate-900 whitespace-nowrap">
                          +{UPSELL_ADDONS[1].pricePln} PLN
                        </span>
                      </label>

                      {/* Summary Bar & Send Skin Passport CTA */}
                      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-slate-400">
                            {lang === 'pl' ? 'Wycena końcowa (Paszport Skóry + Zgody)' : 'Final Quote (Skin Passport + Consents)'}
                          </div>
                          <div className="text-2xl font-bold font-mono tabular-nums">
                            {totalPackagePln.toLocaleString('pl-PL')} PLN
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSendSkinPassport}
                          className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>
                            {passportSent
                              ? lang === 'pl'
                                ? 'Wysłano Paszport do Apki B2C ✓'
                                : 'Passport Sent to B2C App ✓'
                              : lang === 'pl'
                              ? 'Zatwierdź i wyślij Paszport Skóry (PDF)'
                              : 'Approve & Push Skin Passport (PDF)'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CRM Session Audit Ledger */}
          {sessions.length > 0 && (
            <div className="mt-5 rounded-xl bg-white border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-900">
                  {lang === 'pl' ? 'Rejestr CRM i Sesji 12h' : 'CRM & 12h Session Ledger'}
                </h4>
                <span className="text-xs font-mono tabular-nums text-slate-500">{sessions.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-4 font-medium">{lang === 'pl' ? 'Pacjentka' : 'Patient'}</th>
                      <th className="py-2 px-4 font-medium">{lang === 'pl' ? 'Urządzenie (Smart Map)' : 'Device'}</th>
                      <th className="py-2 px-4 font-medium text-right">{lang === 'pl' ? 'Kalibracja' : 'Calibration'}</th>
                      <th className="py-2 px-4 font-medium text-right">{lang === 'pl' ? 'Wartość' : 'Quote'}</th>
                      <th className="py-2 px-4 font-medium text-right">{lang === 'pl' ? 'Weryfikacja' : 'Verification'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((s) => (
                      <tr key={s.unlockedAt}>
                        <td className="py-2 px-4 font-medium text-slate-900">{s.patientName}</td>
                        <td className="py-2 px-4 text-slate-700">{s.device}</td>
                        <td className="py-2 px-4 text-right font-mono tabular-nums text-slate-600">
                          {s.energy}J · {s.depth.toFixed(1)}mm · {s.pulseMs}ms
                        </td>
                        <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                          {s.packageTotalPln.toLocaleString('pl-PL')} PLN
                        </td>
                        <td className="py-2 px-4 text-right text-emerald-700 font-medium">
                          {s.expertVerifiedBy ? s.expertVerifiedBy : lang === 'pl' ? 'Szkic AI' : 'AI Draft'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
