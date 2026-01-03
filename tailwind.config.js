/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#FAF9F6', // Soft off-white color
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite', // Smooth, slower spin
      },
    },
  },
  plugins: [],
}
