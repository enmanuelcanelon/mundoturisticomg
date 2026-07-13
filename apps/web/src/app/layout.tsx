import type { Metadata } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { AppProviders } from '@/components/providers/AppProviders';
import { BRAND_WEB } from '@/lib/brand';

const display = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_WEB.name} | ${BRAND_WEB.tagline}`,
    template: `%s | ${BRAND_WEB.name}`,
  },
  description: `${BRAND_WEB.legalName} — Agencia de viajes personales y corporativos. Explora el mundo, agenda vuelos y hoteles. ${BRAND_WEB.phoneDisplay}`,
  keywords: [
    'viajes',
    'vuelos',
    'hoteles',
    'Venezuela',
    'agencia de viajes',
    'MG Mundo Turístico',
    'mgmundoturistico',
    'eventos corporativos',
  ],
  icons: {
    icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/logo-512.png', sizes: '512x512', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <AppProviders>
          <Header />
          <main className="min-h-screen">{children}</main>
          <SiteChrome />
        </AppProviders>
      </body>
    </html>
  );
}
