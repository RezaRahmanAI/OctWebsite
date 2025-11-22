const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Brand-aware neutrals
        background: '#F3FBFE', // soft blue-tinted background to match logo
        surface: '#FFFFFF',

        // Title / heading color
        title: '#00156a',

        // Complementary CTA color (kept from your original palette)
        secondary: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },

        // PRIMARY = logo blue
        primary: {
          DEFAULT: '#10AFF0', // pulled from logo
          50: '#E7F7FE',
          100: '#CFEFFC',
          200: '#ABE3FA',
          300: '#88D7F8',
          400: '#64CBF5',
          500: '#10AFF0',
          600: '#1089BE',
          700: '#106B97',
          800: '#0F4565',
          900: '#0F263E',
        },

        // Accent: slightly softer variant of the brand blue for chips, subtle borders, etc.
        accent: {
          DEFAULT: '#4EC4F3', // lighter logo blue
          50: '#EAF8FE',
          100: '#D5F0FE',
          200: '#AFE2FC',
          300: '#89D4FA',
          400: '#63C7F7',
          500: '#4EC4F3',
          600: '#249CD0',
          700: '#1776A5',
          800: '#13567A',
          900: '#0F3650',
        },

        // You can keep these utility colors if you use them for states / alerts.
        emerald: {
          DEFAULT: '#10B981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        teal: {
          DEFAULT: '#0D9488',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5f5',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },

      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['"Space Grotesk"', 'Inter', ...defaultTheme.fontFamily.sans],
      },

      boxShadow: {
        glow: '0 20px 45px rgba(15, 23, 42, 0.12)',
        card: '0 30px 90px rgba(15, 23, 42, 0.14)',
      },

      backgroundImage: {
        // Reworked to be brand-blue → brand-blue-light → CTA orange
        'academy-gradient': 'linear-gradient(135deg, #0F263E 0%, #10AFF0 45%, #F97316 100%)',

        // Grids now use logo blue instead of generic Tailwind blue
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(16, 175, 240, 0.35), transparent 55%), radial-gradient(circle at 80% 30%, rgba(16, 107, 151, 0.35), transparent 60%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
