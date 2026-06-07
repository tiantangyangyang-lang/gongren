import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#e63946', dark: '#c1121f', light: '#ff6b6b' },
        gold: { DEFAULT: '#ffd700', dark: '#c9a84c', light: '#ffed4a' },
        red: {
          50: '#fff5f5', 100: '#ffe0e0', 200: '#ffb3b3', 300: '#ff8080',
          400: '#ff4d4d', 500: '#e63946', 600: '#c1121f', 700: '#9b0010',
          800: '#6d0008', 900: '#3d0000', 950: '#1a0000',
        },
      },
      fontFamily: { sans: ['system-ui', '-apple-system', 'sans-serif'] },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-red': 'pulseRed 3s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseRed: { '0%,100%': { boxShadow: '0 0 20px rgba(230,57,70,0.3)' }, '50%': { boxShadow: '0 0 60px rgba(230,57,70,0.6)' } },
        drift: { '0%': { transform: 'translateX(0) translateY(0)' }, '50%': { transform: 'translateX(30px) translateY(-20px)' }, '100%': { transform: 'translateX(0) translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
