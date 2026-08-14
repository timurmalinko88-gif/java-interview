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
        ink: {
          950: '#0E1116',
        },
        panel: {
          900: '#171B22',
          700: '#1D2229',
        },
        paper: {
          50: '#F6F4EF',
        },
        roast: {
          50: 'rgba(193,127,43,0.08)',
          500: '#C17F2B',
          600: '#A66A22',
        },
        pine: {
          500: '#4E8B6B',
          600: '#3E6F55',
        },
        plum: {
          500: '#8672B8',
          600: '#6E5A9E',
        },
        darkBg: '#0E1116',
        darkCard: '#171B22',
        lightBg: '#F6F4EF',
        lightCard: '#FFFFFF',
        'border-light': '#E5E1D8',
      },
      borderRadius: {
        'md': '6px',
        'lg': '10px',
        'xl': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 15px rgba(193, 127, 43, 0.3)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
