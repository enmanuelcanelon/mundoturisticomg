import type { Metadata } from 'next';
import Link from 'next/link';
import { PartyPopper, Briefcase, Users, Sparkles } from 'lucide-react';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BRAND_WEB } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Eventos y corporativo',
  description: 'Fiestas temáticas, eventos grupales y viajes corporativos — MG Mundo Turístico',
};

const items = [
  {
    icon: Briefcase,
    title: 'Viajes corporativos',
    desc: 'Logística de vuelos, hoteles y traslados para tu empresa, con atención personalizada.',
  },
  {
    icon: PartyPopper,
    title: 'Fiestas y eventos',
    desc: 'Fiestas temáticas, animación y recreación para eventos sociales o corporativos.',
  },
  {
    icon: Users,
    title: 'Grupos y packs',
    desc: 'Paquetes nacionales e internacionales para grupos con tarifas y coordinación centralizada.',
  },
  {
    icon: Sparkles,
    title: 'Planificación a medida',
    desc: 'Diseñamos la experiencia completa: destino, agenda y detalles que marcan la diferencia.',
  },
];

export default function EventosPage() {
  const msg = `Hola ${BRAND_WEB.name}, quiero cotizar un *evento / viaje corporativo*. ¿Me orientan?`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
        Soluciones de negocio
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white">
        Eventos y <span className="text-brand-sky">corporativo</span>
      </h1>
      <p className="mt-4 max-w-2xl text-white/65">
        Además de vuelos y hoteles, en {BRAND_WEB.name} organizamos experiencias grupales y
        corporativas con la misma calidad y confianza.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, desc }) => (
          <article
            key={title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/30">
              <Icon className="h-5 w-5 text-brand-accent" />
            </div>
            <h2 className="mt-3 font-semibold text-white">{title}</h2>
            <p className="mt-1.5 text-sm text-white/55">{desc}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-brand-accent/30 bg-gradient-to-br from-brand-primary/40 to-brand-night p-8">
        <h2 className="font-display text-xl font-bold text-white">¿Tienes un evento en mente?</h2>
        <p className="mt-2 text-sm text-white/65">
          Cuéntanos tipo de evento, fecha, ciudad y número de invitados. Te respondemos por WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <WhatsAppButton message={msg} label="Cotizar evento por WhatsApp" />
          <Link href="/contacto" className="btn-secondary">
            Ver contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
