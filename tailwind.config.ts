import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blur: {
          bg: "#0B1320",
          surface: "#0D1B2A",
          card: "#112233",
          border: "#1C334A",
          teal: {
            DEFAULT: "#00D2B4",
            light: "#26E5C8",
            dark: "#00A890",
            glow: "rgba(0, 210, 180, 0.25)",
          },
          cyan: {
            DEFAULT: "#06B6D4",
            light: "#22D3EE",
            dark: "#0891B2",
          },
          mint: {
            DEFAULT: "#10B981",
            light: "#34D399",
          },
        },
        brand: {
          blue: {
            DEFAULT: "#00D2B4",
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            500: "#00D2B4",
            600: "#00BFA5",
            700: "#009688",
            900: "#004D40",
          },
          lavender: {
            DEFAULT: "#8B5CF6",
            50: "#F5F3FF",
            100: "#EDE9FE",
            200: "#DDD6FE",
            300: "#C4B5FD",
            500: "#8B5CF6",
            600: "#7C3AED",
            700: "#6D28D9",
          },
          lime: {
            DEFAULT: "#00D2B4",
            50: "#F0FDF4",
            100: "#DCFCE7",
            400: "#4ADE80",
            500: "#00D2B4",
            600: "#16A34A",
          },
          navy: {
            DEFAULT: "#0B1320",
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            700: "#1E293B",
            800: "#0F172A",
            900: "#0B1320",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 0 15px -3px rgba(0, 210, 180, 0.08)",
        "card-hover": "0 12px 30px -4px rgba(0, 210, 180, 0.22), 0 0 20px -2px rgba(0, 210, 180, 0.15)",
        teal: "0 0 25px -5px rgba(0, 210, 180, 0.4)",
        badge: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
