/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Albert Sans'", "'Lexend'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Albert Sans'", "'Lexend'", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        forest: {
          deep: '#09251C',
          DEFAULT: '#0F3D2E',
          dark: '#0F3D2E',
          ink: '#12261D',
          muted: '#3F584C',
          faint: '#6B8477',
          light: '#E8F5EE',
        },
        patina: {
          DEFAULT: '#2FA36B',
          vibrant: '#1C7C54',
          pale: '#41B87D',
          soft: '#E8F5EE',
          border: '#D6E5DC',
          'border-strong': '#B4CFC1',
        },
        kinpaku: {
          gold: '#F2B134',
          rich: '#D97706',
          pale: '#FEF3C7',
        },
        surface: {
          ground: '#F8FAF8',
          card: '#FFFFFF',
          inset: '#EDF3EF',
          border: '#D6E5DC',
          'border-strong': '#B4CFC1',
        },
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      }
    },
  },
  plugins: [],
};
