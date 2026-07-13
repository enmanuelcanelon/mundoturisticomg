/** Marca y contacto oficiales — MG Mundo Turístico */

export const BRAND_WEB = {
  name: 'MG Mundo Turístico',
  legalName: 'MG Mundo Turístico Viajes y Turismo C.A.',
  tagline: 'Viajes y Turismo',
  rif: 'J-31717014-8',
  rtn: '13042',
  phone: '+584149119477',
  phoneDisplay: '+58 414-9119477',
  email: 'mundoturisticomg@gmail.com',
  instagram: 'https://www.instagram.com/mgmundoturistico/',
  facebook: 'https://www.facebook.com/mgmundoturistico/',
  colors: {
    blue: '#0066CC',
    primary: '#0A4D8C',
    accent: '#FF5A00',
  },
} as const;

/** WhatsApp deep link con mensaje opcional */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${BRAND_WEB.phone.replace(/\D/g, '')}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function buildQuoteMessage(opts: {
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  tripType?: string;
  adults?: number;
  children?: number;
  infants?: number;
  seniors?: number;
  reference?: string;
}): string {
  const dest = opts.destination || 'destino por definir';
  const dates =
    opts.tripType === 'oneway' || !opts.returnDate
      ? `ida ${opts.departureDate || 'por definir'}`
      : `${opts.departureDate || '?'} → ${opts.returnDate || '?'}`;
  const pax = [
    opts.adults ? `${opts.adults} adulto(s)` : null,
    opts.children ? `${opts.children} niño(s)` : null,
    opts.infants ? `${opts.infants} bebé(s)` : null,
    opts.seniors ? `${opts.seniors} tercera edad` : null,
  ]
    .filter(Boolean)
    .join(', ') || 'pasajeros por definir';

  return [
    `Hola, soy cliente de ${BRAND_WEB.name}.`,
    `Quiero cotizar un viaje a *${dest}* (${dates}).`,
    `Pasajeros: ${pax}.`,
    opts.reference ? `Referencia web: ${opts.reference}.` : null,
    '¿Me ayudan a confirmar disponibilidad y precio?',
  ]
    .filter(Boolean)
    .join('\n');
}
