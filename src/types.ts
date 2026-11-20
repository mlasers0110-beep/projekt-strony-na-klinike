export interface Department {
  id: 'proctology' | 'surgery' | 'phlebology' | 'shop';
  name: string;
  namePl: string;
  subtitle: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  accentColor: string;
  badge: string;
  pedestalPosition: { x: number; y: number };
  features: string[];
  doctors: Doctor[];
  treatments: Treatment[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  experienceYears: number;
}

export interface Treatment {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  pricePln: number;
  category: string;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'vascular' | 'post-op' | 'dermo' | 'supplements';
  price: number;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Appointment {
  departmentId: string;
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes?: string;
}

export type TimeOfDay = 'dawn' | 'noon' | 'golden' | 'twilight';
