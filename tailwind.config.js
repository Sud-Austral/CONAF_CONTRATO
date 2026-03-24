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
          light: '#A5D6A7', 
          DEFAULT: '#2E7D32', 
          dark: '#1B5E20', 
        },
        secondary: {
          light: '#64B5F6',
          DEFAULT: '#1565C0', 
          dark: '#0D47A1',
        },
        neutral: {
          50: '#F5F7F5', 
          100: '#EEEEEE',
          200: '#E0E0E0', 
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#757575',
          600: '#616161', 
          700: '#424242',
          800: '#212121',
          900: '#1C1C1C', 
        },
        success: '#4CAF50', // Recomendación 6: Verde brillante para estados activos
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
        mono: ['Roboto Mono', 'Fira Code', 'monospace'], // Recomendación 2
      },
      boxShadow: {
        'soft': '0 10px 40px -12px rgba(46, 125, 50, 0.08)', 
        'kpi': '0 4px 20px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(46, 125, 50, 0.03)',
        'premium': '0 2px 4px rgba(0,0,0,0.04), 0 12px 28px rgba(46,125,50,0.06)', // Recomendación 8: Layered shadow
      },
      letterSpacing: {
        'extreme': '0.3em', // Recomendación 3
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear', // Recomendación 17
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
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
