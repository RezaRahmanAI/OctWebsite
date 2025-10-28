/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f4ed',
          100: '#c0e3d1',
          200: '#97d0b3',
          300: '#6cbc95',
          400: '#48a97c',
          500: '#198754',
          600: '#157347',
          700: '#115c39',
          800: '#0c472b',
          900: '#093121',
        },
        surface: '#F6F8FB',
        base: '#FFFFFF',
        ink: '#1F2937',
        muted: '#6B7280',
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
