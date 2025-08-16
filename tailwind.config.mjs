/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'electric-blue': '#0EA5E9',
        'electric-blue-dark': '#0284C7',
        'electric-blue-light': '#38BDF8',
        'neon-yellow': '#FFE600',
        'neon-yellow-dark': '#FACC15',
        'neon-yellow-light': '#FEF3C7',
        
        // Secondary/Category Colors
        'lavender': '#A78BFA',
        'teal': '#14B8A6',
        'lime': '#84CC16',
        'coral': '#FB7185',
        'slate-accent': '#475569',
        
        // Neutrals (keeping existing for compatibility)
        'cool-light-gray': '#FAFAFA',
        'soft-charcoal': '#0A0A0A',
        
        // Additional neutrals
        'surface': '#FFFFFF',
        'dark-surface': '#18181B',
        'border-light': '#E2E8F0',
        'border-dark': '#27272A',
      },
      fontFamily: {
        // English fonts
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        // Arabic fonts for headings/display
        'arabic-display': ['Year of Camel', 'AlNaseeb', 'Tajawal', 'sans-serif'],
        // Arabic fonts for body text
        'arabic-body': ['IBM Plex Sans Arabic', 'Readex Pro', 'Tajawal', 'sans-serif'],
        // Legacy arabic (for compatibility)
        arabic: ['Year of Camel', 'IBM Plex Sans Arabic', 'Readex Pro', 'Tajawal', 'sans-serif'],
        // Monospace for code
        mono: ['JetBrains Mono', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Custom Arabic-optimized sizes
        'display': ['4.5rem', { lineHeight: '1.1' }],
        'display-ar': ['5rem', { lineHeight: '1.1' }],
        'h1': ['3rem', { lineHeight: '1.2' }],
        'h1-ar': ['3.375rem', { lineHeight: '1.2' }],
        'h2': ['2.25rem', { lineHeight: '1.3' }],
        'h2-ar': ['2.5rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-lg-ar': ['1.25rem', { lineHeight: '1.7' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-yellow': '0 0 20px rgba(255, 230, 0, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}