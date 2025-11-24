export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#3b82f6",
          indigo: "#6366f1",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
