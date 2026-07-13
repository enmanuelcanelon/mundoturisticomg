'use client';

import dynamic from 'next/dynamic';
import { SearchBar } from '@/components/globe/SearchBar';
import { BookingPanel } from '@/components/booking/BookingPanel';
import { useBookingStore } from '@/store/booking-store';
import { Mouse, ZoomIn } from 'lucide-react';

const EarthGlobe = dynamic(
  () => import('@/components/globe/EarthGlobe').then((m) => m.EarthGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center stars">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-2 border-brand-accent/30 border-t-brand-accent" />
          <p className="text-sm text-white/60">Preparando el planeta…</p>
        </div>
      </div>
    ),
  },
);

export default function HomePage() {
  const panelOpen = useBookingStore((s) => s.panelOpen);
  const selectedCountry = useBookingStore((s) => s.selectedCountry);
  const selectedCity = useBookingStore((s) => s.selectedCity);

  const destinationLabel =
    (selectedCity && ('nameEs' in selectedCity ? selectedCity.nameEs : selectedCity.name)) ||
    selectedCountry?.nameEs;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Planeta a pantalla completa — sin texto encima del centro */}
      <EarthGlobe />

      {/* Buscador compacto: abajo, no tapa el globo */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-4 pb-6 pt-16 transition-all duration-500 ${
          panelOpen ? 'md:pr-[28rem]' : ''
        }`}
        style={{
          background:
            'linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.55) 45%, transparent 100%)',
        }}
      >
        {/* Chip de destino activo */}
        {destinationLabel && (
          <div className="pointer-events-none mb-3 rounded-full border border-brand-accent/35 bg-brand-night/60 px-3 py-1 text-xs text-brand-accent backdrop-blur-md">
            Explorando <span className="font-semibold">{destinationLabel}</span>
          </div>
        )}

        <div className="pointer-events-auto w-full max-w-md">
          <SearchBar compact />
        </div>

        {!panelOpen && (
          <div className="pointer-events-none mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <Mouse className="h-3.5 w-3.5" /> Arrastra
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ZoomIn className="h-3.5 w-3.5" /> Zoom
            </span>
            <span>Clic en cualquier país para resaltarlo</span>
          </div>
        )}
      </div>

      <BookingPanel />
    </div>
  );
}
