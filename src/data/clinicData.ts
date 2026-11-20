import { Department, Product } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'proctology',
    name: 'Proctology (MCPL)',
    namePl: 'Proktologia — MCPL',
    subtitle: 'Mazowieckie Centrum Proktologii Laserowej',
    shortDesc: 'Mazowieckie Centrum Proktologii Laserowej: bezbolesne zabiegi laserowe LHP®, anoskopia HD i małoinwazyjna diagnostyka.',
    fullDesc: 'Mazowieckie Centrum Proktologii Laserowej (MCPL) to wyspecjalizowany moduł diagnostyczno-zabiegowy wykorzystujący technologię lasera diodowego (HeLPS, LHP®) oraz endosonografię 3D w pełnym komforcie pacjenta.',
    iconName: 'Activity',
    accentColor: 'from-sky-400 to-indigo-500',
    badge: 'Laser Precision',
    pedestalPosition: { x: 18, y: 65 },
    features: [
      'LHP® Laser Hemorrhoidoplasty',
      'Endosonography 3D ultrasound',
      'Painless outpatient diagnostics',
      'Fast 24h recovery protocol'
    ],
    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. hab. n. med. Marek Wisniewski',
        title: 'Senior Proctology Consultant',
        specialty: 'Laser Colorectal Surgery',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
        experienceYears: 18
      },
      {
        id: 'doc-2',
        name: 'Dr n. med. Anna Kowalska-Kruk',
        title: 'Specialist Surgeon',
        specialty: 'Diagnostic Anoscopy & Pelvic Health',
        avatar: 'https://images.unsplash.com/photo-1594824813566-789552791ba3?w=300&auto=format&fit=crop&q=80',
        experienceYears: 12
      }
    ],
    treatments: [
      {
        id: 'p-1',
        title: 'LHP® Laser Hemorrhoid Treatment',
        description: 'Minimally invasive laser coagulation under local anesthesia with minimal discomfort.',
        durationMinutes: 45,
        pricePln: 3800,
        category: 'Laser Surgery',
        isPopular: true
      },
      {
        id: 'p-2',
        title: 'High-Definition Video Anoscopy',
        description: 'Comprehensive digital optical evaluation with immediate high-res report.',
        durationMinutes: 30,
        pricePln: 350,
        category: 'Diagnostics'
      },
      {
        id: 'p-3',
        title: 'Fissure Laser Vaporization',
        description: 'Precision diode laser treatment promoting rapid tissue epithelialization.',
        durationMinutes: 40,
        pricePln: 2900,
        category: 'Laser Surgery'
      }
    ]
  },
  {
    id: 'surgery',
    name: 'General & Plastic Surgery',
    namePl: 'Chirurgia Ogólna i Estetyczna',
    subtitle: 'Ultra-precision Surgical Suites & Rapid Recovery',
    shortDesc: 'Endoscopic hernioplasty, soft tissue reconstruction, and outpatient minor surgery.',
    fullDesc: 'Equipped with ultra-clean ISO Class 5 laminar flow operating rooms. We combine micro-incision technology with biological mesh integrations for superior long-term surgical outcomes.',
    iconName: 'ShieldAlert',
    accentColor: 'from-teal-400 to-emerald-600',
    badge: 'ISO Class 5 OR',
    pedestalPosition: { x: 38, y: 62 },
    features: [
      'Laparoscopic 4K 3D vision systems',
      'Day-surgery outpatient protocols',
      'Biological tissue-reinforcing meshes',
      'Dedicated private recovery pods'
    ],
    doctors: [
      {
        id: 'doc-3',
        name: 'Prof. dr hab. Piotr Zieliński',
        title: 'Head of Surgical Innovations',
        specialty: 'Laparoscopic & Hernia Surgery',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
        experienceYears: 24
      }
    ],
    treatments: [
      {
        id: 's-1',
        title: '3D Mesh Laparoscopic Hernioplasty',
        description: 'TAPP/TEP endoscopic repair allowing return to full physical activity within 7 days.',
        durationMinutes: 75,
        pricePln: 6500,
        category: 'Laparoscopy',
        isPopular: true
      },
      {
        id: 's-2',
        title: 'Radiofrequency Tissue Resection',
        description: 'Scarless radiofrequency removal of cutaneous & subcutaneous lesions.',
        durationMinutes: 30,
        pricePln: 800,
        category: 'Outpatient'
      },
      {
        id: 's-3',
        title: 'Diagnostic Ultrasound Guided Biopsy',
        description: 'Real-time ultrasound micro-needle tissue sampling with accelerated lab results.',
        durationMinutes: 25,
        pricePln: 600,
        category: 'Diagnostics'
      }
    ]
  },
  {
    id: 'phlebology',
    name: 'Phlebology',
    namePl: 'Flebologia',
    subtitle: 'Vascular Medicine & Laser Vein Therapy',
    shortDesc: 'Doppler ultrasound hemodynamics, EVLT endovenous laser, and foam sclerotherapy.',
    fullDesc: 'Comprehensive vascular diagnostic center specializing in varicose veins, venous insufficiency, and spider vein aesthetics. Modern dual-wavelength 1470nm laser systems ensure maximal patient comfort.',
    iconName: 'Zap',
    accentColor: 'from-cyan-400 to-blue-600',
    badge: 'Dual-Wave 1470nm',
    pedestalPosition: { x: 62, y: 64 },
    features: [
      'Color Doppler Ultrasound Hemodynamics',
      'EVLT® 1470nm Radial Laser Ablation',
      'CLaCS (Cryo-Laser & Cryo-Sclerotherapy)',
      'Customized compression therapy fitting'
    ],
    doctors: [
      {
        id: 'doc-4',
        name: 'Dr n. med. Ewa Majewska',
        title: 'Consultant Vascular Surgeon',
        specialty: 'Endovenous Laser & Hemodynamics',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
        experienceYears: 15
      }
    ],
    treatments: [
      {
        id: 'f-1',
        title: 'EVLT® Radial Laser Vein Ablation',
        description: 'Endovenous laser closure of saphenous veins with ultrasound guidance under local tumescent anesthesia.',
        durationMinutes: 60,
        pricePln: 4200,
        category: 'Endovenous Laser',
        isPopular: true
      },
      {
        id: 'f-2',
        title: 'Echo-Guided Foam Sclerotherapy',
        description: 'Targeted micro-foam injection for medium and reticular varicose veins.',
        durationMinutes: 35,
        pricePln: 950,
        category: 'Sclerotherapy'
      },
      {
        id: 'f-3',
        title: 'Duplex Doppler Vascular Mapping',
        description: 'Complete 3D mapping of superficial and deep venous reflux.',
        durationMinutes: 40,
        pricePln: 380,
        category: 'Diagnostics'
      }
    ]
  },
  {
    id: 'shop',
    name: 'Clinic Shop & Pharmacy',
    namePl: 'Sklep Medyczny i Apteka',
    subtitle: 'Post-treatment Care, Compression & Supplements',
    shortDesc: 'Certified medical compression wear, dermatological wound care, and recovery formulas.',
    fullDesc: 'Direct access to doctor-curated medical products, medical-grade compression stockings, post-operative specialized dressings, and bio-available micro-nutrient formulas.',
    iconName: 'ShoppingBag',
    accentColor: 'from-amber-400 to-rose-500',
    badge: 'Certified Medical Grade',
    pedestalPosition: { x: 82, y: 66 },
    features: [
      'Graduated CCL1 & CCL2 compression garments',
      'Sterile hydrocolloid & silicone scar sheets',
      'Clinical vascular & collagen supplements',
      'Fast direct delivery & click-and-collect'
    ],
    doctors: [],
    treatments: []
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Venoflow® Class 2 Compression Stockings',
    category: 'vascular',
    price: 240,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    description: 'Swiss-designed graduated pressure compression (23-32 mmHg) for varicose prevention and post-EVLT recovery.',
    inStock: true,
    badge: 'Doctor Recommended'
  },
  {
    id: 'prod-2',
    name: 'Cicatrizel® Silicone Scar Gel 50g',
    category: 'post-op',
    price: 135,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1608248597261-e4d0947c8b8b?w=400&auto=format&fit=crop&q=80',
    description: 'Medical grade silicone gel for hyperpigmentation reduction and rapid post-surgical tissue smoothing.',
    inStock: true,
    badge: 'Bestseller'
  },
  {
    id: 'prod-3',
    name: 'ProctoShield® Bio-Repair Ointment',
    category: 'post-op',
    price: 89,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    description: 'Natural hyaluronic acid and Calendula extract barrier balm for tissue regeneration.',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'VascularComplex Dual Diosmin 1000mg',
    category: 'supplements',
    price: 110,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
    description: 'Micronized flavonoid fraction (900mg diosmin + 100mg hesperidin) supporting venous wall elasticity.',
    inStock: true,
    badge: 'High Potency'
  },
  {
    id: 'prod-5',
    name: 'HydroClear® Sterile Post-Op Dressings (Pack of 10)',
    category: 'post-op',
    price: 65,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    description: 'Waterproof breathable barrier film with pad for surgical incision protection during showering.',
    inStock: true
  },
  {
    id: 'prod-6',
    name: 'PureDerm® Soothing Cleansing Foam',
    category: 'dermo',
    price: 78,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1556228722-d119f010375f?w=400&auto=format&fit=crop&q=80',
    description: 'Hypoallergenic physiological pH 5.5 cleanser without harsh sulfates for sensitive surgical areas.',
    inStock: true
  }
];
