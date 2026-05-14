import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1F3F", light: "#132F52", dark: "#07182E" },
        teal: { DEFAULT: "#00C2BA", dark: "#00A8A0" },
        charcoal: "#2D3748",
        gray: { light: "#F8F9FA", medium: "#A0AEC0" },
      },
      fontFamily: { sans: ["Space Grotesk", "sans-serif"] },
      borderRadius: { DEFAULT: "6px", card: "8px", modal: "12px", full: "9999px" },
      boxShadow: {
        card: "0 4px 12px rgba(10, 31, 63, 0.08)",
        cardHover: "0 8px 24px rgba(10, 31, 63, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
