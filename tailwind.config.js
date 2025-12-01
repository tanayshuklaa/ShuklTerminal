/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0b1224',
        surface: '#11182b',
        accent: '#3b82f6'
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
};
