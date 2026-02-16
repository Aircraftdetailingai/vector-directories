import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
        },
        brown: {
          50: "#FEFCE8",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#D4A843",
          400: "#B8860B",
          500: "#92400E",
          600: "#78350F",
          700: "#5C2C0A",
          800: "#451A03",
          900: "#2C1103",
          950: "#1A0A02",
        },
        cream: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
