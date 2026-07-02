/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ivory: {
          50: '#fefdf9',
          100: '#fdfaef',
          200: '#faf3db',
          300: '#f5e9bf',
          400: '#edd99e',
          500: '#e0c67a',
        },
        champagne: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f3d999',
          300: '#edc566',
          400: '#d4af37',
          500: '#bf9b2f',
          600: '#a68728',
          700: '#8a6f20',
          800: '#6e5819',
          900: '#524112',
        },
        dark: {
          50: '#f6f5f2',
          100: '#e0ddd6',
          200: '#c2bcaf',
          300: '#a39b88',
          400: '#857b64',
          500: '#6b624e',
          600: '#534c3d',
          700: '#3c372d',
          800: '#26231c',
          900: '#1a1813',
          950: '#0d0c09',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};