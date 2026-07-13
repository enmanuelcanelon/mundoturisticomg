'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe2, Menu, User, X, Plane, Hotel, Phone, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Explorar', icon: Globe2 },
  { href: '/reservas', label: 'Reservas', icon: Plane },
  { href: '/eventos', label: 'Eventos', icon: PartyPopper },
  { href: '/nosotros', label: 'Nosotros', icon: Hotel },
  { href: '/contacto', label: 'Contacto', icon: Phone },
];

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-brand-blue/50 bg-white shadow-glow-blue ring-2 ring-brand-accent/30 transition group-hover:ring-brand-accent/60 sm:h-14 sm:w-14">
            <Image
              src="/logo-hq.jpg"
              alt="MG Mundo Turístico"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              priority
              quality={95}
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold tracking-wide text-white">
              <span className="text-brand-sky">MG</span>{' '}
              <span className="text-white">Mundo Turístico</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-accent">
              Viajes y Turismo
            </p>
          </div>
        </Link>

        <nav className="glass hidden items-center gap-1 rounded-2xl px-2 py-1.5 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'rounded-xl px-3 py-2 text-sm font-medium transition',
                pathname === href
                  ? 'bg-brand-accent/20 text-brand-accent'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <WhatsAppButton
              className="!py-2 !text-xs"
              label="WhatsApp"
              message="Hola MG Mundo Turístico, quiero cotizar un viaje."
            />
          </div>
          {user ? (
            <div className="glass flex items-center gap-2 rounded-2xl px-3 py-1.5">
              <User className="h-4 w-4 text-brand-accent" />
              <span className="hidden text-sm text-white/90 sm:inline">
                {user.firstName}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs text-white/50 hover:text-white"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn-primary !py-2 !text-sm">
              Ingresar
            </Link>
          )}
          <button
            type="button"
            className="glass rounded-xl p-2.5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="pointer-events-auto mx-4 glass-dark rounded-2xl p-4 md:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
