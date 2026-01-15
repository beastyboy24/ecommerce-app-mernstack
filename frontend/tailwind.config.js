/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This enables dark mode via class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#F59E0B',
      },
    },
  },
  plugins: [],
}