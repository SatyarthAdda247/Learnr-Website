/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'learnr-bg': '#FFFAF4',
        'learnr-card': '#FEF6E8',
        'learnr-gold-start': '#B18B3C',
        'learnr-gold-end': '#775A22',
        'learnr-text-dark': '#2D2D2D',
        'learnr-text-light': '#666666',
        'learnr-border-gold': '#A07E41',
        'kuku-black': '#000000',
        'kuku-card': '#191B1F',
        'kuku-red': '#E50914',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
