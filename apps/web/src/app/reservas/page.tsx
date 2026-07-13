'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plane, Hotel, Loader2, Calendar } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

type Booking = {
  id: string;
  reference: string;
  type: string;
  status: string;
  tripType?: string | null;
  departureDate?: string | null;
  returnDate?: string | null;
  adults: number;
  children: number;
  infants: number;
  seniors: number;
  totalAmountUsd: string | number;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    itemType: string;
    totalPriceUsd: string | number;
    flight?: {
      flightNumber: string;
      originCity?: { nameEs: string };
      destinationCity?: { nameEs: string };
      departureAt: string;
    } | null;
    hotel?: { name: string } | null;
  }>;
};

const statusLabel: Record<string, string> = {
  DRAFT: 'Borrador',
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

export default function ReservasPage() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setLoading(false);
      return;
    }
    bookingsApi
      .list()
      .then((data) => setBookings(data as Booking[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [user, hydrated]);

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="font-display text-2xl font-bold">Mis reservas</h1>
        <p className="mt-3 text-white/60">
          Inicia sesión para ver y gestionar tus viajes.
        </p>
        <Link href="/auth?next=/reservas" className="btn-primary mt-6 inline-flex">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-28">
      <h1 className="font-display text-3xl font-bold">Mis reservas</h1>
      <p className="mt-2 text-white/50">
        Hola {user.firstName}, aquí están tus viajes con Mundo Turístico MG.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!bookings.length && !error && (
        <div className="glass mt-10 rounded-3xl p-10 text-center">
          <p className="text-white/60">Aún no tienes reservas.</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Explorar el planeta
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {bookings.map((b) => (
          <article key={b.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                  {b.reference}
                </p>
                <p className="mt-1 text-lg font-semibold">{statusLabel[b.status] || b.status}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/45">
                  <Calendar className="h-3 w-3" />
                  {format(parseISO(b.createdAt), "d MMM yyyy", { locale: es })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-accent">
                  ${Number(b.totalAmountUsd).toFixed(0)}
                </p>
                <p className="text-[10px] text-white/40">{b.paymentStatus}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              {b.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                  {item.itemType === 'FLIGHT' ? (
                    <Plane className="h-4 w-4 text-brand-sky" />
                  ) : (
                    <Hotel className="h-4 w-4 text-brand-accent" />
                  )}
                  {item.flight ? (
                    <span>
                      {item.flight.flightNumber}: {item.flight.originCity?.nameEs} →{' '}
                      {item.flight.destinationCity?.nameEs}
                    </span>
                  ) : item.hotel ? (
                    <span>{item.hotel.name}</span>
                  ) : (
                    <span>{item.itemType}</span>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-white/40">
              Pasajeros: {b.adults}A · {b.children}N · {b.infants}B · {b.seniors}T
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
