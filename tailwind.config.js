/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        osrs: {
          gold: '#c9a227',
          goldBright: '#ffd700',
          brown: '#3d2b1f',
          brownLight: '#5c4530',
          parchment: '#e8d5a0',
          dark: '#1a1410',
          darker: '#0d0a08',
        },
        stoner: {
          green: '#4a7c59',
          greenBright: '#6bcb77',
          greenDeep: '#2d5a3d',
          purple: '#7b5cbf',
          purpleDeep: '#4a3373',
          haze: '#a8e6cf',
        },
      },
      fontFamily: {
        osrs: ['"Press Start 2P"', 'monospace'],
        medieval: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'haze-gradient': 'linear-gradient(135deg, #0d0a08 0%, #1a1410 30%, #2d5a3d 70%, #4a3373 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c9a227 0%, #ffd700 50%, #c9a227 100%)',
        'smoke': 'radial-gradient(ellipse at center, rgba(107, 203, 119, 0.08) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'smoke': 'smoke 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        smoke: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(201, 162, 39, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(201, 162, 39, 0.6), 0 0 30px rgba(107, 203, 119, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
