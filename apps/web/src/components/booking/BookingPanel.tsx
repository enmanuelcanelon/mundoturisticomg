'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  Users,
  Plane,
  Hotel,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Clock,
  Check,
  Loader2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBookingStore } from '@/store/booking-store';
import { useAuthStore } from '@/store/auth-store';
import {
  destinationsApi,
  flightsApi,
  hotelsApi,
  bookingsApi,
  type City,
  type Flight,
  type Hotel as HotelType,
} from '@/lib/api';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { buildQuoteMessage } from '@/lib/brand';

function PaxCounter({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-slate-50 px-3 py-2.5">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-500">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-blue shadow-sm ring-1 ring-blue-100 hover:bg-orange-50 hover:text-brand-accent hover:ring-orange-200 disabled:opacity-30"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-brand-primary">{value}</span>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-blue shadow-sm ring-1 ring-blue-100 hover:bg-orange-50 hover:text-brand-accent hover:ring-orange-200 disabled:opacity-30"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatMoney(n: number, currency = 'USD') {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

const STEPS = [
  { id: 'dates', label: 'Viaje' },
  { id: 'flights', label: 'Vuelos' },
  { id: 'hotels', label: 'Hotel' },
  { id: 'review', label: 'Confirmar' },
] as const;

export function BookingPanel() {
  const router = useRouter();
  const panelOpen = useBookingStore((s) => s.panelOpen);
  const setPanelOpen = useBookingStore((s) => s.setPanelOpen);
  const step = useBookingStore((s) => s.step);
  const setStep = useBookingStore((s) => s.setStep);
  const selectedCountry = useBookingStore((s) => s.selectedCountry);
  const selectedCity = useBookingStore((s) => s.selectedCity);
  const destination = useBookingStore((s) => s.destination);
  const origin = useBookingStore((s) => s.origin);
  const setOrigin = useBookingStore((s) => s.setOrigin);
  const setDestination = useBookingStore((s) => s.setDestination);
  const tripType = useBookingStore((s) => s.tripType);
  const setTripType = useBookingStore((s) => s.setTripType);
  const departureDate = useBookingStore((s) => s.departureDate);
  const returnDate = useBookingStore((s) => s.returnDate);
  const setDepartureDate = useBookingStore((s) => s.setDepartureDate);
  const setReturnDate = useBookingStore((s) => s.setReturnDate);
  const passengers = useBookingStore((s) => s.passengers);
  const setPassengers = useBookingStore((s) => s.setPassengers);
  const cabinClass = useBookingStore((s) => s.cabinClass);
  const setCabinClass = useBookingStore((s) => s.setCabinClass);
  const rooms = useBookingStore((s) => s.rooms);
  const setRooms = useBookingStore((s) => s.setRooms);
  const includeHotel = useBookingStore((s) => s.includeHotel);
  const setIncludeHotel = useBookingStore((s) => s.setIncludeHotel);
  const selectedOutbound = useBookingStore((s) => s.selectedOutbound);
  const selectedInbound = useBookingStore((s) => s.selectedInbound);
  const selectedHotel = useBookingStore((s) => s.selectedHotel);
  const setSelectedOutbound = useBookingStore((s) => s.setSelectedOutbound);
  const setSelectedInbound = useBookingStore((s) => s.setSelectedInbound);
  const setSelectedHotel = useBookingStore((s) => s.setSelectedHotel);
  const flyToDestination = useBookingStore((s) => s.flyToDestination);

  const user = useAuthStore((s) => s.user);

  const [countryCities, setCountryCities] = useState<City[]>([]);
  const [hubCities, setHubCities] = useState<City[]>([]);
  const [outbound, setOutbound] = useState<Flight[]>([]);
  const [inbound, setInbound] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [nights, setNights] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [leg, setLeg] = useState<'out' | 'in'>('out');

  // Load cities for selected country
  useEffect(() => {
    if (!selectedCountry?.code) return;
    destinationsApi
      .country(selectedCountry.code)
      .then((c) => setCountryCities(c.cities || []))
      .catch(() => setCountryCities([]));
  }, [selectedCountry?.code]);

  // Default origin CCS
  useEffect(() => {
    destinationsApi.cities({ q: 'Caracas' }).then((list) => {
      setHubCities(list);
      if (!origin && list[0]) setOrigin(list[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!panelOpen) return null;

  const destName =
    destination && 'nameEs' in destination
      ? (destination as City).nameEs
      : destination?.name || selectedCountry?.nameEs || 'Destino';

  const originCode =
    origin &&
    ('iataCode' in origin
      ? origin.iataCode
      : 'code' in origin
        ? origin.code
        : undefined);
  const destCode =
    destination &&
    ('iataCode' in destination
      ? (destination as City).iataCode
      : 'code' in destination
        ? destination.code
        : undefined);

  const searchFlights = async () => {
    setError(null);
    setLoading(true);
    try {
      const originKey = originCode || origin?.id || 'CCS';
      const destKey = destCode || destination?.id;
      if (!destKey) throw new Error('Selecciona una ciudad de destino con aeropuerto');

      const res = await flightsApi.search({
        origin: String(originKey),
        destination: String(destKey),
        departureDate,
        ...(tripType === 'roundtrip' ? { returnDate } : {}),
        tripType,
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants,
        seniors: passengers.seniors,
        cabinClass,
      });
      setOutbound(res.outbound);
      setInbound(res.inbound);
      setStep('flights');
      setLeg('out');
      if (!res.outbound.length) {
        setError('No hay vuelos para esas fechas. Prueba otras fechas o destinos.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error buscando vuelos');
    } finally {
      setLoading(false);
    }
  };

  const searchHotels = async () => {
    setError(null);
    setLoading(true);
    try {
      const destId = destination?.id;
      if (!destId) throw new Error('Destino inválido para hoteles');
      const res = await hotelsApi.search({
        destination: destId,
        checkIn: departureDate,
        checkOut: tripType === 'roundtrip' ? returnDate : departureDate,
        rooms,
        adults: passengers.adults + passengers.seniors,
        children: passengers.children,
      });
      setHotels(res.hotels);
      setNights(res.nights);
      setStep('hotels');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error buscando hoteles');
    } finally {
      setLoading(false);
    }
  };

  const goAfterFlights = () => {
    if (!selectedOutbound) {
      setError('Selecciona un vuelo de ida');
      return;
    }
    if (tripType === 'roundtrip' && inbound.length && !selectedInbound) {
      setLeg('in');
      setError('Selecciona un vuelo de regreso');
      return;
    }
    setError(null);
    if (includeHotel) searchHotels();
    else setStep('review');
  };

  const totalEstimate = () => {
    let t = 0;
    if (selectedOutbound) t += selectedOutbound.totalPriceUsd;
    if (selectedInbound) t += selectedInbound.totalPriceUsd;
    if (includeHotel && selectedHotel?.totalPriceUsd) t += selectedHotel.totalPriceUsd;
    return t;
  };

  const confirmBooking = async () => {
    if (!user) {
      router.push('/auth?next=/');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const items: unknown[] = [];
      if (selectedOutbound) {
        items.push({ itemType: 'FLIGHT', flightId: selectedOutbound.id });
      }
      if (selectedInbound) {
        items.push({ itemType: 'FLIGHT', flightId: selectedInbound.id });
      }
      if (includeHotel && selectedHotel) {
        items.push({
          itemType: 'HOTEL',
          hotelId: selectedHotel.id,
          checkIn: departureDate,
          checkOut: returnDate,
          rooms,
        });
      }

      const booking = await bookingsApi.create({
        type: includeHotel && selectedHotel ? 'PACKAGE' : selectedHotel ? 'HOTEL' : 'FLIGHT',
        tripType,
        departureDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants,
        seniors: passengers.seniors,
        contactEmail: user.email,
        items,
      });

      const ref = (booking as { reference?: string }).reference || 'OK';
      setSuccess(`¡Reserva creada! Referencia ${ref}`);
      await bookingsApi.confirm((booking as { id: string }).id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <aside className="booking-panel pointer-events-auto fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-md flex-col md:top-0">
      {/* Header azul + franja naranja como el logo */}
      <div className="relative flex items-start justify-between gap-3 bg-gradient-to-br from-brand-primary via-brand-blue to-brand-secondary px-5 pb-5 pt-20 text-white md:pt-24">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-accent via-brand-orange to-brand-accentHot" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-orange-200">
            MG Mundo Turístico
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-white">{destName}</h2>
          {selectedCountry && (
            <p className="text-sm text-white/75">{selectedCountry.nameEs}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen(false)}
          className="rounded-xl bg-white/15 p-2 text-white ring-1 ring-orange-300/30 hover:bg-white/25"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Steps */}
      <div className="flex gap-1 border-b border-blue-100 bg-slate-50 px-4 py-3">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            disabled={i > stepIndex + 1}
            onClick={() => {
              if (i <= stepIndex) setStep(s.id);
            }}
            className={clsx(
              'flex-1 rounded-lg py-1.5 text-[11px] font-medium transition',
              step === s.id
                ? 'bg-brand-accent text-white shadow-sm shadow-orange-200'
                : i < stepIndex
                  ? 'bg-orange-100 text-brand-accent'
                  : 'bg-white text-slate-400 ring-1 ring-blue-100',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-5 py-4">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {success}{' '}
            <Link href="/reservas" className="font-medium text-brand-blue underline">
              Ver mis reservas
            </Link>
          </div>
        )}

        {/* Cities chips when country selected */}
        {countryCities.length > 0 && step === 'dates' && (
          <div className="mb-5">
            <p className="panel-label">Ciudades principales</p>
            <div className="flex flex-wrap gap-2">
              {countryCities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setDestination(c);
                    flyToDestination(c, selectedCountry);
                  }}
                  className={clsx(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                    destination?.id === c.id
                      ? 'border-brand-accent bg-brand-accent text-white shadow-sm'
                      : 'border-blue-100 bg-slate-50 text-slate-600 hover:border-orange-300 hover:text-brand-accent',
                  )}
                >
                  {c.nameEs}
                  {c.iataCode ? ` (${c.iataCode})` : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'dates' && (
          <div className="space-y-4">
            <div>
              <p className="panel-label">Tipo de viaje</p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['roundtrip', 'Ida y vuelta'],
                    ['oneway', 'Solo ida'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTripType(val)}
                    className={clsx(
                      'rounded-xl border py-2.5 text-sm font-medium',
                      tripType === val
                        ? 'border-brand-accent bg-orange-50 text-brand-accent'
                        : 'border-blue-100 bg-white text-slate-600 hover:border-orange-200',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="panel-label">Origen</label>
              <select
                className="panel-input"
                value={origin?.id || ''}
                onChange={(e) => {
                  const c =
                    hubCities.find((x) => x.id === e.target.value) ||
                    countryCities.find((x) => x.id === e.target.value);
                  if (c) setOrigin(c);
                }}
              >
                <option value="">Selecciona origen</option>
                {hubCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEs} {c.iataCode ? `(${c.iataCode})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="panel-label">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  Ida
                </label>
                <input
                  type="date"
                  className="panel-input"
                  value={departureDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
              {tripType === 'roundtrip' && (
                <div>
                  <label className="panel-label">Vuelta</label>
                  <input
                    type="date"
                    className="panel-input"
                    value={returnDate}
                    min={departureDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div>
              <p className="panel-label">
                <Users className="mr-1 inline h-3 w-3" />
                Pasajeros
              </p>
              <div className="space-y-2">
                <PaxCounter
                  label="Adultos"
                  hint="12–59 años"
                  value={passengers.adults}
                  min={passengers.seniors > 0 ? 0 : 1}
                  onChange={(n) => setPassengers({ adults: n })}
                />
                <PaxCounter
                  label="Niños"
                  hint="2–11 años"
                  value={passengers.children}
                  onChange={(n) => setPassengers({ children: n })}
                />
                <PaxCounter
                  label="Bebés"
                  hint="0–23 meses"
                  value={passengers.infants}
                  max={passengers.adults + passengers.seniors}
                  onChange={(n) => setPassengers({ infants: n })}
                />
                <PaxCounter
                  label="Tercera edad"
                  hint="60+ años"
                  value={passengers.seniors}
                  onChange={(n) => setPassengers({ seniors: n })}
                />
              </div>
            </div>

            <div>
              <label className="panel-label">Clase</label>
              <select
                className="panel-input"
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
              >
                <option value="ECONOMY">Económica</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">Primera</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-100 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={includeHotel}
                onChange={(e) => setIncludeHotel(e.target.checked)}
                className="h-4 w-4 accent-brand-blue"
              />
              <div>
                <p className="text-sm font-medium text-slate-800">Incluir hotel</p>
                <p className="text-xs text-slate-500">Paquete vuelo + alojamiento</p>
              </div>
            </label>

            {includeHotel && (
              <div>
                <label className="panel-label">Habitaciones</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="panel-input"
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value) || 1)}
                />
              </div>
            )}

            <button
              type="button"
              className="btn-panel"
              disabled={loading || !destination}
              onClick={searchFlights}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Buscar vuelos <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'flights' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLeg('out')}
                className={clsx(
                  'flex-1 rounded-xl py-2 text-xs font-semibold',
                  leg === 'out'
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 ring-1 ring-blue-100',
                )}
              >
                Ida {selectedOutbound ? '✓' : ''}
              </button>
              {tripType === 'roundtrip' && (
                <button
                  type="button"
                  onClick={() => setLeg('in')}
                  className={clsx(
                    'flex-1 rounded-xl py-2 text-xs font-semibold',
                    leg === 'in'
                      ? 'bg-brand-accent text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 ring-1 ring-blue-100',
                  )}
                >
                  Vuelta {selectedInbound ? '✓' : ''}
                </button>
              )}
            </div>

            {(leg === 'out' ? outbound : inbound).map((f) => {
              const selected =
                leg === 'out' ? selectedOutbound?.id === f.id : selectedInbound?.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    if (leg === 'out') {
                      setSelectedOutbound(f);
                      if (tripType === 'roundtrip' && inbound.length) setLeg('in');
                    } else setSelectedInbound(f);
                  }}
                  className={clsx(
                    'w-full rounded-2xl border p-3 text-left transition',
                    selected
                      ? 'border-brand-accent bg-orange-50/80 shadow-sm ring-1 ring-orange-200'
                      : 'border-blue-100 bg-white hover:border-orange-200',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-brand-blue">
                        {f.airline.name} · {f.flightNumber}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {f.origin.iata || f.origin.name} → {f.destination.iata || f.destination.name}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3 text-brand-accent" />
                        {format(parseISO(f.departureAt), "dd MMM HH:mm", { locale: es })} ·{' '}
                        {formatDuration(f.durationMinutes)}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                        {f.cabinClass.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand-accent">
                        {formatMoney(f.totalPriceUsd)}
                      </p>
                      <p className="text-[10px] text-slate-400">total pasajeros</p>
                      {selected && <Check className="ml-auto mt-1 h-4 w-4 text-brand-accent" />}
                    </div>
                  </div>
                </button>
              );
            })}

            {!(leg === 'out' ? outbound : inbound).length && (
              <p className="py-8 text-center text-sm text-slate-500">
                Sin vuelos en este tramo. Cambia fechas o destino.
              </p>
            )}

            <button type="button" className="btn-panel" onClick={goAfterFlights}>
              Continuar <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 'hotels' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              {nights} noche{nights !== 1 ? 's' : ''} · {rooms} habitación
              {rooms !== 1 ? 'es' : ''}
            </p>
            {hotels.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHotel(h)}
                className={clsx(
                  'w-full rounded-2xl border p-3 text-left transition',
                  selectedHotel?.id === h.id
                    ? 'border-brand-accent bg-orange-50/80 shadow-sm ring-1 ring-orange-200'
                    : 'border-blue-100 bg-white hover:border-orange-200',
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{h.name}</p>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: h.stars }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-brand-accent text-brand-accent" />
                      ))}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{h.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {h.amenities?.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] text-brand-accent"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-brand-accent">
                      {formatMoney(h.totalPriceUsd || h.pricePerNightUsd)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {h.totalPriceUsd ? 'total' : '/ noche'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {!hotels.length && (
              <p className="py-8 text-center text-sm text-slate-500">
                No hay hoteles para esta ciudad en el catálogo.
              </p>
            )}
            <button
              type="button"
              className="btn-panel-ghost"
              onClick={() => {
                setSelectedHotel(null);
                setStep('review');
              }}
            >
              Continuar sin hotel
            </button>
            <button
              type="button"
              className="btn-panel"
              disabled={!selectedHotel}
              onClick={() => setStep('review')}
            >
              Continuar <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-blue-100 bg-slate-50 p-4 ring-1 ring-orange-100/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                Resumen
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                <li className="flex justify-between gap-2">
                  <span className="text-slate-500">Destino</span>
                  <span className="text-right font-medium text-slate-800">{destName}</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="text-slate-500">Fechas</span>
                  <span className="text-right">
                    {departureDate}
                    {tripType === 'roundtrip' ? ` → ${returnDate}` : ''}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span className="text-slate-500">Pasajeros</span>
                  <span>
                    {passengers.adults}A · {passengers.children}N · {passengers.infants}B ·{' '}
                    {passengers.seniors}T
                  </span>
                </li>
                {selectedOutbound && (
                  <li className="flex items-start justify-between gap-2 border-t border-orange-100 pt-3">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Plane className="h-3.5 w-3.5 text-brand-accent" /> Ida
                    </span>
                    <span className="text-right text-xs">
                      {selectedOutbound.flightNumber}
                      <br />
                      {formatMoney(selectedOutbound.totalPriceUsd)}
                    </span>
                  </li>
                )}
                {selectedInbound && (
                  <li className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Plane className="h-3.5 w-3.5 rotate-180 text-brand-accent" /> Vuelta
                    </span>
                    <span className="text-right text-xs">
                      {selectedInbound.flightNumber}
                      <br />
                      {formatMoney(selectedInbound.totalPriceUsd)}
                    </span>
                  </li>
                )}
                {selectedHotel && (
                  <li className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Hotel className="h-3.5 w-3.5 text-brand-accent" /> Hotel
                    </span>
                    <span className="text-right text-xs">
                      {selectedHotel.name}
                      <br />
                      {formatMoney(selectedHotel.totalPriceUsd || 0)}
                    </span>
                  </li>
                )}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-3">
                <span className="font-medium text-slate-700">Total estimado</span>
                <span className="text-2xl font-bold text-brand-accent">
                  {formatMoney(totalEstimate())}
                </span>
              </div>
            </div>

            {!user && (
              <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-brand-accent">
                Debes{' '}
                <Link href="/auth" className="font-semibold underline">
                  iniciar sesión
                </Link>{' '}
                para confirmar tu reserva con MG Mundo Turístico.
              </p>
            )}

            <button
              type="button"
              className="btn-panel"
              disabled={loading || !selectedOutbound}
              onClick={confirmBooking}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Confirmar reserva <Check className="h-4 w-4" />
                </>
              )}
            </button>

            <WhatsAppButton
              variant="panel"
              label="Cotizar / confirmar por WhatsApp"
              message={buildQuoteMessage({
                destination: destName,
                departureDate,
                returnDate: tripType === 'roundtrip' ? returnDate : undefined,
                tripType,
                adults: passengers.adults,
                children: passengers.children,
                infants: passengers.infants,
                seniors: passengers.seniors,
              })}
            />
          </div>
        )}

        {/* CTA ventas siempre visible en el flujo */}
        {step !== 'review' && (
          <div className="mt-6 border-t border-orange-100 pt-4">
            <WhatsAppButton
              variant="panel"
              label="¿Prefieres que te coticemos por WhatsApp?"
              message={buildQuoteMessage({
                destination: destName,
                departureDate,
                returnDate: tripType === 'roundtrip' ? returnDate : undefined,
                tripType,
                adults: passengers.adults,
                children: passengers.children,
                infants: passengers.infants,
                seniors: passengers.seniors,
              })}
            />
          </div>
        )}
      </div>

      <div className="border-t border-orange-100 bg-gradient-to-r from-slate-50 via-orange-50/40 to-slate-50 px-5 py-3 text-center text-[10px] text-slate-500">
        <span className="font-medium text-brand-accent">MG</span>
        {' · '}
        Atención personalizada · +58 414-9119477 · mundoturisticomg@gmail.com
        {' · '}
        <Link href="/ayuda" className="text-brand-blue hover:underline">
          Ayuda
        </Link>
      </div>
    </aside>
  );
}
