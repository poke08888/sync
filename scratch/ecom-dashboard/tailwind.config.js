/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pantone: {
          293: '#003DA5',
          light: '#3364B7',
          dark: '#002C7A',
        },
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F8FAFC',
        textMuted: '#94A3B8',
        border: '#334155'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
