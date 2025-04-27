import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000
  },
  vite: {
    server: {
      hmr: {
        clientPort: 5000,
        host: 'f8bcf973-494c-455a-995f-846331ae66de-00-uyvd18bso6i1.pike.replit.dev'
      }
    }
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