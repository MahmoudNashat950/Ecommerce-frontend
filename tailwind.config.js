/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        carbon: "#0f0f0f",
        ink: "#111111",
        pulse: "#38f2c4",
        electric: "#17d9ff",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(23, 217, 255, 0.2), 0 22px 70px rgba(23, 217, 255, 0.18)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
