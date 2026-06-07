import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e63946',
          dark: '#c1121f',
          light: '#ff6b6b',
        },
        dark: {
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a24',
          700: '#222230',
          600: '#2a2a3a',
          500: '#333348',
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
