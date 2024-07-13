/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#212429",
        darkHover: "#3D404A",
        light: "#f5f5f5",
        primary: "#39E079",
        danger: "#ef4444",
      }
    }
  },
  plugins: [],
}

