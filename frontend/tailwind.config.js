/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          950: '#0B0B0F',
          900: '#1A1A24',
          800: '#242433',
          700: '#2E2E42',
          600: '#3D3D52',
          500: '#4D4D66',
        },
        accent: {
          blue: '#00D4FF',
          purple: '#A855F7',
          cyan: '#06B6D4',
        },
        neutral: {
          950: '#0B0B0F',
          900: '#1F1F2E',
          800: '#2D2D3D',
          700: '#3D3D4D',
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
        'gradient-primary': 'linear-gradient(135deg, #00D4FF 0%, #A855F7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A24 0%, #2E2E42 100%)',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1), transparent 50%)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(0, 212, 255, 0.2)',
        'glow-md': '0 0 40px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 60px rgba(0, 212, 255, 0.4)',
        'glow-purple': '0 0 40px rgba(168, 85, 247, 0.3)',
        'smooth': '0 10px 30px rgba(0, 0, 0, 0.2)',
        'smooth-lg': '0 20px 50px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
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
          from: { opacity: '0', transform: 'scale(0.9)' },
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
