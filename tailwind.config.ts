import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0A0A0F',
          surface: '#13131A',
          elevated: '#1A1A24',
        },
        border: {
          DEFAULT: '#1E1E2E',
          light: '#2A2A3E',
        },
        gold: '#F5A623',
        crimson: '#C0392B',
        violet: '#8E44AD',
        emerald: '#00D4A1',
        danger: '#FF4757',
        text: {
          primary: '#FFFFFF',
          secondary: '#8B8B9E',
          muted: '#4A4A5E',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #F5A623, #C0392B, #8E44AD)',
        'gradient-brand-h': 'linear-gradient(90deg, #F5A623, #C0392B, #8E44AD)',
        'gradient-surface': 'linear-gradient(135deg, #13131A, #1A1A24)',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 166, 35, 0.3)',
        'glow-purple': '0 0 20px rgba(142, 68, 173, 0.3)',
        'glow-green': '0 0 20px rgba(0, 212, 161, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
