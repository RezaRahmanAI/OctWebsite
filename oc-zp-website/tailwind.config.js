/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff',
          100: '#d9e9ff',
          200: '#b5d7ff',
          300: '#8ec0ff',
          400: '#5ea0ff',
          500: '#337bff',
          600: '#1f5fe6',
          700: '#1748b3',
          800: '#143b8a',
          900: '#112f6c',
        },
        surface: '#f8fafc',
        ink: '#0f172a',
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
