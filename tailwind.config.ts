import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { ink: '#05070f', cyan: { glow: '#22d3ee' }, violet: { glow: '#8b5cf6' }, amber: { glow: '#f59e0b' } },
    fontFamily: { display: ['var(--font-display)', 'sans-serif'], sans: ['var(--font-inter)', 'sans-serif'] },
  } },
  plugins: [],
};
export default config;
