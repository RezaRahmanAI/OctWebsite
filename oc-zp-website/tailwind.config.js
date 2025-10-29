/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f8ff',
          100: '#cceeff',
          200: '#99ddff',
          300: '#66cbff',
          400: '#33b9ff',
          500: '#00aeef',
          600: '#0098d1',
          700: '#007aa5',
          800: '#005c78',
          900: '#003d4c',
        },
        surface: '#FDFEFE',
        base: '#FFFFFF',
        ink: '#333333',
        muted: '#5F6368',
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
