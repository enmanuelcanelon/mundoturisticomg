import type { Metadata } from 'next';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BRAND_WEB } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Contacta a ${BRAND_WEB.name}`,
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
        Estamos para ti
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white">Contacto</h1>
      <p className="mt-4 text-white/60">
        Escríbenos o llámanos. Nuestro equipo te ayuda a armar el viaje perfecto.
      </p>

      <div className="mt-6">
        <WhatsAppButton
          label="Escribir por WhatsApp ahora"
          message={`Hola ${BRAND_WEB.name}, quiero información sobre un viaje.`}
          className="w-full sm:w-auto"
        />
      </div>

      <div className="mt-10 space-y-4">
        <a
          href={`tel:${BRAND_WEB.phone}`}
          className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/20">
            <Phone className="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Teléfono / WhatsApp</p>
            <p className="text-lg font-semibold text-white">{BRAND_WEB.phoneDisplay}</p>
          </div>
        </a>

        <a
          href={`mailto:${BRAND_WEB.email}`}
          className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-sky/20">
            <Mail className="h-5 w-5 text-brand-sky" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Correo</p>
            <p className="text-lg font-semibold text-white">{BRAND_WEB.email}</p>
          </div>
        </a>

        <a
          href={BRAND_WEB.instagram}
          target="_blank"
          rel="noreferrer"
          className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20">
            <Instagram className="h-5 w-5 text-pink-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Instagram</p>
            <p className="text-lg font-semibold text-white">@mgmundoturistico</p>
          </div>
        </a>

        <a
          href={BRAND_WEB.facebook}
          target="_blank"
          rel="noreferrer"
          className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:border-brand-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
            <Facebook className="h-5 w-5 text-blue-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Facebook</p>
            <p className="text-lg font-semibold text-white">mgmundoturistico</p>
          </div>
        </a>
      </div>
    </div>
  );
}
