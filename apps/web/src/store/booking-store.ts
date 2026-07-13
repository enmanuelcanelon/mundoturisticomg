import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { City, Country, Flight, Hotel, SearchHit } from '@/lib/api';

export type TripType = 'oneway' | 'roundtrip';

export interface Passengers {
  adults: number;
  children: number;
  infants: number;
  seniors: number;
}

interface BookingState {
  // Globe selection
  selectedCountry: Country | null;
  selectedCity: City | SearchHit | null;
  focusPoint: { lat: number; lng: number; altitude?: number } | null;

  // Trip details
  origin: City | SearchHit | null;
  destination: City | SearchHit | null;
  tripType: TripType;
  departureDate: string;
  returnDate: string;
  passengers: Passengers;
  cabinClass: string;
  rooms: number;

  // Results selection
  selectedOutbound: Flight | null;
  selectedInbound: Flight | null;
  selectedHotel: Hotel | null;
  includeHotel: boolean;

  // UI
  panelOpen: boolean;
  step: 'explore' | 'dates' | 'flights' | 'hotels' | 'review';

  setSelectedCountry: (c: Country | null) => void;
  setSelectedCity: (c: City | SearchHit | null) => void;
  setFocusPoint: (p: { lat: number; lng: number; altitude?: number } | null) => void;
  setOrigin: (c: City | SearchHit | null) => void;
  setDestination: (c: City | SearchHit | null) => void;
  setTripType: (t: TripType) => void;
  setDepartureDate: (d: string) => void;
  setReturnDate: (d: string) => void;
  setPassengers: (p: Partial<Passengers>) => void;
  setCabinClass: (c: string) => void;
  setRooms: (n: number) => void;
  setSelectedOutbound: (f: Flight | null) => void;
  setSelectedInbound: (f: Flight | null) => void;
  setSelectedHotel: (h: Hotel | null) => void;
  setIncludeHotel: (v: boolean) => void;
  setPanelOpen: (v: boolean) => void;
  setStep: (s: BookingState['step']) => void;
  flyToDestination: (hit: SearchHit | City, country?: Country | null) => void;
  totalPassengers: () => number;
  resetTrip: () => void;
}

const defaultPassengers: Passengers = {
  adults: 1,
  children: 0,
  infants: 0,
  seniors: 0,
};

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function nextWeek() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      selectedCountry: null,
      selectedCity: null,
      focusPoint: null,
      origin: null,
      destination: null,
      tripType: 'roundtrip',
      departureDate: tomorrow(),
      returnDate: nextWeek(),
      passengers: { ...defaultPassengers },
      cabinClass: 'ECONOMY',
      rooms: 1,
      selectedOutbound: null,
      selectedInbound: null,
      selectedHotel: null,
      includeHotel: true,
      panelOpen: false,
      step: 'explore',

      setSelectedCountry: (c) => set({ selectedCountry: c }),
      setSelectedCity: (c) => set({ selectedCity: c }),
      setFocusPoint: (p) => set({ focusPoint: p }),
      setOrigin: (c) => set({ origin: c }),
      setDestination: (c) => set({ destination: c }),
      setTripType: (t) => set({ tripType: t }),
      setDepartureDate: (d) => set({ departureDate: d }),
      setReturnDate: (d) => set({ returnDate: d }),
      setPassengers: (p) =>
        set((s) => ({ passengers: { ...s.passengers, ...p } })),
      setCabinClass: (c) => set({ cabinClass: c }),
      setRooms: (n) => set({ rooms: n }),
      setSelectedOutbound: (f) => set({ selectedOutbound: f }),
      setSelectedInbound: (f) => set({ selectedInbound: f }),
      setSelectedHotel: (h) => set({ selectedHotel: h }),
      setIncludeHotel: (v) => set({ includeHotel: v }),
      setPanelOpen: (v) => set({ panelOpen: v }),
      setStep: (s) => set({ step: s }),

      flyToDestination: (hit, country) => {
        const isCity =
          ('type' in hit && hit.type === 'city') ||
          'iataCode' in hit ||
          'nameEs' in hit;
        set({
          selectedCity: hit,
          selectedCountry: country ?? get().selectedCountry,
          destination: hit,
          focusPoint: {
            lat: hit.lat,
            lng: hit.lng,
            altitude: isCity ? 0.35 : 1.2,
          },
          panelOpen: true,
          step: 'dates',
          selectedOutbound: null,
          selectedInbound: null,
          selectedHotel: null,
        });
      },

      totalPassengers: () => {
        const p = get().passengers;
        return p.adults + p.children + p.infants + p.seniors;
      },

      resetTrip: () =>
        set({
          selectedOutbound: null,
          selectedInbound: null,
          selectedHotel: null,
          step: 'explore',
          panelOpen: false,
          focusPoint: null,
          selectedCountry: null,
          selectedCity: null,
        }),
    }),
    {
      name: 'mtmg-booking',
      partialize: (s) => ({
        origin: s.origin,
        destination: s.destination,
        tripType: s.tripType,
        departureDate: s.departureDate,
        returnDate: s.returnDate,
        passengers: s.passengers,
        cabinClass: s.cabinClass,
        rooms: s.rooms,
        includeHotel: s.includeHotel,
      }),
    },
  ),
);
