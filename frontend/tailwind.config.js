/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A237E",
        "background-light": "#F5F5F5",
        "background-dark": "#0D1117",
        positive: "#4CAF50",
        negative: "#F44336",
        "text-light": "#333333",
        "text-dark": "#F5F5F5",
        "card-dark": "#161B22",
        "card-light": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
