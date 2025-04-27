// tailwind.config.cjs

console.log("--- Loading Tailwind Config ---");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        colors: {
          // Your "Electric Dunes" Palette
          // 'electric-blue': '#247BA0', // Dominant --old
          'electric-blue': '#007BC5', // Dominant -- new
          'neon-yellow': '#FFE600',   // Accents
          // 'lavender': '#9B5DE5',      // Secondary accent -- old
          // 'teal': '#4ED4C9',          // Additional accents -- old
          'lavender': '#8F5CCC',      // Secondary accent
          'teal': '#46C3B8',          // Additional accents
          // You can add more custom colors or override defaults here
          'cool-light-gray': '#F5F8FA', // New Neutral
          'soft-charcoal': '#1E2430',   // New Neutral
          'coral': '#FF6961',          // New Extra Accent
          'lime': '#CCFF66',           // New Extra Accent
        },
        fontFamily: {
          // Define 'sans' as your primary English font (Poppins)
          sans: ['Poppins', 'sans-serif'],
          // Define 'arabic' as your primary Arabic font (Tajawal)
          arabic: ['Tajawal', 'sans-serif'],
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography')
      // require('@tailwindcss/line-clamp')
    ],
  }