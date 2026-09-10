/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          500: "#3b6bf5",
          600: "#2c54d6",
          700: "#2444ad",
        },
      },
    },
  },
  plugins: [],
};
