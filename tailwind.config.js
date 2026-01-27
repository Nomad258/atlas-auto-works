/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'atlas': {
          black: '#0a0a0a',        // Deepest black - for backgrounds
          charcoal: '#121212',     // Primary card/surface
          surface: '#1E1E1E',      // Secondary surface
          burgundy: '#5a0f1d',     // Brand Accent
          'burgundy-light': '#7d1529',
          gold: '#c4a661',         // Primary Accent
          'gold-light': '#e6c885', // Highlight
          'gold-dim': '#8a7238',   // Muted gold
          silver: '#e0e0e0',       // Text primary
          grey: '#a0a0a0',         // Text secondary
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #c4a661 0%, #e6c885 50%, #c4a661 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
        'gradient-cinematic': 'radial-gradient(circle at center, rgba(30,30,30,0.5) 0%, rgba(10,10,10,1) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      },
    },
  },
  plugins: [],
}
