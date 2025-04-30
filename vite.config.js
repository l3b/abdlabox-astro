
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      host: "f8bcf973-494c-455a-995f-846331ae66de-00-uyvd18bso6i1.pike.replit.dev"
    },
    watch: {
      usePolling: true
    },
    allowedHosts: ["f8bcf973-494c-455a-995f-846331ae66de-00-uyvd18bso6i1.pike.replit.dev"]
  }
});
