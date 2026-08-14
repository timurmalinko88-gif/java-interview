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
        canvas: '#ffffff',
        paper: {
          50: '#f4f5f6',
          100: '#eeeff1',
        },
        ink: {
          950: '#101113',
          900: '#1c1d1f',
          800: '#232529',
          700: '#2e3238',
        },
        panel: {
          900: '#16191f',
          700: '#1d222a',
        },
        slate: {
          400: '#9fa1a7',
          500: '#8f99a8',
          600: '#6f7988',
          700: '#505967',
          800: '#2e3238',
          900: '#1c1d1f',
        },
        mist: {
          50: '#e4e7ec',
          100: '#d3d8df',
          200: '#cad0d9',
          300: '#b5bdc9',
        },
        // Attio Cobalt Core system mapped to primary accent
        roast: {
          50: '#e4edff',
          100: '#bad0fa',
          500: '#266df0', // Cobalt Core
          600: '#1b5cd4', // Cobalt Deep
          700: '#144bb2',
        },
        cobalt: {
          50: '#e4edff',
          100: '#bad0fa',
          soft: '#538bf3',
          bright: '#407ff2',
          core: '#266df0',
          deep: '#1b5cd4',
        },
        pine: {
          500: '#10b981',
          600: '#059669',
        },
        plum: {
          500: '#8672B8',
          600: '#6E5A9E',
        },
        darkBg: '#101113',
        darkCard: '#16191f',
        lightBg: '#ffffff',
        lightCard: '#ffffff',
        'border-light': '#e4e7ec',
      },
      borderRadius: {
        'badge': '7px',
        'btn': '10px',
        'card': '12px',
        'md': '7px',
        'lg': '10px',
        'xl': '12px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'soft': '0 4px 16px -2px rgba(28, 40, 64, 0.08), 0 1px 3px 0 rgba(28, 40, 64, 0.04)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'attio': '0 4px 16px -2px rgba(28, 40, 64, 0.08), 0 1px 3px 0 rgba(28, 40, 64, 0.04)',
        'attio-subtle': '0 2px 4px -1px rgba(28, 40, 64, 0.06), 0 1px 2px 0 rgba(28, 40, 64, 0.04)',
        'attio-elevated': '0 12px 30px -4px rgba(28, 40, 64, 0.12), 0 4px 8px -2px rgba(28, 40, 64, 0.04)',
        'glow': '0 0 15px rgba(38, 109, 240, 0.35)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
