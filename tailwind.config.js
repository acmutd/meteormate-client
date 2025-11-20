/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['"Urbanist"', 'sans-serif'],
        oranienbaum: ['"Oranienbaum"', 'serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        pavanam: ['"Pavanam"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
