/** Shared domain types & constants — Mundo Turístico MG */

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

export enum PassengerType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
  SENIOR = 'SENIOR',
}

export enum BookingStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum BookingType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  PACKAGE = 'PACKAGE',
}

export enum CabinClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
  seniors: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DestinationSummary {
  id: string;
  name: string;
  type: 'country' | 'city' | 'region';
  countryCode?: string;
  countryName?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  popular?: boolean;
}

export interface FlightSearchParams {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCount;
  cabinClass?: CabinClass;
  tripType: 'oneway' | 'roundtrip';
}

export interface HotelSearchParams {
  destinationId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  passengers: PassengerCount;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const BRAND = {
  name: 'MG Mundo Turístico',
  shortName: 'MG',
  legalName: 'MG Mundo Turístico Viajes y Turismo C.A.',
  tagline: 'Viajes y Turismo',
  mission:
    'Somos la Agencia de Viajes que ofrece servicios de calidad en el área de viajes personales y corporativos de mayor trayectoria nacional.',
  vision:
    'Ser la organización líder en el área de viajes personales y corporativos a nivel nacional que asegure la satisfacción y confianza de nuestros clientes.',
  contact: {
    phone: '+58 414-9119477',
    email: 'mundoturisticomg@gmail.com',
    instagram: 'https://www.instagram.com/mgmundoturistico/',
    facebook: 'https://www.facebook.com/mgmundoturistico/',
  },
  /** Colores del logo oficial (Instagram @mgmundoturistico) */
  colors: {
    primary: '#0A4D8C',
    secondary: '#1A6BB5',
    blue: '#0066CC',
    blueDeep: '#004A99',
    accent: '#FF5A00',
    accentHot: '#E63900',
    orange: '#FF6600',
    sky: '#4DB3FF',
    night: '#041018',
    cream: '#F7F9FC',
  },
} as const;

export const PASSENGER_LABELS: Record<PassengerType, { es: string; ageRange: string }> = {
  [PassengerType.ADULT]: { es: 'Adulto', ageRange: '12–59 años' },
  [PassengerType.CHILD]: { es: 'Niño', ageRange: '2–11 años' },
  [PassengerType.INFANT]: { es: 'Bebé', ageRange: '0–23 meses' },
  [PassengerType.SENIOR]: { es: 'Tercera edad', ageRange: '60+ años' },
};
