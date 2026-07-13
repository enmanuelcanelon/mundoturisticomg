import type { Config } from 'tailwindcss';

/**
 * Paleta oficial MG Mundo Turístico (logo Instagram)
 * - Azul del globo / tipografía
 * - Naranja-rojo del subrayado y "Viajes y Turismo"
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Azules del logo
          primary: '#0A4D8C',
          secondary: '#1A6BB5',
          blue: '#0066CC',
          blueDeep: '#004A99',
          // Naranja / rojo del trazo del logo
          accent: '#FF5A00',
          accentHot: '#E63900',
          orange: '#FF6600',
          // Neutros
          sky: '#4DB3FF',
          night: '#041018',
          cream: '#F7F9FC',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        glow: '0 0 36px rgba(255, 90, 0, 0.28)',
        'glow-blue': '0 0 36px rgba(0, 102, 204, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
