/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out forwards", // 'forwards' keeps the end state
      },
    },
  },
  plugins: [],
}
