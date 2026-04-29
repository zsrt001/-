import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        xuan: {
          950: "#060504",
          900: "#0c0907",
          800: "#15100c"
        },
        cinnabar: {
          500: "#a5332a",
          600: "#84251f"
        },
        antique: {
          100: "#efe3c2",
          300: "#c4a35d",
          500: "#987337",
          700: "#5f421c"
        },
        mist: {
          100: "#f4efe2",
          300: "#b8ad91",
          700: "#4d493f"
        }
      },
      boxShadow: {
        ember: "0 0 28px rgba(152, 115, 55, 0.22)",
        seal: "0 0 0 1px rgba(196, 163, 93, 0.25), inset 0 0 24px rgba(95, 66, 28, 0.18)"
      },
      backgroundImage: {
        "gilded-line":
          "linear-gradient(90deg, transparent, rgba(196, 163, 93, 0.72), transparent)"
      }
    }
  },
  plugins: []
};

export default config;
