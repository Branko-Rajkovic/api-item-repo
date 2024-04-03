/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{pug,html}'],
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['Comfortaa', 'sans-serif'],
        sriracha: ['Sriracha', 'sans-serif'],
        bakbakone: ['Bakbak One', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
