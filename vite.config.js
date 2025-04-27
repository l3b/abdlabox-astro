
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    strictPort: true,
    hmr: {
      clientPort: 443,
      port: 4321
    },
    allowedHosts: ['f8bcf973-494c-455a-995f-846331ae66de-00-uyvd18bso6i1.pike.replit.dev', '.replit.dev']
  }
});
