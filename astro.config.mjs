// astro.config.mjs
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

// import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Add other integrations or config options if you have them

  i18n: {
    // The default language code for your site
    defaultLocale: 'ar',
    // A list of all supported language codes
    locales: ['en', 'ar'],
    routing: {
      // Optional: Prevent the default locale ('en') prefix from appearing in URLs
      // Set to true if you want URLs like /about instead of /en/about
      // Set to false (or omit) if you want all URLs prefixed, like /en/about, /ar/about
      // For clarity in multilingual sites, keeping prefixes is often good:
      prefixDefaultLocale: true 
    }
  },

  // Add or modify the markdown section
  //   vite: {
  //     // plugins: [tailwindcss()]
  //   }
  markdown: {
    shikiConfig: {
      // Choose a Shiki theme name from https://shiki.style/themes
      // Or add your own custom theme object.
      theme: 'github-dark', // <--- Specify the theme here
      wrap: true, // Optional: adds word wrapping
    },
  },

  integrations: [icon()]
});