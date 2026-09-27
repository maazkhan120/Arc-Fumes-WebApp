import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        razen: {
          bg: "#faf8f4",
          surface: "#ffffff",
          gold: "#9e8c78",
          "gold-light": "#b5a492",
          "gold-dark": "#7d6e5d",
          black: "#0d0c0a",
          charcoal: "#1c1a17",
          muted: "#5e574f",
          border: "rgba(0, 0, 0, 0.08)",
          sand: "#f4efe6",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        brand: ["var(--font-jost)", "Jost", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        ultra: ".35em",
      },
    },
  },
  plugins: [],
};

export default config;
