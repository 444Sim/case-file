/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif KR"', 'serif'],
        sans: ['"Noto Serif KR"', 'serif'],
        typewriter: ['"Special Elite"', 'monospace'],
      },
    },
  },
  plugins: [],
}