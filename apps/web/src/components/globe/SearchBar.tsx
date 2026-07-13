'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Globe2, Loader2 } from 'lucide-react';
import { destinationsApi, type SearchHit } from '@/lib/api';
import { useBookingStore } from '@/store/booking-store';
import clsx from 'clsx';

type Props = {
  /** Barra compacta para no competir con el planeta */
  compact?: boolean;
};

export function SearchBar({ compact = false }: Props) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const flyToDestination = useBookingStore((s) => s.flyToDestination);
  const setSelectedCountry = useBookingStore((s) => s.setSelectedCountry);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await destinationsApi.search(q.trim());
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const select = async (hit: SearchHit) => {
    setQ(hit.name);
    setOpen(false);
    if (hit.type === 'country' && hit.code) {
      try {
        const full = await destinationsApi.country(hit.code);
        setSelectedCountry(full);
        flyToDestination(hit, full);
        return;
      } catch {
        /* fallthrough */
      }
    }
    flyToDestination(hit);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Resultados hacia arriba si la barra está abajo */}
      {open && results.length > 0 && (
        <ul
          className={clsx(
            'glass-dark absolute inset-x-0 z-30 max-h-64 overflow-auto rounded-2xl py-1.5 shadow-glass',
            compact ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {results.map((r) => (
            <li key={`${r.type}-${r.id}`}>
              <button
                type="button"
                onClick={() => select(r)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/40">
                  {r.type === 'country' ? (
                    <Globe2 className="h-3.5 w-3.5 text-brand-sky" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-brand-accent" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{r.name}</span>
                  <span className="text-[11px] text-white/50">
                    {r.type === 'country'
                      ? `País · ${r.code}`
                      : `${r.countryName || ''}${r.code ? ` · ${r.code}` : ''}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className={clsx(
          'flex items-center gap-2.5 border border-white/15 bg-slate-950/75 shadow-glass backdrop-blur-xl',
          compact ? 'rounded-2xl px-3.5 py-2.5' : 'glass rounded-2xl px-4 py-3 shadow-glow',
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-brand-sky" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={compact ? 'Buscar país o ciudad…' : '¿A qué país o ciudad quieres viajar?'}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          aria-label="Buscar destino"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white/50" />}
      </div>
    </div>
  );
}
