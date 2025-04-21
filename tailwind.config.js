/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF5FF',
          100: '#D9E9FF',
          200: '#A7C8FF',
          300: '#75A7FF',
          400: '#4385FF',
          500: '#0F52BA', // Main primary color
          600: '#0A3C8E',
          700: '#062B6D',
          800: '#031B4C',
          900: '#010A2B',
        },
        secondary: {
          50: '#EEFAF3',
          100: '#D9F2E3',
          200: '#A7E2C0',
          300: '#75D19D',
          400: '#43C17A',
          500: '#2E8B57', // Main secondary color
          600: '#236844',
          700: '#194A32',
          800: '#0F2C1F',
          900: '#050F0B',
        },
        accent: {
          50: '#FFF1EE',
          100: '#FFE1D9',
          200: '#FFC3B3',
          300: '#FFA48D',
          400: '#FF8966',
          500: '#FF7F50', // Main accent color
          600: '#E65F35',
          700: '#B2441F',
          800: '#802E0F',
          900: '#4D1704',
        },
        warning: {
          500: '#FBBF24',
        },
        error: {
          500: '#EF4444',
        },
        success: {
          500: '#10B981',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-small': 'bounce-small 1s infinite',
      },
      keyframes: {
        'bounce-small': {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [],
};