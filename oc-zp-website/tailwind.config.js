/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f4ff',
          100: '#e3e6ff',
          200: '#c7cafd',
          300: '#a7abfb',
          400: '#8b89fa',
          500: '#6f67f8',
          600: '#5548ef',
          700: '#4335cb',
          800: '#2f2498',
          900: '#1f1763',
        },
        accent: {
          300: '#a5f3ff',
          400: '#67e9ff',
          500: '#29d5ff',
          600: '#11b5e5',
        },
        surface: '#11162d',
        base: '#0b0f24',
        ink: '#f9fbff',
        muted: '#9aa5c6',
        outline: '#1d2242',
      },
      boxShadow: {
        soft: '0 28px 65px -32px rgba(9, 13, 40, 0.55)',
        glow: '0 0 0 1px rgba(105, 92, 255, 0.35), 0 22px 60px -20px rgba(40, 213, 255, 0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
