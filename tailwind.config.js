/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c2d6ff',
          300: '#a3c2ff',
          400: '#85aeff',
          500: '#006FEE', // Electric Bespoke Blue
          600: '#005bc4',
          700: '#004799',
          800: '#00336e',
          900: '#001f42',
        },
        success: {
          50: '#e8faf0',
          100: '#d1f4e0',
          200: '#a3e9c2',
          300: '#75dfa3',
          400: '#47d485',
          500: '#17C964', // Neon Product Green
          600: '#12a150',
          700: '#0d793c',
          800: '#095028',
          900: '#042814',
        },
        warning: {
          50: '#fef1e9',
          100: '#fde3d3',
          200: '#fbc6a7',
          300: '#f8aa7b',
          400: '#f68e4f',
          500: '#F26D21', // Sharp Orange
          600: '#c2571a',
          700: '#914114',
          800: '#612b0d',
          900: '#301607',
        },
        darkBg: '#0A0A0A', // Pure Deep Dark
        darkCard: '#111111', // Slightly elevated Dark
        lightBg: '#FAFAFA',
        lightCard: '#FFFFFF'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
