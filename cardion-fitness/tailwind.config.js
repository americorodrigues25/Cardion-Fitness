/** @type {import('tailwindcss').Config} */
const colors = require('./src/styles/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,tsx,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['PoppinsRegular'],
      },
    },
  },
  plugins: [],
};
