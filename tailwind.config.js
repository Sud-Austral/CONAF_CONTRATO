/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        conaf: {
          900: '#1a3d1a',
          800: '#1e4d1e',
          700: '#245924',
          600: '#2d6a2d',
          500: '#3a7d3a',
          400: '#4a9e4a',
          300: '#6ab86a',
          200: '#a8d8a8',
          100: '#d4edd4',
        },
        gold: '#c8a84b',
        cream: '#f5f5f0',
        bg: '#f0f2ed',
      },
      fontFamily: {
        display: ['Merriweather', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
