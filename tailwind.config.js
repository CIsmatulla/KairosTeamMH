/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        brand: {
          50: '#EEECFF',
          100: '#DCD8FF',
          200: '#BDB5FF',
          300: '#9A8DFF',
          400: '#7A69FF',
          500: '#5B4BFF', // primary deep purple
          600: '#4A3BE0',
          700: '#3A2DB8',
          800: '#2B2090',
          900: '#1E1668',
        },
        navy: {
          50: '#F1F5F9',
          100: '#E2E8F0',
          400: '#475569',
          700: '#1E293B',
          800: '#0F172A', // navy accent
          900: '#020617',
        },
        emerald: {
          500: '#22C55E', // green highlight
          600: '#16A34A',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B', // orange progress
        },
        ink: {
          DEFAULT: '#0F172A',
          soft: '#334155',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(15, 23, 42, 0.12)',
        card: '0 2px 16px -4px rgba(15, 23, 42, 0.08)',
        lift: '0 12px 40px -12px rgba(91, 75, 255, 0.35)',
        glow: '0 0 40px -8px rgba(91, 75, 255, 0.45)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #5B4BFF 0%, #7A69FF 50%, #9A8DFF 100%)',
        'dark-card': 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(17,24,39,0.9) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
