'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BRAND_WEB } from '@/lib/brand';

/** Footer y flotante WhatsApp: ocultar footer en el globo fullscreen */
export function SiteChrome() {
  const pathname = usePathname();
  const isGlobe = pathname === '/';

  return (
    <>
      {!isGlobe && <Footer />}
      <WhatsAppButton
        variant="floating"
        label="Cotizar por WhatsApp"
        message={`Hola ${BRAND_WEB.name}, quiero cotizar un viaje.`}
        className={isGlobe ? 'bottom-28 md:bottom-24' : undefined}
      />
    </>
  );
}
