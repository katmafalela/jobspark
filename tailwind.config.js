// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define our neon colors for reusability
        "neon-cyan": "#00FFFF",
        "neon-magenta": "#FF00FF",
        // Define RGB versions for use in box-shadows or drop-shadows
        "neon-cyan-rgb": "0, 255, 255",
        "neon-magenta-rgb": "255, 0, 255",
      },
      animation: {
        // Aurora-like animation for background gradients
        "gradient-fade": "gradient-fade 15s ease infinite",
        "spin-slow": "spin 8s linear infinite",
        tilt: "tilt 10s infinite linear",
      },
      keyframes: {
        "gradient-fade": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        tilt: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(0.5deg)",
          },
          "75%": {
            transform: "rotate(-0.5deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
