/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F6FFFA',  // faint mint hint
          100: '#E4FDF2',  // whisper mint
          200: '#C7F9E5',  // pastel mint
          300: '#A8F4D7',  // soft mint
          400: '#89EFC8',  // gentle mint
          DEFAULT:'#6CE8BA', // base subtle mint
          500: '#6CE8BA',  // base subtle mint
          600: '#55D4A6',  // slightly darker mint
          700: '#43B68C',  // mid‑dark mint
          800: '#348C6D',  // deep mint
          900: '#285E4D',  // forest‑mint
        },
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
};