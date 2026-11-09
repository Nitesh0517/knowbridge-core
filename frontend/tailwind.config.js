/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070d1e',
          900: '#0f172a',
          850: '#131e3a',
          800: '#172554', // Brand Deep Navy
          700: '#1e3a8a',
          600: '#1d4ed8',
        },
        royal: {
          500: '#2563eb', // Brand Royal Blue
          600: '#1d4ed8',
          700: '#1e40af',
        },
        cyanBrand: {
          400: '#22d3ee',
          500: '#06b6d4', // Brand Accent Cyan
          600: '#0891b2',
        },
        violetBrand: {
          500: '#8b5cf6',
          600: '#7c3aed', // Brand Secondary Accent Violet
          700: '#6d28d9',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F1F5F9',
        },
        brandText: {
          primary: '#172033',
          secondary: '#475569',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)',
        'soft-md': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'soft-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.25)',
        'glow-royal': '0 0 25px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
