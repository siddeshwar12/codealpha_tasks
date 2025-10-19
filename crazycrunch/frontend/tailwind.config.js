/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF006E",
        bgDark: "#0f0f10",
        card: "#161618",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        poppins: ["Poppins", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
