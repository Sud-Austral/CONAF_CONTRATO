/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A5D6A7', // Verde claro
          DEFAULT: '#2E7D32', // Verde principal CONAF
          dark: '#1B5E20', // Verde oscuro
        },
        secondary: {
          light: '#64B5F6',
          DEFAULT: '#1565C0', // Azul institucional
          dark: '#0D47A1',
        },
        neutral: {
          50: '#F5F7F5', // Fondo general
          100: '#EEEEEE',
          200: '#E0E0E0', // Bordes
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#757575',
          600: '#616161', // Texto secundario
          700: '#424242',
          800: '#212121',
          900: '#1C1C1C', // Texto principal
        },
        success: '#2E7D32',
        warning: '#F9A825',
        error: '#C62828',
        info: '#1565C0',
        bg: '#F5F7F5',
        surface: '#FFFFFF',
        border: '#E0E0E0',
      },
      fontFamily: {
        display: ['Merriweather', 'Georgia', 'serif'],
        body: ['Open Sans', 'Inter', 'sans-serif'],
        data: ['Inter', 'Roboto Mono', 'monospace'], // Recomendación 1: Fuente para datos
      },
      boxShadow: {
        'soft': '0 10px 40px -12px rgba(46, 125, 50, 0.08)', // Recomendación 3: Sombras verdosas suaves
        'kpi': '0 4px 20px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(46, 125, 50, 0.03)',
        'premium': '0 20px 50px -12px rgba(27, 94, 32, 0.12)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
