/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF6EF",
        "paper-dim": "#F1EADA",
        ink: "#1B1F3B",
        "ink-soft": "#4B4F6B",
        coral: "#FF6B4A",
        moss: "#2F8F6E",
        gold: "#D8A93B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        ticket: "10px",
      },
      backgroundImage: {
        perforation:
          "repeating-linear-gradient(to bottom, transparent 0 6px, #1B1F3B33 6px 8px)",
      },
    },
  },
  plugins: [],
};
