import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_WEB } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: `Privacidad y tratamiento de datos — ${BRAND_WEB.name}`,
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 text-white/80">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent">Legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">Política de privacidad</h1>
      <p className="mt-2 text-sm text-white/50">{BRAND_WEB.legalName}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-brand-sky">1. Datos que recopilamos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Cuenta: nombre, correo, teléfono (opcional), contraseña cifrada</li>
            <li>Reservas: destinos, fechas, tipo de pasajeros, contacto</li>
            <li>Técnicos: logs de sesión, IP (seguridad), user-agent</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">2. Finalidad</h2>
          <p className="mt-2">
            Gestionar cotizaciones y reservas, autenticar usuarios, mejorar el servicio y contactarte
            por canales que nos indiques (email, teléfono, WhatsApp).
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">3. Conservación y seguridad</h2>
          <p className="mt-2">
            Aplicamos medidas técnicas (cifrado de contraseñas, tokens JWT, HTTPS en producción) y
            organizativas. No vendemos tus datos a terceros con fines publicitarios.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">4. Encargados y proveedores</h2>
          <p className="mt-2">
            Podemos compartir datos mínimos necesarios con aerolíneas, hoteles o sistemas de pago
            para cumplir el servicio contratado.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">5. Tus derechos</h2>
          <p className="mt-2">
            Puedes solicitar acceso, corrección o eliminación de datos de cuenta escribiendo a{' '}
            {BRAND_WEB.email}.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand-sky">6. Contacto privacidad</h2>
          <p className="mt-2">
            {BRAND_WEB.email} · {BRAND_WEB.phoneDisplay}
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/legal/terminos" className="text-brand-accent hover:underline">
          Términos y condiciones
        </Link>
        {' · '}
        <Link href="/" className="text-white/50 hover:text-white">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
