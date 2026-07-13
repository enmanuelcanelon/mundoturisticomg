import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_WEB } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: `Términos de uso y reservas de ${BRAND_WEB.name}`,
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 text-white/80">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent">Legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">Términos y condiciones</h1>
      <p className="mt-2 text-sm text-white/50">
        {BRAND_WEB.legalName} · RIF {BRAND_WEB.rif}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-brand-sky">1. Identificación</h2>
          <p className="mt-2">
            El sitio web es operado por {BRAND_WEB.legalName} (“MG”, “nosotros”). Contacto:{' '}
            {BRAND_WEB.phoneDisplay} · {BRAND_WEB.email}.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">2. Servicios</h2>
          <p className="mt-2">
            Ofrecemos intermediación y asesoría en viajes personales y corporativos: vuelos, hoteles,
            paquetes, eventos y planificación turística. La disponibilidad final depende de
            aerolíneas, hoteles y proveedores.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">3. Precios y cotizaciones</h2>
          <p className="mt-2">
            Los precios mostrados en la plataforma son <strong className="text-white">estimados</strong> y
            pueden variar hasta la confirmación formal. Impuestos, tasas y cargos adicionales se
            informarán en la cotización final.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">4. Reservas</h2>
          <p className="mt-2">
            Al crear una reserva en la web, el usuario declara que los datos de pasajeros son
            correctos. Los estados (pendiente, confirmada, cancelada) se gestionan según políticas de
            proveedores y de MG.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">5. Cancelaciones y cambios</h2>
          <p className="mt-2">
            Están sujetos a las condiciones de cada aerolínea y hotel. Contáctanos por WhatsApp o
            correo para gestionar cambios.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">6. Limitación de responsabilidad</h2>
          <p className="mt-2">
            MG no es responsable de retrasos, cancelaciones o cambios de itinerario causados por
            terceros (aerolíneas, hoteles, clima, fuerza mayor), más allá de la asistencia razonable.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">7. Contacto</h2>
          <p className="mt-2">
            Consultas: {BRAND_WEB.email} · {BRAND_WEB.phoneDisplay}
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/legal/privacidad" className="text-brand-accent hover:underline">
          Política de privacidad
        </Link>
        {' · '}
        <Link href="/" className="text-white/50 hover:text-white">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
