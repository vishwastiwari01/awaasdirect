import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                forest: '#1B4332',
                'forest-mid': '#2D6A4F',
                'forest-light': '#52B788',
                'forest-pale': '#D8F3DC',
                amber: '#E07B39',
                'amber-light': '#F4A261',
                sand: '#C9A96E',
                'sand-light': '#F0E6D3',
                cream: '#F7F3ED',
                'warm-white': '#FDFAF6',
                charcoal: '#1A1A1A',
                dark: '#0D0D0D',
                muted: '#6B6B6B',
                border: '#E8E0D5',
            },
            fontFamily: {
                sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
                playfair: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
                serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
                mono: ['"DM Mono"', 'monospace'],
            },
            boxShadow: {
                card: '0 4px 32px rgba(0,0,0,0.08)',
                'card-hover': '0 16px 48px rgba(0,0,0,0.14)',
                amber: '0 8px 24px rgba(224,123,57,0.3)',
                forest: '0 8px 24px rgba(27,67,50,0.4)',
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                'float-d': 'float 5s ease-in-out infinite',
                pulse2: 'pulse2 2s infinite',
                fadeInUp: 'fadeInUp 0.6s ease forwards',
            },
            keyframes: {
                float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
                pulse2: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.5', transform: 'scale(0.8)' } },
                fadeInUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
            },
        },
    },
    plugins: [],
};
export default config;
