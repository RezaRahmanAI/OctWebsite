/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f3ff',
          100: '#e5e0ff',
          200: '#cbbdff',
          300: '#af98ff',
          400: '#936ff9',
          500: '#7b49f0',
          600: '#5f2fe1',
          700: '#4820b7',
          800: '#33158a',
          900: '#200b5c',
        },
        accent: {
          400: '#38d6ff',
          500: '#06b6d4',
          600: '#0891b2',
        },
        surface: '#F2F0FF',
        base: '#FFFFFF',
        ink: '#0B1220',
        muted: '#64748B',
      },
      boxShadow: {
        soft: '0 24px 50px -28px rgba(20, 31, 55, 0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
