import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c9a84c',
          dark: '#a8882c',
          light: '#d4b96e',
        },
        dark: {
          900: '#0d0d1a',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#1e2d4a',
          500: '#2a3a5c',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
