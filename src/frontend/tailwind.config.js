/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-200px)", opacity: "0" },
        },
      },
      animation: {
        float: "floatUp 2s ease-in forwards",
      },
    },
  },
  plugins: [],
};
