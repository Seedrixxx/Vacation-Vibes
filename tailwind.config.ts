import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0B3B3C",
          50: "#E6F0F0",
          100: "#CCE1E1",
          200: "#99C3C4",
          300: "#66A5A6",
          400: "#338789",
          500: "#0B3B3C",
          600: "#092F30",
          700: "#072324",
          800: "#041718",
          900: "#020C0C",
        },
        sand: {
          DEFAULT: "#F5F1E8",
          50: "#FDFCFA",
          100: "#FAF8F3",
          200: "#F5F1E8",
          300: "#E8E0CE",
          400: "#DBCFB4",
          500: "#CEBE9A",
          600: "#B5A277",
          700: "#968259",
          800: "#6F6042",
          900: "#483F2B",
        },
        gold: {
          DEFAULT: "#C8A24A",
          50: "#FAF6EB",
          100: "#F5EDD7",
          200: "#EBDBAF",
          300: "#E1C987",
          400: "#D7B75F",
          500: "#C8A24A",
          600: "#A6843A",
          700: "#7D632C",
          800: "#54421D",
          900: "#2B210F",
        },
        charcoal: {
          DEFAULT: "#121416",
          50: "#E8E9E9",
          100: "#D1D2D3",
          200: "#A3A5A7",
          300: "#75787B",
          400: "#474B4F",
          500: "#121416",
          600: "#0E1012",
          700: "#0B0C0D",
          800: "#070809",
          900: "#040404",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "gentle-float": "gentleFloat 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gentleFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.06)",
        elegant: "0 8px 30px rgba(0, 0, 0, 0.08)",
        lift: "0 12px 40px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
