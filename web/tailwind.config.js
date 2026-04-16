/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'solana-green': '#00ffa3',
        'solana-purple': '#9945ff',
        'gmgn-blue': '#3b82f6',
        'pumpfun-orange': '#f97316',
      },
    },
  },
  plugins: [],
}
