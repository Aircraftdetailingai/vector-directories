import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: {
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#CCCCCC",
          300: "#999999",
          400: "#666666",
          500: "#333333",
          600: "#1A1A1A",
          700: "#141414",
          800: "#0F0F0F",
          900: "#0A0A0A",
          950: "#050505",
        },
        gold: {
          50: "#FBF8EC",
          100: "#F5EDCC",
          200: "#EDDF9E",
          300: "#E5D170",
          400: "#DCC347",
          500: "#D4AF37",
          600: "#B8962E",
          700: "#8E7423",
          800: "#655219",
          900: "#3B300F",
        },
        ivory: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)"],
        body: ["var(--font-raleway)"],
      },
    },
  },
  plugins: [],
};

export default config;
