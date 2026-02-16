import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#1E3A5F",
          950: "#102a43",
        },
        gold: {
          50: "#fdf8ef",
          100: "#faefd7",
          200: "#f5dfae",
          300: "#eecb7c",
          400: "#e5b54a",
          500: "#D4A843",
          600: "#b8912a",
          700: "#9a7622",
          800: "#7d5f1e",
          900: "#664d1b",
          950: "#3a2b0f",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
