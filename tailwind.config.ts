import type { Config } from 'tailwindcss';

function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt);
}

const config: Config = {
  content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#4a4a4a',
          100: '#3c3c3c',
          200: '#323232',
          300: '#2d2d2d',
          400: '#222222',
          500: '#1f1f1f',
          600: '#1c1c1e',
          700: '#1b1b1b',
          800: '#181818',
          900: '#0f0f0f'
        }
      }
    }
  },
  plugins: [],
  safelist: [...range(7).map(i => `row-start-${i}`)]
};

export default config;
