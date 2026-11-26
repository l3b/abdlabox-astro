
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://abdla.box',
  server: {
    port: 4321
  },
  i18n: {
    defaultLocale: 'ar',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false
    },
    redirectToDefaultLocale: false
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  integrations: [
    icon({
      include: {
        mdi: ['*'],
        'simple-icons': ['*']
      }
    }),
    sitemap({
      filter: (page) => !page.includes('/coach'),
      i18n: {
        defaultLocale: 'ar',
        locales: {
          ar: 'ar-SA',
          en: 'en-US',
        },
      },
    }),
  ]
});
