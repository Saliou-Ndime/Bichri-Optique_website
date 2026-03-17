import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bichri: {
          50: "#f5f0ff",
          100: "#ede5ff",
          200: "#dcceff",
          300: "#c3a8ff",
          400: "#a674ff",
          500: "#8b3dff",
          600: "#7c1aff",
          700: "#6d0aeb",
          800: "#5b0bc5",
          900: "#4c0da1",
          950: "#2e006e",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        display: ["var(--font-clash)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-bichri":
          "linear-gradient(135deg, #7c1aff 0%, #a674ff 50%, #f5f0ff 100%)",
        "gradient-bichri-dark":
          "linear-gradient(135deg, #2e006e 0%, #5b0bc5 50%, #7c1aff 100%)",
        "gradient-bichri-subtle":
          "linear-gradient(135deg, #f5f0ff 0%, #ede5ff 50%, #dcceff 100%)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#f5f0ff",
              100: "#ede5ff",
              200: "#dcceff",
              300: "#c3a8ff",
              400: "#a674ff",
              500: "#8b3dff",
              600: "#7c1aff",
              700: "#6d0aeb",
              800: "#5b0bc5",
              900: "#4c0da1",
              DEFAULT: "#7c1aff",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#faf5ff",
              100: "#f3e8ff",
              200: "#e9d5ff",
              300: "#d8b4fe",
              400: "#c084fc",
              500: "#a855f7",
              600: "#9333ea",
              700: "#7e22ce",
              800: "#6b21a8",
              900: "#581c87",
              DEFAULT: "#a855f7",
              foreground: "#ffffff",
            },
            focus: "#7c1aff",
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#2e006e",
              100: "#4c0da1",
              200: "#5b0bc5",
              300: "#6d0aeb",
              400: "#7c1aff",
              500: "#8b3dff",
              600: "#a674ff",
              700: "#c3a8ff",
              800: "#dcceff",
              900: "#ede5ff",
              DEFAULT: "#a674ff",
              foreground: "#ffffff",
            },
            focus: "#a674ff",
          },
        },
      },
    }),
  ],
};

export default config;
