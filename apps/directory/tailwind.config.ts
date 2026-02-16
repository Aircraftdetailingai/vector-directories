import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#D8F3DC",
          200: "#b7e4c7",
          300: "#95d5ab",
          400: "#74c68e",
          500: "#52b788",
          600: "#40916c",
          700: "#2d6a4f",
          800: "#1B4332",
          900: "#0f2a1e",
          950: "#081912",
        },
        sage: "#D8F3DC",
      },
      fontFamily: {
        heading: [
          "var(--font-ibm-plex-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "var(--font-merriweather)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
