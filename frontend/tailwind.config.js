/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          950: '#08080C',
          900: '#12121A',
          800: '#1C1C28',
          700: '#282838',
          600: '#3A3A4E',
          500: '#4D4D66',
        },
        accent: {
          blue: '#00D4FF',
          purple: '#A855F7',
          pink: '#EC4899',
          cyan: '#06B6D4',
          emerald: '#10B981',
        },
        neutral: {
          950: '#08080C',
          900: '#181824',
          800: '#262636',
          700: '#38384D',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#FAFBFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00D4FF 0%, #A855F7 50%, #EC4899 100%)',
        'gradient-cyan-purple': 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #12121A 0%, #282838 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.15), transparent 60%)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(0, 212, 255, 0.25)',
        'glow-md': '0 0 35px rgba(0, 212, 255, 0.35)',
        'glow-lg': '0 0 55px rgba(0, 212, 255, 0.5)',
        'glow-purple': '0 0 35px rgba(168, 85, 247, 0.35)',
        'glow-pink': '0 0 35px rgba(236, 72, 153, 0.35)',
        'smooth': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'smooth-lg': '0 20px 50px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'scanline': 'scanline 3s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        scanline: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        2000: '2000ms',
      },
    },
  },
  plugins: [],
};

