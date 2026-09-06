/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        base: "#121108",
        sidebar: "#0e0d08",
        surface: "#1b1912",
        "surface-2": "#201e15",
        border: "#2c2a1f",
        "border-light": "#38351f",
        olive: {
          DEFAULT: "#8b9268",
          light: "#a7ad86",
          dark: "#6f7552",
          soft: "#7d8560",
        },
        tan: {
          DEFAULT: "#c9a06e",
          light: "#dcbb8e",
          dark: "#b98f5c",
          pale: "#efe2c9",
        },
        cream: "#f2ecd9",
        ink: {
          DEFAULT: "#f3f0e6",
          soft: "#c9c5b6",
          muted: "#8f8b7b",
          faint: "#5f5c50",
        },
        success: "#8fbc6f",
        danger: "#d97757",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
