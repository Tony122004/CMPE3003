/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C4552A',
        ink: '#1C2B24',
        canvas: '#F3EBDD',
        paper: '#FFF8EF',
        moss: '#2C5A45',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'sans-serif'],
      },
      boxShadow: {
        card: '6px 6px 0 0 rgba(28, 43, 36, 0.12)',
      },
    },
  },
  plugins: [],
}
