/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#007BC5',
        'neon-yellow': '#FFE600',
        'lavender': '#8F5CCC',
        'teal': '#46C3B8',
        'cool-light-gray': '#F5F8FA',
        'soft-charcoal': '#1E2430',
        'coral': '#FF6961',
        'lime': '#CCFF66',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}