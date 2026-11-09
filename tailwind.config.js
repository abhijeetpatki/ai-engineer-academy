/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FAF7F2',
          200: '#F5EBE6',
          300: '#EAD8CF',
        },
        rose: {
          blush: '#E8A598',
          dusty: '#D48C84',
          berry: '#9E4758',
          deep: '#7D3543',
          soft: '#FDF6F4',
        },
        slate: {
          charcoal: '#1E293B',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'editorial': '0 10px 30px -10px rgba(158, 71, 88, 0.08), 0 4px 12px -2px rgba(30, 41, 59, 0.04)',
        'editorial-lg': '0 20px 40px -15px rgba(158, 71, 88, 0.14), 0 8px 20px -4px rgba(30, 41, 59, 0.06)',
      }
    },
  },
  plugins: [],
};
