import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        s0: '#0B0B0D',
        s1: '#111114',
        s2: '#16161B',
        s3: '#1D1D23',
        // Lines
        ln:  '#26262C',
        ln2: '#34343C',
        lns: '#5A5A66',
        // Foreground
        f0: '#EDEDEC',
        f1: '#B6B6B2',
        f2: '#7E7E7B',
        f3: '#4E4E4B',
        fi: '#0B0B0D',
        // Accents
        mint:  '#7CFFB2',
        amber: '#F0C674',
        rose:  '#F26B6B',
        sky:   '#8BB4FF',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      maxWidth: {
        container: '1240px',
      },
      borderRadius: {
        none: '0',
        sm:   '2px',
        DEFAULT: '4px',
        md:   '4px',
        lg:   '6px',
        pill: '999px',
      },
      transitionTimingFunction: {
        base: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink:   'blink 1s steps(1) infinite',
        fadeIn:  'fadeIn 0.4s cubic-bezier(0.2,0,0,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
