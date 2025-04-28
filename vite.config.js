
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      clientPort: 5000
    },
    allowedHosts: [
      ".replit.dev",
      "0.0.0.0",
      "localhost",
      ".repl.co"
    ]
  }
});
