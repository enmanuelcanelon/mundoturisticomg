import Link from 'next/link';
import Image from 'next/image';
import { BRAND_WEB } from '@/lib/brand';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-night/95 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-white ring-2 ring-brand-accent/40">
              <Image src="/logo-hq.jpg" alt={BRAND_WEB.name} width={48} height={48} className="object-cover" />
            </div>
            <div>
              <p className="font-display text-sm font-bold">
                <span className="text-brand-sky">MG</span> Mundo Turístico
              </p>
              <p className="text-[10px] uppercase tracking-wider text-brand-accent">
                {BRAND_WEB.tagline}
              </p>
            </div>
          </div>
          <p className="text-xs text-white/50">
            {BRAND_WEB.legalName}
            <br />
            RIF {BRAND_WEB.rif}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">Explorar</p>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li><Link href="/" className="hover:text-white">Globo / Destinos</Link></li>
            <li><Link href="/reservas" className="hover:text-white">Mis reservas</Link></li>
            <li><Link href="/eventos" className="hover:text-white">Eventos y corporativo</Link></li>
            <li><Link href="/ayuda" className="hover:text-white">Ayuda / FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">Empresa</p>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link href="/legal/terminos" className="hover:text-white">Términos</Link></li>
            <li><Link href="/legal/privacidad" className="hover:text-white">Privacidad</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">Contacto</p>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li>
              <a href={`tel:${BRAND_WEB.phone}`} className="hover:text-white">
                {BRAND_WEB.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND_WEB.email}`} className="hover:text-white">
                {BRAND_WEB.email}
              </a>
            </li>
            <li>
              <a href={BRAND_WEB.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-accent">
                Instagram
              </a>
            </li>
            <li>
              <a href={BRAND_WEB.facebook} target="_blank" rel="noreferrer" className="hover:text-brand-accent">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} {BRAND_WEB.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
