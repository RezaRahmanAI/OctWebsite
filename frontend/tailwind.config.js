/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050817',
          900: '#0a1027',
          800: '#111a3d'
        },
        brand: {
          primary: '#2563eb',
          secondary: '#f97316',
          accent: '#a855f7',
          surface: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        glow: '0 25px 50px -12px rgba(37, 99, 235, 0.35)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.12), transparent 55%), radial-gradient(circle at 75% 0%, rgba(168, 85, 247, 0.18), transparent 50%)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
