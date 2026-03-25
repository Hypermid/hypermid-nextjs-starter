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
        surface: {
          DEFAULT: "#0d0d0f",
          100: "#141418",
          200: "#1a1a20",
          300: "#22222a",
        },
        accent: {
          DEFAULT: "#7b61ff",
          hover: "#6a4fff",
        },
        border: {
          DEFAULT: "#2a2a35",
        },
      },
    },
  },
  plugins: [],
};
export default config;
