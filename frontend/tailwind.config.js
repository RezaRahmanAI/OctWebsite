const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#0F172A',
          50: '#f8fafc',
          100: '#edf2f9',
          200: '#dbe3f3',
          300: '#b6c7e5',
          400: '#90a8d2',
          500: '#637fb6',
          600: '#425c94',
          700: '#2b3d6d',
          800: '#192746',
          900: '#0f172a'
        },
        accent: {
          DEFAULT: '#3B82F6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
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
          900: '#064e3b'
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
          900: '#134e4a'
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
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['"Space Grotesk"', 'Inter', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        glow: '0 20px 45px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        'academy-gradient': 'linear-gradient(135deg, #6366F1 0%, #A855F7 45%, #F97316 100%)',
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.35), transparent 55%), radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.35), transparent 60%)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
