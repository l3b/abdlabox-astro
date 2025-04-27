
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    strictPort: true,
    hmr: {
      clientPort: 443,
      port: 4321
    }
  }
});
