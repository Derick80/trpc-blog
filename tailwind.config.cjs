/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      darkMode: "media",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;
