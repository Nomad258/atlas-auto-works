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
          black: '#0a0a0a',        // Deepest black
          charcoal: '#1a1a1a',     // Primary background
          surface: '#242424',      // Card/Surface
          burgundy: '#5a0f1d',     // Brand Accent
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
      },
    },
  },
  plugins: [],
}
