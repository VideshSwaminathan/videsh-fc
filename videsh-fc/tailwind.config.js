/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FDFBF3',
          100: '#FDF8ED',
          200: '#F5E6BA',
          300: '#E8C96B',
          400: '#C9A84C',
          500: '#A8871E',
          600: '#8B6914',
          700: '#6B500E',
          800: '#4A3709',
          900: '#2D2105',
        },
        cream: '#FAFAF8',
        pitch: '#0A0A0A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8C96B 0%, #C9A84C 50%, #8B6914 100%)',
        'gold-subtle': 'linear-gradient(135deg, #FDF8ED 0%, #F5E6BA 100%)',
      },
    },
  },
  plugins: [],
}
