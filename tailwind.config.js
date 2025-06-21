/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#00FFFF",
        "neon-magenta": "#FF00FF",
        "neon-cyan-rgb": "0, 255, 255",
        "neon-magenta-rgb": "255, 0, 255",
      },
      animation: {
        "gradient-fade": "gradient-fade 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "gradient-fade": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow": {
          "from": { "box-shadow": "0 0 20px rgba(0, 255, 255, 0.5)" },
          "to": { "box-shadow": "0 0 30px rgba(0, 255, 255, 0.8)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};