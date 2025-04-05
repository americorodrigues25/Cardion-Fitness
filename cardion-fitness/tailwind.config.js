/** @type {import('tailwindcss').Config} */
const colors = require('./src/styles/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,tsx,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        colorDark100: '#27272A',
        colorDark200: '#18181B',
        colorDark300: '#09090B',
        colorDark400: '#000000',
        colorLight200: '#E4E4E7',
        colorLight300: '#D4D4D8',
        colorInputs: '#171c26',
        colorViolet: '#6943FF',
      },
      colors,
      fontFamily: {
        sans: ['PoppinsRegular'],
      },
    },
  },
  plugins: [],
};
