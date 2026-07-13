import type { Metadata } from 'next';
import Link from 'next/link';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BRAND_WEB } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Ayuda y preguntas frecuentes',
  description: `FAQ — ${BRAND_WEB.name}`,
};

const faqs = [
  {
    q: '¿Los precios de la web son finales?',
    a: 'Son estimados. La tarifa final se confirma con aerolínea/hotel. Te avisamos antes de cobrar o emitir.',
  },
  {
    q: '¿Puedo viajar con niños, bebés o tercera edad?',
    a: 'Sí. En el panel elige adultos, niños (2–11), bebés (0–23 meses) y tercera edad (60+). Los precios se ajustan automáticamente.',
  },
  {
    q: '¿Cómo confirmo mi reserva?',
    a: 'Crea una cuenta, completa el flujo (vuelos ± hotel) y confirma. También puedes cotizar por WhatsApp si prefieres atención humana.',
  },
  {
    q: '¿Qué estados tiene mi reserva?',
    a: 'Borrador, pendiente, confirmada, cancelada o completada. Las ves en Mis reservas tras iniciar sesión.',
  },
  {
    q: '¿Hacen viajes corporativos y eventos?',
    a: 'Sí. Revisa la sección Eventos y corporativo o escríbenos por WhatsApp con los detalles del grupo.',
  },
  {
    q: '¿Cómo los contacto rápido?',
    a: `${BRAND_WEB.phoneDisplay} (WhatsApp/llamada) · ${BRAND_WEB.email}`,
  },
];

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">Soporte</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-white">Ayuda y FAQ</h1>
      <p className="mt-3 text-white/60">
        Respuestas rápidas. Si no encuentras lo que buscas, escríbenos: estamos para ayudarte.
      </p>

      <div className="mt-10 space-y-4">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-white/10 bg-white/5 px-5 py-4 open:border-brand-accent/30"
          >
            <summary className="cursor-pointer list-none font-medium text-white marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {f.q}
                <span className="text-brand-accent transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <WhatsAppButton
          message={`Hola ${BRAND_WEB.name}, necesito ayuda con una cotización / reserva.`}
          label="Hablar por WhatsApp"
        />
        <Link href="/contacto" className="btn-secondary">
          Contacto
        </Link>
        <Link href="/" className="btn-secondary">
          Explorar destinos
        </Link>
      </div>
    </div>
  );
}
