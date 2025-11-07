const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        teal: '#0D9488',
        accent: '#3B82F6',
        emerald: '#10B981',
        background: '#F8FAFC',
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
