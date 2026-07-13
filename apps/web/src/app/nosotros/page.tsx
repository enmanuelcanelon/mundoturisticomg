import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Target,
  Eye,
  Users,
  PartyPopper,
  Briefcase,
  Plane,
  Map,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce Mundo Turístico MG — misión, visión y servicios.',
};

const services = [
  { icon: Users, title: 'Agente de viajes', desc: 'Asesoría personalizada para cada itinerario.' },
  { icon: PartyPopper, title: 'Eventos y recreación', desc: 'Organización, animación y fiestas temáticas.' },
  { icon: Briefcase, title: 'Viajes corporativos', desc: 'Logística profesional para tu empresa.' },
  { icon: Plane, title: 'Paquetes nacionales e internacionales', desc: 'Vuelos, hoteles y experiencias.' },
  { icon: Map, title: 'Planificación turística', desc: 'Rutas a medida con calidad garantizada.' },
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-28">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-brand-blue/40 bg-white shadow-glow-blue ring-2 ring-brand-accent/30">
          <Image
            src="/logo-hq.jpg"
            alt="MG Mundo Turístico"
            width={192}
            height={192}
            className="h-full w-full object-cover"
            priority
            quality={95}
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
            Quiénes somos
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            <span className="text-brand-sky">MG</span> Mundo Turístico
          </h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-widest text-brand-accent">
            Viajes y Turismo C.A.
          </p>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-white/65">
        Agencia de viajes con mayor trayectoria nacional en servicios de calidad
        para viajes personales y corporativos.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="glass rounded-3xl p-6">
          <Target className="h-8 w-8 text-brand-accent" />
          <h2 className="mt-4 font-display text-xl font-semibold">Misión</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Somos la Agencia de Viajes que ofrece servicios de calidad en el área
            de viajes personales y corporativos de mayor trayectoria nacional, que
            desde su fundación ha mantenido su posicionamiento en el mercado
            turístico.
          </p>
        </article>
        <article className="glass rounded-3xl p-6">
          <Eye className="h-8 w-8 text-brand-sky" />
          <h2 className="mt-4 font-display text-xl font-semibold">Visión</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Ser la organización líder en el área de viajes personales y
            corporativos a nivel nacional que asegure la satisfacción y confianza
            de nuestros clientes.
          </p>
        </article>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">Nuestros servicios</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/30">
                <Icon className="h-5 w-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm text-white/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass mt-14 rounded-3xl p-8">
        <p className="text-xs uppercase tracking-wider text-white/40">Dirección</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Mariela López</h2>
        <p className="text-brand-accent">Gerente General</p>
        <p className="mt-4 text-sm text-white/55">
          Liderazgo y compromiso con la excelencia en cada viaje que planificamos
          contigo.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Explorar destinos
        </Link>
      </section>
    </div>
  );
}
