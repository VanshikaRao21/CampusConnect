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
        brand: {
          blue: {
            DEFAULT: "#2563EB",
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            500: "#2563EB",
            600: "#1D4ED8",
            700: "#1E40AF",
            900: "#1E3A8A",
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
            DEFAULT: "#84CC16",
            50: "#F7FEE7",
            100: "#ECFCCB",
            400: "#A3E635",
            500: "#84CC16",
            600: "#65A30D",
          },
          navy: {
            DEFAULT: "#0F172A",
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
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
        card: "0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 8px 16px -4px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 12px 24px -4px rgba(37, 99, 235, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06)",
        badge: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
