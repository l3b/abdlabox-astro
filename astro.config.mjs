
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000
  },
  i18n: {
    defaultLocale: 'ar',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: true
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  integrations: [icon()]
});
